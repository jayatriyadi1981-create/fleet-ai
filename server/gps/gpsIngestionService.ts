import { ParsedGpsTelemetry, IngestionResult, GpsDeviceRegistration } from './types';
import { JT808Parser } from './parsers/jt808Parser';
import { TeltonikaParser } from './parsers/teltonikaParser';
import { ConcoxParser } from './parsers/concoxParser';
import { JsonTelematicsParser } from './parsers/jsonParser';
import { getSupabaseAdminClient, isSupabaseConfigured } from '../../src/lib/supabase';

export interface GpsServerStats {
  totalPacketsReceived: number;
  totalPacketsPersisted: number;
  validPacketsProcessed: number;
  errorRate: number;
  totalAlertsTriggered: number;
  activeImeis: Set<string>;
  lastPacketAt: string | null;
  uptimeSeconds: number;
  supabaseConnected: boolean;
}

export class GpsIngestionService {
  private static instance: GpsIngestionService;
  private startTime = Date.now();
  private stats = {
    totalPacketsReceived: 0,
    totalPacketsPersisted: 0,
    totalAlertsTriggered: 0,
    activeImeis: new Set<string>(),
    lastPacketAt: null as string | null,
  };

  // In-memory circular buffer for real-time live feed & fallback
  private recentTelemetry: ParsedGpsTelemetry[] = [];
  private registeredDevices: Map<string, GpsDeviceRegistration> = new Map();

  private constructor() {
    this.seedDefaultDevices();
  }

  public static getInstance(): GpsIngestionService {
    if (!GpsIngestionService.instance) {
      GpsIngestionService.instance = new GpsIngestionService();
    }
    return GpsIngestionService.instance;
  }

  private seedDefaultDevices() {
    const defaults: GpsDeviceRegistration[] = [
      { imei: '354891028300101', deviceModel: 'Teltonika FMB920', protocol: 'TELTONIKA', plateNumber: 'B 9821 UTX', cellularProvider: 'Telkomsel IoT' },
      { imei: '864201049281002', deviceModel: 'Concox GT06N', protocol: 'CONCOX_GT06N', plateNumber: 'B 9134 TXV', cellularProvider: 'Indosat Ooredoo' },
      { imei: '012345678901003', deviceModel: 'JT808 Standard Tracker', protocol: 'JT808', plateNumber: 'B 9762 KYL', cellularProvider: 'XL Axiata IoT' },
      { imei: '358902049102004', deviceModel: 'Queclink GV300', protocol: 'GENERIC_JSON', plateNumber: 'B 9482 JHY', cellularProvider: 'Telkomsel IoT' },
      { imei: '354891028300005', deviceModel: 'Teltonika FMC130 4G', protocol: 'TELTONIKA', plateNumber: 'B 9531 SXZ', cellularProvider: 'Telkomsel IoT' },
    ];
    defaults.forEach((d) => this.registeredDevices.set(d.imei, d));
  }

  /**
   * Register or update a GPS Device IMEI
   */
  public registerDevice(reg: GpsDeviceRegistration) {
    this.registeredDevices.set(reg.imei, reg);
  }

  public getRegisteredDevices(): GpsDeviceRegistration[] {
    return Array.from(this.registeredDevices.values());
  }

  /**
   * Primary Telematics Ingestion Pipeline
   */
  public async ingestTelemetry(
    payload: any,
    format: 'JSON' | 'TELTONIKA_HEX' | 'JT808_HEX' | 'CONCOX_HEX' = 'JSON',
    fallbackImei?: string
  ): Promise<IngestionResult> {
    this.stats.totalPacketsReceived++;
    this.stats.lastPacketAt = new Date().toISOString();

    let telemetry: ParsedGpsTelemetry;

    try {
      if (format === 'TELTONIKA_HEX') {
        const hexStr = typeof payload === 'string' ? payload : payload.hex || payload.data;
        telemetry = TeltonikaParser.parseHex(hexStr, fallbackImei || payload.imei || '354891028300101');
      } else if (format === 'JT808_HEX') {
        const hexStr = typeof payload === 'string' ? payload : payload.hex || payload.data;
        telemetry = JT808Parser.parseHex(hexStr, fallbackImei || payload.imei);
      } else if (format === 'CONCOX_HEX') {
        const hexStr = typeof payload === 'string' ? payload : payload.hex || payload.data;
        telemetry = ConcoxParser.parseHex(hexStr, fallbackImei || payload.imei);
      } else {
        telemetry = JsonTelematicsParser.parse(payload);
      }
    } catch (err: any) {
      return {
        success: false,
        recordCount: 0,
        imei: fallbackImei || 'UNKNOWN',
        telemetry: {} as any,
        persistedToSupabase: false,
        alertsTriggered: [],
        message: `Parse Error: ${err.message || 'Corrupt packet format'}`,
        timestamp: new Date().toISOString(),
      };
    }

    this.stats.activeImeis.add(telemetry.imei);

    // Maintain recent buffer
    this.recentTelemetry.unshift(telemetry);
    if (this.recentTelemetry.length > 150) {
      this.recentTelemetry.pop();
    }

    // Evaluate Rules & Trigger Alerts
    const alertsTriggered: string[] = [];
    if (telemetry.overspeedAlert || telemetry.speedKmh > 90) {
      alertsTriggered.push(`OVERSPEED: Kecepatan ${telemetry.speedKmh} km/h melampaui batas aman (90 km/h)`);
    }
    if (telemetry.sosAlert) {
      alertsTriggered.push(`SOS_PANIC: Tombol darurat ditekan pada kendaraan IMEI [${telemetry.imei}]`);
    }
    if (telemetry.powerCutAlert) {
      alertsTriggered.push(`POWER_CUT: Kabel catu daya aki utama terputus!`);
    }

    if (alertsTriggered.length > 0) {
      this.stats.totalAlertsTriggered += alertsTriggered.length;
    }

    // Persist to Supabase if configured
    let persistedToSupabase = false;
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        // 1. Insert into vehicle_telemetry using PostGIS point format
        const { error: telemErr } = await supabase.from('vehicle_telemetry').insert({
          imei: telemetry.imei,
          latitude: telemetry.latitude,
          longitude: telemetry.longitude,
          location: `SRID=4326;POINT(${telemetry.longitude} ${telemetry.latitude})`,
          speed_kmh: telemetry.speedKmh,
          heading: telemetry.heading,
          altitude_meters: telemetry.altitudeMeters || 0,
          satellites_count: telemetry.satellites || 12,
          ignition: telemetry.ignition,
          battery_voltage: telemetry.batteryVoltage || 24.0,
          fuel_level_percent: telemetry.fuelLevelPercent || 80.0,
          odometer_km: telemetry.odometerKm || 0,
          protocol: telemetry.protocol,
          raw_hex_payload: telemetry.rawHexPayload || null,
          recorded_at: telemetry.timestamp,
        });

        if (!telemErr) {
          persistedToSupabase = true;
          this.stats.totalPacketsPersisted++;
        }

        // 2. Insert any alerts to gps_alerts
        for (const alertMsg of alertsTriggered) {
          await supabase.from('gps_alerts').insert({
            imei: telemetry.imei,
            alert_type: alertMsg.split(':')[0],
            severity: 'CRITICAL',
            title: alertMsg,
            latitude: telemetry.latitude,
            longitude: telemetry.longitude,
            location: `SRID=4326;POINT(${telemetry.longitude} ${telemetry.latitude})`,
            speed_kmh: telemetry.speedKmh,
          });
        }
      } catch (dbErr) {
        console.warn('Supabase DB Write error (fallback to in-memory):', dbErr);
      }
    }

    return {
      success: true,
      recordCount: 1,
      imei: telemetry.imei,
      telemetry,
      persistedToSupabase,
      alertsTriggered,
      message: `Telematics packet ingested successfully via ${telemetry.protocol}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get Recent Telemetry Ingestion Feed
   */
  public getRecentFeed(): ParsedGpsTelemetry[] {
    return this.recentTelemetry;
  }

  /**
   * Server Telemetry & Ingestion Throughput Statistics
   */
  public getStats(): GpsServerStats {
    const received = this.stats.totalPacketsReceived;
    const persisted = this.stats.totalPacketsPersisted;
    const errorRate = received > 0 ? Math.max(0, (received - persisted) / received) : 0;
    return {
      totalPacketsReceived: received,
      totalPacketsPersisted: persisted,
      validPacketsProcessed: persisted,
      errorRate: Number(errorRate.toFixed(4)),
      totalAlertsTriggered: this.stats.totalAlertsTriggered,
      activeImeis: this.stats.activeImeis,
      lastPacketAt: this.stats.lastPacketAt,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      supabaseConnected: isSupabaseConfigured(),
    };
  }
}

export const gpsIngestionService = GpsIngestionService.getInstance();
