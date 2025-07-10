import type { PhotoMenuData } from "@/types/photoMenu";
import { savePhotoMenu, generateQRCode } from "@/utils/photoMenuStorage";

// Sample menu images (we'll use placeholder images for now)
const SAMPLE_MENU_IMAGES = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
];

const SAMPLE_RESTAURANTS = [
  {
    name: "Bella Italia Restaurant",
    address: "123 Main Street, Dhaka 1000, Bangladesh",
    phone: "+880 1712-345678",
  },
  {
    name: "Spice Garden",
    address: "456 Gulshan Avenue, Dhaka 1212, Bangladesh", 
    phone: "+880 1887-654321",
  },
  {
    name: "Ocean View Cafe",
    address: "789 Dhanmondi Road, Dhaka 1205, Bangladesh",
    phone: "+880 1555-987654",
  },
  {
    name: "Royal Feast",
    address: "321 Uttara Sector 7, Dhaka 1230, Bangladesh",
    phone: "+880 1666-123456",
  },
  {
    name: "Green Valley Restaurant",
    address: "654 Banani Road, Dhaka 1213, Bangladesh",
    phone: "+880 1777-789012",
  },
];

export function generateDummyPhotoMenu(
  restaurantIndex: number = 0,
  imageCount: number = 3
): PhotoMenuData {
  const qrCode = generateQRCode();
  const restaurant = SAMPLE_RESTAURANTS[restaurantIndex % SAMPLE_RESTAURANTS.length];
  const now = new Date().toISOString();

  const images = Array.from({ length: imageCount }, (_, index) => ({
    id: `img_${Date.now()}_${index}`,
    url: SAMPLE_MENU_IMAGES[index % SAMPLE_MENU_IMAGES.length],
    order: index,
  }));

  return {
    qrCode,
    restaurant,
    images,
    createdAt: now,
    updatedAt: now,
  };
}

export function createSamplePhotoMenus(): string[] {
  const qrCodes: string[] = [];

  // Create 3 sample photo menus
  for (let i = 0; i < 3; i++) {
    const photoMenu = generateDummyPhotoMenu(i, 3 + i); // 3, 4, 5 images respectively
    savePhotoMenu(photoMenu);
    qrCodes.push(photoMenu.qrCode);
    console.log(`Created sample photo menu: ${photoMenu.restaurant.name} (QR: ${photoMenu.qrCode})`);
  }

  return qrCodes;
}

// Easy access to a specific sample QR for testing
export function getTestPhotoMenuQR(): string {
  const existingMenus = JSON.parse(localStorage.getItem("qrunchy_photo_menus") || "{}");
  const qrCodes = Object.keys(existingMenus);
  
  if (qrCodes.length > 0) {
    return qrCodes[0];
  }
  
  // Create a sample if none exist
  const sampleMenus = createSamplePhotoMenus();
  return sampleMenus[0];
}