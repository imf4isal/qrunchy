import { IStorageProvider } from './interfaces.mjs';
import { LocalStorageProvider } from './providers/LocalStorageProvider.mjs';
import { R2StorageProvider } from './providers/R2StorageProvider.mjs';

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
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        
        if (!bucketName || !endpoint || !publicUrl || !accessKeyId || !secretAccessKey) {
          const missing = [];
          if (!bucketName) missing.push('R2_BUCKET_NAME');
          if (!endpoint) missing.push('R2_ENDPOINT');
          if (!publicUrl) missing.push('R2_PUBLIC_URL');
          if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
          if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
          
          throw new Error(
            `R2 configuration missing. Please set the following environment variables: ${missing.join(', ')}.\n` +
            'Check .env.example for guidance or switch to STORAGE_TYPE=local for development.'
          );
        }
        
        return new R2StorageProvider(bucketName, endpoint, publicUrl);
      default:
        throw new Error(`Unsupported storage type: ${type}`);
    }
  }

  static getProvider(): IStorageProvider {
    if (!this.instance) {
      // Force R2 storage only - no local storage option
      this.instance = this.createProvider('r2');
    }
    return this.instance;
  }

  static resetProvider(): void {
    this.instance = null;
  }
}