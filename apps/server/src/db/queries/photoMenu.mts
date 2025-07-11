import { db } from "../index.mjs";
import type { PhotoMenuTable } from "../../types/database.mjs";

export interface PhotoMenuWithRestaurant {
  id: number;
  restaurant_id: number;
  image_url: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  restaurant_name: string;
  restaurant_mobile: string;
  restaurant_address: string | null;
}

export interface CreatePhotoMenuData {
  restaurant_id: number;
  image_url: string;
  sort_order?: number;
}

export interface UpdatePhotoMenuData {
  image_url?: string;
  sort_order?: number;
}

/**
 * Get all photo menu images for a restaurant
 */
export async function getPhotoMenuByRestaurant(restaurantId: number): Promise<PhotoMenuWithRestaurant[]> {
  return await db
    .selectFrom("photo_menu")
    .innerJoin("restaurant", "restaurant.id", "photo_menu.restaurant_id")
    .select([
      "photo_menu.id",
      "photo_menu.restaurant_id",
      "photo_menu.image_url",
      "photo_menu.sort_order",
      "photo_menu.created_at",
      "photo_menu.updated_at",
      "restaurant.name as restaurant_name",
      "restaurant.mobile as restaurant_mobile",
      "restaurant.address as restaurant_address",
    ])
    .where("photo_menu.restaurant_id", "=", restaurantId)
    .orderBy("photo_menu.sort_order", "asc")
    .execute();
}

/**
 * Get photo menu by QR code
 */
export async function getPhotoMenuByQrCode(qrCode: string): Promise<PhotoMenuWithRestaurant[]> {
  const qrRecord = await db
    .selectFrom("qr_code")
    .select("restaurant_id")
    .where("code", "=", qrCode)
    .where("type", "=", "photo")
    .executeTakeFirst();

  if (!qrRecord || !qrRecord.restaurant_id) {
    throw new Error("Photo menu not found for this QR code");
  }

  return await getPhotoMenuByRestaurant(qrRecord.restaurant_id);
}

/**
 * Create a new photo menu entry
 */
export async function createPhotoMenu(data: CreatePhotoMenuData): Promise<PhotoMenuTable> {
  // Get next sort order if not provided
  let sortOrder = data.sort_order;
  if (sortOrder === undefined) {
    const lastPhoto = await db
      .selectFrom("photo_menu")
      .select("sort_order")
      .where("restaurant_id", "=", data.restaurant_id)
      .orderBy("sort_order", "desc")
      .executeTakeFirst();
    
    sortOrder = (lastPhoto?.sort_order ?? -1) + 1;
  }

  return await db
    .insertInto("photo_menu")
    .values({
      restaurant_id: data.restaurant_id,
      image_url: data.image_url,
      sort_order: sortOrder,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Create multiple photo menu entries
 */
export async function createMultiplePhotoMenus(restaurantId: number, imageUrls: string[]): Promise<PhotoMenuTable[]> {
  return await db.transaction().execute(async (trx) => {
    // Get the current max sort order
    const lastPhoto = await trx
      .selectFrom("photo_menu")
      .select("sort_order")
      .where("restaurant_id", "=", restaurantId)
      .orderBy("sort_order", "desc")
      .executeTakeFirst();
    
    let currentSortOrder = (lastPhoto?.sort_order ?? -1) + 1;
    const results: PhotoMenuTable[] = [];

    for (const imageUrl of imageUrls) {
      const result = await trx
        .insertInto("photo_menu")
        .values({
          restaurant_id: restaurantId,
          image_url: imageUrl,
          sort_order: currentSortOrder,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      
      results.push(result);
      currentSortOrder++;
    }

    return results;
  });
}

/**
 * Update photo menu entry
 */
export async function updatePhotoMenu(id: number, data: UpdatePhotoMenuData): Promise<PhotoMenuTable> {
  return await db
    .updateTable("photo_menu")
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Update sort order for multiple photos
 */
export async function updatePhotoMenuSortOrder(updates: Array<{ id: number; sort_order: number }>): Promise<void> {
  await db.transaction().execute(async (trx) => {
    for (const update of updates) {
      await trx
        .updateTable("photo_menu")
        .set({
          sort_order: update.sort_order,
          updated_at: new Date(),
        })
        .where("id", "=", update.id)
        .execute();
    }
  });
}

/**
 * Delete photo menu entry
 */
export async function deletePhotoMenu(id: number): Promise<PhotoMenuTable> {
  return await db
    .deleteFrom("photo_menu")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Delete all photo menu entries for a restaurant
 */
export async function deleteAllPhotoMenusForRestaurant(restaurantId: number): Promise<void> {
  await db
    .deleteFrom("photo_menu")
    .where("restaurant_id", "=", restaurantId)
    .execute();
}

/**
 * Check if restaurant owns photo menu entry
 */
export async function checkPhotoMenuOwnership(photoMenuId: number, restaurantId: number): Promise<boolean> {
  const photo = await db
    .selectFrom("photo_menu")
    .select("restaurant_id")
    .where("id", "=", photoMenuId)
    .executeTakeFirst();

  return photo?.restaurant_id === restaurantId;
}

/**
 * Get photo menu count for restaurant
 */
export async function getPhotoMenuCount(restaurantId: number): Promise<number> {
  const result = await db
    .selectFrom("photo_menu")
    .select(({ fn }) => fn.countAll().as("count"))
    .where("restaurant_id", "=", restaurantId)
    .executeTakeFirst();

  return Number(result?.count ?? 0);
}