/**
 * Fleet Intelligence Smart AI - Analytics Data Source Registry
 * PROMPT 53 — Section 40
 * Registers all telematics datasets, required permissions, metric mappings, and drilldown targets.
 */

import { ActiveView } from '../../../context/FleetContext';

export interface DataSourceDefinition {
  name: string;
  category: string;
  requiredPermission: string;
  metrics: string[];
  dimensions: string[];
  filters: string[];
  targetView: ActiveView;
  description: string;
}

export class AnalyticsDataSourceRegistry {
  private static dataSources: Map<string, DataSourceDefinition> = new Map();

  static {
    this.registerAllSources();
  }

  private static registerAllSources() {
    const sources: DataSourceDefinition[] = [
      {
        name: 'Fleet & Vehicles',
        category: 'fleet',
        requiredPermission: 'vehicle.view',
        metrics: ['fleet_count', 'active_vehicles', 'offline_vehicles', 'utilization', 'mileage', 'downtime'],
        dimensions: ['vehicle', 'branch', 'department', 'fleet', 'status'],
        filters: ['branch', 'department', 'status', 'vehicle_type'],
        targetView: 'vehicles',
        description: 'Telematics GPS status, odometer, status operasional, dan data master unit',
      },
      {
        name: 'Fuel Monitoring',
        category: 'fuel',
        requiredPermission: 'fuel.view',
        metrics: ['fuel_consumption', 'fuel_cost', 'fuel_efficiency', 'fuel_per_km'],
        dimensions: ['vehicle', 'driver', 'branch', 'route', 'month'],
        filters: ['vehicle', 'branch', 'date'],
        targetView: 'fuel',
        description: 'Sensor IoT level tangki BBM, transaksi pengisian solar, dan deteksi anomali/theft',
      },
      {
        name: 'Maintenance & Service',
        category: 'maintenance',
        requiredPermission: 'maintenance.view',
        metrics: ['maintenance_cost', 'service_due', 'downtime'],
        dimensions: ['vehicle', 'branch', 'status', 'month'],
        filters: ['vehicle', 'status', 'branch'],
        targetView: 'maintenance',
        description: 'Work order servis berkala, riwayat perbaikan bengkel, dan jadwal servis',
      },
      {
        name: 'Driver Behavior & Coaching',
        category: 'driver',
        requiredPermission: 'driver.view',
        metrics: ['driver_score', 'overspeed', 'harsh_braking', 'harsh_acceleration', 'idle_time'],
        dimensions: ['driver', 'vehicle', 'branch', 'month'],
        filters: ['driver', 'branch'],
        targetView: 'drivers',
        description: 'Skor telematika eco-driving, pelanggaran overspeed, dan rekaman insiden pengemudi',
      },
      {
        name: 'Safety & Fatigue',
        category: 'safety',
        requiredPermission: 'safety.view',
        metrics: ['safety_score', 'incidents', 'fatigue_risk'],
        dimensions: ['vehicle', 'driver', 'branch', 'date'],
        filters: ['branch', 'severity'],
        targetView: 'safety',
        description: 'Peringatan ADAS, fatigue AI camera, dan audit kepatuhan HSE',
      },
      {
        name: 'Cost & Financial Analytics',
        category: 'cost',
        requiredPermission: 'cost.view',
        metrics: ['operating_cost', 'cost_per_km', 'fuel_cost', 'maintenance_cost'],
        dimensions: ['branch', 'department', 'vehicle', 'month'],
        filters: ['branch', 'department', 'month'],
        targetView: 'cost_analytics',
        description: 'Total Cost of Ownership (TCO), alokasi biaya per departemen, dan ledger biaya',
      },
      {
        name: 'Delivery & POD',
        category: 'delivery',
        requiredPermission: 'trip.view',
        metrics: ['on_time_delivery', 'orders_count', 'delayed_trips'],
        dimensions: ['route', 'driver', 'vehicle', 'date'],
        filters: ['route', 'status', 'date'],
        targetView: 'deliveries',
        description: 'Manajemen Surat Jalan, Proof of Delivery (POD), dan SLA pengiriman',
      },
      {
        name: 'Executive & C-Level',
        category: 'executive',
        requiredPermission: 'executive.dashboard.view',
        metrics: ['operating_cost', 'utilization', 'safety_score', 'cost_per_km'],
        dimensions: ['branch', 'month', 'quarter'],
        filters: ['period', 'branch'],
        targetView: 'executive_report',
        description: 'Agregasi KPI eksekutif C-Level, dewan direksi, dan proyeksi bisnis',
      },
    ];

    sources.forEach((s) => this.dataSources.set(s.name, s));
  }

  public static getDataSource(name: string): DataSourceDefinition | undefined {
    return this.dataSources.get(name);
  }

  public static getAllDataSources(): DataSourceDefinition[] {
    return Array.from(this.dataSources.values());
  }

  public static getSourcesForPermissions(userPermissions: string[], isSuperAdmin: boolean = false): DataSourceDefinition[] {
    if (isSuperAdmin) return this.getAllDataSources();
    return this.getAllDataSources().filter((ds) => userPermissions.includes(ds.requiredPermission) || userPermissions.includes('ai.view'));
  }
}
