import {
  TaxiVehicle,
  TaxiTripOrder,
  TaxiDriver,
  TaxiPoolStation,
  LostAndFoundItem,
  TaxiKpis,
  TaxiCategory,
  TaxiStatus
} from '../types';

export class TaxiService {
  private vehicles: TaxiVehicle[] = [
    {
      id: 'tx-101',
      hullNumber: 'TX-101',
      plateNumber: 'B 1420 TAA',
      category: 'REGULAR_SEDAN',
      model: 'Toyota Transmover 1.5 MT',
      brand: 'Toyota',
      year: 2023,
      fuelType: 'CNG_SPBG',
      fuelLevelPct: 78,
      taximeterSerial: 'TM-2023-8812',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2027-02-15',
      kirExpiryDate: '2026-11-20',
      status: 'ON_TRIP_HIRED',
      currentDriverName: 'Bambang Supriyanto',
      driverKtaNo: 'KTA-TX-9012',
      currentLocationName: 'Jl. Jend. Sudirman Km 4 (Menuju SCBD)',
      assignedPool: 'Pool Kemayoran Induk',
      speedKmh: 42,
      odometerKm: 64230,
      paidKmToday: 112,
      emptyKmToday: 28,
      tripsToday: 11,
      revenueTodayRp: 685000,
      isPanicSosActive: false,
      isArgoActive: true,
      passengerCount: 2,
    },
    {
      id: 'tx-102',
      hullNumber: 'TX-102',
      plateNumber: 'B 1421 TAA',
      category: 'REGULAR_MPV',
      model: 'Toyota Avanza Transmover 1.3 MT',
      brand: 'Toyota',
      year: 2024,
      fuelType: 'GASOLINE',
      fuelLevelPct: 65,
      taximeterSerial: 'TM-2024-9104',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2027-04-10',
      kirExpiryDate: '2026-12-05',
      status: 'AVAILABLE_VACANT',
      currentDriverName: 'Dedi Kurniawan',
      driverKtaNo: 'KTA-TX-8419',
      currentLocationName: 'Pangkalan Stasiun Gambir (Standby Area P1)',
      assignedPool: 'Pool Rawamangun',
      speedKmh: 0,
      odometerKm: 38120,
      paidKmToday: 95,
      emptyKmToday: 32,
      tripsToday: 8,
      revenueTodayRp: 520000,
      isPanicSosActive: false,
      isArgoActive: false,
      passengerCount: 0,
    },
    {
      id: 'tx-103',
      hullNumber: 'EV-001',
      plateNumber: 'B 1001 TAE',
      category: 'ELECTRIC_EV',
      model: 'BYD e6 MPV EV 71.7 kWh',
      brand: 'BYD',
      year: 2024,
      fuelType: 'ELECTRIC_EV',
      batterySocPct: 82,
      fuelLevelPct: 82,
      taximeterSerial: 'TM-EV-2024-001',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2027-08-01',
      kirExpiryDate: '2027-01-14',
      status: 'ON_TRIP_HIRED',
      currentDriverName: 'Asep Saepuloh',
      driverKtaNo: 'KTA-TX-7731',
      currentLocationName: 'Tol Bandara Prof. Sedyatmo Km 18',
      assignedPool: 'Pool Bandara Soetta Cengkareng',
      speedKmh: 75,
      odometerKm: 29400,
      paidKmToday: 145,
      emptyKmToday: 20,
      tripsToday: 6,
      revenueTodayRp: 890000,
      isPanicSosActive: false,
      isArgoActive: true,
      passengerCount: 3,
    },
    {
      id: 'tx-104',
      hullNumber: 'SB-015',
      plateNumber: 'B 1888 TAA',
      category: 'EXECUTIVE_PREMIUM',
      model: 'Mercedes-Benz E200 Executive / Silver Bird',
      brand: 'Mercedes-Benz',
      year: 2023,
      fuelType: 'GASOLINE',
      fuelLevelPct: 88,
      taximeterSerial: 'TM-SB-2023-112',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2026-10-18',
      kirExpiryDate: '2026-09-30',
      status: 'STANDBY_QUEUE_POOL',
      currentDriverName: 'Hendro Prasetyo',
      driverKtaNo: 'KTA-SB-3301',
      currentLocationName: 'Hotel Mulia Senayan Staging Lobby',
      assignedPool: 'Pool Mampang Eksekutif',
      speedKmh: 0,
      odometerKm: 52100,
      paidKmToday: 130,
      emptyKmToday: 18,
      tripsToday: 5,
      revenueTodayRp: 1150000,
      isPanicSosActive: false,
      isArgoActive: false,
      passengerCount: 0,
    },
    {
      id: 'tx-105',
      hullNumber: 'TX-105',
      plateNumber: 'B 1422 TAA',
      category: 'REGULAR_SEDAN',
      model: 'Toyota Transmover 1.5 MT',
      brand: 'Toyota',
      year: 2022,
      fuelType: 'GASOLINE',
      fuelLevelPct: 35,
      taximeterSerial: 'TM-2022-7721',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2026-12-10',
      kirExpiryDate: '2026-08-25',
      status: 'BREAKDOWN_OFFLINE',
      currentDriverName: 'Rudi Hartono (Off)',
      driverKtaNo: 'KTA-TX-6102',
      currentLocationName: 'Bengkel Pool Kemayoran (Ganti Kopling)',
      assignedPool: 'Pool Kemayoran Induk',
      speedKmh: 0,
      odometerKm: 112000,
      paidKmToday: 0,
      emptyKmToday: 0,
      tripsToday: 0,
      revenueTodayRp: 0,
      isPanicSosActive: false,
      isArgoActive: false,
      passengerCount: 0,
    },
    {
      id: 'tx-106',
      hullNumber: 'EV-002',
      plateNumber: 'B 1002 TAE',
      category: 'ELECTRIC_EV',
      model: 'Hyundai Ioniq 5 Signature EV',
      brand: 'Hyundai',
      year: 2024,
      fuelType: 'ELECTRIC_EV',
      batterySocPct: 22,
      fuelLevelPct: 22,
      taximeterSerial: 'TM-EV-2024-002',
      taximeterSealStatus: 'SEALED_METROLOGI_OK',
      taximeterSealExpiry: '2027-08-01',
      kirExpiryDate: '2027-02-28',
      status: 'CHARGING_REFUELING',
      currentDriverName: 'Suryadi',
      driverKtaNo: 'KTA-TX-9912',
      currentLocationName: 'SPKLU Fast Charging Pool Bandara Soetta T3 (60 kW DC)',
      assignedPool: 'Pool Bandara Soetta Cengkareng',
      speedKmh: 0,
      odometerKm: 21800,
      paidKmToday: 120,
      emptyKmToday: 15,
      tripsToday: 5,
      revenueTodayRp: 760000,
      isPanicSosActive: false,
      isArgoActive: false,
      passengerCount: 0,
    }
  ];

  private orders: TaxiTripOrder[] = [
    {
      id: 'ord-801',
      bookingCode: 'TX-BK-9901',
      source: 'MOBILE_APP',
      customerName: 'Clarissa Natalia',
      customerPhone: '0812-9988-1122',
      pickupLocation: 'Mall Grand Indonesia East Mall Lobby',
      dropoffLocation: 'Apartemen Pakubuwono Residence Blok C',
      assignedTaxiHull: 'TX-101',
      driverName: 'Bambang Supriyanto',
      fareAmountRp: 68500,
      tollFeeRp: 0,
      surchargeRp: 5000,
      totalPaidRp: 73500,
      paymentMethod: 'QRIS',
      distanceKm: 8.4,
      durationMins: 28,
      startTime: '10:15 WIB',
      status: 'IN_TRANSIT',
    },
    {
      id: 'ord-802',
      bookingCode: 'TX-BK-9902',
      source: 'AIRPORT_STAGING',
      customerName: 'Dr. Hendra Wijaya',
      customerPhone: '0811-3322-4455',
      pickupLocation: 'Bandara Soekarno-Hatta Terminal 3 Kedatangan',
      dropoffLocation: 'Hotel Indonesia Kempinski Jakarta Pusat',
      assignedTaxiHull: 'EV-001',
      driverName: 'Asep Saepuloh',
      fareAmountRp: 210000,
      tollFeeRp: 21500,
      surchargeRp: 15000,
      totalPaidRp: 246500,
      paymentMethod: 'CREDIT_DEBIT_CARD',
      distanceKm: 32.5,
      durationMins: 45,
      startTime: '09:40 WIB',
      status: 'IN_TRANSIT',
    },
    {
      id: 'ord-803',
      bookingCode: 'TX-BK-9903',
      source: 'HOTEL_CONCIERGE',
      customerName: 'Mr. David Miller (Expat)',
      customerPhone: '+65-9812-3344',
      pickupLocation: 'Hotel Mulia Senayan Jakarta',
      dropoffLocation: 'Menara Astra SCBD Sudirman',
      assignedTaxiHull: 'SB-015',
      driverName: 'Hendro Prasetyo',
      fareAmountRp: 125000,
      tollFeeRp: 0,
      surchargeRp: 0,
      totalPaidRp: 125000,
      paymentMethod: 'CORPORATE_VOUCHER',
      distanceKm: 5.2,
      durationMins: 18,
      startTime: '08:30 WIB',
      endTime: '08:48 WIB',
      status: 'COMPLETED',
      ratingStars: 5,
    },
    {
      id: 'ord-804',
      bookingCode: 'TX-BK-9904',
      source: 'STREET_HAIL',
      customerName: 'Street Passenger (Pintu Terbuka)',
      pickupLocation: 'Stasiun MRT Bundaran HI',
      dropoffLocation: 'Kawasan Perkantoran Kuningan Rasuna Said',
      assignedTaxiHull: 'TX-102',
      driverName: 'Dedi Kurniawan',
      fareAmountRp: 45000,
      tollFeeRp: 0,
      surchargeRp: 0,
      totalPaidRp: 45000,
      paymentMethod: 'CASH',
      distanceKm: 4.8,
      durationMins: 20,
      startTime: '07:50 WIB',
      endTime: '08:10 WIB',
      status: 'COMPLETED',
      ratingStars: 5,
    }
  ];

  private drivers: TaxiDriver[] = [
    {
      id: 'drv-1',
      name: 'Bambang Supriyanto',
      ktaNumber: 'KTA-TX-9012',
      simNumber: 'SIM-A-9812401',
      phone: '0813-8822-9011',
      assignedTaxiHull: 'TX-101',
      assignedPool: 'Pool Kemayoran Induk',
      shiftType: 'DAY_12H',
      employmentScheme: 'SETORAN_MURNI',
      dailyTargetSetoranRp: 320000,
      actualDepositTodayRp: 320000,
      depositStatus: 'PAID_FULL',
      totalTripsMonth: 248,
      ratingAverage: 4.92,
      fatigueScore: 'ALERT_FIT',
      status: 'ACTIVE',
    },
    {
      id: 'drv-2',
      name: 'Dedi Kurniawan',
      ktaNumber: 'KTA-TX-8419',
      simNumber: 'SIM-A-8812903',
      phone: '0812-7711-2344',
      assignedTaxiHull: 'TX-102',
      assignedPool: 'Pool Rawamangun',
      shiftType: 'DAY_12H',
      employmentScheme: 'BAGI_HASIL_REVENUE',
      dailyTargetSetoranRp: 280000,
      actualDepositTodayRp: 310000,
      depositStatus: 'PAID_FULL',
      totalTripsMonth: 215,
      ratingAverage: 4.85,
      fatigueScore: 'ALERT_FIT',
      status: 'ACTIVE',
    },
    {
      id: 'drv-3',
      name: 'Asep Saepuloh',
      ktaNumber: 'KTA-TX-7731',
      simNumber: 'SIM-A-7712391',
      phone: '0818-4455-6677',
      assignedTaxiHull: 'EV-001',
      assignedPool: 'Pool Bandara Soetta Cengkareng',
      shiftType: 'FULL_24H',
      employmentScheme: 'KOMISI_GAJI',
      dailyTargetSetoranRp: 450000,
      actualDepositTodayRp: 450000,
      depositStatus: 'PAID_FULL',
      totalTripsMonth: 185,
      ratingAverage: 4.96,
      fatigueScore: 'ALERT_FIT',
      status: 'ACTIVE',
    },
    {
      id: 'drv-4',
      name: 'Hendro Prasetyo',
      ktaNumber: 'KTA-SB-3301',
      simNumber: 'SIM-B1-6651200',
      phone: '0811-9988-3321',
      assignedTaxiHull: 'SB-015',
      assignedPool: 'Pool Mampang Eksekutif',
      shiftType: 'DAY_12H',
      employmentScheme: 'BAGI_HASIL_REVENUE',
      dailyTargetSetoranRp: 550000,
      actualDepositTodayRp: 550000,
      depositStatus: 'PAID_FULL',
      totalTripsMonth: 142,
      ratingAverage: 4.98,
      fatigueScore: 'ALERT_FIT',
      status: 'ACTIVE',
    }
  ];

  private stations: TaxiPoolStation[] = [
    {
      id: 'st-1',
      name: 'Pangkalan Bandara Soekarno-Hatta T3 Kedatangan',
      type: 'AIRPORT_TERMINAL',
      address: 'Bandara Internasional Soekarno-Hatta, Terminal 3 Gate 4',
      capacitySlots: 45,
      currentAvailableTaxis: 18,
      currentQueueLength: 12,
      avgWaitTimeMins: 4,
      dispatcherOnDuty: 'Agus Pramono (T3 Dispatch)',
      hasEvCharger: true,
      hasGasSpbg: false,
    },
    {
      id: 'st-2',
      name: 'Pangkalan Stasiun Gambir (Pintu Timur)',
      type: 'TRAIN_STATION',
      address: 'Jl. Medan Merdeka Timur No. 1, Jakarta Pusat',
      capacitySlots: 25,
      currentAvailableTaxis: 8,
      currentQueueLength: 5,
      avgWaitTimeMins: 2,
      dispatcherOnDuty: 'Eko Wahyudi',
      hasEvCharger: false,
      hasGasSpbg: true,
    },
    {
      id: 'st-3',
      name: 'Pool Induk Kemayoran & SPBG Gas',
      type: 'MAIN_POOL',
      address: 'Jl. Angkasa Kav. B6 No. 12, Kemayoran, Jakarta Pusat',
      capacitySlots: 150,
      currentAvailableTaxis: 42,
      currentQueueLength: 0,
      avgWaitTimeMins: 0,
      dispatcherOnDuty: 'Suhartono (Pool Manager)',
      hasEvCharger: true,
      hasGasSpbg: true,
    },
    {
      id: 'st-4',
      name: 'Pangkalan Mall Grand Indonesia & Plaza Indonesia',
      type: 'MALL_HOTEL_STATION',
      address: 'Jl. M.H. Thamrin No. 1, Jakarta Pusat (Lobby Rama)',
      capacitySlots: 15,
      currentAvailableTaxis: 6,
      currentQueueLength: 9,
      avgWaitTimeMins: 6,
      dispatcherOnDuty: 'Fajar Nugraha',
      hasEvCharger: false,
      hasGasSpbg: false,
    }
  ];

  private lostAndFound: LostAndFoundItem[] = [
    {
      id: 'lnf-1',
      caseNumber: 'LF-2026-0819-01',
      taxiHullNumber: 'TX-101',
      driverName: 'Bambang Supriyanto',
      passengerName: 'Ibu Ratna Juwita',
      passengerPhone: '0813-7722-3344',
      itemName: 'iPhone 15 Pro Max Deep Blue (Casing Hitam Magsafe)',
      itemCategory: 'SMARTPHONE_ELECTRONIC',
      tripDate: '2026-08-20 18:30 WIB',
      pickupDropoffRoute: 'Plaza Senayan -> Menteng',
      reportedAt: '2026-08-20 19:15 WIB',
      itemStatus: 'RETURNED_TO_OWNER',
      custodyOfficer: 'Security Pool Kemayoran',
      handoverReceiptNo: 'RC-LF-9981',
    },
    {
      id: 'lnf-2',
      caseNumber: 'LF-2026-0821-02',
      taxiHullNumber: 'EV-001',
      driverName: 'Asep Saepuloh',
      passengerName: 'Belum Terdata (Penumpang Bandara)',
      itemName: 'Dompet Kulit Coklat Braun Buffel (Berisi KTP & Kartu Kredit)',
      itemCategory: 'WALLET_VALUABLES',
      tripDate: '2026-08-21 07:15 WIB',
      pickupDropoffRoute: 'Bandara Soetta T3 -> Hotel Kempinski',
      reportedAt: '2026-08-21 08:30 WIB',
      itemStatus: 'STORED_AT_POOL',
      custodyOfficer: 'Dispatcher Bandara T3',
    }
  ];

  // Rates & Taximeter Config
  public taximeterConfig = {
    flagFallRegularRp: 8500, // Buka Pintu Pertama
    perKmRegularRp: 5400,    // Tarif per KM
    waitingPerHourRp: 55000, // Tarif Waktu Tunggu / Jam
    flagFallExecutiveRp: 17500,
    perKmExecutiveRp: 9800,
    waitingPerHourExecutiveRp: 95000,
    airportSurchargeRp: 15000, // Surcharge Bandara
    midnightSurchargePct: 15,   // Surcharge 00:00 - 05:00 (+15%)
    fuelPerLiterGasolineRp: 10000, // Pertalite / Revvo
    gasPerLspSpbgRp: 4500,      // Gas SPBG LSP
    evKwhCostRp: 2466,          // Tarif SPKLU PLN Fast Charging
  };

  // Getters
  public getVehicles(): TaxiVehicle[] {
    return [...this.vehicles];
  }

  public getOrders(): TaxiTripOrder[] {
    return [...this.orders];
  }

  public getDrivers(): TaxiDriver[] {
    return [...this.drivers];
  }

  public getStations(): TaxiPoolStation[] {
    return [...this.stations];
  }

  public getLostAndFound(): LostAndFoundItem[] {
    return [...this.lostAndFound];
  }

  public getKpis(): TaxiKpis {
    const totalActive = this.vehicles.length;
    const hired = this.vehicles.filter(v => v.status === 'ON_TRIP_HIRED').length;
    const vacant = this.vehicles.filter(v => v.status === 'AVAILABLE_VACANT').length;
    const standby = this.vehicles.filter(v => v.status === 'STANDBY_QUEUE_POOL').length;
    const maint = this.vehicles.filter(v => v.status === 'BREAKDOWN_OFFLINE').length;
    const evCount = this.vehicles.filter(v => v.category === 'ELECTRIC_EV').length;

    const totalPaidKm = this.vehicles.reduce((acc, v) => acc + v.paidKmToday, 0);
    const totalEmptyKm = this.vehicles.reduce((acc, v) => acc + v.emptyKmToday, 0);
    const totalGrossRevenue = this.vehicles.reduce((acc, v) => acc + v.revenueTodayRp, 0);
    const totalTrips = this.vehicles.reduce((acc, v) => acc + v.tripsToday, 0);

    const totalKm = totalPaidKm + totalEmptyKm;
    const utilizationRate = totalKm > 0 ? (totalPaidKm / totalKm) * 100 : 0;
    const avgFare = totalTrips > 0 ? totalGrossRevenue / totalTrips : 0;

    return {
      totalActiveFleet: totalActive,
      totalHiredOnTrip: hired,
      totalVacantAvailable: vacant,
      totalStandbyQueue: standby,
      totalMaintenanceOffline: maint,
      totalCompletedTripsToday: totalTrips,
      totalGrossRevenueRp: totalGrossRevenue,
      totalPaidKm: totalPaidKm,
      totalEmptyKm: totalEmptyKm,
      utilizationRatePct: Number(utilizationRate.toFixed(1)),
      avgTripFareRp: Math.round(avgFare),
      activePanicAlerts: 0,
      totalEvFleet: evCount,
      avgPassengerRating: 4.93,
    };
  }

  // AI Briefing Generator
  public generateAiDailyTaxiBriefing(): string {
    const kpi = this.getKpis();
    return `[RINGKASAN OPERASIONAL TAXI FLEET INTELLIGENCE - 21 AGUSTUS 2026]
-------------------------------------------------------------------------
1. KINERJA ARMADA & UTILISASI JARAK:
   - Total Armada Aktif: ${kpi.totalActiveFleet} Unit (${kpi.totalEvFleet} Unit EV Ramah Lingkungan).
   - Utilisasi Jarak (Paid KM vs Total KM): ${kpi.utilizationRatePct}% (Sangat Efisien, di atas benchmark industri 75%).
   - Total KM Berpenumpang: ${kpi.totalPaidKm} KM | Deadhead Kosong: ${kpi.totalEmptyKm} KM.
   - Total Ritase Selesai: ${kpi.totalCompletedTripsToday} Trips | Estimasi Pendapatan: Rp ${kpi.totalGrossRevenueRp.toLocaleString()}.

2. TITIK LONJAKAN PERMINTAAN (DEMAND HOTSPOTS):
   - Bandara Soekarno-Hatta T3: Permintaan tinggi (12 antrean penumpang). Rekomendasi: Relokasi 5 unit kosong dari Pool Kemayoran.
   - Jam Sibuk Sore (17:00 - 20:00 WIB): Prediksi hujan lokal di area SCBD & Sudirman. Disarankan mengaktifkan push-dispatch radius 2 km.

3. KEPATUHAN & KESELAMATAN:
   - Segel Tera Metrologi Argometer: 100% Valid & Terverifikasi.
   - Zero Panic SOS Incident dalam 24 jam terakhir.
   - Nilai Kepuasan Penumpang: ${kpi.avgPassengerRating} / 5.0 (Rating Bintang Sangat Tinggi).`;
  }
}

export const taxiService = new TaxiService();
