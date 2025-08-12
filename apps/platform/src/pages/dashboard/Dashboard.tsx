import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import ChainManagement from "@/components/chain/ChainManagement";
import AddToChainButton from "@/components/restaurant/AddToChainButton";
import { Plus, QrCode, Edit3, BarChart3, Building2, Store, Image, Camera } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import type { Restaurant } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, restaurants, chains } = useAuth();

  // Fetch QR codes for all restaurants
  const qrQueries = restaurants.map((restaurant) =>
    trpc.digitalMenu.qr.getByRestaurant.useQuery(
      { restaurant_id: restaurant.id },
      { enabled: !!restaurant.id }
    )
  );

  // Fetch photo menu data for all restaurants
  const photoMenuQueries = restaurants.map((restaurant) =>
    trpc.photoMenu.getByRestaurant.useQuery(
      { restaurant_id: restaurant.id },
      { enabled: !!restaurant.id }
    )
  );

  // Fetch photo menu QR codes for all restaurants
  const photoMenuQrQueries = restaurants.map((restaurant) =>
    trpc.photoMenu.getQrByRestaurant.useQuery(
      { restaurant_id: restaurant.id },
      { enabled: !!restaurant.id }
    )
  );

  // Create a mapping of restaurant ID to QR code data
  const restaurantQrMap = useMemo(() => {
    const map: Record<string, { code: string; menu_url: string } | null> = {};

    restaurants.forEach((restaurant, index) => {
      const qrData = qrQueries[index]?.data;
      if (qrData && qrData.length > 0) {
        // Use the first (most recent) QR code for each restaurant
        map[restaurant.id] = {
          code: qrData[0].code,
          menu_url: qrData[0].menu_url,
        };
      } else {
        map[restaurant.id] = null;
      }
    });

    return map;
  }, [restaurants, qrQueries]);

  // Create a mapping of restaurant ID to photo menu data
  const restaurantPhotoMenuMap = useMemo(() => {
    const map: Record<string, { photos: any[]; hasPhotos: boolean } | null> = {};

    restaurants.forEach((restaurant, index) => {
      const photoData = photoMenuQueries[index]?.data;
      if (photoData && photoData.photos && photoData.photos.length > 0) {
        map[restaurant.id] = {
          photos: photoData.photos,
          hasPhotos: true,
        };
      } else {
        map[restaurant.id] = {
          photos: [],
          hasPhotos: false,
        };
      }
    });

    return map;
  }, [restaurants, photoMenuQueries]);

  // Create a mapping of restaurant ID to photo menu QR code data  
  const restaurantPhotoQrMap = useMemo(() => {
    const map: Record<string, { code: string; menu_url: string } | null> = {};

    restaurants.forEach((restaurant, index) => {
      const qrData = photoMenuQrQueries[index]?.data;
      if (qrData && qrData.length > 0) {
        // Use the first (most recent) QR code for each restaurant
        map[restaurant.id] = {
          code: qrData[0].code,
          menu_url: qrData[0].menu_url,
        };
      } else {
        map[restaurant.id] = null;
      }
    });

    return map;
  }, [restaurants, photoMenuQrQueries]);

  // Group restaurants by chains
  const groupedRestaurants = useMemo(() => {
    const grouped: {
      unassigned: Restaurant[];
      chains: Array<{ chain: any; restaurants: Restaurant[] }>;
    } = {
      unassigned: [],
      chains: []
    };

    // First, group restaurants by their chain
    const chainRestaurantMap = new Map<number, Restaurant[]>();
    
    restaurants.forEach(restaurant => {
      if (restaurant.group_res_id) {
        if (!chainRestaurantMap.has(restaurant.group_res_id)) {
          chainRestaurantMap.set(restaurant.group_res_id, []);
        }
        chainRestaurantMap.get(restaurant.group_res_id)!.push(restaurant);
      } else {
        grouped.unassigned.push(restaurant);
      }
    });

    // Match with chain data
    chains.forEach(chain => {
      const chainRestaurants = chainRestaurantMap.get(chain.id) || [];
      grouped.chains.push({
        chain,
        restaurants: chainRestaurants
      });
    });

    return grouped;
  }, [restaurants, chains]);

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const hasDigitalMenu = restaurantQrMap[restaurant.id] !== null;
    const photoMenuData = restaurantPhotoMenuMap[restaurant.id];
    const hasPhotoMenu = photoMenuData?.hasPhotos || false;
    const hasPhotoMenuQr = restaurantPhotoQrMap[restaurant.id] !== null;

    return (
      <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {restaurant.name}
                </h3>
                {/* Status indicators */}
                <div className="flex gap-1">
                  {hasDigitalMenu && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <Edit3 className="w-3 h-3 mr-1" />
                      Digital
                    </div>
                  )}
                  {hasPhotoMenu && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      <Camera className="w-3 h-3 mr-1" />
                      Photo
                    </div>
                  )}
                </div>
              </div>
              {restaurant.address && restaurant.address !== "Not specified" && (
                <p className="text-gray-500 text-sm">
                  {restaurant.address}
                </p>
              )}
              {restaurant.chain_name && (
                <div className="flex items-center mt-2">
                  <Building2 className="w-3 h-3 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600 font-medium">
                    {restaurant.chain_name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Primary Menu Management - Show digital menu OR photo menu management */}
              {hasPhotoMenu ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/restaurant/${restaurant.id}/photomenu`}>
                    <Image className="w-4 h-4 mr-1" />
                    Manage
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/restaurant/${restaurant.id}/menu`}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Manage
                  </Link>
                </Button>
              )}

              {/* View Menu (Digital or Photo) */}
              {hasDigitalMenu ? (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/menu/${restaurantQrMap[restaurant.id]!.code}`}
                    target="_blank"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>
              ) : hasPhotoMenu && hasPhotoMenuQr ? (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/menu/${restaurantPhotoQrMap[restaurant.id]!.code}`}
                    target="_blank"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <QrCode className="w-4 h-4 mr-1" />
                  No QR Code
                </Button>
              )}

              <AddToChainButton
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                currentChainId={restaurant.group_res_id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Manage your restaurants and digital menus from here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Restaurants
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants.length}</div>
              <p className="text-xs text-muted-foreground">
                Active restaurants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Chains
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chains.length}</div>
              <p className="text-xs text-muted-foreground">Restaurant chains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{user?.mobile_number}</div>
              <p className="text-xs text-muted-foreground">
                Your mobile number
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="restaurants" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="restaurants" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Restaurants
                </TabsTrigger>
                <TabsTrigger value="chains" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Chains
                </TabsTrigger>
              </TabsList>

              <TabsContent value="restaurants" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Restaurants</h2>
                  <Button asChild>
                    <Link href="/digital-menu">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Restaurant
                    </Link>
                  </Button>
                </div>

                {restaurants.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No restaurants yet
                      </h3>
                      <p className="text-gray-600 text-center mb-4">
                        Get started by creating your first digital menu
                      </p>
                      <div className="flex gap-2">
                        <Button asChild>
                          <Link href="/digital-menu">Create Digital Menu</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/photo-menu">Create Photo Menu</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Chain Groups */}
                    {groupedRestaurants.chains.map(({ chain, restaurants: chainRestaurants }) => (
                      chainRestaurants.length > 0 && (
                        <div key={chain.id} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-medium text-gray-900">{chain.name}</h3>
                            <span className="text-sm text-gray-500">
                              ({chainRestaurants.length} restaurant{chainRestaurants.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                          <div className="space-y-3 ml-7">
                            {chainRestaurants.map((restaurant) => (
                              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Unassigned Restaurants */}
                    {groupedRestaurants.unassigned.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900">Individual Restaurants</h3>
                        <div className="space-y-3">
                          {groupedRestaurants.unassigned.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chains">
                <ChainManagement />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/digital-menu">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Create Digital Menu</h3>
                        <p className="text-sm text-gray-600">
                          Build a structured menu
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/photo-menu">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Plus className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Create Photo Menu</h3>
                        <p className="text-sm text-gray-600">
                          Upload menu photos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
