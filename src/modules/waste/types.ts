export type WasteVehicleType =
  | 'COMPACTOR_TRUCK'
  | 'ARM_ROLL_TRUCK'
  | 'HOOK_LIFT_TRUCK'
  | 'VACUUM_SLUDGE_TRUCK'
  | 'MEDICAL_B3_COLD_BOX'
  | 'DUMP_TRUCK_WASTE';

export type WasteCargoCategory =
  | 'DOMESTIC_MUNICIPAL'
  | 'COMMERCIAL_ORGANIC'
  | 'HAZARDOUS_B3_INDUSTRIAL'
  | 'MEDICAL_BIOHAZARD'
  | 'SEPTIC_SLUDGE_IPAL'
  | 'CONSTRUCTION_DEBRIS'
  | 'RECYCLABLE_DRY';

export type WasteTripStatus =
  | 'IDLE_DEPOT'
  | 'ON_COLLECTION_ROUTE'
  | 'EN_ROUTE_TO_TPA'
  | 'WEIGHBRIDGE_QUEUE'
  | 'TIPPING_DISCHARGE'
  | 'WASHING_DISINFECTING'
  | 'COMPLETED_TRIP';

export interface WasteFleetVehicle {
  id: string;
  hullNumber: string;
  plateNumber: string;
  vehicleType: WasteVehicleType;
  cargoCategory: WasteCargoCategory;
  capacityM3: number;
  maxPayloadTons: number;
  currentPayloadTons: number;
  compactorFillRatePct: number;
  odometerKm: number;
  hydraulicStatus: 'OPTIMAL' | 'PRESSURE_WARNING' | 'MAINTENANCE_REQUIRED';
  leachateDrainValve: 'CLOSED_SEALED' | 'OPEN_DRAIN';
  gpsLocation: {
    lat: number;
    lng: number;
    speedKmh: number;
    address: string;
    zone: string;
  };
  currentStatus: WasteTripStatus;
  currentDriver: string;
  driverPhone: string;
  assignedCrewCount: number;
  activeRouteName: string;
  currentTpaDestination: string;
  festronikManifestNo?: string;
  coldBoxTempC?: number;
  kirExpiry: string;
  klhkLicenseExpiry: string;
}

export interface WasteCollectionBin {
  id: string;
  binCode: string;
  name: string;
  category: 'RESIDENTIAL_TPS' | 'MALL_HOTEL' | 'HOSPITAL' | 'FACTORY_INDUSTRIAL' | 'PUBLIC_MARKET';
  address: string;
  coordinates: { lat: number; lng: number };
  capacityM3: number;
  fillLevelPct: number;
  sensorStatus: 'NORMAL' | 'OVERFLOW_ALERT' | 'GAS_ODOR_WARNING' | 'FIRE_RISK';
  lastEmptiedAt: string;
  scheduledPickupTime: string;
  assignedVehicleHull: string;
  rfidTag: string;
}

export interface FestronikManifestB3 {
  id: string;
  manifestNumber: string;
  klhkRegistrationNo: string;
  wasteCode: string;
  wasteName: string;
  generatorName: string; // Penghasil
  transporterName: string; // Pengangkut
  receiverProcessorName: string; // Pengolah / Pemanfaat
  volumeTons: number;
  packagingType: 'DRUM_200L' | 'IBC_TANK' | 'JUMBO_BAG' | 'SAFETY_BOX_BIOHAZARD';
  packagingCount: number;
  status: 'DRAFT' | 'APPROVED_KLHK' | 'IN_TRANSIT' | 'ACCEPTED_RECEIVER';
  assignedHull: string;
  driverName: string;
  qrCodeUrl: string;
  departureDate: string;
  emergencyPhone: string;
}

export interface WeighbridgeRecord {
  id: string;
  ticketNumber: string;
  tpaName: string;
  hullNumber: string;
  plateNumber: string;
  driverName: string;
  wasteCategory: WasteCargoCategory;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netWeightTons: number;
  tippingFloorZone: string;
  inTimestamp: string;
  outTimestamp: string;
  operatorName: string;
  tippingFeeRp: number;
  paymentStatus: 'PAID' | 'BILLED_RETRIBUTION' | 'CONTRACT_ACCOUNT';
}

export interface WasteCrewMember {
  id: string;
  name: string;
  nik: string;
  role: 'CHIEF_DRIVER' | 'HYDRAULIC_OPERATOR' | 'LOADER_CREW';
  assignedHull: string;
  depotBase: string;
  shift: 'PAGI_SUBUH' | 'SIANG' | 'MALAM';
  attendanceStatus: 'HADIR_ON_DUTY' | 'OFF_REST' | 'CUTI';
  dailyPayloadTonsCollected: number;
  dailyTripsCompleted: number;
  safetyPpeCompliancePct: number;
  healthFitnessStatus: 'FIT' | 'FIT_RESTRICTION' | 'UNFIT';
}
