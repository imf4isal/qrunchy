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
    <Card className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            Restaurant Info
          </h3>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-7 px-2 text-gray-500 hover:text-gray-900"
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs text-gray-600 mb-1 block">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="mobile" className="text-xs text-gray-600 mb-1 block">Mobile</Label>
              <Input
                id="mobile"
                value={restaurant.mobile}
                disabled
                className="bg-gray-50 h-8 text-sm text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="text-xs text-gray-600 mb-1 block">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address..."
                rows={2}
                className="text-sm resize-none"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSaving} size="sm" className="h-7 px-3">
                <Save className="w-3 h-3 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} size="sm" className="h-7 px-3">
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Name</div>
              <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Mobile</div>
              <div className="text-sm text-gray-900">{restaurant.mobile}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Address</div>
              <div className="text-sm text-gray-900">
                {restaurant.address || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}