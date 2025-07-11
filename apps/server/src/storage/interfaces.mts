export interface StorageOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
}

export interface StorageResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

export interface IStorageProvider {
  upload(file: Buffer, originalName: string, options?: StorageOptions): Promise<StorageResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  exists(key: string): Promise<boolean>;
}