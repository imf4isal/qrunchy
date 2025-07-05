import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Restaurant {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
}

interface RestaurantContextType {
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  availableRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  createRestaurant: (data: { name: string; mobile: string; address?: string }) => Promise<Restaurant>;
  clearRestaurant: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [availableRestaurants, setAvailableRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, we'll store the restaurant selection in localStorage
  // In a real app, this would be managed through user authentication
  useEffect(() => {
    const stored = localStorage.getItem('currentRestaurant');
    if (stored) {
      try {
        setCurrentRestaurant(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored restaurant:', e);
        localStorage.removeItem('currentRestaurant');
      }
    }
  }, []);

  useEffect(() => {
    if (currentRestaurant) {
      localStorage.setItem('currentRestaurant', JSON.stringify(currentRestaurant));
    } else {
      localStorage.removeItem('currentRestaurant');
    }
  }, [currentRestaurant]);

  const createRestaurant = async (data: { name: string; mobile: string; address?: string }): Promise<Restaurant> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This will be implemented when we integrate with QRGenerator
      // For now, return a placeholder that won't break existing code
      const newRestaurant: Restaurant = {
        id: 1, // Temporary - will be replaced with real implementation
        name: data.name,
        mobile: data.mobile,
        address: data.address || null,
      };
      
      setAvailableRestaurants(prev => [...prev, newRestaurant]);
      setCurrentRestaurant(newRestaurant);
      
      return newRestaurant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create restaurant';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRestaurant = () => {
    setCurrentRestaurant(null);
    setAvailableRestaurants([]);
    setError(null);
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentRestaurant,
        setCurrentRestaurant,
        availableRestaurants,
        isLoading,
        error,
        createRestaurant,
        clearRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}