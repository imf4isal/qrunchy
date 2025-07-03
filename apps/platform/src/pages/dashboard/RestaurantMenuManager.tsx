import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Eye, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuBuilder from "@/pages/digitalmenu/MenuBuilder";
import ThemePreview from "@/components/ThemePreview";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/utils/trpc";
import ThemeSelector from "@/components/ThemeSelector";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  
  // Keep track of the initial state to detect changes
  const initialMenuRef = useRef<DigitalMenu | null>(null);
  
  // Batch save mutations
  const utils = trpc.useUtils();
  
  const bulkImportMutation = trpc.digitalMenu.menu.bulkImport.useMutation();
  const updateThemeMutation = trpc.restaurant.updateTheme.useMutation();

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
      const menuData = {
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
      };
      setMenu(menuData);
      initialMenuRef.current = JSON.parse(JSON.stringify(menuData));
      setHasUnsavedChanges(false);
      setSaveStatus('idle');
    }
  }, [existingMenu, restaurant]);

  const handleCategoriesChange = useCallback((categories: Category[]) => {
    setMenu(prev => ({ ...prev, categories }));
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }, []);

  const handleItemsChange = useCallback((items: MenuItem[]) => {
    setMenu(prev => ({ ...prev, items }));
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }, []);
  
  const handleThemeChange = useCallback((newTheme: string) => {
    console.log("🎨 Theme change callback triggered:", {
      oldTheme: restaurant?.theme_id,
      newTheme,
      restaurantId
    });
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }, [restaurant?.theme_id, restaurantId]);

  const handleSaveMenu = async () => {
    if (!hasUnsavedChanges || !restaurantId) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Prepare menu data for bulk import
      const menuData = {
        categories: menu.categories.map(cat => ({ name: cat.name })),
        items: menu.items.map(item => ({
          name: item.name,
          price: item.price,
          description: item.description,
          categoryName: menu.categories.find(cat => cat.id === item.categoryId)?.name || '',
          variants: item.variants.map(variant => ({
            title: variant.title,
            options: variant.options.map(option => ({
              name: option.name,
              price: option.price,
            })),
          })),
          addons: item.addons.map(addon => ({
            name: addon.name,
            price: addon.price,
          })),
        })),
      };
      
      // Save menu data with bulk import (replaces existing)
      await bulkImportMutation.mutateAsync({
        restaurant_id: restaurantId,
        menu_data: menuData,
        replace_existing: true,
      });
      
      // Update saved state
      initialMenuRef.current = JSON.parse(JSON.stringify(menu));
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      setLastSaveTime(new Date());
      
      // Invalidate relevant caches to refresh data
      await utils.digitalMenu.menu.getComplete.invalidate({ restaurant_id: restaurantId });
      await utils.digitalMenu.categories.getByRestaurant.invalidate({ restaurant_id: restaurantId });
      await utils.digitalMenu.items.getByRestaurant.invalidate({ restaurant_id: restaurantId });
      
      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error saving menu:', error);
      setSaveStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left section - Back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="self-start">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  Manage Menu - {restaurant.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Edit your restaurant's digital menu
                </p>
              </div>
            </div>
            
            {/* Right section - Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center justify-center gap-2 lg:hidden"
                size="sm"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              
              <Button
                onClick={handleSaveMenu}
                disabled={isSaving || !hasUnsavedChanges}
                className={`flex items-center justify-center gap-2 ${
                  saveStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                  saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved!</span>
                    <span className="sm:hidden">Saved</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Failed</span>
                    <span className="sm:hidden">Error</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                    </span>
                    <span className="sm:hidden">
                      {hasUnsavedChanges ? 'Save' : 'Saved'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="mb-8">
          {restaurant && (
            <ThemeSelector
              restaurantId={restaurantId}
              currentTheme={restaurant?.theme_id || "minimal"}
              onThemeChange={handleThemeChange}
            />
          )}
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
                  batchSaveMode={true}
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
                    <ThemePreview 
                      menu={menu} 
                      theme={restaurant?.theme_id as "minimal" | "modern" || "minimal"}
                      restaurant={{
                        name: restaurant?.name || menu.restaurantName,
                        address: restaurant?.address,
                        mobile: restaurant?.mobile,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}