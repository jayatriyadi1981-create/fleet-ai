/**
 * Fleet Intelligence Smart AI - Route Risk Engine
 * Computes Route Risk Score based on Traffic exposure, Historical delays,
 * Deviation frequency, Driver risk profile, Road complexity, and Vehicle Maintenance Risk.
 */

import { ETADelayRisk } from '../types';

export interface RouteRiskAssessment {
  overallRiskScore: number; // 0-100
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: {
    trafficRisk: number;
    delayHistoryRisk: number;
    deviationRisk: number;
    driverBehaviorRisk: number;
    maintenanceRisk: number;
  };
  recommendations: string[];
  vehicleSuitability: 'OPTIMAL' | 'ACCEPTABLE' | 'ELEVATED_RISK' | 'NOT_RECOMMENDED';
}

export class RouteRiskEngine {
  private static instance: RouteRiskEngine;

  private constructor() {}

  public static getInstance(): RouteRiskEngine {
    if (!RouteRiskEngine.instance) {
      RouteRiskEngine.instance = new RouteRiskEngine();
    }
    return RouteRiskEngine.instance;
  }

  public assessRouteRisk(params: {
    trafficDelayMinutes: number;
    historicalDelayMinutes: number;
    deviationCount: number;
    driverSafetyScore?: number;
    vehicleMaintenanceRisk?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  }): RouteRiskAssessment {
    const {
      trafficDelayMinutes,
      historicalDelayMinutes,
      deviationCount,
      driverSafetyScore = 85,
      vehicleMaintenanceRisk = 'LOW'
    } = params;

    const trafficRisk = Math.min(100, trafficDelayMinutes * 3.5);
    const delayHistoryRisk = Math.min(100, historicalDelayMinutes * 3.0);
    const deviationRisk = Math.min(100, deviationCount * 25);
    const driverBehaviorRisk = Math.max(0, 100 - driverSafetyScore);
    
    let maintenanceRiskVal = 10;
    if (vehicleMaintenanceRisk === 'CRITICAL') maintenanceRiskVal = 95;
    else if (vehicleMaintenanceRisk === 'HIGH') maintenanceRiskVal = 70;
    else if (vehicleMaintenanceRisk === 'MODERATE') maintenanceRiskVal = 40;

    // Weighted risk score
    const overallRiskScore = Math.round(
      trafficRisk * 0.30 +
      delayHistoryRisk * 0.25 +
      deviationRisk * 0.15 +
      driverBehaviorRisk * 0.15 +
      maintenanceRiskVal * 0.15
    );

    let riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (overallRiskScore >= 75) riskCategory = 'CRITICAL';
    else if (overallRiskScore >= 50) riskCategory = 'HIGH';
    else if (overallRiskScore >= 25) riskCategory = 'MODERATE';

    const recommendations: string[] = [];
    if (trafficRisk > 40) {
      recommendations.push('Pertimbangkan rute alternatif (Tol Elevated/Outer Ring Road) untuk menghindari lonjakan delay.');
    }
    if (maintenanceRiskVal >= 70) {
      recommendations.push('Kendaraan memiliki risiko pemeliharaan tinggi. Pertimbangkan alokasi unit armada pengganti untuk rute luar kota.');
    }
    if (deviationRisk > 30) {
      recommendations.push('Terapkan pemantauan koridor geofence ketat dengan peringatan deviasi instan ke dispatcher.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Kondisi koridor dan kesiapan armada berada pada parameter optimal.');
    }

    let vehicleSuitability: 'OPTIMAL' | 'ACCEPTABLE' | 'ELEVATED_RISK' | 'NOT_RECOMMENDED' = 'OPTIMAL';
    if (vehicleMaintenanceRisk === 'CRITICAL') vehicleSuitability = 'NOT_RECOMMENDED';
    else if (vehicleMaintenanceRisk === 'HIGH' || overallRiskScore >= 60) vehicleSuitability = 'ELEVATED_RISK';
    else if (overallRiskScore >= 35) vehicleSuitability = 'ACCEPTABLE';

    return {
      overallRiskScore,
      riskCategory,
      factors: {
        trafficRisk: Math.round(trafficRisk),
        delayHistoryRisk: Math.round(delayHistoryRisk),
        deviationRisk: Math.round(deviationRisk),
        driverBehaviorRisk: Math.round(driverBehaviorRisk),
        maintenanceRisk: Math.round(maintenanceRiskVal),
      },
      recommendations,
      vehicleSuitability,
    };
  }
}

export const routeRiskEngine = RouteRiskEngine.getInstance();
