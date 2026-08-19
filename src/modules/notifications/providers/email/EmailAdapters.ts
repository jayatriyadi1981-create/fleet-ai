/**
 * Fleet Intelligence Smart AI - Email Provider Adapters
 * PROMPT 45: SendGrid, SMTP, and Resend Transactional Email Adapters
 */

import { BaseNotificationProvider } from '../NotificationProvider';
import {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from '../../types/notificationEngineTypes';

export class SendGridEmailAdapter extends BaseNotificationProvider {
  public readonly id = 'email-sendgrid';
  public readonly name = 'SendGrid API';
  public readonly displayName = 'SendGrid Transactional Email (Twilio)';
  public readonly channel: NotificationChannel = 'EMAIL';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    // Validate recipient
    if (!message.recipient || !message.recipient.includes('@')) {
      return this.createFailureResult('INVALID_EMAIL', `Format email penerima tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    // Simulated SendGrid transactional email dispatch
    await new Promise(r => setTimeout(r, 65 + Math.random() * 40));
    const latency = Date.now() - start;
    const msgId = `sg_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Cost ~ $0.0001 per transactional email (~1.6 IDR)
    return this.createSuccessResult(msgId, latency, 2);
  }
}

export class SMTPEmailAdapter extends BaseNotificationProvider {
  public readonly id = 'email-smtp';
  public readonly name = 'SMTP Server';
  public readonly displayName = 'Enterprise SMTP Relay (TLS 587)';
  public readonly channel: NotificationChannel = 'EMAIL';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    if (!message.recipient || !message.recipient.includes('@')) {
      return this.createFailureResult('INVALID_EMAIL', `Format email penerima tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 90 + Math.random() * 50));
    const latency = Date.now() - start;
    const msgId = `smtp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}@mail.fleet-intel.id`;
    
    return this.createSuccessResult(msgId, latency, 0);
  }
}

export class ResendEmailAdapter extends BaseNotificationProvider {
  public readonly id = 'email-resend';
  public readonly name = 'Resend API';
  public readonly displayName = 'Resend Cloud Developer Email';
  public readonly channel: NotificationChannel = 'EMAIL';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    if (!message.recipient || !message.recipient.includes('@')) {
      return this.createFailureResult('INVALID_EMAIL', `Format email penerima tidak valid: ${message.recipient}`, Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 55 + Math.random() * 30));
    const latency = Date.now() - start;
    const msgId = `re_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 2);
  }
}
