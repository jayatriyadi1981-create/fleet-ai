/**
 * Fleet Intelligence Smart AI - Notification Template & Variable Engine
 * PROMPT 45: Dynamic Token Interpolation, Multi-Language & Template Versioning
 */

import { NotificationTemplate, NotificationEventType } from '../types/notificationEngineTypes';

const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tmpl-overspeed-id',
    tenantId: 'global',
    name: 'Peringatan Overspeed / Melebihi Kecepatan',
    event: 'gps.overspeed',
    channels: ['WHATSAPP', 'PUSH', 'EMAIL', 'IN_APP'],
    language: 'id',
    category: 'ALERT',
    titleTemplate: '⚠️ Peringatan Overspeed: Kendaraan {{vehiclePlate}}',
    bodyTemplate: 'Halo {{driverName}},\n\nKendaraan *{{vehiclePlate}}* terdeteksi overspeed di *{{location}}*.\nKecepatan tercatat: *{{speed}} km/jam* (Batas: {{speedLimit}} km/jam).\nWaktu: {{timestamp}}\n\nMohon kurangi kecepatan demi keselamatan bersama.',
    htmlTemplate: '<div style="font-family:sans-serif;padding:16px;border-left:4px solid #f59e0b;"><h3>Peringatan Overspeed</h3><p>Kendaraan <strong>{{vehiclePlate}}</strong> terdeteksi melaju <strong>{{speed}} km/jam</strong> di {{location}}.</p></div>',
    whatsAppTemplateName: 'fleet_overspeed_alert',
    variables: ['driverName', 'vehiclePlate', 'speed', 'speedLimit', 'location', 'timestamp'],
    version: 2,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-panic-sos-id',
    tenantId: 'global',
    name: 'EMERGENCY: Tombol Panic SOS Ditekan',
    event: 'safety.panic_sos',
    channels: ['WHATSAPP', 'SMS', 'PUSH', 'EMAIL', 'IN_APP'],
    language: 'id',
    category: 'SAFETY',
    titleTemplate: '🚨 DARURAT: Tombol Panic SOS {{vehiclePlate}}!',
    bodyTemplate: '🚨 *ALERT DARURAT (PANIC SOS)* 🚨\n\nDriver: *{{driverName}}*\nKendaraan: *{{vehiclePlate}}*\nLokasi: *{{location}}*\nWaktu: {{timestamp}}\nKoordinat: {{coordinates}}\n\nDispatcher & Tim Tanggap Darurat harap segera melakukan konfirmasi via radio / telepon!',
    whatsAppTemplateName: 'fleet_panic_sos_critical',
    variables: ['driverName', 'vehiclePlate', 'location', 'timestamp', 'coordinates'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-vehicle-offline-id',
    tenantId: 'global',
    name: 'Sinyal GPS Hilang / Armada Offline',
    event: 'gps.offline',
    channels: ['PUSH', 'EMAIL', 'IN_APP'],
    language: 'id',
    category: 'ALERT',
    titleTemplate: '📡 Sinyal GPS Terputus: {{vehiclePlate}}',
    bodyTemplate: 'Perangkat GPS pada unit *{{vehiclePlate}}* tidak mengirimkan paket telemetri lebih dari {{durationMinutes}} menit.\nLokasi terakhir: {{location}} pada {{timestamp}}.',
    variables: ['vehiclePlate', 'durationMinutes', 'location', 'timestamp'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-maintenance-due-id',
    tenantId: 'global',
    name: 'Jadwal Pemeliharaan / Servis Berkala',
    event: 'maintenance.due_soon',
    channels: ['EMAIL', 'WHATSAPP', 'IN_APP'],
    language: 'id',
    category: 'MAINTENANCE',
    titleTemplate: '🔧 Jadwal Servis Mendekati Batas: {{vehiclePlate}}',
    bodyTemplate: 'Halo Tim Workshop & Driver {{driverName}},\n\nUnit *{{vehiclePlate}}* telah mencapai *{{odometer}} km* dan mendekati jadwal *{{serviceType}}*.\nJatuh tempo: *{{dueDate}}*.\n\nSilakan jadwalkan Work Order melalui Fleet Intelligence Portal.',
    whatsAppTemplateName: 'fleet_maintenance_due',
    variables: ['driverName', 'vehiclePlate', 'odometer', 'serviceType', 'dueDate'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-fuel-anomaly-id',
    tenantId: 'global',
    name: 'Anomali Penurunan Bahan Bakar (Fuel Drop)',
    event: 'fuel.drop_anomaly',
    channels: ['WHATSAPP', 'PUSH', 'EMAIL', 'IN_APP'],
    language: 'id',
    category: 'FUEL',
    titleTemplate: '⛽ Anomali BBM Terdeteksi: {{vehiclePlate}} (-{{dropLiters}} L)',
    bodyTemplate: '⚠️ Terjadi penurunan BBM drastis sebesar *{{dropLiters}} Liter* pada unit *{{vehiclePlate}}* saat status kontak {{ignitionStatus}}.\nLokasi: *{{location}}*\nWaktu: {{timestamp}}.\n\nHarap investigasi potensi pencurian / kebocoran tangki.',
    whatsAppTemplateName: 'fleet_fuel_anomaly',
    variables: ['vehiclePlate', 'dropLiters', 'ignitionStatus', 'location', 'timestamp'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-ai-risk-id',
    tenantId: 'global',
    name: 'AI Smart Predictive Risk Insight',
    event: 'ai.risk_recommendation',
    channels: ['PUSH', 'EMAIL', 'IN_APP'],
    language: 'id',
    category: 'AI',
    titleTemplate: '🧠 AI Copilot: {{recommendationTitle}}',
    bodyTemplate: 'Rekomendasi Cerdas AI untuk Armada {{companyName}}:\n\n*{{summary}}*\n\nPotensi Dampak: {{riskLevel}} (Estimasi Penghematan/Mitigasi: {{potentialImpact}}).\n\nBuka dashboard untuk menyetujui rekomendasi otomatis.',
    variables: ['companyName', 'recommendationTitle', 'summary', 'riskLevel', 'potentialImpact'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-otp-sms-id',
    tenantId: 'global',
    name: 'Kode Verifikasi OTP / 2FA Login',
    event: 'system.otp_verification',
    channels: ['SMS', 'WHATSAPP'],
    language: 'id',
    category: 'SECURITY',
    titleTemplate: 'Kode OTP Verifikasi Keamanan',
    bodyTemplate: 'Kode OTP Fleet Intelligence Anda adalah: {{otpCode}}. Berlaku selama {{expiryMinutes}} menit. JANGAN bagikan kode ini kepada siapapun!',
    variables: ['otpCode', 'expiryMinutes'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-daily-digest-id',
    tenantId: 'global',
    name: 'Fleet Daily Executive Summary Digest',
    event: 'ai.efficiency_digest',
    channels: ['EMAIL', 'WHATSAPP'],
    language: 'id',
    category: 'TRIP',
    titleTemplate: '📊 Ringkasan Harian Operasional Armada: {{date}}',
    bodyTemplate: '📊 *Ringkasan Harian Armada {{companyName}}*\nTanggal: {{date}}\n\n• Total Armada: {{totalVehicles}} unit ({{activeCount}} Aktif, {{offlineCount}} Offline)\n• Total Jarak: {{totalDistanceKm}} km\n• Total Konsumsi BBM: {{fuelConsumedLiters}} Liter\n• Insiden Overspeed: {{overspeedCount}} kali\n• Maintenance Due: {{maintenanceCount}} unit\n\nAI Score Armada: {{fleetScore}}/100',
    variables: ['companyName', 'date', 'totalVehicles', 'activeCount', 'offlineCount', 'totalDistanceKm', 'fuelConsumedLiters', 'overspeedCount', 'maintenanceCount', 'fleetScore'],
    version: 1,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
];

class NotificationTemplateEngineService {
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor() {
    for (const t of DEFAULT_TEMPLATES) {
      this.templates.set(t.id, t);
    }
  }

  public getAllTemplates(tenantId?: string): NotificationTemplate[] {
    const list = Array.from(this.templates.values());
    if (!tenantId || tenantId === 'global') return list;
    return list.filter(t => t.tenantId === 'global' || t.tenantId === tenantId);
  }

  public getTemplateById(id: string): NotificationTemplate | undefined {
    return this.templates.get(id);
  }

  public getTemplateByEvent(event: NotificationEventType, language: 'id' | 'en' = 'id'): NotificationTemplate | undefined {
    return Array.from(this.templates.values()).find(
      t => t.event === event && t.language === language && t.isActive
    ) || Array.from(this.templates.values()).find(t => t.event === event && t.isActive);
  }

  public render(
    template: NotificationTemplate,
    variables: Record<string, string | number> = {}
  ): { title: string; body: string; htmlBody?: string } {
    const interpolate = (text: string): string => {
      return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
        const val = variables[key];
        if (val !== undefined && val !== null && val !== '') {
          return String(val);
        }
        // Graceful fallback for missing tokens
        return `[${key}]`;
      });
    };

    return {
      title: interpolate(template.titleTemplate),
      body: interpolate(template.bodyTemplate),
      htmlBody: template.htmlTemplate ? interpolate(template.htmlTemplate) : undefined,
    };
  }

  public saveTemplate(template: NotificationTemplate): NotificationTemplate {
    const updated = {
      ...template,
      updatedAt: new Date().toISOString(),
      version: template.version + 1,
    };
    this.templates.set(template.id, updated);
    return updated;
  }

  public createTemplate(data: Omit<NotificationTemplate, 'id' | 'version' | 'updatedAt'>): NotificationTemplate {
    const id = `tmpl_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    const newTemplate: NotificationTemplate = {
      ...data,
      id,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }
}

export const notificationTemplateEngine = new NotificationTemplateEngineService();
