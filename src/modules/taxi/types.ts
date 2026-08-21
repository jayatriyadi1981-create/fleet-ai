export type TaxiCategory =
  | 'REGULAR_SEDAN'     // e.g. Toyota Vios / Transmover 1.5L
  | 'REGULAR_MPV'       // e.g. Toyota Avanza Transmover / Ertiga (7-Seater)
  | 'EXECUTIVE_PREMIUM' // e.g. Toyota Camry / Mercedes-Benz E-Class / Alphard (Silver/Gold Bird)
  | 'ELECTRIC_EV'       // e.g. BYD e6 / BYD T3 / Hyundai Ioniq 5 (Green Taxi)
  | 'AIRPORT_VAN';      // e.g. Toyota HiAce Premio / Hyundai Staria

export type TaxiStatus =
  | 'AVAILABLE_VACANT'     // Kosong / Siap Angkut Penumpang
  | 'ON_TRIP_HIRED'        // Bermuatan (Argo Menyala / Hired)
  | 'DISPATCHED_ON_WAY'    // Menuju Lokasi Penjemputan Penumpang
  | 'STANDBY_QUEUE_POOL'   // Antre di Pangkalan / Pool / Bandara FIFO
  | 'BREAKDOWN_OFFLINE'    // Bengkel / Rusak
  | 'SHIFT_CHANGE'         // Operan Shift Pengemudi / Istirahat
  | 'CHARGING_REFUELING';  // Isi Bensin / SPBG / Fast Charging EV

export type FareType =
  | 'STANDARD_REGULAR'
  | 'PREMIUM_EXECUTIVE'
  | 'AIRPORT_FLAT'
  | 'MIDNIGHT_SURCHARGE';

export type PaymentMethod =
  | 'CASH'
  | 'QRIS'
  | 'CREDIT_DEBIT_CARD'
  | 'CORPORATE_VOUCHER'
  | 'APP_EWALLET';

export interface TaxiVehicle {
  id: string;
  hullNumber: string; // e.g. TX-108, SB-022, EV-005
  plateNumber: string; // e.g. B 1982 TAA (Plat Kuning)
  category: TaxiCategory;
  model: string;
  brand: string;
  year: number;
  fuelType: 'GASOLINE' | 'CNG_SPBG' | 'ELECTRIC_EV' | 'HYBRID';
  batterySocPct?: number; // For EV
  fuelLevelPct: number;
  taximeterSerial: string;
  taximeterSealStatus: 'SEALED_METROLOGI_OK' | 'EXPIRED_CALIBRATION' | 'UNSEALED_ALERT';
  taximeterSealExpiry: string;
  kirExpiryDate: string;
  status: TaxiStatus;
  currentDriverName: string;
  driverKtaNo: string;
  currentLocationName: string;
  assignedPool: string;
  speedKmh: number;
  odometerKm: number;
  paidKmToday: number; // KM Berpenumpang
  emptyKmToday: number; // Deadhead KM
  tripsToday: number;
  revenueTodayRp: number;
  isPanicSosActive: boolean;
  isArgoActive: boolean;
  passengerCount: number;
}

export interface TaxiTripOrder {
  id: string;
  bookingCode: string;
  source: 'STREET_HAIL' | 'CALL_CENTER' | 'MOBILE_APP' | 'HOTEL_CONCIERGE' | 'AIRPORT_STAGING';
  customerName: string;
  customerPhone?: string;
  pickupLocation: string;
  dropoffLocation: string;
  assignedTaxiHull: string;
  driverName: string;
  fareAmountRp: number;
  tollFeeRp: number;
  surchargeRp: number;
  totalPaidRp: number;
  paymentMethod: PaymentMethod;
  distanceKm: number;
  durationMins: number;
  startTime: string;
  endTime?: string;
  status: 'PENDING_DISPATCH' | 'PICKING_UP' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  ratingStars?: number;
}

export interface TaxiDriver {
  id: string;
  name: string;
  ktaNumber: string;
  simNumber: string; // SIM A Umum / B1 Umum
  phone: string;
  assignedTaxiHull: string;
  assignedPool: string;
  shiftType: 'DAY_12H' | 'NIGHT_12H' | 'FULL_24H';
  employmentScheme: 'SETORAN_MURNI' | 'BAGI_HASIL_REVENUE' | 'KOMISI_GAJI';
  dailyTargetSetoranRp: number;
  actualDepositTodayRp: number;
  depositStatus: 'PAID_FULL' | 'UNDERPAID' | 'EXEMPT';
  totalTripsMonth: number;
  ratingAverage: number; // e.g. 4.9
  fatigueScore: 'ALERT_FIT' | 'MODERATE_FATIGUE' | 'CRITICAL_DROWSY';
  status: 'ACTIVE' | 'OFF_DUTY' | 'SUSPENDED';
}

export interface TaxiPoolStation {
  id: string;
  name: string;
  type: 'MAIN_POOL' | 'AIRPORT_TERMINAL' | 'TRAIN_STATION' | 'MALL_HOTEL_STATION';
  address: string;
  capacitySlots: number;
  currentAvailableTaxis: number;
  currentQueueLength: number;
  avgWaitTimeMins: number;
  dispatcherOnDuty: string;
  hasEvCharger: boolean;
  hasGasSpbg: boolean;
}

export interface LostAndFoundItem {
  id: string;
  caseNumber: string;
  taxiHullNumber: string;
  driverName: string;
  passengerName?: string;
  passengerPhone?: string;
  itemName: string;
  itemCategory: 'SMARTPHONE_ELECTRONIC' | 'WALLET_VALUABLES' | 'LUGGAGE_BAG' | 'DOCUMENTS_ID' | 'OTHERS';
  tripDate: string;
  pickupDropoffRoute: string;
  reportedAt: string;
  itemStatus: 'STORED_AT_POOL' | 'RETURNED_TO_OWNER' | 'IN_INVESTIGATION';
  custodyOfficer: string;
  handoverReceiptNo?: string;
}

export interface TaxiKpis {
  totalActiveFleet: number;
  totalHiredOnTrip: number;
  totalVacantAvailable: number;
  totalStandbyQueue: number;
  totalMaintenanceOffline: number;
  totalCompletedTripsToday: number;
  totalGrossRevenueRp: number;
  totalPaidKm: number;
  totalEmptyKm: number;
  utilizationRatePct: number; // (Paid KM / Total KM) * 100
  avgTripFareRp: number;
  activePanicAlerts: number;
  totalEvFleet: number;
  avgPassengerRating: number;
}
