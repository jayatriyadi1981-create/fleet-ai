/**
 * Fleet Intelligence Smart AI - Delivery Optimization Engine
 * Optimizes multi-stop sequence, delivery time-windows, priority constraints,
 * predicts per-stop ETA, and detects delivery window breach risks.
 */

import { DeliveryOptimizationPlan, DeliveryStopItem, OptimizationObjective } from '../types';

export class DeliveryOptimizationEngine {
  private static instance: DeliveryOptimizationEngine;

  private mockPlans: DeliveryOptimizationPlan[] = [
    {
      planId: 'plan-del-101',
      manifestNumber: 'MANIFEST-JKT-BKS-0816',
      vehicleId: 'v-b1234xx',
      plateNumber: 'B 1234 XX',
      driverName: 'Bambang Supriyanto',
      branch: 'Jakarta Timur (Cakung)',
      totalStops: 4,
      totalDistanceKm: 42.6,
      totalDurationMinutes: 145,
      objectiveUsed: 'BALANCED',
      status: 'IN_PROGRESS',
      stops: [
        {
          orderId: 'ORD-9821',
          customerName: 'PT. Indomakmur Semesta (Gudang Bekasi Barat)',
          address: 'Jl. Ahmad Yani No. 45, Bekasi Selatan',
          coordinates: { lat: -6.2410, lng: 106.9920 },
          timeWindow: { start: '09:00', end: '10:30' },
          priority: 'URGENT',
          sequence: 1,
          predictedETA: '09:25',
          windowRisk: 'LOW',
          onTimeProbabilityPercentage: 96,
          status: 'COMPLETED',
        },
        {
          orderId: 'ORD-9824',
          customerName: 'Super Indo Summarecon Mall',
          address: 'Kav. Commercial Summarecon, Bekasi Utara',
          coordinates: { lat: -6.2250, lng: 107.0010 },
          timeWindow: { start: '10:30', end: '12:00' },
          priority: 'HIGH',
          sequence: 2,
          predictedETA: '10:55',
          windowRisk: 'LOW',
          onTimeProbabilityPercentage: 92,
          status: 'IN_PROGRESS',
        },
        {
          orderId: 'ORD-9829',
          customerName: 'PT. Cikarang Logistik Mega',
          address: 'Kawasan Industri Jababeka V, Cikarang',
          coordinates: { lat: -6.3120, lng: 107.1450 },
          timeWindow: { start: '13:00', end: '14:30' },
          priority: 'NORMAL',
          sequence: 3,
          predictedETA: '13:40',
          windowRisk: 'MODERATE',
          onTimeProbabilityPercentage: 84,
          status: 'PENDING',
        },
        {
          orderId: 'ORD-9835',
          customerName: 'Depot Retail Cibitung',
          address: 'Jl. Teuku Umar No. 18, Cibitung',
          coordinates: { lat: -6.2750, lng: 107.0850 },
          timeWindow: { start: '15:00', end: '16:30' },
          priority: 'NORMAL',
          sequence: 4,
          predictedETA: '15:15',
          windowRisk: 'LOW',
          onTimeProbabilityPercentage: 94,
          status: 'PENDING',
        },
      ],
    },
    {
      planId: 'plan-del-102',
      manifestNumber: 'MANIFEST-SBY-SDA-0816',
      vehicleId: 'v-w3341tz',
      plateNumber: 'W 3341 TZ',
      driverName: 'Agus Pratama',
      branch: 'Surabaya (Rungkut)',
      totalStops: 3,
      totalDistanceKm: 34.0,
      totalDurationMinutes: 110,
      objectiveUsed: 'FASTEST',
      status: 'IN_PROGRESS',
      stops: [
        {
          orderId: 'ORD-7712',
          customerName: 'Gudang Farmasi Sidoarjo',
          address: 'Jl. Raya Tropodo No. 12, Waru, Sidoarjo',
          coordinates: { lat: -7.3650, lng: 112.7650 },
          timeWindow: { start: '08:30', end: '10:00' },
          priority: 'HIGH',
          sequence: 1,
          predictedETA: '09:10',
          windowRisk: 'LOW',
          onTimeProbabilityPercentage: 98,
          status: 'COMPLETED',
        },
        {
          orderId: 'ORD-7718',
          customerName: 'Mitra 10 Jenggolo',
          address: 'Jl. Jenggolo No. 88, Sidoarjo Kota',
          coordinates: { lat: -7.4420, lng: 112.7180 },
          timeWindow: { start: '10:30', end: '11:45' },
          priority: 'NORMAL',
          sequence: 2,
          predictedETA: '11:05',
          windowRisk: 'LOW',
          onTimeProbabilityPercentage: 91,
          status: 'IN_PROGRESS',
        },
        {
          orderId: 'ORD-7725',
          customerName: 'Depot Krian Sentosa',
          address: 'Kawasan Industri Krian, Sidoarjo',
          coordinates: { lat: -7.4120, lng: 112.5920 },
          timeWindow: { start: '13:00', end: '14:30' },
          priority: 'NORMAL',
          sequence: 3,
          predictedETA: '13:50',
          windowRisk: 'MODERATE',
          onTimeProbabilityPercentage: 86,
          status: 'PENDING',
        },
      ],
    },
  ];

  private constructor() {}

  public static getInstance(): DeliveryOptimizationEngine {
    if (!DeliveryOptimizationEngine.instance) {
      DeliveryOptimizationEngine.instance = new DeliveryOptimizationEngine();
    }
    return DeliveryOptimizationEngine.instance;
  }

  public getAllPlans(): DeliveryOptimizationPlan[] {
    return this.mockPlans;
  }

  public optimizeStopSequence(stops: DeliveryStopItem[], objective: OptimizationObjective): DeliveryStopItem[] {
    // Re-orders stops ensuring URGENT and earliest time windows come first
    const sorted = [...stops].sort((a, b) => {
      if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1;
      if (b.priority === 'URGENT' && a.priority !== 'URGENT') return 1;
      return a.timeWindow.start.localeCompare(b.timeWindow.start);
    });

    return sorted.map((s, idx) => ({
      ...s,
      sequence: idx + 1,
    }));
  }
}

export const deliveryOptimizationEngine = DeliveryOptimizationEngine.getInstance();
