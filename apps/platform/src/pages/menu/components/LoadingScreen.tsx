import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
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
