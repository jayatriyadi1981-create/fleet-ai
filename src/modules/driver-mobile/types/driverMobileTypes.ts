/**
 * Fleet Intelligence Smart AI - Driver Mobile Experience Types
 * PROMPT 46: Driver Mobile Architecture, Offline Sync, POD, Panic & Telematics
 */

import { Vehicle, Driver, Location, TelemetryData } from '../../../types';
import { Delivery, POD } from '../../delivery/deliveryTypes';
import { InspectionCategoryType, ItemConditionResult } from '../../inspection/types/inspection';

export type DriverMobileTab = 'HOME' | 'TRIP' | 'DELIVERY' | 'VEHICLE' | 'SAFETY' | 'PROFILE';

export type DevicePlatform = 'android' | 'ios' | 'web';

export interface DriverSessionState {
  driverId: string;
  driverName: string;
  employeeId: string;
  phone: string;
  simNumber: string;
  simType: string;
  tenantId: string;
  tenantName: string;
  branchName: string;
  role: 'driver';
  assignedVehicleId?: string;
  assignedVehicle?: Vehicle;
  isOnline: boolean;
  lastSyncAt: string;
  shift: {
    start: string;
    end: string;
    drivingHoursToday: number;
    restHoursToday: number;
    nightDrivingHours: number;
    maxAllowedHours: number;
  };
  deviceInfo: {
    deviceId: string;
    platform: DevicePlatform;
    appVersion: string;
    osVersion: string;
    pushToken: string;
    batteryLevel: number;
    isCharging: boolean;
  };
}

export type DriverTripStatus =
  | 'NO_TRIP'
  | 'ASSIGNED'
  | 'PRE_TRIP_PENDING'
  | 'READY_TO_START'
  | 'IN_PROGRESS'
  | 'ARRIVED_DESTINATION'
  | 'COMPLETED';

export interface DriverWaypoint {
  id: string;
  sequence: number;
  name: string;
  address: string;
  location: Location;
  type: 'PICKUP' | 'DELIVERY' | 'REST_STOP' | 'WAYPOINT' | 'DESTINATION';
  status: 'UPCOMING' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED';
  eta: string;
  deliveryId?: string;
  completedAt?: string;
}

export interface DriverActiveTrip {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  originCoords: Location;
  destinationCoords: Location;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  actualDistanceKm: number;
  startTime?: string;
  endTime?: string;
  status: DriverTripStatus;
  waypoints: DriverWaypoint[];
  currentWaypointIndex: number;
  speedLimit: number;
  isHighContrastMode: boolean;
}

export interface InspectionCheckItem {
  id: string;
  category: InspectionCategoryType;
  label: string;
  description: string;
  status: ItemConditionResult;
  notes?: string;
  photoUrl?: string;
  photoMetadata?: {
    timestamp: string;
    latitude: number;
    longitude: number;
    driverId: string;
    vehicleId: string;
  };
}

export interface PreTripInspectionRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  odometerKm: number;
  items: InspectionCheckItem[];
  photos: {
    type: 'FRONT' | 'REAR' | 'LEFT' | 'RIGHT' | 'TIRE' | 'DASHBOARD' | 'SAFETY_EQUIPMENT';
    url: string;
    timestamp: string;
    coordinates?: Location;
  }[];
  overallStatus: 'PASS' | 'FAIL';
  issueReported: boolean;
  issuesNotes?: string;
  completedAt: string;
  synced: boolean;
}

export interface IncidentReportPayload {
  id: string;
  driverId: string;
  vehicleId: string;
  type: 'ACCIDENT' | 'INCIDENT' | 'NEAR_MISS' | 'VEHICLE_DAMAGE' | 'ROAD_HAZARD' | 'CUSTOMER_INCIDENT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: string;
  time: string;
  location: string;
  coordinates: Location;
  description: string;
  peopleInvolved: string;
  photos: string[];
  submittedAt: string;
  aiAnalysis?: {
    category: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    safetyRecommendation: string;
    preventativeActions: string[];
  };
}

export interface PanicEventPayload {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  tenantId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  locationName: string;
  speed: number;
  heading: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  escalationTier: 'DISPATCHER' | 'FLEET_MANAGER' | 'SAFETY_MANAGER' | 'COMPANY_ADMIN';
  notificationsDispatched: {
    channel: 'PUSH' | 'WHATSAPP' | 'SMS' | 'EMAIL';
    status: string;
    sentAt: string;
  }[];
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolutionNotes?: string;
}

export type OfflineQueueActionType =
  | 'START_TRIP'
  | 'END_TRIP'
  | 'UPDATE_WAYPOINT'
  | 'SUBMIT_INSPECTION'
  | 'UPDATE_DELIVERY_STATUS'
  | 'SUBMIT_POD'
  | 'REPORT_INCIDENT'
  | 'TRIGGER_PANIC';

export interface OfflineQueueItem {
  id: string;
  actionType: OfflineQueueActionType;
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
  errorMessage?: string;
}

export interface PhotoUploadQueueItem {
  id: string;
  fileUrl: string;
  purpose: 'POD' | 'INSPECTION' | 'INCIDENT' | 'DAMAGE';
  metadata: {
    driverId: string;
    vehicleId: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    entityId: string;
  };
  status: 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'FAILED';
  progress: number;
}

export interface DriverActivityLogItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  iconType: 'LOGIN' | 'VEHICLE' | 'INSPECTION' | 'TRIP' | 'DELIVERY' | 'INCIDENT' | 'PANIC' | 'SYNC';
  badge?: string;
}
