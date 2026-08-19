/**
 * Fleet Intelligence Smart AI - WhatsApp Provider Adapters
 * PROMPT 45: Meta Cloud API, Twilio WhatsApp, Qontak, and Wablas
 */

import { BaseNotificationProvider } from '../NotificationProvider';
import {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from '../../types/notificationEngineTypes';

export class MetaCloudWhatsAppAdapter extends BaseNotificationProvider {
  public readonly id = 'whatsapp-meta-cloud';
  public readonly name = 'Meta WhatsApp Cloud API';
  public readonly displayName = 'Meta WhatsApp Cloud API (Official)';
  public readonly channel: NotificationChannel = 'WHATSAPP';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    // Validate phone number format (E.164)
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 9) {
      return this.createFailureResult('INVALID_PHONE', `Nomor WhatsApp tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 70 + Math.random() * 50));
    const latency = Date.now() - start;
    const msgId = `wamid.HBgL${phone}_${Date.now().toString(36)}`;
    
    // Meta Utility/Alert Template message cost in Indonesia ~ 350 - 450 IDR
    return this.createSuccessResult(msgId, latency, 385);
  }
}

export class TwilioWhatsAppAdapter extends BaseNotificationProvider {
  public readonly id = 'whatsapp-twilio';
  public readonly name = 'Twilio WhatsApp API';
  public readonly displayName = 'Twilio Messaging WhatsApp Gateway';
  public readonly channel: NotificationChannel = 'WHATSAPP';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 9) {
      return this.createFailureResult('INVALID_PHONE', `Nomor WhatsApp tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 80 + Math.random() * 40));
    const latency = Date.now() - start;
    const msgId = `SM_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 420);
  }
}

export class QontakWhatsAppAdapter extends BaseNotificationProvider {
  public readonly id = 'whatsapp-qontak';
  public readonly name = 'Mekari Qontak BSP';
  public readonly displayName = 'Mekari Qontak Official WhatsApp BSP';
  public readonly channel: NotificationChannel = 'WHATSAPP';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 9) {
      return this.createFailureResult('INVALID_PHONE', `Nomor WhatsApp tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 75 + Math.random() * 45));
    const latency = Date.now() - start;
    const msgId = `qontak_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 360);
  }
}

export class WablasWhatsAppAdapter extends BaseNotificationProvider {
  public readonly id = 'whatsapp-wablas';
  public readonly name = 'Wablas Gateway';
  public readonly displayName = 'Wablas Multi-Device WhatsApp Gateway';
  public readonly channel: NotificationChannel = 'WHATSAPP';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 9) {
      return this.createFailureResult('INVALID_PHONE', `Nomor WhatsApp tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 90 + Math.random() * 50));
    const latency = Date.now() - start;
    const msgId = `wb_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 250);
  }
}
