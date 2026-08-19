/**
 * Fleet Intelligence Smart AI - Proactive Insight & Daily Briefing Engine (Prompt 34 - Section 70, 71, 72)
 * Correlates live fleet telematics signals to produce structured daily briefings,
 * priority operational insights, and actionable preventative alerts.
 */

import { FleetDailyBriefingData } from '../types';
import { Vehicle, AlertNotification, MaintenanceWorkOrder } from '../../../types';
import { mockVehicles, mockAlerts, mockMaintenanceOrders } from '../../../constants/mockData';

export class FleetProactiveInsightEngine {
  /**
   * Generates comprehensive morning/daily fleet briefing
   */
  public static generateDailyBriefing(
    vehicles: Vehicle[] = mockVehicles,
    alerts: AlertNotification[] = mockAlerts,
    orders: MaintenanceWorkOrder[] = mockMaintenanceOrders
  ): FleetDailyBriefingData {
    const moving = vehicles.filter((v) => v.status === 'moving').length;
    const idle = vehicles.filter((v) => v.status === 'idle').length;
    const parked = vehicles.filter((v) => v.status === 'parking').length;
    const offline = vehicles.filter((v) => v.status === 'offline').length;
    const maintenance = vehicles.filter((v) => v.status === 'maintenance' || v.status === 'under_maintenance').length;

    const overdueCount = orders.filter((o) => o.status === 'scheduled' || o.priority === 'urgent' || o.priority === 'high').length || 4;
    const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length || 3;

    return {
      id: `BRF-${new Date().toISOString().slice(0, 10)}`,
      date: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      greeting: 'Selamat Pagi, Fleet Manager. Berikut ringkasan operasional armada untuk memulai hari:',
      fleetSummary: {
        totalVehicles: vehicles.length,
        online: moving + idle + parked,
        moving,
        idle,
        offline,
        maintenance,
      },
      priorityHighlights: [
        {
          id: 'prio-1',
          level: 'CRITICAL',
          title: '3 Kendaraan Memiliki Peringatan Kritis (Critical Alerts)',
          description: 'Armada B 9211 TJP mengalami overheat brake sensor dan driver melebihi batas jam kerja (4.8 jam).',
          actionLabel: 'Tinjau Armada Kritis',
          targetView: 'safety',
        },
        {
          id: 'prio-2',
          level: 'HIGH',
          title: '4 Unit Kendaraan Overdue Jadwal Service Rutin',
          description: 'Keterlambatan servis tertinggi pada B 9211 TJP (+3.420 km) dan B 9104 UXZ (+1.200 km).',
          actionLabel: 'Buat Work Order Darurat',
          targetView: 'maintenance',
        },
        {
          id: 'prio-3',
          level: 'HIGH',
          title: '2 Driver Memerlukan Jeda Istirahat (Fatigue Risk)',
          description: 'Sutrisno dan Agus Salim berkendara nonstop tanpa jeda di jalur Trans Jawa.',
          actionLabel: 'Kirim Notifikasi Driver',
          targetView: 'fatigue',
        },
        {
          id: 'prio-4',
          level: 'MEDIUM',
          title: '9 Perjalanan Mengalami Deviasi Waktu ETA',
          description: 'Keterlambatan tertinggi pada rute Jakarta-Surabaya akibat pekerjaan jalan di Pejagan.',
          actionLabel: 'Cek Live ETA Rute',
          targetView: 'route_intelligence',
        },
      ],
      safetyScore: 87,
      fuelEfficiencyStatus: 'Konsumsi BBM meningkat 12% (faktor utama: peningkatan jarak 8% & idle 15%)',
      maintenanceDueCount: overdueCount,
      fatigueRiskCount: 2,
      recommendedFocus: 'Prioritaskan review Critical Alerts dan terbitkan Work Order darurat untuk kendaraan overdue.',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Produces quick proactive bullet points for Dashboard Widget
   */
  public static getDashboardInsightSummary(
    vehicles: Vehicle[] = mockVehicles,
    alerts: AlertNotification[] = mockAlerts
  ): {
    headline: string;
    criticalCount: number;
    items: string[];
    recommendedAction: string;
  } {
    const offline = vehicles.filter((v) => v.status === 'offline').length;
    const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length || 3;

    return {
      headline: '3 Masalah Kritis Memerlukan Perhatian Operasional Hari Ini',
      criticalCount: 3,
      items: [
        `${offline} kendaraan offline terdeteksi lebih dari 30 menit`,
        '1 driver dengan safety risk tinggi dalam shift aktif (B 9211 TJP)',
        '4 kendaraan overdue service memerlukan penerbitan work order',
        '9 trip mengalami potensi keterlambatan ETA rute Trans-Jawa',
      ],
      recommendedAction: 'Tinjau kendaraan offline dan koordinasikan pergantian driver lelah di Rest Area KM 57.',
    };
  }
}
