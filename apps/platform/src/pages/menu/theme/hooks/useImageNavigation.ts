import { useState, useCallback, useEffect } from "react";

interface UseImageNavigationProps {
  totalImages: number;
  onImageChange?: (index: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export function useImageNavigation({ 
  totalImages, 
  onImageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom 
}: UseImageNavigationProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextImage = useCallback(() => {
    if (currentImageIndex < totalImages - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setIsImageLoading(true);
      onImageChange?.(newIndex);
    }
  }, [currentImageIndex, totalImages, onImageChange]);

  const prevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setIsImageLoading(true);
      onImageChange?.(newIndex);
    }
  }, [currentImageIndex, onImageChange]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoading(true);
    onImageChange?.(index);
  };

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

    if (isLeftSwipe && currentImageIndex < totalImages - 1) {
      nextImage();
    } else if (isRightSwipe && currentImageIndex > 0) {
      prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "+":
        case "=":
          onZoomIn?.();
          break;
        case "-":
          onZoomOut?.();
          break;
        case "0":
          onResetZoom?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage, onZoomIn, onZoomOut, onResetZoom]);

  return {
    currentImageIndex,
    isImageLoading,
    setIsImageLoading,
    nextImage,
    prevImage,
    goToImage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}