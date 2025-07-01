import { useState } from "react";
import { QrCode, Download, Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRestaurant } from "@/contexts/RestaurantContext";
import type { DigitalMenu } from "@/types/digitalMenu";

interface QRGeneratorProps {
  menu: DigitalMenu;
  restaurantId?: number;
  onQrGenerated?: () => void;
}

export default function QRGenerator({ menu, onQrGenerated }: QRGeneratorProps) {
  const { setCurrentRestaurant } = useRestaurant();
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdRestaurantId, setCreatedRestaurantId] = useState<number | null>(null);

  // TRPC mutations
  const createUserMutation = trpc.user.create.useMutation();
  const createRestaurantMutation = trpc.restaurant.create.useMutation();
  const bulkImportMutation = trpc.digitalMenu.menu.bulkImport.useMutation();
  const generateQRMutation = trpc.digitalMenu.qr.generate.useMutation();

  const handleGenerateQR = async () => {
    if (!mobileNumber.trim()) {
      alert("Please provide your mobile number to continue");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Step 1: Create user with mobile number
      const user = await createUserMutation.mutateAsync({
        mobile_number: mobileNumber.trim(),
      });

      // Step 2: Create restaurant with user_id
      const restaurant = await createRestaurantMutation.mutateAsync({
        name: menu.restaurantName,
        mobile: mobileNumber.trim(),
        address: "Not specified", // Can be updated later
        user_id: user.id,
      });

      setCreatedRestaurantId(restaurant.id);

      // Update restaurant context
      setCurrentRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        mobile: restaurant.mobile,
        address: restaurant.address,
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
                Ready to share it with customers? Just need your mobile number to create your account and generate your QR code.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="e.g. +1 (555) 123-4567"
                  disabled={isGenerating}
                />
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
                    Creating Account & Generating QR...
                  </>
                ) : (
                  <>
                    <QrCode size={20} className="mr-2" />
                    Create Account & Generate QR Code
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to create a Qrunchy account. No spam, just menu management! 📱
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

          <div className="flex flex-wrap gap-3 justify-center">
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Q
                </div>
              </div>
              <div>
                <p className="text-blue-800 font-medium mb-1">
                  Next Steps with Qrunchy:
                </p>
                <p className="text-blue-700">
                  Print this QR code and place it on your tables, menu boards,
                  or anywhere customers can easily scan it. You can manage your
                  menu anytime from your Qrunchy dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
