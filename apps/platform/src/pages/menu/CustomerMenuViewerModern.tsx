import React, { useState, useMemo, useEffect } from "react";
import { Search, Share2, MapPin, Phone, ChevronDown, ArrowUp, Filter, Star } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Category, MenuItem } from "@/types/digitalMenu";

interface CustomerMenuViewerModernProps {
  qrCode?: string;
}

export default function CustomerMenuViewerModern({
  qrCode,
}: CustomerMenuViewerModernProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Fetch real menu data from backend
  const {
    data: menuData,
    isLoading,
    error,
  } = trpc.digitalMenu.qr.getMenuByQr.useQuery(
    { qr_code: qrCode! },
    { enabled: !!qrCode }
  );

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    if (!menuData) return [];
    
    let items = menuData.items as MenuItem[];

    if (selectedCategory !== "all") {
      items = items.filter(
        (item) => item.categoryId === selectedCategory
      );
    }

    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return items;
  }, [menuData, searchTerm, selectedCategory]);

  const getItemsForCategory = (categoryId: string): MenuItem[] => {
    return filteredItems.filter(
      (item) => item.categoryId === categoryId
    );
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-indigo-100 rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-white/30">
              <span className="text-indigo-600 font-bold text-2xl">Q</span>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-white rounded-full mx-auto animate-ping opacity-30"></div>
          </div>
          <p className="text-white text-xl font-semibold mb-4">Loading your menu</p>
          <div className="w-40 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-white/30">
            <span className="text-white text-3xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-white/80 text-lg mb-8">We couldn't load the menu right now. Let's try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${menuData.restaurant.name} - Menu`,
          text: `Check out the menu at ${menuData.restaurant.name}`,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20" />
        <div className="relative px-6 py-12">
          
          <button
            onClick={handleShare}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-3 rounded-2xl border border-white/20 transition-all hover:scale-110 shadow-lg"
          >
            <Share2 size={20} />
          </button>

          <div className="text-center text-white max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl mr-4 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-white/90 text-lg font-medium">Digital Menu</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              {menuData.restaurant.name}
            </h1>

            <div className="flex flex-col items-center gap-4 mb-8">
              {menuData.restaurant.address && (
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <span className="text-sm">{menuData.restaurant.address}</span>
                </div>
              )}
              {menuData.restaurant.phone && (
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Phone size={18} className="text-white" />
                  </div>
                  <span className="text-sm">{menuData.restaurant.phone}</span>
                </div>
              )}
            </div>

            <div className="relative max-w-md mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Search delicious dishes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 py-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-white text-indigo-900 shadow-xl"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
            }`}
          >
            All Dishes
          </button>
          {menuData.categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-white text-indigo-900 shadow-xl"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-6 pb-20">
        {selectedCategory === "all" ? (
          <div className="space-y-16">
            {menuData.categories
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((category: Category) => {
                const categoryItems = getItemsForCategory(category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category.id}>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-white to-indigo-200 rounded-full"></div>
                    </div>
                    <div className="grid gap-6">
                      {categoryItems.map((item) => (
                        <ModernMenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredItems.map((item: MenuItem) => (
              <ModernMenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-8 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Search size={28} className="text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No dishes found</h3>
            <p className="text-white/80 text-lg mb-8">
              Try a different search or browse other categories
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-indigo-50 transition-all shadow-xl"
            >
              Show all dishes
            </button>
          </div>
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-white text-indigo-900 p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Footer */}
      <div className="bg-black/20 backdrop-blur-xl px-6 py-16 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl mr-4 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="font-bold text-white text-lg">Q</span>
            </div>
            <div className="text-left">
              <span className="font-bold text-white text-xl block">Qrunchy</span>
              <span className="text-white/60 text-sm">Modern dining experience</span>
            </div>
          </div>
          <p className="text-white/50 text-sm">Experience the future of restaurant menus</p>
        </div>
      </div>
    </div>
  );
}

interface ModernMenuItemCardProps {
  item: MenuItem;
}

function ModernMenuItemCard({ item }: ModernMenuItemCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-[1.02] hover:bg-white">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {item.name}
              </h3>
              {Math.random() > 0.7 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-yellow-700 text-xs font-medium">Popular</span>
                </div>
              )}
            </div>
            {item.description && (
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ৳{item.price.toFixed(2)}
            </div>
          </div>
        </div>

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {item.variants.map((variant) => (
              <span
                key={variant.id}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium border border-indigo-200"
              >
                {variant.title} ({variant.options.length})
              </span>
            ))}
            {item.addons.length > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                +{item.addons.length} add-on{item.addons.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              {showDetails ? "Hide options" : "View options"}
              <ChevronDown 
                size={18} 
                className={`transition-transform ${showDetails ? "rotate-180" : ""}`} 
              />
            </button>

            {showDetails && (
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-8">
                {item.variants.map((variant) => (
                  <div key={variant.id}>
                    <h4 className="font-bold text-gray-900 mb-4">
                      {variant.title}
                    </h4>
                    <div className="space-y-3">
                      {variant.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition-all"
                        >
                          <span className="font-medium text-gray-800">
                            {option.name}
                          </span>
                          <span className="font-bold text-indigo-600">
                            {option.price > 0
                              ? `+৳${option.price.toFixed(2)}`
                              : "Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {item.addons.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Add-ons</h4>
                    <div className="space-y-3">
                      {item.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 transition-all"
                        >
                          <span className="font-medium text-emerald-800">
                            {addon.name}
                          </span>
                          <span className="font-bold text-emerald-600">
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

// Add styles for scrollbar hiding
const styles = `
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}