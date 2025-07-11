// src/pages/photomenu/QRCodeGenerator.tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, Check, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, addRestaurant, isAuthenticated } = useAuth();
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

  // Update mobile number when user data changes
  useEffect(() => {
    if (user?.mobile_number) {
      setFormData(prev => ({ ...prev, phoneNumber: user.mobile_number }));
    }
  }, [user]);

  // TRPC mutations
  const createUserMutation = trpc.user.create.useMutation();
  const createRestaurantMutation = trpc.restaurant.create.useMutation();
  const createMultiplePhotoMenusMutation = trpc.photoMenu.createMultiple.useMutation();
  const generateQrMutation = trpc.photoMenu.generateQr.useMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleGenerateQR = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const mobileNumber = isAuthenticated ? (user?.mobile_number || "") : formData.phoneNumber.trim();
    
    if (!isAuthenticated && !mobileNumber) {
      setError("Please provide your mobile number to continue");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('🚀 Starting photomenu restaurant creation process:', {
        restaurantName,
        restaurantId,
        selectedChain,
        imagesCount: images.length,
        mobileNumber,
        isAuthenticated,
        userId: user?.id
      });

      let currentUser = user;
      let finalRestaurantId = createdRestaurantId;

      // Step 1: Create user only if not already logged in
      if (!isAuthenticated || !user) {
        currentUser = await createUserMutation.mutateAsync({
          mobile_number: mobileNumber,
        });
        console.log('👤 New user created for photomenu:', currentUser);
      } else {
        console.log('👤 Using existing logged-in user for photomenu:', currentUser);
      }

      // Step 2: Create restaurant if needed (restaurantId === 0 means new restaurant)
      if (finalRestaurantId === 0) {
        const restaurant = await createRestaurantMutation.mutateAsync({
          name: restaurantName,
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

        const uploadResponse = await fetch('http://localhost:3000/api/upload/photomenu', {
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

      // Reset generating state
      setIsGenerating(false);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        setLocation("/dashboard");
      }, 3000);

    } catch (error) {
      console.error('❌ Photomenu QR generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (qrData?.menu_url) {
      navigator.clipboard.writeText(qrData.menu_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          <div className="p-6 border rounded-xl bg-white shadow-sm mb-4 w-64 h-64 flex items-center justify-center">
            <QrCode size={180} />
          </div>

          <p className="text-lg font-medium mb-2">Your QR Code is Ready!</p>
          <p className="text-sm text-gray-600 text-center max-w-md mb-2">
            Scan this QR code to view your photo menu. Customers can view your menu by scanning this code.
          </p>
          
          {qrData && (
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500 mb-1">QR Code: {qrData.qr_code}</p>
              {qrData.expires_at && (
                <p className="text-xs text-gray-500">
                  Expires: {new Date(qrData.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
