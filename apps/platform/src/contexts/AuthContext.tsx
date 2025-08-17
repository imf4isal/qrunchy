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
  group_res_id?: number | null;
  chain_name?: string | null;
  chain_type?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chain {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  type: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  restaurants?: Restaurant[];
}

interface AuthContextType {
  user: User | null;
  restaurants: Restaurant[];
  chains: Chain[];
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (mobile_number: string) => Promise<void>;
  loginWithPassword: (mobile_number: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateRestaurant: (restaurantId: number, updates: Partial<Restaurant>) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (restaurantId: number) => void;
  addChain: (chain: Chain) => void;
  updateChain: (chainId: number, updates: Partial<Chain>) => void;
  deleteChain: (chainId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get tRPC utils for manual query calls
  const utils = trpc.useUtils();
  
  // tRPC mutations - use utils.client for safer access
  const loginMutation = trpc.auth.login.useMutation();
  const loginWithPasswordMutation = trpc.auth.loginWithPassword.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('qrunchy_token');

        if (!storedToken) {
          console.log('🔓 No stored token found');
          setIsLoading(false);
          return;
        }

        // Set token first so it's included in the validation request
        setToken(storedToken);
        
        console.log('🔐 Found stored token, validating...');

        try {
          // Validate the token by making an API call
          const result = await utils.auth.validateToken.fetch();
          
          if (result && result.user) {
            // Token is valid, set auth state
            setUser(result.user);
            setRestaurants(result.restaurants);
            
            // Update localStorage with fresh data
            localStorage.setItem('qrunchy_user', JSON.stringify(result.user));
            localStorage.setItem('qrunchy_restaurants', JSON.stringify(result.restaurants));
            
            // Load chains from localStorage (not affected by token validation)
            const storedChains = localStorage.getItem('qrunchy_chains');
            if (storedChains) {
              setChains(JSON.parse(storedChains));
            }
            
            console.log('✅ Token validation successful - user authenticated');
          } else {
            throw new Error('No user data returned from token validation');
          }
        } catch (validationError) {
          // Token is invalid or expired
          console.log('❌ Token validation failed:', validationError);
          clearAuthData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Only run on mount, not when validateTokenQuery changes

  const clearAuthData = () => {
    localStorage.removeItem('qrunchy_user');
    localStorage.removeItem('qrunchy_restaurants');
    localStorage.removeItem('qrunchy_chains');
    localStorage.removeItem('qrunchy_token');
    setUser(null);
    setRestaurants([]);
    setChains([]);
    setToken(null);
  };

  const login = async (mobile_number: string) => {
    try {
      const result = await loginMutation.mutateAsync({ mobile_number });
      
      // Store in state
      setUser(result.user);
      setRestaurants(result.restaurants);
      setToken(result.token);
      
      // Store in localStorage
      localStorage.setItem('qrunchy_user', JSON.stringify(result.user));
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(result.restaurants));
      localStorage.setItem('qrunchy_token', result.token);
      
      console.log('🔐 Login successful with JWT token');
    } catch (error) {
      clearAuthData();
      throw error; // Re-throw so components can handle the error
    }
  };

  const loginWithPassword = async (mobile_number: string, password: string) => {
    try {
      const result = await loginWithPasswordMutation.mutateAsync({ mobile_number, password });
      
      // Store in state
      setUser(result.user);
      setRestaurants(result.restaurants);
      setToken(result.token);
      
      // Store in localStorage
      localStorage.setItem('qrunchy_user', JSON.stringify(result.user));
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(result.restaurants));
      localStorage.setItem('qrunchy_token', result.token);
      
      console.log('🔐 Password login successful with JWT token');
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

    console.log('🔄 Refreshing session for user:', user.id);
    
    try {
      // Fetch fresh user data and restaurants using the existing login mutation
      const result = await loginMutation.mutateAsync({ 
        mobile_number: user.mobile_number 
      });
      
      // Update state with fresh data including new token
      setUser(result.user);
      setRestaurants(result.restaurants);
      setToken(result.token);
      
      // Update localStorage
      localStorage.setItem('qrunchy_user', JSON.stringify(result.user));
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(result.restaurants));
      localStorage.setItem('qrunchy_token', result.token);
      
      console.log('✅ Session refreshed successfully. Restaurant count:', result.restaurants.length);
    } catch (error) {
      console.error('❌ Failed to refresh session:', error);
      // Don't clear auth data on refresh failure, just log the error
    }
  };
  
  const updateRestaurant = (restaurantId: number, updates: Partial<Restaurant>) => {
    console.log('🔄 Updating restaurant in context:', { restaurantId, updates });
    
    setRestaurants(prev => {
      const updated = prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, ...updates }
          : restaurant
      );
      
      // Update localStorage as well
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(updated));
      
      return updated;
    });
  };

  const addRestaurant = (restaurant: Restaurant) => {
    console.log('➕ Adding new restaurant to context:', restaurant);
    
    setRestaurants(prev => {
      // Check if restaurant already exists
      if (prev.some(r => r.id === restaurant.id)) {
        console.log('Restaurant already exists, updating instead');
        return prev.map(r => r.id === restaurant.id ? restaurant : r);
      }
      
      // Add new restaurant at the beginning (most recent first)
      const updated = [restaurant, ...prev];
      
      // Update localStorage
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(updated));
      
      return updated;
    });
  };

  const addChain = (chain: Chain) => {
    console.log('➕ Adding new chain to context:', chain);
    
    setChains(prev => {
      // Check if chain already exists
      if (prev.some(c => c.id === chain.id)) {
        console.log('Chain already exists, updating instead');
        return prev.map(c => c.id === chain.id ? chain : c);
      }
      
      // Add new chain at the beginning (most recent first)
      const updated = [chain, ...prev];
      
      // Update localStorage
      localStorage.setItem('qrunchy_chains', JSON.stringify(updated));
      
      return updated;
    });
  };

  const updateChain = (chainId: number, updates: Partial<Chain>) => {
    console.log('🔄 Updating chain in context:', { chainId, updates });
    
    setChains(prev => {
      const updated = prev.map(chain => 
        chain.id === chainId 
          ? { ...chain, ...updates }
          : chain
      );
      
      // Update localStorage as well
      localStorage.setItem('qrunchy_chains', JSON.stringify(updated));
      
      return updated;
    });
  };

  const deleteRestaurant = (restaurantId: number) => {
    console.log('🗑️ Deleting restaurant from context:', restaurantId);
    
    setRestaurants(prev => {
      const updated = prev.filter(restaurant => restaurant.id !== restaurantId);
      
      // Update localStorage
      localStorage.setItem('qrunchy_restaurants', JSON.stringify(updated));
      
      return updated;
    });
  };

  const deleteChain = (chainId: number) => {
    console.log('🗑️ Deleting chain from context:', chainId);
    
    setChains(prev => {
      const updated = prev.filter(chain => chain.id !== chainId);
      
      // Update localStorage
      localStorage.setItem('qrunchy_chains', JSON.stringify(updated));
      
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    restaurants,
    chains,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    loginWithPassword,
    logout,
    refreshSession,
    updateRestaurant,
    addRestaurant,
    deleteRestaurant,
    addChain,
    updateChain,
    deleteChain,
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