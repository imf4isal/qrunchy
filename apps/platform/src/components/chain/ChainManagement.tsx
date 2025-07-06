import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/utils/trpc';
import { Plus, Edit3, Trash2, Link2, Building2 } from 'lucide-react';
import type { Chain, Restaurant } from '@/contexts/AuthContext';

interface ChainFormData {
  name: string;
  description: string;
  selectedRestaurants: number[];
}

interface ChainFormProps {
  formData: ChainFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChainFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  availableRestaurants: Restaurant[];
}

const ChainForm = ({ formData, setFormData, onSubmit, title, availableRestaurants }: ChainFormProps) => {
  console.log('ChainForm render - formData:', formData);
  console.log('ChainForm render - availableRestaurants:', availableRestaurants);

  const handleRestaurantToggle = (restaurantId: number) => {
    console.log('Toggling restaurant:', restaurantId);
    console.log('Current selected restaurants:', formData.selectedRestaurants);
    
    setFormData(prev => {
      const newSelected = prev.selectedRestaurants.includes(restaurantId)
        ? prev.selectedRestaurants.filter(id => id !== restaurantId)
        : [...prev.selectedRestaurants, restaurantId];
      
      console.log('New selected restaurants:', newSelected);
      
      return {
        ...prev,
        selectedRestaurants: newSelected
      };
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Chain Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter chain name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter chain description (optional)"
          rows={3}
        />
      </div>
      
      {availableRestaurants.length > 0 && (
        <div className="space-y-2">
          <Label>Select Restaurants</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
            {availableRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`restaurant-${restaurant.id}`}
                  checked={formData.selectedRestaurants.includes(restaurant.id)}
                  onChange={() => handleRestaurantToggle(restaurant.id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label 
                  htmlFor={`restaurant-${restaurant.id}`} 
                  className="flex-1 text-sm cursor-pointer"
                >
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="text-gray-500 text-xs">{restaurant.mobile}</div>
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Select restaurants to include in this chain. You can also assign restaurants to chains later.
          </p>
        </div>
      )}
      
      <Button type="submit" className="w-full">
        {title}
      </Button>
    </form>
  );
};

export default function ChainManagement() {
  const { user, chains, restaurants, addChain, updateChain, deleteChain, updateRestaurant, refreshSession } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [formData, setFormData] = useState<ChainFormData>({
    name: '',
    description: '',
    selectedRestaurants: []
  });

  const createChainMutation = trpc.restaurant.createChain.useMutation();
  const updateChainMutation = trpc.restaurant.updateChain.useMutation();
  const deleteChainMutation = trpc.restaurant.deleteChain.useMutation();
  const updateRestaurantMutation = trpc.restaurant.update.useMutation();

  const handleCreateChain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      console.log('Creating chain with data:', formData);
      
      const result = await createChainMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        user_id: user.id
      });

      console.log('Chain created:', result);
      console.log('Selected restaurants to assign:', formData.selectedRestaurants);

      // Update selected restaurants to belong to this chain
      for (const restaurantId of formData.selectedRestaurants) {
        console.log('Assigning restaurant', restaurantId, 'to chain', result.id);
        await updateRestaurantMutation.mutateAsync({
          id: restaurantId,
          group_res_id: result.id
        });
        
        // Update the restaurant in the context immediately
        updateRestaurant(restaurantId, { group_res_id: result.id });
      }

      addChain(result);
      setFormData({ name: '', description: '', selectedRestaurants: [] });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating chain:', error);
    }
  };

  const handleUpdateChain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChain) return;

    try {
      const result = await updateChainMutation.mutateAsync({
        id: editingChain.id,
        name: formData.name,
        description: formData.description || undefined,
      });

      // Get current restaurants in this chain
      const currentChainRestaurants = restaurants.filter(r => r.group_res_id === editingChain.id);
      const currentRestaurantIds = currentChainRestaurants.map(r => r.id);

      // Remove restaurants that are no longer selected
      for (const restaurant of currentChainRestaurants) {
        if (!formData.selectedRestaurants.includes(restaurant.id)) {
          await updateRestaurantMutation.mutateAsync({
            id: restaurant.id,
            group_res_id: null
          });
          
          // Update the restaurant in the context immediately
          updateRestaurant(restaurant.id, { group_res_id: null });
        }
      }

      // Add newly selected restaurants
      for (const restaurantId of formData.selectedRestaurants) {
        if (!currentRestaurantIds.includes(restaurantId)) {
          await updateRestaurantMutation.mutateAsync({
            id: restaurantId,
            group_res_id: editingChain.id
          });
          
          // Update the restaurant in the context immediately
          updateRestaurant(restaurantId, { group_res_id: editingChain.id });
        }
      }

      updateChain(editingChain.id, result);
      setEditingChain(null);
      setFormData({ name: '', description: '', selectedRestaurants: [] });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating chain:', error);
    }
  };

  const handleDeleteChain = async (chainId: number) => {
    try {
      // Refresh data to get the latest state
      await refreshSession();
      
      // Check if chain has restaurants after refresh
      const chainRestaurants = getChainRestaurants(chainId);
      
      console.log('Frontend restaurants for chain', chainId, ':', chainRestaurants);
      console.log('All restaurants in context:', restaurants);
      
      if (chainRestaurants.length > 0) {
        alert(`Cannot delete chain with active restaurants. Please remove the ${chainRestaurants.length} restaurant(s) from this chain first:\n\n${chainRestaurants.map(r => `• ${r.name}`).join('\n')}`);
        return;
      }

      if (!confirm('Are you sure you want to delete this chain? This action cannot be undone.')) {
        return;
      }

      await deleteChainMutation.mutateAsync({ id: chainId });
      deleteChain(chainId);
    } catch (error) {
      console.error('Error deleting chain:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('active restaurants')) {
        alert('This chain still has restaurants assigned to it. Please remove all restaurants from the chain before deleting it.');
      } else {
        alert(`Failed to delete chain: ${errorMessage}`);
      }
    }
  };

  const openEditDialog = (chain: Chain) => {
    setEditingChain(chain);
    const chainRestaurants = restaurants.filter(r => r.group_res_id === chain.id);
    setFormData({
      name: chain.name,
      description: chain.description || '',
      selectedRestaurants: chainRestaurants.map(r => r.id)
    });
    setIsEditDialogOpen(true);
  };

  const getChainRestaurants = (chainId: number) => {
    return restaurants.filter(restaurant => restaurant.group_res_id === chainId);
  };

  const getAvailableRestaurantsForCreate = () => {
    // For creating new chain, show restaurants not in any chain
    return restaurants.filter(restaurant => !restaurant.group_res_id);
  };

  const getAvailableRestaurantsForEdit = () => {
    // For editing existing chain, show all restaurants
    return restaurants;
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Restaurant Chains</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Chain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chain</DialogTitle>
              <DialogDescription>
                Create a new restaurant chain to group your restaurants together.
              </DialogDescription>
            </DialogHeader>
            <ChainForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateChain} 
              title="Create Chain"
              availableRestaurants={getAvailableRestaurantsForCreate()}
            />
          </DialogContent>
        </Dialog>
      </div>

      {chains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chains yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Group your restaurants into chains for better organization
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Chain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chains.map((chain) => {
            const chainRestaurants = getChainRestaurants(chain.id);
            return (
              <Card key={chain.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{chain.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(chain)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteChain(chain.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {chain.description && (
                    <p className="text-gray-600 mb-4">{chain.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {chainRestaurants.length} restaurant{chainRestaurants.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {new Date(chain.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {chainRestaurants.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Link2 className="w-4 h-4 text-gray-400" />
                        <div className="flex -space-x-2">
                          {chainRestaurants.slice(0, 3).map((restaurant) => (
                            <div
                              key={restaurant.id}
                              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 border-2 border-white"
                              title={restaurant.name}
                            >
                              {restaurant.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {chainRestaurants.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                              +{chainRestaurants.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chain</DialogTitle>
            <DialogDescription>
              Update the chain details below.
            </DialogDescription>
          </DialogHeader>
          <ChainForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateChain} 
            title="Update Chain"
            availableRestaurants={getAvailableRestaurantsForEdit()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}