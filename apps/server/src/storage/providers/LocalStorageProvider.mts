import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { IStorageProvider, StorageOptions, StorageResult } from '../interfaces.mjs';

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor(baseDir: string = 'uploads', baseUrl: string = '/api/files') {
    this.baseDir = baseDir;
    this.baseUrl = baseUrl;
  }

  async upload(file: Buffer, originalName: string, options?: StorageOptions): Promise<StorageResult> {
    const folder = options?.folder || 'photomenu';
    const ext = path.extname(originalName);
    const filename = options?.filename || `${randomUUID()}${ext}`;
    const key = `${folder}/${filename}`;
    const fullPath = path.join(this.baseDir, key);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file);

    // Get file stats for size
    const stats = await fs.stat(fullPath);

    return {
      url: `${this.baseUrl}/${key}`,
      key,
      size: stats.size,
      contentType: options?.contentType || `image/${ext.slice(1)}`
    };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.baseDir, key);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // File might not exist, ignore error
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    const fullPath = path.join(this.baseDir, key);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}