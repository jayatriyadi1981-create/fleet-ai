/**
 * Fleet Intelligence Smart AI - Logistics Management System Types
 * Enterprise Freight Forwarding, 3PL/4PL, Courier & Last-Mile TMS
 */

import { Location } from '../../types';

export type ShipmentServiceType = 'SAMEDAY' | 'INSTANT' | 'NEXTDAY' | 'REGULAR' | 'CARGO_FTL' | 'CARGO_LTL' | 'COLD_CHAIN';

export type ShipmentStatus = 
  | 'ORDER_CREATED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'INBOUND_HUB'
  | 'SORTED'
  | 'LINEHAUL_TRANSIT'
  | 'OUTBOUND_DEST_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'RETURNED_TO_HUB'
  | 'RETURN_TO_SHIPPER'
  | 'CANCELLED';

export type PaymentMethod = 'PREPAID' | 'COD' | 'POSTPAID_B2B' | 'CREDIT_TERMS';

export interface PackageItem {
  id: string;
  sku: string;
  name: string;
  qty: number;
  weightKg: number;
  dimensions: { lengthCm: number; widthCm: number; heightCm: number };
  volumeCbm: number;
  isFragile: boolean;
  isDangerousGoods: boolean;
  temperatureRequired?: string;
  declaredValue: number;
}

export interface LogisticsOrder {
  id: string;
  orderNumber: string; // e.g. ORD-LOG-2026-8891
  connoteNumber: string; // e.g. JKT-BDG-9928172
  shipperId: string;
  shipperName: string;
  shipperPhone: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCoordinates: Location;
  
  consigneeName: string;
  consigneePhone: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneePostalCode: string;
  consigneeCoordinates: Location;

  serviceType: ShipmentServiceType;
  status: ShipmentStatus;
  paymentMethod: PaymentMethod;
  codAmount: number;
  shippingFee: number;
  insuranceFee: number;
  totalAmount: number;

  totalWeightKg: number;
  totalVolumeCbm: number;
  chargeableWeightKg: number;
  items: PackageItem[];

  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentHubId?: string;
  currentHubName?: string;
  originHubId: string;
  originHubName: string;
  destinationHubId: string;
  destinationHubName: string;

  manifestId?: string;
  pickupScheduledAt: string;
  pickedUpAt?: string;
  estimatedDeliveryAt: string;
  deliveredAt?: string;
  
  slaHours: number;
  slaDeadline: string;
  isSlaBreached: boolean;

  epod?: {
    receivedBy: string;
    relationship: string;
    signatureUrl: string;
    photoUrl: string;
    timestamp: string;
    coordinates: Location;
    notes?: string;
  };

  exceptionHistory?: {
    id: string;
    timestamp: string;
    reason: string;
    actionTaken: string;
    reporterName: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface LogisticsManifest {
  id: string;
  manifestNumber: string; // e.g. MNF-2026-JKT-SBY-001
  originHubId: string;
  originHubName: string;
  destinationHubId: string;
  destinationHubName: string;
  status: 'DRAFT' | 'READY_TO_DEPART' | 'IN_TRANSIT' | 'ARRIVED_DESTINATION' | 'UNLOADED_VERIFIED';
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  sealNumber: string;
  totalShipments: number;
  totalWeightKg: number;
  totalCbm: number;
  capacityUtilizationPct: number;
  departureTime?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  shipmentIds: string[];
  notes?: string;
}

export interface LogisticsHub {
  id: string;
  code: string; // e.g. HUB-JKT-01
  name: string;
  type: 'MAIN_SORTING_CENTER' | 'REGIONAL_HUB' | 'BRANCH_OFFICE' | 'TRANSIT_POINT';
  city: string;
  address: string;
  coordinates: Location;
  managerName: string;
  contactPhone: string;
  dailyCapacityCbm: number;
  currentStoredCbm: number;
  activeVehiclesCount: number;
  activeParcelsCount: number;
  operationalStatus: 'OPERATIONAL' | 'HIGH_LOAD' | 'CONGESTED' | 'MAINTENANCE';
}

export interface PickupTask {
  id: string;
  pickupCode: string; // e.g. PKP-2026-9021
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  scheduledTime: string;
  assignedDriverId: string;
  assignedDriverName: string;
  vehiclePlate: string;
  estimatedPackages: number;
  estimatedWeightKg: number;
  status: 'PENDING' | 'ASSIGNED' | 'EN_ROUTE_PICKUP' | 'ARRIVED_AT_SHIPPER' | 'PICKED_UP' | 'TRANSFERRED_TO_HUB' | 'CANCELLED';
  notes?: string;
}

export interface CodSettlement {
  id: string;
  driverId: string;
  driverName: string;
  date: string;
  totalDeliveredCodCount: number;
  totalCodAmountExpected: number;
  totalCashDeposited: number;
  variance: number;
  status: 'PENDING_DEPOSIT' | 'DEPOSITED_UNVERIFIED' | 'SETTLED_VERIFIED' | 'DISPUTED';
  cashierName?: string;
  verifiedAt?: string;
  receiptNumber?: string;
}

export interface LogisticsExceptionTicket {
  id: string;
  ticketNumber: string;
  connoteNumber: string;
  customerName: string;
  driverName: string;
  exceptionType: 'RECIPIENT_ABSENT' | 'WRONG_ADDRESS' | 'PACKAGE_DAMAGED' | 'REFUSED_PAY_COD' | 'VEHICLE_BREAKDOWN' | 'BAD_WEATHER' | 'FORCE_MAJEURE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_INVESTIGATION' | 'RESCHEDULED' | 'RETURN_APPROVED' | 'RESOLVED_CLOSED';
  description: string;
  reportedAt: string;
  resolvedAt?: string;
  actionTaken?: string;
}

export interface LogisticsSummaryKpis {
  totalShipmentsToday: number;
  inTransitCount: number;
  deliveredTodayCount: number;
  failedExceptionCount: number;
  onTimeDeliveryRate: number; // %
  totalWeightTonsToday: number;
  totalCodCollected: number;
  activeHubsCount: number;
  fleetUtilizationRate: number; // %
  averageCostPerTonKm: number;
}

export type LogisticsTabId = 
  | 'control-tower'
  | 'orders'
  | 'shipments'
  | 'pickups'
  | 'deliveries'
  | 'manifests'
  | 'packages'
  | 'routes'
  | 'live-tracking'
  | 'hubs'
  | 'sortation'
  | 'returns'
  | 'exceptions'
  | 'cod'
  | 'customers'
  | 'sla'
  | 'analytics'
  | 'ai-dispatcher'
  | 'reports';

