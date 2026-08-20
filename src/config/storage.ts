/**
 * Fleet Intelligence Smart AI - Object Storage Configuration
 * PROMPT 59: Secure File Uploads, MIME Whitelisting, Signed URL Lifecycle & Tenant Isolation
 */

export interface StorageConfig {
  provider: 'supabase' | 's3' | 'gcs' | 'minio';
  bucket: string;
  signedUrlExpirySeconds: number;
  maxUploadSizeBytes: number; // e.g. 15MB
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  tenantPathPrefix: string;
}

export const storageConfig: StorageConfig = {
  provider: 'supabase',
  bucket: 'fleet-documents-secure',
  signedUrlExpirySeconds: 3600, // 1 hour
  maxUploadSizeBytes: 15 * 1024 * 1024, // 15MB
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.xlsx', '.csv'],
  tenantPathPrefix: 'tenants',
};
