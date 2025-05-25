import { AlertCircle } from "lucide-react";
import QrunchyFooter from "./QrunchyFooter";

interface ErrorScreenProps {
  onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: ErrorScreenProps) {
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
              onClick={onRetry}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>

            <div className="text-sm text-gray-500">
              <p>
                If the problem persists, please contact the restaurant directly.
              </p>
            </div>
          </div>
        </div>

        <QrunchyFooter />
      </div>
    </div>
  );
}
