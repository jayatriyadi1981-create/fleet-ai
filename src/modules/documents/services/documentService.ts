/**
 * Fleet Intelligence Smart AI - Centralized Document Management Service
 * PROMPT 48 - Unified Document State, Expiry Engine Orchestration, Compliance, Auditing & Persistence
 */

import {
  DocumentItem,
  DocumentFilter,
  DocumentStatus,
  VerificationStatus,
  DocumentComplianceSummary,
  MissingDocumentItem,
  DocumentVersion,
  DocumentHistoryLog,
  ExpiringGroupedSummary,
  ExpiredGroupedSummary,
  StorageQuotaInfo,
} from '../types/documentTypes';
import { storageProvider } from './storageProvider';
import { documentExpiryEngine } from './documentExpiryEngine';
import { documentComplianceEngine } from './documentComplianceEngine';
import { documentOcrAiService } from './documentOcrAiService';

const STORAGE_KEY = 'fleet_intelligence_documents_v1';
const AUDIT_KEY = 'fleet_intelligence_document_audits_v1';

export class DocumentService {
  private static instance: DocumentService;

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  private documents: DocumentItem[] = [];
  private auditLogs: DocumentHistoryLog[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadInitialData();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Error in DocumentService listener:', e);
      }
    });
  }

  private loadInitialData(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedAudits = localStorage.getItem(AUDIT_KEY);

      if (saved) {
        this.documents = JSON.parse(saved);
      } else {
        this.documents = this.getSeedDocuments();
        this.persist();
      }

      if (savedAudits) {
        this.auditLogs = JSON.parse(savedAudits);
      } else {
        this.auditLogs = this.getSeedAudits();
        this.persistAudits();
      }

      // Re-evaluate daysRemaining on startup
      this.recalculateDaysRemaining();
    } catch (e) {
      console.warn('Failed to load document store from localStorage, using seeds:', e);
      this.documents = this.getSeedDocuments();
      this.auditLogs = this.getSeedAudits();
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.documents));
    } catch (e) {
      console.warn('Failed to persist documents:', e);
    }
    this.notify();
  }

  private persistAudits(): void {
    try {
      localStorage.setItem(AUDIT_KEY, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('Failed to persist audits:', e);
    }
  }

  private recalculateDaysRemaining(): void {
    this.documents.forEach((doc) => {
      const days = documentExpiryEngine.calculateDaysRemaining(doc.expiryDate);
      doc.daysRemaining = days;
      doc.status = documentExpiryEngine.determineStatus(days, doc.status);
    });
  }

  public getDocuments(filter?: DocumentFilter): DocumentItem[] {
    this.recalculateDaysRemaining();
    let result = [...this.documents];

    if (!filter) return result;

    if (filter.search) {
      const s = filter.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(s) ||
          d.documentNumber.toLowerCase().includes(s) ||
          d.entityName.toLowerCase().includes(s) ||
          (d.metadata.plateNumber && d.metadata.plateNumber.toLowerCase().includes(s)) ||
          (d.metadata.driverName && d.metadata.driverName.toLowerCase().includes(s)) ||
          d.documentType.toLowerCase().includes(s)
      );
    }

    if (filter.entityType && filter.entityType !== 'ALL') {
      result = result.filter((d) => d.entityType === filter.entityType);
    }

    if (filter.documentType && filter.documentType !== 'ALL') {
      result = result.filter((d) => d.documentType === filter.documentType);
    }

    if (filter.status && filter.status !== 'ALL') {
      result = result.filter((d) => d.status === filter.status);
    }

    if (filter.verificationStatus && filter.verificationStatus !== 'ALL') {
      result = result.filter((d) => d.verificationStatus === filter.verificationStatus);
    }

    if (filter.branch && filter.branch !== 'ALL') {
      result = result.filter((d) => d.metadata.branchName === filter.branch);
    }

    if (filter.expiringWithinDays) {
      result = result.filter((d) => d.daysRemaining >= 0 && d.daysRemaining <= filter.expiringWithinDays!);
    }

    if (filter.expiredOnly) {
      result = result.filter((d) => d.status === 'EXPIRED' || d.daysRemaining < 0);
    }

    if (filter.legalHoldOnly) {
      result = result.filter((d) => d.legalHold);
    }

    if (filter.pendingVerificationOnly) {
      result = result.filter((d) => d.verificationStatus === 'PENDING');
    }

    return result;
  }

  public getDocumentById(id: string): DocumentItem | undefined {
    this.recalculateDaysRemaining();
    return this.documents.find((d) => d.id === id);
  }

  public async uploadDocument(payload: {
    tenantId?: string;
    documentType: any;
    customTypeName?: string;
    title: string;
    entityType: any;
    entityId: string;
    entityName: string;
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    uploadedBy: string;
    metadata?: any;
    file: { name: string; size: number; type: string; dataUrl?: string };
    ocrResult?: any;
    autoVerify?: boolean;
  }): Promise<DocumentItem> {
    const tenantId = payload.tenantId || 'tenant-default';
    const uploadRes = await storageProvider.uploadFile(tenantId, payload.entityType, payload.file);

    const days = documentExpiryEngine.calculateDaysRemaining(payload.expiryDate);
    const initialStatus = documentExpiryEngine.determineStatus(days, 'VALID');
    const now = new Date().toISOString();

    const initialVersion: DocumentVersion = {
      versionNumber: 1,
      fileId: uploadRes.fileId,
      fileName: uploadRes.fileName,
      fileSize: uploadRes.fileSize,
      fileType: uploadRes.fileType,
      fileUrl: uploadRes.fileUrl,
      fileHash: uploadRes.fileHash,
      uploadedBy: payload.uploadedBy,
      uploadedAt: now,
      changeReason: 'Initial Document Upload',
    };

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      documentType: payload.documentType,
      customTypeName: payload.customTypeName,
      title: payload.title || `${payload.documentType} - ${payload.entityName}`,
      entityType: payload.entityType,
      entityId: payload.entityId,
      entityName: payload.entityName,
      fileId: uploadRes.fileId,
      fileName: uploadRes.fileName,
      fileSize: uploadRes.fileSize,
      fileType: uploadRes.fileType,
      fileUrl: uploadRes.fileUrl,
      signedUrl: uploadRes.signedUrl,
      signedUrlExpiresAt: uploadRes.signedUrlExpiresAt,
      fileHash: uploadRes.fileHash,
      documentNumber: payload.documentNumber,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
      daysRemaining: days,
      status: payload.autoVerify ? initialStatus : 'PENDING_VERIFICATION',
      verificationStatus: payload.autoVerify ? 'VERIFIED' : 'PENDING',
      currentVersion: 1,
      versions: [initialVersion],
      historyLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          actor: payload.uploadedBy,
          action: 'CREATED',
          details: `Dokumen ${payload.documentType} diunggah pertama kali (v1). Berkas: ${payload.file.name}`,
        },
      ],
      legalHold: false,
      metadata: payload.metadata || {},
      ocrResult: payload.ocrResult,
      uploadedBy: payload.uploadedBy,
      verifiedBy: payload.autoVerify ? payload.uploadedBy : undefined,
      verifiedAt: payload.autoVerify ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.documents.unshift(newDoc);
    this.recordAudit({
      id: `audit-${Date.now()}`,
      timestamp: now,
      actor: payload.uploadedBy,
      action: 'UPLOADED',
      details: `Upload dokumen baru: ${newDoc.title} (${newDoc.documentNumber})`,
    });

    this.persist();
    return newDoc;
  }

  public async replaceDocument(
    documentId: string,
    file: { name: string; size: number; type: string; dataUrl?: string },
    newMetadata: Partial<DocumentItem>,
    replacedBy: string,
    changeReason: string
  ): Promise<DocumentItem> {
    const doc = this.getDocumentById(documentId);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');

    const uploadRes = await storageProvider.uploadFile(doc.tenantId, doc.entityType, file);
    const newVersionNum = doc.currentVersion + 1;
    const now = new Date().toISOString();

    const newVersion: DocumentVersion = {
      versionNumber: newVersionNum,
      fileId: uploadRes.fileId,
      fileName: uploadRes.fileName,
      fileSize: uploadRes.fileSize,
      fileType: uploadRes.fileType,
      fileUrl: uploadRes.fileUrl,
      fileHash: uploadRes.fileHash,
      uploadedBy: replacedBy,
      uploadedAt: now,
      changeReason: changeReason || `Revisi versi ${newVersionNum}`,
    };

    doc.versions.push(newVersion);
    doc.currentVersion = newVersionNum;
    doc.fileId = uploadRes.fileId;
    doc.fileName = uploadRes.fileName;
    doc.fileSize = uploadRes.fileSize;
    doc.fileType = uploadRes.fileType;
    doc.fileUrl = uploadRes.fileUrl;
    doc.fileHash = uploadRes.fileHash;
    doc.signedUrl = uploadRes.signedUrl;
    doc.signedUrlExpiresAt = uploadRes.signedUrlExpiresAt;

    if (newMetadata.documentNumber) doc.documentNumber = newMetadata.documentNumber;
    if (newMetadata.issueDate) doc.issueDate = newMetadata.issueDate;
    if (newMetadata.expiryDate) {
      doc.expiryDate = newMetadata.expiryDate;
      doc.daysRemaining = documentExpiryEngine.calculateDaysRemaining(newMetadata.expiryDate);
    }
    if (newMetadata.metadata) {
      doc.metadata = { ...doc.metadata, ...newMetadata.metadata };
    }

    doc.verificationStatus = 'PENDING';
    doc.status = 'PENDING_VERIFICATION';
    doc.updatedAt = now;

    const logItem: DocumentHistoryLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      actor: replacedBy,
      action: 'REPLACED',
      details: `Dokumen diperbarui ke Versi ${newVersionNum}. Alasan: ${changeReason || 'Pembaruan masa berlaku'}. Berkas baru: ${file.name}`,
    };
    doc.historyLogs.unshift(logItem);

    this.recordAudit(logItem);
    this.persist();
    return doc;
  }

  public verifyDocument(
    documentId: string,
    status: VerificationStatus,
    reviewer: string,
    reason?: string,
    correctionNotes?: string
  ): DocumentItem {
    const doc = this.getDocumentById(documentId);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');

    const now = new Date().toISOString();
    doc.verificationStatus = status;
    doc.verifiedBy = reviewer;
    doc.verifiedAt = now;
    doc.updatedAt = now;

    if (status === 'VERIFIED') {
      const days = documentExpiryEngine.calculateDaysRemaining(doc.expiryDate);
      doc.status = documentExpiryEngine.determineStatus(days, 'VALID');
      doc.rejectionReason = undefined;
      doc.correctionNotes = undefined;
    } else if (status === 'REJECTED') {
      doc.status = 'REJECTED';
      doc.rejectionReason = reason || 'Dokumen tidak memenuhi persyaratan legalitas / gambar buram.';
    } else if (status === 'CORRECTION_REQUIRED') {
      doc.status = 'PENDING_VERIFICATION';
      doc.correctionNotes = correctionNotes || 'Harap unggah ulang dengan resolusi lebih tajam.';
    }

    const logItem: DocumentHistoryLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      actor: reviewer,
      action: status === 'VERIFIED' ? 'VERIFIED' : status === 'REJECTED' ? 'REJECTED' : 'CORRECTION_REQUESTED',
      details: `Status verifikasi diubah menjadi [${status}] oleh ${reviewer}. ${reason ? `Alasan: ${reason}` : ''}`,
    };
    doc.historyLogs.unshift(logItem);

    this.recordAudit(logItem);
    this.persist();
    return doc;
  }

  public toggleLegalHold(documentId: string, user: string, reason?: string): DocumentItem {
    const doc = this.getDocumentById(documentId);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');

    const nextState = !doc.legalHold;
    doc.legalHold = nextState;
    doc.legalHoldReason = nextState ? reason || 'Ditetapkan dalam pengawasan Legal Hold oleh Compliance' : undefined;
    doc.updatedAt = new Date().toISOString();

    const logItem: DocumentHistoryLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user,
      action: nextState ? 'LEGAL_HOLD_ENABLED' : 'LEGAL_HOLD_DISABLED',
      details: nextState
        ? `Legal Hold DIAKTIFKAN. Alasan: ${doc.legalHoldReason}`
        : `Legal Hold DINONAKTIFKAN oleh ${user}.`,
    };
    doc.historyLogs.unshift(logItem);

    this.recordAudit(logItem);
    this.persist();
    return doc;
  }

  public archiveDocument(documentId: string, user: string): DocumentItem {
    const doc = this.getDocumentById(documentId);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');

    if (doc.legalHold) {
      throw new Error('Gagal mengarsipkan: Dokumen dilindungi oleh status Legal Hold.');
    }

    doc.status = 'ARCHIVED';
    doc.updatedAt = new Date().toISOString();

    const logItem: DocumentHistoryLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user,
      action: 'ARCHIVED',
      details: `Dokumen dipindahkan ke arsip oleh ${user}.`,
    };
    doc.historyLogs.unshift(logItem);

    this.recordAudit(logItem);
    this.persist();
    return doc;
  }

  public async deleteDocument(documentId: string, user: string): Promise<boolean> {
    const doc = this.getDocumentById(documentId);
    if (!doc) return false;

    if (doc.legalHold) {
      throw new Error('Gagal menghapus: Dokumen dilindungi oleh status Legal Hold.');
    }

    await storageProvider.deleteFile(doc.fileId, doc.legalHold);
    this.documents = this.documents.filter((d) => d.id !== documentId);

    this.recordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user,
      action: 'ARCHIVED',
      details: `Dokumen ${doc.title} (${doc.documentNumber}) dihapus permanen oleh ${user}.`,
    });

    this.persist();
    return true;
  }

  public recordAudit(log: DocumentHistoryLog): void {
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }
    this.persistAudits();
  }

  public getAuditLogs(documentId?: string): DocumentHistoryLog[] {
    if (documentId) {
      const doc = this.getDocumentById(documentId);
      return doc ? doc.historyLogs : [];
    }
    return this.auditLogs;
  }

  public getAllDocuments(): DocumentItem[] {
    return this.getDocuments();
  }

  public getExpiringDocuments(days = 30): DocumentItem[] {
    return this.getDocuments({ expiringWithinDays: days });
  }

  public getExpiredDocuments(): DocumentItem[] {
    return this.getDocuments({ expiredOnly: true });
  }

  public checkDuplicate(
    docNumber: string,
    docsList?: DocumentItem[],
    currentDocId?: string
  ): { isDuplicate: boolean; duplicateDoc?: DocumentItem } {
    const list = docsList || this.documents;
    const cleanNum = docNumber.replace(/[\s\-\/\.]/g, '').toUpperCase();
    if (!cleanNum) return { isDuplicate: false };

    const duplicateDoc = list.find((d) => {
      if (currentDocId && d.id === currentDocId) return false;
      const dNum = d.documentNumber.replace(/[\s\-\/\.]/g, '').toUpperCase();
      return dNum === cleanNum;
    });

    return {
      isDuplicate: !!duplicateDoc,
      duplicateDoc,
    };
  }

  public exportComplianceCsv(): string {
    const docs = this.getDocuments();
    const headers = [
      'ID Dokumen',
      'Judul',
      'Tipe Dokumen',
      'Kategori Entitas',
      'Nama Entitas / Unit',
      'Nomor Dokumen',
      'Tanggal Terbit',
      'Tanggal Kedaluwarsa',
      'Sisa Hari',
      'Status Kepatuhan',
      'Status Verifikasi',
      'Legal Hold',
      'Diunggah Oleh',
      'Versi Terakhir',
    ];

    const rows = docs.map((d) => [
      d.id,
      `"${(d.title || '').replace(/"/g, '""')}"`,
      d.documentType,
      d.entityType,
      `"${(d.entityName || '').replace(/"/g, '""')}"`,
      `"${(d.documentNumber || '').replace(/"/g, '""')}"`,
      d.issueDate,
      d.expiryDate,
      d.daysRemaining,
      d.status,
      d.verificationStatus,
      d.legalHold ? 'YA' : 'TIDAK',
      `"${(d.uploadedBy || '').replace(/"/g, '""')}"`,
      `v${d.currentVersion}`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public getMissingDocuments(): MissingDocumentItem[] {
    const entities = [
      { id: 'v-101', name: 'B 9481 UCH (Hino 500 Wingbox)', type: 'VEHICLE' as const, category: 'TRUCK_FLEET' },
      { id: 'v-102', name: 'B 9102 TGA (Mitsubishi Fuso Fighter)', type: 'VEHICLE' as const, category: 'TRUCK_FLEET' },
      { id: 'v-103', name: 'B 9234 TGA (Isuzu Giga Tronton)', type: 'VEHICLE' as const, category: 'TRUCK_FLEET' },
      { id: 'v-104', name: 'B 9912 BZA (Toyota HiAce Blind Van)', type: 'VEHICLE' as const, category: 'COURIER_DRIVER' },
      { id: 'drv-01', name: 'Bambang Supriyanto', type: 'DRIVER' as const, category: 'HEAVY_DRIVER' },
      { id: 'drv-02', name: 'Agus Hendrawan', type: 'DRIVER' as const, category: 'HEAVY_DRIVER' },
      { id: 'drv-03', name: 'Dedi Prasetyo', type: 'DRIVER' as const, category: 'HEAVY_DRIVER' },
      { id: 'c-01', name: 'PT Nusantara Trans Logistics', type: 'COMPANY' as const, category: 'COMPANY_OPERATOR' },
    ];

    return documentComplianceEngine.detectMissingDocuments(entities, this.documents);
  }

  public getComplianceSummary(): DocumentComplianceSummary {
    const missing = this.getMissingDocuments();
    return documentComplianceEngine.computeOverallCompliance(this.documents, missing);
  }

  public getExpiringGrouped(): ExpiringGroupedSummary {
    return documentExpiryEngine.groupExpiringDocuments(this.documents);
  }

  public getExpiredGrouped(): ExpiredGroupedSummary {
    return documentExpiryEngine.groupExpiredDocuments(this.documents);
  }

  public runDailyExpiryJob(): Array<{ documentId: string; message: string; severity: string }> {
    const notificationsGenerated: Array<{ documentId: string; message: string; severity: string }> = [];

    this.documents.forEach((doc) => {
      const evaluation = documentExpiryEngine.evaluateDocument(doc);
      doc.daysRemaining = evaluation.daysRemaining;
      doc.status = evaluation.status;

      if (evaluation.shouldNotify) {
        doc.lastNotificationSentThreshold = evaluation.notificationThresholdTriggered;
        notificationsGenerated.push({
          documentId: doc.id,
          message: evaluation.alertMessage,
          severity: evaluation.severity,
        });
      }
    });

    this.persist();
    return notificationsGenerated;
  }

  // ----------------------------------------------------
  // Seed Data Initializer
  // ----------------------------------------------------
  private getSeedDocuments(): DocumentItem[] {
    const baseDate = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const dPast40 = new Date(baseDate.getTime() - 40 * 86400000);
    const dPast12 = new Date(baseDate.getTime() - 12 * 86400000);
    const dPast2 = new Date(baseDate.getTime() - 2 * 86400000);
    const dFuture5 = new Date(baseDate.getTime() + 5 * 86400000);
    const dFuture14 = new Date(baseDate.getTime() + 14 * 86400000);
    const dFuture28 = new Date(baseDate.getTime() + 28 * 86400000);
    const dFuture45 = new Date(baseDate.getTime() + 45 * 86400000);
    const dFuture75 = new Date(baseDate.getTime() + 75 * 86400000);
    const dFuture180 = new Date(baseDate.getTime() + 180 * 86400000);
    const dFuture365 = new Date(baseDate.getTime() + 365 * 86400000);
    const dFuture700 = new Date(baseDate.getTime() + 700 * 86400000);

    return [
      // 1. Vehicle Documents (B 9481 UCH)
      {
        id: 'doc-v101-stnk',
        tenantId: 'tenant-default',
        documentType: 'STNK',
        title: 'STNK - B 9481 UCH (Hino 500 Wingbox)',
        entityType: 'VEHICLE',
        entityId: 'v-101',
        entityName: 'B 9481 UCH (Hino 500 Wingbox)',
        fileId: 'f-stnk-01',
        fileName: 'tenant-default/vehicle/stnk_B9481UCH_2027.pdf',
        fileSize: 2450000,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-stnk-01'),
        documentNumber: 'STNK-09182312-DKI',
        issueDate: fmt(new Date(baseDate.getTime() - 730 * 86400000)),
        expiryDate: fmt(dFuture700),
        daysRemaining: 700,
        status: 'VALID',
        verificationStatus: 'VERIFIED',
        currentVersion: 2,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-stnk-01-v1',
            fileName: 'stnk_old.pdf',
            fileSize: 1800000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
            uploadedBy: 'Agus Operational',
            uploadedAt: '2022-08-15T08:00:00Z',
            changeReason: 'Upload awal registrasi unit',
          },
          {
            versionNumber: 2,
            fileId: 'f-stnk-01',
            fileName: 'stnk_B9481UCH_2027.pdf',
            fileSize: 2450000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
            uploadedBy: 'Budi Fleet Lead',
            uploadedAt: '2024-08-15T10:30:00Z',
            changeReason: 'Perpanjangan pajak 5 tahunan Samsat',
          },
        ],
        historyLogs: [
          {
            id: 'log-1',
            timestamp: '2024-08-15T11:00:00Z',
            actor: 'Hendri Manager',
            action: 'VERIFIED',
            details: 'Dokumen STNK diverifikasi sah Samsat Polda Metro Jaya.',
          },
        ],
        legalHold: false,
        metadata: {
          plateNumber: 'B 9481 UCH',
          vehicleBrandModel: 'Hino 500 Series FL 260 JW',
          branchName: 'Cikarang Hub 1',
          issuer: 'Samsat Jakarta Timur',
        },
        uploadedBy: 'Budi Fleet Lead',
        verifiedBy: 'Hendri Manager',
        verifiedAt: '2024-08-15T11:00:00Z',
        createdAt: '2022-08-15T08:00:00Z',
        updatedAt: '2024-08-15T11:00:00Z',
      },
      // 2. KIR Expiring in 5 days (Critical Alert)
      {
        id: 'doc-v101-kir',
        tenantId: 'tenant-default',
        documentType: 'KIR',
        title: 'Buku Uji Berkala KIR Dishub - B 9481 UCH',
        entityType: 'VEHICLE',
        entityId: 'v-101',
        entityName: 'B 9481 UCH (Hino 500 Wingbox)',
        fileId: 'f-kir-01',
        fileName: 'tenant-default/vehicle/kir_dishub_B9481UCH.jpg',
        fileSize: 1850000,
        fileType: 'image/jpeg',
        fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-kir-01'),
        documentNumber: 'KIR-JKT-8891024',
        issueDate: fmt(new Date(baseDate.getTime() - 175 * 86400000)),
        expiryDate: fmt(dFuture5),
        daysRemaining: 5,
        status: 'EXPIRING_SOON',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-kir-01',
            fileName: 'kir_dishub_B9481UCH.jpg',
            fileSize: 1850000,
            fileType: 'image/jpeg',
            fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
            uploadedBy: 'Budi Fleet Lead',
            uploadedAt: '2026-02-18T09:00:00Z',
            changeReason: 'Hasil uji berkala Dishub Ujung Menteng',
          },
        ],
        historyLogs: [
          {
            id: 'log-2',
            timestamp: '2026-02-18T10:00:00Z',
            actor: 'Hendri Manager',
            action: 'VERIFIED',
            details: 'Lulus uji rem, emisi gas buang, dan lampu utama Dishub.',
          },
        ],
        legalHold: false,
        metadata: {
          plateNumber: 'B 9481 UCH',
          vehicleBrandModel: 'Hino 500 Series FL 260 JW',
          inspectionAuthority: 'UP PKB Ujung Menteng Dishub DKI',
          testingLocation: 'Ujung Menteng, Cakung',
          branchName: 'Cikarang Hub 1',
        },
        uploadedBy: 'Budi Fleet Lead',
        verifiedBy: 'Hendri Manager',
        verifiedAt: '2026-02-18T10:00:00Z',
        createdAt: '2026-02-18T09:00:00Z',
        updatedAt: '2026-02-18T10:00:00Z',
      },
      // 3. Insurance Expired 12 days ago (High Overdue)
      {
        id: 'doc-v102-ins',
        tenantId: 'tenant-default',
        documentType: 'INSURANCE',
        title: 'Polis Asuransi All-Risk - B 9102 TGA (Mitsubishi Fuso)',
        entityType: 'VEHICLE',
        entityId: 'v-102',
        entityName: 'B 9102 TGA (Mitsubishi Fuso Fighter)',
        fileId: 'f-ins-01',
        fileName: 'tenant-default/vehicle/polis_asuransi_fuso.pdf',
        fileSize: 3100000,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-ins-01'),
        documentNumber: 'POL-ACA-FLT-2025-901',
        issueDate: fmt(new Date(baseDate.getTime() - 377 * 86400000)),
        expiryDate: fmt(dPast12),
        daysRemaining: -12,
        status: 'EXPIRED',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-ins-01',
            fileName: 'polis_asuransi_fuso.pdf',
            fileSize: 3100000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
            uploadedBy: 'Dewi Finance',
            uploadedAt: '2025-08-01T08:30:00Z',
          },
        ],
        historyLogs: [
          {
            id: 'log-ins-exp',
            timestamp: fmt(dPast12),
            actor: 'System Expiry Engine',
            action: 'EXPIRY_UPDATED',
            details: 'Status otomatis diubah menjadi EXPIRED. Alert eskalasi dikirim ke Finance & Fleet Manager.',
          },
        ],
        legalHold: false,
        metadata: {
          plateNumber: 'B 9102 TGA',
          insuranceProvider: 'PT Asuransi Central Asia (ACA)',
          policyNumber: 'POL-ACA-FLT-2025-901',
          coverageType: 'ALL_RISK',
          coverageLimit: 650000000,
          premium: 14500000,
          branchName: 'Tanjung Priok Depo',
        },
        uploadedBy: 'Dewi Finance',
        verifiedBy: 'Hendri Manager',
        verifiedAt: '2025-08-01T10:00:00Z',
        createdAt: '2025-08-01T08:30:00Z',
        updatedAt: fmt(dPast12),
      },
      // 4. Driver SIM BII Umum (Expiring in 28 days)
      {
        id: 'doc-drv01-sim',
        tenantId: 'tenant-default',
        documentType: 'SIM_B2',
        title: 'SIM BII Umum - Bambang Supriyanto',
        entityType: 'DRIVER',
        entityId: 'drv-01',
        entityName: 'Bambang Supriyanto',
        fileId: 'f-sim-01',
        fileName: 'tenant-default/driver/sim_bii_bambang.jpg',
        fileSize: 1240000,
        fileType: 'image/jpeg',
        fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-sim-01'),
        documentNumber: '9408-1923-000492',
        issueDate: fmt(new Date(baseDate.getTime() - 1800 * 86400000)),
        expiryDate: fmt(dFuture28),
        daysRemaining: 28,
        status: 'EXPIRING_SOON',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-sim-01',
            fileName: 'sim_bii_bambang.jpg',
            fileSize: 1240000,
            fileType: 'image/jpeg',
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
            uploadedBy: 'Bambang Supriyanto',
            uploadedAt: '2026-01-10T14:20:00Z',
            changeReason: 'Upload berkas registrasi driver mobile',
          },
        ],
        historyLogs: [
          {
            id: 'log-sim-1',
            timestamp: '2026-01-11T09:00:00Z',
            actor: 'Rian Safety Officer',
            action: 'VERIFIED',
            details: 'Verifikasi SIM BII Umum valid Satpas Daan Mogot.',
          },
        ],
        legalHold: false,
        metadata: {
          driverName: 'Bambang Supriyanto',
          simType: 'SIM_B2',
          issuer: 'Satpas SIM Daan Mogot Jakarta Barat',
          branchName: 'Cikarang Hub 1',
        },
        uploadedBy: 'Bambang Supriyanto',
        verifiedBy: 'Rian Safety Officer',
        verifiedAt: '2026-01-11T09:00:00Z',
        createdAt: '2026-01-10T14:20:00Z',
        updatedAt: '2026-01-11T09:00:00Z',
      },
      // 5. Driver Defensive Driving Certification (Valid 180 days)
      {
        id: 'doc-drv01-ddt',
        tenantId: 'tenant-default',
        documentType: 'DRIVER_CERT',
        title: 'Sertifikat Defensive Driving (DDT) - Bambang Supriyanto',
        entityType: 'DRIVER',
        entityId: 'drv-01',
        entityName: 'Bambang Supriyanto',
        fileId: 'f-cert-01',
        fileName: 'tenant-default/driver/ddt_cert_bambang.pdf',
        fileSize: 1600000,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-cert-01'),
        documentNumber: 'CERT-IDDC-2025-0812',
        issueDate: fmt(new Date(baseDate.getTime() - 185 * 86400000)),
        expiryDate: fmt(dFuture180),
        daysRemaining: 180,
        status: 'VALID',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-cert-01',
            fileName: 'ddt_cert_bambang.pdf',
            fileSize: 1600000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
            uploadedBy: 'Rian Safety Officer',
            uploadedAt: '2025-08-20T10:00:00Z',
          },
        ],
        historyLogs: [
          {
            id: 'log-cert-1',
            timestamp: '2025-08-20T10:00:00Z',
            actor: 'Rian Safety Officer',
            action: 'VERIFIED',
            details: 'Pelatihan keselamatan berkendara tronton IDDC predikat Sangat Baik.',
          },
        ],
        legalHold: false,
        metadata: {
          driverName: 'Bambang Supriyanto',
          certificationName: 'Defensive Driving & Roll-over Prevention',
          issuer: 'Indonesia Defensive Driving Center (IDDC)',
          branchName: 'Cikarang Hub 1',
        },
        uploadedBy: 'Rian Safety Officer',
        verifiedBy: 'Rian Safety Officer',
        verifiedAt: '2025-08-20T10:00:00Z',
        createdAt: '2025-08-20T10:00:00Z',
        updatedAt: '2025-08-20T10:00:00Z',
      },
      // 6. Pending Verification Document (Uploaded by Mobile Driver)
      {
        id: 'doc-drv02-sim-pend',
        tenantId: 'tenant-default',
        documentType: 'SIM_B2',
        title: 'SIM BII Umum (Revisi Baru) - Agus Hendrawan',
        entityType: 'DRIVER',
        entityId: 'drv-02',
        entityName: 'Agus Hendrawan',
        fileId: 'f-sim-02',
        fileName: 'tenant-default/driver/sim_agus_baru_scan.jpg',
        fileSize: 1980000,
        fileType: 'image/jpeg',
        fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-sim-02'),
        documentNumber: '9408-8812-009182',
        issueDate: fmt(new Date(baseDate.getTime() - 5 * 86400000)),
        expiryDate: fmt(dFuture700),
        daysRemaining: 700,
        status: 'PENDING_VERIFICATION',
        verificationStatus: 'PENDING',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-sim-02',
            fileName: 'sim_agus_baru_scan.jpg',
            fileSize: 1980000,
            fileType: 'image/jpeg',
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
            uploadedBy: 'Agus Hendrawan (Driver Mobile App)',
            uploadedAt: fmt(dPast2) + 'T14:15:00Z',
            changeReason: 'Perpanjangan SIM 5 tahun di Satpas',
          },
        ],
        historyLogs: [
          {
            id: 'log-sim-pend',
            timestamp: fmt(dPast2) + 'T14:15:00Z',
            actor: 'Agus Hendrawan',
            action: 'UPLOADED',
            details: 'Unggah foto SIM via kamera mobile app. Menunggu persetujuan reviewer HSE/HR.',
          },
        ],
        legalHold: false,
        metadata: {
          driverName: 'Agus Hendrawan',
          simType: 'SIM_B2',
          issuer: 'Satpas SIM Polrestabes Bandung',
          branchName: 'Bandung Depo',
        },
        uploadedBy: 'Agus Hendrawan',
        createdAt: fmt(dPast2) + 'T14:15:00Z',
        updatedAt: fmt(dPast2) + 'T14:15:00Z',
      },
      // 7. Company Business License (NIB & SIUP-K) with Legal Hold Active
      {
        id: 'doc-comp-nib',
        tenantId: 'tenant-default',
        documentType: 'BUSINESS_LICENSE',
        title: 'NIB & Izin Usaha Angkutan Barang Khusus - PT Nusantara Trans Logistics',
        entityType: 'COMPANY',
        entityId: 'c-01',
        entityName: 'PT Nusantara Trans Logistics',
        fileId: 'f-nib-01',
        fileName: 'tenant-default/company/nib_siupk_ptntl_2031.pdf',
        fileSize: 4200000,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-nib-01'),
        documentNumber: 'NIB-9120003418291-KBLI49431',
        issueDate: '2021-04-12',
        expiryDate: '2031-04-12',
        daysRemaining: 1700,
        status: 'VALID',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-nib-01',
            fileName: 'nib_siupk_ptntl_2031.pdf',
            fileSize: 4200000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
            uploadedBy: 'Legal Director',
            uploadedAt: '2021-04-15T09:00:00Z',
          },
        ],
        historyLogs: [
          {
            id: 'log-nib-lh',
            timestamp: '2026-01-05T10:00:00Z',
            actor: 'Legal & Compliance Dept',
            action: 'LEGAL_HOLD_ENABLED',
            details: 'Status Legal Hold diaktifkan: Dokumen korporasi inti tidak dapat dihapus/diarsipkan.',
          },
        ],
        legalHold: true,
        legalHoldReason: 'Dokumen Legalitas Induk Korporasi (Wajib Kemenhub & BKPM)',
        metadata: {
          issuer: 'Kementerian Investasi / BKPM RI & Kemenhub',
          branchName: 'Headquarters Jakarta',
        },
        uploadedBy: 'Legal Director',
        verifiedBy: 'CEO & Owner',
        verifiedAt: '2021-04-15T11:00:00Z',
        createdAt: '2021-04-15T09:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
      // 8. Device GPS Calibration Certificate
      {
        id: 'doc-dev-cal',
        tenantId: 'tenant-default',
        documentType: 'GPS_CALIBRATION',
        title: 'Sertifikat Kalibrasi Odometer & GPS Sensor - Teltonika FMB920',
        entityType: 'DEVICE',
        entityId: 'dev-001',
        entityName: 'GPS-IMEI-864019283719001 (B 9481 UCH)',
        fileId: 'f-dev-cal-01',
        fileName: 'tenant-default/device/cert_kalibrasi_teltonika_2026.pdf',
        fileSize: 1450000,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        signedUrl: storageProvider.generateSignedUrl('f-dev-cal-01'),
        documentNumber: 'CAL-TELT-2025-0918',
        issueDate: fmt(new Date(baseDate.getTime() - 290 * 86400000)),
        expiryDate: fmt(dFuture75),
        daysRemaining: 75,
        status: 'VALID',
        verificationStatus: 'VERIFIED',
        currentVersion: 1,
        versions: [
          {
            versionNumber: 1,
            fileId: 'f-dev-cal-01',
            fileName: 'cert_kalibrasi_teltonika_2026.pdf',
            fileSize: 1450000,
            fileType: 'application/pdf',
            fileUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
            uploadedBy: 'Agus IoT Engineer',
            uploadedAt: '2025-10-15T11:00:00Z',
          },
        ],
        historyLogs: [
          {
            id: 'log-cal-1',
            timestamp: '2025-10-15T11:00:00Z',
            actor: 'Agus IoT Engineer',
            action: 'VERIFIED',
            details: 'Akurasi sensor kecepatan & fuel level calibrated 99.8%.',
          },
        ],
        legalHold: false,
        metadata: {
          issuer: 'PT Teltonika Telematics Indonesia',
          branchName: 'Cikarang Hub 1',
        },
        uploadedBy: 'Agus IoT Engineer',
        verifiedBy: 'Hendri Manager',
        verifiedAt: '2025-10-15T12:00:00Z',
        createdAt: '2025-10-15T11:00:00Z',
        updatedAt: '2025-10-15T12:00:00Z',
      },
    ];
  }

  private getSeedAudits(): DocumentHistoryLog[] {
    return [
      {
        id: 'audit-01',
        timestamp: '2026-08-18T09:30:00Z',
        actor: 'Hendri Manager',
        action: 'VIEWED',
        details: 'Melihat rincian dokumen KIR Dishub B 9481 UCH.',
      },
      {
        id: 'audit-02',
        timestamp: '2026-08-18T08:45:00Z',
        actor: 'Dewi Finance',
        action: 'DOWNLOADED',
        details: 'Mengunduh berkas polis asuransi armada (PDF).',
      },
      {
        id: 'audit-03',
        timestamp: '2026-08-17T16:20:00Z',
        actor: 'Agus Hendrawan',
        action: 'UPLOADED',
        details: 'Driver mengunggah foto perpanjangan SIM BII via mobile app.',
      },
    ];
  }
}

export const documentService = DocumentService.getInstance();
