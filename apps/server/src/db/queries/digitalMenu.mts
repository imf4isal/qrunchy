import { db } from "../index.mts";
import type { 
  CategoryWithItems, 
  MenuItemWithDetails, 
  VariantWithOptions, 
  CompleteMenuData 
} from "../../types/digitalMenu.mts";

/**
 * Get all categories for a restaurant with their items, variants, and addons
 */
export async function getCompleteMenuByRestaurant(restaurantId: number): Promise<CompleteMenuData> {
  // Get restaurant info
  const restaurant = await db
    .selectFrom("restaurant")
    .select(["id", "name"])
    .where("id", "=", restaurantId)
    .executeTakeFirst();

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  // Get categories for restaurant
  const categories = await db
    .selectFrom("category")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .orderBy("sort_order", "asc")
    .execute();

  const categoriesWithItems: CategoryWithItems[] = [];

  for (const category of categories) {
    const items = await getItemsWithDetailsByCategory(category.id);
    categoriesWithItems.push({
      ...category,
      items,
    });
  }

  return {
    restaurant,
    categories: categoriesWithItems,
  };
}

/**
 * Get all menu items for a category with variants and addons
 */
export async function getItemsWithDetailsByCategory(categoryId: number): Promise<MenuItemWithDetails[]> {
  // Get items for category
  const items = await db
    .selectFrom("item")
    .selectAll()
    .where("category_id", "=", categoryId)
    .orderBy("sort_order", "asc")
    .execute();

  const itemsWithDetails: MenuItemWithDetails[] = [];

  for (const item of items) {
    const variants = await getVariantsWithOptions(item.id);
    const addons = await getAddonsByItem(item.id);

    itemsWithDetails.push({
      ...item,
      variants,
      addons,
    });
  }

  return itemsWithDetails;
}

/**
 * Get single menu item with full details
 */
export async function getItemWithDetailsById(itemId: number): Promise<MenuItemWithDetails | null> {
  const item = await db
    .selectFrom("item")
    .selectAll()
    .where("id", "=", itemId)
    .executeTakeFirst();

  if (!item) {
    return null;
  }

  const variants = await getVariantsWithOptions(item.id);
  const addons = await getAddonsByItem(item.id);

  return {
    ...item,
    variants,
    addons,
  };
}

/**
 * Get variants with their options for an item
 */
export async function getVariantsWithOptions(itemId: number): Promise<VariantWithOptions[]> {
  const variants = await db
    .selectFrom("variant")
    .selectAll()
    .where("item_id", "=", itemId)
    .execute();

  const variantsWithOptions: VariantWithOptions[] = [];

  for (const variant of variants) {
    const options = await db
      .selectFrom("variant_option")
      .selectAll()
      .where("item_variant_id", "=", variant.id)
      .execute();

    variantsWithOptions.push({
      ...variant,
      options,
    });
  }

  return variantsWithOptions;
}

/**
 * Get addons for an item
 */
export async function getAddonsByItem(itemId: number) {
  return await db
    .selectFrom("addon")
    .selectAll()
    .where("item_id", "=", itemId)
    .execute();
}

/**
 * Get categories for a restaurant
 */
export async function getCategoriesByRestaurant(restaurantId: number) {
  return await db
    .selectFrom("category")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .orderBy("sort_order", "asc")
    .execute();
}

/**
 * Create new category
 */
export async function createCategory(data: {
  name: string;
  restaurant_id: number;
  sort_order?: number;
}) {
  // Get next sort order if not provided
  let sortOrder = data.sort_order;
  if (sortOrder === undefined) {
    const lastCategory = await db
      .selectFrom("category")
      .select("sort_order")
      .where("restaurant_id", "=", data.restaurant_id)
      .orderBy("sort_order", "desc")
      .executeTakeFirst();
    
    sortOrder = (lastCategory?.sort_order ?? -1) + 1;
  }

  return await db
    .insertInto("category")
    .values({
      name: data.name,
      restaurant_id: data.restaurant_id,
      sort_order: sortOrder,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Update category
 */
export async function updateCategory(id: number, data: {
  name?: string;
  sort_order?: number;
}) {
  return await db
    .updateTable("category")
    .set(data)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Delete category and all its items (cascade)
 */
export async function deleteCategory(id: number) {
  return await db.transaction().execute(async (trx) => {
    // Get all items in this category
    const items = await trx
      .selectFrom("item")
      .select("id")
      .where("category_id", "=", id)
      .execute();

    // Delete variants and addons for all items
    for (const item of items) {
      await deleteItemCascade(item.id, trx);
    }

    // Delete the category
    return await trx
      .deleteFrom("category")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  });
}

/**
 * Create menu item with variants and addons
 */
export async function createItemWithDetails(data: {
  name: string;
  price: number;
  description?: string;
  category_id: number;
  sort_order?: number;
  image_url?: string;
  variants?: Array<{
    title: string;
    options: Array<{ name: string; price: number }>;
  }>;
  addons?: Array<{ name: string; price: number }>;
}) {
  return await db.transaction().execute(async (trx) => {
    // Get next sort order if not provided
    let sortOrder = data.sort_order;
    if (sortOrder === undefined) {
      const lastItem = await trx
        .selectFrom("item")
        .select("sort_order")
        .where("category_id", "=", data.category_id)
        .orderBy("sort_order", "desc")
        .executeTakeFirst();
      
      sortOrder = (lastItem?.sort_order ?? -1) + 1;
    }

    // Create item
    const item = await trx
      .insertInto("item")
      .values({
        name: data.name,
        price: data.price.toFixed(2),
        description: data.description || null,
        category_id: data.category_id,
        sort_order: sortOrder,
        image_url: data.image_url || null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Create variants
    if (data.variants) {
      for (const variant of data.variants) {
        const createdVariant = await trx
          .insertInto("variant")
          .values({
            name: variant.title,
            item_id: item.id,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        // Create variant options
        for (const option of variant.options) {
          await trx
            .insertInto("variant_option")
            .values({
              item_variant_id: createdVariant.id,
              name: option.name,
              price: option.price.toFixed(2),
            })
            .execute();
        }
      }
    }

    // Create addons
    if (data.addons) {
      for (const addon of data.addons) {
        await trx
          .insertInto("addon")
          .values({
            item_id: item.id,
            name: addon.name,
            price: addon.price.toFixed(2),
          })
          .execute();
      }
    }

    return item;
  });
}

/**
 * Delete item with cascade (variants, options, addons)
 */
export async function deleteItemCascade(itemId: number, trx?: any) {
  const executor = trx || db;

  // Get variants
  const variants = await executor
    .selectFrom("variant")
    .select("id")
    .where("item_id", "=", itemId)
    .execute();

  // Delete variant options
  for (const variant of variants) {
    await executor
      .deleteFrom("variant_option")
      .where("item_variant_id", "=", variant.id)
      .execute();
  }

  // Delete variants
  await executor
    .deleteFrom("variant")
    .where("item_id", "=", itemId)
    .execute();

  // Delete addons
  await executor
    .deleteFrom("addon")
    .where("item_id", "=", itemId)
    .execute();

  // Delete item
  return await executor
    .deleteFrom("item")
    .where("id", "=", itemId)
    .returningAll()
    .executeTakeFirstOrThrow();
}