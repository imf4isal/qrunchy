// src/pages/photomenu/PhotoMenuPreview.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface PhotoMenuPreviewProps {
  images: UploadedImage[];
  restaurantName?: string;
}

export default function PhotoMenuPreview({
  images,
  restaurantName = "Restaurant Name",
}: PhotoMenuPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
        <p>Upload images to see preview</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-lg overflow-hidden shadow-sm border">
      {/* Header - matches actual PhotoMenuViewer */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="h-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
          
          <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 transition-all">
            <Share2 size={14} />
          </button>

          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-xs">Q</span>
              </div>
              <span className="text-white/80 text-xs font-medium">Digital Menu</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-white">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            {restaurantName}
          </h1>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative bg-white">
        <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
          <img
            src={images[currentImageIndex]?.preview}
            alt={`Menu page ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl backdrop-blur-sm transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl backdrop-blur-sm transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              {currentImageIndex + 1} of {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-3 border-t border-slate-100">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-slate-900 ring-2 ring-slate-900/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image.preview}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - matches actual PhotoMenuViewer */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-white/10 rounded-xl mr-2 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="font-bold text-white text-xs">Q</span>
            </div>
            <div className="text-left">
              <span className="font-semibold text-white text-sm block">Qrunchy</span>
              <span className="text-white/60 text-xs">Digital menus made simple</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
