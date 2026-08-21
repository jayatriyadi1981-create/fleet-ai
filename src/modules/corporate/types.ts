export type CorporateVehicleCategory =
  | 'EXECUTIVE_VIP'
  | 'MANAGEMENT_DEDICATED'
  | 'POOL_OPERATIONAL'
  | 'UTILITY_FIELD_VAN'
  | 'STAFF_SHUTTLE_BUS'
  | 'ELECTRIC_VEHICLE_EV';

export type OwnershipModel =
  | 'COMPANY_OWNED'
  | 'OPERATING_LEASE_TRAC'
  | 'OPERATING_LEASE_MPM'
  | 'OPERATING_LEASE_ASSA'
  | 'CAR_OWNERSHIP_PROGRAM_COP';

export type VehicleAvailabilityStatus =
  | 'AVAILABLE_POOL'
  | 'ON_TRIP_RESERVED'
  | 'UNDER_MAINTENANCE'
  | 'DEDICATED_ASSIGNED'
  | 'AFTER_HOURS_PARKED';

export type BookingStatus =
  | 'PENDING_GA_APPROVAL'
  | 'APPROVED_DISPATCHED'
  | 'ACTIVE_ON_GOING'
  | 'RETURNED_INSPECTED'
  | 'REJECTED_CANCELLED';

export interface CorporateVehicle {
  id: string;
  assetCode: string;
  plateNumber: string;
  brandModel: string;
  category: CorporateVehicleCategory;
  ownership: OwnershipModel;
  assignedDivision: string;
  assignedUser?: string;
  fuelType: 'BBM_PERTAMAX' | 'BBM_DEX' | 'ELECTRIC_BATTERY';
  currentOdometerKm: number;
  fuelLevelPercent: number;
  batteryHealthPercent?: number;
  status: VehicleAvailabilityStatus;
  gpsLocation: {
    lat: number;
    lng: number;
    speedKmh: number;
    address: string;
    isGeofenceHome: boolean;
  };
  stnkExpiryDate: string;
  insurancePolicyNumber: string;
  leaseVendor?: string;
  leaseMonthlyCostIdr?: number;
  eTollCardNumber: string;
  eTollBalanceIdr: number;
}

export interface CorporateCarBooking {
  id: string;
  bookingNumber: string;
  requestorName: string;
  requestorDivision: string;
  requestorRole: string;
  purpose: string;
  destination: string;
  pickupTime: string;
  expectedReturnTime: string;
  assignedVehicleAssetCode: string;
  assignedPlate: string;
  driverOption: 'WITH_POOL_DRIVER' | 'SELF_DRIVE';
  assignedDriverName?: string;
  status: BookingStatus;
  approvedByGA: string;
  estimatedCostCenter: string;
  startOdometer?: number;
  endOdometer?: number;
  actualReturnTime?: string;
}

export interface SmartKeyAccessLog {
  id: string;
  lockerNumber: string;
  vehicleAssetCode: string;
  plateNumber: string;
  authorizedEmployee: string;
  action: 'KEY_CHECKOUT' | 'KEY_RETURN';
  timestamp: string;
  odometerEnteredKm: number;
  keyStatus: 'INSIDE_LOCKER' | 'IN_USE_EMPLOYEE';
}

export interface CorporateDriver {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  simType: 'SIM_A' | 'SIM_B1_UMUM';
  simExpiryDate: string;
  assignedType: 'POOL_DRIVER' | 'EXECUTIVE_VIP_DRIVER' | 'SHUTTLE_BUS_DRIVER';
  currentDuty: 'IDLE_AVAILABLE' | 'ON_DUTY_TRIP' | 'REST_OFF_DUTY';
  ratingStars: number;
  monthlyTripsCount: number;
  overtimeHoursMonth: number;
  assignedExecutive?: string;
}
