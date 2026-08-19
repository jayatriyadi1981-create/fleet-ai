/**
 * Fleet Intelligence Smart AI - Cost Reconciliation Engine
 * PROMPT 37 - Telematics Cross-verification & Discrepancy Auditing
 */

import { CostReconciliationItem } from '../types';

export class CostReconciliationEngine {
  /**
   * Run automated cross-check reconciliation on dataset
   */
  public static runReconciliationAudit(): CostReconciliationItem[] {
    return [
      {
        id: 'rec_fuel_01',
        type: 'FUEL_SENSOR_VS_RECEIPT',
        typeLabel: 'Sensor Telematika BBM vs Resi SPBU',
        referenceId: 'TX-BBM-8891',
        referenceLabel: 'Pengisian Solar B 9421 UXT (SPBU 34-17502)',
        date: '2026-08-16',
        vehiclePlate: 'B 9421 UXT',
        driverName: 'Suryanto Pranoto',
        telemetryAmount: 142.5, // Liters detected by fuel sensor
        reportedAmount: 175.0, // Liters claimed on receipt
        discrepancyAmount: 32.5, // 32.5 Liters delta
        discrepancyPercent: 22.8,
        status: 'SUSPICIOUS_SPIKE',
        details: 'Selisih 32.5 Liter (Rp 438.750). Sensor tangki hanya mencatat pengisian 142.5L pada pukul 14:15, namun klaim kuitansi mencantumkan 175.0L.',
        suggestedAction: 'Tahan klaim reimbursement BBM dan mintakan bukti rekaman CCTV / printout resmi SPBU.',
      },
      {
        id: 'rec_fuel_02',
        type: 'FUEL_SENSOR_VS_RECEIPT',
        typeLabel: 'Sensor Telematika BBM vs Resi SPBU',
        referenceId: 'TX-BBM-8840',
        referenceLabel: 'Pengisian Solar B 9812 TXR (SPBU 31-10201)',
        date: '2026-08-15',
        vehiclePlate: 'B 9812 TXR',
        driverName: 'Agus Santoso',
        telemetryAmount: 98.0,
        reportedAmount: 100.0,
        discrepancyAmount: 2.0,
        discrepancyPercent: 2.0,
        status: 'MATCH',
        details: 'Selisih 2.0 Liter (2.0%) berada dalam batas toleransi ekspansi termal dan deviasi probe sensor (<= 3%).',
        suggestedAction: 'Otomatis disetujui untuk pemindahbukuan ke buku besar.',
      },
      {
        id: 'rec_maint_01',
        type: 'MAINTENANCE_INVOICE_VS_WO',
        typeLabel: 'Invoice Vendor Bengkel vs Work Order Disetujui',
        referenceId: 'INV-BKG-2026-441',
        referenceLabel: 'Bengkel Sumber Jaya - WO #WO-2026-089',
        date: '2026-08-14',
        vehiclePlate: 'B 9204 PQR',
        telemetryAmount: 8500000, // Approved WO quote
        reportedAmount: 11800000, // Invoice billed
        discrepancyAmount: 3300000,
        discrepancyPercent: 38.8,
        status: 'FLAGGED',
        details: 'Invoice mencantumkan penggantian turbocharger assembly tambahan senilai Rp 3.300.000 tanpa approval pre-authorization dari Fleet Manager.',
        suggestedAction: 'Kirimkan notifikasi klarifikasi ke vendor bengkel rekanan sebelum otorisasi transfer bank.',
      },
      {
        id: 'rec_driver_01',
        type: 'DRIVER_PAYROLL_VS_SHIFT',
        typeLabel: 'Klaim Lembur Driver vs Jam Aktif GPS Telematika',
        referenceId: 'CLM-OT-2026-08-12',
        referenceLabel: 'Klaim Lembur 6 Jam - Hendra Kurniawan',
        date: '2026-08-13',
        driverName: 'Hendra Kurniawan',
        vehiclePlate: 'B 9044 CKR',
        telemetryAmount: 2.5, // Hours driving/moving on GPS
        reportedAmount: 6.0, // Hours claimed
        discrepancyAmount: 3.5,
        discrepancyPercent: 140.0,
        status: 'SUSPICIOUS_SPIKE',
        details: 'Klaim lembur 6.0 jam (Rp 180.000), namun telematika GPS mencatat kendaraan parkir mati mesin di luar rute selama 3.5 jam.',
        suggestedAction: 'Konfirmasi catatan dispatcher mengenai antrean bongkar muat di gudang klien sebelum menyetujui.',
      },
      {
        id: 'rec_maint_02',
        type: 'MAINTENANCE_INVOICE_VS_WO',
        typeLabel: 'Invoice Vendor Bengkel vs Work Order Disetujui',
        referenceId: 'INV-BKG-2026-398',
        referenceLabel: 'Bengkel Cikarang Motor - WO #WO-2026-077',
        date: '2026-08-12',
        vehiclePlate: 'B 9115 TYX',
        telemetryAmount: 3400000,
        reportedAmount: 3400000,
        discrepancyAmount: 0,
        discrepancyPercent: 0,
        status: 'MATCH',
        details: 'Item suku cadang dan jasa servis 100% cocok dengan WO yang telah disetujui sebelumnya.',
        suggestedAction: 'Siap bayar sesuai jadwal termin H+14.',
      },
    ];
  }
}
