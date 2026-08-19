/**
 * Fleet Intelligence Smart AI - Audit Redaction & PII Protection Service
 * PROMPT 49 - Zero-Trust Data Masking and Secret Protection Layer
 */

import { FieldDiff } from '../types/auditTypes';

export class AuditRedactionService {
  private static SENSITIVE_KEY_PATTERNS = [
    /password/i,
    /pass_hash/i,
    /passwd/i,
    /token/i,
    /secret/i,
    /api_key/i,
    /apikey/i,
    /auth/i,
    /private_key/i,
    /credit_card/i,
    /cvv/i,
    /otp/i,
    /pin/i,
    /bearer/i,
    /jwt/i,
    /certificate/i,
  ];

  /**
   * Masks email address e.g. "jayatriyadi1981@gmail.com" -> "j***1@gmail.com"
   */
  public static maskEmail(email?: string): string {
    if (!email || typeof email !== 'string') return '';
    const parts = email.split('@');
    if (parts.length !== 2) return '[REDACTED_EMAIL]';
    const [name, domain] = parts;
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  }

  /**
   * Masks Indonesian & international phone numbers e.g. "081234567890" -> "0812******90"
   */
  public static maskPhone(phone?: string): string {
    if (!phone || typeof phone !== 'string') return '';
    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 7) return '******';
    const prefix = clean.slice(0, 4);
    const suffix = clean.slice(-2);
    return `${prefix}${'*'.repeat(Math.max(4, clean.length - 6))}${suffix}`;
  }

  /**
   * Masks NIK (KTP ID) e.g. "3171012345670001" -> "3171**********01"
   */
  public static maskNationalId(nik?: string): string {
    if (!nik || typeof nik !== 'string') return '';
    if (nik.length < 8) return '********';
    return `${nik.slice(0, 4)}${'*'.repeat(nik.length - 6)}${nik.slice(-2)}`;
  }

  /**
   * Checks if a field name matches known sensitive secret keywords
   */
  public static isSensitiveKey(key: string): boolean {
    return this.SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
  }

  /**
   * Sanitizes any arbitrary object/value recursively, replacing secrets with '[REDACTED]'
   * and applying PII masking to known PII fields.
   */
  public static sanitizeData<T = any>(input: T, depth = 0): T {
    if (depth > 8 || input === null || input === undefined) {
      return input;
    }

    if (typeof input !== 'object') {
      return input;
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitizeData(item, depth + 1)) as unknown as T;
    }

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(input as Record<string, any>)) {
      // Secret key matching
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED_SECRET]';
        continue;
      }

      // PII masking matching
      if (/email/i.test(key) && typeof value === 'string') {
        sanitized[key] = this.maskEmail(value);
        continue;
      }
      if (/(phone|telp|mobile|handphone)/i.test(key) && typeof value === 'string') {
        sanitized[key] = this.maskPhone(value);
        continue;
      }
      if (/(nik|ktp|simNumber|passport)/i.test(key) && typeof value === 'string') {
        sanitized[key] = this.maskNationalId(value);
        continue;
      }

      // Recursive sanitization
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized as T;
  }

  /**
   * Generates field-level diffs while ensuring secrets are masked
   */
  public static calculateFieldDiff(
    beforeObj?: Record<string, any>,
    afterObj?: Record<string, any>
  ): FieldDiff[] {
    if (!beforeObj && !afterObj) return [];
    const diffs: FieldDiff[] = [];
    const allKeys = new Set([
      ...Object.keys(beforeObj || {}),
      ...Object.keys(afterObj || {}),
    ]);

    for (const key of allKeys) {
      // Skip internal metadata fields
      if (['updatedAt', 'timestamp', 'version', '__v'].includes(key)) continue;

      const beforeVal = beforeObj ? beforeObj[key] : undefined;
      const afterVal = afterObj ? afterObj[key] : undefined;

      // Check if value changed
      const isDifferent =
        JSON.stringify(beforeVal) !== JSON.stringify(afterVal);

      if (isDifferent) {
        const isSensitive = this.isSensitiveKey(key);
        let safeBefore = beforeVal;
        let safeAfter = afterVal;

        if (isSensitive) {
          safeBefore = beforeVal ? '[REDACTED]' : undefined;
          safeAfter = afterVal ? '[REDACTED]' : undefined;
        } else {
          safeBefore = this.sanitizeData(beforeVal);
          safeAfter = this.sanitizeData(afterVal);
        }

        diffs.push({
          field: key,
          fieldLabel: this.formatFieldLabel(key),
          before: safeBefore,
          after: safeAfter,
          isSensitive,
        });
      }
    }

    return diffs;
  }

  private static formatFieldLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }

  public static maskString(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\b\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}\b/g, '[REDACTED_NPWP]')
      .replace(/\b\d{16}\b/g, '[REDACTED_NIK]')
      .replace(/(\+?62|08)[0-9]{8,12}/g, '[REDACTED_PHONE]')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  }
}

export const auditRedactionService = {
  maskEmail: AuditRedactionService.maskEmail,
  maskPhone: AuditRedactionService.maskPhone,
  maskIp: AuditRedactionService.maskIp,
  maskToken: AuditRedactionService.maskToken,
  maskString: AuditRedactionService.maskString,
  sanitizeData: AuditRedactionService.sanitizeData,
  sanitizeObject: AuditRedactionService.sanitizeObject,
  calculateSafeDiffs: AuditRedactionService.calculateSafeDiffs,
};
