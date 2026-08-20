/**
 * Fleet Intelligence Smart AI - Database Production Configuration
 * PROMPT 59: Connection Pooling, Indexing Strategy, Partitioning, and Backup Policies
 */

export interface DatabaseConfig {
  provider: 'postgresql_supabase' | 'cloud_sql_postgresql';
  pool: {
    min: number;
    max: number;
    idleTimeoutMs: number;
    connectionTimeoutMs: number;
  };
  indexing: {
    telemetryIndexes: string[];
    coreTableIndexes: string[];
  };
  retention: {
    hotTelemetryDays: number;
    coldTelemetryDays: number;
    auditLogsDays: number;
    alertsDays: number;
  };
  backup: {
    enabled: boolean;
    frequency: 'HOURLY' | 'DAILY' | 'WEEKLY';
    automatedHourUtc: number;
    retentionDays: number;
    pointInTimeRecovery: boolean;
    storageBucket: string;
  };
}

export const databaseConfig: DatabaseConfig = {
  provider: 'postgresql_supabase',
  pool: {
    min: 2,
    max: 20,
    idleTimeoutMs: 30000,
    connectionTimeoutMs: 10000,
  },
  indexing: {
    telemetryIndexes: [
      'idx_telemetry_device_time (device_id, timestamp DESC)',
      'idx_telemetry_vehicle_time (vehicle_id, timestamp DESC)',
      'idx_telemetry_location (location GIST)',
      'idx_telemetry_tenant (tenant_id, timestamp DESC)',
    ],
    coreTableIndexes: [
      'idx_vehicles_tenant_branch (tenant_id, branch_id)',
      'idx_drivers_tenant_license (tenant_id, license_number)',
      'idx_trips_vehicle_status (vehicle_id, status)',
      'idx_alerts_tenant_unresolved (tenant_id, is_resolved, timestamp DESC)',
      'idx_audit_logs_tenant_time (tenant_id, timestamp DESC)',
    ],
  },
  retention: {
    hotTelemetryDays: 30,
    coldTelemetryDays: 365,
    auditLogsDays: 730, // 2 years
    alertsDays: 180,
  },
  backup: {
    enabled: true,
    frequency: 'DAILY',
    automatedHourUtc: 18, // 01:00 AM WIB (UTC+7)
    retentionDays: 30,
    pointInTimeRecovery: true,
    storageBucket: 'fleet-db-backups-immutable',
  },
};
