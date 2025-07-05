import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/utils/trpc';
import { Plus, Edit3, Trash2, Link2, Building2 } from 'lucide-react';
import type { Chain } from '@/contexts/AuthContext';

interface ChainFormData {
  name: string;
  description: string;
}

interface ChainFormProps {
  formData: ChainFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChainFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
}

const ChainForm = React.memo(({ formData, setFormData, onSubmit, title }: ChainFormProps) => (
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
    <Button type="submit" className="w-full">
      {title}
    </Button>
  </form>
));

export default function ChainManagement() {
  const { user, chains, restaurants, addChain, updateChain, deleteChain } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [formData, setFormData] = useState<ChainFormData>({
    name: '',
    description: ''
  });

  const createChainMutation = trpc.restaurant.createChain.useMutation();
  const updateChainMutation = trpc.restaurant.updateChain.useMutation();
  const deleteChainMutation = trpc.restaurant.deleteChain.useMutation();

  const handleCreateChain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const result = await createChainMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        user_id: user.id
      });

      addChain(result);
      setFormData({ name: '', description: '' });
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

      updateChain(editingChain.id, result);
      setEditingChain(null);
      setFormData({ name: '', description: '' });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating chain:', error);
    }
  };

  const handleDeleteChain = async (chainId: number) => {
    if (!confirm('Are you sure you want to delete this chain? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteChainMutation.mutateAsync({ id: chainId });
      deleteChain(chainId);
    } catch (error) {
      console.error('Error deleting chain:', error);
    }
  };

  const openEditDialog = (chain: Chain) => {
    setEditingChain(chain);
    setFormData({
      name: chain.name,
      description: chain.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const getChainRestaurants = (chainId: number) => {
    return restaurants.filter(restaurant => restaurant.group_res_id === chainId);
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}