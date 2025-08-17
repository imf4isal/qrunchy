import React from "react";
import { Check, Palette } from "lucide-react";

interface ThemeSetupSelectorProps {
  selectedTheme: "minimal" | "modern";
  onThemeChange: (theme: "minimal" | "modern") => void;
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
    description: "Bold, sophisticated design with elegant gradients",
    preview: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    accent: "gray",
  },
];

export default function ThemeSetupSelector({
  selectedTheme,
  onThemeChange,
}: ThemeSetupSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
          <Palette className="text-white" size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Choose Your Theme</h3>
          <p className="text-sm text-gray-600">Select how your digital menu will look to customers</p>
        </div>
      </div>

      <div className="space-y-3">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          
          return (
            <div
              key={theme.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? theme.accent === "slate" 
                    ? "border-slate-500 bg-slate-50" 
                    : "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onThemeChange(theme.id)}
            >
              <div className="flex items-start gap-3">
                {/* Theme Preview */}
                <div className={`w-12 h-9 rounded-md ${theme.preview} border border-gray-200 flex-shrink-0 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-white/30 rounded-full mb-0.5"></div>
                  </div>
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-white/20 rounded"></div>
                </div>

                {/* Theme Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{theme.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>

                {/* Selection Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? theme.accent === "slate"
                      ? "border-slate-500 bg-slate-500"
                      : "border-indigo-500 bg-indigo-500"
                    : "border-gray-300"
                }`}>
                  {isSelected && <Check className="text-white" size={12} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}