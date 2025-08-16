// Shared transformation utilities for menu data

// Helper function to transform database menu to frontend format
export const transformMenuToFrontend = (menuData: any) => ({
  restaurant: {
    id: menuData.restaurant.id.toString(),
    name: menuData.restaurant.name,
  },
  categories: menuData.categories.map((category: any) => ({
    id: category.id.toString(),
    name: category.name,
    sortOrder: category.sort_order,
    items: category.items.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      price: parseFloat(item.price),
      description: item.description || undefined,
      image_url: item.image_url || undefined, // CRITICAL: Include image_url field
      categoryId: item.category_id.toString(),
      variants: (item.variants || []).map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.name,
        options: (variant.options || []).map((option: any) => ({
          id: option.id.toString(),
          name: option.name,
          price: parseFloat(option.price),
        })),
      })),
      addons: (item.addons || []).map((addon: any) => ({
        id: addon.id.toString(),
        name: addon.name,
        price: parseFloat(addon.price),
      })),
    })),
  })),
});

// Transform menu data for export format
export const transformMenuForExport = (menuData: any) => ({
  categories: menuData.categories.map((category: any) => ({
    name: category.name,
  })),
  items: menuData.categories.flatMap((category: any) => 
    category.items.map((item: any) => ({
      name: item.name,
      price: parseFloat(item.price),
      description: item.description || undefined,
      image_url: item.image_url || undefined, // CRITICAL: Include image_url field for export
      categoryName: category.name,
      variants: item.variants.map((variant: any) => ({
        title: variant.name,
        options: variant.options.map((option: any) => ({
          name: option.name,
          price: parseFloat(option.price),
        })),
      })),
      addons: item.addons.map((addon: any) => ({
        name: addon.name,
        price: parseFloat(addon.price),
      })),
    }))
  ),
});