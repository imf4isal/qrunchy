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
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection("prev");
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setFlipDirection(pageIndex > currentPage ? "next" : "prev");
      setIsFlipping(true);

      setTimeout(() => {
        setCurrentPage(pageIndex);
        setTimeout(() => setIsFlipping(false), 300);
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
    <div className="w-full max-w-sm mx-auto photo-menu-preview">
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
      <div className="relative bg-white border-l border-r border-gray-200 overflow-hidden">
        <div
          className="book-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current Page */}
          <div
            className={`page-wrapper ${isFlipping ? "flipping" : ""} ${flipDirection}`}
            style={{
              transform: isFlipping
                ? flipDirection === "next"
                  ? "rotateY(-180deg)"
                  : "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
          >
            <div className="page-content">
              <img
                src={images[currentPage]?.preview}
                alt={`Menu page ${currentPage + 1}`}
                className="w-full h-80 object-contain bg-gray-50"
              />
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
            className="pointer-events-auto bg-white/80 hover:bg-white/90 backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="pointer-events-auto bg-white/80 hover:bg-white/90 backdrop-blur-sm"
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
      <div className="bg-white border-l border-r border-b border-gray-200 p-3 rounded-b-xl">
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? "bg-blue-600" : "bg-gray-300"
              }`}
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

      <style>{`
        .photo-menu-preview .book-container {
          perspective: 1000px;
          height: 320px;
        }
        
        .photo-menu-preview .page-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }
        
        .photo-menu-preview .page-content {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .photo-menu-preview .page-wrapper.flipping {
          pointer-events: none;
        }
        
        .photo-menu-preview .page-wrapper.next {
          transform-origin: right center;
        }
        
        .photo-menu-preview .page-wrapper.prev {
          transform-origin: left center;
        }
        
        .photo-menu-preview .page-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            rgba(0,0,0,0.1) 0%, 
            transparent 5%, 
            transparent 95%, 
            rgba(0,0,0,0.1) 100%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
