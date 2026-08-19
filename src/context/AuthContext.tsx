/**
 * Fleet Intelligence Smart AI - Centralized Enterprise Auth Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthStatus,
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
} from '../types/auth';
import { UserProfile, TenantCompany, UserRole } from '../types';
import { authService } from '../services/auth/authService';

interface AuthContextType {
  status: AuthStatus;
  user: UserProfile | null;
  tenant: TenantCompany | null;
  roles: UserRole[];
  permissions: string[];
  session: AuthSession | null;
  mfaRequired: boolean;
  mfaPendingToken: string | null;
  activeSessions: ActiveSessionItem[];
  securityAuditLogs: SecurityAuditEvent[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ message: string; requiresEmailVerification: boolean }>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ message: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ message: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ message: string }>;
  sendOTP: (email: string, purpose: string) => Promise<{ message: string; cooldownSeconds: number }>;
  verifyOTP: (data: VerifyOTPData) => Promise<boolean>;
  setup2FA: () => Promise<Setup2FAResponse>;
  verify2FA: (totpCode: string) => Promise<boolean>;
  disable2FA: () => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  logoutAllSessions: () => Promise<void>;
  updateOrganization: (data: OrganizationSetupData) => Promise<void>;
  refreshSessionsAndAuditLogs: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<TenantCompany | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaPendingToken, setMfaPendingToken] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionItem[]>([]);
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshSessionsAndAuditLogs = useCallback(async () => {
    try {
      const [sessions, logs] = await Promise.all([
        authService.getActiveSessions(),
        authService.getSecurityLogs(),
      ]);
      setActiveSessions(sessions);
      setSecurityAuditLogs(logs);
    } catch {
      // Non-critical background fetch error
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await authService.getSession();
      if (res && res.session) {
        setUser(res.user);
        setTenant(res.tenant);
        setSession(res.session);
        setStatus('authenticated');
        refreshSessionsAndAuditLogs();
      } else {
        setStatus('unauthenticated');
      }
    } catch {
      setStatus('unauthenticated');
    }
  }, [refreshSessionsAndAuditLogs]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    setStatus('loading');
    try {
      const res = await authService.login(credentials);
      if (res.mfaRequired) {
        setMfaRequired(true);
        setMfaPendingToken(res.mfaToken || null);
        setStatus('unauthenticated');
        return false;
      }

      setUser(res.user);
      setTenant(res.tenant);
      setSession(res.session);
      setMfaRequired(false);
      setMfaPendingToken(null);
      setStatus('authenticated');
      refreshSessionsAndAuditLogs();
      return true;
    } catch (err: any) {
      setError(err.message || 'Email atau password tidak valid.');
      setStatus('unauthenticated');
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    try {
      const res = await authService.register(data);
      return res;
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan akun.');
      throw err;
    }
  };

  const logout = async () => {
    setStatus('loading');
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setTenant(null);
      setSession(null);
      setMfaRequired(false);
      setMfaPendingToken(null);
      setStatus('unauthenticated');
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    setError(null);
    try {
      return await authService.forgotPassword(data);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim instruksi reset password.');
      throw err;
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    setError(null);
    try {
      return await authService.resetPassword(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui password.');
      throw err;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setError(null);
    try {
      return await authService.verifyEmail(email, code);
    } catch (err: any) {
      setError(err.message || 'Gagal verifikasi email.');
      throw err;
    }
  };

  const sendOTP = async (email: string, purpose: string) => {
    setError(null);
    try {
      return await authService.sendOTP(email, purpose);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim kode OTP.');
      throw err;
    }
  };

  const verifyOTP = async (data: VerifyOTPData): Promise<boolean> => {
    setError(null);
    try {
      const res = await authService.verifyOTP(data);
      return res.verified;
    } catch (err: any) {
      setError(err.message || 'Kode OTP tidak valid.');
      throw err;
    }
  };

  const setup2FA = async (): Promise<Setup2FAResponse> => {
    setError(null);
    try {
      return await authService.setup2FA();
    } catch (err: any) {
      setError(err.message || 'Gagal menyiapkan 2FA.');
      throw err;
    }
  };

  const verify2FA = async (totpCode: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await authService.verify2FA(totpCode);
      refreshSessionsAndAuditLogs();
      return res.verified;
    } catch (err: any) {
      setError(err.message || 'Kode 2FA tidak valid.');
      throw err;
    }
  };

  const disable2FA = async () => {
    setError(null);
    try {
      await authService.disable2FA();
      refreshSessionsAndAuditLogs();
    } catch (err: any) {
      setError(err.message || 'Gagal menonaktifkan 2FA.');
      throw err;
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    setError(null);
    try {
      await authService.changePassword(currentPass, newPass);
      refreshSessionsAndAuditLogs();
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah password.');
      throw err;
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await authService.revokeSession(sessionId);
      refreshSessionsAndAuditLogs();
    } catch (err: any) {
      setError(err.message || 'Gagal menghentikan sesi.');
      throw err;
    }
  };

  const logoutAllSessions = async () => {
    try {
      await authService.revokeAllSessions();
      refreshSessionsAndAuditLogs();
    } catch (err: any) {
      setError(err.message || 'Gagal menghentikan semua sesi.');
      throw err;
    }
  };

  const updateOrganization = async (data: OrganizationSetupData) => {
    try {
      const updatedTenant = await authService.updateOrganization(data);
      setTenant(updatedTenant);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil perusahaan.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin' || user.role === 'company_admin';
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    return user.role === role || user.role === 'super_admin';
  };

  const roles = user ? [user.role] : [];
  const permissions = user ? user.permissions : [];

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        tenant,
        roles,
        permissions,
        session,
        mfaRequired,
        mfaPendingToken,
        activeSessions,
        securityAuditLogs,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        error,

        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        sendOTP,
        verifyOTP,
        setup2FA,
        verify2FA,
        disable2FA,
        changePassword,
        revokeSession,
        logoutAllSessions,
        updateOrganization,
        refreshSessionsAndAuditLogs,
        clearError,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
