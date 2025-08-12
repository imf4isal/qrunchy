// Server-side types for digital menu operations
// These map between database tables and frontend interfaces

export interface CategoryWithItems {
  id: number;
  name: string;
  sort_order: number;
  restaurant_id: number;
  items: MenuItemWithDetails[];
}

export interface MenuItemWithDetails {
  id: number;
  name: string;
  price: string; // decimal from database
  description: string | null;
  category_id: number;
  sort_order: number;
  variants: VariantWithOptions[];
  addons: AddonDetail[];
}

export interface VariantWithOptions {
  id: number;
  name: string; // This maps to 'title' in frontend
  item_id: number;
  options: VariantOptionDetail[];
}

export interface VariantOptionDetail {
  id: number;
  name: string;
  price: string; // decimal from database
  item_variant_id: number;
}

export interface AddonDetail {
  id: number;
  name: string;
  price: string; // decimal from database
  item_id: number;
}

// Complete menu structure for restaurant
export interface CompleteMenuData {
  restaurant: {
    id: number;
    name: string;
  };
  categories: CategoryWithItems[];
}

// QR Code data for digital menus
export interface DigitalQrData {
  id: string;
  code: string;
  type: "digital";
  status: "available" | "used" | "expired";
  restaurant_id: number | null;
  created_at: Date;
  bound_at: Date | null;
  expires_at: Date | null;
  self_serve: boolean;
}

// Bulk import structures
export interface BulkImportCategory {
  name: string;
}

export interface BulkImportVariant {
  title: string;
  options: {
    name: string;
    price: number;
  }[];
}

export interface BulkImportAddon {
  name: string;
  price: number;
}

export interface BulkImportItem {
  name: string;
  price: number;
  description?: string;
  categoryName: string;
  image_url?: string;
  variants?: BulkImportVariant[];
  addons?: BulkImportAddon[];
}

export interface BulkImportData {
  categories: BulkImportCategory[];
  items: BulkImportItem[];
}

// Type conversion utilities
export const convertPriceToNumber = (price: string): number => {
  return parseFloat(price);
};

export const convertPriceToString = (price: number): string => {
  return price.toFixed(2);
};

// Frontend interface mappings
export const mapToFrontendCategory = (dbCategory: CategoryWithItems) => ({
  id: dbCategory.id.toString(),
  name: dbCategory.name,
  sortOrder: dbCategory.sort_order,
});

export const mapToFrontendMenuItem = (dbItem: MenuItemWithDetails) => ({
  id: dbItem.id.toString(),
  name: dbItem.name,
  price: convertPriceToNumber(dbItem.price),
  description: dbItem.description || undefined,
  categoryId: dbItem.category_id.toString(),
  variants: dbItem.variants.map(mapToFrontendVariant),
  addons: dbItem.addons.map(mapToFrontendAddon),
});

export const mapToFrontendVariant = (dbVariant: VariantWithOptions) => ({
  id: dbVariant.id.toString(),
  title: dbVariant.name, // Note: database 'name' maps to frontend 'title'
  options: dbVariant.options.map(mapToFrontendVariantOption),
});

export const mapToFrontendVariantOption = (dbOption: VariantOptionDetail) => ({
  id: dbOption.id.toString(),
  name: dbOption.name,
  price: convertPriceToNumber(dbOption.price),
});

export const mapToFrontendAddon = (dbAddon: AddonDetail) => ({
  id: dbAddon.id.toString(),
  name: dbAddon.name,
  price: convertPriceToNumber(dbAddon.price),
});