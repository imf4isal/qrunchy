import React, { useState } from "react";
import { Check, Eye, Palette } from "lucide-react";
import { trpc } from "@/utils/trpc";

interface ThemeSelectorProps {
  restaurantId: number;
  currentTheme: "minimal" | "modern";
  onThemeChange?: (newTheme: "minimal" | "modern") => void;
}

const THEME_OPTIONS = [
  {
    id: "minimal" as const,
    name: "Minimal",
    description: "Clean, elegant design with subtle colors",
    preview: "bg-gradient-to-br from-slate-50 to-gray-100",
    accent: "slate",
  },
  {
    id: "modern" as const, 
    name: "Modern",
    description: "Bold, vibrant design with dynamic gradients",
    preview: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
    accent: "indigo",
  },
];

export default function ThemeSelector({
  restaurantId,
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<"minimal" | "modern">(currentTheme);
  const [isUpdating, setIsUpdating] = useState(false);

  const utils = trpc.useUtils();
  
  const updateThemeMutation = trpc.restaurant.updateTheme.useMutation({
    onSuccess: () => {
      setIsUpdating(false);
      onThemeChange?.(selectedTheme);
      
      // Invalidate relevant queries to ensure fresh data
      utils.digitalMenu.qr.getQrData.invalidate();
      utils.digitalMenu.qr.getMenuByQr.invalidate();
      utils.restaurant.getById.invalidate();
      utils.restaurant.getByUser.invalidate();
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      setIsUpdating(false);
      console.error("Failed to update theme:", error);
      // Revert selection on error
      setSelectedTheme(currentTheme);
    },
  });

  const handleThemeSelect = (themeId: "minimal" | "modern") => {
    if (themeId === currentTheme || isUpdating) return;
    
    setSelectedTheme(themeId);
    setIsUpdating(true);
    
    updateThemeMutation.mutate({
      id: restaurantId,
      theme_id: themeId,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Palette className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Menu Theme</h3>
          <p className="text-sm text-gray-600">Choose how your digital menu looks to customers</p>
        </div>
      </div>

      <div className="space-y-4">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const isCurrent = currentTheme === theme.id;
          
          return (
            <div
              key={theme.id}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? theme.accent === "slate" 
                    ? "border-slate-500 bg-slate-50" 
                    : "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${isUpdating && isSelected ? "opacity-50" : ""}`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <div className="flex items-start gap-4">
                {/* Theme Preview */}
                <div className={`w-16 h-12 rounded-lg ${theme.preview} border border-gray-200 flex-shrink-0 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-1 bg-white/30 rounded-full mb-1"></div>
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-white/20 rounded"></div>
                </div>

                {/* Theme Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                    {isCurrent && !isUpdating && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Current
                      </span>
                    )}
                    {isUpdating && isSelected && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        Updating...
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>

                {/* Selection Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? theme.accent === "slate"
                      ? "border-slate-500 bg-slate-500"
                      : "border-indigo-500 bg-indigo-500"
                    : "border-gray-300"
                }`}>
                  {isSelected && <Check className="text-white" size={14} />}
                </div>
              </div>

              {/* Preview Link */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button 
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement preview functionality
                    console.log(`Preview ${theme.name} theme`);
                  }}
                >
                  <Eye size={14} />
                  Preview theme
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {updateThemeMutation.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            Failed to update theme. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}