import React from "react";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorScreen({ 
  title = "Menu unavailable", 
  message = "We couldn't load the menu right now. Please try again.",
  onRetry
}: ErrorScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-100">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-600 text-lg mb-6">{message}</p>
        <button 
          onClick={handleRetry}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  );
}