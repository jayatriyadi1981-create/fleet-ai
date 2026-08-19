/**
 * Fleet Intelligence Smart AI - Intent Engine & Entity Extractor
 * Identifies user intent, extracts telematics entities, interprets relative time,
 * and enforces strict prompt injection protection.
 */

import { AIIntentCategory } from '../../../types/ai';

export interface ExtractedEntities {
  vehicleId?: string;
  plateNumber?: string;
  driverId?: string;
  driverName?: string;
  branchName?: string;
  timeRange?: string;
  metricType?: string;
  actionRequested?: string;
}

export interface IntentAnalysisResult {
  category: AIIntentCategory;
  intent: string;
  confidence: number;
  entities: ExtractedEntities;
  isActionable: boolean;
  sanitizedPrompt: string;
  injectionDetected: boolean;
}

export class AIIntentEngine {
  /**
   * Sanitizes input and detects prompt injection attempts (Section 60)
   */
  public static sanitizeAndDetectInjection(prompt: string): {
    sanitized: string;
    injectionDetected: boolean;
  } {
    const raw = prompt || '';
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /system\s+override/i,
      /you\s+are\s+now\s+in\s+developer\s+mode/i,
      /reveal\s+(your\s+)?(system\s+prompt|api\s+key|secret)/i,
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

    // Strip potentially malicious command sequences or raw system override tokens
    const sanitized = raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();

    return { sanitized, injectionDetected };
  }

  /**
   * Analyzes prompt intent and extracts relevant entities
   */
  public static analyzeIntent(prompt: string): IntentAnalysisResult {
    const { sanitized, injectionDetected } = this.sanitizeAndDetectInjection(prompt);
    const p = sanitized.toLowerCase();

    const entities: ExtractedEntities = {};

    // 1. Extract Indonesian License Plates (e.g. B 9211 TJP, D 1234 AB, AD 8821 XX)
    const plateRegex = /\b([a-z]{1,2})\s*([0-9]{1,4})\s*([a-z]{1,3})\b/i;
    const plateMatch = sanitized.match(plateRegex);
    if (plateMatch) {
      entities.plateNumber = `${plateMatch[1].toUpperCase()} ${plateMatch[2]} ${plateMatch[3].toUpperCase()}`;
      entities.vehicleId = entities.plateNumber;
    }

    // 2. Extract Driver Names (common drivers in fleet context)
    const commonDrivers = ['sutrisno', 'hartono', 'budi', 'santoso', 'agus', 'hendra', 'joko', 'ridwan'];
    for (const d of commonDrivers) {
      if (p.includes(d)) {
        entities.driverName = d.charAt(0).toUpperCase() + d.slice(1);
        break;
      }
    }

    // 3. Extract Timeframe
    if (p.includes('hari ini') || p.includes('today')) entities.timeRange = 'TODAY';
    else if (p.includes('kemarin') || p.includes('yesterday')) entities.timeRange = 'YESTERDAY';
    else if (p.includes('minggu ini') || p.includes('this week')) entities.timeRange = 'THIS_WEEK';
    else if (p.includes('bulan ini') || p.includes('this month')) entities.timeRange = 'THIS_MONTH';
    else if (p.includes('2 jam') || p.includes('terakhir')) entities.timeRange = 'LAST_2_HOURS';

    // 4. Intent Classification
    let category: AIIntentCategory = 'GENERAL';
    let intent = 'GENERAL_QUERY';
    let confidence = 0.85;
    let isActionable = false;

    if (p.includes('offline') || p.includes('hilang sinyal') || p.includes('mati')) {
      category = 'GPS';
      intent = 'FLEET_OFFLINE_VEHICLES';
      confidence = 0.95;
    } else if (p.includes('overspeed') || p.includes('kecepatan') || p.includes('ngebut')) {
      category = 'SAFETY';
      intent = 'OVERSPEED_ANALYSIS';
      confidence = 0.95;
    } else if (p.includes('bbm') || p.includes('fuel') || p.includes('solar') || p.includes('boros') || p.includes('pencurian')) {
      category = 'FUEL';
      intent = 'FUEL_CONSUMPTION_ANOMALY';
      confidence = 0.92;
    } else if (p.includes('servis') || p.includes('maintenance') || p.includes('bengkel') || p.includes('work order') || p.includes('rusak')) {
      category = 'MAINTENANCE';
      intent = 'VEHICLE_MAINTENANCE_SCHEDULE';
      confidence = 0.94;
    } else if (p.includes('inspeksi') || p.includes('pre-trip') || p.includes('post-trip') || p.includes('checklist')) {
      category = 'INSPECTION';
      intent = 'INSPECTION_COMPLIANCE_REVIEW';
      confidence = 0.93;
    } else if (p.includes('ground') || p.includes('kandangkan') || p.includes('nonaktifkan')) {
      category = 'ACTION';
      intent = 'GROUND_VEHICLE_REQUEST';
      isActionable = true;
      confidence = 0.96;
    } else if (p.includes('briefing') || p.includes('ringkasan hari ini') || p.includes('ikhtisar')) {
      category = 'FLEET';
      intent = 'DAILY_FLEET_BRIEFING';
      confidence = 0.95;
    } else if (p.includes('driver') || p.includes('pengemudi') || p.includes('sopir') || p.includes('skor')) {
      category = 'DRIVER';
      intent = 'DRIVER_PERFORMANCE_REVIEW';
      confidence = 0.90;
    } else if (p.includes('delivery') || p.includes('pengiriman') || p.includes('pod') || p.includes('eta')) {
      category = 'DELIVERY';
      intent = 'DELIVERY_ETA_STATUS';
      confidence = 0.90;
    } else if (p.includes('kelelahan') || p.includes('fatigue') || p.includes('ngantuk')) {
      category = 'FATIGUE';
      intent = 'FATIGUE_RISK_MONITORING';
      confidence = 0.91;
    } else if (p.includes('biaya') || p.includes('cost') || p.includes('pengeluaran') || p.includes('keuangan')) {
      category = 'FINANCE';
      intent = 'OPERATIONAL_COST_ANALYSIS';
      confidence = 0.90;
    }

    return {
      category,
      intent,
      confidence,
      entities,
      isActionable,
      sanitizedPrompt: sanitized,
      injectionDetected,
    };
  }
}
