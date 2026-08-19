/**
 * Fleet Intelligence Smart AI - Geofencing Domain Types
 * PROMPT 17 — Enterprise Geofencing Management, Event Engine & AI Intelligence
 */

import { Location } from '../../types';

export type GeofenceType = 'CIRCLE' | 'POLYGON' | 'POLYLINE' | 'CORRIDOR';

export type GeofenceCategory =
  | 'DEPOT'
  | 'WAREHOUSE'
  | 'OFFICE'
  | 'CUSTOMER'
  | 'PORT'
  | 'PROJECT_SITE'
  | 'PARKING'
  | 'FUEL_STATION'
  | 'RESTRICTED_AREA'
  | 'SERVICE_AREA'
  | 'CUSTOM';

export type GeofenceStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type GeofencePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type GeofenceEventType = 'ENTER' | 'EXIT' | 'DWELL' | 'SPEED_VIOLATION' | 'IDLE' | 'PARKING' | 'RESTRICTED_ENTRY';

export type GeofenceNotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH' | 'WHATSAPP' | 'SMS' | 'WEBHOOK';

export interface GeofenceSchedule {
  id: string;
  geofenceId: string;
  timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura' | string;
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string; // HH:mm e.g. "08:00"
  endTime: string;   // HH:mm e.g. "18:00"
  enabled: boolean;
  scheduleType: 'ALWAYS' | 'BUSINESS_HOURS' | 'CUSTOM';
}

export interface GeofenceAlertRule {
  id: string;
  geofenceId: string;
  eventType: GeofenceEventType;
  enabled: boolean;
  severity: GeofencePriority;
  notificationChannels: GeofenceNotificationChannel[];
  cooldownMinutes: number; // e.g. 60 mins
  recipients: string[];
}

export interface GeofenceAssignment {
  id: string;
  geofenceId: string;
  assignmentType: 'ALL' | 'VEHICLE_GROUP' | 'SPECIFIC_VEHICLE';
  vehicleIds?: string[];
  vehicleGroupNames?: string[];
  driverIds?: string[];
  driverGroupNames?: string[];
}

export interface Geofence {
  id: string;
  tenantId: string;
  name: string;
  code: string; // e.g. GEO-2026-000001
  description?: string;
  type: GeofenceType;
  
  // Geometry
  center: Location; // For circle center or polygon centroid
  radiusMeters: number; // For circle (e.g. 50, 100, 250, 500, 1000)
  polygonCoordinates: Location[]; // Array of lat/lng vertices for polygon
  
  status: GeofenceStatus;
  category: GeofenceCategory;
  priority: GeofencePriority;
  color: string; // Hex color e.g. "#3B82F6"
  active: boolean;

  // Event Rules
  dwellThresholdMinutes: number; // e.g. 30
  entryEnabled: boolean;
  exitEnabled: boolean;
  dwellEnabled: boolean;

  // Assignment & Schedule
  assignment: GeofenceAssignment;
  schedule: GeofenceSchedule;
  alertRules: GeofenceAlertRule[];

  // Temporary Geofence
  isTemporary?: boolean;
  startAt?: string; // ISO String
  endAt?: string;   // ISO String

  // Metadata
  createdBy: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  address?: string;
}

export interface GeofenceEvent {
  id: string;
  tenantId: string;
  geofenceId: string;
  geofenceName: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  tripNumber?: string;
  
  eventType: GeofenceEventType;
  timestamp: string; // ISO String
  latitude: number;
  longitude: number;
  locationAddress?: string;

  dwellDurationMinutes?: number;
  distanceFromBoundaryMeters?: number;
  severity: GeofencePriority;
  
  metadata?: Record<string, any>;
}

export interface VehicleGeofenceState {
  vehicleId: string;
  geofenceId: string;
  isInside: boolean;
  enteredAt?: string;
  lastSeenAt: string;
  dwellStartedAt?: string;
  dwellTriggeredAt?: string;
  lastLatitude: number;
  lastLongitude: number;
  lastAccuracyMeters?: number;
}

export interface GeofenceFilterState {
  searchQuery: string;
  type: 'ALL' | GeofenceType;
  category: 'ALL' | GeofenceCategory;
  status: 'ALL' | GeofenceStatus;
  priority: 'ALL' | GeofencePriority;
  hasActiveAlerts?: boolean;
}

export interface AIGeofenceAnalysisResult {
  geofenceId: string;
  averageDwellMinutes: number;
  maxDwellMinutes: number;
  minDwellMinutes: number;
  dwellCount: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  aiRecommendation?: string;
  predictedDwellMinutes?: number;
}

export interface UnregisteredStopRecommendation {
  id: string;
  suggestedName: string;
  suggestedCategory: GeofenceCategory;
  centroid: Location;
  frequentVehicleIds: string[];
  stopCount: number;
  averageStopMinutes: number;
  confidenceScore: number; // 0 - 100
}
