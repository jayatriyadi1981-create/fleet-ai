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
  loginWithSSO(provider: 'google' | 'microsoft'): Promise<AuthResponse>;
  loginWithOTP(email: string, otpCode: string): Promise<AuthResponse>;
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
  forceLogoutUser(userId: string): Promise<{ message: string }>;
  changePassword(currentPass: string, newPass: string): Promise<{ message: string }>;
  getSecurityLogs(): Promise<SecurityAuditEvent[]>;
  updateOrganization(data: OrganizationSetupData): Promise<TenantCompany>;
  inviteTeamMember(email: string, role: UserRole): Promise<{ invitationToken: string; expiresAt: string }>;
}

const STORAGE_SESSION_KEY = 'fleet_ai_auth_session_v1';
const STORAGE_USER_KEY = 'fleet_ai_auth_user_v1';
const STORAGE_2FA_KEY = 'fleet_ai_auth_2fa_enabled_v1';

export const DEMO_ROLE_ACCOUNTS: Record<string, { name: string; role: UserRole; dept: string; branch: string; email: string }> = {
  'super_admin@fleet-demo.local': {
    name: 'Bambang Pratama',
    role: 'super_admin',
    dept: 'Platform Infrastructure & Security',
    branch: 'Kantor Pusat Jakarta',
    email: 'super_admin@fleet-demo.local',
  },
  'owner@fleet-demo.local': {
    name: 'Hendra Kusuma',
    role: 'company_owner',
    dept: 'Direksi & Pemilik Perusahaan',
    branch: 'Kantor Pusat Jakarta',
    email: 'owner@fleet-demo.local',
  },
  'admin@fleet-demo.local': {
    name: 'Budi Santoso',
    role: 'company_admin',
    dept: 'Operasional & Tata Kelola Tenant',
    branch: 'Kantor Pusat Jakarta',
    email: 'admin@fleet-demo.local',
  },
  'manager@fleet-demo.local': {
    name: 'Rudi Hermawan',
    role: 'fleet_manager',
    dept: 'Manajemen Armada & Telematika',
    branch: 'Kantor Pusat Jakarta',
    email: 'manager@fleet-demo.local',
  },
  'ops@fleet-demo.local': {
    name: 'Dimas Wicaksono',
    role: 'operations_manager',
    dept: 'Operasional & Rute Pengiriman',
    branch: 'Cabang Surabaya',
    email: 'ops@fleet-demo.local',
  },
  'dispatcher@fleet-demo.local': {
    name: 'Agus Setiawan',
    role: 'dispatcher',
    dept: 'Dispatch & Surat Jalan',
    branch: 'Cabang Surabaya',
    email: 'dispatcher@fleet-demo.local',
  },
  'supervisor@fleet-demo.local': {
    name: 'Joko Susilo',
    role: 'supervisor',
    dept: 'Pengawasan Lapangan & HSE',
    branch: 'Cabang Medan',
    email: 'supervisor@fleet-demo.local',
  },
  'driver@fleet-demo.local': {
    name: 'Bambang Sudirman',
    role: 'driver',
    dept: 'Pengemudi Armada (B 9022 UXZ)',
    branch: 'Cabang Semarang',
    email: 'driver@fleet-demo.local',
  },
  'maint@fleet-demo.local': {
    name: 'Eko Prasetyo',
    role: 'maintenance',
    dept: 'Bengkel & Pemeliharaan Armada',
    branch: 'Cabang Surabaya',
    email: 'maint@fleet-demo.local',
  },
  'finance@fleet-demo.local': {
    name: 'Rina Wijaya',
    role: 'finance',
    dept: 'Keuangan, TCO & Anggaran BBM',
    branch: 'Kantor Pusat Jakarta',
    email: 'finance@fleet-demo.local',
  },
  'hr@fleet-demo.local': {
    name: 'Maya Safitri',
    role: 'hr',
    dept: 'Human Resources & Kepatuhan SIM',
    branch: 'Kantor Pusat Jakarta',
    email: 'hr@fleet-demo.local',
  },
  'viewer@fleet-demo.local': {
    name: 'Kevin Adrian',
    role: 'viewer',
    dept: 'Audit & Pengawasan Read-Only',
    branch: 'Kantor Pusat Jakarta',
    email: 'viewer@fleet-demo.local',
  },
};

export class MockAuthProvider implements IAuthProvider {
  private loginAttemptsCount = 0;
  private lockoutUntil: number | null = null;
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
    await new Promise((res) => setTimeout(res, 400));

    // Account Lockout check (5 failed attempts = 5 min lockout)
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      const remainingSeconds = Math.ceil((this.lockoutUntil - Date.now()) / 1000);
      throw new Error(`Akun terkunci sementara demi keamanan karena terlalu banyak percobaan gagal. Silakan coba kembali dalam ${remainingSeconds} detik.`);
    }

    if (!credentials.email || !credentials.email.includes('@')) {
      this.handleFailedLogin('Format email tidak valid', credentials.email || 'unknown');
      throw new Error('Email atau password tidak valid.');
    }

    // Role preset selection from the 12 default roles
    const matchedAccount = DEMO_ROLE_ACCOUNTS[credentials.email.toLowerCase()];
    if (matchedAccount) {
      this.mockUser = {
        ...this.mockUser,
        id: 'u-' + matchedAccount.role,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        department: matchedAccount.dept,
      };
    } else {
      // Generic fallback
      this.mockUser = {
        ...this.mockUser,
        id: 'u-101',
        name: credentials.email.split('@')[0],
        email: credentials.email,
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
        this.handleFailedLogin('Kode 2FA salah', credentials.email);
        throw new Error('Kode OTP / TOTP tidak valid. Masukkan 6 digit angka yang sesuai.');
      }
    }

    // Reset login attempts on success
    this.loginAttemptsCount = 0;
    this.lockoutUntil = null;

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
      os: 'Windows 11 Enterprise',
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
      description: `User ${this.mockUser.name} (${this.mockUser.role}) berhasil masuk`,
      ipAddress: '182.253.112.44',
      device: 'Chrome / Windows 11',
      location: 'Jakarta, Indonesia',
      status: 'success',
    });

    return {
      user: this.mockUser,
      tenant: this.mockTenant,
      session: newSession,
    };
  }

  async loginWithSSO(provider: 'google' | 'microsoft'): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 500));

    const ssoEmail = provider === 'google' ? 'budi.santoso@gmail.com' : 'budi.santoso@outlook.com';
    this.mockUser = {
      ...this.mockUser,
      id: `u-sso-${provider}`,
      name: 'Budi Santoso (SSO)',
      email: ssoEmail,
      role: 'company_admin',
      department: 'Eksekutif & Manajemen',
    };

    const newSession: AuthSession = {
      sessionId: 'sess_sso_' + Math.random().toString(36).substring(2, 9),
      userId: this.mockUser.id,
      tenantId: this.mockTenant.id,
      accessToken: `sso_${provider}_tok_` + Date.now(),
      refreshToken: `sso_${provider}_ref_` + Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      createdAt: Date.now(),
      ipAddress: '182.253.112.44',
      userAgent: navigator.userAgent,
      deviceType: 'desktop',
      browser: 'Chrome 122.0',
      os: 'Windows 11 Enterprise',
      location: 'Jakarta, Indonesia',
      isCurrent: true,
      isTrustedDevice: true,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(this.mockUser));

    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN_SUCCESS',
      title: `Login SSO ${provider === 'google' ? 'Google Workspace' : 'Microsoft 365'} Berhasil`,
      description: `Autentikasi OAuth Single Sign-On berhasil via ${provider.toUpperCase()}`,
      ipAddress: '182.253.112.44',
      device: 'Chrome / Windows 11',
      location: 'Jakarta, Indonesia',
      status: 'success',
    });

    return {
      user: this.mockUser,
      tenant: this.mockTenant,
      session: newSession,
    };
  }

  async loginWithOTP(email: string, otpCode: string): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 500));

    if (otpCode.length !== 6) {
      throw new Error('Kode OTP harus 6 digit angka.');
    }

    const matchedAccount = DEMO_ROLE_ACCOUNTS[email.toLowerCase()];
    if (matchedAccount) {
      this.mockUser = {
        ...this.mockUser,
        id: 'u-' + matchedAccount.role,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        department: matchedAccount.dept,
      };
    } else {
      this.mockUser = {
        ...this.mockUser,
        id: 'u-otp-user',
        name: email.split('@')[0],
        email: email,
        role: 'fleet_manager',
      };
    }

    const newSession: AuthSession = {
      sessionId: 'sess_otp_' + Math.random().toString(36).substring(2, 9),
      userId: this.mockUser.id,
      tenantId: this.mockTenant.id,
      accessToken: 'jwt_acc_otp_' + Date.now(),
      refreshToken: 'jwt_ref_otp_' + Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
      createdAt: Date.now(),
      ipAddress: '182.253.112.44',
      userAgent: navigator.userAgent,
      deviceType: 'desktop',
      browser: 'Chrome 122.0',
      os: 'Windows 11',
      location: 'Jakarta, Indonesia',
      isCurrent: true,
      isTrustedDevice: false,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(this.mockUser));

    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN_SUCCESS',
      title: 'Login OTP Berhasil',
      description: `Autentikasi kode OTP email berhasil untuk ${email}`,
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

  private handleFailedLogin(reason: string, email: string) {
    this.loginAttemptsCount += 1;
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN_FAILED',
      title: 'Percobaan Login Gagal',
      description: `Gagal login untuk ${email} - Alasan: ${reason} (Percobaan ${this.loginAttemptsCount}/5)`,
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'danger',
    });

    if (this.loginAttemptsCount >= 5) {
      this.lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minute lockout
      this.securityLogs.unshift({
        id: 'log-lockout-' + Date.now(),
        timestamp: new Date().toISOString(),
        eventType: 'SUSPICIOUS_ACTIVITY',
        title: 'Akun Terkunci (Account Lockout)',
        description: `Batas 5 kali kesalahan login terlampaui. Akun ditangguhkan selama 5 menit.`,
        ipAddress: '182.253.112.44',
        device: 'Chrome Browser',
        location: 'Jakarta, Indonesia',
        status: 'danger',
      });
    }
  }

  async register(data: RegisterData): Promise<{ message: string; requiresEmailVerification: boolean }> {
    await new Promise((res) => setTimeout(res, 600));

    if (!data.fullName || !data.email || !data.password || !data.companyName) {
      throw new Error('Harap lengkapi semua bidang yang wajib diisi.');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Password dan Konfirmasi Password tidak cocok.');
    }

    // Password Policy Check: Min 8 chars, 1 number, 1 uppercase
    if (data.password.length < 8) {
      throw new Error('Password minimal 8 karakter.');
    }
    if (!/[A-Z]/.test(data.password)) {
      throw new Error('Password harus mengandung minimal satu huruf besar (A-Z).');
    }
    if (!/[0-9]/.test(data.password)) {
      throw new Error('Password harus mengandung minimal satu angka (0-9).');
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
      message: 'Jika alamat email terdaftar, instruksi reset password dan tautan pemulihan telah dikirim ke kotak masuk Anda.',
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
    if (data.newPassword.length < 8) {
      throw new Error('Password baru harus minimal 8 karakter.');
    }
    return {
      message: 'Password berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.',
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
      message: 'Kode OTP 6-digit rahasia telah dikirim ke email ' + email + ' (Tujuan: ' + purpose + ')',
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
      description: 'Dua faktor autentikasi TOTP Authenticator App berhasil dikonfigurasi',
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
      description: `Sesi perangkat ${sessionId} dihentikan secara paksa oleh administrator`,
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'warning',
    });

    return { message: 'Sesi perangkat berhasil dihentikan (Force Logout).' };
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    this.activeSessions = this.activeSessions.filter((s) => s.isCurrent);
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'SESSION_REVOKED',
      title: 'Semua Sesi Lain Dihentikan',
      description: 'Force logout dieksekusi untuk seluruh perangkat aktif selain perangkat ini',
      ipAddress: '182.253.112.44',
      device: 'Chrome Browser',
      location: 'Jakarta, Indonesia',
      status: 'warning',
    });
    return { message: 'Semua sesi perangkat lain telah berhasil dihentikan.' };
  }

  async forceLogoutUser(userId: string): Promise<{ message: string }> {
    this.securityLogs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'SESSION_REVOKED',
      title: 'Force Logout Pengguna',
      description: `Administrator memaksa logout seluruh sesi untuk user ID: ${userId}`,
      ipAddress: '182.253.112.44',
      device: 'Security Console',
      location: 'Jakarta, Indonesia',
      status: 'danger',
    });
    return { message: `Seluruh sesi aktif untuk user ${userId} telah diputus secara paksa.` };
  }

  async changePassword(currentPass: string, newPass: string): Promise<{ message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    if (!currentPass) {
      throw new Error('Kata sandi saat ini harus diisi.');
    }
    if (newPass.length < 8) {
      throw new Error('Kata sandi baru harus minimal 8 karakter.');
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
