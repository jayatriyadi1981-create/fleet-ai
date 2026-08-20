/**
 * Fleet Intelligence Smart AI - Notification Channels & Fallback Configuration
 * PROMPT 59: Multi-Provider Abstraction, Fallback Cascade & Delivery SLAs
 */

export interface NotificationChannelConfig {
  enabled: boolean;
  provider: string;
  retryAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
}

export interface NotificationConfig {
  channels: {
    inApp: NotificationChannelConfig;
    push: NotificationChannelConfig;
    email: NotificationChannelConfig;
    whatsapp: NotificationChannelConfig;
    sms: NotificationChannelConfig;
  };
  fallbackChain: ('inApp' | 'push' | 'email' | 'whatsapp' | 'sms')[];
  rateLimitPerRecipient: {
    maxPerMinute: number;
    maxPerHour: number;
  };
}

export const notificationConfig: NotificationConfig = {
  channels: {
    inApp: {
      enabled: true,
      provider: 'supabase_realtime',
      retryAttempts: 3,
      retryDelayMs: 1000,
      timeoutMs: 5000,
    },
    push: {
      enabled: true,
      provider: 'firebase_fcm',
      retryAttempts: 2,
      retryDelayMs: 2000,
      timeoutMs: 8000,
    },
    email: {
      enabled: true,
      provider: 'resend',
      retryAttempts: 2,
      retryDelayMs: 3000,
      timeoutMs: 10000,
    },
    whatsapp: {
      enabled: true,
      provider: 'twilio_waba',
      retryAttempts: 2,
      retryDelayMs: 3000,
      timeoutMs: 10000,
    },
    sms: {
      enabled: true,
      provider: 'telkomsel_sms',
      retryAttempts: 1,
      retryDelayMs: 5000,
      timeoutMs: 10000,
    },
  },
  fallbackChain: ['whatsapp', 'push', 'email', 'inApp'],
  rateLimitPerRecipient: {
    maxPerMinute: 5,
    maxPerHour: 50,
  },
};
