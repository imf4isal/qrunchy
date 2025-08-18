// src/pages/photomenu/QRCodeGenerator.tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, Check, Loader2, ArrowRight } from "lucide-react";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { trpc } from "@/utils/trpc";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useAuth } from "@/contexts/AuthContext";
import OTPVerification from "@/components/OTPVerification";
import type { UploadedImage } from "./ImageUploader";

interface QRCodeGeneratorProps {
  images: UploadedImage[];
  restaurantId: number;
  restaurantName: string;
  selectedChain: number | null;
  onQrGenerated?: (restaurantId: number) => void;
}

const QRCodeGenerator = ({ 
  images, 
  restaurantId, 
  restaurantName, 
  selectedChain, 
  onQrGenerated 
}: QRCodeGeneratorProps) => {
  const { setCurrentRestaurant } = useRestaurant();
  const { user, addRestaurant, isAuthenticated, login } = useAuth();
  const [, setLocation] = useLocation();
  
  const [qrGenerated, setQrGenerated] = useState(false);
  const [showForm, setShowForm] = useState(!isAuthenticated);
  const [formData, setFormData] = useState({
    phoneNumber: user?.mobile_number || "",
    address: "",
  });
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<number>(restaurantId);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showPasswordAuth, setShowPasswordAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false);

  // Update mobile number when user data changes
  useEffect(() => {
    if (user?.mobile_number) {
      setFormData(prev => ({ ...prev, phoneNumber: user.mobile_number }));
    }
  }, [user]);

  // TRPC mutations
  const createRestaurantMutation = trpc.restaurant.create.useMutation();
  const createMultiplePhotoMenusMutation = trpc.photoMenu.createMultiple.useMutation();
  const generateQrMutation = trpc.photoMenu.generateQr.useMutation();
  const checkUserExistsMutation = trpc.auth.login.useMutation();
  const verifyOTPMutation = trpc.auth.verifyOTP.useMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleGenerateQR = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const mobileNumber = isAuthenticated ? (user?.mobile_number || "") : formData.phoneNumber.trim();
    
    // Validate restaurant name
    if (!restaurantName || !restaurantName.trim()) {
      setError("Please provide a restaurant name to continue");
      return;
    }
    
    if (!isAuthenticated && !mobileNumber) {
      setError("Please provide your mobile number to continue");
      return;
    }

    // Check if user already exists or is logged in
    if (!isAuthenticated || !user) {
      try {
        // Check if user already exists
        await checkUserExistsMutation.mutateAsync({ mobile_number: mobileNumber });
        // If we get here, user exists - show password/OTP options
        setUserExists(true);
        setShowPasswordAuth(true);
        return;
      } catch (error) {
        // User doesn't exist, need OTP verification for new registration
        setUserExists(false);
        setShowOTPVerification(true);
        return;
      }
    }

    // Continue with restaurant creation if already authenticated
    await proceedWithRestaurantCreation();
  };

  const proceedWithRestaurantCreation = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const mobileNumber = isAuthenticated ? (user?.mobile_number || "") : formData.phoneNumber.trim();
      
      console.log('🚀 Starting photomenu restaurant creation process:', {
        restaurantName: restaurantName,
        restaurantNameLength: restaurantName.length,
        restaurantNameTrimmed: restaurantName.trim(),
        restaurantId,
        selectedChain,
        imagesCount: images.length,
        mobileNumber,
        isAuthenticated,
        userId: user?.id
      });

      let currentUser = user;
      let finalRestaurantId = createdRestaurantId;

      // Step 1: Get current user (should already exist after OTP/password verification)
      if (!isAuthenticated || !user) {
        console.log('⚠️ User should be authenticated by now, but checking anyway...');
        // User should already be created by OTP verification with auto_create_user
        // If not authenticated, there might be an issue
        throw new Error('User not authenticated. Please try the verification process again.');
      } else {
        console.log('👤 Using authenticated user for photomenu:', currentUser);
      }

      // Step 2: Create restaurant if needed (restaurantId === 0 means new restaurant)
      if (finalRestaurantId === 0) {
        const restaurant = await createRestaurantMutation.mutateAsync({
          name: restaurantName.trim(), // Ensure we trim the name
          mobile: mobileNumber,
          address: (!isAuthenticated && formData.address) ? formData.address : "Not specified",
          user_id: currentUser!.id,
          theme_id: "minimal", // Default theme for photomenu
          group_res_id: selectedChain ?? undefined,
        });

        console.log('🏪 Restaurant created for photomenu:', restaurant);
        finalRestaurantId = restaurant.id;
        setCreatedRestaurantId(finalRestaurantId);

        // Update restaurant context
        setCurrentRestaurant({
          id: restaurant.id,
          name: restaurant.name,
          mobile: restaurant.mobile,
          address: restaurant.address,
        });

        // Add restaurant to auth context
        addRestaurant({
          id: restaurant.id,
          name: restaurant.name,
          mobile: restaurant.mobile,
          address: restaurant.address,
          theme_id: restaurant.theme_id,
          group_res_id: restaurant.group_res_id,
          chain_name: null,
          chain_type: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Step 3: Upload images to server and create photo menu entries
      if (images.length > 0) {
        // First upload images to server
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('images', image.file);
        });

        const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/upload/photomenu`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success && uploadResult.files) {
          // Create photo menu entries in database
          const imageUrls = uploadResult.files.map((file: any) => file.url);
          await createMultiplePhotoMenusMutation.mutateAsync({
            restaurant_id: finalRestaurantId,
            image_urls: imageUrls,
          });
          console.log('📸 Photo menu entries created:', imageUrls.length);
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Step 4: Generate QR code
      const qrResult = await generateQrMutation.mutateAsync({
        restaurant_id: finalRestaurantId,
        setup_type: "self",
      });

      console.log('✅ Photomenu QR generated successfully:', qrResult);

      setQrData(qrResult);
      setQrGenerated(true);
      setShowForm(false);

      // Call parent callback with restaurant ID
      if (onQrGenerated) {
        onQrGenerated(finalRestaurantId);
      }

      // Log the user in only if they weren't already authenticated
      // This will also refresh the restaurants list from the server
      if (!isAuthenticated || !user) {
        await login(mobileNumber);
      }

      // Clear draft only after successful restaurant creation
      localStorage.removeItem('qrunchy_photomenu_draft');
      console.log('🧹 Cleared photomenu draft after successful restaurant creation');

      // Reset generating state
      setIsGenerating(false);

      // No auto-redirection - let user decide when to leave

    } catch (error) {
      console.error('❌ Photomenu QR generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
      setIsGenerating(false);
    }
  };

  const handlePasswordAuth = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setError("");
      setIsGenerating(true);
      
      // Check if it's the master password (654321)
      if (password.trim() === "654321") {
        // Use OTP verification endpoint with master password and auto-creation
        const result = await verifyOTPMutation.mutateAsync({
          mobile_number: formData.phoneNumber.trim(),
          otp_code: password.trim(),
          auto_create_user: true,
        });
        
        console.log('🔑 Master password verification successful, restaurant name before proceeding:', restaurantName);
        console.log('📦 User data from master password verification:', result.user);
        
        // Auto-login the user after successful master password verification
        await login(formData.phoneNumber.trim());
        
        setShowPasswordAuth(false);
        await proceedWithRestaurantCreation();
      } else {
        // Attempt login with regular password
        await checkUserExistsMutation.mutateAsync({ 
          mobile_number: formData.phoneNumber.trim(),
          password: password.trim()
        });
        
        console.log('🔑 Password authentication successful, restaurant name before proceeding:', restaurantName);
        
        // Auto-login the user after successful password authentication
        await login(formData.phoneNumber.trim());
        
        setShowPasswordAuth(false);
        await proceedWithRestaurantCreation();
      }
    } catch (error) {
      setError("Invalid password. Please try again or use OTP verification.");
      setIsGenerating(false);
    }
  };

  const handleUseOTP = () => {
    setShowPasswordAuth(false);
    setShowOTPVerification(true);
  };

  const handleOTPVerificationSuccess = async (user?: any) => {
    setShowOTPVerification(false);
    
    console.log('🔐 OTP verification successful, restaurant name before proceeding:', restaurantName);
    console.log('📦 User data from OTP verification:', user);
    
    // Auto-login the user after successful OTP verification
    await login(formData.phoneNumber.trim());
    
    // Don't clear draft here - only clear after successful restaurant creation
    // localStorage.removeItem('qrunchy_photomenu_draft');
    
    // Proceed with restaurant creation
    await proceedWithRestaurantCreation();
  };

  const handleCancelAuth = () => {
    setShowPasswordAuth(false);
    setShowOTPVerification(false);
    setUserExists(false);
    setPassword("");
    setError("");
  };

  const handleCopyLink = () => {
    if (qrData?.menu_url) {
      navigator.clipboard.writeText(qrData.menu_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = async () => {
    if (qrData?.menu_url) {
      try {
        const canvas = document.createElement('canvas');
        await import('qrcode').then(QRCode => {
          QRCode.default.toCanvas(canvas, qrData.menu_url, {
            width: 400,
            margin: 2,
          });
        });
        
        const link = document.createElement('a');
        link.download = `qr-code-${qrData.qr_code}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error downloading QR code:', error);
      }
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Generate QR Code</h2>
      <p className="text-gray-600 mb-6">
        Your photo menu is ready! {isAuthenticated ? 'Click the button below to generate your QR code.' : 'Please provide your phone number to continue.'}
      </p>

      {!qrGenerated ? (
        <>
          {/* Password Authentication Modal */}
          {showPasswordAuth && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Account Verification
                  </h2>
                  <p className="text-gray-600 text-sm">
                    This number is already registered with{" "}
                    <span className="font-medium">{formData.phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your password"
                      disabled={isGenerating}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={handlePasswordAuth}
                      disabled={isGenerating || !password.trim()}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Continue with Password"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleUseOTP}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      Use OTP Verification Instead
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleCancelAuth}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showForm && (
            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Restaurant Details</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Restaurant:</span>
                <span className="ml-2 font-medium">{restaurantName}</span>
              </div>
              <form onSubmit={handleGenerateQR}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mobile Number
                      {isAuthenticated && (
                        <span className="text-green-600 text-xs ml-2 font-normal">
                          ✓ From your account
                        </span>
                      )}
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
                        isAuthenticated ? 'bg-green-50 border-green-200' : ''
                      }`}
                      placeholder="e.g. +880 1712-345678"
                      disabled={isGenerating || isAuthenticated}
                      readOnly={isAuthenticated}
                    />
                    {isAuthenticated && (
                      <p className="text-xs text-green-600 mt-1">
                        Using mobile number from your logged-in account
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="e.g. 123 Main Street, City"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Restaurant & Uploading Images...
                      </>
                    ) : (
                      'Generate QR Code'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}


          {!showForm && isAuthenticated && (
            <div className="text-center">
              <Button onClick={handleGenerateQR} className="w-full max-w-md" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Restaurant & Uploading Images...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="p-6 border rounded-xl bg-white shadow-sm mb-4">
            <QRCodeDisplay 
              value={qrData?.menu_url || ''} 
              size={200}
              className="rounded-lg"
            />
          </div>

          <p className="text-lg font-medium mb-2">Your QR Code is Ready!</p>
          <p className="text-sm text-gray-600 text-center max-w-md mb-2">
            Scan this QR code to view your photo menu. Customers can view your menu by scanning this code.
          </p>
          
          {qrData && (
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500 mb-1">QR Code: {qrData.qr_code}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownloadQR}
            >
              <Download size={16} />
              Download QR
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopyLink}
              disabled={!qrData?.menu_url}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button 
              className="flex items-center gap-2"
              onClick={() => qrData?.menu_url && window.open(qrData.menu_url, '_blank')}
              disabled={!qrData?.menu_url}
            >
              <QrCode size={16} />
              View Menu
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OTPVerification
        mobileNumber={formData.phoneNumber}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onCancel={handleCancelAuth}
        isOpen={showOTPVerification}
        autoCreateUser={true}
      />
    </div>
  );
};

export default QRCodeGenerator;
