import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Building2, 
  QrCode, 
  MapPin, 
  Store, 
  Users,
  Settings,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import FoodCourtCreationModal from "./FoodCourtCreationModal";

export default function FoodCourtManagement() {
  const [showCreationModal, setShowCreationModal] = useState(false);

  // Fetch user's food courts
  const {
    data: foodCourtsData,
    isLoading,
    refetch: refetchFoodCourts,
  } = trpc.foodCourt.getByUser.useQuery();

  const foodCourts = foodCourtsData?.foodCourts || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        <Clock className="w-3 h-3 mr-1" />
        Pending Activation
      </Badge>
    );
  };

  const handleCreateSuccess = () => {
    setShowCreationModal(false);
    refetchFoodCourts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Food Courts</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your food courts and their restaurant collections
          </p>
        </div>
        <Button onClick={() => setShowCreationModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Food Court
        </Button>
      </div>

      {/* Food Courts List */}
      {foodCourts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No food courts yet
            </h3>
            <p className="text-gray-600 text-center mb-4 max-w-md">
              Create your first food court to group multiple restaurants together with a unified QR code and search experience.
            </p>
            <Button onClick={() => setShowCreationModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Food Court
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {foodCourts.map((foodCourt) => (
            <Card key={foodCourt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {foodCourt.name}
                        </h3>
                        {getStatusBadge(foodCourt.is_active)}
                      </div>
                      
                      {foodCourt.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {foodCourt.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Store className="w-4 h-4 mr-1" />
                          <span>0 restaurants</span> {/* Will be populated when we get restaurant count */}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>Created {new Date(foodCourt.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {!foodCourt.is_active && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-orange-800 font-medium">Activation Required</p>
                              <p className="text-orange-700">
                                Contact admin to activate this food court. QR codes will work once activated.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 flex-shrink-0 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/foodcourt/${foodCourt.id}`}>
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                      </Link>
                    </Button>

                    {foodCourt.is_active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/menu/foodcourt_${foodCourt.id}`} target="_blank">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Inactive
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Food Court Creation Modal */}
      <FoodCourtCreationModal
        isOpen={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}