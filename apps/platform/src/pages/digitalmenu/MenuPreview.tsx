import type { DigitalMenu } from "@/types/digitalMenu";

interface MenuPreviewProps {
  menu: DigitalMenu;
}

export default function MenuPreview({ menu }: MenuPreviewProps) {
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

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-bold">
          {menu.restaurantName || "Restaurant Name"}
        </h2>
        <p className="text-sm opacity-90">Digital Menu</p>
      </div>

      <div className="p-4 space-y-6">
        {menu.categories
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((category) => {
            const categoryItems = getItemsForCategory(category.id);

            if (categoryItems.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
                  {category.name}
                </h3>

                <div className="space-y-4">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
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
                          ${item.price.toFixed(2)}
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
                                    {option.name} (+${option.price.toFixed(2)})
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
                          <span className="font-medium text-gray-700">
                            Add-ons:
                          </span>
                          <div className="ml-2 flex flex-wrap gap-2 mt-1">
                            {item.addons.map((addon) => (
                              <span
                                key={addon.id}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                              >
                                {addon.name} (+${addon.price.toFixed(2)})
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

      <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">
        Powered by Qrunchy
      </div>
    </div>
  );
}
