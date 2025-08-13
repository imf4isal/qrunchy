import { useState, useCallback } from "react";

export function useImageZoom() {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return {
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
  };
}