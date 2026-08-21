/**
 * Fleet Intelligence Smart AI - Domain Types
 * Enterprise Telematics & Fleet Management System Architecture
 */

import { UserRole } from './rbac';
export * from './rbac';
export * from './organization';
export * from './subscription';
export * from './superAdmin';
export * from './vehicle';
export * from './gps';
export * from './driver';
export * from './dailyBriefing';
export * from '../modules/rent-car/types';
export * from '../modules/logistics/types';

export type VehicleStatus = 'moving' | 'idle' | 'parking' | 'offline' | 'emergency' | 'maintenance' | 'under_maintenance' | 'archived';

export type VehicleType = 'truck_box' | 'truck_container' | 'truck_dump' | 'truck_tanker' | 'van' | 'bus' | 'pickup' | 'car' | 'heavy_equipment';

export type FuelType = 'diesel' | 'biodiesel_b35' | 'pertalite' | 'pertamax' | 'electric';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertCategory = 'speed' | 'geofence' | 'battery' | 'fuel_drop' | 'harsh_brake' | 'fatigue' | 'maintenance' | 'sos' | 'idle_excess';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  speed?: number; // km/h
  heading?: number; // degrees 0-360
  altitude?: number; // meters
}

export interface TelemetryData {
  deviceId: string;
  imei: string;
  timestamp: string;
  location: Location;
  ignition: boolean;
  engineRpm: number;
  fuelLevelPercent: number; // 0 - 100
  fuelLevelLiters: number;
  engineTempCelsius: number;
  batteryVoltage: number;
  odometerKm: number;
  engineHours: number;
  doorOpen: boolean;
  acOn: boolean;
  gpsSignal: number; // 0 - 100%
  gsmSignal: number; // 0 - 100%
  driverId?: string;
}

export interface GPSDevice {
  id: string;
  imei: string;
  model: string; // e.g. Concox AT4, Teltonika FMB920, Queclink GV300
  protocol: 'JT808' | 'TELTONIKA' | 'CONCOX' | 'MEITRACK' | 'MQTT' | 'HTTP_REST';
  simNumber: string;
  provider: string; // Telkomsel IoT, Indosat, XL Axiata
  status: 'active' | 'inactive' | 'expired';
  installedAt: string;
  lastHeartbeat: string;
}

export interface Vehicle {
  id: string;
  tenantId: string;
  branchId: string;
  plateNumber: string; // e.g. B 9821 UTX
  vin: string;
  brand: string; // e.g. Isuzu, Hino, Mitsubishi Fuso, Scania
  model: string; // e.g. Giga FVR, Ranger 500, Canter FE 74
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  fuelCapacityLiters: number;
  status: VehicleStatus;
  speed?: number;
  currentDriverId?: string;
  gpsDeviceId: string;
  odometerKm: number;
  engineHours: number;
  groupName: string; // e.g. Armada Jabodetabek, Armada Trans-Jawa, Tangki BBM
  latestTelemetry?: TelemetryData;
  maintenanceOverdue: boolean;
  insuranceExpiry: string;
  stnkExpiry: string;
  kirExpiry: string; // Uji KIR Dishub Indonesia
}

export interface DriverBehaviorScore {
  overallScore: number; // 0 - 100
  safetyScore: number;
  ecoScore: number;
  speedingCount: number;
  harshBrakingCount: number;
  harshAccelerationCount: number;
  sharpTurnCount: number;
  idleExcessMinutes: number;
  fatigueAlertsCount: number;
  totalDistanceKm: number;
  totalDriveTimeMinutes: number;
}

export interface Driver {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  phone: string;
  simNumber: string; // SIM BII Umum / SIM B1
  simType: 'SIM A' | 'SIM B1' | 'SIM B1 Umum' | 'SIM B2' | 'SIM B2 Umum';
  simExpiry: string;
  nik: string;
  status: 'active' | 'on_trip' | 'off_duty' | 'suspended';
  assignedVehicleId?: string;
  photoUrl?: string;
  score: DriverBehaviorScore;
  totalTripsCompleted: number;
}

export interface TripStop {
  id: string;
  name: string;
  location: Location;
  arrivalTime?: string;
  departureTime?: string;
  status: 'pending' | 'arrived' | 'departed' | 'skipped';
  cargoStatus?: string;
}

export interface Trip {
  id: string;
  tenantId: string;
  branchId: string;
  tripNumber: string; // e.g. TRP-20260813-001
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  originCoords: Location;
  destinationCoords: Location;
  plannedDistanceKm: number;
  actualDistanceKm?: number;
  plannedDurationHours: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
  startTime?: string;
  endTime?: string;
  estimatedArrival: string;
  cargoDescription: string;
  cargoWeightKg: number;
  stops: TripStop[];
  routePolyline?: Location[];
  fuelConsumedLiters?: number;
}

export interface Geofence {
  id: string;
  tenantId: string;
  name: string;
  category: 'depot' | 'warehouse' | 'customer_site' | 'restricted_zone' | 'port' | 'toll_plaza';
  type: 'polygon' | 'circle';
  coordinates: Location[];
  radiusMeters?: number; // for circle
  address: string;
  assignedVehicleGroups: string[];
  alertOnEnter: boolean;
  alertOnExit: boolean;
  alertOnOverstay: boolean;
  maxStayMinutes?: number;
  color: string;
}

export interface PointOfInterest {
  id: string;
  tenantId: string;
  name: string;
  type: 'rest_area' | 'gas_station_spbu' | 'workshop' | 'weigh_station' | 'police_post';
  location: Location;
  notes?: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  timestamp: string;
  liters: number;
  costIdr: number;
  pricePerLiterIdr: number;
  spbuLocation: string;
  odometerKm: number;
  receiptNumber?: string;
  isAnomaly: boolean; // detected by AI
  anomalyReason?: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  tenantId: string;
  workOrderNumber: string; // e.g. WO-2026-0891
  vehicleId: string;
  title: string;
  type: 'routine_service' | 'engine_repair' | 'tire_replacement' | 'brake_service' | 'electrical' | 'kir_inspection';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  estimatedCostIdr: number;
  actualCostIdr?: number;
  workshopName: string;
  technicianNotes?: string;
  triggerOdometerKm?: number;
}

export interface SafetyIncident {
  id: string;
  tenantId: string;
  incidentNumber: string;
  vehicleId: string;
  driverId: string;
  timestamp: string;
  location: Location;
  type: 'overspeed' | 'harsh_braking' | 'harsh_acceleration' | 'collision_warning' | 'fatigue_detected' | 'sos_button' | 'geofence_violation';
  severity: AlertSeverity;
  speedKmH: number;
  speedLimitKmH: number;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  notes?: string;
}

export interface AlertNotification {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  location: Location;
  read: boolean;
  actionRequired: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'fleet' | 'fuel' | 'driver' | 'maintenance' | 'safety' | 'cost';
  severity: 'critical' | 'high' | 'medium' | 'low';
  summary: string;
  explanation: string;
  recommendation: string;
  impactScore: number; // 0 - 100
  potentialSavingsIdr?: number;
  timestamp: string;
  dataPoints: {
    label: string;
    value: string | number;
  }[];
  actionable: boolean;
  actionPayload?: {
    type: string;
    targetId: string;
  };
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  insights?: AIInsight[];
  suggestedActions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}

export interface TenantCompany {
  id: string;
  name: string; // e.g. PT Trans Logistik Nusantara
  code: string; // e.g. TLN
  taxIdNpwp: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  branchesCount: number;
  vehiclesCount: number;
  subscriptionPlan: 'Starter' | 'Business' | 'Professional' | 'Enterprise';
  status: 'active' | 'suspended' | 'trial';
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string; // e.g. Cabang Surabaya
  code: string;
  city: string;
  vehiclesCount: number;
  managerName: string;
}

export interface UserProfile {
  id: string;
  tenantId: string;
  branchId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone: string;
  department: string;
  permissions: string[];
}

export type { RecommendationPriority } from './executiveReport';
export * from './executiveReport';

