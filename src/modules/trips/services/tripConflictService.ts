/**
 * Fleet Intelligence Smart AI - Trip Conflict Detection Engine Service
 * PROMPT 15 — Vehicle & Driver Assignment Availability & Schedule Conflict Validation
 */

import { PlannedTrip, TripConflict } from '../plannedTripTypes';
import { Vehicle, Driver, MaintenanceWorkOrder } from '../../../types';

export class TripConflictService {
  /**
   * Check conflicts for vehicle & driver selection against existing trips & maintenance
   */
  public static checkConflicts(
    selectedVehicleId: string | undefined,
    selectedDriverId: string | undefined,
    scheduledDate: string,
    existingTrips: PlannedTrip[],
    currentTripId?: string,
    vehicles?: Vehicle[],
    drivers?: Driver[],
    maintenanceOrders?: MaintenanceWorkOrder[]
  ): TripConflict[] {
    const conflicts: TripConflict[] = [];

    if (!selectedVehicleId && !selectedDriverId) return conflicts;

    // 1. Vehicle Conflicts
    if (selectedVehicleId) {
      const activeVehicleTrip = existingTrips.find(
        (t) =>
          t.id !== currentTripId &&
          t.vehicleId === selectedVehicleId &&
          ['IN_TRANSIT', 'DISPATCHED', 'READY', 'ASSIGNED'].includes(t.status) &&
          t.scheduledDate === scheduledDate
      );

      if (activeVehicleTrip) {
        conflicts.push({
          type: 'VEHICLE_ASSIGNED',
          title: 'Konflik Penugasan Kendaraan',
          description: `Kendaraan sedang ditugaskan pada trip aktif ${activeVehicleTrip.tripNumber} (${activeVehicleTrip.origin.name} → ${activeVehicleTrip.destination.name}).`,
          conflictingTripId: activeVehicleTrip.id,
          severity: 'CRITICAL',
        });
      }

      // Check Maintenance Status
      if (vehicles) {
        const veh = vehicles.find((v) => v.id === selectedVehicleId);
        if (veh && (veh.status === 'maintenance' || veh.status === 'under_maintenance')) {
          conflicts.push({
            type: 'MAINTENANCE_SCHEDULED',
            title: 'Kendaraan Dalam Pemeliharaan (Maintenance)',
            description: `Kendaraan ${veh.plateNumber} berstatus Pemeliharaan/Servis. Periksa jadwal Work Order bengkel.`,
            severity: 'CRITICAL',
          });
        }
      }
    }

    // 2. Driver Conflicts
    if (selectedDriverId) {
      const activeDriverTrip = existingTrips.find(
        (t) =>
          t.id !== currentTripId &&
          t.driverId === selectedDriverId &&
          ['IN_TRANSIT', 'DISPATCHED', 'READY', 'ASSIGNED'].includes(t.status) &&
          t.scheduledDate === scheduledDate
      );

      if (activeDriverTrip) {
        conflicts.push({
          type: 'DRIVER_ASSIGNED',
          title: 'Konflik Penugasan Pengemudi (Driver)',
          description: `Driver sedang dalam tugas aktif untuk trip ${activeDriverTrip.tripNumber}. Mohon pilih driver lain atau sesuaikan jadwal.`,
          conflictingTripId: activeDriverTrip.id,
          severity: 'CRITICAL',
        });
      }

      // Check Driver Status
      if (drivers) {
        const drv = drivers.find((d) => d.id === selectedDriverId);
        if (drv && (((drv as any).status as string) === 'off_duty' || ((drv as any).status as string) === 'on_leave' || ((drv as any).status as string) === 'suspended')) {
          conflicts.push({
            type: 'SHIFT_CONFLICT',
            title: 'Pengemudi Tidak Bertugas (Off-Duty / On Leave)',
            description: `Pengemudi ${drv.name} tercatat Libur/Cuti/Tidak Bertugas pada sistem SDM.`,
            severity: 'WARNING',
          });
        }
      }
    }

    return conflicts;
  }
}
