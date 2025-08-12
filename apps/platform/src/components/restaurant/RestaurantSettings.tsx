import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X, Settings } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { useAuth } from '@/contexts/AuthContext';

interface Restaurant {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
}

interface RestaurantSettingsProps {
  restaurant: Restaurant;
}

export default function RestaurantSettings({ restaurant }: RestaurantSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant.name,
    address: restaurant.address || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const { updateRestaurant } = useAuth();
  const updateRestaurantMutation = trpc.restaurant.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateRestaurantMutation.mutateAsync({
        id: restaurant.id,
        name: formData.name.trim(),
        address: formData.address.trim() || null,
      });

      // Update local state
      updateRestaurant(restaurant.id, {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      alert('Failed to update restaurant information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: restaurant.name,
      address: restaurant.address || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Restaurant Information
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={restaurant.mobile}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mobile number cannot be changed
              </p>
            </div>
            
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter restaurant address"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Restaurant Name</Label>
              <p className="text-gray-900">{restaurant.name}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Mobile Number</Label>
              <p className="text-gray-900">{restaurant.mobile}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Address</Label>
              <p className="text-gray-900">
                {restaurant.address || 'No address provided'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}