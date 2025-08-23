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
    return (menu.items || []).filter((item) => item.categoryId === categoryId);
  };

  if (!menu.restaurantName && (!menu.categories || menu.categories.length === 0)) {
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
        <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-700 to-gray-700 text-white relative">
          <div className="absolute top-2 right-2">
            <div className="flex items-center text-xs opacity-75">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white bg-opacity-20 rounded mr-1 flex items-center justify-center text-white font-bold text-xs">
                Q
              </div>
              <span className="hidden sm:inline">qrunchy</span>
            </div>
          </div>
          <h2 className="text-base sm:text-lg font-bold pr-12 sm:pr-16">
            {restaurant?.name || menu.restaurantName || "Restaurant Name"}
          </h2>
          <p className="text-xs sm:text-sm opacity-90">Digital Menu</p>
          {restaurant?.address && (
            <p className="text-xs opacity-75 mt-1 break-words">{restaurant.address}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {(menu.categories || [])
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category) => {
              const categoryItems = getItemsForCategory(category.id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                    {category.name}
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-3 sm:pb-4 last:border-b-0">
                        <div className="flex gap-3 mb-2">
                          {/* Item image if available */}
                          {(item as any).image_url && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img 
                                src={(item as any).image_url}
                                alt={item.name || "Menu item"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                  {item.name || "Untitled Item"}
                                </h4>
                                {item.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="sm:ml-3 font-semibold text-gray-900 text-sm sm:text-base shrink-0">
                                ৳{item.price.toFixed(2)}
                              </div>
                            </div>
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
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
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

          {(!menu.categories || menu.categories.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No categories added yet</p>
            </div>
          )}

          {(menu.categories && menu.categories.length > 0) && (!menu.items || menu.items.length === 0) && (
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

  // Modern Theme - Sophisticated horizontal layout
  return (
    <div className="max-h-96 overflow-y-auto bg-gray-50 text-gray-900">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100 p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-gray-900 mb-1">
              {restaurant?.name || menu.restaurantName || "Restaurant Name"}
            </h1>
            {restaurant?.address && (
              <p className="text-gray-600 text-xs">{restaurant.address}</p>
            )}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-1 text-xs">
          <button className="px-3 py-2 text-orange-600 border-b-2 border-orange-600 font-medium">
            All
          </button>
          {(menu.categories || [])
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .slice(0, 2)
            .map((category) => (
              <button key={category.id} className="px-3 py-2 text-gray-600">
                {category.name}
              </button>
            ))}
        </div>
      </div>

      {/* Content - Horizontal Layout */}
      <div className="p-3 space-y-4">
        {(menu.categories || [])
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((category) => {
            const categoryItems = getItemsForCategory(category.id);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-sm font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <div className="w-6 h-0.5 bg-orange-500 mb-3"></div>

                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 bg-white rounded-lg border border-gray-100 p-3 hover:shadow-md transition-shadow"
                    >
                      {/* Image or placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {(item as any).image_url ? (
                          <img 
                            src={(item as any).image_url}
                            alt={item.name || "Menu item"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">🍕</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                              {item.name || "Untitled Item"}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 text-xs leading-relaxed line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          {/* Price */}
                          <div className="flex-shrink-0 text-right">
                            <div className="text-sm font-bold text-gray-900">
                              ৳{item.price.toFixed(0)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Options */}
                        <div className="flex gap-1 mt-2">
                          {item.variants.length > 0 && (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded border border-orange-200">
                              {item.variants.length} size{item.variants.length > 1 ? 's' : ''}
                            </span>
                          )}
                          {item.addons.length > 0 && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200">
                              +{item.addons.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {(!menu.categories || menu.categories.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs">No categories added yet</p>
          </div>
        )}

        {(menu.categories && menu.categories.length > 0) && (!menu.items || menu.items.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs">Add items to your categories to see them here</p>
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <div className="bg-white border-t border-gray-100 p-2">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <span>Powered by Qrunchy</span>
        </div>
      </div>
    </div>
  );
}