import { IStorageProvider } from './interfaces.mjs';
import { R2StorageProvider } from './providers/R2StorageProvider.mjs';

export type StorageType = 'r2';

export class StorageFactory {
  private static instance: IStorageProvider | null = null;

  static createProvider(type: StorageType = 'r2'): IStorageProvider {
    const bucketName = process.env.R2_BUCKET_NAME;
    const endpoint = process.env.R2_ENDPOINT;
    const publicUrl = process.env.R2_PUBLIC_URL;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    
    console.log('🔍 [STORAGE] Checking R2 configuration:');
    console.log(`   R2_BUCKET_NAME: ${bucketName ? '✓ Set' : '❌ Missing'}`);
    console.log(`   R2_ENDPOINT: ${endpoint ? '✓ Set' : '❌ Missing'}`);
    console.log(`   R2_PUBLIC_URL: ${publicUrl ? '✓ Set' : '❌ Missing'}`);
    console.log(`   R2_ACCESS_KEY_ID: ${accessKeyId ? '✓ Set' : '❌ Missing'}`);
    console.log(`   R2_SECRET_ACCESS_KEY: ${secretAccessKey ? '✓ Set' : '❌ Missing'}`);
    
    if (!bucketName || !endpoint || !publicUrl || !accessKeyId || !secretAccessKey) {
      const missing = [];
      if (!bucketName) missing.push('R2_BUCKET_NAME');
      if (!endpoint) missing.push('R2_ENDPOINT');
      if (!publicUrl) missing.push('R2_PUBLIC_URL');
      if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
      if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
      
      console.error('❌ [STORAGE] R2 configuration incomplete!');
      console.error(`   Missing variables: ${missing.join(', ')}`);
      
      throw new Error(
        `R2 configuration missing. Please set the following environment variables: ${missing.join(', ')}.`
      );
    }
    
    console.log('✅ [STORAGE] R2 configuration complete, creating provider');
    return new R2StorageProvider(bucketName, endpoint, publicUrl);
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