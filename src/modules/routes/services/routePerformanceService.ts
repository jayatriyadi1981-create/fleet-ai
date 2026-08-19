/**
 * Fleet Intelligence Smart AI - Route Performance & Analytics Service
 * PROMPT 16 — Performance Metrics, Variance Analysis & Route Efficiency Scores
 */

import { RoutePerformanceMetrics } from '../routeTypes';

class RoutePerformanceService {
  getRoutePerformance(routeId: string, plannedDist = 153.4, plannedDur = 208): RoutePerformanceMetrics {
    // Generate realistic historical variance metrics
    const actualDist = Math.round((plannedDist + (Math.random() * 8 - 3)) * 10) / 10;
    const actualDur = Math.round(plannedDur + (Math.random() * 25 - 5));
    const distVar = Math.round((actualDist - plannedDist) * 10) / 10;
    const durVar = actualDur - plannedDur;
    const avgDelay = Math.max(0, durVar);
    const devCount = Math.floor(Math.random() * 4);

    // Calculate score (0-100) based on variance and deviation frequency
    let score = 100 - Math.min(30, Math.abs(durVar) * 0.5) - devCount * 5;
    score = Math.max(60, Math.min(100, Math.round(score)));

    return {
      routeId,
      plannedDistanceKm: plannedDist,
      actualDistanceKm: actualDist,
      distanceVarianceKm: distVar,
      plannedDurationMinutes: plannedDur,
      actualDurationMinutes: actualDur,
      durationVarianceMinutes: durVar,
      averageDelayMinutes: avgDelay,
      deviationCount: devCount,
      fuelConsumedLiters: Math.round((actualDist / 3.4) * 10) / 10,
      routeEfficiencyScore: score,
      totalTripsCompleted: 42 + Math.floor(Math.random() * 20),
    };
  }

  getRouteAnalytics(routesCount: number) {
    return {
      mostUsedRoutes: ['RT-2026-000001 (Jakarta -> Bandung)', 'RT-2026-000002 (Jakarta -> Surabaya)'],
      mostDelayedRoutes: ['RT-2026-000004 (Medan -> Pekanbaru)'],
      highestDeviationRoutes: ['RT-2026-000003 (Semarang -> Solo)'],
      bestPerformingRoutes: ['RT-2026-000001 (Jakarta -> Bandung)'],
      avgFleetRouteEfficiency: 89.4,
    };
  }
}

export const routePerformanceService = new RoutePerformanceService();
