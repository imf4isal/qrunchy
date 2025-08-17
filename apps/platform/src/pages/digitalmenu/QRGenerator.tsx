import { useState, useEffect } from "react";
import { Link } from "wouter";
import { QrCode, Download, Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useAuth } from "@/contexts/AuthContext";
import OTPVerification from "@/components/OTPVerification";
import type { DigitalMenu } from "@/types/digitalMenu";

interface QRGeneratorProps {
  menu: DigitalMenu;
  restaurantId?: number;
  selectedTheme?: "minimal" | "modern";
  selectedChain?: number | null;
  onQrGenerated?: () => void;
}

export default function QRGenerator({ menu, selectedTheme = "minimal", selectedChain = null, onQrGenerated }: QRGeneratorProps) {
  const { setCurrentRestaurant, clearRestaurant } = useRestaurant();
  const { user, addRestaurant, login, isAuthenticated } = useAuth();
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(user?.mobile_number || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<number | null>(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  // Update mobile number when user data changes
  useEffect(() => {
    if (user?.mobile_number) {
      setMobileNumber(user.mobile_number);
    }
  }, [user]);

  // TRPC mutations
  const createUserMutation = trpc.user.create.useMutation();
  const createRestaurantMutation = trpc.restaurant.create.useMutation();
  const bulkImportMutation = trpc.digitalMenu.menu.bulkImport.useMutation();
  const generateQRMutation = trpc.digitalMenu.qr.generate.useMutation();
  const checkUserExistsMutation = trpc.auth.login.useMutation();

  const handleGenerateQR = async () => {
    if (!mobileNumber.trim()) {
      alert("Please provide your mobile number to continue");
      return;
    }

    // Check if user already exists or is logged in
    if (!isAuthenticated || !user) {
      try {
        // Check if user already exists
        await checkUserExistsMutation.mutateAsync({ mobile_number: mobileNumber.trim() });
        // If we get here, user exists - they should login instead
        alert("This mobile number is already registered. Please login instead.");
        return;
      } catch (error) {
        // User doesn't exist, need OTP verification for new registration
        setNeedsVerification(true);
        setShowOTPVerification(true);
        return;
      }
    }

    // Continue with restaurant creation if already authenticated
    await proceedWithRestaurantCreation();
  };

  const proceedWithRestaurantCreation = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting restaurant creation process:', {
        restaurantName: menu.restaurantName,
        selectedTheme: selectedTheme,
        mobileNumber: mobileNumber.trim(),
        isAuthenticated: isAuthenticated,
        userId: user?.id
      });

      let currentUser = user;

      // Step 1: Create user only if not already logged in
      if (!isAuthenticated || !user) {
        currentUser = await createUserMutation.mutateAsync({
          mobile_number: mobileNumber.trim(),
          is_verified: true, // Mark as verified since OTP was verified
        });
        console.log('👤 New user created:', currentUser);
      } else {
        console.log('👤 Using existing logged-in user:', currentUser);
      }

      // Step 2: Create restaurant with user_id and theme
      const restaurant = await createRestaurantMutation.mutateAsync({
        name: menu.restaurantName,
        mobile: mobileNumber.trim(),
        address: "Not specified", // Can be updated later
        user_id: currentUser!.id,
        theme_id: selectedTheme,
        group_res_id: selectedChain ?? undefined,
      });

      console.log('🏪 Restaurant created:', restaurant);

      setCreatedRestaurantId(restaurant.id);

      // Update restaurant context
      setCurrentRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        mobile: restaurant.mobile,
        address: restaurant.address,
      });

      // Add restaurant to auth context immediately
      addRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        mobile: restaurant.mobile,
        address: restaurant.address,
        theme_id: restaurant.theme_id,
        group_res_id: restaurant.group_res_id,
        chain_name: restaurant.chain_name ?? null,
        chain_type: restaurant.chain_type ?? null,
        created_at: restaurant.created_at,
        updated_at: restaurant.updated_at,
      });

      // Step 3: Save menu data if exists
      if (menu.categories.length > 0 && menu.items.length > 0) {
        // Transform menu data to backend format
        const menuData = {
          categories: menu.categories.map(cat => ({ name: cat.name })),
          items: menu.items.map(item => ({
            name: item.name,
            price: item.price,
            description: item.description || "",
            categoryName: menu.categories.find(cat => cat.id === item.categoryId)?.name || "Uncategorized",
            image_url: item.image_url, // Include image URL in backend payload
            variants: item.variants.map(variant => ({
              title: variant.title,
              options: variant.options.map(option => ({
                name: option.name,
                price: option.price,
              })),
            })),
            addons: item.addons.map(addon => ({
              name: addon.name,
              price: addon.price,
            })),
          })),
        };

        await bulkImportMutation.mutateAsync({
          restaurant_id: restaurant.id,
          menu_data: menuData,
          replace_existing: true,
        });
      }

      // Step 4: Generate QR code
      await generateQRMutation.mutateAsync({
        restaurant_id: restaurant.id,
        type: "digital",
        setup_type: "assisted",
        assisted_data: {
          phone_number: mobileNumber.trim(),
          address: "Not specified",
        },
      });
      
      setIsGenerated(true);
      if (onQrGenerated) {
        onQrGenerated();
      }

      // Log the user in only if they weren't already authenticated
      // This will also refresh the restaurants list from the server
      if (!isAuthenticated || !user) {
        await login(mobileNumber.trim());
      }

      // Clear restaurant data and draft for next menu creation after a short delay
      // This allows user to see the success message first
      setTimeout(() => {
        clearRestaurant();
        localStorage.removeItem('qrunchy_menu_draft');
      }, 3000);
    } catch (error) {
      console.error("Failed to generate QR:", error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("User")) {
          alert("Failed to create user account. Please try again.");
        } else if (error.message.includes("Restaurant")) {
          alert("Failed to create restaurant. Please try again.");
        } else if (error.message.includes("Menu")) {
          alert("Failed to save menu data. Please try again.");
        } else if (error.message.includes("QR")) {
          alert("Failed to generate QR code. Please try again.");
        } else {
          alert("Failed to create account and generate QR. Please try again.");
        }
      } else {
        alert("Failed to create account and generate QR. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOTPVerificationSuccess = async () => {
    setShowOTPVerification(false);
    setNeedsVerification(false);
    
    // Clear draft since registration is successful
    localStorage.removeItem('qrunchy_menu_draft');
    
    // Proceed with restaurant creation
    await proceedWithRestaurantCreation();
  };

  const handleCancelOTP = () => {
    setShowOTPVerification(false);
    setNeedsVerification(false);
  };

  const handleCopyLink = () => {
    // In a real app, this would be the actual menu URL
    const menuUrl = `https://qrunchy.com/menu/${menu.restaurantName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewMenu = () => {
    // In a real app, this would open the actual menu
    alert("This would open your live menu in a new tab");
  };

  const handleDownloadQR = () => {
    // In a real app, this would download the QR code image
    alert("QR code download would start here");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Almost There! 🚀</h2>
      <p className="text-gray-600 mb-6">
        Your digital menu is looking fantastic! Let's get it live so customers can start ordering.
      </p>

      {!isGenerated ? (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Menu Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Restaurant:</span>
                <p className="font-medium">{menu.restaurantName}</p>
              </div>
              <div>
                <span className="text-gray-600">Categories:</span>
                <p className="font-medium">{menu.categories.length}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Items:</span>
                <p className="font-medium">{menu.items.length}</p>
              </div>
              <div>
                <span className="text-gray-600">Items with Variants:</span>
                <p className="font-medium">
                  {menu.items.filter((item) => item.variants.length > 0).length}
                </p>
              </div>
            </div>
          </div>

          {/* Ready to Go Live */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 Your menu looks amazing!
              </h3>
              <p className="text-gray-600">
                {isAuthenticated 
                  ? `Ready to share it with customers? Generate your QR code to add this restaurant to your account.`
                  : `Ready to share it with customers? Just need your mobile number to create your account and generate your QR code.`
                }
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                  {isAuthenticated && (
                    <span className="text-green-600 text-xs ml-2 font-normal">
                      ✓ From your account
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
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

              <Button
                onClick={handleGenerateQR}
                disabled={!mobileNumber.trim() || isGenerating}
                className="w-full py-3 text-lg font-medium"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isAuthenticated ? "Creating Restaurant & Generating QR..." : "Creating Account & Generating QR..."}
                  </>
                ) : (
                  <>
                    <QrCode size={20} className="mr-2" />
                    {isAuthenticated ? "Add Restaurant & Generate QR Code" : "Create Account & Generate QR Code"}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {isAuthenticated 
                  ? "This restaurant will be added to your existing Qrunchy account 📱"
                  : "By continuing, you agree to create a Qrunchy account. No spam, just menu management! 📱"
                }
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* qr */
        <div className="text-center space-y-6">
          <div className="inline-block p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <QrCode size={120} className="text-gray-400" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              🎉 Your Account & QR Code are Ready!
            </h3>
            <p className="text-gray-600 mb-6">
              Welcome to Qrunchy! Your account has been created and customers can now scan this QR code to view your digital menu for{" "}
              <strong>{menu.restaurantName}</strong>
            </p>
            {createdRestaurantId && (
              <p className="text-sm text-gray-500 mb-4">
                Restaurant ID: {createdRestaurantId} • Mobile: {mobileNumber}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Button
              onClick={handleDownloadQR}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download QR
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button
              variant="outline"
              onClick={handleViewMenu}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              Preview Menu
            </Button>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Q
                </div>
              </div>
              <div>
                <p className="text-gray-800 font-medium mb-1">
                  Next Steps with Qrunchy:
                </p>
                <p className="text-gray-700">
                  Print this QR code and place it on your tables, menu boards,
                  or anywhere customers can easily scan it. You can manage your
                  menu anytime from your Qrunchy dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OTPVerification
        mobileNumber={mobileNumber}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onCancel={handleCancelOTP}
        isOpen={showOTPVerification}
      />
    </div>
  );
}
