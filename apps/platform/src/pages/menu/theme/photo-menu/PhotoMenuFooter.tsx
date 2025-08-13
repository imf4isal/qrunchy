import React from "react";

export default function PhotoMenuFooter() {
  return (
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
  );
}