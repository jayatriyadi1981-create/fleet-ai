/**
 * Fleet Intelligence Smart AI - Command Center Reactive Service & Telematics Core
 * PROMPT 47 — 24/7 Mission-Critical Operational Command Center
 */

import { 
  CommandCenterHealth, 
  CommandCenterFleetKPIs, 
  EmergencyAlertItem, 
  CommandAlertItem, 
  DriverRiskItem, 
  VehicleRiskItem, 
  AIInsightCard, 
  CommandCenterEvent, 
  DispatchCandidate,
  CommandCenterSavedFilter,
  CommandCenterLayerConfig,
  CommandCenterDisplayMode,
  EmergencyType,
  EscalationTier
} from '../types/commandCenterTypes';

import { mockVehicles, mockDrivers, mockAlerts, mockAIInsights, mockBranches } from '../../../constants/mockData';
import { liveTrackingService } from '../../maps/services/liveTrackingService';
import { gpsSimulator } from '../../../services/gpsSimulator';
import { MapVehicle } from '../../maps/types';
import { commandCenterAudioService } from './commandCenterAudioService';

type CommandCenterSubscriber = () => void;

class CommandCenterService {
  private subscribers: Set<CommandCenterSubscriber> = new Set();

  // Core States
  private displayMode: CommandCenterDisplayMode = 'NORMAL';
  private activeFilter: CommandCenterSavedFilter = 'ALL';
  private selectedBranchId: string = 'ALL';
  private selectedVehicleId: string | null = null;
  private followingVehicleId: string | null = null;
  private activeEmergencyModalId: string | null = null;
  private isSmartDispatchModalOpen: boolean = false;
  private isSettingsModalOpen: boolean = false;
  private isAcknowledgeModalOpen: boolean = false;
  private targetAlertForAck: CommandAlertItem | EmergencyAlertItem | null = null;

  private layerConfig: CommandCenterLayerConfig = {
    showVehicles: true,
    showGeofences: true,
    showRoutes: true,
    showDepots: true,
    showEmergencyZones: true,
    showTraffic: false,
    clusteringEnabled: true,
  };

  private health: CommandCenterHealth = {
    gpsIngestion: 'HEALTHY',
    apiGateway: 'HEALTHY',
    realtimeWs: 'HEALTHY',
    notificationEngine: 'HEALTHY',
    aiEngine: 'HEALTHY',
    database: 'HEALTHY',
    lastHeartbeat: new Date().toISOString(),
    activeSockets: 48,
    packetsPerSec: 142.5,
  };

  private emergencies: EmergencyAlertItem[] = [];
  private commandAlerts: CommandAlertItem[] = [];
  private events: CommandCenterEvent[] = [];
  private aiInsights: AIInsightCard[] = [];
  private driverRisks: DriverRiskItem[] = [];
  private vehicleRisks: VehicleRiskItem[] = [];

  constructor() {
    this.initializeData();
    this.bindRealtimeListeners();
    this.startPeriodicHeartbeat();
  }

  private initializeData(): void {
    // 1. Initialize Emergency Alerts (Mock 1 Active SOS for immediate testing)
    this.emergencies = [
      {
        id: 'emg-sos-901',
        vehicleId: 'veh-001',
        plateNumber: 'B 9482 UTX',
        driverId: 'drv-001',
        driverName: 'Sutrisno Hartono',
        driverPhone: '+62 812-3456-7890',
        driverPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        type: 'PANIC',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        title: 'EMERGENCY SOS: Tombol Panik Ditekan Driver',
        description: 'Driver mengaktifkan tombol panik darurat di Tol Jakarta-Cikampek KM 28.5. Unit berhenti darurat di bahu jalan.',
        triggeredAt: new Date(Date.now() - 4 * 60000).toISOString(),
        location: { lat: -6.2941, lng: 106.8821, address: 'Tol Jakarta-Cikampek KM 28.5 (Arah Cikarang)' },
        currentSpeed: 0,
        batteryLevel: 88,
        fuelLevel: 74,
        escalationTier: 'DISPATCHER',
        broadcastSentTo: { whatsApp: true, sms: true, push: true, email: true },
        audioPlayed: false,
      },
    ];

    // 2. Initialize Command Alerts
    this.commandAlerts = mockAlerts.map((a) => ({
      id: a.id,
      vehicleId: a.vehicleId,
      plateNumber: mockVehicles.find((v) => v.id === a.vehicleId)?.plateNumber || 'B 9000 XYZ',
      driverName: mockDrivers.find((d) => d.assignedVehicleId === a.vehicleId)?.name || 'Driver Aktif',
      category: a.category,
      severity: a.severity,
      message: a.message,
      timestamp: a.timestamp,
      acknowledged: a.read,
      resolutionStatus: a.read ? 'RESOLVED' : 'OPEN',
      speed: a.category === 'speed' ? 92 : undefined,
    }));

    // 3. Initialize AI Insights
    this.aiInsights = [
      {
        id: 'ai-ins-01',
        title: 'Prediksi Anomali Konsumsi BBM & Potensi Kebocoran Jalur Solar',
        category: 'ANOMALY',
        severity: 'CRITICAL',
        confidenceScore: 94,
        evidenceText: 'Armada B 9211 TJP mengalami drop solar 18 Liter dalam 12 menit saat mesin idle di Depo Cikarang (Tingkat anomali: 4.8 sigma).',
        recommendedAction: 'Lakukan inspeksi fisik tangki & kirim instruksi cek mekanik ke Depo Cikarang.',
        actionType: 'SCHEDULE_MAINTENANCE',
        impactedUnits: ['B 9211 TJP'],
        estimatedImpact: 'Mencegah potensi kerugian bahan bakar Rp 2.400.000 / minggu',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 'ai-ins-02',
        title: 'Peringatan Risiko Fatigue Driver Menjelang Titik Kritis Jam Malam',
        category: 'SAFETY',
        severity: 'WARNING',
        confidenceScore: 89,
        evidenceText: 'Driver Agus Salim telah berkendara 6.2 jam tanpa jeda 30 menit. Sensor kamera ADAS merekam 3x eye-closure > 1.8 detik.',
        recommendedAction: 'Perintahkan singgah di Rest Area KM 57 Tol Trans-Jawa & aktifkan alarm kabin.',
        actionType: 'ALERT_DRIVER',
        impactedUnits: ['B 9821 UTX'],
        estimatedImpact: 'Mitigasi risiko microsleep dan kecelakaan fatal',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      },
      {
        id: 'ai-ins-03',
        title: 'Rekomendasi Re-Routing Otomatis Hindari Kemacetan Simpang Susun Cikunir',
        category: 'EFFICIENCY',
        severity: 'OPPORTUNITY',
        confidenceScore: 91,
        evidenceText: 'Terjadi antrean kendaraan 4.2 km di Ruas Tol Dalam Kota. 3 armada logistik terancam terlambat 45+ menit.',
        recommendedAction: 'Alihkan rute via JORR 2 (Cimanggis - Cibitung) untuk menghemat waktu 35 menit.',
        actionType: 'DISPATCH_REROUTE',
        impactedUnits: ['B 9104 KLO', 'B 9381 POX', 'B 9720 XYZ'],
        estimatedImpact: 'Hemat 35 menit waktu tempuh & 4.5 L BBM per unit',
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
      },
    ];

    // 4. Calculate Initial Driver Risks
    this.calculateDriverRisks();

    // 5. Calculate Initial Vehicle Risks
    this.calculateVehicleRisks();

    // 6. Generate Recent Operations Events
    this.events = [
      {
        id: 'evt-001',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        category: 'EMERGENCY',
        title: 'SOS Alert Triggered',
        description: 'Driver Sutrisno Hartono mengaktifkan Emergency SOS pada unit B 9482 UTX',
        vehicleId: 'veh-001',
        plateNumber: 'B 9482 UTX',
        driverName: 'Sutrisno Hartono',
        severity: 'CRITICAL',
      },
      {
        id: 'evt-002',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        category: 'SAFETY',
        title: 'Overspeed Terdeteksi (92 km/h)',
        description: 'Unit B 9482 UTX melebihi ambang batas kecepatan koridor Tol (Batas: 80 km/h)',
        vehicleId: 'veh-001',
        plateNumber: 'B 9482 UTX',
        driverName: 'Sutrisno Hartono',
        severity: 'HIGH',
      },
      {
        id: 'evt-003',
        timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
        category: 'FUEL',
        title: 'Fuel Anomaly Detected',
        description: 'Penurunan level solar tajam terdeteksi pada tangki armada B 9211 TJP',
        vehicleId: 'veh-002',
        plateNumber: 'B 9211 TJP',
        driverName: 'Agus Salim',
        severity: 'HIGH',
      },
      {
        id: 'evt-004',
        timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
        category: 'DELIVERY',
        title: 'Geofence Arrival (Depo Cikarang)',
        description: 'Unit B 9104 KLO memasuki zona Geofence Depo Logistik Cikarang',
        vehicleId: 'veh-003',
        plateNumber: 'B 9104 KLO',
        driverName: 'Bambang Irawan',
        severity: 'INFO',
      },
      {
        id: 'evt-005',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        category: 'GPS',
        title: 'GPS Sinyal Pulih',
        description: 'Unit B 9821 UTX tersambung kembali ke Gateway Telematika JT808',
        vehicleId: 'veh-004',
        plateNumber: 'B 9821 UTX',
        driverName: 'Rudi Hermawan',
        severity: 'INFO',
      },
    ];
  }

  private calculateDriverRisks(): void {
    this.driverRisks = mockDrivers.map((driver) => {
      const assignedVehicle = mockVehicles.find((v) => v.id === driver.assignedVehicleId || v.currentDriverId === driver.id);
      
      // Calculate risk score based on speed, fatigue, braking, safety
      let riskScore = 100 - driver.score.overallScore;
      if (driver.score.fatigueAlertsCount > 1) riskScore += 15;
      if (driver.score.speedingCount > 2) riskScore += 10;
      if (driver.score.harshBrakingCount > 2) riskScore += 8;
      riskScore = Math.min(99, Math.max(5, riskScore));

      let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (riskScore >= 60) riskLevel = 'HIGH';
      else if (riskScore >= 35) riskLevel = 'MEDIUM';

      const primaryRisks: string[] = [];
      if (driver.score.speedingCount > 0) primaryRisks.push(`Kecepatan (${driver.score.speedingCount}x)`);
      if (driver.score.fatigueAlertsCount > 0) primaryRisks.push(`Kelelahan (${driver.score.fatigueAlertsCount}x)`);
      if (driver.score.harshBrakingCount > 0) primaryRisks.push(`Rem Mendadak (${driver.score.harshBrakingCount}x)`);
      if (primaryRisks.length === 0) primaryRisks.push('Operasional Normal');

      return {
        driverId: driver.id,
        driverName: driver.name,
        phone: driver.phone,
        photoUrl: driver.photoUrl,
        riskScore,
        riskLevel,
        primaryRisks,
        vehicleId: assignedVehicle?.id,
        plateNumber: assignedVehicle?.plateNumber,
        speedingIncidents24h: driver.score.speedingCount,
        harshBraking24h: driver.score.harshBrakingCount,
        fatigueAlerts24h: driver.score.fatigueAlertsCount,
        activeTripDurationHours: +(Math.random() * 4 + 2).toFixed(1),
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }

  private calculateVehicleRisks(): void {
    const risks: VehicleRiskItem[] = [];

    mockVehicles.forEach((v) => {
      const branch = mockBranches.find((b) => b.id === v.branchId)?.name || 'Cabang Utama';

      if (v.status === 'offline') {
        risks.push({
          vehicleId: v.id,
          plateNumber: v.plateNumber,
          brandModel: `${v.brand} ${v.model}`,
          riskCategory: 'HIGH',
          issueType: 'GPS_LOST',
          title: 'Hilang Sinyal GPS > 2 Jam',
          metricValue: 'Sinyal 0% (Offline)',
          lastSeen: '2 jam yang lalu',
          branchName: branch,
        });
      }

      if (v.maintenanceOverdue) {
        risks.push({
          vehicleId: v.id,
          plateNumber: v.plateNumber,
          brandModel: `${v.brand} ${v.model}`,
          riskCategory: 'CRITICAL',
          issueType: 'MAINTENANCE_OVERDUE',
          title: 'Servis Berkala & Uji KIR Terlewat',
          metricValue: 'Overdue +1,240 KM',
          lastSeen: 'Aktif',
          branchName: branch,
        });
      }

      if (v.latestTelemetry && v.latestTelemetry.fuelLevelPercent < 15) {
        risks.push({
          vehicleId: v.id,
          plateNumber: v.plateNumber,
          brandModel: `${v.brand} ${v.model}`,
          riskCategory: 'MEDIUM',
          issueType: 'FUEL_ANOMALY',
          title: 'BBM Kritis di Bawah 15%',
          metricValue: `${v.latestTelemetry.fuelLevelPercent}% tersisa`,
          lastSeen: 'Aktif',
          branchName: branch,
        });
      }

      if (v.latestTelemetry && v.latestTelemetry.batteryVoltage < 11.8) {
        risks.push({
          vehicleId: v.id,
          plateNumber: v.plateNumber,
          brandModel: `${v.brand} ${v.model}`,
          riskCategory: 'HIGH',
          issueType: 'BATTERY_LOW',
          title: 'Tegangan Aki Lemah (Battery Low)',
          metricValue: `${v.latestTelemetry.batteryVoltage} V`,
          lastSeen: 'Aktif',
          branchName: branch,
        });
      }
    });

    this.vehicleRisks = risks.sort((a, b) => {
      const order = { CRITICAL: 3, HIGH: 2, MEDIUM: 1 };
      return order[b.riskCategory] - order[a.riskCategory];
    });
  }

  private bindRealtimeListeners(): void {
    // Listen to live tracking updates and sync emergencies / sound
    liveTrackingService.subscribe((updatedVehicles) => {
      // Check if any active emergency exists that needs audio
      const hasActiveEmergency = this.emergencies.some((e) => e.status === 'ACTIVE');
      if (hasActiveEmergency) {
        commandCenterAudioService.startEmergencySiren();
      } else {
        commandCenterAudioService.stopEmergencySiren();
      }

      // Update health packet metrics
      this.health.packetsPerSec = +(130 + Math.random() * 25).toFixed(1);
      this.health.lastHeartbeat = new Date().toISOString();

      this.notifySubscribers();
    });
  }

  private startPeriodicHeartbeat(): void {
    setInterval(() => {
      this.health.lastHeartbeat = new Date().toISOString();
      this.calculateDriverRisks();
      this.calculateVehicleRisks();
      this.notifySubscribers();
    }, 15000);
  }

  public subscribe(cb: CommandCenterSubscriber): () => void {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Subscriber error:', e);
      }
    });
  }

  // ==========================================
  // GETTERS
  // ==========================================

  public getHealth(): CommandCenterHealth {
    return { ...this.health };
  }

  public getDisplayMode(): CommandCenterDisplayMode {
    return this.displayMode;
  }

  public setDisplayMode(mode: CommandCenterDisplayMode): void {
    this.displayMode = mode;
    this.notifySubscribers();
  }

  public getActiveFilter(): CommandCenterSavedFilter {
    return this.activeFilter;
  }

  public setActiveFilter(filter: CommandCenterSavedFilter): void {
    this.activeFilter = filter;
    this.notifySubscribers();
  }

  public getSelectedBranchId(): string {
    return this.selectedBranchId;
  }

  public setSelectedBranchId(branchId: string): void {
    this.selectedBranchId = branchId;
    this.notifySubscribers();
  }

  public getSelectedVehicleId(): string | null {
    return this.selectedVehicleId;
  }

  public setSelectedVehicleId(id: string | null): void {
    this.selectedVehicleId = id;
    this.notifySubscribers();
  }

  public getFollowingVehicleId(): string | null {
    return this.followingVehicleId;
  }

  public setFollowingVehicleId(id: string | null): void {
    this.followingVehicleId = id;
    this.notifySubscribers();
  }

  public getLayerConfig(): CommandCenterLayerConfig {
    return { ...this.layerConfig };
  }

  public updateLayerConfig(partial: Partial<CommandCenterLayerConfig>): void {
    this.layerConfig = { ...this.layerConfig, ...partial };
    this.notifySubscribers();
  }

  public getKPIs(): CommandCenterFleetKPIs {
    const all = liveTrackingService.getAllVehicles();
    let filtered = all;
    if (this.selectedBranchId !== 'ALL') {
      filtered = filtered.filter((v) => v.branchId === this.selectedBranchId);
    }

    const moving = filtered.filter((v) => v.status === 'Moving').length;
    const stopped = filtered.filter((v) => v.status === 'Stopped').length;
    const idle = filtered.filter((v) => v.status === 'Idle').length;
    const offline = filtered.filter((v) => v.status === 'Offline').length;
    const maintenance = mockVehicles.filter((v) => v.status === 'maintenance' || v.status === 'under_maintenance').length;
    const emergency = this.emergencies.filter((e) => e.status === 'ACTIVE' || e.status === 'INVESTIGATING').length;

    return {
      total: filtered.length,
      moving,
      stopped,
      idle,
      offline,
      maintenance,
      emergency,
    };
  }

  public getEmergencies(): EmergencyAlertItem[] {
    return [...this.emergencies];
  }

  public getCommandAlerts(): CommandAlertItem[] {
    return [...this.commandAlerts];
  }

  public getAIInsights(): AIInsightCard[] {
    return this.aiInsights.filter((i) => !i.dismissed);
  }

  public getDriverRisks(): DriverRiskItem[] {
    return [...this.driverRisks];
  }

  public getVehicleRisks(): VehicleRiskItem[] {
    return [...this.vehicleRisks];
  }

  public getEvents(): CommandCenterEvent[] {
    return [...this.events];
  }

  // ==========================================
  // EMERGENCY ACTIONS & WORKFLOW
  // ==========================================

  public triggerEmergencySOS(data: {
    vehicleId: string;
    plateNumber: string;
    driverId: string;
    driverName: string;
    driverPhone: string;
    type: EmergencyType;
    description: string;
    location: { lat: number; lng: number; address?: string };
  }): EmergencyAlertItem {
    const newEmergency: EmergencyAlertItem = {
      id: `emg-${Date.now()}`,
      vehicleId: data.vehicleId,
      plateNumber: data.plateNumber,
      driverId: data.driverId,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      type: data.type,
      severity: 'CRITICAL',
      status: 'ACTIVE',
      title: `EMERGENCY ${data.type}: ${data.plateNumber}`,
      description: data.description,
      triggeredAt: new Date().toISOString(),
      location: data.location,
      currentSpeed: 0,
      batteryLevel: 92,
      fuelLevel: 75,
      escalationTier: 'DISPATCHER',
      broadcastSentTo: { whatsApp: true, sms: true, push: true, email: true },
      audioPlayed: false,
    };

    this.emergencies.unshift(newEmergency);

    // Add to event timeline
    this.addEvent({
      category: 'EMERGENCY',
      title: `Emergency ${data.type} Triggered`,
      description: `Unit ${data.plateNumber} (${data.driverName}) melaporkan kondisi darurat.`,
      vehicleId: data.vehicleId,
      plateNumber: data.plateNumber,
      driverName: data.driverName,
      severity: 'CRITICAL',
    });

    commandCenterAudioService.playEmergencyBeep();
    commandCenterAudioService.startEmergencySiren();

    this.notifySubscribers();
    return newEmergency;
  }

  public acknowledgeEmergency(emergencyId: string, userName: string, notes?: string): void {
    const emg = this.emergencies.find((e) => e.id === emergencyId);
    if (emg) {
      emg.status = 'ACKNOWLEDGED';
      emg.acknowledgedBy = {
        userId: 'usr-operator-01',
        userName: userName || 'Operator Command Center',
        timestamp: new Date().toISOString(),
        notes,
      };

      // Stop siren if no other active emergency
      const remainingActive = this.emergencies.some((e) => e.status === 'ACTIVE' && e.id !== emergencyId);
      if (!remainingActive) {
        commandCenterAudioService.stopEmergencySiren();
      }

      this.addEvent({
        category: 'EMERGENCY',
        title: 'Emergency Acknowledged',
        description: `Insiden ${emg.plateNumber} telah dikonfirmasi oleh ${userName}`,
        vehicleId: emg.vehicleId,
        plateNumber: emg.plateNumber,
        driverName: emg.driverName,
        severity: 'HIGH',
      });

      this.notifySubscribers();
    }
  }

  public resolveEmergency(emergencyId: string, userName: string, resolutionNotes: string): void {
    const emg = this.emergencies.find((e) => e.id === emergencyId);
    if (emg) {
      emg.status = 'RESOLVED';
      emg.resolutionNotes = resolutionNotes;
      emg.resolvedBy = {
        userId: 'usr-operator-01',
        userName: userName || 'Operator Command Center',
        timestamp: new Date().toISOString(),
      };

      commandCenterAudioService.stopEmergencySiren();

      this.addEvent({
        category: 'EMERGENCY',
        title: 'Emergency Resolved',
        description: `Insiden ${emg.plateNumber} diselesaikan: ${resolutionNotes}`,
        vehicleId: emg.vehicleId,
        plateNumber: emg.plateNumber,
        driverName: emg.driverName,
        severity: 'INFO',
      });

      this.notifySubscribers();
    }
  }

  public escalateEmergency(emergencyId: string, targetTier: EscalationTier): void {
    const emg = this.emergencies.find((e) => e.id === emergencyId);
    if (emg) {
      emg.escalationTier = targetTier;
      emg.status = 'INVESTIGATING';

      this.addEvent({
        category: 'EMERGENCY',
        title: `Incident Escalated to ${targetTier}`,
        description: `Insiden darurat ${emg.plateNumber} dieskalasi ke tingkat ${targetTier}`,
        vehicleId: emg.vehicleId,
        plateNumber: emg.plateNumber,
        severity: 'HIGH',
      });

      this.notifySubscribers();
    }
  }

  // ==========================================
  // SMART DISPATCH CANDIDATES ENGINE
  // ==========================================

  public findDispatchCandidates(targetLat: number, targetLng: number): DispatchCandidate[] {
    const allMapVehicles = liveTrackingService.getAllVehicles();

    const candidates: DispatchCandidate[] = allMapVehicles
      .filter((v) => v.status !== 'Offline')
      .map((v) => {
        // Haversine distance
        const dLat = (v.latitude - targetLat) * 111.32;
        const dLng = (v.longitude - targetLng) * 111.32 * Math.cos((targetLat * Math.PI) / 180);
        const distanceKm = +(Math.sqrt(dLat * dLat + dLng * dLng)).toFixed(1);

        // Approximate ETA (assuming 45 km/h urban average)
        const etaMinutes = Math.max(3, Math.round((distanceKm / 45) * 60));

        let currentStatus: 'idle' | 'parking' | 'moving' = 'parking';
        if (v.status === 'Moving') currentStatus = 'moving';
        else if (v.status === 'Idle') currentStatus = 'idle';

        const driverScore = v.driverScore || 85;

        // Suitability calculation: closer distance + higher driver safety score + available status
        let suitabilityScore = 100 - distanceKm * 3 + (driverScore - 70) * 0.5;
        if (v.status === 'Idle' || v.status === 'Stopped') suitabilityScore += 15;
        if (v.fuelLevelPercent < 30) suitabilityScore -= 25;
        suitabilityScore = Math.min(99, Math.max(20, Math.round(suitabilityScore)));

        let recommendationReason = 'Armada terdekat siap jalan';
        if (v.status === 'Idle') recommendationReason = 'Unit sedang stand by di area dekat lokasi';
        if (v.fuelLevelPercent > 70 && driverScore > 90) recommendationReason = 'Kombinasi BBM optimal dan skor keselamatan pengemudi tinggi';

        return {
          vehicleId: v.vehicleId,
          plateNumber: v.vehiclePlate,
          brandModel: v.vehicleName,
          driverId: v.driverId || 'drv-gen',
          driverName: v.driverName || 'Driver Stanby',
          driverPhone: v.driverPhone || '+62 812-0000-1111',
          distanceKm,
          etaMinutes,
          currentStatus,
          safetyScore: driverScore,
          suitabilityScore,
          fuelLevelPercent: v.fuelLevelPercent,
          recommendationReason,
          location: { lat: v.latitude, lng: v.longitude },
        };
      })
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return candidates.slice(0, 6);
  }

  public dispatchCandidateToEmergency(emergencyId: string, candidate: DispatchCandidate): void {
    const emg = this.emergencies.find((e) => e.id === emergencyId);
    if (emg) {
      emg.status = 'DISPATCHED';
      emg.dispatchedUnitId = candidate.vehicleId;
      emg.dispatchedDriverName = candidate.driverName;

      this.addEvent({
        category: 'DELIVERY',
        title: 'Emergency Unit Dispatched',
        description: `Unit ${candidate.plateNumber} (${candidate.driverName}) ditugaskan menuju lokasi ${emg.plateNumber} (ETA: ${candidate.etaMinutes} mnt).`,
        vehicleId: candidate.vehicleId,
        plateNumber: candidate.plateNumber,
        driverName: candidate.driverName,
        severity: 'HIGH',
      });

      this.notifySubscribers();
    }
  }

  // ==========================================
  // ALERT ACKNOWLEDGMENT
  // ==========================================

  public acknowledgeAlert(alertId: string, userName: string, notes?: string): void {
    const alert = this.commandAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userName;
      alert.acknowledgedAt = new Date().toISOString();
      alert.resolutionStatus = 'IN_PROGRESS';
      alert.resolutionNotes = notes;

      this.addEvent({
        category: 'ALERT',
        title: 'Alert Acknowledged',
        description: `${alert.message} dikonfirmasi oleh ${userName}`,
        vehicleId: alert.vehicleId,
        plateNumber: alert.plateNumber,
        severity: 'MEDIUM',
      });

      this.notifySubscribers();
    }
  }

  public dismissAIInsight(id: string): void {
    const ins = this.aiInsights.find((i) => i.id === id);
    if (ins) {
      ins.dismissed = true;
      this.notifySubscribers();
    }
  }

  public addEvent(eventData: Omit<CommandCenterEvent, 'id' | 'timestamp'>): void {
    const newEvent: CommandCenterEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...eventData,
    };
    this.events.unshift(newEvent);
    if (this.events.length > 50) {
      this.events.pop();
    }
    this.notifySubscribers();
  }

  // Modal Control
  public getActiveEmergencyModalId(): string | null {
    return this.activeEmergencyModalId;
  }
  public setActiveEmergencyModalId(id: string | null): void {
    this.activeEmergencyModalId = id;
    this.notifySubscribers();
  }

  public getIsSmartDispatchOpen(): boolean {
    return this.isSmartDispatchModalOpen;
  }
  public setIsSmartDispatchOpen(open: boolean): void {
    this.isSmartDispatchModalOpen = open;
    this.notifySubscribers();
  }

  public getIsSettingsOpen(): boolean {
    return this.isSettingsModalOpen;
  }
  public setIsSettingsOpen(open: boolean): void {
    this.isSettingsModalOpen = open;
    this.notifySubscribers();
  }

  public getIsAcknowledgeModalOpen(): boolean {
    return this.isAcknowledgeModalOpen;
  }
  public openAcknowledgeModal(target: CommandAlertItem | EmergencyAlertItem): void {
    this.targetAlertForAck = target;
    this.isAcknowledgeModalOpen = true;
    this.notifySubscribers();
  }
  public closeAcknowledgeModal(): void {
    this.isAcknowledgeModalOpen = false;
    this.targetAlertForAck = null;
    this.notifySubscribers();
  }
  public getTargetAlertForAck(): CommandAlertItem | EmergencyAlertItem | null {
    return this.targetAlertForAck;
  }
}

export const commandCenterService = new CommandCenterService();
