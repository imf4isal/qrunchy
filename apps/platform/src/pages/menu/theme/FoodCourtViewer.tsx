import { useState, useMemo } from "react";
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

  // Get food court data
  const {
    data: foodCourtData,
    isLoading,
    error,
  } = trpc.foodCourt.getByQrCode.useQuery({ qr_code: qrCode });

  // Search functionality
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = trpc.foodCourt.searchItems.useQuery(
    {
      food_court_id: foodCourtData?.foodCourt?.id || 0,
      query: searchQuery,
    },
    {
      enabled: Boolean(foodCourtData?.foodCourt?.id && searchQuery.length > 2),
    }
  );

  // Handle loading states
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

  if (!foodCourtData?.foodCourt) {
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  const { foodCourt } = foodCourtData;
  const hasSearchResults = searchQuery.length > 2 && searchResults?.results;

  // Filter restaurants based on search or show all
  const displayedContent = useMemo(() => {
    if (hasSearchResults) {
      return {
        type: "search" as const,
        results: searchResults.results,
      };
    }
    return {
      type: "restaurants" as const,
      restaurants: foodCourt.restaurants,
    };
  }, [hasSearchResults, searchResults, foodCourt.restaurants]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(value.length > 2);
  };

  const handleItemClick = (result: SearchResult) => {
    // Navigate to restaurant menu with item highlighted
    // For now, we'll use a simple redirect to the restaurant - QR codes would need to be fetched separately
    window.location.href = `/dashboard/restaurant/${result.restaurant_id}/menu`;
  };

  const formatPrice = (price: string) => {
    return `৳${parseFloat(price).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{foodCourt.name}</h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Food Court • {foodCourt.restaurants.length} Restaurants
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search restaurants, categories, or items..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Results */}
        {displayedContent.type === "search" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({displayedContent.results?.length || 0})
              </h2>
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="text-sm"
              >
                Clear Search
              </Button>
            </div>

            {searchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            ) : displayedContent.results && displayedContent.results.length > 0 ? (
              <div className="grid gap-4">
                {displayedContent.results.map((result) => (
                  <Card
                    key={`${result.restaurant_id}-${result.item_id}`}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {result.item_image_url && (
                          <img
                            src={result.item_image_url}
                            alt={result.item_name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {result.item_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {result.category_name} • {result.restaurant_name}
                              </p>
                              {result.item_description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {result.item_description}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="font-bold text-lg text-gray-900">
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
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try searching with different keywords or browse restaurants below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Restaurant Grid */}
        {displayedContent.type === "restaurants" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurants ({foodCourt.restaurants.length})
            </h2>

            {foodCourt.restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodCourt.restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {restaurant.name}
                          </h3>
                          {restaurant.address && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {restaurant.address}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>{restaurant.category_count} categories</span>
                            <span>•</span>
                            <span>{restaurant.item_count} items</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-blue-50 group-hover:border-blue-200"
                          onClick={(e) => {
                            e.preventDefault();
                            // For now, redirect to dashboard view - would need actual restaurant QR codes
                            window.location.href = `/dashboard/restaurant/${restaurant.id}/menu`;
                          }}
                        >
                          View Menu
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
                <p className="text-gray-600">
                  This food court doesn't have any restaurants set up yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            Powered by <span className="font-semibold text-blue-600">Qrunchy</span>
          </p>
        </div>
      </div>
    </div>
  );
}