import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "wouter";
import {
  Search,
  Share2,
  MapPin,
  Phone,
  ChevronDown,
  ArrowUp,
  X,
  Plus,
} from "lucide-react";
import type { Category, MenuItem } from "@/types/digitalMenu";

const DummyDigitalMenu: React.FC = () => {
  const params = useParams<{ name: string }>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Extract and format restaurant name from URL
  const restaurantName = params.name 
    ? decodeURIComponent(params.name)
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Demo Restaurant';

  // Dummy menu data with proper structure including variants and addons
  const menuData = useMemo(() => ({
    restaurant: {
      name: restaurantName,
      address: "123 Demo Street, Food City",
      phone: "+1 (555) 123-4567"
    },
    categories: [
      {
        id: "1",
        name: "Appetizers",
        sortOrder: 1
      },
      {
        id: "2",
        name: "Main Courses",
        sortOrder: 2
      },
      {
        id: "3",
        name: "Desserts",
        sortOrder: 3
      },
      {
        id: "4", 
        name: "Beverages",
        sortOrder: 4
      }
    ] as Category[],
    items: [
      {
        id: "1",
        name: "Crispy Calamari",
        price: 12.99,
        description: "Fresh squid rings with marinara sauce and lemon",
        image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "1",
        variants: [
          {
            id: "1-v1",
            title: "Size",
            options: [
              { id: "1-v1-o1", name: "Regular", price: 0 },
              { id: "1-v1-o2", name: "Large", price: 4.00 }
            ]
          }
        ],
        addons: [
          { id: "1-a1", name: "Extra marinara", price: 1.50 },
          { id: "1-a2", name: "Spicy aioli", price: 2.00 }
        ]
      },
      {
        id: "2", 
        name: "Buffalo Wings",
        price: 14.99,
        description: "8 pieces with blue cheese dip and celery sticks",
        image_url: "https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "1",
        variants: [
          {
            id: "2-v1",
            title: "Heat Level",
            options: [
              { id: "2-v1-o1", name: "Mild", price: 0 },
              { id: "2-v1-o2", name: "Medium", price: 0 },
              { id: "2-v1-o3", name: "Hot", price: 0 },
              { id: "2-v1-o4", name: "Inferno", price: 1.00 }
            ]
          }
        ],
        addons: [
          { id: "2-a1", name: "Extra blue cheese", price: 1.00 },
          { id: "2-a2", name: "Extra celery", price: 0.50 }
        ]
      },
      {
        id: "3",
        name: "Loaded Nachos", 
        price: 16.99,
        description: "Cheese, jalapeños, sour cream, guacamole, and salsa",
        image_url: "https://plus.unsplash.com/premium_photo-1673809798970-30c14cfd0ab6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "1",
        variants: [],
        addons: [
          { id: "3-a1", name: "Extra guac", price: 2.50 },
          { id: "3-a2", name: "Pulled pork", price: 4.00 },
          { id: "3-a3", name: "Grilled chicken", price: 3.50 }
        ]
      },
      {
        id: "4",
        name: "Grilled Salmon",
        price: 28.99, 
        description: "Atlantic salmon with seasonal vegetables and herb butter",
        image_url: "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "2",
        variants: [
          {
            id: "4-v1",
            title: "Cooking Style",
            options: [
              { id: "4-v1-o1", name: "Grilled", price: 0 },
              { id: "4-v1-o2", name: "Blackened", price: 2.00 },
              { id: "4-v1-o3", name: "Cedar Plank", price: 4.00 }
            ]
          }
        ],
        addons: [
          { id: "4-a1", name: "Lemon butter sauce", price: 2.00 },
          { id: "4-a2", name: "Side of rice", price: 3.00 }
        ]
      },
      {
        id: "5",
        name: "BBQ Burger",
        price: 18.99,
        description: "Angus beef, bacon, cheese, BBQ sauce, and crispy onions",
        image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "2",
        variants: [
          {
            id: "5-v1",
            title: "Patty",
            options: [
              { id: "5-v1-o1", name: "Beef", price: 0 },
              { id: "5-v1-o2", name: "Turkey", price: 1.00 },
              { id: "5-v1-o3", name: "Plant-based", price: 2.00 }
            ]
          },
          {
            id: "5-v2",
            title: "Cheese",
            options: [
              { id: "5-v2-o1", name: "Cheddar", price: 0 },
              { id: "5-v2-o2", name: "Swiss", price: 0 },
              { id: "5-v2-o3", name: "Blue cheese", price: 1.50 }
            ]
          }
        ],
        addons: [
          { id: "5-a1", name: "Extra bacon", price: 3.00 },
          { id: "5-a2", name: "Avocado", price: 2.50 },
          { id: "5-a3", name: "Fries upgrade", price: 2.00 }
        ]
      },
      {
        id: "6",
        name: "Chicken Alfredo",
        price: 22.99,
        description: "Creamy pasta with grilled chicken and parmesan",
        image_url: "https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "2",
        variants: [
          {
            id: "6-v1",
            title: "Pasta",
            options: [
              { id: "6-v1-o1", name: "Fettuccine", price: 0 },
              { id: "6-v1-o2", name: "Penne", price: 0 },
              { id: "6-v1-o3", name: "Gluten-free", price: 3.00 }
            ]
          }
        ],
        addons: [
          { id: "6-a1", name: "Extra chicken", price: 4.00 },
          { id: "6-a2", name: "Broccoli", price: 2.00 },
          { id: "6-a3", name: "Garlic bread", price: 3.50 }
        ]
      },
      {
        id: "7",
        name: "Chocolate Lava Cake",
        price: 9.99,
        description: "Warm chocolate cake with vanilla ice cream",
        image_url: "https://plus.unsplash.com/premium_photo-1673809798970-30c14cfd0ab6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "3",
        variants: [],
        addons: [
          { id: "7-a1", name: "Extra ice cream", price: 2.00 },
          { id: "7-a2", name: "Fresh berries", price: 3.00 }
        ]
      },
      {
        id: "8",
        name: "Tiramisu",
        price: 8.99,
        description: "Classic Italian dessert with coffee and mascarpone",
        image_url: "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "3",
        variants: [],
        addons: [
          { id: "8-a1", name: "Espresso shot", price: 1.50 }
        ]
      },
      {
        id: "9",
        name: "Fresh Lemonade",
        price: 4.99,
        description: "House-made with fresh lemons and mint",
        image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "4",
        variants: [
          {
            id: "9-v1",
            title: "Size",
            options: [
              { id: "9-v1-o1", name: "Regular", price: 0 },
              { id: "9-v1-o2", name: "Large", price: 1.50 }
            ]
          }
        ],
        addons: [
          { id: "9-a1", name: "Extra mint", price: 0.50 }
        ]
      },
      {
        id: "10",
        name: "Coffee",
        price: 3.99,
        description: "Freshly brewed dark roast coffee",
        image_url: "https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: "4",
        variants: [
          {
            id: "10-v1",
            title: "Size",
            options: [
              { id: "10-v1-o1", name: "Small", price: 0 },
              { id: "10-v1-o2", name: "Medium", price: 1.00 },
              { id: "10-v1-o3", name: "Large", price: 2.00 }
            ]
          }
        ],
        addons: [
          { id: "10-a1", name: "Extra shot", price: 1.50 },
          { id: "10-a2", name: "Oat milk", price: 0.75 },
          { id: "10-a3", name: "Vanilla syrup", price: 0.50 }
        ]
      }
    ] as MenuItem[]
  }), [restaurantName]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    let items = menuData.items;

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
  }, [menuData.items, searchTerm, selectedCategory]);

  const getItemsForCategory = (categoryId: string): MenuItem[] => {
    return filteredItems.filter((item) => item.categoryId === categoryId);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 text-slate-900">
      {/* Top sticky header */}
      <div className="bg-white/75 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="relative">
          {/* Hero bar */}
          <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />

            <button
              onClick={handleShare}
              aria-label="Share menu"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Share2 size={18} />
            </button>

            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-sm">
                  <span className="text-white font-bold text-xs">Q</span>
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Demo Menu
                </span>
              </div>
            </div>
          </div>

          {/* Restaurant header - Compact version */}
          <div className="px-6 py-6 bg-white">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {menuData.restaurant.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">
                      {menuData.restaurant.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search - Better positioned */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  aria-label="Search menu items"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200/50 transition-all text-sm placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="px-6 pb-6 bg-white border-b border-slate-100">
            <div className="mx-auto max-w-5xl">
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    aria-selected={selectedCategory === "all"}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 ${
                      selectedCategory === "all"
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    All
                  </button>
                  {menuData.categories.map((category: Category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      aria-selected={selectedCategory === category.id}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 ${
                        selectedCategory === category.id
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {/* edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {selectedCategory === "all" ? (
            <div className="space-y-12">
              {menuData.categories
                .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                .map((category: Category) => {
                  const categoryItems = getItemsForCategory(category.id);
                  if (categoryItems.length === 0) return null;

                  return (
                    <section key={category.id}>
                      <div className="sticky top-[180px] bg-gradient-to-b from-white via-white to-white/95 backdrop-blur-sm py-4 mb-8 z-40 -mx-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-slate-900 to-slate-600 rounded-full"></div>
                          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            {category.name}
                          </h2>
                        </div>
                        {/* Subtle fade line */}
                        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryItems.map((item) => (
                          <MenuItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  );
                })}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No dishes found
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Try adjusting your search or browse different categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40"
              >
                View all items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-xl text-slate-900 p-3 rounded-2xl shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-all hover:scale-105 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer - Consistent with landing page */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">Q</span>
              </div>
              <span className="font-semibold text-slate-900">Qrunchy</span>
              <span className="text-slate-500">© {new Date().getFullYear()}</span>
            </div>
            <div className="text-slate-400 text-xs">
              Powered by digital menus
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
}

function MenuItemCard({ item }: MenuItemCardProps) {
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-200 group">
        {/* Fixed aspect ratio image */}
        {item.image_url && (
          <div className="aspect-[4/3] relative overflow-hidden">
            <img 
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Subtle overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        )}
        
        <div className="p-5">
          {/* Compact item info */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="text-lg font-bold text-slate-900">
                ৳{item.price.toFixed(0)}
              </span>
            </div>
          </div>
          
          {/* Compact options indicators */}
          {(item.variants.length > 0 || item.addons.length > 0) && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex gap-2 flex-wrap">
                {item.variants.length > 0 && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                    {item.variants.length} option{item.variants.length > 1 ? 's' : ''}
                  </span>
                )}
                {item.addons.length > 0 && (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                    +{item.addons.length} add-on{item.addons.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowOptionsModal(true)}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors px-2 py-1 rounded-md hover:bg-slate-50"
              >
                View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <OptionsModal 
          item={item} 
          onClose={() => setShowOptionsModal(false)} 
        />
      )}
    </>
  );
}

interface OptionsModalProps {
  item: MenuItem;
  onClose: () => void;
}

function OptionsModal({ item, onClose }: OptionsModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[75vh] overflow-hidden flex flex-col shadow-xl transform animate-slide-up sm:animate-scale-in border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 leading-tight truncate">
              {item.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Base: ৳{item.price.toFixed(0)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-3 flex-shrink-0"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>
        
        {/* Compact Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {item.variants.map((variant) => (
            <div key={variant.id}>
              <h4 className="font-medium text-slate-800 mb-2 text-xs uppercase tracking-wide">
                {variant.title}
              </h4>
              <div className="space-y-1.5">
                {variant.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between py-2 px-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-lg transition-colors"
                  >
                    <span className="text-slate-700 text-sm">
                      {option.name}
                    </span>
                    <span className="font-medium text-slate-900 text-sm">
                      {option.price > 0 ? `+৳${option.price.toFixed(0)}` : 'Free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {item.addons.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-800 mb-2 text-xs uppercase tracking-wide">
                Add-ons
              </h4>
              <div className="space-y-1.5">
                {item.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between py-2 px-3 bg-emerald-50/60 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <span className="text-emerald-700 text-sm">
                      {addon.name}
                    </span>
                    <span className="font-medium text-emerald-800 text-sm">
                      +৳{addon.price.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Simple Close Area */}
        <div className="p-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Add styles for scrollbar hiding and animations
const styles = `
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    transform: translateY(100%);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from { 
    transform: scale(0.95);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default DummyDigitalMenu;