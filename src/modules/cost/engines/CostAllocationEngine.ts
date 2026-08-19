/**
 * Fleet Intelligence Smart AI - Cost Allocation Engine
 * PROMPT 37 - Proportional Allocation & Double-Counting Prevention
 */

import { CostRecord, AllocationMethod, CostCategoryKey } from '../types';

export interface AllocationTarget {
  id: string; // vehicleId, driverId, tripId, branchId, etc.
  label: string;
  weightMetric: number; // distance in km, trip count, operating hours, percentage
}

export class CostAllocationEngine {
  /**
   * Allocate a single root cost record into multiple child records
   */
  public static allocateCostRecord(
    parentRecord: CostRecord,
    method: AllocationMethod,
    targets: AllocationTarget[],
    allocatedBy: string
  ): {
    updatedParent: CostRecord;
    childRecords: CostRecord[];
  } {
    const totalWeight = targets.reduce((sum, t) => sum + (Number(t.weightMetric) || 0), 0);

    if (totalWeight <= 0) {
      throw new Error('Total bobot alokasi harus lebih besar dari 0.');
    }

    const updatedParent: CostRecord = {
      ...parentRecord,
      allocationMethod: method,
      allocationStatus: 'SPLIT_ALLOCATED',
    };

    const childRecords: CostRecord[] = [];
    let allocatedSum = 0;

    targets.forEach((target, index) => {
      // Calculate share
      const ratio = target.weightMetric / totalWeight;
      let allocatedAmount = Math.round(parentRecord.amount * ratio);

      // Adjust rounding discrepancy on last item
      if (index === targets.length - 1) {
        allocatedAmount = parentRecord.amount - allocatedSum;
      } else {
        allocatedSum += allocatedAmount;
      }

      const childRecord: CostRecord = {
        id: `cost_alloc_${Date.now()}_${index}`,
        tenantId: parentRecord.tenantId,
        branchId: parentRecord.branchId,
        branchName: parentRecord.branchName,
        category: parentRecord.category,
        type: parentRecord.type,
        amount: allocatedAmount,
        currency: parentRecord.currency,
        date: parentRecord.date,
        source: parentRecord.source,
        sourceId: parentRecord.sourceId,
        allocationMethod: method,
        allocationStatus: 'DERIVED_CHILD',
        parentCostId: parentRecord.id,
        status: 'POSTED',
        createdBy: allocatedBy,
        createdAt: new Date().toISOString(),
        notes: `Alokasi proporsional dari ${parentRecord.id} (${method}) untuk ${target.label}. Bobot: ${target.weightMetric}`,
        tags: [...(parentRecord.tags || []), 'allocated_child'],
      };

      // Set specific target ID based on method
      if (method === 'BY_MILEAGE' || method === 'BY_OPERATING_HOURS') {
        childRecord.vehicleId = target.id;
        childRecord.vehiclePlate = target.label;
      } else if (method === 'BY_TRIP') {
        childRecord.tripId = target.id;
        childRecord.tripCode = target.label;
      } else if (method === 'BY_DRIVER_HOURS') {
        childRecord.driverId = target.id;
        childRecord.driverName = target.label;
      } else {
        childRecord.branchId = target.id;
        childRecord.branchName = target.label;
      }

      childRecords.push(childRecord);
    });

    return {
      updatedParent,
      childRecords,
    };
  }

  /**
   * Reverse an allocation, restoring parent to UNALLOCATED and removing child records
   */
  public static reverseAllocation(
    parentRecord: CostRecord,
    allRecords: CostRecord[]
  ): {
    updatedParent: CostRecord;
    remainingRecords: CostRecord[];
  } {
    const updatedParent: CostRecord = {
      ...parentRecord,
      allocationMethod: 'DIRECT',
      allocationStatus: 'UNALLOCATED',
    };

    // Remove child records that reference this parent
    const remainingRecords = allRecords.filter((r) => r.parentCostId !== parentRecord.id);

    return {
      updatedParent,
      remainingRecords,
    };
  }
}
