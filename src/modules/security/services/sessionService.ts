/**
 * Fleet Intelligence Smart AI - Enterprise Secure Session Management Service
 * PROMPT 50 - Session Rotation, Expiration, Multi-Device Tracking & Revocation
 */

import { ActiveUserSession } from '../types/securityTypes';
import { encryptionService } from './encryptionService';
import { auditService } from '../../audit/services/auditService';

export class SessionService {
  private static instance: SessionService;
  private sessions: Map<string, ActiveUserSession> = new Map();
  private currentSessionId: string = 'sess_curr_desktop_01';

  private constructor() {
    this.seedInitialSessions();
  }

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  private seedInitialSessions(): void {
    const now = new Date();
    const mockSessions: ActiveUserSession[] = [
      {
        sessionId: 'sess_curr_desktop_01',
        userId: 'usr_super_01',
        tenantId: 'tenant_default',
        userName: 'Bambang Pratama, S.T.',
        userEmail: 'bambang.pratama@fleetintelligence.id',
        role: 'super_admin',
        ipAddress: '103.28.12.94',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0.0.0',
        deviceType: 'DESKTOP',
        browser: 'Chrome 128.0 (macOS)',
        os: 'macOS Sonoma',
        locationCity: 'Jakarta Selatan',
        locationCountry: 'Indonesia',
        createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
        lastActivityAt: new Date(now.getTime() - 2 * 60000).toISOString(),
        expiresAt: new Date(now.getTime() + 8 * 3600000).toISOString(),
        isCurrent: true,
        status: 'ACTIVE',
      },
      {
        sessionId: 'sess_mob_android_02',
        userId: 'usr_super_01',
        tenantId: 'tenant_default',
        userName: 'Bambang Pratama, S.T.',
        userEmail: 'bambang.pratama@fleetintelligence.id',
        role: 'super_admin',
        ipAddress: '180.252.164.12',
        userAgent: 'FleetDriverMobile/2.4 (Android 14; Samsung Galaxy S24)',
        deviceType: 'MOBILE',
        browser: 'Fleet Mobile PWA',
        os: 'Android 14',
        locationCity: 'Bandung',
        locationCountry: 'Indonesia',
        createdAt: new Date(now.getTime() - 4 * 3600000).toISOString(),
        lastActivityAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        expiresAt: new Date(now.getTime() + 4 * 3600000).toISOString(),
        isCurrent: false,
        status: 'ACTIVE',
      },
      {
        sessionId: 'sess_ops_jakarta_03',
        userId: 'usr_mgr_01',
        tenantId: 'tenant_default',
        userName: 'Siti Nurhaliza',
        userEmail: 'siti.nurhaliza@fleetintelligence.id',
        role: 'fleet_manager',
        ipAddress: '114.122.45.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/127.0.0.0',
        deviceType: 'DESKTOP',
        browser: 'Edge 127.0 (Windows)',
        os: 'Windows 11 Pro',
        locationCity: 'Surabaya',
        locationCountry: 'Indonesia',
        createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
        lastActivityAt: new Date(now.getTime() - 5 * 60000).toISOString(),
        expiresAt: new Date(now.getTime() + 6 * 3600000).toISOString(),
        isCurrent: false,
        status: 'ACTIVE',
      },
      {
        sessionId: 'sess_drv_04',
        userId: 'usr_drv_09',
        tenantId: 'tenant_default',
        userName: 'Agus Santoso',
        userEmail: 'agus.santoso@driver.fleet.id',
        role: 'driver',
        ipAddress: '182.1.204.33',
        userAgent: 'FleetDriverMobile/2.4 (iOS 17.5; iPhone 15 Pro)',
        deviceType: 'MOBILE',
        browser: 'Driver App iOS',
        os: 'iOS 17.5',
        locationCity: 'Semarang',
        locationCountry: 'Indonesia',
        createdAt: new Date(now.getTime() - 6 * 3600000).toISOString(),
        lastActivityAt: new Date(now.getTime() - 8 * 60000).toISOString(),
        expiresAt: new Date(now.getTime() + 2 * 3600000).toISOString(),
        isCurrent: false,
        status: 'ACTIVE',
      },
    ];

    mockSessions.forEach((s) => this.sessions.set(s.sessionId, s));
  }

  /**
   * Get all active sessions for a tenant (or global for super admin)
   */
  public getActiveSessions(tenantId?: string): ActiveUserSession[] {
    const list = Array.from(this.sessions.values());
    if (tenantId && tenantId !== 'tenant_default') {
      return list.filter((s) => s.tenantId === tenantId && s.status === 'ACTIVE');
    }
    return list.filter((s) => s.status === 'ACTIVE');
  }

  /**
   * Get current active session
   */
  public getCurrentSession(): ActiveUserSession | undefined {
    return this.sessions.get(this.currentSessionId);
  }

  /**
   * Create a new secure session upon login
   */
  public createSession(params: {
    userId: string;
    tenantId: string;
    userName: string;
    userEmail: string;
    role: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'API_CLIENT';
  }): ActiveUserSession {
    const sessionId = `sess_${encryptionService.generateSecureRandomHex(12)}`;
    const now = new Date();
    const session: ActiveUserSession = {
      sessionId,
      userId: params.userId,
      tenantId: params.tenantId,
      userName: params.userName,
      userEmail: params.userEmail,
      role: params.role as any,
      ipAddress: params.ipAddress || '103.28.12.94',
      userAgent: params.userAgent || navigator?.userAgent || 'Browser Client',
      deviceType: params.deviceType || 'DESKTOP',
      browser: 'Chrome 128.0 (macOS)',
      os: 'macOS Sonoma',
      locationCity: 'Jakarta',
      locationCountry: 'Indonesia',
      createdAt: now.toISOString(),
      lastActivityAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 8 * 3600000).toISOString(), // 8 hours absolute
      isCurrent: true,
      status: 'ACTIVE',
    };

    // Mark previous current session as not current
    if (this.currentSessionId && this.sessions.has(this.currentSessionId)) {
      const prev = this.sessions.get(this.currentSessionId)!;
      prev.isCurrent = false;
    }

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;

    auditService.logSecurityEvent({
      tenantId: session.tenantId,
      action: 'LOGIN_SUCCESS',
      actor: {
        actorId: session.userId,
        actorType: 'USER',
        actorEmail: session.userEmail,
        actorName: session.userName,
        actorRole: session.role,
        tenantId: session.tenantId,
      },
      severity: 'LOW',
      description: `User authenticated and established active session [${sessionId}]`,
      securityMetadata: {
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        authMethod: 'PASSWORD_2FA',
        isSuspicious: false,
      },
    });

    return session;
  }

  /**
   * Session Rotation (prevents session fixation after privilege or password change)
   */
  public rotateSession(oldSessionId: string, reason: string): ActiveUserSession {
    const old = this.sessions.get(oldSessionId);
    if (!old) throw new Error('Session not found for rotation');

    const newSessionId = `sess_${encryptionService.generateSecureRandomHex(12)}`;
    const now = new Date();
    const newSession: ActiveUserSession = {
      ...old,
      sessionId: newSessionId,
      createdAt: now.toISOString(),
      lastActivityAt: now.toISOString(),
      isCurrent: old.isCurrent,
      status: 'ACTIVE',
    };

    // Revoke old session
    old.status = 'REVOKED';
    this.sessions.set(oldSessionId, old);
    this.sessions.set(newSessionId, newSession);

    if (this.currentSessionId === oldSessionId) {
      this.currentSessionId = newSessionId;
    }

    auditService.logSecurityEvent({
      tenantId: old.tenantId,
      action: 'SESSION_REVOKED',
      actor: {
        actorId: old.userId,
        actorType: 'USER',
        actorEmail: old.userEmail,
        actorName: old.userName,
        actorRole: old.role,
        tenantId: old.tenantId,
      },
      severity: 'LOW',
      description: `Rotated session from ${oldSessionId} to ${newSessionId}. Reason: ${reason}`,
      securityMetadata: {
        ipAddress: old.ipAddress,
        userAgent: old.userAgent,
        isSuspicious: false,
      },
    });

    return newSession;
  }

  /**
   * Revoke a single session
   */
  public revokeSession(sessionId: string, revokedBy: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = 'REVOKED';
    this.sessions.set(sessionId, session);

    auditService.logSecurityEvent({
      tenantId: session.tenantId,
      action: 'SESSION_REVOKED',
      actor: {
        actorId: revokedBy,
        actorType: 'ADMIN',
        actorEmail: session.userEmail,
        tenantId: session.tenantId,
      },
      severity: 'MEDIUM',
      description: `Session ${sessionId} was revoked by ${revokedBy}`,
      securityMetadata: {
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isSuspicious: false,
      },
    });

    return true;
  }

  /**
   * Revoke all sessions for a user EXCEPT the current session
   */
  public revokeAllOtherSessions(userId: string, keepSessionId: string): number {
    let count = 0;
    this.sessions.forEach((sess) => {
      if (sess.userId === userId && sess.sessionId !== keepSessionId && sess.status === 'ACTIVE') {
        sess.status = 'REVOKED';
        count++;
      }
    });

    auditService.logSecurityEvent({
      tenantId: 'tenant_default',
      action: 'SESSION_REVOKED',
      actor: {
        actorId: userId,
        actorType: 'USER',
        tenantId: 'tenant_default',
      },
      severity: 'MEDIUM',
      description: `Revoked ${count} other active device sessions for user ${userId}`,
    });

    return count;
  }
}

export const sessionService = SessionService.getInstance();
