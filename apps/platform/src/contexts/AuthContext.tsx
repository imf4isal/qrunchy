import React, { createContext, useContext, useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

export interface User {
  id: number;
  mobile_number: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
  theme_id?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  restaurants: Restaurant[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobile_number: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // tRPC mutations
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('qrunchy_user');
        const storedRestaurants = localStorage.getItem('qrunchy_restaurants');

        if (storedUser && storedRestaurants) {
          const parsedUser = JSON.parse(storedUser);
          const parsedRestaurants = JSON.parse(storedRestaurants);

          // For now, just trust localStorage data
          // TODO: Add session verification when needed
          setUser(parsedUser);
          setRestaurants(parsedRestaurants);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('qrunchy_user');
    localStorage.removeItem('qrunchy_restaurants');
    setUser(null);
    setRestaurants([]);
  };

  const login = async (mobile_number: string) => {
    try {
      const result = await loginMutation.mutateAsync({ mobile_number });
      
      // Store in state
      setUser(result.user);
      setRestaurants(result.restaurants);
      
      // Store in localStorage
      localStorage.setItem('qrunchy_user', JSON.stringify(result.user));
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(result.restaurants));
      
    } catch (error) {
      clearAuthData();
      throw error; // Re-throw so components can handle the error
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshSession = async () => {
    if (!user) return;

    // TODO: Implement session refresh when needed
    console.log('Session refresh not implemented yet');
  };

  const value: AuthContextType = {
    user,
    restaurants,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}