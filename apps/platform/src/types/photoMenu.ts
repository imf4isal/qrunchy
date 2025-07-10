export interface PhotoMenuImage {
  id: string;
  url: string; // blob URL from localStorage or actual URL
  order: number;
  file?: File; // Optional file reference for upload context
}

export interface PhotoMenuRestaurant {
  name: string;
  address?: string;
  phone?: string;
}

export interface PhotoMenuData {
  qrCode: string;
  restaurant: PhotoMenuRestaurant;
  images: PhotoMenuImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PhotoMenuStorage {
  [qrCode: string]: PhotoMenuData;
}