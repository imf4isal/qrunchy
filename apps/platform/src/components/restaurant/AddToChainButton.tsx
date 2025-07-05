import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/utils/trpc';
import { Building2, Plus, Check } from 'lucide-react';

interface AddToChainButtonProps {
  restaurantId: number;
  restaurantName: string;
  currentChainId?: number | null;
  onChainUpdated?: () => void;
}

export default function AddToChainButton({ 
  restaurantId, 
  restaurantName, 
  currentChainId, 
  onChainUpdated 
}: AddToChainButtonProps) {
  const { user, chains, updateRestaurant } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(currentChainId || null);
  
  const updateRestaurantMutation = trpc.restaurant.update.useMutation();

  const handleChainSelection = async (chainId: number | null) => {
    try {
      const result = await updateRestaurantMutation.mutateAsync({
        id: restaurantId,
        group_res_id: chainId
      });

      // Update the restaurant in the auth context
      updateRestaurant(restaurantId, {
        group_res_id: chainId,
        chain_name: chainId ? chains.find(c => c.id === chainId)?.name || null : null,
        chain_type: chainId ? 'chain' : null
      });

      setSelectedChainId(chainId);
      setIsDialogOpen(false);
      
      if (onChainUpdated) {
        onChainUpdated();
      }
    } catch (error) {
      console.error('Error updating restaurant chain:', error);
    }
  };

  const currentChain = chains.find(c => c.id === currentChainId);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Building2 className="w-4 h-4 mr-2" />
          {currentChain ? `Chain: ${currentChain.name}` : 'Add to Chain'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Chain Assignment</DialogTitle>
          <DialogDescription>
            Assign "{restaurantName}" to a restaurant chain or remove it from its current chain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* No Chain Option */}
          <Card 
            className={`cursor-pointer transition-colors hover:border-blue-300 ${
              selectedChainId === null ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedChainId(null)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Individual Restaurant</div>
                  <div className="text-sm text-gray-500">Not part of any chain</div>
                </div>
                {selectedChainId === null && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Chains */}
          {chains.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Available Chains:</h4>
              {chains.map((chain) => (
                <Card 
                  key={chain.id}
                  className={`cursor-pointer transition-colors hover:border-blue-300 ${
                    selectedChainId === chain.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedChainId(chain.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{chain.name}</span>
                        </div>
                        {chain.description && (
                          <div className="text-sm text-gray-500 mt-1">{chain.description}</div>
                        )}
                      </div>
                      {selectedChainId === chain.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No chains available</p>
              <p className="text-xs text-gray-400">Create a chain first to assign restaurants</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleChainSelection(selectedChainId)}
              className="flex-1"
              disabled={selectedChainId === currentChainId}
            >
              {selectedChainId === null ? 'Remove from Chain' : 'Assign to Chain'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}