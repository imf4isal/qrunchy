import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Share2, 
  MapPin, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { getPhotoMenu } from "@/utils/photoMenuStorage";
import { trpc } from "@/utils/trpc";
import type { PhotoMenuData } from "@/types/photoMenu";

interface PhotoMenuViewerProps {
  qrCode: string;
  useServerData?: boolean;
}

export default function PhotoMenuViewer({ qrCode, useServerData = false }: PhotoMenuViewerProps) {
  const [photoMenu, setPhotoMenu] = useState<PhotoMenuData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Zoom functionality
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Server data fetching (only when useServerData is true)
  const {
    data: serverPhotoMenuData,
    isLoading: serverLoading,
    error: serverError,
  } = trpc.photoMenu.getByQrCode.useQuery(
    { qr_code: qrCode },
    { enabled: useServerData }
  );

  // Load photo menu data
  useEffect(() => {
    if (useServerData) {
      // Server data handling
      setIsLoading(serverLoading);
      
      if (serverError) {
        setError("Failed to load photo menu from server");
        setPhotoMenu(null);
        return;
      }

      if (serverPhotoMenuData?.photos && serverPhotoMenuData.photos.length > 0) {
        // Convert server data to PhotoMenuData format
        const convertedData: PhotoMenuData = {
          id: qrCode,
          restaurant: {
            name: serverPhotoMenuData.photos[0].restaurant_name,
            address: serverPhotoMenuData.photos[0].restaurant_address || "",
            phone: serverPhotoMenuData.photos[0].restaurant_mobile,
          },
          images: serverPhotoMenuData.photos.map((photo, index) => ({
            id: photo.id.toString(),
            url: photo.image_url,
            order: photo.sort_order || index,
          })),
          createdAt: serverPhotoMenuData.photos[0].created_at,
        };
        setPhotoMenu(convertedData);
        setError(null);
      } else if (!serverLoading) {
        setError("Photo menu not found");
        setPhotoMenu(null);
      }
    } else {
      // localStorage data handling
      setIsLoading(true);
      setError(null);
      
      try {
        const menuData = getPhotoMenu(qrCode);
        if (menuData) {
          setPhotoMenu(menuData);
        } else {
          setError("Photo menu not found");
        }
      } catch (err) {
        setError("Failed to load photo menu");
        console.error("Error loading photo menu:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [qrCode, useServerData, serverPhotoMenuData, serverLoading, serverError]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset zoom when changing images
  useEffect(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, [currentImageIndex]);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextImage = useCallback(() => {
    if (photoMenu && currentImageIndex < photoMenu.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setIsImageLoading(true);
    }
  }, [photoMenu, currentImageIndex]);

  const prevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setIsImageLoading(true);
    }
  }, [currentImageIndex]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoading(true);
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

    if (isLeftSwipe && photoMenu && currentImageIndex < photoMenu.images.length - 1) {
      nextImage();
    } else if (isRightSwipe && currentImageIndex > 0) {
      prevImage();
    }
  };

  // Zoom and pan handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 1));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage, handleZoomIn, handleZoomOut, handleResetZoom]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 text-xl font-semibold">Loading menu</p>
          <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !photoMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-100">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Menu unavailable</h2>
          <p className="text-slate-600 text-lg mb-6">{error || "We couldn't load the menu right now. Please try again."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const currentImage = photoMenu.images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="relative">
          <div className="h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
            
            <button
              onClick={handleShare}
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
              {photoMenu.restaurant.name}
            </h1>

            <div className="flex flex-col gap-2">
              {photoMenu.restaurant.address && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-slate-500" />
                  </div>
                  <span className="text-xs leading-relaxed">{photoMenu.restaurant.address}</span>
                </div>
              )}
              {photoMenu.restaurant.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-slate-500" />
                  </div>
                  <span className="text-xs">{photoMenu.restaurant.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Zoom Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-sm text-slate-600 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            
            <div className="text-sm text-slate-600">
              {currentImageIndex + 1} of {photoMenu.images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {photoMenu.images.length > 1 && (
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {photoMenu.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
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
          )}

          {/* Main Image */}
          <div 
            ref={containerRef}
            className="relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            style={{ height: "70vh" }}
          >
            <div
              className="w-full h-full flex items-center justify-center cursor-move"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                </div>
              )}
              
              <img
                ref={imageRef}
                src={currentImage.url}
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

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="pointer-events-auto p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-white/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextImage}
                disabled={currentImageIndex === photoMenu.images.length - 1}
                className="pointer-events-auto p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-white/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-2xl mr-3 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="font-bold text-white">Q</span>
            </div>
            <div className="text-left">
              <span className="font-semibold text-white text-lg block">Qrunchy</span>
              <span className="text-white/60 text-sm">Digital menus made simple</span>
            </div>
          </div>
          <p className="text-white/40 text-xs">Scan. Browse. Order. The future of dining.</p>
        </div>
      </div>
    </div>
  );
}

// Add styles for scrollbar hiding
const styles = `
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}