/**
 * Fleet Intelligence Smart AI - Centralized Notification Infrastructure Service Facade
 * Connects Router, Recipient Resolver, Templates, Queue, Audit, & Realtime Events
 */

import {
  Notification,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
} from '../types';
import { notificationRouter } from './notificationRouter';
import { notificationRecipientResolver } from './notificationRecipientResolver';
import { notificationQueueService } from './notificationQueueService';
import { notificationTemplateService } from './notificationTemplateService';
import { notificationDeepLinkService } from './notificationDeepLinkService';
import { notificationAuditService } from './notificationAuditService';

type NotificationEventListener = (event: string, payload: Notification) => void;

export class NotificationService {
  private notifications: Notification[] = [
    {
      id: 'notif-101',
      tenantId: 'tenant-indonesia-logistics',
      type: 'ALERT',
      category: 'ALERT',
      title: '🚨 PANIC SOS EMERGENCY: Armada B 1234 ABC',
      message: 'Pengemudi Andi Menekan Tombol Panic Button SOS di KM 42 Tol Jakarta-Cikampek. Butuh Penanganan Segera!',
      severity: 'CRITICAL',
      priority: 'CRITICAL',
      recipientId: 'usr-001',
      recipientType: 'USER',
      entityType: 'vehicle',
      entityId: 'v-001',
      vehicleId: 'v-001',
      driverId: 'd-001',
      alertId: 'alt-001',
      channels: ['IN_APP', 'PUSH', 'WHATSAPP', 'EMAIL', 'SMS'],
      status: 'UNREAD',
      createdAt: new Date(Date.now() - 120000).toISOString(), // 2 mins ago
      updatedAt: new Date(Date.now() - 120000).toISOString(),
      deepLink: '/app/live-tracking?vehicleId=v-001&alertId=alt-001',
      metadata: { vehiclePlate: 'B 1234 ABC', driverName: 'Andi' },
    },
    {
      id: 'notif-102',
      tenantId: 'tenant-indonesia-logistics',
      type: 'ALERT',
      category: 'ALERT',
      title: '⚠️ Pelanggaran Overspeed: Armada B 5678 XYZ',
      message: 'Kecepatan terdeteksi 118 km/jam (Batas Maksimal 90 km/jam) di Area Jalur Pantura Subang.',
      severity: 'HIGH',
      priority: 'HIGH',
      recipientId: 'usr-001',
      recipientType: 'USER',
      entityType: 'vehicle',
      entityId: 'v-002',
      vehicleId: 'v-002',
      alertId: 'alt-002',
      channels: ['IN_APP', 'PUSH', 'EMAIL', 'WHATSAPP'],
      status: 'UNREAD',
      createdAt: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
      updatedAt: new Date(Date.now() - 300000).toISOString(),
      deepLink: '/app/alerts?alertId=alt-002',
      metadata: { vehiclePlate: 'B 5678 XYZ', speed: 118 },
    },
    {
      id: 'notif-103',
      tenantId: 'tenant-indonesia-logistics',
      type: 'DELIVERY',
      category: 'DELIVERY',
      title: '📦 Bukti Pengiriman POD Terverifikasi: #DEL-88902',
      message: 'Pengiriman barang pesanan PT Sumber Makmur Jaya telah diselesaikan oleh Driver Budi dengan foto POD valid.',
      priority: 'NORMAL',
      recipientId: 'usr-001',
      recipientType: 'USER',
      entityType: 'delivery',
      entityId: 'DEL-88902',
      deliveryId: 'DEL-88902',
      channels: ['IN_APP', 'PUSH'],
      status: 'UNREAD',
      createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
      updatedAt: new Date(Date.now() - 600000).toISOString(),
      deepLink: '/app/deliveries?deliveryId=DEL-88902',
    },
    {
      id: 'notif-104',
      tenantId: 'tenant-indonesia-logistics',
      type: 'MAINTENANCE',
      category: 'MAINTENANCE',
      title: '🔧 Work Order Service Berkala Due: B 2222 AA',
      message: 'Jadwal ganti oli dan balancing ban telah mencapai odometer 85.000 KM.',
      priority: 'NORMAL',
      recipientId: 'usr-001',
      recipientType: 'USER',
      entityType: 'vehicle',
      entityId: 'v-003',
      vehicleId: 'v-003',
      channels: ['IN_APP'],
      status: 'READ',
      readAt: new Date(Date.now() - 900000).toISOString(),
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
      deepLink: '/app/maintenance?vehicleId=v-003',
    },
    {
      id: 'notif-105',
      tenantId: 'tenant-indonesia-logistics',
      type: 'GEOFENCE',
      category: 'GEOFENCE',
      title: '📍 Geofence Exit: B 9988 KKK Keluar Depo Surabaya',
      message: 'Kendaraan terdeteksi meninggalkan Geofence Zona Depo Perak Surabaya pada pkl 03:45 WIB.',
      priority: 'LOW',
      recipientId: 'usr-001',
      recipientType: 'USER',
      entityType: 'geofence',
      entityId: 'geo-01',
      vehicleId: 'v-004',
      geofenceId: 'geo-01',
      channels: ['IN_APP'],
      status: 'READ',
      readAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 4000000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      deepLink: '/app/geofence',
    },
    {
      id: 'notif-106',
      tenantId: 'tenant-indonesia-logistics',
      type: 'AI_INSIGHT',
      category: 'AI',
      title: '✨ AI Insight: Potensi Penghematan BBM Depo Jakarta',
      message: 'Analisis AI menemukan idle time berlebih di Depo Marunda dapat ditekan sebesar 18% minggu ini.',
      priority: 'LOW',
      recipientId: 'usr-001',
      recipientType: 'USER',
      channels: ['IN_APP'],
      status: 'UNREAD',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      deepLink: '/app/ai_intelligence',
    },
  ];

  private listeners: NotificationEventListener[] = [];

  subscribe(listener: NotificationEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(event: string, notification: Notification) {
    this.listeners.forEach((l) => l(event, notification));
  }

  getNotifications(tenantId: string, recipientId?: string): Notification[] {
    return this.notifications.filter(
      (n) => n.tenantId === tenantId && (!recipientId || n.recipientId === recipientId)
    );
  }

  getNotificationById(id: string): Notification | undefined {
    return this.notifications.find((n) => n.id === id);
  }

  getUnreadCount(tenantId: string, recipientId?: string): number {
    return this.getNotifications(tenantId, recipientId).filter((n) => n.status === 'UNREAD').length;
  }

  getCriticalCount(tenantId: string, recipientId?: string): number {
    return this.getNotifications(tenantId, recipientId).filter(
      (n) => (n.priority === 'CRITICAL' || n.severity === 'CRITICAL') && n.status === 'UNREAD'
    ).length;
  }

  /**
   * Main Dispatch Method: Creates notification & enqueues to router & channel queues
   */
  createNotification(params: {
    tenantId: string;
    type: NotificationType;
    category: NotificationCategory;
    title: string;
    message: string;
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    priority: NotificationPriority;
    recipientId?: string;
    entityType?: 'vehicle' | 'driver' | 'device' | 'trip' | 'route' | 'delivery' | 'geofence' | 'alert' | 'maintenance';
    entityId?: string;
    vehicleId?: string;
    driverId?: string;
    deviceId?: string;
    tripId?: string;
    routeId?: string;
    deliveryId?: string;
    geofenceId?: string;
    alertId?: string;
    metadata?: Record<string, any>;
  }): Notification {
    const recipients = notificationRecipientResolver.resolveRecipients(params.tenantId, params.priority, {
      specificUserId: params.recipientId,
    });

    const targetRecipient = recipients[0] || { id: params.recipientId || 'usr-001' };

    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: params.tenantId,
      type: params.type,
      category: params.category,
      title: params.title,
      message: params.message,
      severity: params.severity,
      priority: params.priority,
      recipientId: targetRecipient.id,
      recipientType: 'USER',
      entityType: params.entityType,
      entityId: params.entityId,
      vehicleId: params.vehicleId,
      driverId: params.driverId,
      deviceId: params.deviceId,
      tripId: params.tripId,
      routeId: params.routeId,
      deliveryId: params.deliveryId,
      geofenceId: params.geofenceId,
      alertId: params.alertId,
      channels: [],
      status: 'UNREAD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: params.metadata,
    };

    // Deep link resolution
    newNotif.deepLink = notificationDeepLinkService.resolveDeepLink(newNotif);

    // Route channels
    const channels = notificationRouter.routeNotification(newNotif, targetRecipient.id);
    newNotif.channels = channels;

    this.notifications.unshift(newNotif);

    // Enqueue queue jobs for each active channel
    channels.forEach((channel) => {
      notificationQueueService.enqueueJob(newNotif, channel, targetRecipient.id, {
        title: newNotif.title,
        message: newNotif.message,
      });
    });

    // Audit log
    notificationAuditService.logEvent({
      tenantId: params.tenantId,
      userId: targetRecipient.id,
      action: 'NOTIFICATION_CREATED',
      details: `Created ${params.priority} notification #${newNotif.id}: ${params.title}`,
    });

    // Realtime notification event
    this.notifyListeners('notification.created', newNotif);

    return newNotif;
  }

  /**
   * Adapter Bridge to consume Prompt 19 Alerts
   */
  processAlertNotification(alert: any): Notification {
    const priorityMap: Record<string, NotificationPriority> = {
      CRITICAL: 'CRITICAL',
      HIGH: 'HIGH',
      MEDIUM: 'NORMAL',
      LOW: 'LOW',
    };

    return this.createNotification({
      tenantId: alert.tenantId || 'tenant-indonesia-logistics',
      type: 'ALERT',
      category: 'ALERT',
      title: `${alert.severity === 'CRITICAL' ? '🚨' : '⚠️'} ${alert.ruleName || 'Peringatan Armada'}: ${alert.vehiclePlate || 'B 1234 ABC'}`,
      message: alert.message || `Deteksi pelanggaran ${alert.type} pada lokasi (${alert.latitude}, ${alert.longitude})`,
      severity: alert.severity,
      priority: priorityMap[alert.severity] || 'NORMAL',
      alertId: alert.id,
      vehicleId: alert.vehicleId,
      driverId: alert.driverId,
      metadata: { vehiclePlate: alert.vehiclePlate, latitude: alert.latitude, longitude: alert.longitude },
    });
  }

  markRead(id: string): void {
    const notif = this.getNotificationById(id);
    if (notif) {
      notif.status = 'READ';
      notif.readAt = new Date().toISOString();
      notif.updatedAt = new Date().toISOString();

      notificationAuditService.logEvent({
        tenantId: notif.tenantId,
        userId: notif.recipientId,
        action: 'NOTIFICATION_READ',
        details: `Marked notification #${id} as read`,
      });

      this.notifyListeners('notification.read', notif);
    }
  }

  markUnread(id: string): void {
    const notif = this.getNotificationById(id);
    if (notif) {
      notif.status = 'UNREAD';
      notif.readAt = undefined;
      notif.updatedAt = new Date().toISOString();
      this.notifyListeners('notification.updated', notif);
    }
  }

  archiveNotification(id: string): void {
    const notif = this.getNotificationById(id);
    if (notif) {
      notif.status = 'ARCHIVED';
      notif.updatedAt = new Date().toISOString();

      notificationAuditService.logEvent({
        tenantId: notif.tenantId,
        userId: notif.recipientId,
        action: 'NOTIFICATION_ARCHIVED',
        details: `Archived notification #${id}`,
      });

      this.notifyListeners('notification.archived', notif);
    }
  }

  deleteNotification(id: string): void {
    const notif = this.getNotificationById(id);
    if (notif) {
      this.notifications = this.notifications.filter((n) => n.id !== id);

      notificationAuditService.logEvent({
        tenantId: notif.tenantId,
        userId: notif.recipientId,
        action: 'NOTIFICATION_DELETED',
        details: `Deleted notification #${id}`,
      });
    }
  }

  markAllRead(tenantId: string, recipientId?: string): void {
    const targets = this.getNotifications(tenantId, recipientId).filter((n) => n.status === 'UNREAD');
    targets.forEach((n) => {
      n.status = 'READ';
      n.readAt = new Date().toISOString();
      n.updatedAt = new Date().toISOString();
    });
  }
}

export const notificationService = new NotificationService();
