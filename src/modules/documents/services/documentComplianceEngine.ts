/**
 * Fleet Intelligence Smart AI - Document Compliance & Operational Restriction Engine
 * PROMPT 48 - Dynamic Compliance Scoring, Missing Document Detection & Assignment Protection
 */

import {
  DocumentItem,
  EntityType,
  DocumentType,
  MissingDocumentItem,
  DocumentRequirementTemplate,
  DocumentComplianceSummary,
  StorageQuotaInfo,
} from '../types/documentTypes';

export interface EntityComplianceDetail {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  category: string;
  score: number; // 0 - 100
  complianceStatus: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  hasOperationalRestriction: boolean;
  restrictionReason?: string;
  totalRequired: number;
  validCount: number;
  expiringCount: number;
  expiredCount: number;
  missingCount: number;
  documents: Array<{
    type: DocumentType;
    typeName: string;
    status: string;
    expiryDate?: string;
    isMandatory: boolean;
  }>;
}

export class DocumentComplianceEngine {
  private static instance: DocumentComplianceEngine;

  public static getInstance(): DocumentComplianceEngine {
    if (!DocumentComplianceEngine.instance) {
      DocumentComplianceEngine.instance = new DocumentComplianceEngine();
    }
    return DocumentComplianceEngine.instance;
  }

  // Pre-configured enterprise requirement templates
  private templates: DocumentRequirementTemplate[] = [
    {
      id: 'template-truck-fleet',
      name: 'Standard Heavy Truck & Cargo Fleet',
      code: 'TRUCK_FLEET',
      description: 'Aturan wajib kepatuhan kendaraan angkutan barang & tronton (UU LLAJ & Kemenhub RI)',
      entityType: 'VEHICLE',
      targetDescription: 'Truck Box, Truck Container, Dump Truck, Trailer',
      requiredDocuments: [
        { type: 'STNK', name: 'Surat Tanda Nomor Kendaraan (STNK)', criticality: 'MANDATORY', renewalWindowDays: 30 },
        { type: 'KIR', name: 'Uji Berkala Kendaraan Bermotor (KIR Dishub)', criticality: 'MANDATORY', renewalWindowDays: 45 },
        { type: 'INSURANCE', name: 'Polis Asuransi Armada (All-Risk / TLO)', criticality: 'MANDATORY', renewalWindowDays: 30 },
        { type: 'VEHICLE_CERTIFICATE', name: 'Sertifikat Emisi & Kelaikan Teknis', criticality: 'RECOMMENDED', renewalWindowDays: 60 },
      ],
      activeUnitCount: 24,
    },
    {
      id: 'template-delivery-driver',
      name: 'Commercial Heavy Logistics Driver',
      code: 'HEAVY_DRIVER',
      description: 'Standar legalitas pengemudi angkutan berat & logistik nasional',
      entityType: 'DRIVER',
      targetDescription: 'Pengemudi Truk Berat & Tronton Antarkota',
      requiredDocuments: [
        { type: 'SIM_B2', name: 'Surat Izin Mengemudi (SIM BII Umum)', criticality: 'MANDATORY', renewalWindowDays: 30 },
        { type: 'DRIVER_CERT', name: 'Sertifikat Defensive Driving (DDT)', criticality: 'MANDATORY', renewalWindowDays: 60 },
        { type: 'TRAINING_CERT', name: 'Sertifikat Pelatihan K3 & Safety Fatigue', criticality: 'RECOMMENDED', renewalWindowDays: 90 },
        { type: 'MEDICAL_CERT', name: 'Surat Keterangan Sehat & Bebas Narkoba', criticality: 'MANDATORY', renewalWindowDays: 30 },
      ],
      activeUnitCount: 28,
    },
    {
      id: 'template-light-driver',
      name: 'Light Van & Courier Driver',
      code: 'COURIER_DRIVER',
      description: 'Standar kepatuhan pengemudi kurir perkotaan (Blind Van / Pickup)',
      entityType: 'DRIVER',
      targetDescription: 'Pengemudi City Courier & Delivery Van',
      requiredDocuments: [
        { type: 'SIM_A', name: 'SIM A / SIM B1', criticality: 'MANDATORY', renewalWindowDays: 30 },
        { type: 'MEDICAL_CERT', name: 'Surat Keterangan Sehat', criticality: 'RECOMMENDED', renewalWindowDays: 60 },
      ],
      activeUnitCount: 16,
    },
    {
      id: 'template-company-compliance',
      name: 'Corporate Fleet Operator License',
      code: 'COMPANY_OPERATOR',
      description: 'Legalitas korporasi operator armada logistik & transportasi',
      entityType: 'COMPANY',
      targetDescription: 'Kantor Pusat & Izin Operasional PT Logistik',
      requiredDocuments: [
        { type: 'BUSINESS_LICENSE', name: 'NIB & Izin Usaha Transportasi (SIUP-Komersil)', criticality: 'MANDATORY', renewalWindowDays: 90 },
        { type: 'OPERATING_LICENSE', name: 'Izin Trayek & Operasi Angkutan Barang Khusus', criticality: 'MANDATORY', renewalWindowDays: 60 },
        { type: 'COMPANY_INSURANCE', name: 'Asuransi Tanggung Jawab Hukum Pihak Ketiga (TPL)', criticality: 'MANDATORY', renewalWindowDays: 30 },
      ],
      activeUnitCount: 1,
    },
  ];

  public getTemplates(): DocumentRequirementTemplate[] {
    return this.templates;
  }

  public saveTemplate(tpl: DocumentRequirementTemplate): void {
    const idx = this.templates.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) {
      this.templates[idx] = tpl;
    } else {
      this.templates.push(tpl);
    }
  }

  /**
   * Evaluate compliance for a single entity (vehicle, driver, company)
   */
  public evaluateEntityCompliance(
    entityId: string,
    entityName: string,
    entityType: EntityType,
    category: string,
    existingDocs: DocumentItem[]
  ): EntityComplianceDetail {
    // Find matching template
    const template = this.templates.find(
      (t) => t.entityType === entityType && (category.includes(t.code) || t.entityType === entityType)
    ) || this.templates.find((t) => t.entityType === entityType);

    const requiredList = template ? template.requiredDocuments : [];
    const activeDocs = existingDocs.filter((d) => d.entityId === entityId && d.status !== 'ARCHIVED' && d.status !== 'REJECTED');

    let validCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let missingCount = 0;
    let hasOperationalRestriction = false;
    let restrictionReason = '';

    const docStatusItems = requiredList.map((req) => {
      // Find matching document
      const found = activeDocs.find(
        (d) => d.documentType === req.type || (req.type.startsWith('SIM') && d.documentType.startsWith('SIM'))
      );

      if (!found) {
        missingCount++;
        if (req.criticality === 'MANDATORY') {
          hasOperationalRestriction = true;
          restrictionReason = `Dokumen wajib ${req.name} belum terunggah (MISSING).`;
        }
        return {
          type: req.type,
          typeName: req.name,
          status: 'MISSING',
          isMandatory: req.criticality === 'MANDATORY',
        };
      }

      if (found.status === 'EXPIRED') {
        expiredCount++;
        if (req.criticality === 'MANDATORY') {
          hasOperationalRestriction = true;
          restrictionReason = `Dokumen wajib ${req.name} telah EXPIRED (${found.expiryDate}).`;
        }
      } else if (found.status === 'EXPIRING_SOON') {
        expiringCount++;
      } else if (found.status === 'VALID') {
        validCount++;
      }

      return {
        type: req.type,
        typeName: req.name,
        status: found.status,
        expiryDate: found.expiryDate,
        isMandatory: req.criticality === 'MANDATORY',
      };
    });

    // Score calculation
    const totalRequired = Math.max(requiredList.length, 1);
    const score = Math.round(((validCount + expiringCount * 0.7) / totalRequired) * 100);

    let complianceStatus: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' = 'COMPLIANT';
    if (score < 75 || expiredCount > 0 || (missingCount > 0 && hasOperationalRestriction)) {
      complianceStatus = 'NON_COMPLIANT';
    } else if (score < 95 || expiringCount > 0) {
      complianceStatus = 'PARTIALLY_COMPLIANT';
    }

    return {
      entityId,
      entityName,
      entityType,
      category,
      score: Math.min(score, 100),
      complianceStatus,
      hasOperationalRestriction,
      restrictionReason: hasOperationalRestriction ? restrictionReason : undefined,
      totalRequired: requiredList.length,
      validCount,
      expiringCount,
      expiredCount,
      missingCount,
      documents: docStatusItems,
    };
  }

  /**
   * Detect all missing required documents across entities
   */
  public detectMissingDocuments(
    entities: Array<{ id: string; name: string; type: EntityType; category: string }>,
    existingDocs: DocumentItem[]
  ): MissingDocumentItem[] {
    const missingItems: MissingDocumentItem[] = [];

    entities.forEach((entity) => {
      const template = this.templates.find((t) => t.entityType === entity.type);
      if (!template) return;

      const entityDocs = existingDocs.filter((d) => d.entityId === entity.id && d.status !== 'ARCHIVED');

      template.requiredDocuments.forEach((req) => {
        const found = entityDocs.some(
          (d) => d.documentType === req.type || (req.type.startsWith('SIM') && d.documentType.startsWith('SIM'))
        );

        if (!found) {
          missingItems.push({
            id: `missing-${entity.id}-${req.type}`,
            tenantId: 'tenant-default',
            entityType: entity.type,
            entityId: entity.id,
            entityName: entity.name,
            documentType: req.type,
            documentTypeName: req.name,
            requiredByTemplate: template.name,
            urgency: req.criticality === 'MANDATORY' ? 'CRITICAL' : 'HIGH',
            status: 'MISSING',
            impactDescription:
              req.criticality === 'MANDATORY'
                ? `Operasional unit/driver ${entity.name} terancam pembatasan dispatch karena tidak memiliki ${req.name}.`
                : `Direkomendasikan segera mengunggah ${req.name} untuk mempertahankan skor kepatuhan audit.`,
          });
        }
      });
    });

    return missingItems;
  }

  /**
   * Compute overall compliance summary for dashboard
   */
  public computeOverallCompliance(
    docs: DocumentItem[],
    missingDocs: MissingDocumentItem[],
    quota?: StorageQuotaInfo
  ): DocumentComplianceSummary {
    const activeDocs = docs.filter((d) => d.status !== 'ARCHIVED');

    const validCount = activeDocs.filter((d) => d.status === 'VALID').length;
    const expiringSoonCount = activeDocs.filter((d) => d.status === 'EXPIRING_SOON').length;
    const expiredCount = activeDocs.filter((d) => d.status === 'EXPIRED').length;
    const pendingVerificationCount = activeDocs.filter((d) => d.verificationStatus === 'PENDING').length;
    const rejectedCount = activeDocs.filter((d) => d.verificationStatus === 'REJECTED').length;
    const archivedCount = docs.filter((d) => d.status === 'ARCHIVED').length;
    const missingRequiredCount = missingDocs.filter((m) => m.urgency === 'CRITICAL').length;

    // Vehicle specific
    const vehicleDocs = activeDocs.filter((d) => d.entityType === 'VEHICLE');
    const vehicleValid = vehicleDocs.filter((d) => d.status === 'VALID').length;
    const vehicleExpiring = vehicleDocs.filter((d) => d.status === 'EXPIRING_SOON').length;
    const vehicleScore = vehicleDocs.length > 0 ? Math.round(((vehicleValid + vehicleExpiring * 0.7) / vehicleDocs.length) * 100) : 90;

    // Driver specific
    const driverDocs = activeDocs.filter((d) => d.entityType === 'DRIVER');
    const driverValid = driverDocs.filter((d) => d.status === 'VALID').length;
    const driverExpiring = driverDocs.filter((d) => d.status === 'EXPIRING_SOON').length;
    const driverScore = driverDocs.length > 0 ? Math.round(((driverValid + driverExpiring * 0.7) / driverDocs.length) * 100) : 95;

    // Company specific
    const companyDocs = activeDocs.filter((d) => d.entityType === 'COMPANY');
    const companyValid = companyDocs.filter((d) => d.status === 'VALID').length;
    const companyScore = companyDocs.length > 0 ? Math.round((companyValid / companyDocs.length) * 100) : 100;

    // Total fleet compliance
    const totalConsidered = activeDocs.length + missingRequiredCount;
    const fleetScore = totalConsidered > 0 ? Math.round(((validCount + expiringSoonCount * 0.6) / totalConsidered) * 100) : 92;

    const defaultQuota: StorageQuotaInfo = quota || {
      usedBytes: 4.8 * 1024 * 1024 * 1024,
      totalBytes: 25 * 1024 * 1024 * 1024,
      usedFormatted: '4.8 GB',
      totalFormatted: '25.0 GB',
      percentageUsed: 19.2,
      totalDocuments: activeDocs.length,
      maxDocumentsAllowed: 5000,
      ocrScansUsedMonth: 142,
      ocrScansLimitMonth: 500,
    };

    return {
      fleetComplianceScore: Math.min(fleetScore, 100),
      vehicleComplianceScore: Math.min(vehicleScore, 100),
      driverComplianceScore: Math.min(driverScore, 100),
      companyComplianceScore: Math.min(companyScore, 100),
      totalDocuments: activeDocs.length,
      validCount,
      expiringSoonCount,
      expiredCount,
      pendingVerificationCount,
      rejectedCount,
      missingRequiredCount,
      archivedCount,
      operationalRestrictionsActive: expiredCount + (missingRequiredCount > 0 ? 1 : 0),
      storageQuota: defaultQuota,
    };
  }
}

export const documentComplianceEngine = DocumentComplianceEngine.getInstance();
