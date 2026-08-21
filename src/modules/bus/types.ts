/**
 * Fleet Intelligence Smart AI - Bus Management System (PO Bus & Passenger Transportation)
 * Comprehensive TypeScript Type Definitions & Entity Schemas
 */

export type BusServiceType = 
  | 'AKAP' 
  | 'AKDP' 
  | 'PARIWISATA' 
  | 'BRT_CITY_BUS' 
  | 'SHUTTLE_TRAVEL'
  | 'SCHOOL_BUS'
  | 'CORPORATE_COMMUTER'
  | 'AIRPORT_SHUTTLE';

export type BusTypeCategory =
  | 'CITY_BUS'
  | 'INTERCITY_BUS'
  | 'TOUR_BUS'
  | 'SHUTTLE'
  | 'SCHOOL_BUS'
  | 'CORPORATE_BUS'
  | 'AIRPORT_BUS'
  | 'MINIBUS'
  | 'MIDIBUS'
  | 'DOUBLE_DECKER';

export type BusClass = 
  | 'SLEEPER_SUITES'
  | 'FIRST_CLASS_DOUBLE_DECKER'
  | 'SUPER_EXECUTIVE'
  | 'EXECUTIVE'
  | 'VIP'
  | 'BUSINESS_AC'
  | 'ECONOMY';

export type BusVehicleStatus = 
  | 'AVAILABLE'
  | 'SCHEDULED'
  | 'BOARDING'
  | 'ON_TRIP'
  | 'DELAYED'
  | 'ARRIVED'
  | 'MAINTENANCE'
  | 'INSPECTION'
  | 'UNAVAILABLE'
  | 'OFFLINE';

export type BusTripStatus = 
  | 'PLANNED'
  | 'ASSIGNED'
  | 'BOARDING'
  | 'DEPARTED'
  | 'IN_TRANSIT'
  | 'IN_REST_AREA'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'DELAYED'
  | 'CANCELLED'
  | 'BREAKDOWN'
  | 'EMERGENCY';

export type TicketStatus = 
  | 'PENDING'
  | 'BOOKED'
  | 'CONFIRMED'
  | 'PAID'
  | 'BOARDED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'COMPLETED';

export type BookingType = 'INDIVIDUAL' | 'GROUP' | 'CORPORATE' | 'CHARTER';

export type RampCheckStatus = 'PASSED_READY' | 'MINOR_WARNING' | 'FAILED_GROUNDED';

export interface BusVehicle {
  id: string;
  plateNumber: string; // e.g. "B 7102 SGA"
  busNumber: string; // e.g. "BUS-044"
  name: string; // e.g. "Avante H8 Grand Captain #02"
  busType: BusTypeCategory;
  busClass: BusClass;
  serviceType: BusServiceType;
  brand: string; // e.g. "Mercedes-Benz / Scania / Hino / Volvo"
  model: string; // e.g. "OH 1626 / K410IB / RM 280 / B11R"
  chassisType: string;
  bodyMaker: string; // e.g. "Adiputro Jetbus 5 / Tentrem Avante / Laksana Legacy SR3"
  manufacturingYear: number;
  
  seatCapacity: number;
  standingCapacity: number;
  totalPassengerCapacity: number;
  doorCount: number;
  
  // Amenities & Equipment
  hasAC: boolean;
  hasToilet: boolean;
  hasWiFi: boolean;
  hasUsbCharger: boolean;
  hasEntertainment: boolean;
  hasCCTV: boolean;
  hasGPS: boolean;
  hasEmergencyEquipment: boolean;
  hasWheelchairAccessibility: boolean;
  
  status: BusVehicleStatus;
  currentLocationName?: string;
  currentCoordinates?: { lat: number; lng: number };
  currentSpeedKmH?: number;
  currentDriverId?: string;
  currentDriverName?: string;
  currentTripId?: string;
  currentTripCode?: string;
  odometerKm: number;
  fuelLevelPct: number;
  
  // Maintenance & Inspection
  lastInspectionDate: string;
  nextInspectionDue: string;
  lastServiceDate: string;
  nextServiceKm: number;
  stnkExpiry: string;
  kirExpiry: string;
  kpsExpiry: string; // Izin Trayek KPS Kemenhub
}

export interface BusStopLocation {
  id: string;
  stopCode: string;
  name: string;
  type: 'TERMINAL' | 'POOL_DEPOT' | 'AGEN_RESMI' | 'REST_AREA_RM' | 'DROP_POINT' | 'SHELTER_BRT';
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geofenceRadiusMeters: number;
  operatingHours: string;
  boardingAllowed: boolean;
  dropOffAllowed: boolean;
  stopSequence: number;
  scheduledTime?: string; // HH:mm
  actualTime?: string;
  isRestAreaMeal?: boolean;
}

export interface BusRoute {
  id: string;
  routeCode: string; // e.g. "JKT-SBY-01"
  routeName: string; // e.g. "Jakarta (Pulo Gebang) - Surabaya (Bungurasih) via Tol Trans Jawa"
  originCity: string;
  destinationCity: string;
  originTerminal: string;
  destinationTerminal: string;
  distanceKm: number;
  estimatedDurationHours: number;
  serviceType: BusServiceType;
  busClass: BusClass;
  operatingDays: string[]; // e.g. ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
  baseFare: number;
  stops: BusStopLocation[];
  activeTripsCount: number;
  routeEfficiencyScorePct: number;
}

export interface BusSeat {
  seatNumber: string;
  deck: 'LOWER' | 'UPPER' | 'SINGLE';
  row: number;
  column: number; // 1, 2, 3, 4
  type: 'STANDARD' | 'SLEEPER' | 'RECLINING_MASSAGE' | 'LEG_REST' | 'WHEELCHAIR_ACCESSIBLE';
  position: 'WINDOW' | 'AISLE' | 'FRONT' | 'BACK' | 'MIDDLE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED_CREW' | 'RESERVED_AGENT' | 'BOARDED';
  ticketId?: string;
  passengerName?: string;
  passengerGender?: 'MALE' | 'FEMALE';
}

export interface BusTrip {
  id: string;
  tripCode: string; // e.g. "SJ-702-JKT-SBY"
  routeId: string;
  routeName: string;
  serviceType: BusServiceType;
  busClass: BusClass;
  busId: string;
  busPlateNumber: string;
  busName: string;
  chassisType: string;
  bodyMaker: string;
  
  departureTerminal: string;
  arrivalTerminal: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  estimatedArrivalTime: string; // YYYY-MM-DD HH:mm
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  
  status: BusTripStatus;
  currentLocationName?: string;
  currentCoordinates?: {
    lat: number;
    lng: number;
  };
  currentSpeedKmH?: number;
  delayMinutes: number;
  
  totalSeats: number;
  standingCapacity?: number;
  bookedSeats: number;
  boardedCount: number;
  ticketPrice: number;
  
  primaryDriverId?: string;
  primaryDriverName: string;
  primaryDriverPhone: string;
  secondaryDriverId?: string;
  secondaryDriverName: string;
  conductorId?: string;
  conductorName: string;
  hostessName?: string;
  
  // Financial & Operational
  ujsAmount: number; // Uang Jalan Supir (UJS)
  allocatedFuelLiters: number;
  actualFuelConsumedLiters?: number;
  tollCardBalance: number; // E-Toll Trans Jawa
  estimatedMealAllowance: number;
  
  stops: BusStopLocation[];
  seatMap: BusSeat[];
}

export interface BusTicket {
  id: string;
  ticketNumber: string; // e.g. "TKT-20260820-9921"
  bookingId?: string;
  tripId: string;
  tripCode: string;
  routeName: string;
  busClass: BusClass;
  busPlateNumber: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  
  passengerName: string;
  passengerPhone: string;
  passengerIdNumber: string; // NIK KTP
  passengerGender: 'MALE' | 'FEMALE';
  
  boardingPoint: string;
  dropPoint: string;
  
  baseFare: number;
  insuranceFee: number; // Asuransi Jasa Raharja
  serviceFee: number;
  discountAmount?: number;
  totalFare: number;
  paymentMethod: 'ONLINE_QRIS' | 'AGENT_CASH' | 'TRANSFER_VA' | 'OTA_TIKETING' | 'CARD';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: TicketStatus;
  
  qrCodeData: string;
  baggageWeightKg: number;
  baggageTagNumber?: string;
  mealCouponClaimed: boolean;
  bookedAt: string;
  bookedByAgentId?: string;
  bookedByAgentName?: string;
  
  boardedAt?: string;
  boardedLocation?: string;
  checkedByCrewName?: string;
}

export interface BusPassenger {
  id: string;
  name: string;
  phone: string;
  email: string;
  idCardNumber: string;
  gender: 'MALE' | 'FEMALE';
  emergencyContact: string;
  totalTripsCount: number;
  membershipTier: 'REGULAR' | 'SILVER' | 'GOLD' | 'VIP_EXECUTIVE';
  loyaltyPoints: number;
  recentTrips: { tripCode: string; date: string; route: string; seat: string }[];
  notes?: string;
}

export interface BusBooking {
  id: string;
  bookingCode: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  tripId: string;
  tripCode: string;
  routeName: string;
  busPlateNumber: string;
  seatNumbers: string[];
  seatCount: number;
  pickupStop: string;
  dropoffStop: string;
  bookingType: BookingType;
  totalFare: number;
  discountAmount: number;
  finalPaidAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: TicketStatus;
  bookedAt: string;
}

export interface BusCargoPackage {
  id: string;
  receiptNumber: string; // e.g. "CRG-SJ-88421"
  tripId: string;
  tripCode: string;
  busPlateNumber: string;
  
  senderName: string;
  senderPhone: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  
  originAgent: string;
  destinationAgent: string;
  
  itemDescription: string;
  packageType: 'DOCUMENTS' | 'GENERAL_CARGO' | 'SPAREPART' | 'PERISHABLE_FOOD' | 'MOTORCYCLE';
  weightKg: number;
  koliCount: number;
  cargoFee: number;
  paymentStatus: 'PAID' | 'COD_ON_PICKUP';
  status: 'RECEIVED_AT_AGENT' | 'LOADED_ON_BUS' | 'IN_TRANSIT' | 'ARRIVED_AT_DESTINATION' | 'DELIVERED_TO_RECEIVER';
  createdAt: string;
}

export interface BusAgentCounter {
  id: string;
  agentCode: string;
  name: string;
  locationName: string; // e.g. "Loket Terminal Pulo Gebang Lt 2 No 18"
  city: string;
  contactPerson: string;
  phone: string;
  dailyTicketSalesCount: number;
  dailyTurnoverAmount: number;
  commissionPercentage: number;
  cashDepositStatus: 'SETTLED' | 'PENDING_DEPOSIT' | 'DISPUTED';
  depositBalance: number;
}

export interface BusCrew {
  id: string;
  crewNumber: string;
  name: string;
  role: 'PRIMARY_DRIVER' | 'SECONDARY_DRIVER' | 'CONDUCTOR' | 'BUS_ATTENDANT' | 'TOUR_GUIDE';
  phone: string;
  simType: 'SIM_B2_UMUM' | 'SIM_B1_UMUM' | 'SIM_A';
  simExpiryDate: string;
  status: 'ACTIVE_DRIVING' | 'RESTING' | 'OFF_DUTY' | 'MEDICAL_LEAVE';
  totalContinuousDrivingHours: number; // Max 4 hours continuous rule
  dailyDrivingHours: number; // Max 8 hours daily rule
  restHoursRemaining: number;
  totalWeeklyTrips: number;
  safetyScore: number; // 0-100
  fatigueScore: number; // 0-100 (Safe < 30, Warning 30-70, Critical > 70)
  currentAssignedTrip?: string;
  currentAssignedBusPlate?: string;
}

export interface BusRampCheck {
  id: string;
  checkDate: string;
  busPlateNumber: string;
  inspectorName: string;
  poolLocation: string;
  
  // Inspection Items (PASS / FAIL)
  brakeSystemPass: boolean;
  tireConditionPass: boolean;
  wiperLightingPass: boolean;
  emergencyHammerCount: number;
  fireExtinguisherAparPass: boolean;
  emergencyExitPass: boolean;
  seatBeltDriverPass: boolean;
  speedometerGpsPass: boolean;
  kirKpsValidityPass: boolean;
  acSystemPass: boolean;
  cctvPass: boolean;
  
  overallStatus: RampCheckStatus;
  notes: string;
  inspectorSignature: string;
  driverSignature: string;
  nextInspectionDue: string;
}

export interface BusTerminal {
  id: string;
  name: string;
  terminalType: 'TIPE_A' | 'TIPE_B' | 'TIPE_C';
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  capacityBuses: number;
  operatingHours: string;
  platforms: { platformNumber: string; routeDestinations: string[]; currentBusPlate?: string; departureTime?: string }[];
  facilities: string[];
  activeRoutesCount: number;
}

export interface BusDepot {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  totalParkingCapacity: number;
  maintenanceBaysCount: number;
  hasFuelFacility: boolean;
  fuelStockLiters: number;
  managerName: string;
  contactPhone: string;
  busesParkedCount: number;
  busesMaintenanceCount: number;
}

export interface BusPassengerComplaint {
  id: string;
  complaintNumber: string;
  category: 'DRIVER' | 'BUS' | 'DELAY' | 'CLEANLINESS' | 'TICKET' | 'BOOKING' | 'SERVICE' | 'SAFETY' | 'OTHER';
  passengerName: string;
  passengerPhone: string;
  tripCode: string;
  busPlateNumber: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface BusEmergencyAlert {
  id: string;
  alertCode: string;
  timestamp: string;
  busId: string;
  busPlateNumber: string;
  tripId: string;
  tripCode: string;
  driverName: string;
  driverPhone: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  currentSpeedKmH: number;
  passengerCount: number;
  panicType: 'CRASH_IMPACT' | 'MANUAL_PANIC_BUTTON' | 'SMOKE_FIRE' | 'HIJACK_THREAT' | 'MEDICAL_EMERGENCY';
  status: 'TRIGGERED' | 'DISPATCH_ACKNOWLEDGED' | 'POLICE_AMBULANCE_DISPATCHED' | 'RESOLVED';
  actionLogs: string[];
}

export interface BusCharterBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  organizationName?: string;
  busType: string;
  busCount: number;
  pickupLocation: string;
  destinationTour: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  downPaymentAmount: number;
  remainingAmount: number;
  status: 'PROPOSAL' | 'CONFIRMED_DP_PAID' | 'FULLY_PAID' | 'ON_TOUR' | 'COMPLETED' | 'CANCELLED';
  assignedBuses: string[];
}

export interface BusFleetKPIs {
  totalActiveBuses: number;
  busesEnRoute: number;
  busesInPool: number;
  busesInMaintenance: number;
  
  dailyDepartures: number;
  dailyPassengersCarried: number;
  averageOccupancyRatePct: number;
  onTimePerformancePct: number;
  
  totalDailyTicketRevenue: number;
  totalDailyCargoRevenue: number;
  totalDailyCharterRevenue: number;
  totalMonthlyRevenue: number;
  
  dailyFuelCost: number;
  dailyMaintenanceCost: number;
  dailyTollCost: number;
  dailyDriverUjsCost: number;
  
  costPerKm: number;
  revenuePerKm: number;
  averageFuelConsumptionKmPerLiter: number;
  safetyComplianceRatePct: number;
  driverRiskScoreAvg: number;
  busRiskScoreAvg: number;
}

export type BusTabId =
  | 'control-tower'
  | 'bus-fleet'
  | 'seat-layout'
  | 'trips-schedule'
  | 'dispatch'
  | 'ticketing-seat'
  | 'boarding'
  | 'passenger-manifest'
  | 'passengers'
  | 'complaints'
  | 'routes-terminals'
  | 'terminals-depots'
  | 'cargo-express'
  | 'agents-counter'
  | 'crew-roster'
  | 'ramp-check'
  | 'ujs-toll-fuel'
  | 'safety-emergency'
  | 'live-tracking'
  | 'public-tracking'
  | 'charter-tour'
  | 'revenue-profitability'
  | 'occupancy-analytics'
  | 'ai-dispatcher'
  | 'reports'
  | 'mobile-driver';
