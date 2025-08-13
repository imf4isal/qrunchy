import React from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  currentImageIndex: number;
  totalImages: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export default function ZoomControls({
  zoom,
  currentImageIndex,
  totalImages,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={zoom <= 1}
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-sm text-slate-600 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onResetZoom}
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      
      <div className="text-sm text-slate-600">
        {currentImageIndex + 1} of {totalImages}
      </div>
    </div>
  );
}