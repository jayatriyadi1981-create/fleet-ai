/**
 * Fleet Intelligence Smart AI - Trip Status Transition State Machine Service
 * PROMPT 15 — State Machine to enforce strict operational lifecycle flow
 */

import { PlannedTripStatus } from '../plannedTripTypes';

export class TripStatusTransitionService {
  /**
   * Defines allowed status transitions for operational trips
   */
  private static ALLOWED_TRANSITIONS: Record<PlannedTripStatus, PlannedTripStatus[]> = {
    DRAFT: ['PLANNED', 'CANCELLED'],
    PLANNED: ['ASSIGNED', 'DRAFT', 'CANCELLED'],
    ASSIGNED: ['READY', 'PLANNED', 'DISPATCHED', 'CANCELLED'],
    READY: ['DISPATCHED', 'CANCELLED'],
    DISPATCHED: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT: ['ARRIVED', 'DELAYED', 'CANCELLED', 'FAILED'],
    DELAYED: ['IN_TRANSIT', 'ARRIVED', 'CANCELLED', 'FAILED'],
    ARRIVED: ['COMPLETED', 'IN_TRANSIT', 'CANCELLED'],
    COMPLETED: [], // Terminal state
    CANCELLED: [], // Terminal state
    FAILED: [],    // Terminal state
  };

  /**
   * Validate if a transition from currentStatus to nextStatus is allowed by policy
   */
  public static canTransition(currentStatus: PlannedTripStatus, nextStatus: PlannedTripStatus): boolean {
    if (currentStatus === nextStatus) return true; // Idempotent
    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(nextStatus);
  }

  /**
   * Get list of valid next statuses for UI buttons
   */
  public static getValidNextStatuses(currentStatus: PlannedTripStatus): PlannedTripStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Friendly label for status badge in Indonesian
   */
  public static getStatusLabel(status: PlannedTripStatus): string {
    const labels: Record<PlannedTripStatus, string> = {
      DRAFT: 'Draft (Konsep)',
      PLANNED: 'Terencana (Planned)',
      ASSIGNED: 'Armada & Driver Ditunjuk',
      READY: 'Siap Berangkat (Ready)',
      DISPATCHED: 'Telah Didispatch',
      IN_TRANSIT: 'Dalam Perjalanan (In Transit)',
      ARRIVED: 'Tiba di Tujuan (Arrived)',
      COMPLETED: 'Selesai (Completed)',
      DELAYED: 'Terlambat (Delayed)',
      CANCELLED: 'Dibatalkan (Cancelled)',
      FAILED: 'Gagal (Failed)',
    };
    return labels[status] || status;
  }

  /**
   * Badge color styles for status
   */
  public static getStatusBadgeStyle(status: PlannedTripStatus): { bg: string; text: string; border: string } {
    switch (status) {
      case 'DRAFT':
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
      case 'PLANNED':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'ASSIGNED':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      case 'READY':
        return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
      case 'DISPATCHED':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'IN_TRANSIT':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'ARRIVED':
        return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
      case 'COMPLETED':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
      case 'DELAYED':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'CANCELLED':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      case 'FAILED':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    }
  }
}
