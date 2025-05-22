import { useState } from "react";
import { QrCode, Download, Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DigitalMenu } from "@/types/digitalMenu";

interface QRGeneratorProps {
  menu: DigitalMenu;
  onQrGenerated?: () => void;
}

export default function QRGenerator({ menu, onQrGenerated }: QRGeneratorProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authData, setAuthData] = useState({
    phoneNumber: "",
    address: "",
  });

  const handleGenerateQR = () => {
    // For now, we'll just show the generated state
    // In a real app, this would call the backend
    setIsGenerated(true);
    if (onQrGenerated) {
      onQrGenerated();
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.phoneNumber.trim() || !authData.address.trim()) {
      alert("Please fill in all fields");
      return;
    }
    handleGenerateQR();
    setShowAuthForm(false);
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
      <h2 className="text-xl font-bold mb-4">Generate QR Code</h2>
      <p className="text-gray-600 mb-6">
        Your digital menu is ready! Generate a QR code that customers can scan
        to view your menu.
      </p>

      {!isGenerated ? (
        <div className="space-y-6">
          {/* Menu Summary */}
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

          {/* Generation Options */}
          <div className="space-y-4">
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Quick Generate</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a QR code instantly. You'll need to create an account
                to keep it active.
              </p>
              <Button onClick={handleGenerateQR} className="w-full">
                <QrCode size={16} />
                Generate QR Code
              </Button>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Generate with Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide your details to create an account and activate your QR
                code immediately.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowAuthForm(true)}
                className="w-full"
              >
                Setup Account & Generate
              </Button>
            </div>
          </div>

          {/* Account Form Modal */}
          {showAuthForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Account Setup</h3>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={authData.phoneNumber}
                      onChange={(e) =>
                        setAuthData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Address *
                    </label>
                    <textarea
                      required
                      value={authData.address}
                      onChange={(e) =>
                        setAuthData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter your restaurant address"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAuthForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Account & Generate QR
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Generated QR Code */
        <div className="text-center space-y-6">
          <div className="inline-block p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <QrCode size={120} className="text-gray-400" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              🎉 Your QR Code is Ready!
            </h3>
            <p className="text-gray-600 mb-6">
              Customers can scan this code to view your digital menu for{" "}
              <strong>{menu.restaurantName}</strong>
            </p>
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
