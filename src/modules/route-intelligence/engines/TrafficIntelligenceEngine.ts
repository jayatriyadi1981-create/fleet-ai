/**
 * Fleet Intelligence Smart AI - Traffic Intelligence Engine
 * Provider abstraction supporting Live Traffic, Historical Patterns, Segment Speeds,
 * Bottleneck Analytics, and Delay Impacts.
 */

import { TrafficIntelligenceSegment, TrafficStatus } from '../types';

export interface TrafficProvider {
  name: string;
  isAvailable: boolean;
  getSegmentTraffic(segmentId: string): Promise<TrafficIntelligenceSegment | null>;
  getAllSegments(): TrafficIntelligenceSegment[];
}

export class MockTrafficProvider implements TrafficProvider {
  public name = 'FleetTelematics-Traffic-Engine-v1 (Demo Mode)';
  public isAvailable = true;

  private mockSegments: TrafficIntelligenceSegment[] = [
    {
      segmentId: 'seg-japek-km14',
      roadName: 'Tol Jakarta - Cikampek KM 14-19 (Cikunir Ramp)',
      city: 'Bekasi Barat',
      coordinates: [
        { lat: -6.2390, lng: 106.9450, name: 'KM 14 Cikunir' },
        { lat: -6.2420, lng: 106.9680, name: 'KM 19 Bekasi Barat' },
      ],
      currentSpeedKmh: 24,
      freeFlowSpeedKmh: 75,
      trafficStatus: 'HEAVY',
      delayMinutes: 14,
      delayPercentage: 58,
      historicalTrend: 'Kepadatan tinggi rutin pukul 07:00-09:30 & 16:30-19:30 WIB.',
      bottleneckImpact: '+14 menit keterlambatan rata-rata untuk 82 perjalanan aktif.',
      peakHours: '07:30 - 09:30 & 17:00 - 19:30',
    },
    {
      segmentId: 'seg-kalimalang-arteri',
      roadName: 'Jl. KH. Noer Ali (Kalimalang) - Sumber Artha',
      city: 'Jakarta Timur - Bekasi',
      coordinates: [
        { lat: -6.2410, lng: 106.9180, name: 'Sumber Artha' },
        { lat: -6.2460, lng: 106.9550, name: 'Metropolitan Mall' },
      ],
      currentSpeedKmh: 18,
      freeFlowSpeedKmh: 45,
      trafficStatus: 'MODERATE',
      delayMinutes: 8,
      delayPercentage: 35,
      historicalTrend: 'Terdapat 6 simpang lampu merah & penyempitan jembatan.',
      bottleneckImpact: '+8 menit delay vs jadwal normal.',
      peakHours: '08:00 - 10:00 & 16:00 - 18:30',
    },
    {
      segmentId: 'seg-jorr-cilandak',
      roadName: 'Tol JORR S (TB Simatupang - Pasar Rebo)',
      city: 'Jakarta Selatan - Timur',
      coordinates: [
        { lat: -6.3010, lng: 106.8400, name: 'Cilandak Toll' },
        { lat: -6.3120, lng: 106.8850, name: 'Pasar Rebo Exit' },
      ],
      currentSpeedKmh: 42,
      freeFlowSpeedKmh: 80,
      trafficStatus: 'MODERATE',
      delayMinutes: 6,
      delayPercentage: 22,
      historicalTrend: 'Arus tersendat di antrean gerbang keluar tol.',
      bottleneckImpact: '+6 menit delay waktu tempuh.',
      peakHours: '07:00 - 09:00 & 17:30 - 20:00',
    },
    {
      segmentId: 'seg-jagorawi-cibubur',
      roadName: 'Tol Jagorawi KM 11 - KM 15 (Cibubur Junction)',
      city: 'Jakarta Timur / Depok',
      coordinates: [
        { lat: -6.3650, lng: 106.8920, name: 'Cibubur Junction' },
        { lat: -6.4020, lng: 106.8790, name: 'Cimanggis Utama' },
      ],
      currentSpeedKmh: 68,
      freeFlowSpeedKmh: 80,
      trafficStatus: 'LIGHT',
      delayMinutes: 2,
      delayPercentage: 5,
      historicalTrend: 'Lalu lintas relatif lancar di luar jam libur akhir pekan.',
      bottleneckImpact: 'Dampak minimal pada armada logistik.',
      peakHours: 'Jumat sore & Minggu malam',
    },
    {
      segmentId: 'seg-cakung-cilincing',
      roadName: 'Jl. Raya Cakung Cilincing (Akses Pelabuhan Tanjung Priok)',
      city: 'Jakarta Utara',
      coordinates: [
        { lat: -6.1420, lng: 106.9280, name: 'Depot Kontainer Cakung' },
        { lat: -6.1150, lng: 106.8950, name: 'Gerbang Tanjung Priok' },
      ],
      currentSpeedKmh: 12,
      freeFlowSpeedKmh: 50,
      trafficStatus: 'SEVERE',
      delayMinutes: 26,
      delayPercentage: 78,
      historicalTrend: 'Antrean tronton kargo pelabuhan & aktivitas bongkar muat kontainer.',
      bottleneckImpact: '+26 menit delay parah bagi armada logistik pelabuhan.',
      peakHours: '10:00 - 16:00 & 20:00 - 23:00',
    },
  ];

  public async getSegmentTraffic(segmentId: string): Promise<TrafficIntelligenceSegment | null> {
    return this.mockSegments.find((s) => s.segmentId === segmentId) || null;
  }

  public getAllSegments(): TrafficIntelligenceSegment[] {
    return this.mockSegments;
  }
}

export class TrafficIntelligenceEngine {
  private static instance: TrafficIntelligenceEngine;
  private provider: TrafficProvider;

  private constructor() {
    this.provider = new MockTrafficProvider();
  }

  public static getInstance(): TrafficIntelligenceEngine {
    if (!TrafficIntelligenceEngine.instance) {
      TrafficIntelligenceEngine.instance = new TrafficIntelligenceEngine();
    }
    return TrafficIntelligenceEngine.instance;
  }

  public setProvider(provider: TrafficProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public getAllSegments(): TrafficIntelligenceSegment[] {
    return this.provider.getAllSegments();
  }

  public calculateTrafficImpact(plannedDurationMinutes: number, currentTrafficStatus: TrafficStatus): {
    normalDurationMinutes: number;
    currentEstimatedDurationMinutes: number;
    delayMinutes: number;
    delayPercentage: number;
  } {
    let multiplier = 1.0;
    if (currentTrafficStatus === 'SEVERE') multiplier = 1.65;
    else if (currentTrafficStatus === 'HEAVY') multiplier = 1.40;
    else if (currentTrafficStatus === 'MODERATE') multiplier = 1.20;
    else if (currentTrafficStatus === 'LIGHT') multiplier = 1.05;

    const currentDuration = Math.round(plannedDurationMinutes * multiplier);
    const delay = Math.max(0, currentDuration - plannedDurationMinutes);
    const delayPercent = plannedDurationMinutes > 0 ? Math.round((delay / plannedDurationMinutes) * 100) : 0;

    return {
      normalDurationMinutes: plannedDurationMinutes,
      currentEstimatedDurationMinutes: currentDuration,
      delayMinutes: delay,
      delayPercentage: delayPercent,
    };
  }
}

export const trafficIntelligenceEngine = TrafficIntelligenceEngine.getInstance();
