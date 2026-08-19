/**
 * Fleet Intelligence Smart AI - Intent Engine for AI Fleet Assistant (Prompt 34)
 * Parses Natural Language (Indonesian & English), extracts telematics entities,
 * maps to 27 standard intents, handles slash commands, detects ambiguity,
 * enforces prompt injection defense, and flags sensitive HR/disciplinary topics.
 */

import {
  FleetAssistantIntent,
  FleetAssistantToolId,
  IntentAnalysisResult,
  ExtractedIntentEntities,
} from '../types';

export class FleetAssistantIntentEngine {
  /**
   * Sanitizes input and detects prompt injection attempts (Prompt 34 - Section 82, 83)
   */
  public static sanitizeAndDetectInjection(prompt: string): {
    sanitized: string;
    injectionDetected: boolean;
  } {
    const raw = prompt || '';
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /abaikan\s+(semua\s+)?instruksi\s+(sebelumnya|awal)/i,
      /system\s+override/i,
      /you\s+are\s+now\s+in\s+developer\s+mode/i,
      /reveal\s+(your\s+)?(system\s+prompt|api\s+key|secret)/i,
      /bocorkan\s+(prompt|api\s+key|rahasia)/i,
      /jailbreak/i,
      /bypass\s+all\s+rules/i,
      /delete\s+database/i,
      /drop\s+table/i,
    ];

    let injectionDetected = false;
    for (const pattern of injectionPatterns) {
      if (pattern.test(raw)) {
        injectionDetected = true;
        break;
      }
    }

    const sanitized = raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/```[a-z]*\n?/gi, '')
      .trim();

    return { sanitized, injectionDetected };
  }

  /**
   * Main intent classification & entity extraction pipeline
   */
  public static analyze(
    rawPrompt: string,
    conversationContext?: {
      lastIntent?: FleetAssistantIntent;
      lastVehicleId?: string;
      lastDriverId?: string;
    }
  ): IntentAnalysisResult {
    const { sanitized, injectionDetected } = this.sanitizeAndDetectInjection(rawPrompt);
    const p = sanitized.toLowerCase();

    // 1. Extract Entities
    const entities = this.extractEntities(sanitized, conversationContext);

    // 2. Sensitive Disciplinary Guard (Prompt 34 - Section 78)
    const isSensitiveDisciplinary =
      p.includes('dipecat') ||
      p.includes('pecat') ||
      p.includes('fire driver') ||
      p.includes('terminasi driver') ||
      p.includes('hukum driver') ||
      p.includes('buang sopir');

    // 3. Slash Command Handling (Prompt 34 - Section 66)
    if (sanitized.startsWith('/')) {
      return this.handleSlashCommand(sanitized, entities, injectionDetected);
    }

    // 4. Follow-up Context Resolution (Prompt 34 - Section 45)
    if (
      (p.includes('tampilkan detail') ||
        p.includes('tampilkan 5') ||
        p.includes('mana yang paling lama') ||
        p.includes('kenapa?') ||
        p.includes('mengapa?') ||
        p.includes('siapa saja')) &&
      conversationContext?.lastIntent
    ) {
      return this.resolveFollowUpIntent(p, entities, conversationContext, sanitized, injectionDetected);
    }

    // 5. Intent Mapping Table (27 telematics intents)
    let intent: FleetAssistantIntent = 'GENERAL_QUERY';
    let confidence = 0.85;
    let isAmbiguous = false;
    let clarificationPrompt: string | undefined;
    let suggestedTools: FleetAssistantToolId[] = ['getFleetSummary'];
    let isActionable = false;

    // AI Insight / Priority Queries (Prompt 34 - Section 40)
    if (
      p.includes('prioritas') ||
      p.includes('prioritaskan') ||
      p.includes('fokus hari ini') ||
      p.includes('apa yang harus saya prioritaskan') ||
      p.includes('priority today') ||
      p.includes('briefing') ||
      p.includes('morning brief')
    ) {
      intent = 'AI_INSIGHT';
      suggestedTools = ['getFleetAIInsights', 'getActiveAlerts'];
      confidence = 0.98;
      isActionable = true;
    }
    // Offline Vehicles / GPS Loss (Prompt 34 - Section 19, 20)
    else if (
      p.includes('offline') ||
      p.includes('hilang sinyal') ||
      p.includes('mobil mati') ||
      p.includes('kendaraan mati') ||
      p.includes('tidak mengirim gps') ||
      p.includes('gps mati') ||
      p.includes('no signal') ||
      p.includes('terputus')
    ) {
      intent = 'VEHICLE_OFFLINE';
      suggestedTools = ['getOfflineVehicles', 'getGPSStatus'];
      confidence = 0.97;
    }
    // Vehicle Location / "Dimana B 1234 XX" (Prompt 34 - Section 22)
    else if (
      (p.includes('dimana') || p.includes('posisi') || p.includes('lokasi') || p.includes('where is')) &&
      (entities.plateNumber || entities.vehicleId || entities.driverName)
    ) {
      intent = 'VEHICLE_LOCATION';
      suggestedTools = ['getVehicleLocation'];
      confidence = 0.98;
    }
    // Vehicle Status / Moving / Idle (Prompt 34 - Section 21)
    else if (
      p.includes('kendaraan yang sedang berjalan') ||
      p.includes('sedang bergerak') ||
      p.includes('sedang idle') ||
      p.includes('sedang parkir') ||
      p.includes('status unit') ||
      p.includes('status armada')
    ) {
      intent = 'VEHICLE_STATUS';
      suggestedTools = ['getVehicleStatus'];
      confidence = 0.94;
    }
    // Fuel Anomaly / Drainage (Prompt 34 - Section 24, 25)
    else if (
      p.includes('anomali bbm') ||
      p.includes('pencurian bbm') ||
      p.includes('kebocoran bbm') ||
      p.includes('fuel drain') ||
      p.includes('bbm hilang') ||
      p.includes('solar anjlok')
    ) {
      intent = 'FUEL_ANOMALY';
      suggestedTools = ['getFuelAnomalies', 'getFuelSummary'];
      confidence = 0.96;
    }
    // Fuel Analysis / "Kenapa BBM meningkat?" (Prompt 34 - Section 24, 25, 26)
    else if (
      p.includes('bbm') ||
      p.includes('fuel') ||
      p.includes('solar') ||
      p.includes('boros') ||
      p.includes('konsumsi bbm') ||
      p.includes('cost/km') ||
      p.includes('biaya bbm')
    ) {
      intent = 'FUEL_ANALYSIS';
      suggestedTools = ['getFuelSummary', 'getFuelTrend', 'getFuelAnomalies'];
      confidence = 0.95;
    }
    // Driver Risk & Behavior (Prompt 34 - Section 27, 28)
    else if (
      p.includes('driver mana paling berisiko') ||
      p.includes('driver paling berisiko') ||
      p.includes('siapa driver paling berisiko') ||
      p.includes('driver paling bahaya') ||
      p.includes('pengemudi berisiko') ||
      p.includes('high risk driver') ||
      p.includes('kenapa driver') ||
      p.includes('kenapa andi') ||
      p.includes('kenapa budi') ||
      p.includes('kenapa hartono')
    ) {
      intent = 'DRIVER_RISK';
      suggestedTools = ['getDriverRisk', 'getDriverBehavior'];
      confidence = 0.96;
    }
    // Driver Behavior / Overspeed / Harsh Braking
    else if (
      p.includes('overspeed') ||
      p.includes('harsh braking') ||
      p.includes('harsh acceleration') ||
      p.includes('ngerem mendadak') ||
      p.includes('ngebut') ||
      p.includes('perilaku driver')
    ) {
      intent = 'DRIVER_BEHAVIOR';
      suggestedTools = ['getDriverBehavior', 'getDriverRisk'];
      confidence = 0.94;
    }
    // Driver Status
    else if (p.includes('driver') || p.includes('pengemudi') || p.includes('supir') || p.includes('sopir')) {
      intent = 'DRIVER_STATUS';
      suggestedTools = ['getDriverSummary'];
      confidence = 0.88;
    }
    // Maintenance Due & Urgent Service (Prompt 34 - Section 30, 31)
    else if (
      p.includes('harus service') ||
      p.includes('harus servis') ||
      p.includes('perlu servis') ||
      p.includes('overdue maintenance') ||
      p.includes('jatuh tempo service') ||
      p.includes('jadwal servis') ||
      p.includes('work order') ||
      p.includes('bengkel')
    ) {
      intent = 'MAINTENANCE_DUE';
      suggestedTools = ['getMaintenanceDue', 'getMaintenanceRisk'];
      confidence = 0.96;
      isActionable = true;
    }
    // Maintenance Risk
    else if (
      p.includes('urgent service') ||
      p.includes('paling urgent') ||
      p.includes('breakdown risk') ||
      p.includes('kerusakan kritis') ||
      p.includes('risiko maintenance')
    ) {
      intent = 'MAINTENANCE_RISK';
      suggestedTools = ['getMaintenanceRisk', 'getMaintenanceDue'];
      confidence = 0.95;
    }
    // Maintenance Status
    else if (p.includes('maintenance') || p.includes('pemeliharaan') || p.includes('servis')) {
      intent = 'MAINTENANCE_STATUS';
      suggestedTools = ['getMaintenanceSummary'];
      confidence = 0.89;
    }
    // Delayed Trips (Prompt 34 - Section 32)
    else if (
      p.includes('trip mana yang terlambat') ||
      p.includes('trip terlambat') ||
      p.includes('eta terlambat') ||
      p.includes('pengiriman telat') ||
      p.includes('delivery delay') ||
      p.includes('terlambat')
    ) {
      intent = 'TRIP_DELAY';
      suggestedTools = ['getDelayedTrips', 'getTripSummary'];
      confidence = 0.95;
    }
    // Trip Status
    else if (p.includes('trip') || p.includes('perjalanan') || p.includes('delivery') || p.includes('ritase')) {
      intent = 'TRIP_STATUS';
      suggestedTools = ['getTripSummary'];
      confidence = 0.90;
    }
    // Route Risk (Prompt 34 - Section 33)
    else if (
      p.includes('rute mana paling berisiko') ||
      p.includes('rute paling berisiko') ||
      p.includes('rute bermasalah') ||
      p.includes('jalur rawan') ||
      p.includes('route risk')
    ) {
      intent = 'ROUTE_RISK';
      suggestedTools = ['getRouteRisk', 'getRouteSummary'];
      confidence = 0.95;
    }
    // Route Status
    else if (p.includes('rute') || p.includes('route') || p.includes('jalur')) {
      intent = 'ROUTE_STATUS';
      suggestedTools = ['getRouteSummary'];
      confidence = 0.88;
    }
    // Fatigue Risk (Prompt 34 - Section 35)
    else if (
      p.includes('fatigue') ||
      p.includes('kelelahan') ||
      p.includes('mengantuk') ||
      p.includes('jam kerja berlebih') ||
      p.includes('driver lelah')
    ) {
      intent = 'FATIGUE_RISK';
      suggestedTools = ['getFatigueRisk', 'getSafetySummary'];
      confidence = 0.97;
    }
    // Safety Risk / Safety Score Drop (Prompt 34 - Section 34, 42)
    else if (
      p.includes('safety score fleet turun') ||
      p.includes('safety turun') ||
      p.includes('risiko keselamatan') ||
      p.includes('safety risk')
    ) {
      intent = 'SAFETY_RISK';
      suggestedTools = ['getSafetyRisk', 'getSafetySummary', 'getFatigueRisk'];
      confidence = 0.96;
    }
    // Incident & Accident Analysis
    else if (p.includes('insiden') || p.includes('incident') || p.includes('near miss')) {
      intent = 'INCIDENT_ANALYSIS';
      suggestedTools = ['getIncidentSummary', 'getSafetySummary'];
      confidence = 0.93;
    } else if (p.includes('kecelakaan') || p.includes('accident') || p.includes('tabrakan')) {
      intent = 'ACCIDENT_ANALYSIS';
      suggestedTools = ['getAccidentSummary', 'getSafetySummary'];
      confidence = 0.94;
    }
    // Safety Status
    else if (p.includes('safety') || p.includes('keselamatan') || p.includes('k3')) {
      intent = 'SAFETY_STATUS';
      suggestedTools = ['getSafetySummary', 'getSafetyRisk'];
      confidence = 0.92;
    }
    // GPS & Device Health (Prompt 34 - Section 36, 37)
    else if (p.includes('gps normal') || p.includes('cakupan gps') || p.includes('gps coverage') || p.includes('koneksi gps')) {
      intent = 'GPS_STATUS';
      suggestedTools = ['getGPSStatus', 'getDeviceStatus'];
      confidence = 0.94;
    } else if (p.includes('gps tracker') || p.includes('device tracker') || p.includes('sim card') || p.includes('firmware')) {
      intent = 'DEVICE_STATUS';
      suggestedTools = ['getDeviceStatus', 'getGPSStatus'];
      confidence = 0.93;
    }
    // Geofence Query (Prompt 34 - Section 38)
    else if (p.includes('geofence') || p.includes('keluar area') || p.includes('keluar zona') || p.includes('zona terlarang')) {
      intent = 'GEOFENCE_STATUS';
      suggestedTools = ['getGeofenceStatus', 'getActiveAlerts'];
      confidence = 0.95;
    }
    // Active Alerts Query (Prompt 34 - Section 39)
    else if (p.includes('alert') || p.includes('peringatan') || p.includes('alarm') || p.includes('notifikasi')) {
      intent = 'ALERT_STATUS';
      suggestedTools = ['getActiveAlerts'];
      confidence = 0.94;
    }
    // Report Request (Prompt 34 - Section 10)
    else if (p.includes('laporan') || p.includes('report') || p.includes('rekap') || p.includes('export')) {
      intent = 'REPORT_REQUEST';
      suggestedTools = ['getFleetSummary'];
      confidence = 0.91;
    }
    // General Fleet Status (Prompt 34 - Section 18)
    else if (
      p.includes('kondisi fleet') ||
      p.includes('kondisi armada') ||
      p.includes('berapa kendaraan yang aktif') ||
      p.includes('total kendaraan') ||
      p.includes('fleet status') ||
      p.includes('overview')
    ) {
      intent = 'FLEET_STATUS';
      suggestedTools = ['getFleetSummary', 'getOfflineVehicles', 'getActiveAlerts'];
      confidence = 0.95;
    }
    // Ambiguity Check (Prompt 34 - Section 11)
    else if (p.includes('mobil') || p.includes('truk') || p.includes('masalah') || p.length < 6) {
      intent = 'AMBIGUOUS_QUERY';
      confidence = 0.45;
      isAmbiguous = true;
      clarificationPrompt =
        'Apakah yang Anda maksud kendaraan yang offline GPS, kendaraan yang membutuhkan maintenance, atau status armada secara keseluruhan?';
    }

    return {
      intent,
      confidence,
      entities,
      isAmbiguous,
      clarificationPrompt,
      suggestedTools,
      isActionable,
      sanitizedPrompt: sanitized,
      injectionDetected,
      isSensitiveDisciplinary,
    };
  }

  /**
   * Helper to extract Indonesian plates, driver names, branches, and time windows
   */
  private static extractEntities(
    prompt: string,
    context?: { lastVehicleId?: string; lastDriverId?: string }
  ): ExtractedIntentEntities {
    const p = prompt.toLowerCase();
    const entities: ExtractedIntentEntities = {};

    // 1. Indonesian License Plates (e.g. B 1234 XX, B 9211 TJP, D 1234 AB, L 9821 KL)
    const plateRegex = /\b([a-z]{1,2})\s*([0-9]{1,4})\s*([a-z]{1,3})\b/i;
    const plateMatch = prompt.match(plateRegex);
    if (plateMatch) {
      entities.plateNumber = `${plateMatch[1].toUpperCase()} ${plateMatch[2]} ${plateMatch[3].toUpperCase()}`;
      entities.vehicleId = entities.plateNumber;
    } else if (context?.lastVehicleId) {
      entities.vehicleId = context.lastVehicleId;
      entities.plateNumber = context.lastVehicleId;
    }

    // 2. Common Indonesian Driver Names
    const driverKeywords = [
      'andi',
      'budi',
      'hartono',
      'sutrisno',
      'agus',
      'hendra',
      'joko',
      'ridwan',
      'rudi',
      'bambang',
      'wahyu',
      'dodi',
    ];
    for (const d of driverKeywords) {
      if (p.includes(d)) {
        entities.driverName = d.charAt(0).toUpperCase() + d.slice(1);
        entities.driverId = `DRV-${d.toUpperCase()}`;
        break;
      }
    }
    if (!entities.driverName && context?.lastDriverId) {
      entities.driverId = context.lastDriverId;
    }

    // 3. Branches
    if (p.includes('jakarta')) entities.branchName = 'Jakarta Hub';
    else if (p.includes('surabaya')) entities.branchName = 'Surabaya Hub';
    else if (p.includes('semarang')) entities.branchName = 'Semarang Hub';
    else if (p.includes('bandung')) entities.branchName = 'Bandung Depo';
    else if (p.includes('medan')) entities.branchName = 'Medan Hub';

    // 4. Timeframe (Prompt 34 - Section 44)
    if (p.includes('hari ini') || p.includes('today')) entities.timeRange = 'TODAY';
    else if (p.includes('kemarin') || p.includes('yesterday')) entities.timeRange = 'YESTERDAY';
    else if (p.includes('7 hari') || p.includes('minggu ini')) entities.timeRange = 'LAST_7_DAYS';
    else if (p.includes('30 hari') || p.includes('bulan ini')) entities.timeRange = 'LAST_30_DAYS';
    else if (p.includes('90 hari')) entities.timeRange = 'LAST_90_DAYS';
    else entities.timeRange = 'LAST_30_DAYS'; // Configured standard default

    // 5. Limit / Count
    const limitMatch = prompt.match(/\b(top\s+|tampilkan\s+)?(\d{1,2})\b/i);
    if (limitMatch && limitMatch[2]) {
      entities.limit = parseInt(limitMatch[2], 10);
    }

    return entities;
  }

  /**
   * Resolves Slash Commands (Prompt 34 - Section 66)
   */
  private static handleSlashCommand(
    commandStr: string,
    entities: ExtractedIntentEntities,
    injectionDetected: boolean
  ): IntentAnalysisResult {
    const cmd = commandStr.toLowerCase().trim();

    if (cmd.includes('/show offline') || cmd.includes('/offline')) {
      return {
        intent: 'VEHICLE_OFFLINE',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getOfflineVehicles'],
        isActionable: false,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    if (cmd.includes('/show high risk') || cmd.includes('/drivers')) {
      return {
        intent: 'DRIVER_RISK',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getDriverRisk', 'getDriverBehavior'],
        isActionable: false,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    if (cmd.includes('/show overdue') || cmd.includes('/maintenance')) {
      return {
        intent: 'MAINTENANCE_DUE',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getMaintenanceDue', 'getMaintenanceRisk'],
        isActionable: true,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    if (cmd.includes('/show active alerts') || cmd.includes('/alerts')) {
      return {
        intent: 'ALERT_STATUS',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getActiveAlerts'],
        isActionable: false,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    if (cmd.includes('/show delayed') || cmd.includes('/trips')) {
      return {
        intent: 'TRIP_DELAY',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getDelayedTrips'],
        isActionable: false,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    if (cmd.includes('/priority') || cmd.includes('/insight')) {
      return {
        intent: 'AI_INSIGHT',
        confidence: 1.0,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getFleetAIInsights', 'getActiveAlerts'],
        isActionable: true,
        sanitizedPrompt: commandStr,
        injectionDetected,
      };
    }

    return {
      intent: 'GENERAL_QUERY',
      confidence: 0.8,
      entities,
      isAmbiguous: false,
      suggestedTools: ['getFleetSummary'],
      isActionable: false,
      sanitizedPrompt: commandStr,
      injectionDetected,
    };
  }

  /**
   * Resolves Follow-up context queries (Prompt 34 - Section 45)
   */
  private static resolveFollowUpIntent(
    p: string,
    entities: ExtractedIntentEntities,
    context: { lastIntent?: FleetAssistantIntent; lastVehicleId?: string; lastDriverId?: string },
    sanitized: string,
    injectionDetected: boolean
  ): IntentAnalysisResult {
    const parentIntent = context.lastIntent || 'FLEET_STATUS';

    if (parentIntent === 'VEHICLE_OFFLINE') {
      return {
        intent: 'VEHICLE_OFFLINE',
        confidence: 0.96,
        entities: { ...entities, limit: entities.limit || 5 },
        isAmbiguous: false,
        suggestedTools: ['getOfflineVehicles', 'getGPSStatus'],
        isActionable: false,
        sanitizedPrompt: sanitized,
        injectionDetected,
      };
    }

    if (parentIntent === 'DRIVER_RISK' || parentIntent === 'DRIVER_BEHAVIOR') {
      return {
        intent: 'DRIVER_BEHAVIOR',
        confidence: 0.96,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getDriverBehavior', 'getDriverRisk'],
        isActionable: false,
        sanitizedPrompt: sanitized,
        injectionDetected,
      };
    }

    if (parentIntent === 'MAINTENANCE_DUE' || parentIntent === 'MAINTENANCE_RISK') {
      return {
        intent: 'MAINTENANCE_RISK',
        confidence: 0.96,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getMaintenanceRisk', 'getMaintenanceDue'],
        isActionable: true,
        sanitizedPrompt: sanitized,
        injectionDetected,
      };
    }

    if (parentIntent === 'FUEL_ANALYSIS') {
      return {
        intent: 'FUEL_ANOMALY',
        confidence: 0.95,
        entities,
        isAmbiguous: false,
        suggestedTools: ['getFuelAnomalies', 'getFuelSummary'],
        isActionable: false,
        sanitizedPrompt: sanitized,
        injectionDetected,
      };
    }

    return {
      intent: parentIntent,
      confidence: 0.9,
      entities,
      isAmbiguous: false,
      suggestedTools: ['getFleetSummary'],
      isActionable: false,
      sanitizedPrompt: sanitized,
      injectionDetected,
    };
  }
}
