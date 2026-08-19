/**
 * Fleet Intelligence Smart AI - Notification Template Engine Service
 * Renders dynamic variables with safe fallbacks & multi-language support
 */

import { NotificationTemplate, DeliveryChannel, NotificationCategory } from '../types';

export class NotificationTemplateService {
  private templates: NotificationTemplate[] = [
    {
      id: 'tmpl-01',
      tenantId: 'tenant-indonesia-logistics',
      name: 'Peringatan Darurat Panic Button SOS',
      category: 'ALERT',
      channel: 'IN_APP',
      language: 'id',
      status: 'ACTIVE',
      titleTemplate: '🚨 DARURAT PANIC BUTTON — {{vehicle.plate}}',
      bodyTemplate: 'Pengemudi {{driver.name}} menekan Panic SOS di kendaraan {{vehicle.plate}} ({{vehicle.type}}) pada lokasi {{location.address}}. Tindakan eskalasi segera diperlukan!',
      variables: ['vehicle.plate', 'vehicle.type', 'driver.name', 'location.address', 'alert.time'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-02',
      tenantId: 'tenant-indonesia-logistics',
      name: 'Email Peringatan Pelanggaran Overspeed',
      category: 'ALERT',
      channel: 'EMAIL',
      language: 'id',
      status: 'ACTIVE',
      titleTemplate: '⚠️ Pelanggaran Batas Kecepatan (Overspeed) — {{vehicle.plate}}',
      bodyTemplate: 'Kendaraan {{vehicle.plate}} yang dikemudikan oleh {{driver.name}} terdeteksi memacu kecepatan {{telemetry.speed}} km/jam (batas {{alert.threshold}} km/jam) pada {{alert.time}} WIB di area {{location.address}}.',
      variables: ['vehicle.plate', 'driver.name', 'telemetry.speed', 'alert.threshold', 'alert.time', 'location.address'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-03',
      tenantId: 'tenant-indonesia-logistics',
      name: 'WhatsApp Notifikasi Pengiriman Selesai POD',
      category: 'DELIVERY',
      channel: 'WHATSAPP',
      language: 'id',
      status: 'ACTIVE',
      titleTemplate: '📦 Status Pengiriman {{delivery.orderNumber}} Selesai',
      bodyTemplate: 'Halo, pengiriman pesanan {{delivery.orderNumber}} untuk {{delivery.customerName}} telah selesei diantar oleh {{driver.name}} ({{vehicle.plate}}). Bukti POD foto & tanda tangan digital telah terverifikasi sistem.',
      variables: ['delivery.orderNumber', 'delivery.customerName', 'driver.name', 'vehicle.plate'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-04',
      tenantId: 'tenant-indonesia-logistics',
      name: 'SMS Warning Critical Offline Device',
      category: 'DEVICE',
      channel: 'SMS',
      language: 'id',
      status: 'ACTIVE',
      titleTemplate: 'FLEET ALERT: DEVICE OFFLINE {{vehicle.plate}}',
      bodyTemplate: 'CRITICAL: GPS Device {{device.imei}} pada armada {{vehicle.plate}} terputus koneksi (OFFLINE > {{alert.duration}} menit). Mohon cek status daya baterai atau kartu SIM.',
      variables: ['vehicle.plate', 'device.imei', 'alert.duration'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-05',
      tenantId: 'tenant-indonesia-logistics',
      name: 'Push Notification Jadwal Maintenance Service',
      category: 'MAINTENANCE',
      channel: 'PUSH',
      language: 'id',
      status: 'ACTIVE',
      titleTemplate: '🔧 Jadwal Pemeliharaan Berkala: {{vehicle.plate}}',
      bodyTemplate: 'Armada {{vehicle.plate}} telah mencapai kilometer service ({{telemetry.odometer}} KM). Work Order #WO-{{maintenance.id}} disiapkan.',
      variables: ['vehicle.plate', 'telemetry.odometer', 'maintenance.id'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getTemplates(): NotificationTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): NotificationTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  createTemplate(data: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): NotificationTemplate {
    const newTmpl: NotificationTemplate = {
      ...data,
      id: `tmpl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.unshift(newTmpl);
    return newTmpl;
  }

  updateTemplate(id: string, data: Partial<NotificationTemplate>): NotificationTemplate | undefined {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...this.templates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.templates[index] = updated;
    return updated;
  }

  deleteTemplate(id: string): boolean {
    const prevLen = this.templates.length;
    this.templates = this.templates.filter((t) => t.id !== id);
    return this.templates.length < prevLen;
  }

  /**
   * Renders dynamic variables in template string with safe default fallbacks
   */
  renderString(templateStr: string, contextData: Record<string, any> = {}): string {
    return templateStr.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, varName) => {
      const value = this.getNestedValue(contextData, varName);
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }

      // Safe Fallback Resolution per domain type
      if (varName.includes('driver')) return 'Tidak Ditugaskan';
      if (varName.includes('plate')) return 'B 0000 XXX';
      if (varName.includes('customer')) return 'Pelanggan General';
      if (varName.includes('address') || varName.includes('location')) return 'Lokasi Tidak Terdeteksi';
      if (varName.includes('speed')) return '0';
      if (varName.includes('order') || varName.includes('delivery')) return 'TRX-0000';
      return 'N/A';
    });
  }

  /**
   * Helper to retrieve nested object paths e.g. "vehicle.plate" -> contextData.vehicle.plate
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  /**
   * Simulates full rendered multi-channel notification sample
   */
  generateSamplePreview(templateId: string, sampleDataOverrides?: Record<string, any>) {
    const template = this.getTemplateById(templateId) || this.templates[0];

    const sampleContext = {
      vehicle: { plate: 'B 1234 ABC', type: 'Wingbox Heavy Truck', brand: 'Hino' },
      driver: { name: 'Andi Wijaya', phone: '+628123456789' },
      location: { address: 'KM 42 Tol Jakarta-Cikampek, Karawang Barat' },
      telemetry: { speed: 112, odometer: 85420 },
      alert: { time: new Date().toLocaleTimeString('id-ID'), threshold: 90, duration: 15 },
      delivery: { orderNumber: 'DEL-88902', customerName: 'PT Sumber Makmur Jaya' },
      device: { imei: '864201928374102' },
      maintenance: { id: 'WO-9912' },
      ...sampleDataOverrides,
    };

    return {
      title: this.renderString(template.titleTemplate, sampleContext),
      body: this.renderString(template.bodyTemplate, sampleContext),
      channel: template.channel,
      category: template.category,
      language: template.language,
      sampleData: sampleContext,
    };
  }
}

export const notificationTemplateService = new NotificationTemplateService();
