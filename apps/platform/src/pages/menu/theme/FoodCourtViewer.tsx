import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { Search, Store, ChefHat, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import InactiveFoodCourtScreen from "../components/InactiveFoodCourtScreen";
import { Link } from "wouter";

interface FoodCourtViewerProps {
  qrCode: string;
}

interface SearchResult {
  item_id: number;
  item_name: string;
  item_description: string | null;
  item_price: string;
  item_image_url: string | null;
  category_name: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_theme_id: string;
}

export default function FoodCourtViewer({ qrCode }: FoodCourtViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get food court data - using any type temporarily to fix router collision
  const {
    data: foodCourtData,
    isLoading,
    error,
  } = (trpc as any).foodCourt.getByQrCode.useQuery({ qr_code: qrCode });

  // Search functionality
  const { data: searchResults, isLoading: searchLoading } =
    (trpc as any).foodCourt.searchItems.useQuery(
      {
        food_court_id: foodCourtData?.foodCourt?.id || 0,
        query: searchQuery,
      },
      {
        enabled: Boolean(
          foodCourtData?.foodCourt?.id && searchQuery.length > 2
        ),
      }
    );

  // Get QR codes for all restaurants in the food court
  const { data: restaurantQrData } =
    (trpc as any).foodCourt.getRestaurantQrCodes.useQuery(
      { id: foodCourtData?.foodCourt?.id || 0 },
      { enabled: !!foodCourtData?.foodCourt?.id }
    );

  // Pre-compute values that will be used in render
  const foodCourt = foodCourtData?.foodCourt;
  const hasSearchResults = searchQuery.length > 2 && searchResults?.results;

  // Filter restaurants based on search or show all - must be called before any early returns
  const displayedContent = useMemo(() => {
    if (hasSearchResults) {
      return {
        type: "search" as const,
        results: searchResults.results,
      };
    }
    return {
      type: "restaurants" as const,
      restaurants: foodCourt?.restaurants || [],
    };
  }, [hasSearchResults, searchResults, foodCourt?.restaurants]);

  // Add loading animation effect
  useEffect(() => {
    if (!isLoading && foodCourt) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, foodCourt]);

  // Handle loading states - AFTER all hooks are called
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    // Check if it's an inactive food court error
    if (error.message.includes("pending activation")) {
      return <InactiveFoodCourtScreen foodCourtName={qrCode} />;
    }
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  if (!foodCourt) {
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(value.length > 2);
  };

  // Helper function to get restaurant menu URL
  const getRestaurantMenuUrl = (restaurantId: number) => {
    const qrCode = restaurantQrData?.restaurant_qr_codes?.[restaurantId];

    if (qrCode) {
      // Use the QR code to navigate to the restaurant menu
      return `/menu/${qrCode}`;
    }

    // Fallback: if no QR code is found, redirect to dashboard
    return `/dashboard/restaurant/${restaurantId}/menu`;
  };

  const handleItemClick = (result: SearchResult) => {
    // Navigate to restaurant menu with item highlighted
    const menuUrl = getRestaurantMenuUrl(result.restaurant_id);
    window.location.href = menuUrl;
  };

  const formatPrice = (price: string) => {
    return `৳${parseFloat(price).toFixed(0)}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gray-400/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gray-600/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/2 rounded-full blur-3xl"></div>
      </div>
      {/* Compact Mobile Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Food Court Info */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
              {foodCourt.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-gray-500" />
                {foodCourt.restaurants.length} restaurant{foodCourt.restaurants.length !== 1 ? 's' : ''}
              </span>
              {foodCourt.address && (
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{foodCourt.address}</span>
                </span>
              )}
            </div>
          </div>

          {/* Compact Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search food, restaurants..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 transition-all duration-200 placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Search Results */}
        {displayedContent.type === "search" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Search Results
                </h2>
                <p className="text-sm text-gray-600">
                  {displayedContent.results?.length || 0} item{(displayedContent.results?.length || 0) !== 1 ? 's' : ''} found
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-sm"
              >
                Clear
              </Button>
            </div>

            {searchLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 relative mx-auto mb-3">
                  <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-gray-900 rounded-full animate-spin border-l-transparent border-b-transparent"></div>
                </div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            ) : displayedContent.results &&
              displayedContent.results.length > 0 ? (
              <div className="space-y-3">
                {displayedContent.results.map((result, index) => (
                  <Card
                    key={`${result.restaurant_id}-${result.item_id}`}
                    className={`group bg-white border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}
                    onClick={() => handleItemClick(result)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {result.item_image_url ? (
                          <div className="flex-shrink-0">
                            <img
                              src={result.item_image_url}
                              alt={result.item_name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ChefHat className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate mb-1">
                                {result.item_name}
                              </h3>
                              <p className="text-xs text-gray-600 mb-1">
                                {result.category_name} • {result.restaurant_name}
                              </p>
                              {result.item_description && (
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                  {result.item_description}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <p className="font-semibold text-lg text-gray-900">
                                {formatPrice(result.item_price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-sm text-gray-600 px-4">
                  Try different keywords or browse restaurants below
                </p>
              </div>
            )}
          </div>
        )}

        {/* Restaurant List */}
        {displayedContent.type === "restaurants" && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Restaurants
              </h2>
              <p className="text-sm text-gray-600">
                {foodCourt.restaurants.length} restaurant{foodCourt.restaurants.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {foodCourt.restaurants.length > 0 ? (
              <div className="space-y-3">
                {foodCourt.restaurants.map((restaurant, index) => (
                  <Card
                    key={restaurant.id}
                    className={`group bg-white border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={(e) => {
                      e.preventDefault();
                      const menuUrl = getRestaurantMenuUrl(restaurant.id);
                      window.location.href = menuUrl;
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ChefHat className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span>{restaurant.category_count} categories</span>
                              <span>•</span>
                              <span>{restaurant.item_count} items</span>
                            </div>
                            {restaurant.address && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {restaurant.address}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors ml-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Store className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  No restaurants yet
                </h3>
                <p className="text-sm text-gray-600 px-4">
                  This food court is still preparing. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div className="mt-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-500 text-xs">
            Powered by{" "}
            <span className="font-medium text-gray-700">Qrunchy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
