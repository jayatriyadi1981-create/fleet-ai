/**
 * Fleet Intelligence Smart AI - Historical Route Engine
 * Analyzes past trips, travel duration profiles by hour/day, bottleneck KM markers,
 * route reliability scores (0-100), and seasonal delay tendencies.
 */

import { HistoricalRouteItem, RouteReliabilityCategory } from '../types';

export class HistoricalRouteEngine {
  private static instance: HistoricalRouteEngine;

  private mockHistoricalRoutes: HistoricalRouteItem[] = [
    {
      routeId: 'rt-jkt-bdg',
      routeName: 'Jakarta (Cakung DC) ➔ Bandung (Gedebage Hub)',
      origin: 'DC Cakung, Jakarta Timur',
      destination: 'Hub Gedebage, Bandung',
      totalTripsAnalyzed: 284,
      avgDistanceKm: 148.5,
      avgDurationMinutes: 164, // ~2h 44m
      avgDelayMinutes: 14.2,
      onTimeRatePercentage: 88.4,
      deviationRatePercentage: 4.2,
      fuelConsumptionAvgLiters: 32.8,
      fuelPerKm: 0.22,
      routePerformanceScore: 89,
      reliabilityCategory: 'RELIABLE',
      dataQuality: 'HIGH',
      bottlenecks: [
        {
          id: 'bn-jkt-1',
          locationLabel: 'Tol Japek KM 10 - KM 19 (Simpang Cikunir)',
          kmMarker: 'KM 14.2',
          coordinates: { lat: -6.2410, lng: 106.9450 },
          averageDelayMinutes: 16.5,
          affectedTripsCount: 198,
          severity: 'HIGH',
          dominantCause: 'Penyatuan arus kendaraan dari JORR & jalan layang MBZ.',
          recommendedAction: 'Berangkat sebelum 06:15 atau gunakan rute elevated MBZ non-truk.',
        },
        {
          id: 'bn-jkt-2',
          locationLabel: 'Tol Cipularang KM 92 - KM 98 (Turunan Purbaleunyi)',
          kmMarker: 'KM 94.0',
          coordinates: { lat: -6.6450, lng: 107.4120 },
          averageDelayMinutes: 8.2,
          affectedTripsCount: 92,
          severity: 'MEDIUM',
          dominantCause: 'Kecepatan truk muatan berat melambat di tanjakan curam.',
          recommendedAction: 'Instruksikan pengemudi jaga jarak aman & cek fungsi rem (P32-Safety).',
        },
      ],
      hourlyTimeProfile: [
        { hour: '05:00 - 07:00', avgDurationMinutes: 135, trafficLevel: 'FREE' },
        { hour: '07:00 - 09:00', avgDurationMinutes: 185, trafficLevel: 'HEAVY' },
        { hour: '09:00 - 12:00', avgDurationMinutes: 152, trafficLevel: 'MODERATE' },
        { hour: '12:00 - 15:00', avgDurationMinutes: 148, trafficLevel: 'LIGHT' },
        { hour: '15:00 - 18:00', avgDurationMinutes: 192, trafficLevel: 'SEVERE' },
        { hour: '18:00 - 21:00', avgDurationMinutes: 168, trafficLevel: 'MODERATE' },
        { hour: '21:00 - 24:00', avgDurationMinutes: 138, trafficLevel: 'FREE' },
      ],
      dayOfWeekIntelligence: [
        { day: 'Senin', avgDelayMinutes: 18.5, delayFrequency: 'HIGH' },
        { day: 'Selasa', avgDelayMinutes: 8.2, delayFrequency: 'LOW' },
        { day: 'Rabu', avgDelayMinutes: 9.4, delayFrequency: 'LOW' },
        { day: 'Kamis', avgDelayMinutes: 11.2, delayFrequency: 'MEDIUM' },
        { day: 'Jumat', avgDelayMinutes: 24.8, delayFrequency: 'HIGH' },
        { day: 'Sabtu', avgDelayMinutes: 21.0, delayFrequency: 'HIGH' },
        { day: 'Minggu', avgDelayMinutes: 12.0, delayFrequency: 'MEDIUM' },
      ],
    },
    {
      routeId: 'rt-jkt-smg',
      routeName: 'Jakarta (Marunda DC) ➔ Semarang (Krapyak Hub)',
      origin: 'DC Marunda, Jakarta Utara',
      destination: 'Hub Krapyak, Semarang',
      totalTripsAnalyzed: 192,
      avgDistanceKm: 438.0,
      avgDurationMinutes: 345, // ~5h 45m
      avgDelayMinutes: 9.5,
      onTimeRatePercentage: 93.2,
      deviationRatePercentage: 2.1,
      fuelConsumptionAvgLiters: 96.4,
      fuelPerKm: 0.22,
      routePerformanceScore: 94,
      reliabilityCategory: 'HIGHLY_RELIABLE',
      dataQuality: 'HIGH',
      bottlenecks: [
        {
          id: 'bn-smg-1',
          locationLabel: 'Gerbang Tol Kalikangkung KM 414',
          kmMarker: 'KM 414.0',
          coordinates: { lat: -6.9850, lng: 110.3340 },
          averageDelayMinutes: 11.0,
          affectedTripsCount: 110,
          severity: 'MEDIUM',
          dominantCause: 'Antrean transaksi gerbang tol utama masuk Kota Semarang.',
          recommendedAction: 'Gunakan e-Toll saldo mencukupi & jalur gardu otomatis multi-axle.',
        },
      ],
      hourlyTimeProfile: [
        { hour: '06:00 - 12:00', avgDurationMinutes: 340, trafficLevel: 'LIGHT' },
        { hour: '12:00 - 18:00', avgDurationMinutes: 355, trafficLevel: 'MODERATE' },
        { hour: '18:00 - 24:00', avgDurationMinutes: 330, trafficLevel: 'FREE' },
        { hour: '00:00 - 06:00', avgDurationMinutes: 320, trafficLevel: 'FREE' },
      ],
      dayOfWeekIntelligence: [
        { day: 'Senin', avgDelayMinutes: 12.0, delayFrequency: 'MEDIUM' },
        { day: 'Selasa', avgDelayMinutes: 6.5, delayFrequency: 'LOW' },
        { day: 'Rabu', avgDelayMinutes: 7.0, delayFrequency: 'LOW' },
        { day: 'Kamis', avgDelayMinutes: 8.5, delayFrequency: 'LOW' },
        { day: 'Jumat', avgDelayMinutes: 16.0, delayFrequency: 'HIGH' },
        { day: 'Sabtu', avgDelayMinutes: 14.5, delayFrequency: 'MEDIUM' },
        { day: 'Minggu', avgDelayMinutes: 9.0, delayFrequency: 'LOW' },
      ],
    },
    {
      routeId: 'rt-sby-mlg',
      routeName: 'Surabaya (Rungkut Hub) ➔ Malang (Kepanjen Depot)',
      origin: 'Hub Rungkut, Surabaya',
      destination: 'Depot Kepanjen, Malang',
      totalTripsAnalyzed: 146,
      avgDistanceKm: 98.2,
      avgDurationMinutes: 115,
      avgDelayMinutes: 22.4,
      onTimeRatePercentage: 74.5,
      deviationRatePercentage: 8.4,
      fuelConsumptionAvgLiters: 24.2,
      fuelPerKm: 0.24,
      routePerformanceScore: 72,
      reliabilityCategory: 'MODERATE',
      dataQuality: 'HIGH',
      bottlenecks: [
        {
          id: 'bn-sby-1',
          locationLabel: 'Simpang Lawang - Singosari (Arteri Malang)',
          kmMarker: 'KM 78.5',
          coordinates: { lat: -7.8650, lng: 112.6780 },
          averageDelayMinutes: 24.0,
          affectedTripsCount: 118,
          severity: 'SEVERE',
          dominantCause: 'Pasar tumpah Lawang & perlintasan sebidang kereta api Singosari.',
          recommendedAction: 'Alihkan armada melalui Tol Pandaan-Malang Exit Madyopuro.',
        },
      ],
      hourlyTimeProfile: [
        { hour: '06:00 - 09:00', avgDurationMinutes: 135, trafficLevel: 'HEAVY' },
        { hour: '09:00 - 15:00', avgDurationMinutes: 110, trafficLevel: 'MODERATE' },
        { hour: '15:00 - 19:00', avgDurationMinutes: 145, trafficLevel: 'SEVERE' },
        { hour: '19:00 - 24:00', avgDurationMinutes: 95, trafficLevel: 'FREE' },
      ],
      dayOfWeekIntelligence: [
        { day: 'Senin', avgDelayMinutes: 18.0, delayFrequency: 'HIGH' },
        { day: 'Selasa', avgDelayMinutes: 12.0, delayFrequency: 'MEDIUM' },
        { day: 'Rabu', avgDelayMinutes: 14.0, delayFrequency: 'MEDIUM' },
        { day: 'Kamis', avgDelayMinutes: 16.0, delayFrequency: 'HIGH' },
        { day: 'Jumat', avgDelayMinutes: 32.0, delayFrequency: 'HIGH' },
        { day: 'Sabtu', avgDelayMinutes: 38.0, delayFrequency: 'HIGH' },
        { day: 'Minggu', avgDelayMinutes: 28.0, delayFrequency: 'HIGH' },
      ],
    },
  ];

  private constructor() {}

  public static getInstance(): HistoricalRouteEngine {
    if (!HistoricalRouteEngine.instance) {
      HistoricalRouteEngine.instance = new HistoricalRouteEngine();
    }
    return HistoricalRouteEngine.instance;
  }

  public getAllHistoricalRoutes(): HistoricalRouteItem[] {
    return this.mockHistoricalRoutes;
  }

  public getHistoricalRoute(routeId: string): HistoricalRouteItem | undefined {
    return this.mockHistoricalRoutes.find((r) => r.routeId === routeId);
  }
}

export const historicalRouteEngine = HistoricalRouteEngine.getInstance();
