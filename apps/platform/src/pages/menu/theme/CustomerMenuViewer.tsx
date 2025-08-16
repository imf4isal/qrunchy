import React, { useState, useMemo, useEffect } from "react";
import { Search, Share2, MapPin, Phone, ChevronDown, ArrowUp } from "lucide-react";
import { trpc } from "@/utils/trpc";
import type { Category, MenuItem } from "@/types/digitalMenu";

interface CustomerMenuViewerProps {
  qrCode?: string;
}

export default function CustomerMenuViewer({
  qrCode,
}: CustomerMenuViewerProps) {
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

  // Debug logging to check if image URLs are coming from backend
  React.useEffect(() => {
    if (menuData) {
      console.log('🔍 CustomerMenuViewer - Full menuData:', menuData);
      console.log('🔍 CustomerMenuViewer - Menu items with image URLs:', 
        menuData.items?.map((item: any) => ({ 
          id: item.id, 
          name: item.name, 
          image_url: item.image_url 
        }))
      );
      const itemsWithImages = menuData.items?.filter((item: any) => item.image_url);
      console.log('🔍 CustomerMenuViewer - Items that have images:', itemsWithImages?.length || 0);
      if (itemsWithImages && itemsWithImages.length > 0) {
        console.log('🔍 CustomerMenuViewer - First item with image:', itemsWithImages[0]);
      }
    }
  }, [menuData]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 text-xl font-semibold">Loading menu</p>
          <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-100">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Menu unavailable</h2>
          <p className="text-slate-600 text-lg mb-6">We couldn't load the menu right now. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try again
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
            
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 transition-all hover:scale-105"
            >
              <Share2 size={18} />
            </button>

            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-xs">Q</span>
                </div>
                <span className="text-white/80 text-sm font-medium">Digital Menu</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 bg-white">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                {menuData.restaurant.name}
              </h1>

              <div className="flex flex-col gap-3">
                {menuData.restaurant.address && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-slate-500" />
                    </div>
                    <span className="text-sm">{menuData.restaurant.address}</span>
                  </div>
                )}
                {menuData.restaurant.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-slate-500" />
                    </div>
                    <span className="text-sm">{menuData.restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="px-6 pb-6 bg-white border-b border-slate-100">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                All
              </button>
              {menuData.categories.map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {selectedCategory === "all" ? (
          <div className="space-y-12">
            {menuData.categories
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((category: Category) => {
                const categoryItems = getItemsForCategory(category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category.id}>
                    <div className="sticky top-[200px] bg-white/90 backdrop-blur-xl py-4 mb-6 z-40 -mx-6 px-6 border-b border-slate-100">
                      <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                        {category.name}
                      </h2>
                    </div>
                    <div className="grid gap-6">
                      {categoryItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredItems.map((item: MenuItem) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No dishes found</h3>
            <p className="text-slate-600 text-sm mb-6">
              Try adjusting your search or browse different categories
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all"
            >
              View all items
            </button>
          </div>
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-2xl mr-3 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="font-bold text-white">Q</span>
            </div>
            <div className="text-left">
              <span className="font-semibold text-white text-lg block">Qrunchy</span>
              <span className="text-white/60 text-sm">Digital menus made simple</span>
            </div>
          </div>
          <p className="text-white/40 text-xs">Scan. Browse. Order. The future of dining.</p>
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
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1">
      <div className={`${item.image_url ? 'md:flex' : ''}`}>
        {item.image_url && (
          <div className="md:w-2/5 lg:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div className={`p-8 ${item.image_url ? 'md:w-3/5 lg:w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-slate-900">
              ৳{item.price.toFixed(2)}
            </div>
          </div>
        </div>

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {item.variants.map((variant) => (
              <span
                key={variant.id}
                className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
              >
                {variant.title} ({variant.options.length})
              </span>
            ))}
            {item.addons.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                +{item.addons.length} add-on{item.addons.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors"
            >
              {showDetails ? "Hide options" : "View options"}
              <ChevronDown 
                size={16} 
                className={`transition-transform ${showDetails ? "rotate-180" : ""}`} 
              />
            </button>

            {showDetails && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-8">
                {item.variants.map((variant) => (
                  <div key={variant.id}>
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm">
                      {variant.title}
                    </h4>
                    <div className="space-y-3">
                      {variant.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors"
                        >
                          <span className="font-medium text-slate-700 text-sm">
                            {option.name}
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">
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
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm">Add-ons</h4>
                    <div className="space-y-3">
                      {item.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                        >
                          <span className="font-medium text-emerald-800 text-sm">
                            {addon.name}
                          </span>
                          <span className="font-semibold text-emerald-900 text-sm">
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
