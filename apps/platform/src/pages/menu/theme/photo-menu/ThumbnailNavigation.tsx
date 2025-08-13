import React from "react";
import type { PhotoMenuData } from "@/types/photoMenu";
import "../styles/scrollbar.css";

interface ThumbnailNavigationProps {
  images: PhotoMenuData["images"];
  currentImageIndex: number;
  onImageSelect: (index: number) => void;
}

export default function ThumbnailNavigation({
  images,
  currentImageIndex,
  onImageSelect,
}: ThumbnailNavigationProps) {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onImageSelect(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentImageIndex
                ? "border-slate-900 shadow-lg"
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}