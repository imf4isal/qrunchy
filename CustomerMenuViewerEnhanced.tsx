import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Share2, MapPin, Phone, ArrowUp, ChevronDown, Star, Clock, Users } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Category, MenuItem } from "@/types/digitalMenu";

interface CustomerMenuViewerProps {
  qrCode?: string;
}

export default function CustomerMenuViewerEnhanced({
  qrCode,
}: CustomerMenuViewerProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch real menu data from backend
  const {
    data: menuData,
    isLoading,
    error,
  } = trpc.digitalMenu.qr.getMenuByQr.useQuery(
    { qr_code: qrCode! },
    { enabled: !!qrCode }
  );

  // Handle scroll events for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const yOffset = -headerHeight - 20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center px-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto animate-ping opacity-20"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Menu</h2>
          <p className="text-gray-600 animate-pulse">Preparing your digital dining experience...</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Menu Unavailable</h2>
          <p className="text-gray-600 mb-6">We couldn't load the menu. Please try again or contact the restaurant.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${menuData.restaurant.name} - Digital Menu`,
          text: `Check out the menu at ${menuData.restaurant.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
      alert("Menu link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Enhanced Header */}
      <div ref={headerRef} className="bg-white shadow-lg sticky top-0 z-50">
        <div className="relative">
          {/* Hero Section */}
          <div className="h-40 sm:h-48 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-float"></div>
              <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full animate-float-delayed"></div>
              <div className="absolute bottom-8 left-12 w-10 h-10 bg-white rounded-full animate-float"></div>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 backdrop-blur-sm"
              aria-label="Share menu"
            >
              <Share2 size={18} />
            </button>

            {/* Restaurant Badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <span className="text-gray-800 font-medium text-sm">Digital Menu</span>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="px-4 sm:px-6 py-6 bg-white">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {menuData.restaurant.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {menuData.restaurant.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                    <span>{menuData.restaurant.address}</span>
                  </div>
                )}
                {menuData.restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-orange-500 flex-shrink-0" />
                    <span>{menuData.restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="relative mb-4">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-base bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Enhanced Category Filter */}
          <div className="px-4 sm:px-6 pb-4 bg-white border-b-2 border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Items
              </button>
              {menuData.categories.map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (selectedCategory === "all") {
                      scrollToCategory(category.id);
                    }
                  }}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
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

      {/* Enhanced Menu Content */}
      <div className="px-4 sm:px-6 py-6">
        {selectedCategory === "all" ? (
          <div className="space-y-8">
            {menuData.categories
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((category: Category) => {
                const categoryItems = getItemsForCategory(category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category.id} id={`category-${category.id}`}>
                    <div className="sticky top-[240px] sm:top-[252px] bg-white/95 backdrop-blur-sm py-3 mb-4 rounded-xl shadow-sm border border-gray-100 z-40">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 px-4">
                        {category.name}
                      </h2>
                    </div>
                    <div className="grid gap-4">
                      {categoryItems.map((item) => (
                        <EnhancedMenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item: MenuItem) => (
              <EnhancedMenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No dishes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or browse different categories
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View All Items
            </button>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Enhanced Footer */}
      <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 sm:px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">Q</span>
            </div>
            <div>
              <span className="font-bold text-lg">Qrunchy</span>
              <p className="text-gray-400 text-sm">Digital menus made simple</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs">
            Scan. Browse. Order. The future of dining is here.
          </p>
        </div>
      </div>
    </div>
  );
}

interface EnhancedMenuItemCardProps {
  item: MenuItem;
}

function EnhancedMenuItemCard({ item }: EnhancedMenuItemCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const hasVariantsOrAddons = item.variants.length > 0 || item.addons.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        {/* Item Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ৳{item.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Variants and Addons Badges */}
        {hasVariantsOrAddons && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.variants.map((variant) => (
              <span
                key={variant.id}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
              >
                {variant.title} ({variant.options.length} options)
              </span>
            ))}
            {item.addons.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                +{item.addons.length} add-on{item.addons.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Details Toggle */}
        {hasVariantsOrAddons && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
              aria-expanded={showDetails}
            >
              {showDetails ? "Hide options" : "View options"}
              <ChevronDown 
                size={16} 
                className={`transition-transform ${showDetails ? "rotate-180" : ""}`} 
              />
            </button>

            {/* Enhanced Details Panel */}
            {showDetails && (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
                {item.variants.map((variant) => (
                  <div key={variant.id}>
                    <h4 className="font-bold text-gray-900 mb-3 text-base">
                      {variant.title}:
                    </h4>
                    <div className="grid gap-2">
                      {variant.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {option.name}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
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
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Add-ons:</h4>
                    <div className="grid gap-2">
                      {item.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {addon.name}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
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

// Add these animations to your CSS
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3s ease-in-out infinite 1.5s;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;