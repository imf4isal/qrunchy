import { z } from "zod";

// Common schemas used across multiple procedures

// Restaurant ID schema - used in many procedures
export const restaurantIdSchema = z.object({
  restaurant_id: z.number().int().positive(),
});

// Variant schema - used in items.mts and menu.mts
export const variantSchema = z.object({
  title: z.string().min(1, "Variant title is required"),
  options: z
    .array(
      z.object({
        name: z.string().min(1, "Option name is required"),
        price: z.number().min(0, "Price must be non-negative"),
      })
    )
    .min(1, "At least one option is required"),
});

// Variant update schema - includes IDs for existing items
export const variantUpdateSchema = z.object({
  id: z.string().optional(), // For existing variants
  title: z.string().min(1, "Variant title is required"),
  options: z
    .array(
      z.object({
        id: z.string().optional(), // For existing options
        name: z.string().min(1, "Option name is required"),
        price: z.number().min(0, "Price must be non-negative"),
      })
    )
    .min(1, "At least one option is required"),
});

// Addon schema - used in items.mts and menu.mts
export const addonSchema = z.object({
  name: z.string().min(1, "Addon name is required"),
  price: z.number().min(0, "Price must be non-negative"),
});

// Addon update schema - includes ID for existing items
export const addonUpdateSchema = z.object({
  id: z.string().optional(), // For existing addons
  name: z.string().min(1, "Addon name is required"),
  price: z.number().min(0, "Price must be non-negative"),
});

// Category creation schema - used in multiple procedures
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

// Full category creation schema with restaurant_id
export const categoryCreateWithRestaurantSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  restaurant_id: z.number().int().positive(),
  sort_order: z.number().int().min(0).optional(),
});

// Category update schema
export const categoryUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Category name is required").optional(),
  sort_order: z.number().int().min(0).optional(),
});

// Menu item base schema - common item properties
export const menuItemBaseSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  variants: z.array(variantSchema).optional(),
  addons: z.array(addonSchema).optional(),
});

// ID parameter schemas
export const idSchema = z.object({
  id: z.number().int().positive(),
});

export const categoryIdSchema = z.object({
  category_id: z.number().int().positive(),
});