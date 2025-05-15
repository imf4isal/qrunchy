import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, Check } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface QRCodeGeneratorProps {
  images: UploadedImage[];
}

const QRCodeGenerator = ({ images }: QRCodeGeneratorProps) => {
  const [qrType, setQrType] = useState<"self" | "assisted" | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    phoneNumber: "",
    address: "",
  });
  const [copied, setCopied] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQrTypeSelect = (type: "self" | "assisted") => {
    setQrType(type);
    if (type === "assisted") {
      setShowForm(true);
    } else {
      setShowForm(false);
      // demo
      setQrGenerated(true);
    }
  };

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    setQrGenerated(true);
    setShowForm(false);
  };

  const handleCopyLink = () => {
    // copy the actual qr
    navigator.clipboard.writeText("https://qrunchy.com/menu/sample-qr-code");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Generate QR Code</h2>
      <p className="text-gray-600 mb-6">
        Your menu is ready! Now choose how you'd like to generate your QR code.
      </p>

      {!qrGenerated ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                qrType === "self"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleQrTypeSelect("self")}
            >
              <h3 className="text-lg font-medium mb-2">Self-Serve QR</h3>
              <p className="text-sm text-gray-600">
                Generate a QR code instantly that you can use right away. You'll
                need to create an account within 7 days to keep it active.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                qrType === "assisted"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleQrTypeSelect("assisted")}
            >
              <h3 className="text-lg font-medium mb-2">Assisted Setup</h3>
              <p className="text-sm text-gray-600">
                We'll set up your QR code for you and send you login credentials
                via SMS.
              </p>
            </div>
          </div>

          {showForm && (
            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Restaurant Details</h3>
              <form onSubmit={handleGenerateQR}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="restaurantName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

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

                  <Button type="submit" className="w-full">
                    Generate QR Code
                  </Button>
                </div>
              </form>
            </div>
          )}

          {qrType === "self" && (
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setQrGenerated(true)}>
                Generate QR Code
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="p-6 border rounded-xl bg-white shadow-sm mb-4 w-64 h-64 flex items-center justify-center">
            <QrCode size={180} />
          </div>

          <p className="text-lg font-medium mb-2">Your QR Code is Ready!</p>
          <p className="text-sm text-gray-600 text-center max-w-md mb-6">
            {qrType === "self"
              ? "Scan this QR code to view your menu. Remember to create an account within 7 days to keep it active."
              : "Your QR code has been generated and your account details will be sent to your phone."}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Download QR
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button className="flex items-center gap-2">
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
