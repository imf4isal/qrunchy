import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Share2,
  MapPin,
  Phone,
  ChevronDown,
  ArrowUp,
  Filter,
  Star,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    if (!menuData) return [];

    let items = menuData.items as MenuItem[];

    if (selectedCategory !== "all") {
      items = items.filter((item) => item.categoryId === selectedCategory);
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
    return filteredItems.filter((item) => item.categoryId === categoryId);
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-blue-50 rounded-2xl mx-auto flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xl">
              <Sparkles className="text-blue-600 animate-pulse" size={32} />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-blue-500/20 rounded-2xl mx-auto animate-ping"></div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">
            Preparing your menu
          </p>
          <p className="text-white/70 text-sm mb-6">
            Just a moment while we load everything...
          </p>
          <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 backdrop-blur-xl">
            <span className="text-white text-4xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Menu Unavailable
          </h2>
          <p className="text-white/70 text-base mb-8">
            We're having trouble loading this menu. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/10"
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <div className="relative px-6 py-16">
          <button
            onClick={handleShare}
            className="absolute top-8 right-6 bg-white/5 hover:bg-white/15 backdrop-blur-2xl text-white p-3 rounded-2xl border border-white/10 transition-all hover:scale-110 shadow-lg group"
          >
            <Share2
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
          </button>

          <div className="text-center text-white max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-blue-500/20 rounded-3xl mr-4 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="text-left">
                <span className="text-white font-semibold text-lg block">
                  Qrunchy
                </span>
                <span className="text-white/60 text-sm">
                  Digital Menu Experience
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
              {menuData.restaurant.name}
            </h1>

            <div className="flex flex-col items-center gap-4 mb-10">
              {menuData.restaurant.address && (
                <div className="flex items-center gap-4 text-white/90 bg-white/5 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-blue-300" />
                  </div>
                  <span className="text-sm">{menuData.restaurant.address}</span>
                </div>
              )}
              {menuData.restaurant.phone && (
                <div className="flex items-center gap-4 text-white/90 bg-white/5 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-green-300" />
                  </div>
                  <span className="text-sm">{menuData.restaurant.phone}</span>
                </div>
              )}
            </div>

            <div className="relative max-w-lg mx-auto">
              <Search
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-300"
                size={22}
              />
              <input
                type="text"
                placeholder="Search for your favorite dishes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl focus:bg-white/10 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none transition-all text-white placeholder:text-white/50 shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 py-8">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-6 py-3 rounded-3xl text-sm font-semibold transition-all transform hover:scale-105 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-white to-blue-50 text-slate-900 shadow-2xl border border-white/20"
                : "bg-white/5 text-white hover:bg-white/15 backdrop-blur-2xl border border-white/10 shadow-lg"
            }`}
          >
            🍽️ All Dishes
          </button>
          {menuData.categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-3xl text-sm font-semibold transition-all transform hover:scale-105 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-white to-blue-50 text-slate-900 shadow-2xl border border-white/20"
                  : "bg-white/5 text-white hover:bg-white/15 backdrop-blur-2xl border border-white/10 shadow-lg"
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
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                          <Sparkles size={14} className="text-blue-300" />
                        </div>
                        {category.name}
                      </h2>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
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
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center backdrop-blur-xl border border-white/10">
              <Search size={32} className="text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              No dishes found
            </h3>
            <p className="text-white/70 text-base mb-10 max-w-md mx-auto">
              We couldn't find any dishes matching your search. Try browsing
              other categories or clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl transform hover:scale-105 border border-white/10"
            >
              Browse All Dishes
            </button>
          </div>
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50 border border-white/20 backdrop-blur-xl"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Footer */}
      <div className="bg-black/10 backdrop-blur-2xl px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-md mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-blue-500/20 rounded-3xl mr-6 flex items-center justify-center backdrop-blur-xl border border-white/10">
              <Sparkles className="text-white" size={28} />
            </div>
            <div className="text-left">
              <span className="font-semibold text-white text-xl block">
                Qrunchy
              </span>
              <span className="text-white/50 text-sm">
                Elevating your dining experience
              </span>
            </div>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">
            Powered by modern technology to bring you the most delightful way to
            explore restaurant menus
          </p>
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
  const [isLiked, setIsLiked] = useState<boolean>(false);

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white group">
      <div className="p-8 relative">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-6 right-6 p-2 rounded-full transition-all hover:bg-gray-100 group-hover:scale-110"
        >
          <Heart
            size={20}
            className={`transition-all ${isLiked ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"}`}
          />
        </button>

        <div className="flex justify-between items-start mb-6 pr-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {item.name}
              </h3>
              {Math.random() > 0.7 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200">
                  <Star size={14} className="text-yellow-600 fill-current" />
                  <span className="text-yellow-700 text-xs font-bold">
                    Popular
                  </span>
                </div>
              )}
            </div>
            {item.description && (
              <p className="text-gray-600 leading-relaxed text-base">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ৳{item.price.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock size={16} />
            <span>5-10 min</span>
          </div>
        </div>

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-8">
            {item.variants.map((variant) => (
              <span
                key={variant.id}
                className="inline-flex items-center px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-bold border border-blue-200 shadow-sm"
              >
                ✨ {variant.title} ({variant.options.length})
              </span>
            ))}
            {item.addons.length > 0 && (
              <span className="inline-flex items-center px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-sm font-bold border border-emerald-200 shadow-sm">
                🍽️ +{item.addons.length} add-on
                {item.addons.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {(item.variants.length > 0 || item.addons.length > 0) && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-3 text-blue-600 font-bold hover:text-blue-800 transition-all hover:bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              {showDetails ? "🔼 Hide Options" : "🔽 View Options"}
              <ChevronDown
                size={18}
                className={`transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </button>

            {showDetails && (
              <div className="mt-10 pt-8 border-t border-gray-200 space-y-10">
                {item.variants.map((variant) => (
                  <div key={variant.id}>
                    <h4 className="font-bold text-gray-900 mb-6 text-lg flex items-center gap-2">
                      <Sparkles size={18} className="text-blue-500" />
                      {variant.title}
                    </h4>
                    <div className="space-y-4">
                      {variant.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                        >
                          <span className="font-semibold text-gray-800">
                            {option.name}
                          </span>
                          <span className="font-bold text-blue-600 bg-white px-3 py-1 rounded-full text-sm">
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
                    <h4 className="font-bold text-gray-900 mb-6 text-lg flex items-center gap-2">
                      <span className="text-emerald-500">🍽️</span>
                      Add-ons
                    </h4>
                    <div className="space-y-4">
                      {item.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl border border-emerald-100 hover:from-emerald-100 hover:to-green-100 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                        >
                          <span className="font-semibold text-emerald-800">
                            {addon.name}
                          </span>
                          <span className="font-bold text-emerald-600 bg-white px-3 py-1 rounded-full text-sm">
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
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
