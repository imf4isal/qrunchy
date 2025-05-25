import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { dummyQrData } from "@/data/dummyData";
import CustomerMenuViewer from "./CustomerMenuViewer";

interface MenuHandlerProps {
  qrCode: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

interface QrCodeData {
  id: string;
  type: "digital" | "photo";
  status: "available" | "used" | "expired";
  restaurant: Restaurant | null;
  expiresAt: string | null;
  isActive: boolean;
  needsActivation?: boolean;
}

export default function MenuHandler({ qrCode }: MenuHandlerProps) {
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<QrCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const data = dummyQrData[qrCode as keyof typeof dummyQrData];

        if (!data) {
          throw new Error("QR code not found");
        }

        setQrData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQrData();
  }, [qrCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="animate-spin text-orange-500" size={24} />
            <span className="text-lg text-gray-700">Loading menu...</span>
          </div>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch your menu
          </p>
        </div>
      </div>
    );
  }

  // Error state - QR not found
  if (error || !qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="text-red-500" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Menu Not Found
          </h1>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 mb-6">
            <p className="text-gray-600 mb-4">
              This QR code doesn't exist or may have been removed.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>

              <div className="text-sm text-gray-500">
                <p>
                  If the problem persists, please contact the restaurant
                  directly.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center text-xs text-gray-400">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            <span>Powered by Qrunchy</span>
          </div>
        </div>
      </div>
    );
  }

  if (qrData.status === "expired" || !qrData.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Clock className="text-amber-500" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            QR Code Expired
          </h1>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-6">
            <p className="text-gray-600 mb-4">
              This QR code has expired and is no longer active.
            </p>

            {qrData.restaurant && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  {qrData.restaurant.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {qrData.restaurant.address}
                </p>
                <p className="text-sm text-gray-600">
                  {qrData.restaurant.phone}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Please contact the restaurant for an updated QR code.
            </p>
          </div>

          <div className="flex items-center justify-center text-xs text-gray-400">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            <span>Powered by Qrunchy</span>
          </div>
        </div>
      </div>
    );
  }

  if (qrData.needsActivation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Menu Not Activated
          </h1>

          <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <p className="text-gray-600 mb-4">
              This QR code was created but hasn't been activated yet.
            </p>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Restaurant Owner?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                If you created this QR code, please create an account to
                activate your digital menu.
              </p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Activate Menu
              </button>
            </div>

            {qrData.expiresAt && (
              <p className="text-sm text-gray-500">
                Expires in{" "}
                {Math.ceil(
                  (new Date(qrData.expiresAt).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            )}
          </div>

          <div className="flex items-center justify-center text-xs text-gray-400">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            <span>Powered by Qrunchy</span>
          </div>
        </div>
      </div>
    );
  }

  if (qrData.type === "digital") {
    return <CustomerMenuViewer qrCode={qrCode} />;
  }

  if (qrData.type === "photo") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Photo Menu Viewer
          </h1>
          <p className="text-gray-600 mb-6">Coming Soon - QR Code: {qrCode}</p>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-600">
              This will display the photo menu carousel when implemented.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
