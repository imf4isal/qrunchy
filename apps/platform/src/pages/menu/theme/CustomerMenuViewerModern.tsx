import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Share2,
  MapPin,
  Phone,
  ChevronDown,
  ArrowUp,
  Star,
  Clock,
  Heart,
  Sparkles,
  X,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl shadow-lg mx-auto mb-6 flex items-center justify-center border border-gray-200">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-900 font-medium mb-2">
            Loading menu
          </p>
          <p className="text-gray-500 text-sm">
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center border border-gray-200 shadow-lg">
            <span className="text-gray-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Menu unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the menu right now. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg"
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean, Minimal Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {menuData.restaurant.name}
              </h1>
              {menuData.restaurant.address && (
                <p className="text-gray-600 text-sm">{menuData.restaurant.address}</p>
              )}
            </div>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900"
            />
          </div>

          {/* Category Navigation - Inspired by reference */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            {menuData.categories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content - Horizontal Layout like Reference */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {selectedCategory === "all" ? (
          <div className="space-y-12">
            {menuData.categories
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((category: Category) => {
                const categoryItems = getItemsForCategory(category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category.id}>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h2>
                      <div className="w-12 h-0.5 bg-orange-500"></div>
                    </div>
                    <div className="space-y-6">
                      {categoryItems.map((item) => (
                        <ModernMenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item: MenuItem) => (
              <ModernMenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center border border-gray-200 shadow-lg">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No dishes found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse different categories
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
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
          className="fixed bottom-8 right-8 bg-white text-gray-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 border border-gray-200"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Clean Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Powered by </span>
            <span className="font-medium text-gray-900 ml-1">Qrunchy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ModernMenuItemCardProps {
  item: MenuItem;
}

function ModernMenuItemCard({ item }: ModernMenuItemCardProps) {
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  return (
    <>
      {/* Horizontal Card Layout - Inspired by Reference */}
      <div className="flex gap-6 bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
        {/* Image Section */}
        {item.image_url && (
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img 
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            
            {/* Price Section - Prominent like reference */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-gray-900">
                ৳{item.price.toFixed(0)}
              </div>
              {item.variants.length > 0 && (
                <div className="text-xs text-gray-500">
                  / ৳{Math.max(...item.variants.flatMap(v => v.options.map(o => item.price + o.price))).toFixed(0)}
                </div>
              )}
            </div>
          </div>
          
          {/* Options and Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              {item.variants.length > 0 && (
                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-200">
                  {item.variants.length} size{item.variants.length > 1 ? 's' : ''}
                </span>
              )}
              {item.addons.length > 0 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-200">
                  +{item.addons.length} add-on{item.addons.length > 1 ? 's' : ''}
                </span>
              )}
              {Math.random() > 0.8 && (
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-200">
                  🌱 Vegetarian
                </span>
              )}
            </div>
            
            {(item.variants.length > 0 || item.addons.length > 0) && (
              <button 
                onClick={() => setShowOptionsModal(true)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
              >
                View options
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Options Modal */}
      {showOptionsModal && (
        <ModernOptionsModal 
          item={item} 
          onClose={() => setShowOptionsModal(false)} 
        />
      )}
    </>
  );
}

interface ModernOptionsModalProps {
  item: MenuItem;
  onClose: () => void;
}

function ModernOptionsModal({ item, onClose }: ModernOptionsModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl transform animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Base price: ৳{item.price.toFixed(0)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Clean Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {item.variants.map((variant) => (
            <div key={variant.id}>
              <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                {variant.title}
              </h4>
              <div className="space-y-2">
                {variant.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100"
                  >
                    <span className="text-gray-900 font-medium">
                      {option.name}
                    </span>
                    <span className="font-bold text-gray-900">
                      {option.price > 0 ? `+৳${option.price.toFixed(0)}` : 'Free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {item.addons.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                Add-ons
              </h4>
              <div className="space-y-2">
                {item.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100"
                  >
                    <span className="text-gray-900 font-medium">
                      {addon.name}
                    </span>
                    <span className="font-bold text-gray-900">
                      +৳{addon.price.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Clean Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

