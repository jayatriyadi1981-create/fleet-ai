/**
 * Fleet Intelligence Smart AI - Delivery Management Domain Types
 * Order, Customer, Delivery, POD, Digital Signature, Failure, Reschedule & AI Analytics
 */

import { Location } from '../../types';

export type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type OrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'READY'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'CLOSED';

export interface OrderItem {
  id: string;
  orderId: string;
  sku: string;
  productName: string;
  description?: string;
  quantity: number;
  unit: string; // e.g. 'carton', 'kg', 'pallet', 'unit'
  weightKg: number;
  volumeCbm: number;
  fragile: boolean;
  temperatureControlled: boolean;
  notes?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string; // e.g. 'ORD-2026-000001'
  externalOrderNumber?: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  requestedDeliveryDate: string;
  priority: OrderPriority;
  status: OrderStatus;
  originAddress: string;
  destinationAddress: string;
  originCoordinates?: Location;
  destinationCoordinates?: Location;
  totalItems: number;
  totalWeightKg: number;
  totalVolumeCbm: number;
  notes?: string;
  items: OrderItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerType =
  | 'CORPORATE'
  | 'RETAIL'
  | 'DISTRIBUTOR'
  | 'WAREHOUSE'
  | 'STORE'
  | 'INDIVIDUAL'
  | 'OTHER';

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string; // e.g. 'Headquarters', 'Warehouse Cikarang'
  address: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
  deliveryInstructions?: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  customerCode: string; // e.g. 'CUST-001'
  customerType: CustomerType;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  addresses: CustomerAddress[];
  contacts: CustomerContact[];
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export type DeliveryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'ARRIVING'
  | 'ARRIVED'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'PARTIALLY_DELIVERED'
  | 'FAILED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'RETURNED';

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  orderItemId: string;
  productName: string;
  quantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  reason?: string;
}

export interface Delivery {
  id: string;
  tenantId: string;
  deliveryNumber: string; // e.g. 'DEL-2026-000001'
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  tripId?: string;
  tripNumber?: string;
  routeId?: string;
  routeVersionId?: string;
  scheduledDate: string;
  scheduledTimeStart: string; // '09:00'
  scheduledTimeEnd: string;   // '11:00'
  actualArrivalAt?: string;
  actualServiceStartAt?: string;
  actualServiceEndAt?: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  deliveryAddress: string;
  latitude: number;
  longitude: number;
  recipientName?: string;
  recipientPhone?: string;
  deliveryInstructions?: string;
  sequence: number;
  notes?: string;
  items: DeliveryItem[];
  podId?: string;
  failureReason?: string;
  trackingToken?: string;
  arrivalDetectionSource?: 'GPS' | 'GEOFENCE' | 'MANUAL' | 'DRIVER_APP' | 'DISPATCHER';
  arrivalDetectedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PODStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'REJECTED';

export type PODPhotoType =
  | 'PACKAGE'
  | 'DELIVERY_LOCATION'
  | 'DOCUMENT'
  | 'DAMAGE'
  | 'SIGNATURE'
  | 'OTHER';

export interface PODPhoto {
  id: string;
  deliveryId: string;
  fileUrl: string;
  thumbnailUrl?: string;
  type: PODPhotoType;
  capturedAt: string;
  latitude?: number;
  longitude?: number;
  uploadedBy: string;
}

export interface POD {
  id: string;
  deliveryId: string;
  status: PODStatus;
  recipientName: string;
  recipientPhone: string;
  recipientRole?: string; // e.g. 'Warehouse Supervisor'
  deliveredAt: string;
  signatureDataUrl?: string;
  signatureHash?: string;
  signedBy?: string;
  signedAt?: string;
  photos: PODPhoto[];
  notes?: string;
  latitude?: number;
  longitude?: number;
  syncStatus: 'SYNCED' | 'SYNCING' | 'PENDING_SYNC' | 'SYNC_FAILED';
  idempotencyKey?: string;
  createdAt: string;
}

export interface PODPolicy {
  requireSignature: boolean;
  requirePhoto: boolean;
  requireRecipient: boolean;
  requireRecipientPhone: boolean;
  requireDeliveryNote: boolean;
  requireLocation: boolean;
}

export type DeliveryFailureReason =
  | 'CUSTOMER_NOT_AVAILABLE'
  | 'WRONG_ADDRESS'
  | 'CUSTOMER_REFUSED'
  | 'DAMAGED_GOODS'
  | 'VEHICLE_PROBLEM'
  | 'ROAD_ACCESS'
  | 'SECURITY_RESTRICTION'
  | 'WEATHER'
  | 'TIME_WINDOW_MISSED'
  | 'OTHER';

export interface DeliveryReschedule {
  id: string;
  deliveryId: string;
  oldDate: string;
  oldTimeWindow: string;
  newDate: string;
  newTimeWindow: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
}

export interface DeliveryEvent {
  id: string;
  deliveryId: string;
  eventType:
    | 'created'
    | 'confirmed'
    | 'assigned'
    | 'ready'
    | 'dispatched'
    | 'out_for_delivery'
    | 'arriving'
    | 'arrived'
    | 'delivery_started'
    | 'delivered'
    | 'failed'
    | 'rescheduled'
    | 'cancelled'
    | 'returned'
    | 'pod_completed';
  timestamp: string;
  performedBy: string;
  details: string;
  location?: Location;
}

export interface DeliveryFilterState {
  searchQuery: string;
  status: DeliveryStatus | 'ALL';
  priority: DeliveryPriority | 'ALL';
  date: string; // 'YYYY-MM-DD' or 'ALL'
  customerId: string;
  driverId: string;
  vehicleId: string;
}

export interface DeliveryKPIs {
  totalOrders: number;
  totalDeliveries: number;
  deliveredCount: number;
  inTransitCount: number;
  pendingCount: number;
  failedCount: number;
  onTimePercentage: number;
  successRatePercentage: number;
  averageDeliveryTimeMinutes: number;
  podCompletionPercentage: number;
}

export interface AILateDeliveryPrediction {
  deliveryId: string;
  deliveryNumber: string;
  customerName: string;
  currentEta: string;
  scheduledTimeWindow: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lateProbability: number; // 0 to 100
  reasoning: string;
  suggestedAction: string;
}

export interface AIFailedDeliveryPrediction {
  deliveryId: string;
  deliveryNumber: string;
  customerName: string;
  riskFactor: string;
  failureProbability: number; // 0 to 100
  aiMitigationStrategy: string;
}

export interface AIDeliverySequenceRecommendation {
  tripId: string;
  currentSequence: string[];
  recommendedSequence: string[];
  estimatedTimeSavingsMinutes: number;
  estimatedDistanceSavingsKm: number;
  rationale: string;
}

export interface AIDeliveryAnomaly {
  id: string;
  type: 'UNUSUAL_DWELL' | 'PATTERN_DEVIATION' | 'UNSCHEDULED_STOP' | 'MISSING_POD_PHOTO';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  description: string;
  affectedDeliveryNumber: string;
  detectedAt: string;
}

export interface AIDeliverySummary {
  date: string;
  totalPlanned: number;
  totalCompleted: number;
  atRiskCount: number;
  missedWindowCount: number;
  topFailureReason: string;
  executiveInsight: string;
}

export interface DeliveryTrackingToken {
  id: string;
  deliveryId: string;
  token: string;
  expiresAt: string;
  revokedAt?: string;
  createdAt: string;
}
