import type { Restaurant, Menu, QrCodeData } from "@/types/digitalMenu";

export const dummyRestaurant: Restaurant = {
  id: "rest_001",
  name: "Khana Khazana",
  description:
    "Authentic Bangladeshi cuisine with traditional flavors and modern presentation",
  address: "House 45, Road 27, Dhanmondi, Dhaka 1209",
  phone: "+880 1712-345678",
  rating: 4.7,
  reviewCount: 286,
  hours: "11:30 AM - 11:00 PM",
  imageUrl:
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=400&fit=crop",
};

export const dummyMenu: Menu = {
  categories: [
    { id: "cat_1", name: "Appetizers & Starters", sortOrder: 0 },
    { id: "cat_2", name: "Rice & Biriyani", sortOrder: 1 },
    { id: "cat_3", name: "Curry & Main Course", sortOrder: 2 },
    { id: "cat_4", name: "Fish & Seafood", sortOrder: 3 },
    { id: "cat_5", name: "Desserts & Sweets", sortOrder: 4 },
    { id: "cat_6", name: "Beverages", sortOrder: 5 },
  ],
  items: [
    {
      id: "item_1",
      name: "Shingara",
      price: 25,
      description:
        "Crispy triangular pastries filled with spiced potatoes and vegetables",
      categoryId: "cat_1",
      variants: [],
      addons: [
        { id: "addon_1", name: "Extra Chutneys", price: 10 },
        { id: "addon_2", name: "Fried Green Chili", price: 5 },
      ],
    },
    {
      id: "item_2",
      name: "Chicken Kebab",
      price: 180,
      description: "Grilled marinated chicken skewers with aromatic spices",
      categoryId: "cat_1",
      variants: [
        {
          id: "var_1",
          title: "Portion",
          options: [
            { id: "opt_1", name: "Half Portion (3 pieces)", price: 180 },
            { id: "opt_2", name: "Full Portion (6 pieces)", price: 320 },
          ],
        },
      ],
      addons: [
        { id: "addon_3", name: "Mint Chutney", price: 15 },
        { id: "addon_4", name: "Extra Naan", price: 40 },
      ],
    },
    {
      id: "item_3",
      name: "Chicken Biriyani",
      price: 280,
      description:
        "Fragrant basmati rice cooked with tender chicken and aromatic spices",
      categoryId: "cat_2",
      variants: [
        {
          id: "var_2",
          title: "Style",
          options: [
            { id: "opt_3", name: "Dhaka Style", price: 0 },
            { id: "opt_4", name: "Hyderabadi Style", price: 30 },
            { id: "opt_5", name: "Kolkata Style", price: 20 },
          ],
        },
      ],
      addons: [
        { id: "addon_5", name: "Boiled Egg", price: 25 },
        { id: "addon_6", name: "Raita", price: 30 },
        { id: "addon_7", name: "Shorba (Soup)", price: 40 },
      ],
    },
    {
      id: "item_4",
      name: "Mutton Biriyani",
      price: 420,
      description:
        "Premium basmati rice with tender mutton pieces and traditional spices",
      categoryId: "cat_2",
      variants: [
        {
          id: "var_3",
          title: "Style",
          options: [
            { id: "opt_6", name: "Dhaka Style", price: 0 },
            { id: "opt_7", name: "Hyderabadi Style", price: 50 },
          ],
        },
      ],
      addons: [
        { id: "addon_8", name: "Extra Mutton Piece", price: 80 },
        { id: "addon_9", name: "Raita", price: 30 },
      ],
    },
    {
      id: "item_5",
      name: "Beef Bhuna",
      price: 320,
      description: "Slow-cooked beef with onions, spices, and thick gravy",
      categoryId: "cat_3",
      variants: [
        {
          id: "var_4",
          title: "Spice Level",
          options: [
            { id: "opt_8", name: "Mild", price: 0 },
            { id: "opt_9", name: "Medium", price: 0 },
            { id: "opt_10", name: "Spicy", price: 0 },
          ],
        },
      ],
      addons: [
        { id: "addon_10", name: "Plain Rice", price: 50 },
        { id: "addon_11", name: "Naan", price: 40 },
      ],
    },
    {
      id: "item_6",
      name: "Chicken Karahi",
      price: 250,
      description:
        "Chicken cooked in traditional karahi with tomatoes and green chilies",
      categoryId: "cat_3",
      variants: [],
      addons: [
        { id: "addon_12", name: "Garlic Naan", price: 50 },
        { id: "addon_13", name: "Basmati Rice", price: 60 },
      ],
    },
    {
      id: "item_7",
      name: "Hilsa Fish Curry",
      price: 380,
      description:
        "Bangladesh's national fish cooked in traditional mustard and coconut curry",
      categoryId: "cat_4",
      variants: [
        {
          id: "var_5",
          title: "Preparation",
          options: [
            { id: "opt_11", name: "Mustard Curry", price: 0 },
            { id: "opt_12", name: "Coconut Curry", price: 20 },
            { id: "opt_13", name: "Bengali Style", price: 30 },
          ],
        },
      ],
      addons: [
        { id: "addon_14", name: "Steamed Rice", price: 40 },
        { id: "addon_15", name: "Dal (Lentils)", price: 60 },
      ],
    },
    {
      id: "item_8",
      name: "Prawn Malai Curry",
      price: 450,
      description:
        "Jumbo prawns cooked in creamy coconut milk with mild spices",
      categoryId: "cat_4",
      variants: [
        {
          id: "var_6",
          title: "Size",
          options: [
            { id: "opt_14", name: "Medium Prawns", price: 450 },
            { id: "opt_15", name: "Jumbo Prawns", price: 550 },
          ],
        },
      ],
      addons: [
        { id: "addon_16", name: "Jeera Rice", price: 70 },
        { id: "addon_17", name: "Butter Naan", price: 55 },
      ],
    },
    {
      id: "item_9",
      name: "Roshogolla",
      price: 40,
      description: "Soft and spongy cottage cheese balls soaked in sugar syrup",
      categoryId: "cat_5",
      variants: [
        {
          id: "var_7",
          title: "Quantity",
          options: [
            { id: "opt_16", name: "2 pieces", price: 40 },
            { id: "opt_17", name: "4 pieces", price: 75 },
            { id: "opt_18", name: "6 pieces", price: 110 },
          ],
        },
      ],
      addons: [],
    },
    {
      id: "item_10",
      name: "Mishti Doi",
      price: 60,
      description: "Sweet yogurt dessert with caramelized sugar and cardamom",
      categoryId: "cat_5",
      variants: [],
      addons: [
        { id: "addon_18", name: "Pistachios", price: 15 },
        { id: "addon_19", name: "Almonds", price: 20 },
      ],
    },
    {
      id: "item_11",
      name: "Cha (Tea)",
      price: 15,
      description: "Traditional Bangladeshi milk tea with aromatic spices",
      categoryId: "cat_6",
      variants: [
        {
          id: "var_8",
          title: "Type",
          options: [
            { id: "opt_19", name: "Regular Cha", price: 15 },
            { id: "opt_20", name: "Masala Cha", price: 20 },
            { id: "opt_21", name: "Green Tea", price: 25 },
            { id: "opt_22", name: "Lemon Tea", price: 22 },
          ],
        },
      ],
      addons: [
        { id: "addon_20", name: "Extra Sugar", price: 2 },
        { id: "addon_21", name: "Extra Milk", price: 5 },
        { id: "addon_22", name: "Ginger", price: 3 },
      ],
    },
    {
      id: "item_12",
      name: "Fresh Lime Water",
      price: 35,
      description: "Refreshing lime water with fresh mint and a hint of salt",
      categoryId: "cat_6",
      variants: [
        {
          id: "var_9",
          title: "Style",
          options: [
            { id: "opt_23", name: "Sweet", price: 0 },
            { id: "opt_24", name: "Salty", price: 0 },
            { id: "opt_25", name: "Mixed (Sweet & Salty)", price: 5 },
          ],
        },
      ],
      addons: [
        { id: "addon_23", name: "Extra Mint", price: 5 },
        { id: "addon_24", name: "Black Salt", price: 3 },
      ],
    },
  ],
};

export const dummyQrData: Record<string, QrCodeData> = {
  qr_001: {
    id: "qr_001",
    type: "digital",
    status: "used",
    restaurant: {
      id: "rest_001",
      name: "Khana Khazana",
      description: "Authentic Bangladeshi cuisine with traditional flavors",
      address: "House 45, Road 27, Dhanmondi, Dhaka 1209",
      phone: "+880 1712-345678",
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
      name: "Spice Garden",
      description: "Traditional Bengali home-style cooking",
      address: "Plot 15, Sector 7, Uttara, Dhaka 1230",
      phone: "+880 1756-789012",
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
      name: "Old Dhaka Biriyani",
      description: "This QR code has expired",
      address: "Puran Dhaka, Lalbagh",
      phone: "+880 1612-000000",
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
