/**
 * Fleet Intelligence Smart AI - Provider Registry & Dynamic Orchestrator
 * PROMPT 45: Provider Abstraction, Primary/Fallback Selection & Health Monitoring
 */

import { INotificationProvider } from '../providers/NotificationProvider';
import { SendGridEmailAdapter, SMTPEmailAdapter, ResendEmailAdapter } from '../providers/email/EmailAdapters';
import { FCMAdapter, APNsAdapter, WebPushAdapter } from '../providers/push/PushAdapters';
import { MetaCloudWhatsAppAdapter, TwilioWhatsAppAdapter, QontakWhatsAppAdapter, WablasWhatsAppAdapter } from '../providers/whatsapp/WhatsAppAdapters';
import { TwilioSMSAdapter, TelkomselSMSAdapter } from '../providers/sms/SMSAdapters';
import {
  NotificationChannel,
  NotificationProviderConfig,
  ProviderHealthStatus,
} from '../types/notificationEngineTypes';

class ProviderRegistryService {
  private providers: Map<string, INotificationProvider> = new Map();
  private configs: Map<string, NotificationProviderConfig> = new Map();

  constructor() {
    this.initializeDefaultProviders();
  }

  private initializeDefaultProviders() {
    // 1. Email Providers
    const sendgrid = new SendGridEmailAdapter();
    sendgrid.isPrimary = true;
    const smtp = new SMTPEmailAdapter();
    smtp.isFallback = true;
    const resend = new ResendEmailAdapter();

    this.registerProvider(sendgrid, {
      displayName: 'SendGrid Transactional API',
      description: 'Primary email provider via Twilio SendGrid v3 API',
      isPrimary: true,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { apiKey: 'SG.••••••••••••••••••••••••' },
      configOptions: { fromEmail: 'no-reply@fleet-intel.id', fromName: 'Fleet Intelligence AI' },
      supportedFeatures: { html: true, attachments: true, deliveryReceipts: true },
    });

    this.registerProvider(smtp, {
      displayName: 'Enterprise SMTP Relay',
      description: 'High-availability on-premise SMTP cluster for failover',
      isPrimary: false,
      isFallback: true,
      isEnabled: true,
      credentialsMasked: { host: 'smtp.fleet-intel.id', port: '587', user: 'relay_auth' },
      configOptions: { secure: true },
      supportedFeatures: { html: true, attachments: true },
    });

    this.registerProvider(resend, {
      displayName: 'Resend Cloud Email',
      description: 'Developer-first email delivery platform',
      isPrimary: false,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { apiKey: 're_••••••••••••••••' },
      configOptions: { domain: 'mail.fleet-intel.id' },
      supportedFeatures: { html: true, attachments: true },
    });

    // 2. Push Providers
    const fcm = new FCMAdapter();
    fcm.isPrimary = true;
    const apns = new APNsAdapter();
    apns.isFallback = true;
    const webpush = new WebPushAdapter();

    this.registerProvider(fcm, {
      displayName: 'Google Firebase Cloud Messaging (FCM v1)',
      description: 'High-throughput push notification for Android, iOS & Web',
      isPrimary: true,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { serviceAccount: '••••••••fcm-service-account.json' },
      configOptions: { projectId: 'fleet-intelligence-ai' },
      supportedFeatures: { deliveryReceipts: true, bulkSend: true },
    });

    this.registerProvider(apns, {
      displayName: 'Apple Push Notification Service (APNs)',
      description: 'Direct HTTP/2 APNs connection for iOS devices',
      isPrimary: false,
      isFallback: true,
      isEnabled: true,
      credentialsMasked: { keyId: 'APN_••••••••', teamId: 'TEAM_••••••••' },
      configOptions: { bundleId: 'com.fleetintel.app' },
      supportedFeatures: { deliveryReceipts: true },
    });

    this.registerProvider(webpush, {
      displayName: 'W3C Web Push Protocol (VAPID)',
      description: 'Browser desktop push notifications',
      isPrimary: false,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { publicKey: 'BN_••••••••', privateKey: '••••••••' },
      configOptions: { subject: 'mailto:admin@fleet-intel.id' },
      supportedFeatures: { deliveryReceipts: true },
    });

    // 3. WhatsApp Providers
    const metaWa = new MetaCloudWhatsAppAdapter();
    metaWa.isPrimary = true;
    const qontakWa = new QontakWhatsAppAdapter();
    qontakWa.isFallback = true;
    const twilioWa = new TwilioWhatsAppAdapter();
    const wablasWa = new WablasWhatsAppAdapter();

    this.registerProvider(metaWa, {
      displayName: 'Meta WhatsApp Cloud API (Official)',
      description: 'Direct Meta Business API with verified green badge support',
      isPrimary: true,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { wabaId: 'WABA_••••1092', accessToken: 'EAAG••••••••' },
      configOptions: { phoneNumberId: '1098237461928' },
      supportedFeatures: { templates: true, mediaMessages: true, deliveryReceipts: true },
    });

    this.registerProvider(qontakWa, {
      displayName: 'Mekari Qontak WhatsApp BSP',
      description: 'Enterprise WhatsApp BSP for Indonesia failover routing',
      isPrimary: false,
      isFallback: true,
      isEnabled: true,
      credentialsMasked: { clientId: 'qontak_••••', clientSecret: '••••••••' },
      configOptions: { channelId: 'ch_qontak_992' },
      supportedFeatures: { templates: true, mediaMessages: true, deliveryReceipts: true },
    });

    this.registerProvider(twilioWa, {
      displayName: 'Twilio WhatsApp API',
      description: 'Global WhatsApp messaging gateway',
      isPrimary: false,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { accountSid: 'AC••••••••', authToken: '••••••••' },
      configOptions: { fromNumber: 'whatsapp:+14155238886' },
      supportedFeatures: { templates: true, mediaMessages: true },
    });

    this.registerProvider(wablasWa, {
      displayName: 'Wablas Gateway',
      description: 'Secondary multi-device WhatsApp router',
      isPrimary: false,
      isFallback: false,
      isEnabled: false,
      credentialsMasked: { apiKey: 'wablas_••••••••' },
      configOptions: { server: 'https://borneo.wablas.com' },
      supportedFeatures: { mediaMessages: true },
    });

    // 4. SMS Providers
    const twilioSms = new TwilioSMSAdapter();
    twilioSms.isPrimary = true;
    const telkomselSms = new TelkomselSMSAdapter();
    telkomselSms.isFallback = true;

    this.registerProvider(twilioSms, {
      displayName: 'Twilio SMS Gateway',
      description: 'Global 2FA OTP & emergency broadcast SMS',
      isPrimary: true,
      isFallback: false,
      isEnabled: true,
      credentialsMasked: { accountSid: 'AC••••••••', authToken: '••••••••' },
      configOptions: { fromNumber: '+12055550199' },
      supportedFeatures: { deliveryReceipts: true },
    });

    this.registerProvider(telkomselSms, {
      displayName: 'Telkomsel Enterprise SMPP',
      description: 'Low-latency national SMS gateway with custom sender ID (FLEET_AI)',
      isPrimary: false,
      isFallback: true,
      isEnabled: true,
      credentialsMasked: { systemId: 'TSEL_SMPP_••', password: '••••••••' },
      configOptions: { senderId: 'FLEET_AI' },
      supportedFeatures: { deliveryReceipts: true },
    });
  }

  public registerProvider(
    provider: INotificationProvider,
    options: Omit<NotificationProviderConfig, 'id' | 'channel' | 'providerName' | 'healthStatus' | 'successRate' | 'avgLatencyMs'>
  ) {
    this.providers.set(provider.id, provider);
    const config: NotificationProviderConfig = {
      id: provider.id,
      channel: provider.channel,
      providerName: provider.name,
      displayName: options.displayName,
      description: options.description,
      isPrimary: options.isPrimary,
      isFallback: options.isFallback,
      isEnabled: options.isEnabled,
      healthStatus: 'HEALTHY',
      successRate: 99.4,
      avgLatencyMs: 65,
      lastTestedAt: new Date().toISOString(),
      credentialsMasked: options.credentialsMasked,
      configOptions: options.configOptions,
      supportedFeatures: options.supportedFeatures,
    };
    this.configs.set(provider.id, config);
  }

  public getProvidersByChannel(channel: NotificationChannel): INotificationProvider[] {
    return Array.from(this.providers.values()).filter(p => p.channel === channel && p.isEnabled);
  }

  public getPrimaryProvider(channel: NotificationChannel): INotificationProvider | undefined {
    const list = this.getProvidersByChannel(channel);
    return list.find(p => p.isPrimary) || list[0];
  }

  public getFallbackProvider(channel: NotificationChannel): INotificationProvider | undefined {
    const list = this.getProvidersByChannel(channel);
    return list.find(p => p.isFallback && !p.isPrimary) || (list.length > 1 ? list[1] : undefined);
  }

  public getProviderConfig(providerId: string): NotificationProviderConfig | undefined {
    return this.configs.get(providerId);
  }

  public getAllConfigs(): NotificationProviderConfig[] {
    return Array.from(this.configs.values());
  }

  public setPrimaryProvider(channel: NotificationChannel, providerId: string) {
    for (const [id, prov] of this.providers.entries()) {
      if (prov.channel === channel) {
        prov.isPrimary = id === providerId;
        const cfg = this.configs.get(id);
        if (cfg) cfg.isPrimary = id === providerId;
      }
    }
  }

  public setFallbackProvider(channel: NotificationChannel, providerId: string) {
    for (const [id, prov] of this.providers.entries()) {
      if (prov.channel === channel) {
        prov.isFallback = id === providerId;
        const cfg = this.configs.get(id);
        if (cfg) cfg.isFallback = id === providerId;
      }
    }
  }

  public toggleProviderEnabled(providerId: string, enabled: boolean) {
    const prov = this.providers.get(providerId);
    if (prov) prov.isEnabled = enabled;
    const cfg = this.configs.get(providerId);
    if (cfg) cfg.isEnabled = enabled;
  }

  public async testProvider(providerId: string): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const prov = this.providers.get(providerId);
    if (!prov) return { success: false, latencyMs: 0, error: 'Provider not found' };

    const health = await prov.getHealth();
    const cfg = this.configs.get(providerId);
    if (cfg) {
      cfg.healthStatus = health.status;
      cfg.avgLatencyMs = health.latencyMs;
      cfg.lastTestedAt = new Date().toISOString();
      if (health.error) cfg.lastError = health.error;
    }

    return {
      success: health.status === 'HEALTHY',
      latencyMs: health.latencyMs,
      error: health.error,
    };
  }

  public rotateCredentials(providerId: string, newKeyPreview: string) {
    const cfg = this.configs.get(providerId);
    if (cfg) {
      const keys = Object.keys(cfg.credentialsMasked);
      if (keys.length > 0) {
        cfg.credentialsMasked[keys[0]] = `••••••••${newKeyPreview}`;
      }
      cfg.lastTestedAt = new Date().toISOString();
    }
  }
}

export const providerRegistry = new ProviderRegistryService();
