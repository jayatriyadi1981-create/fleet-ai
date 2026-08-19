/**
 * Fleet Intelligence Smart AI - Enterprise Authentication & Security Types
 * Multi-Tenant SaaS Fleet Security System Architecture
 */

import { UserRole, TenantCompany, UserProfile } from './index';

export type AuthStatus = 'unknown' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthSession {
  sessionId: string;
  userId: string;
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
  createdAt: number;
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  os: string;
  location: string;
  isCurrent: boolean;
  isTrustedDevice?: boolean;
}

export interface ActiveSessionItem {
  sessionId: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFIED'
  | 'OTP_VERIFIED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'SESSION_REVOKED'
  | 'INVITATION_ACCEPTED'
  | 'ACCOUNT_LOCKED';

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  title: string;
  description: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'success' | 'warning' | 'danger';
}

export interface MFAState {
  required: boolean;
  pendingUserId?: string;
  tempToken?: string;
  methodsAllowed: ('totp' | 'email_otp' | 'sms_otp')[];
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
  totpCode?: string;
  recoveryCode?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  password?: string;
  confirmPassword?: string;
  companyName: string;
  referralCode?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface VerifyOTPData {
  email: string;
  otpCode: string;
  purpose: 'login' | 'email_verification' | 'password_reset' | 'mfa';
}

export interface Setup2FAResponse {
  secretKey: string;
  provisioningUri: string;
  qrCodeUrl: string;
  recoveryCodes: string[];
}

export interface OrganizationSetupData {
  companyName: string;
  industry: string;
  fleetSize: string;
  country: string;
  timezone: string;
  currency: string;
  language: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
