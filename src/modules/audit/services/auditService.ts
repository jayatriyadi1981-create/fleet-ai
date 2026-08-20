/**
 * Fleet Intelligence Smart AI - Central Enterprise Audit Service
 * PROMPT 49 - Unified Centralized Security, Compliance, Observability & Immutability Layer
 */

import {
  AuditEvent,
  AuditFilter,
  AuditStatsSummary,
  AuditRetentionPolicy,
  ActorInfo,
  ActionCategory,
  ActionType,
  SecuritySeverity,
  AuditStatus,
  AuditTraceGraph,
  TraceSpan,
} from '../types/auditTypes';
import { AuditEventProcessor, SecurityAlertNotification } from './auditEventProcessor';
import { AuditIntegrityEngine } from './auditIntegrityEngine';
import { AuditRedactionService } from './auditRedactionService';

class AuditService {
  private events: AuditEvent[] = [];
  private processor = new AuditEventProcessor();
  private subscribers: (() => void)[] = [];
  private retentionPolicies: Record<string, AuditRetentionPolicy> = {};

  constructor() {
    this.initializeDefaultRetention();
    this.initializeMockAuditEvents();
  }

  private initializeDefaultRetention() {
    this.retentionPolicies['tenant-1'] = {
      id: 'ret-1',
      tenantId: 'tenant-1',
      retentionDays: 365, // 1 Year default
      autoPurgeEnabled: true,
      archiveToColdStorage: true,
      immutableLock: true,
      lastPurgedAt: '2026-08-01T00:00:00Z',
      legalHoldActive: false,
    };
  }

  private initializeMockAuditEvents() {
    const rawMockSeeds: Partial<AuditEvent>[] = [
      // 1. Authentication
      {
        id: 'aud-1001',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-admin-01',
          name: 'Jaya Triyadi',
          email: 'jayatriyadi1981@gmail.com',
          type: 'ADMIN',
          role: 'Super Admin',
          department: 'Direksi & IT Platform',
        },
        action: 'LOGIN_SUCCESS',
        actionCategory: 'AUTHENTICATION',
        actionLabel: 'Login Berhasil (2FA Terverifikasi)',
        module: 'auth',
        entityType: 'UserSession',
        entityId: 'sess-89214',
        entityName: 'Sesi Web Desktop - Chrome MacOS',
        timestamp: '2026-08-18T14:45:10Z',
        status: 'SUCCESS',
        severity: 'INFO',
        security: {
          ipAddress: '182.253.120.45',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          deviceType: 'DESKTOP',
          browser: 'Chrome 128.0',
          os: 'macOS Sonoma',
          city: 'Jakarta Pusat',
          country: 'Indonesia',
          riskScore: 2,
        },
        sessionId: 'sess-89214',
        requestId: 'req-auth-901',
        correlationId: 'corr-login-jaya',
        source: 'WEB_APP',
        metadata: { authMethod: 'PASSWORD_TOTP_2FA', tokenExpiry: '8h' },
      },
      // 2. CRUD - Vehicle Status Update
      {
        id: 'aud-1002',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-mgr-02',
          name: 'Budi Santoso',
          email: 'budi.santoso@translogistik.co.id',
          type: 'USER',
          role: 'Fleet Manager',
          department: 'Operasional Armada',
        },
        action: 'UPDATE',
        actionCategory: 'CRUD',
        actionLabel: 'Perbarui Status Unit Armada',
        module: 'vehicles',
        entityType: 'Vehicle',
        entityId: 'VH-00124',
        entityName: 'B 9481 UCH (Hino 500 Wingbox)',
        timestamp: '2026-08-18T14:48:22Z',
        status: 'SUCCESS',
        severity: 'LOW',
        security: {
          ipAddress: '180.252.88.19',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          deviceType: 'DESKTOP',
          browser: 'Edge 127.0',
          os: 'Windows 11',
          city: 'Bekasi',
          country: 'Indonesia',
          riskScore: 5,
        },
        sessionId: 'sess-77219',
        requestId: 'req-crud-002',
        correlationId: 'corr-veh-update-101',
        source: 'WEB_APP',
        before: {
          status: 'Active',
          currentDriverId: 'DRV-001',
          branchId: 'BR-JKT',
        },
        after: {
          status: 'Maintenance',
          currentDriverId: 'DRV-004',
          branchId: 'BR-JKT',
        },
        reason: 'Jadwal servis berkala 40.000 KM & pergantian oli transmisi di bengkel Hino Authorized.',
      },
      // 3. AI Tool Call & Action
      {
        id: 'aud-1003',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'ai-fleet-copilot',
          name: 'Fleet Intelligence AI Copilot',
          type: 'AI',
          role: 'AI Engine (Gemini Pro)',
          department: 'Autonomous Analytics',
        },
        action: 'AI_TOOL_CALL',
        actionCategory: 'AI',
        actionLabel: 'Eksekusi Analisis Anomali Konsumsi BBM',
        module: 'fuel_intelligence',
        entityType: 'FuelTelemetryBatch',
        entityId: 'FL-BATCH-994',
        entityName: 'Tangki B 4567 DEF (Isuzu Giga FVR)',
        timestamp: '2026-08-18T15:02:11Z',
        status: 'SUCCESS',
        severity: 'MEDIUM',
        security: {
          ipAddress: '10.240.0.12',
          userAgent: 'Gemini-GenAI-Worker/2.5-flash',
          deviceType: 'SERVER',
          city: 'Cloud Container (Jakarta)',
          country: 'Indonesia',
          riskScore: 0,
        },
        sessionId: 'sess-ai-891',
        requestId: 'req-ai-3482',
        correlationId: 'corr-fuel-anomaly-4567',
        source: 'AI_ENGINE',
        metadata: {
          toolName: 'DetectFuelTheftOrDrop',
          confidenceScore: 0.94,
          detectedDropLiters: 35.5,
          location: 'Depot Cikarang Barat (Geofence #GF-002)',
          recommendation: 'Pemeriksaan fisik sensor level solar & investigasi CCTV pengemudi DRV-009.',
        },
      },
      // 4. AI Recommendation Approval
      {
        id: 'aud-1004',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-mgr-02',
          name: 'Budi Santoso',
          email: 'budi.santoso@translogistik.co.id',
          type: 'USER',
          role: 'Fleet Manager',
          department: 'Operasional Armada',
        },
        action: 'AI_APPROVAL_GRANTED',
        actionCategory: 'AI',
        actionLabel: 'Setujui Rekomendasi Rute AI Multi-Stop',
        module: 'routes',
        entityType: 'TripRoute',
        entityId: 'RT-OPT-2026-08',
        entityName: 'Rute Trans-Jawa Koridor Utara (Jakarta - Semarang - Surabaya)',
        timestamp: '2026-08-18T15:10:05Z',
        status: 'SUCCESS',
        severity: 'INFO',
        security: {
          ipAddress: '180.252.88.19',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          deviceType: 'DESKTOP',
          browser: 'Edge 127.0',
          os: 'Windows 11',
          city: 'Bekasi',
          country: 'Indonesia',
        },
        sessionId: 'sess-77219',
        requestId: 'req-ai-appr-12',
        correlationId: 'corr-route-opt-2026',
        source: 'WEB_APP',
        metadata: {
          originalDistanceKm: 780,
          optimizedDistanceKm: 742,
          estimatedFuelSavedLiters: 18.5,
          tollFeeSavedIdr: 125000,
        },
        reason: 'Optimasi rute disetujui menghindari bottleneck perbaikan jalan Tol Cipali KM 118.',
      },
      // 5. Export Report Audit
      {
        id: 'aud-1005',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-fin-04',
          name: 'Dewi Lestari',
          email: 'dewi.lestari@translogistik.co.id',
          type: 'USER',
          role: 'Finance',
          department: 'Keuangan & Akuntansi',
        },
        action: 'EXPORT_EXCEL',
        actionCategory: 'EXPORT',
        actionLabel: 'Ekspor Rekapitulasi Biaya Operasional (TCO/TOC)',
        module: 'cost_analytics',
        entityType: 'FinancialReport',
        entityId: 'RPT-COST-AUG-2026',
        entityName: 'Laporan Total Cost of Ownership Agustus 2026',
        timestamp: '2026-08-18T15:15:30Z',
        status: 'SUCCESS',
        severity: 'MEDIUM',
        security: {
          ipAddress: '114.122.45.88',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          deviceType: 'DESKTOP',
          browser: 'Safari 17.4',
          os: 'macOS Sonoma',
          city: 'Surabaya',
          country: 'Indonesia',
          riskScore: 10,
        },
        sessionId: 'sess-99120',
        requestId: 'req-exp-441',
        correlationId: 'corr-exp-finance-aug',
        source: 'WEB_APP',
        metadata: {
          format: 'XLSX',
          recordsCount: 2483,
          dateRange: '2026-08-01 to 2026-08-18',
          filtersApplied: 'Branch: ALL, Category: FUEL_MAINTENANCE_TOLL',
          fileSizeBytes: 492100,
          fileChecksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      },
      // 6. Security Event - Failed Login Attempt
      {
        id: 'aud-1006',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'unknown-intruder',
          name: 'Unknown Attacker',
          email: 'admin@translogistik.co.id',
          type: 'USER',
          role: 'Unauthenticated',
        },
        action: 'LOGIN_FAILED',
        actionCategory: 'SECURITY',
        actionLabel: 'Kegagalan Otentikasi Password Akun Admin',
        module: 'auth',
        entityType: 'AuthAttempt',
        entityId: 'att-9912',
        entityName: 'Target: admin@translogistik.co.id',
        timestamp: '2026-08-18T15:20:01Z',
        status: 'FAILED',
        severity: 'HIGH',
        security: {
          ipAddress: '194.26.29.112',
          userAgent: 'Python-requests/2.31.0 (Automated Tool)',
          deviceType: 'BOT',
          city: 'Unknown / Tor Exit Node',
          country: 'Seychelles',
          isVpnOrProxy: true,
          riskScore: 92,
          failureReason: 'INVALID_CREDENTIALS_AND_SUSPICIOUS_USER_AGENT',
        },
        requestId: 'req-sec-attack-01',
        correlationId: 'corr-threat-bruteforce-01',
        source: 'PUBLIC_API',
        metadata: {
          attemptCount: 3,
          lockoutTriggered: true,
          actionTaken: 'TEMPORARY_IP_THROTTLED_15_MINUTES',
        },
      },
      // 7. Permission & Role Change
      {
        id: 'aud-1007',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-admin-01',
          name: 'Jaya Triyadi',
          email: 'jayatriyadi1981@gmail.com',
          type: 'ADMIN',
          role: 'Super Admin',
          department: 'Direksi & IT Platform',
        },
        action: 'PERMISSION_GRANTED',
        actionCategory: 'PERMISSION',
        actionLabel: 'Pemberian Izin Akses Verifikasi Dokumen & Legalitas',
        module: 'roles_permissions',
        entityType: 'RoleMatrix',
        entityId: 'role-safety',
        entityName: 'Role: Safety Officer / HSE',
        timestamp: '2026-08-18T15:22:40Z',
        status: 'SUCCESS',
        severity: 'MEDIUM',
        security: {
          ipAddress: '182.253.120.45',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          deviceType: 'DESKTOP',
          browser: 'Chrome 128.0',
          os: 'macOS Sonoma',
          city: 'Jakarta Pusat',
          country: 'Indonesia',
        },
        sessionId: 'sess-89214',
        requestId: 'req-perm-882',
        correlationId: 'corr-rbac-safety-update',
        source: 'WEB_APP',
        before: {
          permissions: ['safety.view', 'inspection.view', 'inspection.create'],
        },
        after: {
          permissions: ['safety.view', 'inspection.view', 'inspection.create', 'document.view', 'document.verify', 'document.edit'],
        },
        reason: 'Penugasan tim HSE untuk audit kepatuhan uji KIR Dishub dan lisensi K3 pengemudi.',
      },
      // 8. Configuration Change (Overspeed Threshold)
      {
        id: 'aud-1008',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-mgr-02',
          name: 'Budi Santoso',
          email: 'budi.santoso@translogistik.co.id',
          type: 'USER',
          role: 'Fleet Manager',
          department: 'Operasional Armada',
        },
        action: 'THRESHOLD_CHANGED',
        actionCategory: 'CONFIGURATION',
        actionLabel: 'Ubah Parameter Ambang Batas Kecepatan (Speeding)',
        module: 'settings',
        entityType: 'TelematicsConfig',
        entityId: 'CFG-SPEED-TRUCKS',
        entityName: 'Batas Kecepatan Koridor Jalan Tol Trans-Jawa',
        timestamp: '2026-08-18T15:24:15Z',
        status: 'SUCCESS',
        severity: 'LOW',
        security: {
          ipAddress: '180.252.88.19',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          deviceType: 'DESKTOP',
          browser: 'Edge 127.0',
          os: 'Windows 11',
          city: 'Bekasi',
          country: 'Indonesia',
        },
        sessionId: 'sess-77219',
        requestId: 'req-cfg-7731',
        correlationId: 'corr-cfg-overspeed',
        source: 'WEB_APP',
        before: {
          overspeedLimitKmH: 80,
          speedGracePeriodSeconds: 15,
          autoSirenAlarm: false,
        },
        after: {
          overspeedLimitKmH: 90,
          speedGracePeriodSeconds: 10,
          autoSirenAlarm: true,
        },
        reason: 'Penyesuaian regulasi batas kecepatan lajur tol ekspres Korlantas & Kemenhub 2026.',
      },
      // 9. System Action - Document Expiry Scan
      {
        id: 'aud-1009',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'sys-cron-worker',
          name: 'Document Compliance Cron Engine',
          type: 'CRON',
          role: 'Background Service Worker',
          department: 'Core Fleet Scheduler',
        },
        action: 'DOCUMENT_EXPIRY_SCAN',
        actionCategory: 'SYSTEM',
        actionLabel: 'Pemindaian Otomatis Masa Berlaku Dokumen Armada (KIR/STNK/SIM)',
        module: 'documents',
        entityType: 'ComplianceScanner',
        entityId: 'SCAN-JOB-20260818',
        entityName: 'Daily Compliance Matrix Sweep',
        timestamp: '2026-08-18T15:26:00Z',
        status: 'SUCCESS',
        severity: 'INFO',
        security: {
          ipAddress: '10.240.1.5',
          userAgent: 'FleetCronScheduler/v4.2',
          deviceType: 'SERVER',
          city: 'Cloud Container (Jakarta)',
          country: 'Indonesia',
          riskScore: 0,
        },
        requestId: 'req-cron-doc-109',
        correlationId: 'corr-cron-sweep-doc',
        source: 'INTERNAL_WORKER',
        metadata: {
          scannedDocumentsCount: 1248,
          expiringWithin30Days: 14,
          alreadyExpiredCount: 3,
          alertsDispatched: 17,
          durationMs: 342,
        },
      },
      // 10. Document Upload & OCR Ingestion (PROMPT 48 Integration)
      {
        id: 'aud-1010',
        tenantId: 'tenant-1',
        tenantName: 'PT Trans Logistik Nusantara',
        actor: {
          id: 'usr-ops-03',
          name: 'Rudi Hermawan',
          email: 'rudi.h@translogistik.co.id',
          type: 'USER',
          role: 'Operations',
          department: 'Dispatch & Depot Cikarang',
        },
        action: 'CREATE',
        actionCategory: 'DOCUMENT',
        actionLabel: 'Unggah Dokumen Sertifikat Uji KIR Dishub Baru',
        module: 'documents',
        entityType: 'DocumentItem',
        entityId: 'doc-kir-9481-2026',
        entityName: 'Buku Uji Berkala KIR Dishub - B 9481 UCH',
        timestamp: '2026-08-18T15:28:40Z',
        status: 'SUCCESS',
        severity: 'LOW',
        security: {
          ipAddress: '180.252.88.22',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          deviceType: 'DESKTOP',
          browser: 'Chrome 128.0',
          os: 'Windows 10',
          city: 'Cikarang',
          country: 'Indonesia',
        },
        sessionId: 'sess-66190',
        requestId: 'req-doc-up-551',
        correlationId: 'corr-doc-kir-ingest',
        source: 'WEB_APP',
        metadata: {
          documentType: 'VEHICLE_KIR',
          expiryDate: '2027-02-18',
          ocrConfidence: 0.97,
          verificationStatus: 'PENDING_VERIFICATION',
          fileSizeKb: 1480,
        },
      },
    ];

    // Ingest all mock events through the pipeline to calculate signatures and hashes
    for (const raw of rawMockSeeds) {
      const finalized = this.processor.enqueue(raw, this.events);
      this.events.push(finalized);
    }
  }

  /**
   * Log any generic audit event through pipeline
   */
  public logEvent(event: Partial<AuditEvent>): AuditEvent {
    const finalized = this.processor.enqueue(event, this.events);
    this.events.unshift(finalized); // Newest first
    this.notifySubscribers();
    return finalized;
  }

  /**
   * Quick helper for User Action
   */
  public logUserAction(
    actor: ActorInfo,
    action: ActionType,
    actionCategory: ActionCategory,
    module: string,
    entityType: string,
    entityId: string,
    entityName: string,
    details?: {
      before?: Record<string, any>;
      after?: Record<string, any>;
      reason?: string;
      metadata?: Record<string, any>;
      status?: AuditStatus;
      severity?: SecuritySeverity;
    }
  ): AuditEvent {
    return this.logEvent({
      actor,
      action,
      actionCategory,
      module,
      entityType,
      entityId,
      entityName,
      before: details?.before,
      after: details?.after,
      reason: details?.reason,
      metadata: details?.metadata,
      status: details?.status || 'SUCCESS',
      severity: details?.severity || 'INFO',
      source: 'WEB_APP',
    });
  }

  /**
   * Quick helper for CRUD operations
   */
  public logCrud(
    actor: ActorInfo,
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'RESTORE',
    module: string,
    entityType: string,
    entityId: string,
    entityName: string,
    before?: Record<string, any>,
    after?: Record<string, any>,
    reason?: string
  ): AuditEvent {
    return this.logEvent({
      actor,
      action,
      actionCategory: 'CRUD',
      module,
      entityType,
      entityId,
      entityName,
      before,
      after,
      reason,
      status: 'SUCCESS',
      severity: action === 'DELETE' ? 'CRITICAL' : action === 'UPDATE' ? 'LOW' : 'INFO',
    });
  }

  /**
   * Quick helper for AI Action and Tool Calls
   */
  public logAiAction(
    agentName: string,
    user: ActorInfo,
    toolName: string,
    action: ActionType,
    result: string,
    promptContextId?: string,
    metadata?: Record<string, any>
  ): AuditEvent {
    return this.logEvent({
      actor: {
        id: 'ai-engine-gemini',
        name: agentName || 'Fleet AI Copilot',
        type: 'AI',
        role: 'Autonomous Intelligence Engine',
      },
      action,
      actionCategory: 'AI',
      actionLabel: `AI Tool Execution: ${toolName}`,
      module: 'ai',
      entityType: 'AIToolExecution',
      entityId: toolName,
      entityName: `Prompt #${promptContextId || 'ctx-gen'} (${user.name})`,
      metadata: {
        ...metadata,
        requestedByUser: user.name,
        userRole: user.role,
        resultSummary: result,
      },
      status: 'SUCCESS',
      severity: 'INFO',
      source: 'AI_ENGINE',
    });
  }

  /**
   * Quick helper for Export Audits
   */
  public logExport(
    actor: ActorInfo,
    reportName: string,
    format: 'PDF' | 'EXCEL' | 'CSV',
    recordCount: number,
    filters?: string,
    module = 'reports'
  ): AuditEvent {
    const actionType: ActionType =
      format === 'PDF' ? 'EXPORT_PDF' : format === 'EXCEL' ? 'EXPORT_EXCEL' : 'EXPORT_CSV';

    return this.logEvent({
      actor,
      action: actionType,
      actionCategory: 'EXPORT',
      actionLabel: `Ekspor Dokumen Laporan ${format} (${reportName})`,
      module,
      entityType: 'ReportExport',
      entityId: `exp-${Date.now()}`,
      entityName: reportName,
      metadata: {
        format,
        recordCount,
        filtersApplied: filters || 'Semua Filter Standar',
        fileSizeBytes: recordCount * 128 + 1024,
      },
      status: 'SUCCESS',
      severity: recordCount > 1000 ? 'MEDIUM' : 'INFO',
      source: 'WEB_APP',
    });
  }

  /**
   * Quick helper for Security Events (PROMPT 50 Enterprise Security Integration)
   */
  public logSecurityEvent(params: {
    tenantId?: string;
    action: string;
    severity?: SecuritySeverity;
    actor?: {
      actorId: string;
      actorType: string;
      actorEmail?: string;
      tenantId?: string;
    };
    description: string;
    securityMetadata?: Record<string, any>;
  }): AuditEvent {
    return this.logEvent({
      tenantId: params.tenantId || 'GLOBAL_PLATFORM',
      action: (params.action as ActionType) || 'SECURITY_POLICY_ENFORCED',
      actionCategory: 'SECURITY',
      actionLabel: params.description,
      module: 'security',
      entityType: 'SecurityEngine',
      entityId: `sec-${Date.now()}`,
      entityName: params.action,
      actor: {
        id: params.actor?.actorId || 'system-sec-agent',
        name: params.actor?.actorEmail || 'Security Guard Engine',
        email: params.actor?.actorEmail || 'security@fleetintelligence.id',
        type: (params.actor?.actorType as any) || 'SYSTEM',
        role: 'Security Engine',
      },
      metadata: params.securityMetadata,
      status: 'SUCCESS',
      severity: params.severity || 'HIGH',
      source: 'PUBLIC_API',
    });
  }

  /**
   * Strict Tenant-Isolated Querying with Advanced Filters
   */
  public getEvents(filter: AuditFilter = {}, tenantId = 'tenant-1'): AuditEvent[] {
    let result = this.events;

    // Tenant Isolation Check (Super Admin can see all if tenantId is omitted or ALL, else strictly enforced)
    if (tenantId && tenantId !== 'ALL') {
      result = result.filter((e) => e.tenantId === tenantId);
    }

    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.actor.name.toLowerCase().includes(q) ||
          (e.actor.email && e.actor.email.toLowerCase().includes(q)) ||
          e.action.toLowerCase().includes(q) ||
          e.module.toLowerCase().includes(q) ||
          e.entityType.toLowerCase().includes(q) ||
          e.entityName.toLowerCase().includes(q) ||
          e.entityId.toLowerCase().includes(q) ||
          e.security.ipAddress.includes(q) ||
          e.requestId.toLowerCase().includes(q) ||
          e.correlationId.toLowerCase().includes(q)
      );
    }

    if (filter.actorType && filter.actorType !== 'ALL') {
      result = result.filter((e) => e.actor.type === filter.actorType);
    }

    if (filter.actorRole && filter.actorRole !== 'ALL') {
      result = result.filter((e) => e.actor.role.toLowerCase() === filter.actorRole?.toLowerCase());
    }

    if (filter.actionCategory && filter.actionCategory !== 'ALL') {
      result = result.filter((e) => e.actionCategory === filter.actionCategory);
    }

    if (filter.actionType && filter.actionType !== 'ALL') {
      result = result.filter((e) => e.action === filter.actionType);
    }

    if (filter.module && filter.module !== 'ALL') {
      result = result.filter((e) => e.module.toLowerCase() === filter.module?.toLowerCase());
    }

    if (filter.entityType && filter.entityType !== 'ALL') {
      result = result.filter((e) => e.entityType.toLowerCase() === filter.entityType?.toLowerCase());
    }

    if (filter.status && filter.status !== 'ALL') {
      result = result.filter((e) => e.status === filter.status);
    }

    if (filter.severity && filter.severity !== 'ALL') {
      result = result.filter((e) => e.severity === filter.severity);
    }

    if (filter.onlyFailures) {
      result = result.filter((e) => e.status === 'FAILED' || e.status === 'BLOCKED');
    }

    if (filter.onlySecurityAlerts) {
      result = result.filter((e) => e.actionCategory === 'SECURITY' || e.severity === 'CRITICAL' || e.severity === 'HIGH');
    }

    if (filter.startDate) {
      const start = new Date(filter.startDate).getTime();
      result = result.filter((e) => new Date(e.timestamp).getTime() >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate).getTime();
      result = result.filter((e) => new Date(e.timestamp).getTime() <= end);
    }

    return result;
  }

  /**
   * Aggregate Statistics Summary for Dashboard
   */
  public getStatsSummary(tenantId = 'tenant-1'): AuditStatsSummary {
    const list = this.getEvents({}, tenantId);

    const totalActivities = list.length;
    const userActivities = list.filter((e) => e.actor.type === 'USER' || e.actor.type === 'ADMIN').length;
    const systemActivities = list.filter((e) => e.actor.type === 'SYSTEM' || e.actor.type === 'CRON' || e.actor.type === 'DEVICE').length;
    const aiActivities = list.filter((e) => e.actor.type === 'AI').length;
    const securityEvents = list.filter((e) => e.actionCategory === 'SECURITY').length;
    const failedActions = list.filter((e) => e.status === 'FAILED' || e.status === 'BLOCKED').length;
    const criticalEvents = list.filter((e) => e.severity === 'CRITICAL').length;

    // Distributions
    const categoryBreakdown: Record<ActionCategory, number> = {
      AUTHENTICATION: 0,
      CRUD: 0,
      EXPORT: 0,
      CONFIGURATION: 0,
      PERMISSION: 0,
      AI: 0,
      SYSTEM: 0,
      SECURITY: 0,
      INTEGRATION: 0,
      DOCUMENT: 0,
      GPS: 0,
      NOTIFICATION: 0,
      SUBSCRIPTION: 0,
      MAINTENANCE: 0,
      FUEL: 0,
      SAFETY: 0,
      TRIP: 0,
    };

    const actorTypeBreakdown: Record<string, number> = {};
    const severityBreakdown: Record<SecuritySeverity, number> = {
      INFO: 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    list.forEach((e) => {
      if (categoryBreakdown[e.actionCategory] !== undefined) {
        categoryBreakdown[e.actionCategory]++;
      }
      actorTypeBreakdown[e.actor.type] = (actorTypeBreakdown[e.actor.type] || 0) + 1;
      if (severityBreakdown[e.severity] !== undefined) {
        severityBreakdown[e.severity]++;
      }
    });

    const hourlyActivity = [
      { hour: '08:00', count: 120, failures: 1 },
      { hour: '10:00', count: 340, failures: 3 },
      { hour: '12:00', count: 410, failures: 0 },
      { hour: '14:00', count: 680, failures: 2 },
      { hour: '16:00', count: 520, failures: 1 },
      { hour: '18:00', count: 290, failures: 4 },
    ];

    const securityThreatLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' =
      criticalEvents > 0 ? 'CRITICAL' : failedActions > 5 ? 'HIGH' : securityEvents > 2 ? 'ELEVATED' : 'NORMAL';

    return {
      totalActivities: totalActivities + 28482, // Scaled for enterprise realism
      userActivities: userActivities + 21295,
      systemActivities: systemActivities + 5803,
      aiActivities: aiActivities + 1372,
      securityEvents: securityEvents + 118,
      failedActions: failedActions + 81,
      criticalEvents: criticalEvents + 11,
      activityTrendPercent: 14.8,
      securityThreatLevel,
      categoryBreakdown,
      actorTypeBreakdown: actorTypeBreakdown as any,
      severityBreakdown,
      hourlyActivity,
    };
  }

  /**
   * Entity Activity Timeline (e.g. for a specific Vehicle or Driver)
   */
  public getEntityTimeline(entityType: string, entityId: string): AuditEvent[] {
    return this.events.filter(
      (e) =>
        e.entityType.toLowerCase() === entityType.toLowerCase() &&
        e.entityId.toLowerCase() === entityId.toLowerCase()
    );
  }

  /**
   * Microservice & Execution Span Trace Graph by Correlation ID
   */
  public getCorrelationTrace(correlationId: string): AuditTraceGraph {
    const matchedEvents = this.events.filter((e) => e.correlationId === correlationId);
    const root = matchedEvents[0] || this.events[0];

    const mockSpans: TraceSpan[] = [
      {
        id: 'span-1',
        name: 'HTTP Ingress Route Gateway',
        component: 'Nginx Ingress / Envoy Proxy',
        status: 'SUCCESS',
        durationMs: 4,
        timestamp: root.timestamp,
        metadata: { clientIp: root.security.ipAddress, path: `/api/v1/${root.module}` },
      },
      {
        id: 'span-2',
        name: 'RBAC & Tenant Authorization Filter',
        component: 'RBAC Policy Engine',
        status: 'SUCCESS',
        durationMs: 8,
        timestamp: root.timestamp,
        metadata: { actorRole: root.actor.role, tenantId: root.tenantId },
      },
      {
        id: 'span-3',
        name: `${root.module.toUpperCase()} Service Command Handler`,
        component: 'Core Fleet Microservice',
        status: root.status === 'FAILED' ? 'FAILED' : 'SUCCESS',
        durationMs: 42,
        timestamp: root.timestamp,
        metadata: { entityId: root.entityId, action: root.action },
      },
      {
        id: 'span-4',
        name: 'Database PostgreSQL Read/Write Transaction',
        component: 'Cloud SQL / Drizzle ORM',
        status: 'SUCCESS',
        durationMs: 16,
        timestamp: root.timestamp,
        metadata: { rowsAffected: 1, isolation: 'Read Committed' },
      },
      {
        id: 'span-5',
        name: 'AI Real-time Risk Assessment Ingestion',
        component: 'AI Copilot Worker (Gemini Flash)',
        status: 'SUCCESS',
        durationMs: 65,
        timestamp: root.timestamp,
        metadata: { model: 'gemini-2.5-flash', anomalyDetected: false },
      },
      {
        id: 'span-6',
        name: 'Immutable Audit Hash Chain Append',
        component: 'Audit Cryptographic Ledger',
        status: 'SUCCESS',
        durationMs: 2,
        timestamp: root.timestamp,
        metadata: { hash: root.eventHash.slice(0, 16) + '...', seq: root.sequenceNumber },
      },
    ];

    return {
      correlationId: root.correlationId,
      requestId: root.requestId,
      initiator: root.actor,
      rootAction: root.actionLabel || root.action,
      startedAt: root.timestamp,
      totalDurationMs: 137,
      status: root.status === 'FAILED' ? 'FAILED' : 'SUCCESS',
      spans: mockSpans,
    };
  }

  /**
   * Verify Blockchain-Style Immutability
   */
  public verifyIntegrity() {
    return AuditIntegrityEngine.verifyChainIntegrity(this.events);
  }

  /**
   * Export to CSV
   */
  public exportAuditCsv(filter: AuditFilter = {}, tenantId = 'tenant-1'): string {
    const list = this.getEvents(filter, tenantId);
    const headers = [
      'Sequence #',
      'Event ID',
      'Timestamp (ISO)',
      'Actor Name',
      'Actor Email',
      'Actor Type',
      'Actor Role',
      'Action Category',
      'Action Type',
      'Module',
      'Entity Type',
      'Entity ID',
      'Entity Name',
      'Status',
      'Severity',
      'IP Address',
      'City / Location',
      'Request ID',
      'Correlation ID',
      'Reason / Note',
      'Event Hash',
    ];

    const rows = list.map((e) => [
      e.sequenceNumber,
      e.id,
      e.timestamp,
      `"${(e.actor.name || '').replace(/"/g, '""')}"`,
      `"${(e.actor.email || '').replace(/"/g, '""')}"`,
      e.actor.type,
      `"${(e.actor.role || '').replace(/"/g, '""')}"`,
      e.actionCategory,
      e.action,
      e.module,
      e.entityType,
      e.entityId,
      `"${(e.entityName || '').replace(/"/g, '""')}"`,
      e.status,
      e.severity,
      e.security.ipAddress,
      `"${(e.security.city || '').replace(/"/g, '""')}"`,
      e.requestId,
      e.correlationId,
      `"${(e.reason || '').replace(/"/g, '""')}"`,
      e.eventHash,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public getRetentionPolicy(tenantId = 'tenant-1'): AuditRetentionPolicy {
    return (
      this.retentionPolicies[tenantId] || {
        id: `ret-${tenantId}`,
        tenantId,
        retentionDays: 365,
        autoPurgeEnabled: true,
        archiveToColdStorage: true,
        immutableLock: true,
        legalHoldActive: false,
      }
    );
  }

  public updateRetentionPolicy(tenantId: string, policy: Partial<AuditRetentionPolicy>) {
    this.retentionPolicies[tenantId] = {
      ...this.getRetentionPolicy(tenantId),
      ...policy,
    };
    this.notifySubscribers();
  }

  public getSecurityAlerts(): SecurityAlertNotification[] {
    return this.processor.getSecurityAlerts();
  }

  public resolveSecurityAlert(alertId: string, resolvedBy: string) {
    this.processor.resolveAlert(alertId, resolvedBy);
    this.notifySubscribers();
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Audit subscriber error', err);
      }
    });
  }
}

export const auditService = new AuditService();
