// src/pages/photomenu/QRCodeGenerator.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, Check, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { UploadedImage } from "./ImageUploader";

interface QRCodeGeneratorProps {
  images: UploadedImage[];
  restaurantId: number;
  restaurantName: string;
  onQrGenerated?: (qrData: any) => void;
}

const QRCodeGenerator = ({ restaurantId, restaurantName, onQrGenerated }: QRCodeGeneratorProps) => {
  const [qrType, setQrType] = useState<"self" | "assisted" | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
  });
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQrMutation = trpc.photoMenu.generateQr.useMutation();

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
      // For self-serve, we'll show a button to generate QR
    }
  };

  const handleGenerateQR = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!qrType) return;

    setError(null);

    try {
      const result = await generateQrMutation.mutateAsync({
        restaurant_id: restaurantId,
        setup_type: qrType,
        assisted_data: qrType === "assisted" ? {
          phone_number: formData.phoneNumber,
          address: formData.address,
        } : undefined,
      });

      setQrData(result);
      setQrGenerated(true);
      setShowForm(false);

      // Call the parent's callback to update the step indicator
      if (onQrGenerated) {
        onQrGenerated(result);
      }
    } catch (error) {
      console.error('QR generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate QR code');
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

                  <Button type="submit" className="w-full" disabled={generateQrMutation.isPending}>
                    {generateQrMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating QR Code...
                      </>
                    ) : (
                      'Generate QR Code'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {qrType === "self" && !showForm && (
            <div className="mt-6 flex justify-center">
              <Button onClick={() => handleGenerateQR()} disabled={generateQrMutation.isPending}>
                {generateQrMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating QR Code...
                  </>
                ) : (
                  'Generate QR Code'
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
            {qrType === "self"
              ? "Scan this QR code to view your menu. Remember to create an account within 7 days to keep it active."
              : "Your QR code has been generated and your account details will be sent to your phone."}
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
