/**
 * Fleet Intelligence Smart AI - Vehicle Inspection Core Engine & Service
 * Handles state management, scoring, vehicle grounding, work order generation, and offline sync.
 */

import { 
  VehicleInspection, 
  InspectionIssue, 
  InspectionTemplate, 
  InspectionAnalyticsData, 
  InspectionResult,
  InspectionItem,
  InspectionPhotoMetadata
} from '../types/inspection';
import { 
  mockVehicleInspections, 
  mockInspectionIssues, 
  mockInspectionTemplates, 
  mockInspectionAnalytics 
} from '../data/mockInspectionData';

const STORAGE_KEY_INSPECTIONS = 'fleet_vehicle_inspections';
const STORAGE_KEY_ISSUES = 'fleet_inspection_issues';
const STORAGE_KEY_TEMPLATES = 'fleet_inspection_templates';
const STORAGE_KEY_OFFLINE_QUEUE = 'fleet_inspection_offline_queue';

class InspectionService {
  private inspections: VehicleInspection[] = [];
  private issues: InspectionIssue[] = [];
  private templates: InspectionTemplate[] = [];
  private offlineQueue: VehicleInspection[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const storedIns = localStorage.getItem(STORAGE_KEY_INSPECTIONS);
      if (storedIns) {
        this.inspections = JSON.parse(storedIns);
      } else {
        this.inspections = [...mockVehicleInspections];
        this.saveInspections();
      }

      const storedIss = localStorage.getItem(STORAGE_KEY_ISSUES);
      if (storedIss) {
        this.issues = JSON.parse(storedIss);
      } else {
        this.issues = [...mockInspectionIssues];
        this.saveIssues();
      }

      const storedTmpl = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (storedTmpl) {
        this.templates = JSON.parse(storedTmpl);
      } else {
        this.templates = [...mockInspectionTemplates];
        this.saveTemplates();
      }

      const storedQueue = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
      if (storedQueue) {
        this.offlineQueue = JSON.parse(storedQueue);
      }
    } catch (e) {
      console.warn('Fallback to mock inspection data:', e);
      this.inspections = [...mockVehicleInspections];
      this.issues = [...mockInspectionIssues];
      this.templates = [...mockInspectionTemplates];
    }
  }

  private saveInspections() {
    try {
      localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(this.inspections));
      this.notify();
    } catch (e) {
      console.error('Failed to save inspections to storage', e);
    }
  }

  private saveIssues() {
    try {
      localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(this.issues));
      this.notify();
    } catch (e) {
      console.error('Failed to save issues to storage', e);
    }
  }

  private saveTemplates() {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(this.templates));
      this.notify();
    } catch (e) {
      console.error('Failed to save templates to storage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error('Inspection listener error:', err);
      }
    });
  }

  // --- QUERY METHODS ---

  public getInspections(tenantId?: string): VehicleInspection[] {
    if (!tenantId || tenantId === 'all') return this.inspections;
    return this.inspections.filter(i => i.tenantId === tenantId);
  }

  public getInspectionById(id: string): VehicleInspection | undefined {
    return this.inspections.find(i => i.id === id || i.inspectionNumber === id);
  }

  public getLatestInspectionForVehicle(vehicleId: string): VehicleInspection | undefined {
    return this.inspections
      .filter(i => i.vehicleId === vehicleId && i.status === 'SUBMITTED' || i.status === 'APPROVED')
      .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())[0];
  }

  public getIssues(tenantId?: string): InspectionIssue[] {
    if (!tenantId || tenantId === 'all') return this.issues;
    return this.issues.filter(i => i.tenantId === tenantId);
  }

  public getTemplates(tenantId?: string): InspectionTemplate[] {
    if (!tenantId || tenantId === 'all') return this.templates;
    return this.templates.filter(t => t.tenantId === tenantId || t.isDefault);
  }

  public getTemplateForVehicleType(vehicleType: string): InspectionTemplate {
    const found = this.templates.find(t => t.active && t.vehicleTypes.includes(vehicleType));
    return found || this.templates[0] || mockInspectionTemplates[0];
  }

  public getAnalytics(): InspectionAnalyticsData {
    const total = this.inspections.length;
    const pass = this.inspections.filter(i => i.result === 'PASS').length;
    const attention = this.inspections.filter(i => i.result === 'ATTENTION').length;
    const fail = this.inspections.filter(i => i.result === 'FAIL').length;
    const critical = this.inspections.filter(i => i.result === 'CRITICAL').length;
    const grounded = this.inspections.filter(i => i.grounded).length;
    const openIssues = this.issues.filter(i => i.status === 'OPEN' || i.status === 'IN_REVIEW' || i.status === 'WORK_ORDER_CREATED').length;

    return {
      ...mockInspectionAnalytics,
      totalInspections: total,
      passCount: pass,
      attentionCount: attention,
      failCount: fail,
      criticalCount: critical,
      groundedVehiclesCount: grounded,
      openIssuesCount: openIssues,
      passRatePercent: total > 0 ? Math.round((pass / total) * 100) : 100,
    };
  }

  // --- DISPATCH PROTECTION CHECK ---
  public isVehicleReadyForDispatch(vehicleId: string): { ready: boolean; reason?: string; lastInspection?: VehicleInspection } {
    const latest = this.getLatestInspectionForVehicle(vehicleId);
    if (!latest) {
      return {
        ready: false,
        reason: 'Kendaraan belum memiliki riwayat pemeriksaan pre-trip. Diperlukan inspeksi sebelum dapat diberangkatkan.',
      };
    }

    if (latest.grounded || latest.result === 'CRITICAL' || latest.result === 'FAIL') {
      return {
        ready: false,
        reason: `🚨 KENDARAAN DI-GROUNDED (${latest.groundingReason || 'Gagal Pre-Trip'}). Memerlukan peninjauan bengkel maintenance sebelum jalan.`,
        lastInspection: latest,
      };
    }

    // Check validity window (e.g. valid for 24 hours)
    const completedTime = new Date(latest.completedAt || latest.createdAt).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - completedTime > twentyFourHours) {
      return {
        ready: false,
        reason: 'Pemeriksaan Pre-Trip sebelumnya telah kedaluwarsa (> 24 jam). Harap lakukan inspeksi baru.',
        lastInspection: latest,
      };
    }

    return {
      ready: true,
      lastInspection: latest,
    };
  }

  // --- SUBMISSION & EVALUATION ENGINE ---

  public calculateInspectionResult(items: InspectionItem[], template: InspectionTemplate): {
    score: number;
    result: InspectionResult;
    grounded: boolean;
    groundingReasons: string[];
    criticalFailedItems: InspectionItem[];
  } {
    let totalMaxScore = 0;
    let earnedScore = 0;
    let hasCriticalFail = false;
    let hasRegularFail = false;
    let hasAttention = false;
    const groundingReasons: string[] = [];
    const criticalFailedItems: InspectionItem[] = [];

    items.forEach(item => {
      const maxPts = 10;
      totalMaxScore += maxPts;

      if (item.result === 'PASS') {
        earnedScore += maxPts;
      } else if (item.result === 'ATTENTION') {
        earnedScore += maxPts * 0.6;
        hasAttention = true;
      } else if (item.result === 'FAIL') {
        earnedScore += 0;
        hasRegularFail = true;

        if (item.severity === 'CRITICAL' || item.groundingTrigger) {
          hasCriticalFail = true;
          criticalFailedItems.push(item);
          groundingReasons.push(`${item.itemName} gagal verifikasi (Kritis).`);
        }
      }
    });

    const finalScore = totalMaxScore > 0 ? Math.round((earnedScore / totalMaxScore) * 100) : 100;

    let result: InspectionResult = 'PASS';
    let grounded = false;

    if (hasCriticalFail) {
      result = 'CRITICAL';
      grounded = true;
    } else if (hasRegularFail || finalScore < (template?.scoring?.attentionThreshold || 70)) {
      result = 'FAIL';
      grounded = false;
    } else if (hasAttention || finalScore < (template?.scoring?.passThreshold || 85)) {
      result = 'ATTENTION';
      grounded = false;
    } else {
      result = 'PASS';
      grounded = false;
    }

    return {
      score: finalScore,
      result,
      grounded,
      groundingReasons,
      criticalFailedItems,
    };
  }

  public submitInspection(data: {
    vehicleId: string;
    vehiclePlate: string;
    vehicleModel: string;
    vehicleType: string;
    driverId: string;
    driverName: string;
    tripId?: string;
    tripRoute?: string;
    type: 'PRE_TRIP' | 'POST_TRIP';
    odometer: number;
    previousOdometer: number;
    engineHours?: number;
    locationName: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    items: InspectionItem[];
    photos: InspectionPhotoMetadata[];
    signature: {
      signatureUrl: string;
      signedAt: string;
      signedBy: string;
      declarationAccepted: boolean;
    };
    templateId: string;
  }): VehicleInspection {
    const template = this.templates.find(t => t.id === data.templateId) || this.templates[0];
    const evaluation = this.calculateInspectionResult(data.items, template);

    const now = new Date().toISOString();
    const count = this.inspections.length + 1;
    const inspectionNumber = `INS-2026-${String(count).padStart(5, '0')}`;

    const newInspection: VehicleInspection = {
      id: `INS-ID-${Date.now()}`,
      tenantId: 'tenant-1',
      branchId: 'BR-001',
      inspectionNumber,
      vehicleId: data.vehicleId,
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel,
      vehicleType: data.vehicleType,
      driverId: data.driverId,
      driverName: data.driverName,
      tripId: data.tripId,
      tripRoute: data.tripRoute,
      type: data.type,
      status: 'SUBMITTED',
      result: evaluation.result,
      startedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      completedAt: now,
      odometer: data.odometer,
      previousOdometer: data.previousOdometer,
      odometerConsistent: data.odometer >= data.previousOdometer,
      engineHours: data.engineHours,
      locationName: data.locationName || 'Depot Operasional Armada',
      latitude: data.latitude || -6.2088,
      longitude: data.longitude || 106.8456,
      gpsAccuracy: 2.0,
      notes: data.notes || '',
      overallScore: evaluation.score,
      grounded: evaluation.grounded,
      groundingReason: evaluation.grounded ? `🚨 VEHICLE GROUNDED: ${evaluation.groundingReasons.join(', ')}` : undefined,
      signature: data.signature,
      items: data.items,
      photos: data.photos,
      complianceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      timeline: [
        {
          id: `TL-${Date.now()}-1`,
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString(),
          title: 'Inspeksi Dimulai',
          description: `Pemeriksaan ${data.type} oleh ${data.driverName} pada ${data.vehiclePlate}`,
          actor: data.driverName,
          type: 'start',
        },
        {
          id: `TL-${Date.now()}-2`,
          timestamp: new Date().toLocaleTimeString(),
          title: `Inspeksi Diselesaikan (Hasil: ${evaluation.result} - Skor: ${evaluation.score})`,
          description: evaluation.grounded 
            ? 'Kendaraan otomatis DI-GROUNDED dan dilarang jalan' 
            : 'Pemeriksaan tervalidasi dan siap operasional',
          actor: 'Inspection Engine',
          type: evaluation.grounded ? 'alert' : 'submit',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // If there are failures, create issues & auto Work Orders
    const failedItems = data.items.filter(i => i.result === 'FAIL' || i.result === 'ATTENTION');
    failedItems.forEach((fItem, idx) => {
      const issueId = `ISS-${Date.now()}-${idx}`;
      const hasWorkOrder = fItem.result === 'FAIL' && (fItem.severity === 'HIGH' || fItem.severity === 'CRITICAL');
      const workOrderNumber = hasWorkOrder ? `WO-2026-${String(Math.floor(1000 + Math.random() * 9000))}` : undefined;

      const newIssue: InspectionIssue = {
        id: issueId,
        tenantId: 'tenant-1',
        inspectionId: newInspection.id,
        inspectionNumber: newInspection.inspectionNumber,
        inspectionItemId: fItem.id,
        vehicleId: data.vehicleId,
        vehiclePlate: data.vehiclePlate,
        driverId: data.driverId,
        driverName: data.driverName,
        category: fItem.category,
        itemCode: fItem.itemCode,
        itemName: fItem.itemName,
        severity: fItem.severity || (fItem.result === 'FAIL' ? 'HIGH' : 'LOW'),
        description: fItem.notes || `Temuan ketidaksesuaian pada ${fItem.itemName}`,
        status: hasWorkOrder ? 'WORK_ORDER_CREATED' : 'OPEN',
        workOrderId: hasWorkOrder ? `WO-${Date.now()}` : undefined,
        workOrderNumber: workOrderNumber,
        photoUrls: fItem.photos.map(p => p.fileUrl),
        groundingIssue: Boolean(fItem.groundingTrigger || fItem.severity === 'CRITICAL'),
        reportedAt: now,
        createdAt: now,
      };

      this.issues.unshift(newIssue);

      if (hasWorkOrder && !newInspection.workOrderId) {
        newInspection.workOrderId = newIssue.workOrderId;
        newInspection.workOrderCreated = true;
      }
    });

    this.inspections.unshift(newInspection);
    this.saveInspections();
    this.saveIssues();

    return newInspection;
  }

  // --- POST REPAIR VERIFICATION ---
  public verifyAndResolveIssue(issueId: string, verifierName: string, notes: string, pass: boolean): boolean {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return false;

    issue.status = pass ? 'RESOLVED' : 'IN_REVIEW';
    issue.resolvedAt = new Date().toISOString();
    issue.resolvedBy = verifierName;
    issue.resolutionNotes = notes;
    issue.postRepairVerification = {
      verified: true,
      verificationDate: new Date().toISOString(),
      verifierName,
      result: pass ? 'PASS' : 'FAIL',
      notes,
    };

    // If the inspection was grounded, check if all critical issues are resolved to release vehicle
    if (pass && issue.groundingIssue) {
      const inspection = this.inspections.find(ins => ins.id === issue.inspectionId);
      if (inspection) {
        const remainingOpenGrounded = this.issues.filter(
          iss => iss.inspectionId === inspection.id && iss.groundingIssue && iss.status !== 'RESOLVED'
        );
        if (remainingOpenGrounded.length === 0) {
          inspection.grounded = false;
          inspection.groundingReason = undefined;
          inspection.timeline.push({
            id: `TL-REL-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            title: 'Kendaraan Dirilis (Vehicle Released)',
            description: `Seluruh perbaikan telah diverifikasi oleh ${verifierName}. Kendaraan kembali berstatus AVAILABLE.`,
            actor: verifierName,
            type: 'approval',
          });
        }
      }
    }

    this.saveIssues();
    this.saveInspections();
    return true;
  }

  // --- TEMPLATE MANAGEMENT ---
  public createTemplate(template: Omit<InspectionTemplate, 'id' | 'createdAt' | 'updatedAt'>): InspectionTemplate {
    const newTmpl: InspectionTemplate = {
      ...template,
      id: `TMPL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.unshift(newTmpl);
    this.saveTemplates();
    return newTmpl;
  }

  public updateTemplate(id: string, updates: Partial<InspectionTemplate>): boolean {
    const idx = this.templates.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.templates[idx] = {
      ...this.templates[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveTemplates();
    return true;
  }
}

export const inspectionService = new InspectionService();
