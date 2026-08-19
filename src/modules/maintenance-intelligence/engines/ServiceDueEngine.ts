/**
 * Fleet Intelligence Smart AI - Service Due Engine
 * Evaluates periodic service intervals based on mileage, engine hours, and calendar days.
 * Calculates predictive next-service dates using average daily utilization.
 */

import { ServiceDueItem, ServiceDueStatus } from '../types';

export interface ServiceEvaluationParam {
  id: string;
  vehicleId: string;
  plateNumber: string;
  branch: string;
  serviceType: string;
  intervalMileageKm: number;
  intervalDays: number;
  intervalEngineHours?: number;
  lastServiceMileage: number;
  lastServiceDate: string;
  currentMileage: number;
  currentEngineHours: number;
  avgDailyMileageKm: number;
  estimatedCost: number;
  partsRequired: string[];
}

export class ServiceDueEngine {
  /**
   * Calculates service due status and prediction metrics for a scheduled service item
   */
  public static evaluateServiceDue(param: ServiceEvaluationParam): ServiceDueItem {
    const nextServiceMileage = param.lastServiceMileage + param.intervalMileageKm;
    const remainingMileage = nextServiceMileage - param.currentMileage;

    const lastDate = new Date(param.lastServiceDate);
    const nextDueDate = new Date(lastDate.getTime() + param.intervalDays * 24 * 60 * 60 * 1000);
    const now = new Date();

    const daysRemaining = Math.round((nextDueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

    // Daily run rate projection
    const dailyKm = Math.max(20, param.avgDailyMileageKm || 120);
    const daysUntilMileageDue = Math.max(0, Math.round(remainingMileage / dailyKm));

    // Determine earliest trigger
    const predictedDays = Math.min(daysRemaining, daysUntilMileageDue);
    const predictedServiceDate = new Date(now.getTime() + predictedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const predictedServiceMileage = Math.round(param.currentMileage + (predictedDays * dailyKm));

    let status: ServiceDueStatus = 'NORMAL';
    if (remainingMileage < -1500 || daysRemaining < -14) {
      status = 'CRITICAL_OVERDUE';
    } else if (remainingMileage <= 0 || daysRemaining <= 0) {
      status = 'OVERDUE';
    } else if (remainingMileage <= 1000 || daysRemaining <= 7) {
      status = 'DUE_SOON';
    } else if (remainingMileage <= 2000 || daysRemaining <= 14) {
      status = 'DUE';
    }

    return {
      id: param.id,
      vehicleId: param.vehicleId,
      plateNumber: param.plateNumber,
      branch: param.branch,
      serviceType: param.serviceType,
      intervalType: 'COMBINED',
      currentMileage: param.currentMileage,
      nextServiceMileage,
      remainingMileage,
      currentEngineHours: param.currentEngineHours,
      nextServiceEngineHours: param.currentEngineHours + (param.intervalEngineHours || 250),
      remainingEngineHours: Math.max(0, (param.currentEngineHours + (param.intervalEngineHours || 250)) - param.currentEngineHours),
      lastServiceDate: param.lastServiceDate,
      nextServiceDueDate: nextDueDate.toISOString().split('T')[0],
      predictedServiceDate,
      predictedServiceMileage,
      status,
      estimatedCost: param.estimatedCost,
      partsRequired: param.partsRequired,
    };
  }
}
