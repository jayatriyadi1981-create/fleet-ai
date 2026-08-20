/**
 * Fleet Intelligence Smart AI - Fleet Analytics Semantic Layer
 * PROMPT 53 — Section 41 & 42
 * Centralized business term translation, canonical metric definitions, and zero-hallucination mathematical logic.
 */

export interface SemanticMetricDefinition {
  id: string;
  name: string;
  category: 'fleet' | 'fuel' | 'maintenance' | 'driver' | 'safety' | 'cost' | 'delivery' | 'executive';
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better' | 'neutral';
  formulaExplanation: string;
  sourceModules: string[];
  aliases: string[];
}

export class FleetAnalyticsSemanticLayer {
  private static metrics: Map<string, SemanticMetricDefinition> = new Map();

  static {
    this.initializeDefinitions();
  }

  private static initializeDefinitions() {
    const list: SemanticMetricDefinition[] = [
      // Fleet & Utilization
      {
        id: 'fleet_count',
        name: 'Jumlah Total Armada',
        category: 'fleet',
        unit: 'unit',
        direction: 'neutral',
        formulaExplanation: 'Total unit kendaraan terdaftar dalam tenant aktif',
        sourceModules: ['Vehicles', 'GPS Integration'],
        aliases: ['jumlah armada', 'total armada', 'total kendaraan', 'berapa kendaraan', 'banyak kendaraan'],
      },
      {
        id: 'active_vehicles',
        name: 'Kendaraan Aktif',
        category: 'fleet',
        unit: 'unit',
        direction: 'higher_is_better',
        formulaExplanation: 'Jumlah unit kendaraan dengan sinyal GPS aktif dalam 15 menit terakhir (status moving / idling / parked)',
        sourceModules: ['Live Tracking', 'GPS IoT'],
        aliases: ['kendaraan aktif', 'armada aktif', 'unit jalan', 'kendaraan online', 'unit aktif'],
      },
      {
        id: 'offline_vehicles',
        name: 'Kendaraan Offline / Mati',
        category: 'fleet',
        unit: 'unit',
        direction: 'lower_is_better',
        formulaExplanation: 'Jumlah unit kendaraan yang tidak mengirimkan heartbeat GPS > 60 menit',
        sourceModules: ['Live Tracking', 'GPS Devices'],
        aliases: ['kendaraan offline', 'armada offline', 'unit mati', 'tidak aktif', 'kendaraan mati', 'gps mati'],
      },
      {
        id: 'utilization',
        name: 'Utilisasi Armada',
        category: 'fleet',
        unit: '%',
        direction: 'higher_is_better',
        formulaExplanation: '(Jumlah jam unit beroperasi / Jam operasional standar 24 jam) × 100%',
        sourceModules: ['Trip History', 'Fleet Intelligence'],
        aliases: ['utilisasi', 'utilization', 'efisiensi utilisasi', 'tingkat pemakaian', 'utilisasi armada'],
      },
      {
        id: 'mileage',
        name: 'Total Jarak Tempuh',
        category: 'fleet',
        unit: 'km',
        direction: 'neutral',
        formulaExplanation: 'Total akumulasi jarak tempuh odometer GPS seluruh armada dalam periode tertentu',
        sourceModules: ['Trips', 'GPS Telemetry'],
        aliases: ['jarak tempuh', 'total kilometer', 'kilometer', 'jarak', 'mileage', 'total km'],
      },

      // Fuel
      {
        id: 'fuel_consumption',
        name: 'Konsumsi Total BBM',
        category: 'fuel',
        unit: 'L',
        direction: 'lower_is_better',
        formulaExplanation: 'Total volume liter BBM (Solar/B35/Pertalite) yang dikonsumsi armada',
        sourceModules: ['Fuel Monitoring', 'IoT Fuel Sensors'],
        aliases: ['konsumsi bbm', 'pemakaian bbm', 'total solar', 'total bbm', 'liter bbm', 'pemakaian bahan bakar'],
      },
      {
        id: 'fuel_cost',
        name: 'Total Biaya BBM',
        category: 'fuel',
        unit: 'Rp',
        direction: 'lower_is_better',
        formulaExplanation: 'Total pengeluaran rupiah pembelian BBM dalam ledger / SPBU integration',
        sourceModules: ['Fuel Monitoring', 'Cost Module'],
        aliases: ['biaya bbm', 'biaya solar', 'uang bbm', 'anggaran bbm', 'pengeluaran bbm'],
      },
      {
        id: 'fuel_efficiency',
        name: 'Efisiensi BBM (km/L)',
        category: 'fuel',
        unit: 'km/L',
        direction: 'higher_is_better',
        formulaExplanation: 'Jarak tempuh (km) ÷ Volume BBM terpakai (L). Bila BBM = 0, menghasilkan N/A',
        sourceModules: ['Fuel Intelligence'],
        aliases: ['efisiensi bbm', 'konsumsi per km', 'km per liter', 'km/l', 'efisiensi solar', 'paling irit', 'paling boros'],
      },
      {
        id: 'fuel_per_km',
        name: 'Konsumsi BBM per Km (L/km)',
        category: 'fuel',
        unit: 'L/km',
        direction: 'lower_is_better',
        formulaExplanation: 'Volume BBM (L) ÷ Jarak Tempuh (km). Standar acuan boros armada berat',
        sourceModules: ['Fuel Intelligence'],
        aliases: ['liter per km', 'l/km', 'boros bbm', 'tingkat boros'],
      },

      // Maintenance
      {
        id: 'maintenance_cost',
        name: 'Biaya Perawatan & Bengkel',
        category: 'maintenance',
        unit: 'Rp',
        direction: 'lower_is_better',
        formulaExplanation: 'Total invoice Work Order servis preventif dan breakdown bengkel',
        sourceModules: ['Maintenance (WO)', 'Cost Module'],
        aliases: ['biaya maintenance', 'biaya servis', 'biaya bengkel', 'biaya perbaikan', 'ongkos servis'],
      },
      {
        id: 'service_due',
        name: 'Unit Jatuh Tempo Servis',
        category: 'maintenance',
        unit: 'unit',
        direction: 'lower_is_better',
        formulaExplanation: 'Jumlah unit kendaraan yang melebihi threshold kilometer / tanggal servis berkala',
        sourceModules: ['Maintenance Intelligence', 'Inspection'],
        aliases: ['harus service', 'jatuh tempo servis', 'perlu servis', 'jadwal servis', 'overdue service', 'servis berkala'],
      },
      {
        id: 'downtime',
        name: 'Downtime Armada',
        category: 'maintenance',
        unit: 'jam',
        direction: 'lower_is_better',
        formulaExplanation: 'Akumulasi durasi unit tidak dapat beroperasi akibat breakdown / reparasi',
        sourceModules: ['Maintenance', 'Fleet Operations'],
        aliases: ['downtime', 'waktu mogok', 'durasi perbaikan', 'jam nganggur', 'unit mogok'],
      },

      // Driver & Safety
      {
        id: 'driver_score',
        name: 'Skor Perilaku Pengemudi',
        category: 'driver',
        unit: 'poin',
        direction: 'higher_is_better',
        formulaExplanation: 'Skor telematika 0–100 berdasarkan overspeed, harsh braking, harsh acceleration, & idle time',
        sourceModules: ['Driver Intelligence', 'Safety'],
        aliases: ['driver score', 'skor driver', 'skor pengemudi', 'performa driver', 'driver terbaik', 'driver terburuk'],
      },
      {
        id: 'safety_score',
        name: 'Safety & HSE Score Fleet',
        category: 'safety',
        unit: 'poin',
        direction: 'higher_is_better',
        formulaExplanation: 'Indeks kepatuhan keselamatan armada terhadap batas kecepatan dan insiden telematika',
        sourceModules: ['Safety Intelligence', 'Fatigue Management'],
        aliases: ['safety score', 'skor keselamatan', 'hse score', 'indeks keselamatan', 'skor safety'],
      },
      {
        id: 'incidents',
        name: 'Jumlah Insiden / Alert Kritis',
        category: 'safety',
        unit: 'kejadian',
        direction: 'lower_is_better',
        formulaExplanation: 'Akumulasi peringatan benturan, overspeed parah >100 km/h, dan fatigue sensor alert',
        sourceModules: ['Alerts', 'Fatigue Intelligence'],
        aliases: ['insiden', 'incident', 'near miss', 'kecelakaan', 'peringatan bahaya', 'pelanggaran'],
      },

      // Cost & TOC
      {
        id: 'operating_cost',
        name: 'Total Biaya Operasional (TCO/TOC)',
        category: 'cost',
        unit: 'Rp',
        direction: 'lower_is_better',
        formulaExplanation: 'Total Biaya BBM + Biaya Servis Bengkel + Gaji Driver + Toll/Retribusi',
        sourceModules: ['Cost Module', 'Executive Report'],
        aliases: ['biaya operasional', 'total biaya', 'operating cost', 'biaya fleet', 'pengeluaran fleet', 'biaya armada'],
      },
      {
        id: 'cost_per_km',
        name: 'Biaya per Kilometer (Cost/km)',
        category: 'cost',
        unit: 'Rp/km',
        direction: 'lower_is_better',
        formulaExplanation: 'Total Biaya Operasional (Rp) ÷ Total Jarak Tempuh (km). Indikator efisiensi utama',
        sourceModules: ['Cost Analytics', 'Executive Report'],
        aliases: ['cost per km', 'cost/km', 'biaya per km', 'efisiensi biaya', 'paling murah', 'paling mahal', 'cabang paling efisien'],
      },

      // Delivery & Trip
      {
        id: 'on_time_delivery',
        name: 'On-Time Delivery (OTIF / SLA)',
        category: 'delivery',
        unit: '%',
        direction: 'higher_is_better',
        formulaExplanation: '(Pengiriman tepat waktu ÷ Total trip pengiriman) × 100%',
        sourceModules: ['Delivery Management', 'Trip Management'],
        aliases: ['on time delivery', 'otif', 'sla pengiriman', 'tepat waktu', 'persentase tepat waktu', 'sla delivery'],
      },
    ];

    list.forEach((m) => this.metrics.set(m.id, m));
  }

  public static getMetric(metricId: string): SemanticMetricDefinition | undefined {
    return this.metrics.get(metricId);
  }

  public static getAllMetrics(): SemanticMetricDefinition[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Resolves a natural language phrase to a canonical metric ID
   */
  public static matchMetricFromText(text: string): SemanticMetricDefinition | null {
    const lower = text.toLowerCase();

    for (const metric of this.metrics.values()) {
      for (const alias of metric.aliases) {
        if (lower.includes(alias)) {
          return metric;
        }
      }
    }

    // Secondary heuristic checks
    if (lower.includes('boros') || lower.includes('konsumsi') || lower.includes('bensin') || lower.includes('solar')) {
      return this.metrics.get('fuel_per_km') || this.metrics.get('fuel_consumption') || null;
    }
    if (lower.includes('servis') || lower.includes('bengkel') || lower.includes('rusak')) {
      return this.metrics.get('service_due') || this.metrics.get('maintenance_cost') || null;
    }
    if (lower.includes('biaya') || lower.includes('mahal') || lower.includes('murah') || lower.includes('efisien')) {
      return this.metrics.get('cost_per_km') || this.metrics.get('operating_cost') || null;
    }
    if (lower.includes('driver') || lower.includes('supir') || lower.includes('pengemudi')) {
      return this.metrics.get('driver_score') || null;
    }
    if (lower.includes('aman') || lower.includes('selamat') || lower.includes('bahaya') || lower.includes('risiko')) {
      return this.metrics.get('safety_score') || null;
    }

    return null;
  }

  /**
   * Formats numbers according to Indonesian locale (Prompt 53 - Section 44)
   */
  public static formatValue(value: number | string | null | undefined, unit: string = ''): string {
    if (value === null || value === undefined || value === 'N/A' || isNaN(Number(value))) {
      return 'N/A';
    }

    const num = Number(value);

    switch (unit.toLowerCase()) {
      case 'rp':
      case 'idr':
        return `Rp ${num.toLocaleString('id-ID')}`;
      case 'rp/km':
        return `Rp ${num.toLocaleString('id-ID', { maximumFractionDigits: 0 })}/km`;
      case '%':
        return `${num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      case 'km':
        return `${num.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`;
      case 'l':
      case 'liter':
        return `${num.toLocaleString('id-ID', { maximumFractionDigits: 1 })} L`;
      case 'l/km':
        return `${num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L/km`;
      case 'km/l':
        return `${num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km/L`;
      case 'poin':
      case 'skor':
        return `${num.toLocaleString('id-ID', { maximumFractionDigits: 1 })} pts`;
      case 'unit':
      case 'kendaraan':
        return `${num.toLocaleString('id-ID')} unit`;
      case 'jam':
        return `${num.toLocaleString('id-ID', { maximumFractionDigits: 1 })} jam`;
      default:
        return `${num.toLocaleString('id-ID')}${unit ? ' ' + unit : ''}`;
    }
  }
}
