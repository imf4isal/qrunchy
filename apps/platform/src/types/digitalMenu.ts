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
