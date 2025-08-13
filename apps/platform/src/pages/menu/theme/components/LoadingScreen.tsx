import React from "react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading menu" }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto animate-ping opacity-20"></div>
        </div>
        <p className="text-slate-600 text-xl font-semibold">{message}</p>
        <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}