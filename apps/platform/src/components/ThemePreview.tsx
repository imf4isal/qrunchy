import React from "react";
import type { DigitalMenu } from "@/types/digitalMenu";

interface ThemePreviewProps {
  menu: DigitalMenu;
  theme: "minimal" | "modern";
  restaurant?: {
    name: string;
    address?: string;
    mobile?: string;
  };
}

export default function ThemePreview({ menu, theme, restaurant }: ThemePreviewProps) {
  const getItemsForCategory = (categoryId: string) => {
    return menu.items.filter((item) => item.categoryId === categoryId);
  };

  if (!menu.restaurantName && menu.categories.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Preview will appear here as you build your menu</p>
      </div>
    );
  }

  // Minimal Theme
  if (theme === "minimal") {
    return (
      <div className="max-h-96 overflow-y-auto bg-white">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-700 to-gray-700 text-white relative">
          <div className="absolute top-2 right-2">
            <div className="flex items-center text-xs opacity-75">
              <div className="w-4 h-4 bg-white bg-opacity-20 rounded mr-1 flex items-center justify-center text-white font-bold text-xs">
                Q
              </div>
              qrunchy
            </div>
          </div>
          <h2 className="text-lg font-bold">
            {restaurant?.name || menu.restaurantName || "Restaurant Name"}
          </h2>
          <p className="text-sm opacity-90">Digital Menu</p>
          {restaurant?.address && (
            <p className="text-xs opacity-75 mt-1">{restaurant.address}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {menu.categories
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category) => {
              const categoryItems = getItemsForCategory(category.id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                    {category.name}
                  </h3>

                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name || "Untitled Item"}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-3 font-semibold text-gray-900">
                            ৳{item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Variants */}
                        {item.variants.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {item.variants.map((variant) => (
                              <div key={variant.id} className="text-sm">
                                <span className="font-medium text-gray-700">
                                  {variant.title}:
                                </span>
                                <div className="ml-2 flex flex-wrap gap-2 mt-1">
                                  {variant.options.map((option) => (
                                    <span
                                      key={option.id}
                                      className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                                    >
                                      {option.name} (+৳{option.price.toFixed(2)})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add-ons */}
                        {item.addons.length > 0 && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">Add-ons:</span>
                            <div className="ml-2 flex flex-wrap gap-2 mt-1">
                              {item.addons.map((addon) => (
                                <span
                                  key={addon.id}
                                  className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                                >
                                  {addon.name} (+৳{addon.price.toFixed(2)})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {menu.categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No categories added yet</p>
            </div>
          )}

          {menu.categories.length > 0 && menu.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Add items to your categories to see them here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-slate-600 to-gray-600 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
                Q
              </div>
              <span className="font-medium">Powered by Qrunchy</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Theme
  return (
    <div className="max-h-96 overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="p-6 relative">
        <div className="absolute top-4 right-4">
          <div className="flex items-center text-xs opacity-75">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded mr-1 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            qrunchy
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
            {restaurant?.name || menu.restaurantName || "Restaurant Name"}
          </h1>
          <p className="text-blue-100 text-sm mb-2">Digital Menu</p>
          {restaurant?.address && (
            <div className="flex items-center text-blue-200 text-xs">
              <span>{restaurant.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-8">
        {menu.categories
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((category) => {
            const categoryItems = getItemsForCategory(category.id);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-white/20">
                  {category.name}
                </h2>

                <div className="space-y-6">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-white/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white leading-tight mb-2">
                            {item.name || "Untitled Item"}
                          </h3>
                          {item.description && (
                            <p className="text-blue-100 leading-relaxed text-sm">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                          ৳{item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Variants */}
                      {item.variants.length > 0 && (
                        <div className="mb-4 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {item.variants.map((variant) => (
                              <span
                                key={variant.id}
                                className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-50/10 to-indigo-50/10 text-blue-100 text-sm font-medium border border-blue-200/20 shadow-sm"
                              >
                                ✨ {variant.title} ({variant.options.length})
                              </span>
                            ))}
                            {item.addons.length > 0 && (
                              <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-50/10 to-green-50/10 text-emerald-100 text-sm font-medium border border-emerald-200/20 shadow-sm">
                                🍽️ +{item.addons.length} add-on{item.addons.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {menu.categories.length === 0 && (
          <div className="text-center py-12 text-blue-200">
            <p>No categories added yet</p>
          </div>
        )}

        {menu.categories.length > 0 && menu.items.length === 0 && (
          <div className="text-center py-12 text-blue-200">
            <p>Add items to your categories to see them here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-t border-white/10">
        <div className="flex items-center justify-center text-xs text-blue-200">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded mr-2 flex items-center justify-center text-white font-bold text-xs">
              Q
            </div>
            <span className="font-medium">Powered by Qrunchy</span>
          </div>
        </div>
      </div>
    </div>
  );
}