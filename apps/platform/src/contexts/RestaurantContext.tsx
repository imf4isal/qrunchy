import React, { createContext, useContext, useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

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
      // For now, we'll use the existing test restaurant from our backend testing
      // In a production app, this would create a new restaurant via API
      const newRestaurant: Restaurant = {
        id: 1, // Using the test restaurant we created during backend testing
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

  return (
    <RestaurantContext.Provider
      value={{
        currentRestaurant,
        setCurrentRestaurant,
        availableRestaurants,
        isLoading,
        error,
        createRestaurant,
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