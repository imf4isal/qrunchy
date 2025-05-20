import { Generated, ColumnType } from "kysely";

type Point = ColumnType<string, string, string>;

type QrType = "photo" | "digital";
type QrStatus = "available" | "used" | "expired";

export interface Database {
  user: UserTable;
  group_res: GroupResTable;
  restaurant: RestaurantTable;
  qr_code: QrCodeTable;
  photo_menu: PhotoMenuTable;
  category: CategoryTable;
  item: ItemTable;
  variant: VariantTable;
  variant_option: VariantOptionTable;
  addon: AddonTable;
}

export interface UserTable {
  id: Generated<number>;
  mobile_number: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface GroupResTable {
  id: Generated<number>;
  name: string;
  mobile: string | null;
  address: string;
  geolocation: Point;
  description: string | null;
  user_id: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  is_active: Generated<boolean>;
}

export interface RestaurantTable {
  id: Generated<number>;
  name: string;
  mobile: string;
  address: string | null;
  geolocation: Point;
  group_res_id: number | null;
  user_id: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  is_active: Generated<boolean>;
}

export interface QrCodeTable {
  id: Generated<number>;
  code: string;
  type: QrType;
  status: QrStatus;
  restaurant_id: number | null;
  created_at: Generated<Date>;
  bound_at: Date | null;
  expires_at: Date | null;
  self_serve: Generated<boolean>;
}

export interface PhotoMenuTable {
  id: Generated<number>;
  restaurant_id: number;
  image_url: string;
  sort_order: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface CategoryTable {
  id: Generated<number>;
  restaurant_id: number;
  name: string;
  sort_order: number;
}

export interface ItemTable {
  id: Generated<number>;
  name: string;
  price: string;
  description: string | null;
  category_id: number;
  sort_order: number;
}

export interface VariantTable {
  id: Generated<number>;
  name: string;
  item_id: number;
}

export interface VariantOptionTable {
  id: Generated<number>;
  item_variant_id: number;
  name: string;
  price: string;
}

export interface AddonTable {
  id: Generated<number>;
  item_id: number;
  name: string;
  price: string;
}
