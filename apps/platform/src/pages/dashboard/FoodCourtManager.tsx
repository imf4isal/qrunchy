import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  QrCode,
  Store,
  Plus,
  Trash2,
  Search,
  Settings,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Users,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import MainLayout from "@/components/layout/MainLayout";

interface RestaurantSearchResult {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
  theme_id: string;
  group_res_id: number | null;
  user_id: number;
}

export default function FoodCourtManager() {
  const { id } = useParams<{ id: string }>();
  const foodCourtId = parseInt(id || "0");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showAddRestaurantDialog, setShowAddRestaurantDialog] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{
    qr_code: string;
    menu_url: string;
    status: string;
  } | null>(null);

  // Fetch food court data
  const {
    data: foodCourtData,
    isLoading,
    refetch: refetchFoodCourt,
  } = trpc.foodCourt.getById.useQuery({ id: foodCourtId });

  // Get existing QR code data
  const {
    data: qrCodeResult,
    refetch: refetchQrCode,
  } = trpc.foodCourt.getQrCode.useQuery({ id: foodCourtId });

  // Get restaurant QR codes for dashboard view buttons
  const {
    data: restaurantQrData,
  } = trpc.foodCourt.getRestaurantQrCodes.useQuery({ id: foodCourtId });

  // Search restaurants
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = trpc.foodCourt.getAvailableRestaurants.useQuery(
    {
      search: restaurantSearch,
      exclude_food_court_id: foodCourtId,
    },
    {
      enabled: showAddRestaurantDialog && restaurantSearch.length > 0,
    }
  );

  // Generate QR code mutation
  const generateQrMutation = trpc.foodCourt.generateQr.useMutation({
    onSuccess: (data) => {
      setQrCodeData(data);
      refetchQrCode();
      refetchFoodCourt();
    },
  });

  // Update food court mutation
  const updateFoodCourtMutation = trpc.foodCourt.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetchFoodCourt();
    },
  });

  // Update restaurants mutation
  const updateRestaurantsMutation = trpc.foodCourt.updateRestaurants.useMutation({
    onSuccess: () => {
      setShowAddRestaurantDialog(false);
      setSelectedRestaurants([]);
      setRestaurantSearch("");
      refetchFoodCourt();
    },
  });

  // Delete food court mutation
  const deleteFoodCourtMutation = trpc.foodCourt.delete.useMutation({
    onSuccess: () => {
      // Redirect to dashboard after successful deletion
      window.location.href = "/dashboard";
    },
  });

  const foodCourt = foodCourtData?.foodCourt;
  
  // Use existing QR code data if available, otherwise use generated data
  const currentQrData = qrCodeData || (qrCodeResult?.qr_code ? qrCodeResult : null);

  // Helper function to get restaurant menu URL
  const getRestaurantMenuUrl = (restaurantId: number) => {
    const qrCode = restaurantQrData?.restaurant_qr_codes?.[restaurantId];
    
    if (qrCode) {
      return `/menu/${qrCode}`;
    }
    
    // Fallback to dashboard if no QR code found
    return `/dashboard/restaurant/${restaurantId}/menu`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!foodCourt) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Food Court Not Found</h1>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleStartEdit = () => {
    setEditForm({
      name: foodCourt.name,
      description: foodCourt.description || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateFoodCourtMutation.mutateAsync({
        id: foodCourtId,
        name: editForm.name,
        description: editForm.description || undefined,
      });
    } catch (error: any) {
      alert(`Error updating food court: ${error.message}`);
    }
  };

  const handleGenerateQr = async () => {
    try {
      await generateQrMutation.mutateAsync({ food_court_id: foodCourtId });
    } catch (error: any) {
      alert(`Error generating QR code: ${error.message}`);
    }
  };

  const handleAddRestaurants = async () => {
    if (selectedRestaurants.length === 0) return;

    try {
      const currentRestaurantIds = foodCourt.restaurants.map((r) => r.id);
      const newRestaurantIds = [...currentRestaurantIds, ...selectedRestaurants];
      
      await updateRestaurantsMutation.mutateAsync({
        food_court_id: foodCourtId,
        restaurant_ids: newRestaurantIds,
      });
    } catch (error: any) {
      alert(`Error adding restaurants: ${error.message}`);
    }
  };

  const handleRemoveRestaurant = async (restaurantId: number) => {
    if (!confirm("Are you sure you want to remove this restaurant from the food court?")) {
      return;
    }

    try {
      const newRestaurantIds = foodCourt.restaurants
        .filter((r) => r.id !== restaurantId)
        .map((r) => r.id);

      await updateRestaurantsMutation.mutateAsync({
        food_court_id: foodCourtId,
        restaurant_ids: newRestaurantIds,
      });
    } catch (error: any) {
      alert(`Error removing restaurant: ${error.message}`);
    }
  };

  const handleDeleteFoodCourt = async () => {
    try {
      await deleteFoodCourtMutation.mutateAsync({ id: foodCourtId });
    } catch (error: any) {
      alert(`Error deleting food court: ${error.message}`);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending Activation
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-2xl font-bold h-auto py-2"
                    />
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Food court description..."
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveEdit} disabled={updateFoodCourtMutation.isLoading}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{foodCourt.name}</h1>
                    {foodCourt.description && (
                      <p className="text-gray-600 mb-3">{foodCourt.description}</p>
                    )}
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(foodCourt.is_active)}
                      <span className="text-sm text-gray-500">
                        {foodCourt.restaurants.length} restaurants
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleStartEdit}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                {currentQrData ? (
                  <Button asChild>
                    <Link href={`/menu/${currentQrData.qr_code}`} target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                ) : null}
                {!foodCourt.is_active ? (
                  <Button onClick={() => setShowActivationDialog(true)}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Activation
                  </Button>
                ) : null}
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurants Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="w-5 h-5" />
                    <span>Restaurants ({foodCourt.restaurants.length})</span>
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowAddRestaurantDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Restaurant
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {foodCourt.restaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
                    <p className="text-gray-600 mb-4">
                      Add restaurants to your food court to get started.
                    </p>
                    <Button onClick={() => setShowAddRestaurantDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Restaurant
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {foodCourt.restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{restaurant.category_count} categories</span>
                              <span>•</span>
                              <span>{restaurant.item_count} items</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={getRestaurantMenuUrl(restaurant.id)} target="_blank">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveRestaurant(restaurant.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>QR Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!currentQrData ? (
                    <Button 
                      onClick={handleGenerateQr} 
                      className="w-full"
                      disabled={generateQrMutation.isLoading}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {generateQrMutation.isLoading ? "Generating..." : "Generate QR Code"}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Code</div>
                          <div className="text-sm font-mono text-gray-900">{currentQrData.qr_code}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Status</div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            foodCourt.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-orange-100 text-orange-800"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              foodCourt.is_active ? "bg-green-400" : "bg-orange-400"
                            }`}></div>
                            {foodCourt.is_active ? "Active" : "Pending"}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500 mb-1">URL</div>
                          <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all text-gray-600">
                            {`/menu/${currentQrData.qr_code}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button asChild className="w-full">
                          <Link href={`/menu/${currentQrData.qr_code}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            View Food Court
                          </Link>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/menu/${currentQrData.qr_code}`)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!foodCourt.is_active && currentQrData && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-800">
                          <p className="font-medium">Pending Activation</p>
                          <p>QR code works, but visitors will see "Food court not active" until admin approval.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurants</span>
                    <span className="font-medium">{foodCourt.restaurants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Categories</span>
                    <span className="font-medium">
                      {foodCourt.restaurants.reduce((sum, r) => sum + r.category_count, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">
                      {foodCourt.restaurants.reduce((sum, r) => sum + r.item_count, 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium">
                      {foodCourt.is_active ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activation Dialog */}
        <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Food Court Activation</DialogTitle>
              <DialogDescription>
                To activate your food court and make it accessible to customers, please contact our admin team.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
                <p className="text-blue-800 text-sm mb-2">
                  Please reach out to our admin team with your food court details:
                </p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Food Court: {foodCourt.name}</li>
                  <li>• Food Court ID: {foodCourt.id}</li>
                  <li>• Restaurants: {foodCourt.restaurants.length}</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActivationDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Food Court Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Food Court</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{foodCourt.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">This will permanently:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Delete the food court and all its settings</li>
                  <li>• Remove the QR code and make it inaccessible</li>
                  <li>• Unlink all {foodCourt.restaurants.length} associated restaurants</li>
                  <li>• Remove all food court data from the system</li>
                </ul>
                <p className="text-red-800 text-sm mt-3 font-medium">
                  The restaurants themselves will not be deleted and can be reassigned to other food courts.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteFoodCourt}
                disabled={deleteFoodCourtMutation.isLoading}
              >
                {deleteFoodCourtMutation.isLoading ? "Deleting..." : "Delete Food Court"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Restaurant Dialog */}
        <Dialog open={showAddRestaurantDialog} onOpenChange={setShowAddRestaurantDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Restaurants to Food Court</DialogTitle>
              <DialogDescription>
                Search and select restaurants to add to your food court.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-search">Search Restaurants</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="restaurant-search"
                    placeholder="Type restaurant name..."
                    value={restaurantSearch}
                    onChange={(e) => setRestaurantSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {restaurantSearch.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : searchResults?.restaurants && searchResults.restaurants.length > 0 ? (
                    searchResults.restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRestaurants.includes(restaurant.id)
                            ? "bg-blue-50 border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          if (selectedRestaurants.includes(restaurant.id)) {
                            setSelectedRestaurants(selectedRestaurants.filter(id => id !== restaurant.id));
                          } else {
                            setSelectedRestaurants([...selectedRestaurants, restaurant.id]);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{restaurant.name}</h4>
                            {restaurant.address && (
                              <p className="text-sm text-gray-600">{restaurant.address}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            {selectedRestaurants.includes(restaurant.id) && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No restaurants found</p>
                  )}
                </div>
              )}

              {selectedRestaurants.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    {selectedRestaurants.length} restaurant(s) selected
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddRestaurantDialog(false);
                  setSelectedRestaurants([]);
                  setRestaurantSearch("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRestaurants}
                disabled={selectedRestaurants.length === 0 || updateRestaurantsMutation.isLoading}
              >
                {updateRestaurantsMutation.isLoading ? "Adding..." : `Add ${selectedRestaurants.length} Restaurant(s)`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}