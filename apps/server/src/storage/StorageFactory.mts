import { IStorageProvider } from './interfaces.mts';
import { LocalStorageProvider } from './providers/LocalStorageProvider.mts';
import { R2StorageProvider } from './providers/R2StorageProvider.mts';

export type StorageType = 'local' | 'r2';

export class StorageFactory {
  private static instance: IStorageProvider | null = null;

  static createProvider(type: StorageType = 'local'): IStorageProvider {
    switch (type) {
      case 'local':
        return new LocalStorageProvider();
      case 'r2':
        const bucketName = process.env.R2_BUCKET_NAME;
        const endpoint = process.env.R2_ENDPOINT;
        const publicUrl = process.env.R2_PUBLIC_URL;
        
        if (!bucketName || !endpoint || !publicUrl) {
          throw new Error('R2 configuration missing. Please set R2_BUCKET_NAME, R2_ENDPOINT, and R2_PUBLIC_URL environment variables.');
        }
        
        return new R2StorageProvider(bucketName, endpoint, publicUrl);
      default:
        throw new Error(`Unsupported storage type: ${type}`);
    }
  }

  static getProvider(): IStorageProvider {
    if (!this.instance) {
      const storageType = (process.env.STORAGE_TYPE as StorageType) || 'local';
      this.instance = this.createProvider(storageType);
    }
    return this.instance;
  }

  static resetProvider(): void {
    this.instance = null;
  }
}