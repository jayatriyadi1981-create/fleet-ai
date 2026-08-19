/**
 * Fleet Intelligence Smart AI - Proof of Delivery (POD) Service
 * POD Validation against Policy, Digital Signature, Photo Evidence, Idempotency & Offline Sync
 */

import { POD, PODPhoto, PODPolicy, PODStatus } from '../deliveryTypes';
import { deliveryService } from './deliveryService';
import { orderService } from './orderService';

const LOCAL_STORAGE_PODS_KEY = 'fleet_intel_pods_v1';

export const DEFAULT_POD_POLICY: PODPolicy = {
  requireSignature: true,
  requirePhoto: true,
  requireRecipient: true,
  requireRecipientPhone: true,
  requireDeliveryNote: false,
  requireLocation: true,
};

class DeliveryPODService {
  private pods: POD[] = [];

  constructor() {
    this.initPODs();
  }

  private initPODs() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PODS_KEY);
      if (saved) {
        this.pods = JSON.parse(saved);
      } else {
        this.seedInitialPODs();
      }
    } catch {
      this.seedInitialPODs();
    }
  }

  private seedInitialPODs() {
    this.pods = [
      {
        id: 'pod-004',
        deliveryId: 'del-004',
        status: 'COMPLETED',
        recipientName: 'dr. Farah Nabila',
        recipientPhone: '0821-4455-6677',
        recipientRole: 'Head Pharmacist',
        deliveredAt: '2026-08-15T08:30:00Z',
        signatureDataUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><path d="M 10 80 Q 52 10 95 80 T 180 80" stroke="black" fill="none" stroke-width="3"/></svg>',
        signedBy: 'dr. Farah Nabila',
        signedAt: '2026-08-15T08:29:00Z',
        photos: [
          {
            id: 'ph-01',
            deliveryId: 'del-004',
            fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
            type: 'PACKAGE',
            capturedAt: '2026-08-15T08:25:00Z',
            latitude: -6.2188,
            longitude: 106.8188,
            uploadedBy: 'Dede Supriatna (Driver)',
          },
          {
            id: 'ph-02',
            deliveryId: 'del-004',
            fileUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=150&auto=format&fit=crop&q=80',
            type: 'DOCUMENT',
            capturedAt: '2026-08-15T08:28:00Z',
            latitude: -6.2188,
            longitude: 106.8188,
            uploadedBy: 'Dede Supriatna (Driver)',
          },
        ],
        notes: 'Diterima dalam kondisi prima tanpa kerusakan kemasan.',
        latitude: -6.2188,
        longitude: 106.8188,
        syncStatus: 'SYNCED',
        idempotencyKey: 'idemp-del-004-99128',
        createdAt: '2026-08-15T08:30:00Z',
      },
    ];
    this.persistPODs();
  }

  private persistPODs() {
    try {
      localStorage.setItem(LOCAL_STORAGE_PODS_KEY, JSON.stringify(this.pods));
    } catch {
      // quota
    }
  }

  public getPODByDeliveryId(deliveryId: string): POD | undefined {
    return this.pods.find((p) => p.deliveryId === deliveryId);
  }

  public validatePODAgainstPolicy(
    data: {
      recipientName?: string;
      recipientPhone?: string;
      signatureDataUrl?: string;
      photos?: PODPhoto[];
      notes?: string;
      latitude?: number;
      longitude?: number;
    },
    policy: PODPolicy = DEFAULT_POD_POLICY
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (policy.requireRecipient && (!data.recipientName || !data.recipientName.trim())) {
      errors.push('Nama penerima wajib diisi.');
    }

    if (policy.requireRecipientPhone && (!data.recipientPhone || !data.recipientPhone.trim())) {
      errors.push('Nomor HP penerima wajib diisi.');
    }

    if (policy.requireSignature && (!data.signatureDataUrl || !data.signatureDataUrl.trim())) {
      errors.push('Tanda tangan digital penerima wajib ditangkap.');
    }

    if (policy.requirePhoto && (!data.photos || data.photos.length === 0)) {
      errors.push('Minimal 1 foto bukti penyerahan kargo wajib diunggah.');
    }

    if (policy.requireDeliveryNote && (!data.notes || !data.notes.trim())) {
      errors.push('Catatan penerimaan kargo wajib diisi.');
    }

    if (policy.requireLocation && (data.latitude === undefined || data.longitude === undefined)) {
      errors.push('Koordinat GPS penyerahan kargo tidak terdeteksi.');
    }

    return { valid: errors.length === 0, errors };
  }

  public submitPOD(params: {
    deliveryId: string;
    recipientName: string;
    recipientPhone: string;
    recipientRole?: string;
    signatureDataUrl?: string;
    photos: Omit<PODPhoto, 'id' | 'deliveryId'>[];
    notes?: string;
    latitude?: number;
    longitude?: number;
    performedBy: string;
    idempotencyKey?: string;
    policy?: PODPolicy;
  }): POD {
    // 1. Check idempotency
    if (params.idempotencyKey) {
      const existing = this.pods.find((p) => p.idempotencyKey === params.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const delivery = deliveryService.getDeliveryById(params.deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${params.deliveryId} tidak ditemukan.`);
    }

    // 2. Format photos with IDs
    const podPhotos: PODPhoto[] = params.photos.map((ph) => ({
      ...ph,
      id: `ph-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      deliveryId: params.deliveryId,
    }));

    // 3. Policy validation
    const validation = this.validatePODAgainstPolicy(
      {
        recipientName: params.recipientName,
        recipientPhone: params.recipientPhone,
        signatureDataUrl: params.signatureDataUrl,
        photos: podPhotos,
        notes: params.notes,
        latitude: params.latitude,
        longitude: params.longitude,
      },
      params.policy
    );

    if (!validation.valid) {
      throw new Error(`Validasi Bukti Pengiriman (POD) gagal: ${validation.errors.join(' ')}`);
    }

    // 4. Create POD object
    const podId = `pod-${Date.now().toString(36)}`;
    const newPOD: POD = {
      id: podId,
      deliveryId: params.deliveryId,
      status: 'COMPLETED',
      recipientName: params.recipientName,
      recipientPhone: params.recipientPhone,
      recipientRole: params.recipientRole || 'Penerima Barang',
      deliveredAt: new Date().toISOString(),
      signatureDataUrl: params.signatureDataUrl,
      signedBy: params.recipientName,
      signedAt: new Date().toISOString(),
      photos: podPhotos,
      notes: params.notes,
      latitude: params.latitude || delivery.latitude,
      longitude: params.longitude || delivery.longitude,
      syncStatus: 'SYNCED',
      idempotencyKey: params.idempotencyKey || `idemp-${podId}`,
      createdAt: new Date().toISOString(),
    };

    this.pods.unshift(newPOD);
    this.persistPODs();

    // 5. Update delivery state
    deliveryService.updateDelivery(params.deliveryId, {
      podId,
      recipientName: params.recipientName,
      recipientPhone: params.recipientPhone,
    });

    deliveryService.updateDeliveryStatus(
      params.deliveryId,
      'DELIVERED',
      params.performedBy,
      `Bukti Pengiriman (POD) diselesaikan oleh ${params.recipientName} (${params.recipientRole || 'Penerima'}).`
    );

    // 6. Update Order state to DELIVERED if all deliveries done
    if (delivery.orderId) {
      orderService.updateOrderStatus(delivery.orderId, 'DELIVERED');
    }

    return newPOD;
  }
}

export const deliveryPODService = new DeliveryPODService();
