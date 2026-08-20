/**
 * Fleet Intelligence Smart AI - Production Security & Hardening Configuration
 * PROMPT 59: HTTPS Strictness, Session Revocation, Cookie Directives & Data Redaction
 */

export interface SecurityConfig {
  httpsOnly: boolean;
  hstsMaxAgeSeconds: number;
  session: {
    ttlHours: number;
    idleTimeoutMinutes: number;
    rotationOnPrivilegeChange: boolean;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      path: string;
    };
  };
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
  };
  dataSanitization: {
    maskPiiInLogs: boolean;
    redactedFields: string[];
  };
}

export const securityConfig: SecurityConfig = {
  httpsOnly: true,
  hstsMaxAgeSeconds: 31536000, // 1 year
  session: {
    ttlHours: 24,
    idleTimeoutMinutes: 120,
    rotationOnPrivilegeChange: true,
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    },
  },
  passwordPolicy: {
    minLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
  },
  dataSanitization: {
    maskPiiInLogs: true,
    redactedFields: [
      'password',
      'passwordHash',
      'token',
      'apiKey',
      'secret',
      'privateKey',
      'creditCard',
      'cvv',
      'authorization',
      'cookie',
    ],
  },
};
