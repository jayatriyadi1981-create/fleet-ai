/**
 * Fleet Intelligence Smart AI - Intent Detection Service
 * PROMPT 53 — Section 6
 * Recognizes 16 enterprise fleet analytical intents with context awareness.
 */

import { NLAnalyticsIntent, NLExtractedEntities } from '../../../types/nlAnalytics';

export class IntentDetectionService {
  public static detect(
    text: string,
    entities: NLExtractedEntities,
    previousIntent?: NLAnalyticsIntent
  ): NLAnalyticsIntent {
    const lower = text.toLowerCase().trim();

    // 1. Follow-up continuity fallback
    if (entities.isFollowUp && previousIntent) {
      if (lower.includes('cabang') || lower.includes('cabangnya')) {
        return 'BRANCH_COMPARISON';
      }
      if (lower.includes('driver') || lower.includes('supir')) {
        return 'DRIVER_ANALYSIS';
      }
      if (lower.includes('kendaraan') || lower.includes('unit') || lower.includes('mana saja')) {
        return 'VEHICLE_ANALYSIS';
      }
      return previousIntent;
    }

    // 2. Executive / C-Level & Board
    if (
      lower.includes('director') ||
      lower.includes('direksi') ||
      lower.includes('c-level') ||
      lower.includes('ringkasan eksekutif') ||
      lower.includes('executive summary') ||
      lower.includes('kondisi fleet untuk director') ||
      lower.includes('laporan direktur')
    ) {
      return 'EXECUTIVE_ANALYSIS';
    }

    // 3. Predictive / Forecast
    if (
      lower.includes('prediksi') ||
      lower.includes('forecast') ||
      lower.includes('proyeksi') ||
      lower.includes('bulan depan') ||
      lower.includes('estimasi biaya depan')
    ) {
      return 'PREDICTIVE_ANALYSIS';
    }

    // 4. Branch Comparison
    if (
      lower.includes('cabang') ||
      lower.includes('branch') ||
      lower.includes('bandingkan cabang') ||
      lower.includes('cabang mana') ||
      lower.includes('antar cabang')
    ) {
      return 'BRANCH_COMPARISON';
    }

    // 5. Fuel Analysis
    if (
      lower.includes('bbm') ||
      lower.includes('solar') ||
      lower.includes('bensin') ||
      lower.includes('bahan bakar') ||
      lower.includes('boros') ||
      lower.includes('irit') ||
      lower.includes('liter') ||
      lower.includes('spbu')
    ) {
      return 'FUEL_ANALYSIS';
    }

    // 6. Maintenance & Work Order
    if (
      lower.includes('servis') ||
      lower.includes('service') ||
      lower.includes('bengkel') ||
      lower.includes('maintenance') ||
      lower.includes('perawatan') ||
      lower.includes('wo') ||
      lower.includes('rusak') ||
      lower.includes('jatuh tempo') ||
      lower.includes('downtime')
    ) {
      return 'MAINTENANCE_ANALYSIS';
    }

    // 7. Driver Behavior & Eco-Driving
    if (
      lower.includes('driver') ||
      lower.includes('pengemudi') ||
      lower.includes('supir') ||
      lower.includes('skor driver') ||
      lower.includes('overspeed') ||
      lower.includes('harsh braking') ||
      lower.includes('driver terbaik') ||
      lower.includes('driver paling berisiko')
    ) {
      return 'DRIVER_ANALYSIS';
    }

    // 8. Safety & Fatigue & Incidents
    if (
      lower.includes('safety') ||
      lower.includes('keselamatan') ||
      lower.includes('insiden') ||
      lower.includes('incident') ||
      lower.includes('kecelakaan') ||
      lower.includes('fatigue') ||
      lower.includes('ngantuk') ||
      lower.includes('near miss') ||
      lower.includes('hse')
    ) {
      return 'SAFETY_ANALYSIS';
    }

    // 9. Cost & Financial / TOC
    if (
      lower.includes('biaya') ||
      lower.includes('cost') ||
      lower.includes('tco') ||
      lower.includes('toc') ||
      lower.includes('pengeluaran') ||
      lower.includes('anggaran') ||
      lower.includes('cost/km') ||
      lower.includes('paling mahal') ||
      lower.includes('paling murah')
    ) {
      return 'COST_ANALYSIS';
    }

    // 10. Utilization & Downtime
    if (
      lower.includes('utilisasi') ||
      lower.includes('utilization') ||
      lower.includes('produktivitas') ||
      lower.includes('jam operasi') ||
      lower.includes('nganggur')
    ) {
      return 'UTILIZATION_ANALYSIS';
    }

    // 11. Delivery & Orders / POD
    if (
      lower.includes('delivery') ||
      lower.includes('pengiriman') ||
      lower.includes('pod') ||
      lower.includes('surat jalan') ||
      lower.includes('otif') ||
      lower.includes('sla') ||
      lower.includes('order')
    ) {
      return 'DELIVERY_ANALYSIS';
    }

    // 12. Route & Logistics Corridor
    if (
      lower.includes('rute') ||
      lower.includes('route') ||
      lower.includes('koridor') ||
      lower.includes('tol') ||
      lower.includes('kemacetan rute')
    ) {
      return 'ROUTE_ANALYSIS';
    }

    // 13. Geofence & POI
    if (
      lower.includes('geofence') ||
      lower.includes('zona') ||
      lower.includes('radius') ||
      lower.includes('masuk area') ||
      lower.includes('keluar area')
    ) {
      return 'GEOFENCE_ANALYSIS';
    }

    // 14. Alerts & Violations
    if (
      lower.includes('alert') ||
      lower.includes('peringatan') ||
      lower.includes('notifikasi') ||
      lower.includes('sos') ||
      lower.includes('panik')
    ) {
      return 'ALERT_ANALYSIS';
    }

    // 15. Vehicle Specific / Ranking
    if (
      entities.vehiclePlates && entities.vehiclePlates.length > 0 ||
      lower.includes('kendaraan') ||
      lower.includes('armada') ||
      lower.includes('mobil') ||
      lower.includes('truk') ||
      lower.includes('offline') ||
      lower.includes('aktif')
    ) {
      return 'VEHICLE_ANALYSIS';
    }

    // 16. Trip Analysis
    if (
      lower.includes('trip') ||
      lower.includes('perjalanan') ||
      lower.includes('ritase')
    ) {
      return 'TRIP_ANALYSIS';
    }

    // Default: Overall Fleet Performance
    return 'FLEET_PERFORMANCE';
  }
}
