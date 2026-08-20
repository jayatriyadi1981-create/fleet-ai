/**
 * Fleet Intelligence Smart AI - Rent Car Management System Domain Types
 * Comprehensive architecture for Vehicle Rental Operations, Handover Inspection, 
 * Customer KYC, Remote Telematics Security, and Deposit Settlement.
 */

export type RentalVehicleCategory = 
  | 'mpv' 
  | 'suv' 
  | 'sedan' 
  | 'luxury' 
  | 'city_car' 
  | 'minibus' 
  | 'ev' 
  | 'commercial_pickup';

export type RentalVehicleStatus = 
  | 'available' 
  | 'rented' 
  | 'reserved' 
  | 'maintenance' 
  | 'cleaning' 
  | 'overdue';

export type RentalPackageType = 
  | 'self_drive' // Lepas Kunci
  | 'with_driver' // Dengan Pengemudi
  | 'all_in'; // Driver + BBM + Tol / Parkir

export type AllowedOperationalZone = 
  | 'jabodetabek_only' 
  | 'java_island' 
  | 'java_bali' 
  | 'bali_perimeter' 
  | 'national_indonesia';

export interface RentalPricingTier {
  dailyRate: number; // IDR per 24 hours
  weeklyRate: number; // IDR per 7 days
  monthlyRate: number; // IDR per 30 days
  withDriverDailyRate: number; // IDR per 12-14 hours with driver
  allInDailyRate: number; // IDR per day (driver + fuel + toll)
  depositAmount: number; // IDR security deposit held
  overtimeHourlyRate: number; // IDR per hour late
  excessMileagePerKmRate: number; // IDR per km if limit exceeded
  dailyMileageLimitKm?: number; // 0 or undefined for unlimited
}

export interface RentalVehicle {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  plateNumber: string; // e.g., "B 1289 SSX"
  brand: string; // Toyota, Honda, Hyundai, Mitsubishi, Mercedes-Benz
  model: string; // Innova Zenix Hybrid, Alphard Executive Lounge, Ioniq 5, Fortuner, Avanza TSS
  year: number;
  category: RentalVehicleCategory;
  transmission: 'automatic' | 'manual' | 'e-cvt';
  seats: number;
  luggageCapacity: number; // bags
  color: string;
  fuelType: 'pertamax' | 'pertalite' | 'diesel' | 'biodiesel_b35' | 'electric';
  currentOdometerKm: number;
  fuelLevelPercent: number; // 0 - 100
  batteryLevelPercent?: number; // for EV
  status: RentalVehicleStatus;
  pricing: RentalPricingTier;
  allowedZone: AllowedOperationalZone;
  remoteImmobilizerStatus: 'unlocked' | 'locked';
  gpsDeviceId: string;
  currentBookingId?: string;
  currentDriverId?: string;
  assignedDriverName?: string;
  features: string[]; // e.g. ["Apple CarPlay", "Dashcam 24/7", "Sunroof", "Captain Seat", "Wireless Charger"]
  location: {
    lat: number;
    lng: number;
    address: string;
    speed: number;
    isInsideAllowedZone: boolean;
    lastUpdated: string;
  };
  stnkExpiry: string;
  insuranceExpiry: string;
  insuranceType: 'all_risk' | 'tlo' | 'comprehensive_cdw';
  imageUrl?: string;
  cleanlinessScore: number; // 1-10
  totalTripsCount: number;
}

export type CustomerType = 'individual' | 'corporate';
export type KYCVerificationStatus = 'verified' | 'pending' | 'rejected' | 'blacklisted';

export interface RentalCustomer {
  id: string;
  tenantId: string;
  type: CustomerType;
  name: string;
  nik: string; // KTP 16 digit
  passportNumber?: string;
  simNumber: string; // SIM A / International Driving Permit
  simExpiry: string;
  phone: string;
  email: string;
  companyName?: string;
  companyNpwp?: string;
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  kycStatus: KYCVerificationStatus;
  kycVerificationDate?: string;
  riskScore: number; // 0 - 100 (0-20 low risk, 21-60 medium, >60 high risk)
  fraudRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blacklistReason?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpentIdr: number;
  customerRating: number; // 1.0 - 5.0
  notes?: string;
  avatarUrl?: string;
  ktpPhotoUploaded: boolean;
  simPhotoUploaded: boolean;
  selfieWithKtpUploaded: boolean;
}

export type BookingStatus = 
  | 'draft' 
  | 'confirmed' 
  | 'active' // In-use / on the road
  | 'completed' 
  | 'cancelled' 
  | 'overdue';

export type DepositStatus = 
  | 'held' 
  | 'partially_deducted' 
  | 'fully_deducted' 
  | 'refunded' 
  | 'forfeited';

export type PaymentStatus = 
  | 'unpaid' 
  | 'dp_paid' 
  | 'fully_paid' 
  | 'settled';

export interface BookingFinancials {
  baseRatePerDay: number;
  durationDays: number;
  rentalSubtotal: number;
  driverFeePerDay: number;
  totalDriverFee: number;
  deliveryPickupFee: number; // Antar-jemput
  addonsTotal: number; // e.g. Child seat, E-Toll Card, Extra CDW Insurance
  discountAmount: number;
  subtotal: number;
  taxPpn11: number;
  grandTotal: number;
  securityDepositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  depositStatus: DepositStatus;
  depositRefundedAmount?: number;
  depositDeductionTotal?: number;
  depositDeductionReason?: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  pricePerDay: number;
  selected: boolean;
}

export interface DamagePin {
  id: string;
  xPercent: number; // 0 - 100% on car blueprint visual
  yPercent: number; // 0 - 100%
  view: 'top' | 'front' | 'rear' | 'left' | 'right';
  partName: string; // e.g. "Bumper Depan Kanan", "Pintu Pengemudi", "Kaca Spion Kiri"
  damageType: 'scratch' | 'dent' | 'paint_chip' | 'crack' | 'missing' | 'stain';
  severity: 'minor' | 'moderate' | 'severe';
  estimatedCost: number; // IDR estimate
  notes: string;
  photoUrl?: string;
}

export interface HandoverInspection {
  id: string;
  bookingId: string;
  vehicleId: string;
  type: 'check_out' | 'check_in';
  timestamp: string;
  inspectorId: string;
  inspectorName: string;
  odometerReadingKm: number;
  fuelLevelPercent: number;
  batteryLevelPercent?: number;
  exteriorCleanliness: 'clean' | 'moderate' | 'dirty';
  interiorCleanliness: 'clean' | 'moderate' | 'dirty';
  checklist: {
    stnkOriginal: boolean;
    spareTire: boolean;
    jackAndTools: boolean;
    firstAidKit: boolean;
    warningTriangle: boolean;
    keyChain: boolean;
    dashcamActive: boolean;
    acCold: boolean;
    headlightsWorking: boolean;
    taillightsWorking: boolean;
    infotainmentWorking: boolean;
    carMatsComplete: boolean;
  };
  damagePins: DamagePin[];
  inspectorNotes?: string;
  customerSignatureName: string;
  customerSignatureTimestamp: string;
  hasCustomerSigned: boolean;
  settlementSummary?: {
    overdueHours: number;
    overdueFee: number;
    fuelShortagePercent: number;
    fuelShortageFee: number;
    newDamageCost: number;
    cleaningFee: number;
    etleTrafficFines: number;
    totalDeductions: number;
    initialDeposit: number;
    finalRefundAmount: number;
    customerMustPayExtra: number;
  };
}

export interface RentalTelemetryAlert {
  id: string;
  bookingId: string;
  vehicleId: string;
  plateNumber: string;
  timestamp: string;
  type: 
    | 'GEOFENCE_VIOLATION' 
    | 'UNAUTHORIZED_CROSS_BORDER'
    | 'SPEEDING' 
    | 'HARSH_ACCEL_BRAKE' 
    | 'LATE_RETURN_PREDICTED' 
    | 'GPS_TAMPER_ALARM' 
    | 'IMMOBILIZER_ACTIVATED' 
    | 'SUSPICIOUS_NIGHT_PARK' 
    | 'BATTERY_VOLTAGE_LOW'
    | 'ODOMETER_TAMPER';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface RentalBooking {
  id: string;
  bookingNumber: string; // e.g. "RC-202608-0012"
  tenantId: string;
  branchId: string;
  branchName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerType: CustomerType;
  customerRiskScore: number;
  customerKycStatus: KYCVerificationStatus;
  vehicleId: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleCategory: RentalVehicleCategory;
  packageType: RentalPackageType;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  startDateTime: string; // ISO string
  endDateTime: string; // Scheduled return
  actualReturnDateTime?: string;
  durationDays: number;
  pickupLocationType: 'pool_hq' | 'airport' | 'hotel' | 'customer_address';
  pickupAddress: string;
  returnLocationType: 'pool_hq' | 'airport' | 'hotel' | 'customer_address';
  returnAddress: string;
  financials: BookingFinancials;
  addons: BookingAddon[];
  status: BookingStatus;
  checkOutInspection?: HandoverInspection;
  checkInInspection?: HandoverInspection;
  alerts: RentalTelemetryAlert[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalContract {
  id: string;
  contractNumber: string; // e.g. "RC-CTR-202608-008"
  tenantId: string;
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  packageType: RentalPackageType;
  baseAmount: number;
  depositAmount: number;
  mileageAllowanceKm: number; // 0 = unlimited
  excessMileageFeePerKm: number;
  fuelPolicy: 'same_to_same' | 'full_to_full' | 'prepaid';
  cancellationPolicy: string;
  termsAndConditions: string[];
  status: 'draft' | 'active' | 'expired' | 'cancelled' | 'closed';
  customerSignedAt?: string;
  customerSignatureUrl?: string;
  staffSignedAt?: string;
  staffSignatureUrl?: string;
  staffName?: string;
  createdAt: string;
}

export interface RentalDamageRecord {
  id: string;
  damageNumber: string; // e.g. "DMG-202608-003"
  tenantId: string;
  bookingId: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  customerId: string;
  customerName: string;
  inspectionType: 'pre_rental' | 'post_rental' | 'during_trip';
  partName: string;
  damageType: 'scratch' | 'dent' | 'paint_chip' | 'crack' | 'broken_part' | 'missing' | 'interior_stain';
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  photoUrls: string[];
  estimatedRepairCostIdr: number;
  responsibility: 'customer' | 'insurance' | 'company' | 'third_party';
  approvalStatus: 'reported' | 'under_review' | 'approved' | 'charged' | 'repaired' | 'closed';
  chargedToDeposit: boolean;
  insuranceClaimNumber?: string;
  repairWorkshop?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface RentalRateCard {
  id: string;
  tenantId: string;
  vehicleCategory: RentalVehicleCategory;
  categoryName: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  hourlyRate: number;
  overtimeHourlyRate: number;
  excessMileagePerKm: number;
  driverRatePerDay: number;
  allInRatePerDay: number;
  depositRequired: number;
  minDurationDays: number;
  seasonType: 'regular' | 'high_season' | 'peak_holiday' | 'corporate_partner';
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
}

export interface RentalInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface RentalInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-RC-2026-0042"
  tenantId: string;
  bookingId: string;
  bookingNumber: string;
  contractNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNpwp?: string;
  vehiclePlate: string;
  vehicleModel: string;
  issuedDate: string;
  dueDate: string;
  rentalPeriod: string;
  lineItems: RentalInvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  ppn11Amount: number;
  grandTotal: number;
  depositApplied: number;
  totalPaid: number;
  balanceDue: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'refunded' | 'cancelled';
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'qris' | 'corporate_term' | 'cash';
  notes?: string;
}

export interface VehicleProfitabilityData {
  vehicleId: string;
  plateNumber: string;
  model: string;
  category: RentalVehicleCategory;
  totalRentalDays: number;
  utilizationRate: number; // %
  grossRevenueIdr: number;
  fuelCostIdr: number;
  maintenanceCostIdr: number;
  driverCostIdr: number;
  insuranceCostIdr: number;
  depreciationCostIdr: number;
  netProfitIdr: number;
  profitMarginPercent: number;
  costPerDayIdr: number;
  revenuePerDayIdr: number;
  roiScore: number;
}

export interface RentalFleetKPIs {
  totalFleet: number;
  availableFleet: number;
  rentedFleet: number;
  reservedFleet: number;
  maintenanceFleet: number;
  cleaningFleet: number;
  overdueReturns: number;
  fleetUtilizationRate: number; // 0 - 100%
  totalActiveRevenueIdr: number;
  totalMonthlyRevenueIdr: number;
  revPavIdr: number; // Revenue per Available Vehicle
  securityDepositsHeldIdr: number;
  activeAlertsCount: number;
  criticalSecurityAlertsCount: number;
}

export interface RentalAiInsight {

  id: string;
  type: 'demand_forecast' | 'pricing_recommendation' | 'risk_warning' | 'profit_optimization' | 'maintenance_alert';
  title: string;
  summary: string;
  confidenceScore: number; // 0-100%
  impactMetric: string;
  actionRecommendation: string;
  status: 'active' | 'acknowledged' | 'dismissed';
}

export interface RentalCalendarEvent {
  id: string;
  bookingId: string;
  bookingNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  customerId: string;
  customerName: string;
  driverName?: string;
  startDate: string;
  endDate: string;
  type: 'booking' | 'active_rental' | 'maintenance' | 'inspection' | 'reserved';
  status: BookingStatus;
  color: string;
}



