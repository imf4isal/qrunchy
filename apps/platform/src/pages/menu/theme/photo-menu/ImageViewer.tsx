import React, { useRef } from "react";
import type { PhotoMenuData } from "@/types/photoMenu";
import ImageNavigationButtons from "./ImageNavigationButtons";

interface ImageViewerProps {
  image: PhotoMenuData["images"][0];
  currentImageIndex: number;
  totalImages: number;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImageViewer({
  image,
  currentImageIndex,
  totalImages,
  isImageLoading,
  setIsImageLoading,
  zoom,
  panX,
  panY,
  isDragging,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onPrevious,
  onNext,
}: ImageViewerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
      style={{ height: "70vh" }}
    >
      <div
        className="w-full h-full flex items-center justify-center cursor-move"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          ref={imageRef}
          src={image.url}
          alt={`Menu page ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
          style={{
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          draggable={false}
        />
      </div>

      <ImageNavigationButtons
        currentImageIndex={currentImageIndex}
        totalImages={totalImages}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}