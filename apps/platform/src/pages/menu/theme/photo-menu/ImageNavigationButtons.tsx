import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageNavigationButtonsProps {
  currentImageIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImageNavigationButtons({
  currentImageIndex,
  totalImages,
  onPrevious,
  onNext,
}: ImageNavigationButtonsProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
      <button
        onClick={onPrevious}
        disabled={currentImageIndex === 0}
        className="pointer-events-auto p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-white/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={onNext}
        disabled={currentImageIndex === totalImages - 1}
        className="pointer-events-auto p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-white/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}