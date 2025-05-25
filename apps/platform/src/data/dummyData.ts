import type { Restaurant, Menu, QrCodeData } from "@/types/digitalMenu";

export const dummyRestaurant: Restaurant = {
  id: "rest_001",
  name: "Bella Vista Italiana",
  description: "Authentic Italian cuisine in the heart of the city",
  address: "123 Main Street, Downtown",
  phone: "+1 (555) 123-4567",
  rating: 4.8,
  reviewCount: 324,
  hours: "11:00 AM - 10:00 PM",
  imageUrl:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
};

export const dummyMenu: Menu = {
  categories: [
    { id: "cat_1", name: "Appetizers", sortOrder: 0 },
    { id: "cat_2", name: "Pasta & Risotto", sortOrder: 1 },
    { id: "cat_3", name: "Main Courses", sortOrder: 2 },
    { id: "cat_4", name: "Desserts", sortOrder: 3 },
    { id: "cat_5", name: "Beverages", sortOrder: 4 },
  ],
  items: [
    {
      id: "item_1",
      name: "Bruschetta Trio",
      price: 12.99,
      description:
        "Three pieces of toasted bread topped with fresh tomatoes, basil, and mozzarella",
      categoryId: "cat_1",
      variants: [],
      addons: [
        { id: "addon_1", name: "Extra Mozzarella", price: 2.5 },
        { id: "addon_2", name: "Balsamic Glaze", price: 1.5 },
      ],
    },
    {
      id: "item_2",
      name: "Calamari Fritti",
      price: 14.99,
      description:
        "Crispy fried squid rings served with marinara sauce and lemon",
      categoryId: "cat_1",
      variants: [
        {
          id: "var_1",
          title: "Size",
          options: [
            { id: "opt_1", name: "Regular", price: 14.99 },
            { id: "opt_2", name: "Large", price: 18.99 },
          ],
        },
      ],
      addons: [{ id: "addon_3", name: "Spicy Marinara", price: 1.0 }],
    },
    {
      id: "item_3",
      name: "Spaghetti Carbonara",
      price: 18.99,
      description:
        "Classic Roman pasta with eggs, pecorino cheese, pancetta, and black pepper",
      categoryId: "cat_2",
      variants: [
        {
          id: "var_2",
          title: "Pasta Type",
          options: [
            { id: "opt_3", name: "Spaghetti", price: 0 },
            { id: "opt_4", name: "Linguine", price: 0 },
            { id: "opt_5", name: "Penne", price: 0 },
          ],
        },
      ],
      addons: [
        { id: "addon_4", name: "Extra Pancetta", price: 3.5 },
        { id: "addon_5", name: "Truffle Oil", price: 4.0 },
      ],
    },
    {
      id: "item_4",
      name: "Risotto ai Funghi",
      price: 22.99,
      description:
        "Creamy Arborio rice with mixed wild mushrooms, white wine, and Parmesan",
      categoryId: "cat_2",
      variants: [],
      addons: [{ id: "addon_6", name: "Extra Parmesan", price: 2.0 }],
    },
    {
      id: "item_5",
      name: "Osso Buco",
      price: 32.99,
      description:
        "Braised veal shanks with vegetables, white wine, and bone marrow, served with risotto",
      categoryId: "cat_3",
      variants: [],
      addons: [],
    },
    {
      id: "item_6",
      name: "Branzino",
      price: 28.99,
      description:
        "Mediterranean sea bass grilled with herbs, lemon, and olive oil",
      categoryId: "cat_3",
      variants: [
        {
          id: "var_3",
          title: "Preparation",
          options: [
            { id: "opt_6", name: "Grilled", price: 0 },
            { id: "opt_7", name: "Pan-Seared", price: 0 },
            { id: "opt_8", name: "Salt-Crusted", price: 4.0 },
          ],
        },
      ],
      addons: [
        { id: "addon_7", name: "Seasonal Vegetables", price: 6.0 },
        { id: "addon_8", name: "Roasted Potatoes", price: 4.5 },
      ],
    },
    {
      id: "item_7",
      name: "Tiramisu",
      price: 8.99,
      description:
        "Classic Italian dessert with ladyfingers, espresso, mascarpone, and cocoa",
      categoryId: "cat_4",
      variants: [],
      addons: [{ id: "addon_9", name: "Extra Espresso Shot", price: 1.5 }],
    },
    {
      id: "item_8",
      name: "Panna Cotta",
      price: 7.99,
      description: "Silky vanilla custard with fresh berries and berry coulis",
      categoryId: "cat_4",
      variants: [
        {
          id: "var_4",
          title: "Flavor",
          options: [
            { id: "opt_9", name: "Vanilla", price: 0 },
            { id: "opt_10", name: "Lemon", price: 0 },
            { id: "opt_11", name: "Chocolate", price: 1.0 },
          ],
        },
      ],
      addons: [],
    },
    {
      id: "item_9",
      name: "House Wine",
      price: 8.99,
      description: "Our carefully selected house wines from Italian vineyards",
      categoryId: "cat_5",
      variants: [
        {
          id: "var_5",
          title: "Type",
          options: [
            { id: "opt_12", name: "Red (Chianti)", price: 8.99 },
            { id: "opt_13", name: "White (Pinot Grigio)", price: 8.99 },
            { id: "opt_14", name: "Rosé", price: 9.99 },
          ],
        },
        {
          id: "var_6",
          title: "Size",
          options: [
            { id: "opt_15", name: "Glass", price: 0 },
            { id: "opt_16", name: "Half Bottle", price: 12.0 },
            { id: "opt_17", name: "Full Bottle", price: 28.0 },
          ],
        },
      ],
      addons: [],
    },
    {
      id: "item_10",
      name: "Espresso",
      price: 3.5,
      description: "Rich and bold Italian espresso",
      categoryId: "cat_5",
      variants: [
        {
          id: "var_7",
          title: "Style",
          options: [
            { id: "opt_18", name: "Single Shot", price: 3.5 },
            { id: "opt_19", name: "Double Shot", price: 4.5 },
            { id: "opt_20", name: "Cappuccino", price: 4.99 },
            { id: "opt_21", name: "Latte", price: 5.49 },
          ],
        },
      ],
      addons: [
        { id: "addon_10", name: "Extra Shot", price: 1.5 },
        { id: "addon_11", name: "Oat Milk", price: 0.75 },
        { id: "addon_12", name: "Vanilla Syrup", price: 0.5 },
      ],
    },
  ],
};

// QR Code dummy data
export const dummyQrData: Record<string, QrCodeData> = {
  qr_001: {
    id: "qr_001",
    type: "digital",
    status: "used",
    restaurant: {
      id: "rest_001",
      name: "Bella Vista Italiana",
      description: "Authentic Italian cuisine in the heart of the city",
      address: "123 Main Street, Downtown",
      phone: "+1 (555) 123-4567",
    },
    expiresAt: null,
    isActive: true,
  },
  qr_002: {
    id: "qr_002",
    type: "photo",
    status: "used",
    restaurant: {
      id: "rest_002",
      name: "Tokyo Ramen House",
      description: "Traditional Japanese ramen and street food",
      address: "456 East Avenue, Chinatown",
      phone: "+1 (555) 987-6543",
    },
    expiresAt: null,
    isActive: true,
  },
  qr_expired: {
    id: "qr_expired",
    type: "digital",
    status: "expired",
    restaurant: {
      id: "rest_003",
      name: "Expired Restaurant",
      description: "This QR code has expired",
      address: "789 Test Street",
      phone: "+1 (555) 000-0000",
    },
    expiresAt: "2024-01-01T00:00:00Z",
    isActive: false,
  },
  qr_self_serve: {
    id: "qr_self_serve",
    type: "digital",
    status: "available",
    restaurant: null,
    expiresAt: "2025-06-01T00:00:00Z",
    isActive: false,
    needsActivation: true,
  },
};
