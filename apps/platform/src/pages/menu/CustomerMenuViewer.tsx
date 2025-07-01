import React, { useState, useMemo } from "react";
import { Search, Share2, MapPin, Phone, Clock, Star } from "lucide-react";
import { dummyRestaurant, dummyMenu } from "@/data/dummyData";
import type { Category, MenuItem } from "@/types/digitalMenu";

interface CustomerMenuViewerProps {
  qrCode?: string;
}

export default function CustomerMenuViewer({
  qrCode: _qrCode,
}: CustomerMenuViewerProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    let items = dummyMenu.items;

    if (selectedCategory !== "all") {
      items = items.filter(
        (item: MenuItem) => item.categoryId === selectedCategory
      );
    }

    if (searchTerm) {
      items = items.filter(
        (item: MenuItem) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return items;
  }, [searchTerm, selectedCategory]);

  const getItemsForCategory = (categoryId: string): MenuItem[] => {
    return filteredItems.filter(
      (item: MenuItem) => item.categoryId === categoryId
    );
  };

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dummyRestaurant.name} - Menu`,
          text: `Check out the menu at ${dummyRestaurant.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Menu link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url(${dummyRestaurant.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="px-6 py-6 bg-white">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {dummyRestaurant.name}
                </h1>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {dummyRestaurant.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({dummyRestaurant.reviewCount})
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-3">
                {dummyRestaurant.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{dummyRestaurant.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{dummyRestaurant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>{dummyRestaurant.hours}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="px-6 pb-4 bg-white border-b">
            <div
              className="flex gap-2 overflow-x-auto category-scroll"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
              }}
            >
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {dummyMenu.categories.map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {selectedCategory === "all" ? (
          <div className="space-y-8">
            {dummyMenu.categories
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((category: Category) => {
                const categoryItems = getItemsForCategory(category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category.id}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-44 bg-gray-50 py-2 z-5">
                      {category.name}
                    </h2>
                    <div className="space-y-4">
                      {categoryItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item: MenuItem) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">
              No items found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 bg-white border-t px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-sm">
              Q
            </div>
            <span className="font-semibold text-gray-800">
              Powered by Qrunchy
            </span>
          </div>
          <p className="text-xs text-gray-500">Digital menus made simple</p>
        </div>
      </div>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
}

function MenuItemCard({ item }: MenuItemCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="ml-4 text-right">
            <div className="text-xl font-bold text-gray-900">
              ৳{item.price.toFixed(2)}
            </div>
          </div>
        </div>

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.variants.map((variant) => (
              <span
                key={variant.id}
                className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
              >
                {variant.title} options
              </span>
            ))}
            {item.addons.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                +{item.addons.length} add-on
                {item.addons.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
            >
              {showDetails ? "Hide details" : "View options"}
            </button>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {item.variants.map((variant) => (
                  <div key={variant.id} className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {variant.title}:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {variant.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {option.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {option.price > 0
                              ? `+৳${option.price.toFixed(2)}`
                              : "No extra charge"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {item.addons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Add-ons:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {item.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center p-2 bg-green-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {addon.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            +৳{addon.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
