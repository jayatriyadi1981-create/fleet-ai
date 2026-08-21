export type TankerLiquidType =
  | 'BBM_PERTALITE'       // Bensin RON 90
  | 'BBM_PERTAMAX'        // Bensin RON 92/98
  | 'BBM_BIOSOLAR'        // B35 / B40 Diesel
  | 'BBM_AVTUR'           // Jet Fuel A-1
  | 'CPO_CRUDE_PALM_OIL'  // Minyak Sawit Mentah
  | 'OLEIN_COOKING_OIL'   // Minyak Goreng Curah / RPO
  | 'CHEMICAL_ACID'       // H2SO4 / HCl / Asam Klorida / Caustic Soda
  | 'LPG_BULK'            // Liquefied Petroleum Gas Tekanan Tinggi
  | 'LNG_CRYOGENIC'       // Liquefied Natural Gas -162°C
  | 'INDUSTRIAL_WATER'    // Air Bersih / Air Demin
  | 'LIQUID_ASPHALT'      // Aspal Curah Panas Bitumen (160°C)
  | 'CEMENT_BULK';        // Semen Curah Pneumatik

export type TankerStatus =
  | 'LOADING_GANTRY'      // Sedang Pengisian di Gantry / Terminal BBM / Mill CPO
  | 'EN_ROUTE_LOADED'     // Dalam Perjalanan Bermuatan (Transit)
  | 'UNLOADING_DISCHARGE' // Sedang Bongkar di SPBU / Tangki Pabrik
  | 'EN_ROUTE_EMPTY'      // Kembali Kosong ke Pool / Depot
  | 'CLEANING_PURGING'    // Cuci Tangki / Degassing / Uap Steam
  | 'MAINTENANCE_TERA'    // Perawatan Bengkel / Kalibrasi Tera Metrologi
  | 'STANDBY_READY';      // Standby di Pool Siap Order

export type TankMaterial =
  | 'ALUMINIUM_ALLOY_5182'
  | 'STAINLESS_STEEL_SS304'
  | 'STAINLESS_STEEL_SS316L'
  | 'CARBON_STEEL_Q235B'
  | 'EPOXY_LINED_STEEL';

export type ElockStatus =
  | 'LOCKED_SECURE'       // Terkunci Aman (Segel Aktif)
  | 'AUTHORIZED_UNLOCKED' // Terbuka Resmi di Titik Bongkar Geofence
  | 'TAMPER_BREACH_ALERT' // PERINGATAN: Segel Dibuka Paksa di Luar Geofence
  | 'OFFLINE_BATTERY_LOW';// Sensor Kunci Offline

export interface TankerCompartment {
  id: string;
  compartmentNo: number; // 1, 2, 3, 4
  capacityLiters: number; // e.g. 8000 L
  currentVolumeLiters: number; // e.g. 7990 L
  liquidType: TankerLiquidType;
  levelMm: number; // Ketinggian Cairan mm
  ullageMm: number; // Ruang Kosong atas mm
  temperatureC: number; // misal 29.5°C
  densityKgM3: number; // misal 840 kg/m³
  waterBottomMm: number; // Endapan air dasar tangki (0 mm = normal)
  manholeStatus: 'CLOSED_LOCKED' | 'OPEN_ALERT' | 'UNSEALED';
  dischargeValveStatus: 'CLOSED_LOCKED' | 'OPEN_DISCHARGING' | 'LEAKING_ALERT';
  bottomLoadingValveStatus: 'CLOSED' | 'CONNECTED_GANTRY';
}

export interface TankerVehicle {
  id: string;
  hullNumber: string; // e.g. TANK-801, TANK-BBM-24, CPO-902
  plateNumber: string; // e.g. B 9871 TFU (Plat Kuning)
  truckType: 'RIGID_TANKER' | 'SEMITRAILER_TANKER' | 'ISO_TANK_CHASSIS';
  tankMaterial: TankMaterial;
  totalCapacityLiters: number; // e.g. 24000, 32000, 40000 L
  numberOfCompartments: number;
  compartments: TankerCompartment[];
  dedicatedCargo: TankerLiquidType;
  currentStatus: TankerStatus;
  driverName: string;
  driverPhone: string;
  coDriverName?: string;
  currentLocationName: string;
  destinationName: string;
  assignedDepot: string;
  speedKmh: number;
  maxCorridorSpeedKmh: number;
  sloshLateralGForce: number; // e.g. 0.12 G (<0.35 safe)
  isRolloverWarning: boolean;
  isRedZoneStopAlert: boolean;
  elockMasterStatus: ElockStatus;
  unauthorizedDrainAlert: boolean;
  teraMetrologiExpiry: string; // Tanggal habis masa berlaku Tera
  hydrotestExpiry: string;
  kirExpiry: string;
  b3LicenseExpiry: string;
  fuelLevelPct: number;
  loadedWeightTon: number;
  grossVehicleWeightTon: number;
}

export interface TankerDeliveryOrder {
  id: string;
  spbNumber: string; // Surat Perintah Bongkar / DO e.g. SPB-2026-BBM-8921
  doNumber: string;
  consignor: string; // Pengirim e.g. TBBM Plumpang / Mill CPO Dumai
  consignee: string; // Penerima e.g. SPBU 31.144.08 / PT Wilmar Nabati
  consigneeAddress: string;
  assignedTankerHull: string;
  driverName: string;
  productType: TankerLiquidType;
  orderedVolumeLiters: number;
  gantryLoadedGrossLiters: number;
  gantryLoadedNet15Liters: number;
  gantryLoadingTempC: number;
  gantryDensity: number;
  dischargedVolumeLiters?: number;
  volumeLossLiters?: number;
  lossPercentage?: number; // Toleransi e.g. 0.08% (<0.15% OK)
  lossStatus: 'WITHIN_TOLERANCE' | 'EXCESSIVE_LOSS_CLAIM' | 'PENDING_UNLOAD';
  departureTime: string;
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  unloadingStartTime?: string;
  unloadingEndTime?: string;
  status: 'LOADING' | 'IN_TRANSIT' | 'AT_UNLOADING_POINT' | 'DISCHARGING' | 'COMPLETED' | 'CANCELLED';
  elockSecurityOtp: string;
  eSealBarcode: string;
}

export interface TankerDriver {
  id: string;
  name: string;
  simNumber: string; // SIM B2 Umum
  b3CertNumber: string; // Sertifikat Pelatihan Pengemudi B3 BNSP
  b3CertExpiry: string;
  phone: string;
  assignedTankerHull: string;
  depotBase: string;
  medicalCheckupDate: string;
  alcoholTestResult: '0.00_PROMIL_FIT' | 'DETECTED_UNFIT';
  bloodPressure: string; // e.g. 120/80
  dmsScore: number; // 98/100
  totalLoadedTrips: number;
  zeroLossRatePct: number; // e.g. 99.4%
  status: 'ACTIVE_DRIVING' | 'OFF_DUTY_REST' | 'SUSPENDED';
}

export interface TankerCleaningLog {
  id: string;
  tankerHull: string;
  cleaningDate: string;
  cleaningBay: string;
  previousCargo: TankerLiquidType;
  nextCargoPlanned: TankerLiquidType;
  cleaningMethod: 'HOT_WATER_HIGH_PRESSURE' | 'CAUSTIC_CHEMICAL_WASH' | 'STEAM_JET_DEGASSING' | 'SOLVENT_PURGE';
  dryingMethod: 'BLOWER_HOT_AIR' | 'INERT_NITROGEN_PURGING';
  inspectorName: string;
  gasFreeMeterPpm: number; // Gas sisa VOC (0 ppm = aman)
  cleanCertificateNumber: string;
  isApproved: boolean;
}
