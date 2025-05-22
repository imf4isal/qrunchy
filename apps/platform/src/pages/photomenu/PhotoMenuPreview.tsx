// src/pages/photomenu/PhotoMenuPreview.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const totalPages = images.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection("next");
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setTimeout(() => setIsFlipping(false), 600);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection("prev");
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => setIsFlipping(false), 600);
      }, 300);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setFlipDirection(pageIndex > currentPage ? "next" : "prev");
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage(pageIndex);
        setTimeout(() => setIsFlipping(false), 600);
      }, 300);
    }
  };

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextPage();
    } else if (isRightSwipe) {
      handlePrevPage();
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Upload images to see preview</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Custom CSS for page flip animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .page-flip-container {
            perspective: 1000px;
            height: 320px;
            position: relative;
            overflow: hidden;
          }
          
          .page-flip-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s ease-in-out;
          }
          
          .page-flip-wrapper.flipping-next {
            transform: rotateY(-180deg);
            transform-origin: right center;
          }
          
          .page-flip-wrapper.flipping-prev {
            transform: rotateY(180deg);
            transform-origin: left center;
          }
          
          .page-current, .page-next {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .page-current {
            z-index: 2;
          }
          
          .page-next {
            transform: rotateY(180deg);
            z-index: 1;
          }
          
          .page-flip-wrapper.flipping-next .page-current::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
              rgba(0,0,0,0) 0%, 
              rgba(0,0,0,0.1) 50%, 
              rgba(0,0,0,0.3) 100%);
            z-index: 3;
            pointer-events: none;
          }
          
          .page-flip-wrapper.flipping-next .page-current::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 30px;
            background: linear-gradient(225deg, 
              rgba(255,255,255,0.8) 0%, 
              rgba(0,0,0,0.1) 100%);
            box-shadow: -2px -2px 4px rgba(0,0,0,0.2);
            z-index: 4;
            pointer-events: none;
          }
        `,
        }}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{restaurantName}</h3>
            <p className="text-sm opacity-90">Menu</p>
          </div>
          <div className="flex items-center text-xs opacity-75">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded mr-1 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            qrunchy
          </div>
        </div>
      </div>

      {/* Book Container */}
      <div className="relative bg-white border-l border-r border-gray-200">
        <div
          className="page-flip-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`page-flip-wrapper ${
              isFlipping
                ? flipDirection === "next"
                  ? "flipping-next"
                  : "flipping-prev"
                : ""
            }`}
          >
            {/* Current Page */}
            <div className="page-current bg-white shadow-lg">
              <img
                src={images[currentPage]?.preview}
                alt={`Menu page ${currentPage + 1}`}
                className="w-full h-80 object-contain bg-gray-50"
              />
            </div>

            {/* Next Page (for flip effect) */}
            <div className="page-next bg-white shadow-lg">
              {flipDirection === "next" && currentPage < totalPages - 1 ? (
                <img
                  src={images[currentPage + 1]?.preview}
                  alt={`Menu page ${currentPage + 2}`}
                  className="w-full h-80 object-contain bg-gray-50"
                />
              ) : flipDirection === "prev" && currentPage > 0 ? (
                <img
                  src={images[currentPage - 1]?.preview}
                  alt={`Menu page ${currentPage}`}
                  className="w-full h-80 object-contain bg-gray-50"
                />
              ) : (
                <div className="flex items-center justify-center h-80 bg-gray-100">
                  <div className="text-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <p className="text-xs">Menu Page</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevPage}
            disabled={currentPage === 0 || isFlipping}
            className="pointer-events-auto bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="pointer-events-auto bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Page Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {currentPage + 1} of {totalPages}
        </div>
      </div>

      {/* Page Dots */}
      <div className="bg-white border-l border-r border-b border-gray-200 p-3">
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              disabled={isFlipping}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? "bg-blue-600" : "bg-gray-300"
              } ${isFlipping ? "opacity-50" : "hover:bg-blue-400"}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            <span className="font-medium">Powered by Qrunchy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
