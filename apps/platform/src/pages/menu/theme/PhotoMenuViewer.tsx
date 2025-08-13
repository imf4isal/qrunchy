// Shared components
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import BackToTopButton from "./components/BackToTopButton";

// Photo menu specific components
import PhotoMenuHeader from "./photo-menu/PhotoMenuHeader";
import ZoomControls from "./photo-menu/ZoomControls";
import ThumbnailNavigation from "./photo-menu/ThumbnailNavigation";
import ImageViewer from "./photo-menu/ImageViewer";
import PhotoMenuFooter from "./photo-menu/PhotoMenuFooter";

// Custom hooks
import { usePhotoMenuData } from "./hooks/usePhotoMenuData";
import { useImageNavigation } from "./hooks/useImageNavigation";
import { useImageZoom } from "./hooks/useImageZoom";
import { useScrollToTop } from "./hooks/useScrollToTop";

interface PhotoMenuViewerProps {
  qrCode: string;
  useServerData?: boolean;
}

export default function PhotoMenuViewer({ qrCode, useServerData = false }: PhotoMenuViewerProps) {
  // Custom hooks
  const { photoMenu, isLoading, error } = usePhotoMenuData({ qrCode, useServerData });
  const { showBackToTop, scrollToTop } = useScrollToTop();
  
  const {
    zoom,
    panX,
    panY,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
  } = useImageZoom();

  const {
    currentImageIndex,
    isImageLoading,
    setIsImageLoading,
    nextImage,
    prevImage,
    goToImage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useImageNavigation({
    totalImages: photoMenu?.images.length || 0,
    onImageChange: resetZoom,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onResetZoom: handleResetZoom,
  });

  const handleShare = async (): Promise<void> => {
    if (!photoMenu) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${photoMenu.restaurant.name} - Menu`,
          text: `Check out the menu at ${photoMenu.restaurant.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Menu link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !photoMenu) {
    return <ErrorScreen message={error || undefined} />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <PhotoMenuHeader restaurant={photoMenu.restaurant} onShare={handleShare} />

      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <ZoomControls
            zoom={zoom}
            currentImageIndex={currentImageIndex}
            totalImages={photoMenu.images.length}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
          />

          <ThumbnailNavigation
            images={photoMenu.images}
            currentImageIndex={currentImageIndex}
            onImageSelect={goToImage}
          />

          <ImageViewer
            image={photoMenu.images[currentImageIndex]}
            currentImageIndex={currentImageIndex}
            totalImages={photoMenu.images.length}
            isImageLoading={isImageLoading}
            setIsImageLoading={setIsImageLoading}
            zoom={zoom}
            panX={panX}
            panY={panY}
            isDragging={isDragging}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onPrevious={prevImage}
            onNext={nextImage}
          />
        </div>
      </div>

      <BackToTopButton show={showBackToTop} onClick={scrollToTop} />
      <PhotoMenuFooter />
    </div>
  );
}

