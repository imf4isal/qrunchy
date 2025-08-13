import React from "react";
import { Share2, MapPin, Phone } from "lucide-react";
import type { PhotoMenuData } from "@/types/photoMenu";

interface PhotoMenuHeaderProps {
  restaurant: PhotoMenuData["restaurant"];
  onShare: () => void;
}

export default function PhotoMenuHeader({ restaurant, onShare }: PhotoMenuHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="relative">
        <div className="h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
          
          <button
            onClick={onShare}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg border border-white/20 transition-all hover:scale-105"
          >
            <Share2 size={16} />
          </button>

          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-xs">Q</span>
              </div>
              <span className="text-white/80 text-xs font-medium">Photo Menu</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-white">
          <h1 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
            {restaurant.name}
          </h1>

          <div className="flex flex-col gap-2">
            {restaurant.address && (
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-slate-500" />
                </div>
                <span className="text-xs leading-relaxed">{restaurant.address}</span>
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-slate-500" />
                </div>
                <span className="text-xs">{restaurant.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}