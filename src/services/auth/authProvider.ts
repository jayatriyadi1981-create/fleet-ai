/**
 * Fleet Intelligence Smart AI - Enterprise Auth Provider Pattern
 * Supports Mock Mode for local development & Seamless Provider Replacement (REST, Firebase, Supabase, OAuth)
 */

import {
  AuthSession,
  ActiveSessionItem,
  SecurityAuditEvent,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyOTPData,
  Setup2FAResponse,
  OrganizationSetupData,
} from '../../types/auth';
import { UserProfile, TenantCompany, UserRole } from '../../types';
import { generateMockRecoveryCodes } from '../../utils/authUtils';

export interface AuthResponse {
  user: UserProfile;
  tenant: TenantCompany;
  session: AuthSession;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface IAuthProvider {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<{ message: string; requiresEmailVerification: boolean }>;
  logout(): Promise<void>;
  getSession(): Promise<AuthResponse | null>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  forgotPassword(data: ForgotPasswordData): Promise<{ message: string }>;
  resetPassword(data: ResetPasswordData): Promise<{ message: string }>;
  verifyEmail(email: string, code: string): Promise<{ message: string }>;
  sendOTP(email: string, purpose: string): Promise<{ message: string; cooldownSeconds: number }>;
  verifyOTP(data: VerifyOTPData): Promise<{ message: string; verified: boolean }>;
  setup2FA(): Promise<Setup2FAResponse>;
  verify2FA(totpCode: string): Promise<{ verified: boolean }>;
  disable2FA(): Promise<{ message: string }>;
  getActiveSessions(): Promise<ActiveSessionItem[]>;
  revokeSession(sessionId: string): Promise<{ message: string }>;
  revokeAllSessions(): Promise<{ message: string }>;
  changePassword(currentPass: string, newPass: string): Promise<{ message: string }>;
  getSecurityLogs(): Promise<SecurityAuditEvent[]>;
  updateOrganization(data: OrganizationSetupData): Promise<TenantCompany>;
  inviteTeamMember(email: string, role: UserRole): Promise<{ invitationToken: string; expiresAt: string }>;
}

const STORAGE_SESSION_KEY = 'fleet_ai_auth_session_v1';
const STORAGE_USER_KEY = 'fleet_ai_auth_user_v1';
const STORAGE_2FA_KEY = 'fleet_ai_auth_2fa_enabled_v1';

export class MockAuthProvider implements IAuthProvider {
  private loginAttemptsCount = 0;
  private isTwoFactorEnabled = false;
  private currentTotpSecret = 'JBSWY3DPEHPK3PXP';

  private mockTenant: TenantCompany = {
    id: 't-001',
    name: 'PT Trans Logistik Nusantara',
    code: 'TLN',
    taxIdNpwp: '01.234.567.8-012.000',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
    phone: '+62 21 555 8900',
    email: 'admin@translogistik.co.id',
    branchesCount: 4,
    vehiclesCount: 48,
    subscriptionPlan: 'Enterprise',
    status: 'active',
  };

  private mockUser: UserProfile = {
    id: 'u-101',
    tenantId: 't-001',
    branchId: 'b-01',
    name: 'Budi Santoso',
    email: 'admin@fleet-demo.local',
    role: 'company_admin',
    phone: '+62 812 9000 1234',
    department: 'Operasional & Logistik',
    permissions: [
      'fleet.view',
      'fleet.create',
      'fleet.update',
      'vehicle.view',
      'vehicle.create',
      'vehicle.update',
      'driver.view',
      'driver.manage',
      'fuel.view',
      'maintenance.view',
      'safety.view',
      'reports.view',
      'reports.export',
      'ai.use',
      'security.manage',
    ],
  };

  private activeSessions: ActiveSessionItem[] = [
    {
      sessionId: 'sess-curr-1001',
      deviceName: 'Dell XPS 15 (Chrome)',
      browser: 'Chrome 122.0',
      os: 'Windows 11 Enterprise',
      ipAddress: '182.253.112.44',
      location: 'Jakarta, Indonesia',
      lastActive: 'Aktif saat ini',
      isCurrent: true,
    },
    {
      sessionId: 'sess-mob-2002',
      deviceName: 'Samsung Galaxy S24 Ultra (App)',
      browser: 'FleetAI Mobile 2.4.0',
      os: 'Android 14',
      ipAddress: '114.122.45.18',
      location: 'Surabaya, Indonesia',
      lastActive: '2 jam yang lalu',
      isCurrent: false,
    },
    {
      sessionId: 'sess-tab-3003',
      deviceName: 'iPad Pro 12.9 (Safari)',
      browser: 'Mobile Safari 17.2',
      os: 'iPadOS 17.2',
      ipAddress: '180.252.88.10',
      location: 'Bandung, Indonesia',
      lastActive: 'Kemarin, 16:20',
      isCurrent: false,
    },
  ];

  private securityLogs: SecurityAuditEvent[] = [
    {
      id: 'log-01',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      eventType: 'LOGIN_SUCCESS',
      title: 'Login Berhasil',
      description: 'Berhasil autentikasi menggunakan email dan password',
      ipAddress: '182.253.112.44',
      device: 'Chrome / Windows 11',
      location: 'Jakarta, Indonesia',
      status: 'success',
    },
    {
      id: 'log-02',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      eventType: 'PASSWORD_CHANGED',
      title: 'Kata Sandi Diperbarui',
      description: 'Kata sandi berhasil diperbarui oleh pengguna',
      ipAddress: '182.253.112.44',
      device: 'Chrome / Windows 11',
      location: 'Jakarta, Indonesia',
      status: 'success',
    },
    {
      id: 'log-03',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      eventType: 'MFA_ENABLED',
      title: 'Aktivasi Autentikasi Dua Faktor (2FA)',
      description: 'Pengguna mengaktifkan TOTP Authenticator App',
      ipAddress: '182.253.112.44',
      device: 'Chrome / Windows 11',
      location: 'Jakarta, Indonesia',
      status: 'success',
    },
  ];

  constructor() {
    const is2faStored = localStorage.getItem(STORAGE_2FA_KEY);
    if (is2faStored === 'true') {
      this.isTwoFactorEnabled = true;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 500));

    // Rate Limiting Check
    if (this.loginAttemptsCount >= 5) {
      throw new Error('Terlalu banyak percobaan login. Silakan coba lagi beberapa saat lagi.');
    }

    if (!credentials.email || !credentials.email.includes('@')) {
      this.loginAttemptsCount += 1;
      throw new Error('Email atau password tidak valid.');
    }

    // Role preset selection helper
    if (credentials.email === 'manager@fleet-demo.local') {
      this.mockUser = {
        ...this.mockUser,
        id: 'u-102',
        name: 'Rudi Hermawan',
        email: 'manager@fleet-demo.local',
        role: 'fleet_manager',
      };
    } else {
      this.mockUser = {
        ...this.mockUser,
        id: 'u-101',
        name: 'Budi Santoso',
        email: 'admin@fleet-demo.local',
        role: 'company_admin',
      };
    }

    // 2FA requirement simulation if enabled
    if (this.isTwoFactorEnabled && !credentials.totpCode && !credentials.recoveryCode) {
      return {
        user: this.mockUser,
        tenant: this.mockTenant,
        session: null as any,
        mfaRequired: true,
        mfaToken: 'mfa_temp_token_' + Date.now(),
      };
    }

    // Verify 2FA code if submitted
    if (this.isTwoFactorEnabled && credentials.totpCode) {
      if (credentials.totpCode.length !== 6) {
        throw new Error('Kode OTP / TOTP tidak valid.');
      }
    }

    this.loginAttemptsCount = 0;

    const newSession: AuthSession = {
      sessionId: 'sess_' + Math.random().toString(36).substring(2, 9),
      userId: this.mockUser.id,
      tenantId: this.mockTenant.id,
      accessToken: 'jwt_acc_' + Math.random().toString(36).substring(2, 12),
      refreshToken: 'jwt_ref_' + Math.random().toString(36).substring(2, 12),
      expiresAt: Date.now() + (credentials.rememberMe ? 1000 * 60 * 60 * 24 * 14 : 1000 * 60 * 60 * 8),
      createdAt: Date.now(),
      ipAddress: '182.253.112.44',
      userAgent: navigator.userAgent,
      deviceType: 'desktop',
      browser: 'Chrome 122.0',
      os: 'Windows 11',
      location: 'Jakarta, Indonesia',
      isCurrent: true,
      isTrustedDevice: credentials.rememberMe ?? false,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(this.mockUser));

    // Audit log
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN_SUCCESS',
      title: 'Login Berhasil',
      description: `User ${this.mockUser.email} berhasil masuk`,
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'success',
    });

    return {
      user: this.mockUser,
      tenant: this.mockTenant,
      session: newSession,
    };
  }

  async register(data: RegisterData): Promise<{ message: string; requiresEmailVerification: boolean }> {
    await new Promise((res) => setTimeout(res, 600));

    if (!data.fullName || !data.email || !data.password || !data.companyName) {
      throw new Error('Harap lengkapi semua bidang yang wajib diisi.');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Password dan Konfirmasi Password tidak cocok.');
    }

    this.mockTenant.name = data.companyName;
    this.mockUser.name = data.fullName;
    this.mockUser.email = data.email;

    return {
      message: 'Registrasi berhasil. Instruksi verifikasi telah dikirim ke email Anda.',
      requiresEmailVerification: true,
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'LOGOUT',
      title: 'Logout',
      description: 'Pengguna keluar dari aplikasi',
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'success',
    });
  }

  async getSession(): Promise<AuthResponse | null> {
    const sessionStr = localStorage.getItem(STORAGE_SESSION_KEY);
    const userStr = localStorage.getItem(STORAGE_USER_KEY);

    if (!sessionStr || !userStr) {
      return null;
    }

    try {
      const session: AuthSession = JSON.parse(sessionStr);
      const user: UserProfile = JSON.parse(userStr);

      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        return null;
      }

      return {
        user,
        tenant: this.mockTenant,
        session,
      };
    } catch {
      return null;
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthSession> {
    const existing = await this.getSession();
    if (!existing) throw new Error('Session expired');

    const updatedSession: AuthSession = {
      ...existing.session,
      accessToken: 'jwt_acc_refreshed_' + Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedSession));
    return updatedSession;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    return {
      message: 'Jika alamat email terdaftar, instruksi reset password telah dikirim ke kotak masuk Anda.',
    };
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 600));
    if (!data.token) {
      throw new Error('Token reset password tidak valid atau telah kedaluwarsa.');
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Password baru dan konfirmasi password tidak cocok.');
    }
    return {
      message: 'Password berhasil diperbarui. Silakan masuk menggunakan password baru Anda.',
    };
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    return {
      message: 'Email berhasil diverifikasi.',
    };
  }

  async sendOTP(email: string, purpose: string): Promise<{ message: string; cooldownSeconds: number }> {
    await new Promise((res) => setTimeout(res, 400));
    return {
      message: 'Kode OTP 6-digit telah dikirim ke email ' + email,
      cooldownSeconds: 45,
    };
  }

  async verifyOTP(data: VerifyOTPData): Promise<{ message: string; verified: boolean }> {
    await new Promise((res) => setTimeout(res, 500));
    if (data.otpCode === '000000') {
      throw new Error('Kode OTP tidak valid.');
    }
    return {
      message: 'Verifikasi OTP berhasil.',
      verified: true,
    };
  }

  async setup2FA(): Promise<Setup2FAResponse> {
    await new Promise((res) => setTimeout(res, 400));
    const recoveryCodes = generateMockRecoveryCodes();
    const secretKey = 'JBSWY3DPEHPK3PXP';
    const provisioningUri = `otpauth://totp/FleetAI:${encodeURIComponent(this.mockUser.email)}?secret=${secretKey}&issuer=FleetAI`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(provisioningUri)}`;

    return {
      secretKey,
      provisioningUri,
      qrCodeUrl,
      recoveryCodes,
    };
  }

  async verify2FA(totpCode: string): Promise<{ verified: boolean }> {
    await new Promise((res) => setTimeout(res, 500));
    if (totpCode.length !== 6) {
      throw new Error('Kode autentikasi 2FA harus 6 digit angka.');
    }
    this.isTwoFactorEnabled = true;
    localStorage.setItem(STORAGE_2FA_KEY, 'true');

    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'MFA_ENABLED',
      title: '2FA Diaktifkan',
      description: 'Dua faktor autentikasi berhasil dikonfigurasi',
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'success',
    });

    return { verified: true };
  }

  async disable2FA(): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 400));
    this.isTwoFactorEnabled = false;
    localStorage.removeItem(STORAGE_2FA_KEY);

    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'MFA_DISABLED',
      title: '2FA Dinonaktifkan',
      description: 'Dua faktor autentikasi telah dinonaktifkan',
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'warning',
    });

    return { message: 'Autentikasi dua faktor berhasil dinonaktifkan.' };
  }

  async getActiveSessions(): Promise<ActiveSessionItem[]> {
    return this.activeSessions;
  }

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    this.activeSessions = this.activeSessions.filter((s) => s.sessionId !== sessionId);
    
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'SESSION_REVOKED',
      title: 'Sesi Dihentikan',
      description: `Sesi ${sessionId} dihentikan secara manual`,
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'warning',
    });

    return { message: 'Sesi berhasil dihentikan.' };
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    this.activeSessions = this.activeSessions.filter((s) => s.isCurrent);
    return { message: 'Semua sesi lain telah berhasil dihentikan.' };
  }

  async changePassword(currentPass: string, newPass: string): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    if (!currentPass) {
      throw new Error('Kata sandi saat ini harus diisi.');
    }
    return { message: 'Kata sandi berhasil diperbarui.' };
  }

  async getSecurityLogs(): Promise<SecurityAuditEvent[]> {
    return this.securityLogs;
  }

  async updateOrganization(data: OrganizationSetupData): Promise<TenantCompany> {
    this.mockTenant = {
      ...this.mockTenant,
      name: data.companyName,
    };
    return this.mockTenant;
  }

  async inviteTeamMember(email: string, role: UserRole): Promise<{ invitationToken: string; expiresAt: string }> {
    await new Promise((res) => setTimeout(res, 400));
    return {
      invitationToken: 'inv_' + Math.random().toString(36).substring(2, 10),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    };
  }
}
