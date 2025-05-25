import { Clock } from "lucide-react";
import QrunchyFooter from "./QrunchyFooter";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

interface ExpiredScreenProps {
  restaurant: Restaurant | null;
}

export default function ExpiredScreen({ restaurant }: ExpiredScreenProps) {
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

          {restaurant && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
              <p className="text-sm text-gray-600">{restaurant.phone}</p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Please contact the restaurant for an updated QR code.
          </p>
        </div>

        <QrunchyFooter />
      </div>
    </div>
  );
}
