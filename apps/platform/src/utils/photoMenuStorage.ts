import type { PhotoMenuData, PhotoMenuStorage } from "@/types/photoMenu";

const STORAGE_KEY = "qrunchy_photo_menus";

export class PhotoMenuStorageManager {
  private static instance: PhotoMenuStorageManager;

  static getInstance(): PhotoMenuStorageManager {
    if (!PhotoMenuStorageManager.instance) {
      PhotoMenuStorageManager.instance = new PhotoMenuStorageManager();
    }
    return PhotoMenuStorageManager.instance;
  }

  private getStorage(): PhotoMenuStorage {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error reading photo menu storage:", error);
      return {};
    }
  }

  private setStorage(data: PhotoMenuStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing photo menu storage:", error);
    }
  }

  savePhotoMenu(photoMenu: PhotoMenuData): void {
    const storage = this.getStorage();
    storage[photoMenu.qrCode] = {
      ...photoMenu,
      updatedAt: new Date().toISOString(),
    };
    this.setStorage(storage);
  }

  getPhotoMenu(qrCode: string): PhotoMenuData | null {
    const storage = this.getStorage();
    return storage[qrCode] || null;
  }

  getAllPhotoMenus(): PhotoMenuData[] {
    const storage = this.getStorage();
    return Object.values(storage);
  }

  deletePhotoMenu(qrCode: string): void {
    const storage = this.getStorage();
    delete storage[qrCode];
    this.setStorage(storage);
  }

  clearAllPhotoMenus(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  generateQRCode(): string {
    return `photo_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Convenience functions
export const photoMenuStorage = PhotoMenuStorageManager.getInstance();

export const savePhotoMenu = (photoMenu: PhotoMenuData): void => {
  photoMenuStorage.savePhotoMenu(photoMenu);
};

export const getPhotoMenu = (qrCode: string): PhotoMenuData | null => {
  return photoMenuStorage.getPhotoMenu(qrCode);
};

export const getAllPhotoMenus = (): PhotoMenuData[] => {
  return photoMenuStorage.getAllPhotoMenus();
};

export const deletePhotoMenu = (qrCode: string): void => {
  photoMenuStorage.deletePhotoMenu(qrCode);
};

export const generateQRCode = (): string => {
  return photoMenuStorage.generateQRCode();
};