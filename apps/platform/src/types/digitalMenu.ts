export interface VariantOption {
  id: string;
  name: string;
  price: number;
}

export interface Variant {
  id: string;
  title: string;
  options: VariantOption[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  variants: Variant[];
  addons: Addon[];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface DigitalMenu {
  restaurantName: string;
  categories: Category[];
  items: MenuItem[];
}

// Additional types for customer-facing components
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  hours: string;
  imageUrl: string;
}

export interface Menu {
  categories: Category[];
  items: MenuItem[];
}

export interface QrCodeData {
  id: string;
  type: "digital" | "photo";
  status: "available" | "used" | "expired";
  restaurant: {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
  } | null;
  expiresAt: string | null;
  isActive: boolean;
  needsActivation?: boolean;
}
