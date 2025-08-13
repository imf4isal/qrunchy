import React from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopButtonProps {
  show: boolean;
  onClick?: () => void;
}

export default function BackToTopButton({ show, onClick }: BackToTopButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!show) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
    >
      <ArrowUp size={20} />
    </button>
  );
}