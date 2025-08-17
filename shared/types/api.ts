// Shared API types for frontend-backend communication
// This file can be imported by both frontend and backend

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

export interface LoginResponse {
  user: User;
  restaurants: Restaurant[];
  token: string;
}

// Define the AppRouter interface structure for tRPC client
export interface AppRouterStructure {
  auth: {
    test: any;
    login: any;
    loginWithPassword: any;
    logout: any;
    sendOTP: any;
    verifyOTP: any;
    setPassword: any;
    validateToken: any;
    me: any;
  };
  hello: any;
  digitalMenu: any;
  photoMenu: any;
  user: any;
  restaurant: any;
  foodCourt: any;
}