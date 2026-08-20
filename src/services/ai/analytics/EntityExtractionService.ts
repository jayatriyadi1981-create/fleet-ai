/**
 * Fleet Intelligence Smart AI - Entity Extraction Service
 * PROMPT 53 — Section 7 & 16
 * Extracts vehicles, drivers, branches, departments, routes, statuses, metrics, topN, and comparison targets.
 */

import { NLExtractedEntities } from '../../../types/nlAnalytics';
import { FleetAnalyticsSemanticLayer } from './FleetAnalyticsSemanticLayer';

export class EntityExtractionService {
  private static knownBranches = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Makassar', 'Bali', 'Palembang'];
  private static knownDepartments = ['Logistik', 'Distribusi', 'Operasional', 'Supply Chain', 'Sales', 'Transportasi'];
  private static knownVehicleTypes = ['Truk Tronton', 'Blind Van', 'CDD Box', 'CDE Box', 'Truk Wingbox', 'Pick Up', 'Trailer'];
  private static knownDrivers = ['Budi Santoso', 'Andi Wijaya', 'Rudi Hermawan', 'Dedi Kusnadi', 'Agus Prasetyo', 'Hendra Gunawan', 'Siti Rahma', 'Joko Widodo'];

  public static extract(
    text: string,
    previousEntities?: NLExtractedEntities
  ): NLExtractedEntities {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    const entities: NLExtractedEntities = {
      vehiclePlates: [],
      driverNames: [],
      branchNames: [],
      departmentNames: [],
      vehicleTypes: [],
      statusFilter: [],
    };

    // 1. Extract Indonesian License Plates (e.g., B 1234 XYZ, D 9081 UT, L 8821 KL, B 9021 UTT)
    const plateRegex = /\b([A-Z]{1,2}\s?[0-9]{1,4}\s?[A-Z]{1,3})\b/gi;
    const plateMatches = raw.match(plateRegex);
    if (plateMatches) {
      entities.vehiclePlates = plateMatches.map(p => p.toUpperCase().replace(/\s+/g, ' '));
    }

    // 2. Extract Top N Limit (e.g., "10 kendaraan", "top 5", "5 driver", "3 cabang")
    const topNRegex = /\b(?:top|teratas|terbawah|sebanyak|ranking)?\s*(\d{1,2})\s*(?:kendaraan|unit|armada|driver|supir|cabang|mobil|truk)?\b/i;
    const topNMatch = raw.match(topNRegex);
    if (topNMatch && topNMatch[1]) {
      const parsed = parseInt(topNMatch[1], 10);
      if (parsed > 0 && parsed <= 100) {
        entities.topNLimit = parsed;
      }
    } else if (lower.includes('paling') || lower.includes('teratas') || lower.includes('terbawah') || lower.includes('terbaik') || lower.includes('terburuk')) {
      entities.topNLimit = 10; // Default Top 10
    }

    // 3. Extract Sort Order (paling boros / tertinggi -> DESC, paling irit / termurah -> ASC)
    if (
      lower.includes('paling boros') ||
      lower.includes('tertinggi') ||
      lower.includes('terbanyak') ||
      lower.includes('paling mahal') ||
      lower.includes('paling bermasalah') ||
      lower.includes('paling berisiko') ||
      lower.includes('terburuk') ||
      lower.includes('top')
    ) {
      entities.sortOrder = 'DESC';
    } else if (
      lower.includes('paling irit') ||
      lower.includes('terendah') ||
      lower.includes('tersedikit') ||
      lower.includes('paling murah') ||
      lower.includes('paling efisien') ||
      lower.includes('terbaik')
    ) {
      entities.sortOrder = 'ASC';
    }

    // 4. Extract Branches
    for (const b of this.knownBranches) {
      if (lower.includes(b.toLowerCase())) {
        entities.branchNames?.push(b);
      }
    }

    // 5. Extract Departments
    for (const d of this.knownDepartments) {
      if (lower.includes(d.toLowerCase())) {
        entities.departmentNames?.push(d);
      }
    }

    // 6. Extract Vehicle Types
    for (const vt of this.knownVehicleTypes) {
      if (lower.includes(vt.toLowerCase())) {
        entities.vehicleTypes?.push(vt);
      }
    }

    // 7. Extract Drivers
    for (const drv of this.knownDrivers) {
      const parts = drv.toLowerCase().split(' ');
      if (lower.includes(drv.toLowerCase()) || parts.some(p => p.length > 3 && lower.includes(p))) {
        entities.driverNames?.push(drv);
      }
    }

    // 8. Extract Status Filters (active, offline, moving, idle, maintenance)
    if (lower.includes('offline') || lower.includes('mati') || lower.includes('tidak aktif')) {
      entities.statusFilter?.push('offline');
    }
    if (lower.includes('aktif') || lower.includes('jalan') || lower.includes('moving') || lower.includes('online')) {
      entities.statusFilter?.push('moving');
    }
    if (lower.includes('idle') || lower.includes('parkir') || lower.includes('berhenti')) {
      entities.statusFilter?.push('stopped');
    }
    if (lower.includes('bengkel') || lower.includes('servis') || lower.includes('maintenance')) {
      entities.statusFilter?.push('maintenance');
    }

    // 9. Extract Target Semantic Metric
    const matchedMetric = FleetAnalyticsSemanticLayer.matchMetricFromText(raw);
    if (matchedMetric) {
      entities.targetMetric = matchedMetric.id;
    }

    // 10. Check if this is a "Why" causal question (Prompt 53 - Section 88)
    if (lower.includes('kenapa') || lower.includes('mengapa') || lower.includes('alasan') || lower.includes('penyebab') || lower.includes('why')) {
      entities.isWhyQuestion = true;
    }

    // 11. Contextual continuity / Follow-up resolution (Prompt 53 - Section 5 & 33)
    // E.g., "Mana saja?", "Cabangnya mana?", "Driver masing-masing?"
    const isShortFollowUp = (raw.length < 25 && (
      lower.includes('mana saja') ||
      lower.includes('mana') ||
      lower.includes('siapa') ||
      lower.includes('apa saja') ||
      lower.includes('kenapa') ||
      lower.includes('rinciannya') ||
      lower.includes('detailnya') ||
      lower.includes('cabangnya') ||
      lower.includes('drivernya')
    ));

    if (isShortFollowUp && previousEntities) {
      entities.isFollowUp = true;
      if (!entities.targetMetric && previousEntities.targetMetric) {
        entities.targetMetric = previousEntities.targetMetric;
      }
      if ((!entities.branchNames || entities.branchNames.length === 0) && previousEntities.branchNames?.length) {
        entities.branchNames = [...previousEntities.branchNames];
      }
      if ((!entities.statusFilter || entities.statusFilter.length === 0) && previousEntities.statusFilter?.length) {
        entities.statusFilter = [...previousEntities.statusFilter];
      }
      if (!entities.topNLimit && previousEntities.topNLimit) {
        entities.topNLimit = previousEntities.topNLimit;
      }
    }

    return entities;
  }
}
