/**
 * Fleet Intelligence Smart AI - Enterprise Secure Storage Provider Abstraction
 * PROMPT 48 - Object Storage Layer with MIME Validation, Safe Filename, Hash, Signed URLs, and Legal Hold Protection
 */

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export interface StorageUploadResult {
  fileId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  fileHash: string;
  signedUrl: string;
  signedUrlExpiresAt: string;
}

export interface IStorageProvider {
  validateFile(file: { name: string; size: number; type: string }, options?: FileValidationOptions): { valid: boolean; error?: string };
  uploadFile(tenantId: string, entityType: string, file: { name: string; size: number; type: string; dataUrl?: string }): Promise<StorageUploadResult>;
  generateSignedUrl(fileId: string, ttlSeconds?: number): string;
  deleteFile(fileId: string, hasLegalHold?: boolean): Promise<{ success: boolean; error?: string }>;
}

export class MockSecureStorageProvider implements IStorageProvider {
  private static instance: MockSecureStorageProvider;

  public static getInstance(): MockSecureStorageProvider {
    if (!MockSecureStorageProvider.instance) {
      MockSecureStorageProvider.instance = new MockSecureStorageProvider();
    }
    return MockSecureStorageProvider.instance;
  }

  private allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  private maxSizeBytes = 25 * 1024 * 1024; // 25 MB enterprise limit

  public validateFile(
    file: { name: string; size: number; type: string },
    options?: FileValidationOptions
  ): { valid: boolean; error?: string } {
    const allowed = options?.allowedMimeTypes || this.allowedMimeTypes;
    const maxSize = options?.maxSizeBytes || this.maxSizeBytes;

    // Check size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas kuota ${(maxSize / (1024 * 1024)).toFixed(0)} MB per file.`,
      };
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'docx'];
    if (!ext || !validExtensions.includes(ext)) {
      return {
        valid: false,
        error: `Format ekstensi file .${ext} tidak diizinkan. Harap unggah format PDF, JPG, PNG, atau WEBP.`,
      };
    }

    // Check MIME type if provided
    if (file.type && !allowed.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: `MIME type (${file.type}) tidak valid atau terindikasi berisiko keamanan.`,
      };
    }

    return { valid: true };
  }

  public async uploadFile(
    tenantId: string,
    entityType: string,
    file: { name: string; size: number; type: string; dataUrl?: string }
  ): Promise<StorageUploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Validasi keamanan berkas gagal.');
    }

    const fileId = `doc-file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const sanitizedEntity = entityType.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeFileName = `${tenantId}/${sanitizedEntity}/${timestamp}_${fileId.substring(9)}.${ext}`;

    // Simulate SHA-256 Hash
    const fileHash = `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    // Simulated short-lived signed URL
    const ttlSeconds = 3600; // 1 hour
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    const mockToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const signedUrl = `https://storage.fleetintel.cloud/secure/${safeFileName}?token=${mockToken}&exp=${Math.floor(Date.now() / 1000) + ttlSeconds}`;

    return {
      fileId,
      fileName: safeFileName,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg'),
      fileUrl: file.dataUrl || signedUrl,
      fileHash,
      signedUrl,
      signedUrlExpiresAt: expiresAt,
    };
  }

  public generateSignedUrl(fileId: string, ttlSeconds = 3600): string {
    const expiresTimestamp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const mockSignature = Math.random().toString(36).substring(2, 12);
    return `https://storage.fleetintel.cloud/secure/view/${fileId}?sig=${mockSignature}&exp=${expiresTimestamp}`;
  }

  public async deleteFile(fileId: string, hasLegalHold = false): Promise<{ success: boolean; error?: string }> {
    if (hasLegalHold) {
      return {
        success: false,
        error: 'Dokumen berada dalam status Legal Hold aktif. Penghapusan dan pengarsipan permanen diblokir oleh kepatuhan hukum.',
      };
    }
    return { success: true };
  }
}

export const storageProvider = MockSecureStorageProvider.getInstance();
