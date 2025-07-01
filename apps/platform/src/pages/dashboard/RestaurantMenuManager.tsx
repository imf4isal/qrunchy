import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Eye, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuBuilder from "@/pages/digitalmenu/MenuBuilder";
import MenuPreview from "@/pages/digitalmenu/MenuPreview";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/utils/trpc";
import type { DigitalMenu, Category, MenuItem } from "@/types/digitalMenu";

export default function RestaurantMenuManager() {
  const { id: restaurantIdParam } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { restaurants, isAuthenticated } = useAuth();
  
  const restaurantId = parseInt(restaurantIdParam || "0", 10);
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  const [menu, setMenu] = useState<DigitalMenu>({
    restaurantName: restaurant?.name || "",
    categories: [],
    items: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated or restaurant not found
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (!restaurant) {
      setLocation("/dashboard");
      return;
    }
  }, [isAuthenticated, restaurant, setLocation]);

  // Fetch existing menu data
  const {
    data: existingMenu,
    isLoading: menuLoading,
    error: menuError,
  } = trpc.digitalMenu.menu.getComplete.useQuery(
    { restaurant_id: restaurantId },
    { enabled: !!restaurantId && !!restaurant }
  );

  // Update local menu state when backend data loads
  useEffect(() => {
    if (existingMenu && restaurant) {
      setMenu({
        restaurantName: restaurant.name,
        categories: existingMenu.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          sortOrder: cat.sortOrder,
        })),
        items: existingMenu.categories.flatMap((cat: any) => 
          cat.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            categoryId: item.categoryId,
            variants: item.variants,
            addons: item.addons,
          }))
        ),
      });
    }
  }, [existingMenu, restaurant]);

  const handleCategoriesChange = useCallback((categories: Category[]) => {
    setMenu(prev => ({ ...prev, categories }));
  }, []);

  const handleItemsChange = useCallback((items: MenuItem[]) => {
    setMenu(prev => ({ ...prev, items }));
  }, []);

  const handleSaveMenu = async () => {
    setIsSaving(true);
    try {
      // For now, just show success message
      // The MenuBuilder component handles individual saves
      alert("Menu saved successfully!");
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save menu. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!restaurant) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurant Not Found
            </h1>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (menuLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-gray-600">Loading menu data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (menuError) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Menu
            </h2>
            <p className="text-red-600 mb-4">
              {menuError.message || "Failed to load menu data"}
            </p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
              <Button asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Menu - {restaurant.name}
                </h1>
                <p className="text-gray-600">
                  Edit your restaurant's digital menu
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              
              <Button
                onClick={handleSaveMenu}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Menu
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Builder */}
          <div className={showPreview ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card>
              <CardContent className="p-6">
                <MenuBuilder
                  menu={menu}
                  restaurantId={restaurantId}
                  onCategoriesChange={handleCategoriesChange}
                  onItemsChange={handleItemsChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MenuPreview menu={menu} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Changes are saved automatically when you add or modify items.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/menu/qr_${restaurantId}`} target="_blank">
                  <Eye className="w-4 h-4 mr-1" />
                  View Customer Menu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}