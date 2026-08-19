/**
 * Fleet Intelligence Smart AI - SMS Provider Adapters
 * PROMPT 45: Twilio SMS and Telkomsel / Indosat Enterprise SMS Gateway
 */

import { BaseNotificationProvider } from '../NotificationProvider';
import {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from '../../types/notificationEngineTypes';

export class TwilioSMSAdapter extends BaseNotificationProvider {
  public readonly id = 'sms-twilio';
  public readonly name = 'Twilio Programmable SMS';
  public readonly displayName = 'Twilio Global SMS Gateway';
  public readonly channel: NotificationChannel = 'SMS';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 8) {
      return this.createFailureResult('INVALID_PHONE', `Nomor HP untuk SMS tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 85 + Math.random() * 40));
    const latency = Date.now() - start;
    const msgId = `SM_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Twilio SMS in ID ~ 850 IDR
    return this.createSuccessResult(msgId, latency, 850);
  }
}

export class TelkomselSMSAdapter extends BaseNotificationProvider {
  public readonly id = 'sms-telkomsel';
  public readonly name = 'Telkomsel Enterprise SMS';
  public readonly displayName = 'Telkomsel Enterprise SMPP Gateway';
  public readonly channel: NotificationChannel = 'SMS';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    const phone = (message.recipient || '').replace(/[\s-+]/g, '');
    if (!phone || phone.length < 8) {
      return this.createFailureResult('INVALID_PHONE', `Nomor HP untuk SMS tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 60 + Math.random() * 30));
    const latency = Date.now() - start;
    const msgId = `TSEL_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Telkomsel Enterprise SMS Masking ~ 450 IDR
    return this.createSuccessResult(msgId, latency, 450);
  }
}
