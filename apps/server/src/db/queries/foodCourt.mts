import { db } from "../index.mjs";
import type { GroupResTable, RestaurantTable } from "../../types/database.mjs";

export interface FoodCourtWithRestaurants {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  restaurants: RestaurantWithMenu[];
}

export interface RestaurantWithMenu {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
  theme_id: string;
  is_active: boolean;
  category_count: number;
  item_count: number;
}

export interface CreateFoodCourtData {
  name: string;
  description?: string;
  user_id: number;
}

export interface SearchResult {
  item_id: number;
  item_name: string;
  item_description: string | null;
  item_price: string;
  item_image_url: string | null;
  category_name: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_theme_id: string;
}

/**
 * Create a new food court
 */
export async function createFoodCourt(data: CreateFoodCourtData) {
  return await db
    .insertInto("group_res")
    .values({
      name: data.name,
      description: data.description || null,
      user_id: data.user_id,
      type: "foodcourt",
      geolocation: "POINT(0 0)", // Default location
      is_active: false, // Inactive by default
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Get food court by ID
 */
export async function getFoodCourtById(id: number): Promise<FoodCourtWithRestaurants | null> {
  const foodCourt = await db
    .selectFrom("group_res")
    .selectAll()
    .where("id", "=", id)
    .where("type", "=", "foodcourt")
    .executeTakeFirst();

  if (!foodCourt) {
    return null;
  }

  const restaurants = await getFoodCourtRestaurants(id);

  return {
    ...foodCourt,
    restaurants,
  };
}

/**
 * Get food court by QR code
 */
export async function getFoodCourtByQrCode(qrCode: string): Promise<FoodCourtWithRestaurants> {
  const qrRecord = await db
    .selectFrom("qr_code")
    .innerJoin("group_res", "qr_code.group_res_id", "group_res.id")
    .select([
      "qr_code.group_res_id",
      "group_res.is_active",
      "group_res.name",
      "group_res.description",
      "group_res.user_id",
      "group_res.created_at",
      "group_res.updated_at",
    ])
    .where("qr_code.code", "=", qrCode)
    .where("qr_code.type", "=", "foodcourt")
    .executeTakeFirst();

  if (!qrRecord || !qrRecord.group_res_id) {
    throw new Error("Food court not found for this QR code");
  }

  // Check if food court is active
  if (!qrRecord.is_active) {
    throw new Error("This food court is pending activation");
  }

  const restaurants = await getFoodCourtRestaurants(qrRecord.group_res_id);

  return {
    id: qrRecord.group_res_id,
    name: qrRecord.name,
    description: qrRecord.description,
    user_id: qrRecord.user_id,
    is_active: qrRecord.is_active,
    created_at: qrRecord.created_at,
    updated_at: qrRecord.updated_at,
    restaurants,
  };
}

/**
 * Get all restaurants in a food court with menu stats
 */
export async function getFoodCourtRestaurants(foodCourtId: number): Promise<RestaurantWithMenu[]> {
  const restaurants = await db
    .selectFrom("restaurant")
    .selectAll()
    .where("group_res_id", "=", foodCourtId)
    .where("is_active", "=", true)
    .execute();

  // Get menu stats for each restaurant
  const restaurantsWithStats = await Promise.all(
    restaurants.map(async (restaurant) => {
      const categoryCount = await db
        .selectFrom("category")
        .select(({ fn }) => fn.countAll().as("count"))
        .where("restaurant_id", "=", restaurant.id)
        .executeTakeFirst();

      const itemCount = await db
        .selectFrom("item")
        .innerJoin("category", "item.category_id", "category.id")
        .select(({ fn }) => fn.countAll().as("count"))
        .where("category.restaurant_id", "=", restaurant.id)
        .executeTakeFirst();

      return {
        ...restaurant,
        category_count: Number(categoryCount?.count ?? 0),
        item_count: Number(itemCount?.count ?? 0),
      };
    })
  );

  return restaurantsWithStats;
}

/**
 * Update restaurants in a food court
 */
export async function updateFoodCourtRestaurants(
  foodCourtId: number,
  restaurantIds: number[]
): Promise<void> {
  await db.transaction().execute(async (trx) => {
    // Remove all current assignments
    await trx
      .updateTable("restaurant")
      .set({ group_res_id: null })
      .where("group_res_id", "=", foodCourtId)
      .execute();

    // Add new assignments
    if (restaurantIds.length > 0) {
      await trx
        .updateTable("restaurant")
        .set({ group_res_id: foodCourtId })
        .where("id", "in", restaurantIds)
        .execute();
    }
  });
}

/**
 * Search items across all restaurants in a food court
 */
export async function searchFoodCourtItems(
  foodCourtId: number,
  query: string
): Promise<SearchResult[]> {
  const searchTerm = `%${query.toLowerCase()}%`;

  return await db
    .selectFrom("item")
    .innerJoin("category", "item.category_id", "category.id")
    .innerJoin("restaurant", "category.restaurant_id", "restaurant.id")
    .select([
      "item.id as item_id",
      "item.name as item_name",
      "item.description as item_description",
      "item.price as item_price",
      "item.image_url as item_image_url",
      "category.name as category_name",
      "restaurant.id as restaurant_id",
      "restaurant.name as restaurant_name",
      "restaurant.theme_id as restaurant_theme_id",
    ])
    .where("restaurant.group_res_id", "=", foodCourtId)
    .where("restaurant.is_active", "=", true)
    .where((eb) =>
      eb.or([
        eb("item.name", "ilike", searchTerm),
        eb("item.description", "ilike", searchTerm),
        eb("category.name", "ilike", searchTerm),
        eb("restaurant.name", "ilike", searchTerm),
      ])
    )
    .orderBy("restaurant.name")
    .orderBy("category.name")
    .orderBy("item.sort_order")
    .execute();
}

/**
 * Activate a food court
 */
export async function activateFoodCourt(id: number): Promise<void> {
  await db
    .updateTable("group_res")
    .set({ is_active: true })
    .where("id", "=", id)
    .where("type", "=", "foodcourt")
    .execute();
}

/**
 * Get user's food courts
 */
export async function getUserFoodCourts(userId: number) {
  return await db
    .selectFrom("group_res")
    .selectAll()
    .where("user_id", "=", userId)
    .where("type", "=", "foodcourt")
    .orderBy("created_at", "desc")
    .execute();
}

/**
 * Update food court details
 */
export async function updateFoodCourt(
  id: number,
  data: { name?: string; description?: string }
) {
  return await db
    .updateTable("group_res")
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where("id", "=", id)
    .where("type", "=", "foodcourt")
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Delete a food court
 */
export async function deleteFoodCourt(id: number): Promise<void> {
  await db.transaction().execute(async (trx) => {
    // Remove restaurant assignments
    await trx
      .updateTable("restaurant")
      .set({ group_res_id: null })
      .where("group_res_id", "=", id)
      .execute();

    // Delete associated QR codes
    await trx
      .deleteFrom("qr_code")
      .where("group_res_id", "=", id)
      .where("type", "=", "foodcourt")
      .execute();

    // Delete the food court
    await trx
      .deleteFrom("group_res")
      .where("id", "=", id)
      .where("type", "=", "foodcourt")
      .execute();
  });
}

/**
 * Check if user owns the food court
 */
export async function checkFoodCourtOwnership(foodCourtId: number, userId: number): Promise<boolean> {
  const foodCourt = await db
    .selectFrom("group_res")
    .select("user_id")
    .where("id", "=", foodCourtId)
    .where("type", "=", "foodcourt")
    .executeTakeFirst();

  return foodCourt?.user_id === userId;
}