/**
 * Fleet Intelligence Smart AI - Mobile Offline Sync Engine
 * PROMPT 46: Offline Queue, Action Replay, Conflict Resolution, & Photo Queue
 */

import { OfflineQueueItem, PhotoUploadQueueItem, OfflineQueueActionType } from '../types/driverMobileTypes';

const QUEUE_STORAGE_KEY = 'fleet_driver_offline_queue_v1';
const PHOTO_QUEUE_STORAGE_KEY = 'fleet_driver_photo_queue_v1';

class MobileSyncService {
  private queue: OfflineQueueItem[] = [];
  private photoQueue: PhotoUploadQueueItem[] = [];
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;

      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify();
        this.triggerSync();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify();
      });

      const storedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (storedQueue) {
        try {
          this.queue = JSON.parse(storedQueue);
        } catch {
          this.queue = [];
        }
      }

      const storedPhotoQueue = localStorage.getItem(PHOTO_QUEUE_STORAGE_KEY);
      if (storedPhotoQueue) {
        try {
          this.photoQueue = JSON.parse(storedPhotoQueue);
        } catch {
          this.photoQueue = [];
        }
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      localStorage.setItem(PHOTO_QUEUE_STORAGE_KEY, JSON.stringify(this.photoQueue));
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public toggleNetworkSimulation(forceOffline?: boolean) {
    this.isOnline = forceOffline !== undefined ? !forceOffline : !this.isOnline;
    this.notify();
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  public getPendingQueue(): OfflineQueueItem[] {
    return this.queue;
  }

  public getPhotoQueue(): PhotoUploadQueueItem[] {
    return this.photoQueue;
  }

  public enqueueAction(actionType: OfflineQueueActionType, payload: any): OfflineQueueItem {
    const item: OfflineQueueItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      actionType,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: this.isOnline ? 'SYNCING' : 'PENDING',
    };

    this.queue.unshift(item);
    this.save();

    if (this.isOnline) {
      this.processQueueItem(item);
    }

    return item;
  }

  public enqueuePhoto(
    fileUrl: string,
    purpose: 'POD' | 'INSPECTION' | 'INCIDENT' | 'DAMAGE',
    metadata: {
      driverId: string;
      vehicleId: string;
      latitude: number;
      longitude: number;
      entityId: string;
    }
  ): PhotoUploadQueueItem {
    const item: PhotoUploadQueueItem = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fileUrl,
      purpose,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      status: 'PENDING',
      progress: 0,
    };

    this.photoQueue.unshift(item);
    this.save();

    if (this.isOnline) {
      this.processPhotoUpload(item);
    }

    return item;
  }

  public async triggerSync(): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isSyncing || !this.isOnline) {
      return { syncedCount: 0, failedCount: 0 };
    }

    this.isSyncing = true;
    this.notify();

    let syncedCount = 0;
    let failedCount = 0;

    const pendingActions = this.queue.filter(i => i.status === 'PENDING' || i.status === 'FAILED');
    for (const item of pendingActions) {
      const ok = await this.processQueueItem(item);
      if (ok) syncedCount++;
      else failedCount++;
    }

    const pendingPhotos = this.photoQueue.filter(p => p.status === 'PENDING' || p.status === 'FAILED');
    for (const p of pendingPhotos) {
      await this.processPhotoUpload(p);
    }

    this.isSyncing = false;
    this.notify();

    return { syncedCount, failedCount };
  }

  private async processQueueItem(item: OfflineQueueItem): Promise<boolean> {
    item.status = 'SYNCING';
    this.save();

    try {
      // Simulate network round-trip & server-side conflict detection
      await new Promise(resolve => setTimeout(resolve, 400));

      // Conflict resolution test: If client payload has outdated version or server rejection
      if (item.payload?.__forceConflict) {
        item.status = 'CONFLICT';
        item.errorMessage = 'Konflik versi: Data di server telah diperbarui oleh Dispatcher.';
        this.save();
        return false;
      }

      item.status = 'SYNCED';
      this.save();
      return true;
    } catch (err: any) {
      item.retryCount++;
      item.status = item.retryCount >= 3 ? 'FAILED' : 'PENDING';
      item.errorMessage = err.message || 'Network timeout';
      this.save();
      return false;
    }
  }

  private async processPhotoUpload(item: PhotoUploadQueueItem): Promise<boolean> {
    item.status = 'UPLOADING';
    item.progress = 25;
    this.save();

    await new Promise(resolve => setTimeout(resolve, 300));
    item.progress = 70;
    this.save();

    await new Promise(resolve => setTimeout(resolve, 300));
    item.progress = 100;
    item.status = 'UPLOADED';
    this.save();
    return true;
  }

  public clearSynced() {
    this.queue = this.queue.filter(i => i.status !== 'SYNCED');
    this.photoQueue = this.photoQueue.filter(p => p.status !== 'UPLOADED');
    this.save();
  }
}

export const mobileSyncService = new MobileSyncService();
