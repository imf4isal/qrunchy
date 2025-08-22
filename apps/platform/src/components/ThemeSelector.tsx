import React, { useState } from "react";
import { Check, Eye, Palette } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@/contexts/AuthContext";

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
    description: "Sophisticated horizontal layout inspired by premium restaurant menus",
    preview: "bg-gray-50",
    accent: "orange",
  },
];

export default function ThemeSelector({
  restaurantId,
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<"minimal" | "modern">(currentTheme);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateRestaurant } = useAuth();

  const utils = trpc.useUtils();
  
  const updateThemeMutation = trpc.restaurant.updateTheme.useMutation({
    onSuccess: async (data) => {
      console.log("✅ Theme update successful:", data);
      console.log("Updated theme_id:", data.theme_id);
      
      // Update the restaurant in the auth context immediately
      updateRestaurant(restaurantId, { 
        theme_id: data.theme_id,
        updated_at: data.updated_at 
      });
      
      // Only call onThemeChange after successful backend update
      onThemeChange?.(selectedTheme);
      
      // Invalidate relevant queries AFTER confirming success
      try {
        await Promise.all([
          utils.digitalMenu.qr.getQrData.invalidate(),
          utils.digitalMenu.qr.getMenuByQr.invalidate(), 
          utils.restaurant.getById.invalidate(),
          utils.restaurant.getByUser.invalidate(),
          utils.auth.me.invalidate(),
        ]);
        console.log("✅ Cache invalidation completed");
      } catch (invalidationError) {
        console.warn("⚠️ Cache invalidation failed:", invalidationError);
      }
      
      setIsUpdating(false);
    },
    onError: (error) => {
      console.error("❌ Failed to update theme:", error);
      console.error("Error details:", {
        message: error.message,
        data: error.data,
        shape: error.shape,
        cause: error.cause
      });
      
      // Revert selection on error
      setSelectedTheme(currentTheme);
      setIsUpdating(false);
      
      // Show user-friendly error
      alert(`Failed to update theme: ${error.message || 'Unknown error. Please check console and try again.'}`);
    },
  });

  const handleThemeSelect = (themeId: "minimal" | "modern") => {
    if (themeId === currentTheme || isUpdating) {
      return;
    }
    
    console.log(`🎨 Changing theme from '${currentTheme}' to '${themeId}' for restaurant ${restaurantId}`);
    
    // Update UI optimistically but don't call onThemeChange yet
    setSelectedTheme(themeId);
    setIsUpdating(true);
    
    // Save to backend - onThemeChange will be called on success
    updateThemeMutation.mutate({
      id: restaurantId,
      theme_id: themeId,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
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
                    : theme.accent === "orange"
                    ? "border-orange-500 bg-orange-50"
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
                      : theme.accent === "orange"
                      ? "border-orange-500 bg-orange-500"
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