import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { IStorageProvider, StorageOptions, StorageResult } from '../interfaces.mjs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as mime from 'mime-types';

export class R2StorageProvider implements IStorageProvider {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(bucketName: string, endpoint: string, publicUrl: string) {
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;
    
    // Configure S3Client for R2 compatibility
    this.s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto' as region
      endpoint: endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true, // Required for R2 compatibility
    });
  }

  async upload(file: Buffer, originalName: string, options?: StorageOptions): Promise<StorageResult> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(originalName);
      const baseName = path.basename(originalName, fileExtension);
      const filename = options?.filename || `${baseName}-${uuidv4()}${fileExtension}`;
      
      // Construct the full key with folder if provided
      const key = options?.folder ? `${options.folder}/${filename}` : filename;
      
      // Detect content type
      const contentType = options?.contentType || 
                         mime.lookup(originalName) || 
                         'application/octet-stream';
      
      // Upload to R2 using multipart upload for better reliability
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: contentType,
        },
      });

      await upload.done();

      return {
        url: this.getUrl(key),
        key: key,
        size: file.length,
        contentType: contentType,
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new Error(`Failed to upload file to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('R2 delete error:', error);
      throw new Error(`Failed to delete file from R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getUrl(key: string): string {
    // Return the public URL for the object
    return `${this.publicUrl}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      console.error('R2 exists check error:', error);
      throw new Error(`Failed to check file existence in R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}