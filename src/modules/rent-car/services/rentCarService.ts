/**
 * Fleet Intelligence Smart AI - Rent Car Management Service
 * Complete business logic for rental fleet inventory, reservations,
 * digital inspection & damage pinning, customer KYC anti-fraud, 
 * telematics geofencing, and remote starter-kill engine immobilizer.
 */

import { 
  RentalVehicle, 
  RentalCustomer, 
  RentalBooking, 
  HandoverInspection, 
  RentalTelemetryAlert, 
  RentalFleetKPIs,
  DamagePin,
  BookingStatus,
  RentalContract,
  RentalDamageRecord,
  RentalRateCard,
  RentalInvoice,
  VehicleProfitabilityData,
  RentalAiInsight,
  RentalCalendarEvent
} from '../types';

// Initial Mock Rental Fleet (Indonesian rental market realistic models)
const INITIAL_RENTAL_VEHICLES: RentalVehicle[] = [
  {
    id: 'rent-veh-01',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 1982 UTX',
    brand: 'Toyota',
    model: 'Innova Zenix 2.0 Q Hybrid TSS',
    year: 2024,
    category: 'mpv',
    transmission: 'automatic',
    seats: 7,
    luggageCapacity: 4,
    color: 'Attitude Black Mica',
    fuelType: 'pertamax',
    currentOdometerKm: 18450,
    fuelLevelPercent: 88,
    status: 'rented',
    pricing: {
      dailyRate: 850000,
      weeklyRate: 5300000,
      monthlyRate: 19500000,
      withDriverDailyRate: 1150000,
      allInDailyRate: 1450000,
      depositAmount: 1500000,
      overtimeHourlyRate: 85000,
      excessMileagePerKmRate: 2000,
      dailyMileageLimitKm: 300
    },
    allowedZone: 'java_island',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-AT4-98210',
    currentBookingId: 'rc-book-001',
    currentDriverId: 'drv-01',
    assignedDriverName: 'Bambang Supriyanto',
    features: ['Toyota Safety Sense 3.0', 'Panoramic Sunroof', 'Captain Seat Ottoman', 'Wireless Apple CarPlay', 'Dashcam Dual 4K', 'E-Toll Preloaded'],
    location: {
      lat: -6.2146,
      lng: 106.8451,
      address: 'Jl. Sudirman No. 45, Jakarta Selatan (Bergerak 48 km/h)',
      speed: 48,
      isInsideAllowedZone: true,
      lastUpdated: '1 menit yang lalu'
    },
    stnkExpiry: '2028-04-15',
    insuranceExpiry: '2027-04-15',
    insuranceType: 'comprehensive_cdw',
    cleanlinessScore: 9.5,
    totalTripsCount: 42
  },
  {
    id: 'rent-veh-02',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 2201 ZLX',
    brand: 'Toyota',
    model: 'Alphard 2.5 HEV Executive Lounge',
    year: 2024,
    category: 'luxury',
    transmission: 'e-cvt',
    seats: 6,
    luggageCapacity: 5,
    color: 'Platinum White Pearl',
    fuelType: 'pertamax',
    currentOdometerKm: 12100,
    fuelLevelPercent: 95,
    status: 'rented',
    pricing: {
      dailyRate: 2800000,
      weeklyRate: 18000000,
      monthlyRate: 65000000,
      withDriverDailyRate: 3300000,
      allInDailyRate: 3950000,
      depositAmount: 3000000,
      overtimeHourlyRate: 250000,
      excessMileagePerKmRate: 5000,
      dailyMileageLimitKm: 250
    },
    allowedZone: 'jabodetabek_only',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-FMB-44102',
    currentBookingId: 'rc-book-002',
    currentDriverId: 'drv-02',
    assignedDriverName: 'Agus Purnomo (VIP Chauffeur)',
    features: ['Executive Ottoman Seat Massage', 'JBL 15-Speaker Audio', 'Rear Seat Entertainment 14"', 'Power Executive Doors', 'VIP Partition Curtain', 'Dashcam 24/7 Live Stream'],
    location: {
      lat: -6.1754,
      lng: 106.8272,
      address: 'Kawasan Monas & Gambir, Jakarta Pusat (Parkir - Mesin Hidup)',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: '3 menit yang lalu'
    },
    stnkExpiry: '2029-01-20',
    insuranceExpiry: '2027-01-20',
    insuranceType: 'comprehensive_cdw',
    cleanlinessScore: 10,
    totalTripsCount: 28
  },
  {
    id: 'rent-veh-03',
    tenantId: 'tenant-1',
    branchId: 'branch-bali-1',
    branchName: 'Depot Bandara I Gusti Ngurah Rai (DPS) Bali',
    plateNumber: 'DK 1849 ABZ',
    brand: 'Hyundai',
    model: 'Ioniq 5 Signature Long Range EV',
    year: 2024,
    category: 'ev',
    transmission: 'automatic',
    seats: 5,
    luggageCapacity: 3,
    color: 'Gravity Gold Matte',
    fuelType: 'electric',
    currentOdometerKm: 24600,
    fuelLevelPercent: 78,
    batteryLevelPercent: 78,
    status: 'available',
    pricing: {
      dailyRate: 1100000,
      weeklyRate: 7000000,
      monthlyRate: 25000000,
      withDriverDailyRate: 1450000,
      allInDailyRate: 1750000,
      depositAmount: 2000000,
      overtimeHourlyRate: 100000,
      excessMileagePerKmRate: 0,
      dailyMileageLimitKm: 0
    },
    allowedZone: 'bali_perimeter',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-TEL-99120',
    features: ['V2L (Vehicle-to-Load) 3.6kW', 'Hyundai SmartSense Level 2 ADAS', 'Bose Premium Audio', 'Solar Roof Charger', 'CCS2 Fast Charging Adapter', 'Relaxation Comfort Seats'],
    location: {
      lat: -8.7482,
      lng: 115.1675,
      address: 'Pool Rental Bandara Ngurah Rai, Tuban, Bali (Siap Jalan)',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: 'Baru saja'
    },
    stnkExpiry: '2028-09-12',
    insuranceExpiry: '2027-09-12',
    insuranceType: 'comprehensive_cdw',
    cleanlinessScore: 9.8,
    totalTripsCount: 54
  },
  {
    id: 'rent-veh-04',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 1477 FOQ',
    brand: 'Toyota',
    model: 'Fortuner 2.8 GR Sport 4x4',
    year: 2023,
    category: 'suv',
    transmission: 'automatic',
    seats: 7,
    luggageCapacity: 4,
    color: 'Super White II',
    fuelType: 'diesel',
    currentOdometerKm: 38200,
    fuelLevelPercent: 62,
    status: 'overdue',
    pricing: {
      dailyRate: 1250000,
      weeklyRate: 7800000,
      monthlyRate: 28000000,
      withDriverDailyRate: 1600000,
      allInDailyRate: 1950000,
      depositAmount: 2000000,
      overtimeHourlyRate: 125000,
      excessMileagePerKmRate: 2500,
      dailyMileageLimitKm: 350
    },
    allowedZone: 'java_island',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-AT4-77189',
    currentBookingId: 'rc-book-003',
    features: ['GR Sport Bodykit', 'TSS Active Safety', '360 Panoramic View Monitor', 'Towing Hitch Bar', 'Off-road Mode', 'GPS Real-time Anti-Jammer'],
    location: {
      lat: -6.9175,
      lng: 107.6191,
      address: 'Jl. Dago Atas No. 118, Bandung (Telat 4 Jam dari Jadwal Return)',
      speed: 15,
      isInsideAllowedZone: true,
      lastUpdated: '5 menit yang lalu'
    },
    stnkExpiry: '2028-02-18',
    insuranceExpiry: '2026-12-10',
    insuranceType: 'all_risk',
    cleanlinessScore: 8.5,
    totalTripsCount: 68
  },
  {
    id: 'rent-veh-05',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 2341 TRB',
    brand: 'Toyota',
    model: 'Avanza 1.5 G CVT TSS',
    year: 2024,
    category: 'mpv',
    transmission: 'automatic',
    seats: 7,
    luggageCapacity: 3,
    color: 'Purplish Silver',
    fuelType: 'pertalite',
    currentOdometerKm: 16500,
    fuelLevelPercent: 100,
    status: 'available',
    pricing: {
      dailyRate: 450000,
      weeklyRate: 2800000,
      monthlyRate: 9800000,
      withDriverDailyRate: 750000,
      allInDailyRate: 950000,
      depositAmount: 1000000,
      overtimeHourlyRate: 45000,
      excessMileagePerKmRate: 1500,
      dailyMileageLimitKm: 300
    },
    allowedZone: 'java_island',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-CON-10928',
    features: ['Toyota Safety Sense', 'Wireless Screen Mirroring', 'Rear Parking Camera', 'Electronic Parking Brake + Auto Hold', 'USB Fast Charging Port'],
    location: {
      lat: -6.1275,
      lng: 106.6537,
      address: 'Pool Soewarna Business Park Bandara Soetta (Standby Available)',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: '10 menit yang lalu'
    },
    stnkExpiry: '2029-05-10',
    insuranceExpiry: '2027-05-10',
    insuranceType: 'all_risk',
    cleanlinessScore: 10,
    totalTripsCount: 82
  },
  {
    id: 'rent-veh-06',
    tenantId: 'tenant-1',
    branchId: 'branch-sby-1',
    branchName: 'Depot Bandara Juanda (SUB) Surabaya',
    plateNumber: 'L 1099 YH',
    brand: 'Mitsubishi',
    model: 'Pajero Sport Dakar Ultimate 4x2',
    year: 2023,
    category: 'suv',
    transmission: 'automatic',
    seats: 7,
    luggageCapacity: 4,
    color: 'Deep Bronze Metallic',
    fuelType: 'diesel',
    currentOdometerKm: 31200,
    fuelLevelPercent: 40,
    status: 'cleaning',
    pricing: {
      dailyRate: 1200000,
      weeklyRate: 7500000,
      monthlyRate: 26000000,
      withDriverDailyRate: 1550000,
      allInDailyRate: 1850000,
      depositAmount: 2000000,
      overtimeHourlyRate: 120000,
      excessMileagePerKmRate: 2500,
      dailyMileageLimitKm: 350
    },
    allowedZone: 'java_bali',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-TEL-88219',
    features: ['Sunroof', 'Adaptive Cruise Control', 'Ultrasonic Misacceleration Mitigation System', 'Power Tailgate with Kick Sensor', 'Rockford Fosgate Sound'],
    location: {
      lat: -7.3798,
      lng: 112.7875,
      address: 'Car Wash & Detailing Bay Depot Juanda Surabaya',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: '15 menit yang lalu'
    },
    stnkExpiry: '2028-06-25',
    insuranceExpiry: '2026-11-30',
    insuranceType: 'comprehensive_cdw',
    cleanlinessScore: 6.0,
    totalTripsCount: 47
  },
  {
    id: 'rent-veh-07',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 7819 HIC',
    brand: 'Toyota',
    model: 'HiAce Premio Luxury VIP 9-Seater',
    year: 2024,
    category: 'minibus',
    transmission: 'manual',
    seats: 9,
    luggageCapacity: 8,
    color: 'Silver Metallic',
    fuelType: 'diesel',
    currentOdometerKm: 28900,
    fuelLevelPercent: 90,
    status: 'reserved',
    pricing: {
      dailyRate: 1800000,
      weeklyRate: 11500000,
      monthlyRate: 38000000,
      withDriverDailyRate: 2200000,
      allInDailyRate: 2700000,
      depositAmount: 2500000,
      overtimeHourlyRate: 150000,
      excessMileagePerKmRate: 3000,
      dailyMileageLimitKm: 400
    },
    allowedZone: 'java_island',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-TEL-77401',
    features: ['Custom Luxury Captain Seats w/ Legrest', 'Smart TV 32" w/ Karaoke System', 'Mini Bar & Refrigerator', 'Ambient Starlight Ceiling', 'Inverter 220V Outlet', 'Dual AC Climate'],
    location: {
      lat: -6.1275,
      lng: 106.6537,
      address: 'Pool Bandara Soetta (Reserved Booking VIP Korporat Besok Pagi)',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: '20 menit yang lalu'
    },
    stnkExpiry: '2029-03-14',
    insuranceExpiry: '2027-03-14',
    insuranceType: 'comprehensive_cdw',
    cleanlinessScore: 9.8,
    totalTripsCount: 39
  },
  {
    id: 'rent-veh-08',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soekarno-Hatta (CGK)',
    plateNumber: 'B 1109 HON',
    brand: 'Honda',
    model: 'HR-V 1.5 SE CVT',
    year: 2023,
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    luggageCapacity: 3,
    color: 'Sand Khaki Pearl',
    fuelType: 'pertamax',
    currentOdometerKm: 29800,
    fuelLevelPercent: 80,
    status: 'maintenance',
    pricing: {
      dailyRate: 650000,
      weeklyRate: 4000000,
      monthlyRate: 14500000,
      withDriverDailyRate: 950000,
      allInDailyRate: 1200000,
      depositAmount: 1500000,
      overtimeHourlyRate: 65000,
      excessMileagePerKmRate: 2000,
      dailyMileageLimitKm: 300
    },
    allowedZone: 'java_island',
    remoteImmobilizerStatus: 'unlocked',
    gpsDeviceId: 'GPS-CON-99412',
    features: ['Honda SENSING', 'Panoramic Glass Roof', 'Hands-Free Power Tailgate', 'Electrostatic Touch LED Light', 'Multi-Angle Rearview Camera'],
    location: {
      lat: -6.1552,
      lng: 106.7891,
      address: 'Bengkel Resmi Honda Daan Mogot (Servis Berkala 30.000 KM & Ganti Kampas Rem)',
      speed: 0,
      isInsideAllowedZone: true,
      lastUpdated: '1 jam yang lalu'
    },
    stnkExpiry: '2028-08-11',
    insuranceExpiry: '2026-08-11',
    insuranceType: 'all_risk',
    cleanlinessScore: 8.0,
    totalTripsCount: 51
  }
];

// Mock Customers with KYC & AI Risk Fraud Profiles
const INITIAL_CUSTOMERS: RentalCustomer[] = [
  {
    id: 'cust-01',
    tenantId: 'tenant-1',
    type: 'corporate',
    name: 'PT Telkom Akses Indonesia',
    companyName: 'PT Telkom Akses (Divisi Operasional Jaringan)',
    companyNpwp: '01.234.567.8-012.000',
    nik: '3174051208850003',
    simNumber: '921118240092',
    simExpiry: '2028-11-20',
    phone: '+62 811-9876-5432',
    email: 'procurement.fleet@telkomakses.co.id',
    address: 'Gedung Menara Multimedia Lt. 8, Jl. Kebon Sirih No. 12',
    city: 'Jakarta Pusat',
    emergencyContactName: 'Dra. Maya Indrawati (Head of General Affairs)',
    emergencyContactPhone: '+62 812-3344-5566',
    emergencyContactRelation: 'Atasan Langsung / Corporate HR',
    kycStatus: 'verified',
    kycVerificationDate: '2024-01-15',
    riskScore: 8,
    fraudRiskLevel: 'LOW',
    totalBookings: 18,
    completedBookings: 17,
    cancelledBookings: 1,
    totalSpentIdr: 84500000,
    customerRating: 4.9,
    notes: 'Akun Korporat VIP BUMN. Pembayaran Invoice TOP 30 Hari lancar terpercaya.',
    ktpPhotoUploaded: true,
    simPhotoUploaded: true,
    selfieWithKtpUploaded: true
  },
  {
    id: 'cust-02',
    tenantId: 'tenant-1',
    type: 'individual',
    name: 'dr. Hendra Kusuma, Sp.OT',
    nik: '3172031904780001',
    simNumber: '780419200341',
    simExpiry: '2027-04-19',
    phone: '+62 818-0922-1133',
    email: 'hendra.kusuma.md@gmail.com',
    address: 'Jl. Taman Patra V No. 18, Kuningan Timur',
    city: 'Jakarta Selatan',
    emergencyContactName: 'drg. Shinta Dewi (Istri)',
    emergencyContactPhone: '+62 818-0922-1134',
    emergencyContactRelation: 'Istri',
    kycStatus: 'verified',
    kycVerificationDate: '2024-03-10',
    riskScore: 12,
    fraudRiskLevel: 'LOW',
    totalBookings: 6,
    completedBookings: 5,
    cancelledBookings: 0,
    totalSpentIdr: 32000000,
    customerRating: 5.0,
    notes: 'Dokter Spesialis RS Medistra. Selalu sewa Alphard/Zenix dengan sopir terpercaya.',
    ktpPhotoUploaded: true,
    simPhotoUploaded: true,
    selfieWithKtpUploaded: true
  },
  {
    id: 'cust-03',
    tenantId: 'tenant-1',
    type: 'individual',
    name: 'Reza Pratama Putra',
    nik: '3273152207960004',
    simNumber: '960722119044',
    simExpiry: '2026-07-22',
    phone: '+62 857-1920-8811',
    email: 'reza.pratama96@yahoo.com',
    address: 'Jl. Terusan Buah Batu No. 201',
    city: 'Bandung',
    emergencyContactName: 'Asep Suparman (Paman)',
    emergencyContactPhone: '+62 856-2211-9900',
    emergencyContactRelation: 'Paman',
    kycStatus: 'pending',
    riskScore: 58,
    fraudRiskLevel: 'MEDIUM',
    totalBookings: 2,
    completedBookings: 1,
    cancelledBookings: 0,
    totalSpentIdr: 4500000,
    customerRating: 3.8,
    notes: 'Sedang dalam trip sewa Fortuner (RC-202608-003). Mengalami keterlambatan return 4 jam.',
    ktpPhotoUploaded: true,
    simPhotoUploaded: true,
    selfieWithKtpUploaded: false
  },
  {
    id: 'cust-04',
    tenantId: 'tenant-1',
    type: 'individual',
    name: 'Doni Firmansyah (FLAGGED)',
    nik: '3204111509910009',
    simNumber: '910915120011',
    simExpiry: '2025-09-15',
    phone: '+62 821-4433-2211',
    email: 'donifirmansyah.pro@mail.com',
    address: 'Jl. Rancaekek Raya Blok C4 No. 12',
    city: 'Kabupaten Bandung',
    emergencyContactName: 'Nomor Tidak Aktif',
    emergencyContactPhone: '+62 821-0000-0000',
    emergencyContactRelation: 'Teman',
    kycStatus: 'blacklisted',
    riskScore: 94,
    fraudRiskLevel: 'CRITICAL',
    blacklistReason: 'INDIKASI FRAUD & PENGGELAPAN: KTP terdeteksi duplikasi NIK di database Asperindo & riwayat mencoba mencopot modul GPS telematika pada unit rental kompetitor.',
    totalBookings: 1,
    completedBookings: 0,
    cancelledBookings: 1,
    totalSpentIdr: 0,
    customerRating: 1.0,
    notes: 'DILARANG KERAS MENYEWAKAN KENDARAAN APAPUN (AUTO REJECT SYSTEM).',
    ktpPhotoUploaded: true,
    simPhotoUploaded: true,
    selfieWithKtpUploaded: true
  }
];

// Mock Initial Active Bookings
const INITIAL_BOOKINGS: RentalBooking[] = [
  {
    id: 'rc-book-001',
    bookingNumber: 'RC-202608-001',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soetta (CGK)',
    customerId: 'cust-01',
    customerName: 'PT Telkom Akses Indonesia',
    customerPhone: '+62 811-9876-5432',
    customerType: 'corporate',
    customerRiskScore: 8,
    customerKycStatus: 'verified',
    vehicleId: 'rent-veh-01',
    vehiclePlate: 'B 1982 UTX',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Innova Zenix 2.0 Q Hybrid TSS',
    vehicleCategory: 'mpv',
    packageType: 'with_driver',
    driverId: 'drv-01',
    driverName: 'Bambang Supriyanto',
    driverPhone: '+62 812-7788-9900',
    startDateTime: '2026-08-19T08:00:00.000Z',
    endDateTime: '2026-08-22T20:00:00.000Z',
    durationDays: 4,
    pickupLocationType: 'hotel',
    pickupAddress: 'Hotel Shangri-La Jakarta, Sudirman',
    returnLocationType: 'airport',
    returnAddress: 'Terminal 3 Ultimate Bandara Soetta',
    financials: {
      baseRatePerDay: 850000,
      durationDays: 4,
      rentalSubtotal: 3400000,
      driverFeePerDay: 300000,
      totalDriverFee: 1200000,
      deliveryPickupFee: 150000,
      addonsTotal: 100000, // E-toll card preloaded
      discountAmount: 200000,
      subtotal: 4650000,
      taxPpn11: 511500,
      grandTotal: 5161500,
      securityDepositAmount: 1500000,
      paidAmount: 5161500,
      remainingAmount: 0,
      paymentStatus: 'fully_paid',
      depositStatus: 'held'
    },
    addons: [
      { id: 'add-1', name: 'E-Toll Mandiri Preloaded Rp 100.000', pricePerDay: 25000, selected: true },
      { id: 'add-2', name: 'Comprehensive Collision Damage Waiver (CDW)', pricePerDay: 75000, selected: false }
    ],
    status: 'active',
    checkOutInspection: {
      id: 'insp-out-001',
      bookingId: 'rc-book-001',
      vehicleId: 'rent-veh-01',
      type: 'check_out',
      timestamp: '2026-08-19T07:45:00.000Z',
      inspectorId: 'staff-01',
      inspectorName: 'Fajar Nugraha (Dispatcher Fleet)',
      odometerReadingKm: 18320,
      fuelLevelPercent: 100,
      exteriorCleanliness: 'clean',
      interiorCleanliness: 'clean',
      checklist: {
        stnkOriginal: true,
        spareTire: true,
        jackAndTools: true,
        firstAidKit: true,
        warningTriangle: true,
        keyChain: true,
        dashcamActive: true,
        acCold: true,
        headlightsWorking: true,
        taillightsWorking: true,
        infotainmentWorking: true,
        carMatsComplete: true
      },
      damagePins: [
        {
          id: 'dmg-01',
          xPercent: 15,
          yPercent: 42,
          view: 'front',
          partName: 'Bumper Depan Sisi Kiri Bawah',
          damageType: 'scratch',
          severity: 'minor',
          estimatedCost: 250000,
          notes: 'Baret halus pemakaian sebelumnya (< 3 cm)'
        }
      ],
      inspectorNotes: 'Kondisi kendaraan sangat bersih dan wangi. AC dingin maksimal. Bahan bakar Pertamax full.',
      customerSignatureName: 'Budi Santoso (PIC Lapangan Telkom Akses)',
      customerSignatureTimestamp: '2026-08-19T07:55:00.000Z',
      hasCustomerSigned: true
    },
    alerts: [],
    notes: 'Kunjungan direksi Telkom Akses agenda site survey 5G Smart City Jakarta & Tangerang.',
    createdAt: '2026-08-17T10:30:00.000Z',
    updatedAt: '2026-08-19T08:00:00.000Z'
  },
  {
    id: 'rc-book-002',
    bookingNumber: 'RC-202608-002',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soetta (CGK)',
    customerId: 'cust-02',
    customerName: 'dr. Hendra Kusuma, Sp.OT',
    customerPhone: '+62 818-0922-1133',
    customerType: 'individual',
    customerRiskScore: 12,
    customerKycStatus: 'verified',
    vehicleId: 'rent-veh-02',
    vehiclePlate: 'B 2201 ZLX',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Alphard 2.5 HEV Executive Lounge',
    vehicleCategory: 'luxury',
    packageType: 'with_driver',
    driverId: 'drv-02',
    driverName: 'Agus Purnomo (VIP Chauffeur)',
    driverPhone: '+62 813-2233-4455',
    startDateTime: '2026-08-20T06:00:00.000Z',
    endDateTime: '2026-08-21T22:00:00.000Z',
    durationDays: 2,
    pickupLocationType: 'customer_address',
    pickupAddress: 'Jl. Taman Patra V No. 18, Kuningan Timur, Jakarta Selatan',
    returnLocationType: 'customer_address',
    returnAddress: 'Jl. Taman Patra V No. 18, Kuningan Timur, Jakarta Selatan',
    financials: {
      baseRatePerDay: 2800000,
      durationDays: 2,
      rentalSubtotal: 5600000,
      driverFeePerDay: 500000,
      totalDriverFee: 1000000,
      deliveryPickupFee: 0,
      addonsTotal: 300000, // VIP bottled water + CDW
      discountAmount: 0,
      subtotal: 6900000,
      taxPpn11: 759000,
      grandTotal: 7659000,
      securityDepositAmount: 3000000,
      paidAmount: 7659000,
      remainingAmount: 0,
      paymentStatus: 'fully_paid',
      depositStatus: 'held'
    },
    addons: [
      { id: 'add-cdw', name: 'Super CDW Zero Excess Liability', pricePerDay: 150000, selected: true }
    ],
    status: 'active',
    checkOutInspection: {
      id: 'insp-out-002',
      bookingId: 'rc-book-002',
      vehicleId: 'rent-veh-02',
      type: 'check_out',
      timestamp: '2026-08-20T05:30:00.000Z',
      inspectorId: 'staff-02',
      inspectorName: 'Agus Purnomo',
      odometerReadingKm: 12050,
      fuelLevelPercent: 100,
      exteriorCleanliness: 'clean',
      interiorCleanliness: 'clean',
      checklist: {
        stnkOriginal: true,
        spareTire: true,
        jackAndTools: true,
        firstAidKit: true,
        warningTriangle: true,
        keyChain: true,
        dashcamActive: true,
        acCold: true,
        headlightsWorking: true,
        taillightsWorking: true,
        infotainmentWorking: true,
        carMatsComplete: true
      },
      damagePins: [],
      inspectorNotes: 'Unit Alphard Executive Lounge 100% mulus tanpa baret/dent. Kursi pijat dan TV berfungsi sempurna.',
      customerSignatureName: 'dr. Hendra Kusuma',
      customerSignatureTimestamp: '2026-08-20T05:50:00.000Z',
      hasCustomerSigned: true
    },
    alerts: [],
    notes: 'Antar jemput Simposium Dokter Bedah Ortopedi Nasional di Hotel Indonesia Kempinski.',
    createdAt: '2026-08-18T14:00:00.000Z',
    updatedAt: '2026-08-20T06:00:00.000Z'
  },
  {
    id: 'rc-book-003',
    bookingNumber: 'RC-202608-003',
    tenantId: 'tenant-1',
    branchId: 'branch-jkt-1',
    branchName: 'Depot Pusat Bandara Soetta (CGK)',
    customerId: 'cust-03',
    customerName: 'Reza Pratama Putra',
    customerPhone: '+62 857-1920-8811',
    customerType: 'individual',
    customerRiskScore: 58,
    customerKycStatus: 'pending',
    vehicleId: 'rent-veh-04',
    vehiclePlate: 'B 1477 FOQ',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Fortuner 2.8 GR Sport 4x4',
    vehicleCategory: 'suv',
    packageType: 'self_drive', // Lepas Kunci
    startDateTime: '2026-08-18T10:00:00.000Z',
    endDateTime: '2026-08-20T10:00:00.000Z', // Jadwal kembali 4 jam lalu!
    durationDays: 2,
    pickupLocationType: 'pool_hq',
    pickupAddress: 'Pool Bandara Soekarno-Hatta Jakarta',
    returnLocationType: 'pool_hq',
    returnAddress: 'Pool Bandara Soekarno-Hatta Jakarta',
    financials: {
      baseRatePerDay: 1250000,
      durationDays: 2,
      rentalSubtotal: 2500000,
      driverFeePerDay: 0,
      totalDriverFee: 0,
      deliveryPickupFee: 0,
      addonsTotal: 0,
      discountAmount: 0,
      subtotal: 2500000,
      taxPpn11: 275000,
      grandTotal: 2775000,
      securityDepositAmount: 2000000,
      paidAmount: 2775000,
      remainingAmount: 0,
      paymentStatus: 'fully_paid',
      depositStatus: 'held'
    },
    addons: [],
    status: 'overdue',
    checkOutInspection: {
      id: 'insp-out-003',
      bookingId: 'rc-book-003',
      vehicleId: 'rent-veh-04',
      type: 'check_out',
      timestamp: '2026-08-18T09:30:00.000Z',
      inspectorId: 'staff-01',
      inspectorName: 'Fajar Nugraha',
      odometerReadingKm: 37800,
      fuelLevelPercent: 100,
      exteriorCleanliness: 'clean',
      interiorCleanliness: 'clean',
      checklist: {
        stnkOriginal: true,
        spareTire: true,
        jackAndTools: true,
        firstAidKit: true,
        warningTriangle: true,
        keyChain: true,
        dashcamActive: true,
        acCold: true,
        headlightsWorking: true,
        taillightsWorking: true,
        infotainmentWorking: true,
        carMatsComplete: true
      },
      damagePins: [],
      inspectorNotes: 'Lepas kunci dengan jaminan KTP asli & deposit Rp 2.000.000. Batas pemakaian Pulau Jawa.',
      customerSignatureName: 'Reza Pratama Putra',
      customerSignatureTimestamp: '2026-08-18T09:50:00.000Z',
      hasCustomerSigned: true
    },
    alerts: [
      {
        id: 'alt-001',
        bookingId: 'rc-book-003',
        vehicleId: 'rent-veh-04',
        plateNumber: 'B 1477 FOQ',
        timestamp: '2026-08-20T10:15:00.000Z',
        type: 'LATE_RETURN_PREDICTED',
        severity: 'warning',
        title: 'Keterlambatan Pengembalian (Overdue > 4 Jam)',
        message: 'Kendaraan belum diserahkan kembali. Posisi GPS saat ini masih berada di Jl. Dago Atas Bandung. Estimasi denda overtime Rp 500.000.',
        location: {
          lat: -6.9175,
          lng: 107.6191,
          address: 'Jl. Dago Atas No. 118, Bandung'
        },
        resolved: false
      }
    ],
    notes: 'PERINGATAN: Penyewa belum konfirmasi perpanjangan sewa. Tim Customer Care sedang menghubungi nomor darurat.',
    createdAt: '2026-08-17T11:00:00.000Z',
    updatedAt: '2026-08-20T10:15:00.000Z'
  }
];

class RentCarService {
  private vehicles: RentalVehicle[] = [...INITIAL_RENTAL_VEHICLES];
  private customers: RentalCustomer[] = [...INITIAL_CUSTOMERS];
  private bookings: RentalBooking[] = [...INITIAL_BOOKINGS];
  private listeners: Array<() => void> = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // ==========================================
  // VEHICLE FLEET MANAGEMENT
  // ==========================================
  public getVehicles(filter?: { category?: string; status?: string; branchId?: string; search?: string }): RentalVehicle[] {
    let result = [...this.vehicles];

    if (filter?.category && filter.category !== 'all') {
      result = result.filter((v) => v.category === filter.category);
    }
    if (filter?.status && filter.status !== 'all') {
      result = result.filter((v) => v.status === filter.status);
    }
    if (filter?.branchId && filter.branchId !== 'all') {
      result = result.filter((v) => v.branchId === filter.branchId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.branchName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getVehicleById(id: string): RentalVehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  public addVehicle(vehicleData: Omit<RentalVehicle, 'id' | 'totalTripsCount'>): RentalVehicle {
    const newVehicle: RentalVehicle = {
      ...vehicleData,
      id: `rent-veh-${Date.now().toString(36)}`,
      totalTripsCount: 0
    };
    this.vehicles = [newVehicle, ...this.vehicles];
    this.notify();
    return newVehicle;
  }

  public updateVehicle(id: string, updates: Partial<RentalVehicle>): RentalVehicle | undefined {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return undefined;

    this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
    this.notify();
    return this.vehicles[idx];
  }

  /**
   * Remote Starter Kill / Engine Immobilizer
   * Security command to lock/unlock vehicle ignition via IoT Telematics Gateway
   */
  public toggleRemoteImmobilizer(
    vehicleId: string, 
    requestedStatus: 'locked' | 'unlocked', 
    authorizedBy: string, 
    reason: string
  ): { success: boolean; message: string } {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle) return { success: false, message: 'Kendaraan rental tidak ditemukan.' };

    // Update immobilizer status
    vehicle.remoteImmobilizerStatus = requestedStatus;

    // If locked, create high severity audit alert
    if (requestedStatus === 'locked') {
      const alert: RentalTelemetryAlert = {
        id: `alt-immob-${Date.now()}`,
        bookingId: vehicle.currentBookingId || 'N/A',
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        timestamp: new Date().toISOString(),
        type: 'IMMOBILIZER_ACTIVATED',
        severity: 'critical',
        title: `Remote Starter Kill Diaktifkan (${vehicle.plateNumber})`,
        message: `Mesin kendaraan dimatikan secara remote oleh ${authorizedBy}. Alasan: ${reason}`,
        location: {
          lat: vehicle.location.lat,
          lng: vehicle.location.lng,
          address: vehicle.location.address
        },
        resolved: false
      };
      
      // Add alert to active booking if exists
      if (vehicle.currentBookingId) {
        const booking = this.getBookingById(vehicle.currentBookingId);
        if (booking) {
          booking.alerts = [alert, ...booking.alerts];
        }
      }
    }

    this.notify();
    return {
      success: true,
      message: requestedStatus === 'locked'
        ? `Perintah Engine Cut-Off terkirim ke GPS IMEI ${vehicle.gpsDeviceId}. Mesin unit ${vehicle.plateNumber} telah terkunci aman.`
        : `Perintah Starter Unlock terkirim. Mesin unit ${vehicle.plateNumber} dapat dinyalakan kembali.`
    };
  }

  // ==========================================
  // CUSTOMER & KYC ANTI-FRAUD
  // ==========================================
  public getCustomers(filter?: { type?: string; kycStatus?: string; search?: string }): RentalCustomer[] {
    let result = [...this.customers];

    if (filter?.type && filter.type !== 'all') {
      result = result.filter((c) => c.type === filter.type);
    }
    if (filter?.kycStatus && filter.kycStatus !== 'all') {
      result = result.filter((c) => c.kycStatus === filter.kycStatus);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nik.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.companyName && c.companyName.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getCustomerById(id: string): RentalCustomer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  public addCustomer(customerData: Omit<RentalCustomer, 'id' | 'totalBookings' | 'completedBookings' | 'cancelledBookings' | 'totalSpentIdr'>): RentalCustomer {
    const newCustomer: RentalCustomer = {
      ...customerData,
      id: `cust-${Date.now().toString(36)}`,
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalSpentIdr: 0
    };
    this.customers = [newCustomer, ...this.customers];
    this.notify();
    return newCustomer;
  }

  public updateCustomerKyc(
    customerId: string, 
    kycStatus: 'verified' | 'pending' | 'rejected' | 'blacklisted', 
    riskScore: number, 
    notes?: string,
    blacklistReason?: string
  ): RentalCustomer | undefined {
    const customer = this.getCustomerById(customerId);
    if (!customer) return undefined;

    customer.kycStatus = kycStatus;
    customer.riskScore = riskScore;
    customer.fraudRiskLevel = riskScore > 70 ? 'CRITICAL' : riskScore > 40 ? 'HIGH' : riskScore > 20 ? 'MEDIUM' : 'LOW';
    if (notes) customer.notes = notes;
    if (blacklistReason) customer.blacklistReason = blacklistReason;
    if (kycStatus === 'verified') customer.kycVerificationDate = new Date().toISOString();

    this.notify();
    return customer;
  }

  // ==========================================
  // BOOKINGS & RESERVATION
  // ==========================================
  public getBookings(filter?: { status?: string; search?: string; customerId?: string }): RentalBooking[] {
    let result = [...this.bookings];

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((b) => b.status === filter.status);
    }
    if (filter?.customerId) {
      result = result.filter((b) => b.customerId === filter.customerId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.vehiclePlate.toLowerCase().includes(q) ||
          b.vehicleModel.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getBookingById(id: string): RentalBooking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  public createBooking(bookingInput: {
    customerId: string;
    vehicleId: string;
    packageType: 'self_drive' | 'with_driver' | 'all_in';
    driverId?: string;
    driverName?: string;
    driverPhone?: string;
    startDateTime: string;
    endDateTime: string;
    durationDays: number;
    pickupLocationType: 'pool_hq' | 'airport' | 'hotel' | 'customer_address';
    pickupAddress: string;
    returnLocationType: 'pool_hq' | 'airport' | 'hotel' | 'customer_address';
    returnAddress: string;
    addons: { id: string; name: string; pricePerDay: number; selected: boolean }[];
    discountAmount?: number;
    notes?: string;
  }): { success: boolean; booking?: RentalBooking; message: string } {
    const customer = this.getCustomerById(bookingInput.customerId);
    if (!customer) return { success: false, message: 'Pelanggan tidak ditemukan.' };

    if (customer.kycStatus === 'blacklisted') {
      return { 
        success: false, 
        message: `PERINGATAN KEAMANAN: Pelanggan ${customer.name} berada dalam daftar BLACKLIST: "${customer.blacklistReason}". Reservasi ditolak secara otomatis.` 
      };
    }

    const vehicle = this.getVehicleById(bookingInput.vehicleId);
    if (!vehicle) return { success: false, message: 'Kendaraan tidak ditemukan.' };

    if (vehicle.status !== 'available') {
      return { success: false, message: `Kendaraan ${vehicle.plateNumber} saat ini berstatus ${vehicle.status} dan tidak dapat dibooking.` };
    }

    // Calculate Financials
    const baseRatePerDay = vehicle.pricing.dailyRate;
    const durationDays = Math.max(1, bookingInput.durationDays);
    const rentalSubtotal = baseRatePerDay * durationDays;

    let driverFeePerDay = 0;
    if (bookingInput.packageType === 'with_driver') {
      driverFeePerDay = (vehicle.pricing.withDriverDailyRate || (baseRatePerDay + 300000)) - baseRatePerDay;
    } else if (bookingInput.packageType === 'all_in') {
      driverFeePerDay = (vehicle.pricing.allInDailyRate || (baseRatePerDay + 600000)) - baseRatePerDay;
    }

    const totalDriverFee = driverFeePerDay * durationDays;
    const deliveryPickupFee = bookingInput.pickupLocationType === 'pool_hq' ? 0 : 150000;
    
    const addonsTotal = bookingInput.addons
      .filter((a) => a.selected)
      .reduce((sum, a) => sum + (a.pricePerDay * durationDays), 0);

    const discountAmount = bookingInput.discountAmount || 0;
    const subtotal = rentalSubtotal + totalDriverFee + deliveryPickupFee + addonsTotal - discountAmount;
    const taxPpn11 = Math.round(subtotal * 0.11);
    const grandTotal = subtotal + taxPpn11;
    const securityDepositAmount = vehicle.pricing.depositAmount;

    const count = this.bookings.length + 1;
    const bookingNumber = `RC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;

    const newBooking: RentalBooking = {
      id: `rc-book-${Date.now().toString(36)}`,
      bookingNumber,
      tenantId: 'tenant-1',
      branchId: vehicle.branchId,
      branchName: vehicle.branchName,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerType: customer.type,
      customerRiskScore: customer.riskScore,
      customerKycStatus: customer.kycStatus,
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plateNumber,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehicleCategory: vehicle.category,
      packageType: bookingInput.packageType,
      driverId: bookingInput.driverId,
      driverName: bookingInput.driverName,
      driverPhone: bookingInput.driverPhone,
      startDateTime: bookingInput.startDateTime,
      endDateTime: bookingInput.endDateTime,
      durationDays,
      pickupLocationType: bookingInput.pickupLocationType,
      pickupAddress: bookingInput.pickupAddress,
      returnLocationType: bookingInput.returnLocationType,
      returnAddress: bookingInput.returnAddress,
      financials: {
        baseRatePerDay,
        durationDays,
        rentalSubtotal,
        driverFeePerDay,
        totalDriverFee,
        deliveryPickupFee,
        addonsTotal,
        discountAmount,
        subtotal,
        taxPpn11,
        grandTotal,
        securityDepositAmount,
        paidAmount: grandTotal, // Assume full payment upon confirmation
        remainingAmount: 0,
        paymentStatus: 'fully_paid',
        depositStatus: 'held'
      },
      addons: bookingInput.addons,
      status: 'confirmed',
      alerts: [],
      notes: bookingInput.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update vehicle status
    vehicle.status = 'reserved';
    vehicle.currentBookingId = newBooking.id;

    // Update customer stats
    customer.totalBookings += 1;
    customer.totalSpentIdr += grandTotal;

    this.bookings = [newBooking, ...this.bookings];
    this.notify();

    return {
      success: true,
      booking: newBooking,
      message: `Booking ${bookingNumber} berhasil dibuat untuk ${customer.name} (Unit: ${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}).`
    };
  }

  public updateBookingStatus(bookingId: string, status: BookingStatus): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking) return false;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    const vehicle = this.getVehicleById(booking.vehicleId);
    if (vehicle) {
      if (status === 'active') {
        vehicle.status = 'rented';
        vehicle.currentBookingId = booking.id;
      } else if (status === 'overdue') {
        vehicle.status = 'overdue';
      } else if (status === 'completed' || status === 'cancelled') {
        vehicle.status = 'available';
        vehicle.currentBookingId = undefined;
      }
    }

    this.notify();
    return true;
  }

  // ==========================================
  // DIGITAL HANDOVER (CHECK-IN & CHECK-OUT)
  // ==========================================
  public processCheckOut(
    bookingId: string, 
    inspectionData: {
      inspectorName: string;
      odometerReadingKm: number;
      fuelLevelPercent: number;
      exteriorCleanliness: 'clean' | 'moderate' | 'dirty';
      interiorCleanliness: 'clean' | 'moderate' | 'dirty';
      checklist: HandoverInspection['checklist'];
      damagePins: DamagePin[];
      inspectorNotes?: string;
      customerSignatureName: string;
    }
  ): { success: boolean; message: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, message: 'Booking tidak ditemukan.' };

    const vehicle = this.getVehicleById(booking.vehicleId);
    if (!vehicle) return { success: false, message: 'Kendaraan tidak ditemukan.' };

    const checkOut: HandoverInspection = {
      id: `insp-out-${Date.now()}`,
      bookingId: booking.id,
      vehicleId: vehicle.id,
      type: 'check_out',
      timestamp: new Date().toISOString(),
      inspectorId: 'staff-current',
      inspectorName: inspectionData.inspectorName,
      odometerReadingKm: inspectionData.odometerReadingKm,
      fuelLevelPercent: inspectionData.fuelLevelPercent,
      exteriorCleanliness: inspectionData.exteriorCleanliness,
      interiorCleanliness: inspectionData.interiorCleanliness,
      checklist: inspectionData.checklist,
      damagePins: inspectionData.damagePins,
      inspectorNotes: inspectionData.inspectorNotes,
      customerSignatureName: inspectionData.customerSignatureName,
      customerSignatureTimestamp: new Date().toISOString(),
      hasCustomerSigned: true
    };

    booking.checkOutInspection = checkOut;
    booking.status = 'active';
    booking.updatedAt = new Date().toISOString();

    vehicle.status = 'rented';
    vehicle.currentOdometerKm = inspectionData.odometerReadingKm;
    vehicle.fuelLevelPercent = inspectionData.fuelLevelPercent;

    this.notify();
    return {
      success: true,
      message: `Serah terima kendaraan (Check-Out) untuk booking ${booking.bookingNumber} berhasil dicatat. Status unit kini AKTIF SEWA.`
    };
  }

  public processCheckIn(
    bookingId: string, 
    inspectionData: {
      inspectorName: string;
      odometerReadingKm: number;
      fuelLevelPercent: number;
      exteriorCleanliness: 'clean' | 'moderate' | 'dirty';
      interiorCleanliness: 'clean' | 'moderate' | 'dirty';
      checklist: HandoverInspection['checklist'];
      damagePins: DamagePin[];
      inspectorNotes?: string;
      customerSignatureName: string;
      etleTrafficFines?: number;
      customCleaningFee?: number;
    }
  ): { success: boolean; message: string; settlement?: HandoverInspection['settlementSummary'] } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, message: 'Booking tidak ditemukan.' };

    const vehicle = this.getVehicleById(booking.vehicleId);
    if (!vehicle) return { success: false, message: 'Kendaraan tidak ditemukan.' };

    const checkOut = booking.checkOutInspection;
    const initialOdo = checkOut ? checkOut.odometerReadingKm : vehicle.currentOdometerKm;
    const initialFuel = checkOut ? checkOut.fuelLevelPercent : 100;
    const checkOutPins = checkOut ? checkOut.damagePins : [];

    // Calculate overdue
    const scheduledEnd = new Date(booking.endDateTime).getTime();
    const actualNow = new Date().getTime();
    const overdueMs = Math.max(0, actualNow - scheduledEnd);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueFee = overdueHours * (vehicle.pricing.overtimeHourlyRate || 75000);

    // Calculate fuel shortage fee (e.g. Rp 15.000 per Liter or % difference)
    const fuelShortagePercent = Math.max(0, initialFuel - inspectionData.fuelLevelPercent);
    const fuelCapacity = 55; // average liters
    const missingLiters = (fuelShortagePercent / 100) * fuelCapacity;
    const fuelShortageFee = Math.round(missingLiters * 16500); // Pertamax standard

    // Calculate new damage costs
    // Compare new pins that were not in checkout
    const newDamagePins = inspectionData.damagePins.filter((pin) => !checkOutPins.some((orig) => orig.id === pin.id));
    const newDamageCost = newDamagePins.reduce((sum, p) => sum + p.estimatedCost, 0);

    // Cleaning fee if dirty
    const cleaningFee = inspectionData.customCleaningFee ?? (inspectionData.interiorCleanliness === 'dirty' ? 100000 : 0);
    const etleTrafficFines = inspectionData.etleTrafficFines || 0;

    const initialDeposit = booking.financials.securityDepositAmount;
    const totalDeductions = overdueFee + fuelShortageFee + newDamageCost + cleaningFee + etleTrafficFines;
    
    const finalRefundAmount = Math.max(0, initialDeposit - totalDeductions);
    const customerMustPayExtra = totalDeductions > initialDeposit ? totalDeductions - initialDeposit : 0;

    const settlementSummary = {
      overdueHours,
      overdueFee,
      fuelShortagePercent,
      fuelShortageFee,
      newDamageCost,
      cleaningFee,
      etleTrafficFines,
      totalDeductions,
      initialDeposit,
      finalRefundAmount,
      customerMustPayExtra
    };

    const checkIn: HandoverInspection = {
      id: `insp-in-${Date.now()}`,
      bookingId: booking.id,
      vehicleId: vehicle.id,
      type: 'check_in',
      timestamp: new Date().toISOString(),
      inspectorId: 'staff-current',
      inspectorName: inspectionData.inspectorName,
      odometerReadingKm: inspectionData.odometerReadingKm,
      fuelLevelPercent: inspectionData.fuelLevelPercent,
      exteriorCleanliness: inspectionData.exteriorCleanliness,
      interiorCleanliness: inspectionData.interiorCleanliness,
      checklist: inspectionData.checklist,
      damagePins: inspectionData.damagePins,
      inspectorNotes: inspectionData.inspectorNotes,
      customerSignatureName: inspectionData.customerSignatureName,
      customerSignatureTimestamp: new Date().toISOString(),
      hasCustomerSigned: true,
      settlementSummary
    };

    booking.checkInInspection = checkIn;
    booking.actualReturnDateTime = new Date().toISOString();
    booking.status = 'completed';
    booking.financials.depositStatus = finalRefundAmount === initialDeposit 
      ? 'refunded' 
      : finalRefundAmount > 0 
        ? 'partially_deducted' 
        : 'fully_deducted';
    booking.financials.depositRefundedAmount = finalRefundAmount;
    booking.financials.depositDeductionTotal = totalDeductions;
    booking.updatedAt = new Date().toISOString();

    // Update vehicle
    vehicle.status = inspectionData.exteriorCleanliness === 'dirty' || inspectionData.interiorCleanliness === 'dirty' 
      ? 'cleaning' 
      : 'available';
    vehicle.currentOdometerKm = inspectionData.odometerReadingKm;
    vehicle.fuelLevelPercent = inspectionData.fuelLevelPercent;
    vehicle.currentBookingId = undefined;
    vehicle.totalTripsCount += 1;

    // Update customer completed stats
    const customer = this.getCustomerById(booking.customerId);
    if (customer) {
      customer.completedBookings += 1;
    }

    this.notify();
    return {
      success: true,
      message: `Pengembalian kendaraan (Check-In) selesai. Deposit Rp ${initialDeposit.toLocaleString('id-ID')} diselesaikan (Pengembalian ke Customer: Rp ${finalRefundAmount.toLocaleString('id-ID')}).`,
      settlement: settlementSummary
    };
  }

  // ==========================================
  // TELEMETRICS & ANTI-THEFT ALERTS
  // ==========================================
  public getTelemetryAlerts(): RentalTelemetryAlert[] {
    const allAlerts: RentalTelemetryAlert[] = [];
    this.bookings.forEach((b) => {
      if (b.alerts && b.alerts.length > 0) {
        allAlerts.push(...b.alerts);
      }
    });
    return allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public resolveAlert(alertId: string, resolvedBy: string): boolean {
    let found = false;
    this.bookings.forEach((b) => {
      const target = b.alerts?.find((a) => a.id === alertId);
      if (target) {
        target.resolved = true;
        target.resolvedAt = new Date().toISOString();
        target.resolvedBy = resolvedBy;
        found = true;
      }
    });

    if (found) {
      this.notify();
    }
    return found;
  }

  // ==========================================
  // KPIS & FINANCIAL ANALYTICS
  // ==========================================
  public getRentalKPIs(): RentalFleetKPIs {
    const totalFleet = this.vehicles.length;
    const availableFleet = this.vehicles.filter((v) => v.status === 'available').length;
    const rentedFleet = this.vehicles.filter((v) => v.status === 'rented').length;
    const reservedFleet = this.vehicles.filter((v) => v.status === 'reserved').length;
    const maintenanceFleet = this.vehicles.filter((v) => v.status === 'maintenance').length;
    const cleaningFleet = this.vehicles.filter((v) => v.status === 'cleaning').length;
    const overdueReturns = this.vehicles.filter((v) => v.status === 'overdue').length;

    const utilizationRate = totalFleet > 0 ? Math.round(((rentedFleet + overdueReturns) / totalFleet) * 100) : 0;

    const totalActiveRevenueIdr = this.bookings
      .filter((b) => b.status === 'active' || b.status === 'confirmed' || b.status === 'overdue')
      .reduce((sum, b) => sum + b.financials.grandTotal, 0);

    const totalMonthlyRevenueIdr = this.bookings.reduce((sum, b) => sum + b.financials.grandTotal, 0);

    const revPavIdr = totalFleet > 0 ? Math.round(totalMonthlyRevenueIdr / totalFleet) : 0;

    const securityDepositsHeldIdr = this.bookings
      .filter((b) => b.financials.depositStatus === 'held')
      .reduce((sum, b) => sum + b.financials.securityDepositAmount, 0);

    const alerts = this.getTelemetryAlerts();
    const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
    const criticalSecurityAlertsCount = alerts.filter((a) => !a.resolved && a.severity === 'critical').length;

    return {
      totalFleet,
      availableFleet,
      rentedFleet,
      reservedFleet,
      maintenanceFleet,
      cleaningFleet,
      overdueReturns,
      fleetUtilizationRate: utilizationRate,
      totalActiveRevenueIdr,
      totalMonthlyRevenueIdr,
      revPavIdr,
      securityDepositsHeldIdr,
      activeAlertsCount,
      criticalSecurityAlertsCount
    };
  }

  // Alias helper methods
  public getKPIs(): RentalFleetKPIs {
    return this.getRentalKPIs();
  }

  public getAlerts(): RentalTelemetryAlert[] {
    return this.getTelemetryAlerts();
  }

  public toggleImmobilizer(vehicleId: string, requestedStatus?: 'locked' | 'unlocked' | 'lock' | 'unlock', reason: string = 'Otorisasi Keamanan Operasional', authorizedBy: string = 'Security Supervisor') {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle) return { success: false, message: 'Kendaraan tidak ditemukan.' };
    let nextStatus: 'locked' | 'unlocked' = 'locked';
    if (requestedStatus === 'lock' || requestedStatus === 'locked') {
      nextStatus = 'locked';
    } else if (requestedStatus === 'unlock' || requestedStatus === 'unlocked') {
      nextStatus = 'unlocked';
    } else {
      nextStatus = vehicle.remoteImmobilizerStatus === 'locked' ? 'unlocked' : 'locked';
    }
    return this.toggleRemoteImmobilizer(vehicleId, nextStatus, authorizedBy, reason);
  }

  public toggleCustomerBlacklist(customerId: string, isBlacklisted: boolean, reason?: string) {
    const customer = this.getCustomerById(customerId);
    if (!customer) return undefined;
    const newStatus = isBlacklisted ? 'blacklisted' : 'verified';
    const riskScore = isBlacklisted ? 95 : 15;
    return this.updateCustomerKyc(customerId, newStatus, riskScore, undefined, reason);
  }

  // ==========================================
  // CONTRACT MANAGEMENT
  // ==========================================
  private contracts: RentalContract[] = [
    {
      id: 'ctr-1',
      contractNumber: 'RC-CTR-202608-001',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-001',
      bookingNumber: 'RC-202608-0012',
      customerId: 'cust-1',
      customerName: 'Bambang Soediro',
      vehicleId: 'rc-veh-001',
      vehiclePlate: 'B 1429 SSA',
      vehicleModel: 'Toyota Innova Zenix 2.0 Q Hybrid TSS Modellista',
      startDate: '2026-08-18T08:00:00.000Z',
      endDate: '2026-08-21T08:00:00.000Z',
      totalDays: 3,
      packageType: 'self_drive',
      baseAmount: 2850000,
      depositAmount: 1500000,
      mileageAllowanceKm: 300,
      excessMileageFeePerKm: 2500,
      fuelPolicy: 'same_to_same',
      cancellationPolicy: 'Pembatalan H-1 dikenakan biaya administrasi 25%. Pembatalan pada hari-H hangus 50%.',
      termsAndConditions: [
        'Penyewa wajib memiliki e-KTP dan SIM A asli yang masih berlaku.',
        'Kendaraan hanya boleh beroperasi di dalam zona operasional Jawa & Bali.',
        'Dilarang memindahtangankan atau menggadaikan unit rental.',
        'Dilarang membawa muatan terlarang, narkoba, atau barang berbahaya.',
        'Segala denda tilang elektronik (ETLE) selama masa sewa menjadi beban penyewa.'
      ],
      status: 'active',
      customerSignedAt: '2026-08-18T07:45:00.000Z',
      staffSignedAt: '2026-08-18T07:50:00.000Z',
      staffName: 'Hendrawan (Ops Fleet Manager)',
      createdAt: '2026-08-18T07:30:00.000Z'
    },
    {
      id: 'ctr-2',
      contractNumber: 'RC-CTR-202608-002',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-002',
      bookingNumber: 'RC-202608-0013',
      customerId: 'cust-2',
      customerName: 'PT Nusantara Megah Logistik (Corp)',
      vehicleId: 'rc-veh-003',
      vehiclePlate: 'B 1888 VVIP',
      vehicleModel: 'Toyota Alphard 2.5 HEV Executive Lounge',
      driverName: 'Joko Santoso (Driver Fleet-AI)',
      startDate: '2026-08-19T06:00:00.000Z',
      endDate: '2026-08-21T18:00:00.000Z',
      totalDays: 2,
      packageType: 'all_in',
      baseAmount: 7000000,
      depositAmount: 3000000,
      mileageAllowanceKm: 0,
      excessMileageFeePerKm: 0,
      fuelPolicy: 'full_to_full',
      cancellationPolicy: 'Corporate account billing under Master Service Agreement.',
      termsAndConditions: [
        'Layanan paket All-in mencakup Pengemudi Profesional, BBM Pertamax, dan Akses Tol.',
        'Durasi harian maksimal 14 jam per hari.',
        'Unit wajib kembali ke pool pusat setiap akhir shift malam.'
      ],
      status: 'active',
      customerSignedAt: '2026-08-19T05:30:00.000Z',
      staffSignedAt: '2026-08-19T05:40:00.000Z',
      staffName: 'Hendrawan (Ops Fleet Manager)',
      createdAt: '2026-08-19T05:00:00.000Z'
    }
  ];

  public getContracts(): RentalContract[] {
    return [...this.contracts];
  }

  public getContractById(id: string): RentalContract | undefined {
    return this.contracts.find((c) => c.id === id);
  }

  public createContract(contractData: Omit<RentalContract, 'id' | 'contractNumber' | 'createdAt'>): RentalContract {
    const newContract: RentalContract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      contractNumber: `RC-CTR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(this.contracts.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.contracts.unshift(newContract);
    this.notify();
    return newContract;
  }

  public signContract(contractId: string, type: 'customer' | 'staff', name: string): RentalContract | undefined {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) return undefined;
    if (type === 'customer') {
      contract.customerSignedAt = new Date().toISOString();
      contract.status = 'active';
    } else {
      contract.staffSignedAt = new Date().toISOString();
      contract.staffName = name;
    }
    this.notify();
    return contract;
  }

  // ==========================================
  // DAMAGE & INSPECTION CLAIMS MANAGEMENT
  // ==========================================
  private damageRecords: RentalDamageRecord[] = [
    {
      id: 'dmg-1',
      damageNumber: 'DMG-202608-001',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-003',
      vehicleId: 'rc-veh-002',
      vehiclePlate: 'B 2910 EVE',
      vehicleModel: 'Hyundai Ioniq 5 Signature Long Range AWD',
      customerId: 'cust-3',
      customerName: 'Kurniawan Prasetyo',
      inspectionType: 'post_rental',
      partName: 'Bumper Belakang Kiri',
      damageType: 'dent',
      severity: 'minor',
      description: 'Lecet dan penyok ringan saat mundur parkir di area sempit.',
      photoUrls: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'],
      estimatedRepairCostIdr: 450000,
      responsibility: 'customer',
      approvalStatus: 'charged',
      chargedToDeposit: true,
      reportedAt: '2026-08-19T14:30:00.000Z',
      resolvedAt: '2026-08-19T15:00:00.000Z'
    },
    {
      id: 'dmg-2',
      damageNumber: 'DMG-202608-002',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-001',
      vehicleId: 'rc-veh-001',
      vehiclePlate: 'B 1429 SSA',
      vehicleModel: 'Toyota Innova Zenix 2.0 Q Hybrid TSS Modellista',
      customerId: 'cust-1',
      customerName: 'Bambang Soediro',
      inspectionType: 'during_trip',
      partName: 'Kaca Spion Kanan',
      damageType: 'scratch',
      severity: 'minor',
      description: 'Goresan halus pada batok spion luar.',
      photoUrls: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'],
      estimatedRepairCostIdr: 250000,
      responsibility: 'customer',
      approvalStatus: 'under_review',
      chargedToDeposit: false,
      reportedAt: '2026-08-20T04:15:00.000Z'
    }
  ];

  public getDamages(): RentalDamageRecord[] {
    return [...this.damageRecords];
  }

  public reportDamage(data: Omit<RentalDamageRecord, 'id' | 'damageNumber' | 'reportedAt'>): RentalDamageRecord {
    const newDamage: RentalDamageRecord = {
      ...data,
      id: `dmg-${Date.now()}`,
      damageNumber: `DMG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(this.damageRecords.length + 1).padStart(3, '0')}`,
      reportedAt: new Date().toISOString()
    };
    this.damageRecords.unshift(newDamage);
    this.notify();
    return newDamage;
  }

  public updateDamageStatus(damageId: string, status: RentalDamageRecord['approvalStatus'], chargeToDeposit?: boolean): RentalDamageRecord | undefined {
    const dmg = this.damageRecords.find((d) => d.id === damageId);
    if (!dmg) return undefined;
    dmg.approvalStatus = status;
    if (chargeToDeposit !== undefined) dmg.chargedToDeposit = chargeToDeposit;
    if (status === 'charged' || status === 'closed' || status === 'repaired') {
      dmg.resolvedAt = new Date().toISOString();
    }
    this.notify();
    return dmg;
  }

  // ==========================================
  // RATE CARDS & PRICING ENGINE
  // ==========================================
  private rateCards: RentalRateCard[] = [
    {
      id: 'rate-1',
      tenantId: 'tenant-1',
      vehicleCategory: 'mpv',
      categoryName: 'Multi-Purpose Vehicle (MPV Family)',
      dailyRate: 950000,
      weeklyRate: 5900000,
      monthlyRate: 22000000,
      hourlyRate: 65000,
      overtimeHourlyRate: 75000,
      excessMileagePerKm: 2500,
      driverRatePerDay: 250000,
      allInRatePerDay: 1550000,
      depositRequired: 1500000,
      minDurationDays: 1,
      seasonType: 'regular',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      isActive: true
    },
    {
      id: 'rate-2',
      tenantId: 'tenant-1',
      vehicleCategory: 'luxury',
      categoryName: 'Luxury Executive & VVIP',
      dailyRate: 2800000,
      weeklyRate: 18000000,
      monthlyRate: 65000000,
      hourlyRate: 200000,
      overtimeHourlyRate: 250000,
      excessMileagePerKm: 5000,
      driverRatePerDay: 350000,
      allInRatePerDay: 3500000,
      depositRequired: 3000000,
      minDurationDays: 1,
      seasonType: 'regular',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      isActive: true
    },
    {
      id: 'rate-3',
      tenantId: 'tenant-1',
      vehicleCategory: 'ev',
      categoryName: 'Electric Vehicle (EV Eco Premium)',
      dailyRate: 1200000,
      weeklyRate: 7500000,
      monthlyRate: 28000000,
      hourlyRate: 85000,
      overtimeHourlyRate: 100000,
      excessMileagePerKm: 3000,
      driverRatePerDay: 250000,
      allInRatePerDay: 1800000,
      depositRequired: 2000000,
      minDurationDays: 1,
      seasonType: 'regular',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      isActive: true
    },
    {
      id: 'rate-4',
      tenantId: 'tenant-1',
      vehicleCategory: 'suv',
      categoryName: 'Sport Utility Vehicle (SUV Tough)',
      dailyRate: 1100000,
      weeklyRate: 6900000,
      monthlyRate: 25000000,
      hourlyRate: 80000,
      overtimeHourlyRate: 90000,
      excessMileagePerKm: 3000,
      driverRatePerDay: 250000,
      allInRatePerDay: 1750000,
      depositRequired: 1500000,
      minDurationDays: 1,
      seasonType: 'regular',
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      isActive: true
    }
  ];

  public getRateCards(): RentalRateCard[] {
    return [...this.rateCards];
  }

  public updateRateCard(rateCardId: string, updates: Partial<RentalRateCard>): RentalRateCard | undefined {
    const index = this.rateCards.findIndex((r) => r.id === rateCardId);
    if (index === -1) return undefined;
    this.rateCards[index] = { ...this.rateCards[index], ...updates };
    this.notify();
    return this.rateCards[index];
  }

  // ==========================================
  // INVOICING & PAYMENT SETTLEMENT
  // ==========================================
  private invoices: RentalInvoice[] = [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-RC-2026-0041',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-001',
      bookingNumber: 'RC-202608-0012',
      contractNumber: 'RC-CTR-202608-001',
      customerId: 'cust-1',
      customerName: 'Bambang Soediro',
      customerPhone: '081234567890',
      customerAddress: 'Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan',
      vehiclePlate: 'B 1429 SSA',
      vehicleModel: 'Toyota Innova Zenix 2.0 Q Hybrid TSS Modellista',
      issuedDate: '2026-08-18',
      dueDate: '2026-08-18',
      rentalPeriod: '18 Agu 2026 - 21 Agu 2026 (3 Hari)',
      lineItems: [
        { id: 'li-1', description: 'Sewa Lepas Kunci Innova Zenix Q Hybrid', quantity: 3, unit: 'Hari', unitPrice: 950000, totalPrice: 2850000 },
        { id: 'li-2', description: 'Child Safety Car Seat ISOFIX', quantity: 3, unit: 'Hari', unitPrice: 50000, totalPrice: 150000 },
        { id: 'li-3', description: 'Jaminan Deposit Escrow (Refundable)', quantity: 1, unit: 'Deposit', unitPrice: 1500000, totalPrice: 1500000 }
      ],
      subtotal: 3000000,
      discountAmount: 0,
      ppn11Amount: 330000,
      grandTotal: 4830000,
      depositApplied: 1500000,
      totalPaid: 4830000,
      balanceDue: 0,
      paymentStatus: 'paid',
      paymentMethod: 'qris',
      notes: 'Lunas via BCA Virtual Account / QRIS.'
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-RC-2026-0042',
      tenantId: 'tenant-1',
      bookingId: 'rc-bkg-002',
      bookingNumber: 'RC-202608-0013',
      contractNumber: 'RC-CTR-202608-002',
      customerId: 'cust-2',
      customerName: 'PT Nusantara Megah Logistik (Corp)',
      customerPhone: '021-5558901',
      customerAddress: 'Menara Sudirman Lt. 18, Jl. Jend. Sudirman Kav. 60, Jakarta',
      customerNpwp: '01.234.567.8-012.000',
      vehiclePlate: 'B 1888 VVIP',
      vehicleModel: 'Toyota Alphard 2.5 HEV Executive Lounge',
      issuedDate: '2026-08-19',
      dueDate: '2026-08-26',
      rentalPeriod: '19 Agu 2026 - 21 Agu 2026 (2 Hari)',
      lineItems: [
        { id: 'li-4', description: 'Paket VVIP All-In (Alphard + Driver + BBM + Tol)', quantity: 2, unit: 'Hari', unitPrice: 3500000, totalPrice: 7000000 },
        { id: 'li-5', description: 'Corporate Security Deposit', quantity: 1, unit: 'Deposit', unitPrice: 3000000, totalPrice: 3000000 }
      ],
      subtotal: 7000000,
      discountAmount: 0,
      ppn11Amount: 770000,
      grandTotal: 10770000,
      depositApplied: 3000000,
      totalPaid: 5000000,
      balanceDue: 5770000,
      paymentStatus: 'partial',
      paymentMethod: 'corporate_term',
      notes: 'Term of Payment 14 Hari Corporate Billing.'
    }
  ];

  public getInvoices(): RentalInvoice[] {
    return [...this.invoices];
  }

  public getInvoiceById(id: string): RentalInvoice | undefined {
    return this.invoices.find((inv) => inv.id === id);
  }

  public settleInvoice(invoiceId: string, amountPaid: number, method: RentalInvoice['paymentMethod']): RentalInvoice | undefined {
    const invoice = this.invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return undefined;
    invoice.totalPaid += amountPaid;
    invoice.balanceDue = Math.max(0, invoice.grandTotal - invoice.totalPaid);
    invoice.paymentStatus = invoice.balanceDue === 0 ? 'paid' : 'partial';
    invoice.paymentMethod = method;
    this.notify();
    return invoice;
  }

  // ==========================================
  // VEHICLE PROFITABILITY & TCO ANALYTICS
  // ==========================================
  public getVehicleProfitability(): VehicleProfitabilityData[] {
    return this.vehicles.map((v) => {
      const grossRevenue = (v.totalTripsCount || 1) * v.pricing.dailyRate * 3;
      const fuelCost = Math.round(grossRevenue * 0.12);
      const maintenanceCost = Math.round(grossRevenue * 0.08);
      const driverCost = v.currentDriverId ? Math.round(grossRevenue * 0.15) : 0;
      const insuranceCost = Math.round(grossRevenue * 0.05);
      const depreciationCost = Math.round(grossRevenue * 0.10);
      const netProfit = grossRevenue - (fuelCost + maintenanceCost + driverCost + insuranceCost + depreciationCost);
      const margin = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;

      return {
        vehicleId: v.id,
        plateNumber: v.plateNumber,
        model: `${v.brand} ${v.model}`,
        category: v.category,
        totalRentalDays: v.totalTripsCount * 3,
        utilizationRate: v.status === 'rented' ? 88 : v.status === 'available' ? 72 : 45,
        grossRevenueIdr: grossRevenue,
        fuelCostIdr: fuelCost,
        maintenanceCostIdr: maintenanceCost,
        driverCostIdr: driverCost,
        insuranceCostIdr: insuranceCost,
        depreciationCostIdr: depreciationCost,
        netProfitIdr: netProfit,
        profitMarginPercent: margin,
        costPerDayIdr: Math.round((fuelCost + maintenanceCost + driverCost + insuranceCost + depreciationCost) / Math.max(1, v.totalTripsCount * 3)),
        revenuePerDayIdr: Math.round(grossRevenue / Math.max(1, v.totalTripsCount * 3)),
        roiScore: Number((netProfit / 10000000).toFixed(1))
      };
    });
  }

  // ==========================================
  // AI RENTAL INTELLIGENCE & COPILOT
  // ==========================================
  private aiInsights: RentalAiInsight[] = [
    {
      id: 'ai-ins-1',
      type: 'demand_forecast',
      title: 'Lonjakan Permintaan Akhir Pekan (Long Weekend)',
      summary: 'Prediksi peningkatan demand rental MPV & SUV keluarga sebesar 42% pada tanggal 28-31 Agustus 2026. Disarankan membuka alokasi reservasi lebih awal.',
      confidenceScore: 94,
      impactMetric: '+Rp 38.500.000 Potensi Pendapatan',
      actionRecommendation: 'Aktifkan paket 3-Day Weekend Bundle dan sesuaikan rate harian +15%.',
      status: 'active'
    },
    {
      id: 'ai-ins-2',
      type: 'pricing_recommendation',
      title: 'Optimasi Dynamic Pricing Kategori Luxury',
      summary: 'Tingkat utilisasi Alphard & HiAce Luxury mencapai 92% selama 3 pekan terakhir. Rekomendasi kenaikan base rate 10% untuk memaksimalkan yield margin.',
      confidenceScore: 89,
      impactMetric: '+Rp 14.200.000 Tambahan Laba Bersih',
      actionRecommendation: 'Terapkan Rate Card High Season untuk unit luxury.',
      status: 'active'
    },
    {
      id: 'ai-ins-3',
      type: 'risk_warning',
      title: 'Deteksi Anomali Pergerakan Geofence B 1429 SSA',
      summary: 'Kendaraan terdeteksi mendekati radius 5 km dari perbatasan zona Jawa Barat - Jawa Tengah tanpa perizinan lintas zona.',
      confidenceScore: 96,
      impactMetric: 'Perlindungan Aset Rp 460 Juta',
      actionRecommendation: 'Kirim notifikasi peringatan otomatis ke pengemudi dan siapkan Starter Kill siaga.',
      status: 'active'
    }
  ];

  public getAiInsights(): RentalAiInsight[] {
    return [...this.aiInsights];
  }

  public queryAiAssistant(question: string): { answer: string; relatedData?: any; confidence: number } {
    const q = question.toLowerCase();
    const kpis = this.getRentalKPIs();
    const availableCars = this.vehicles.filter((v) => v.status === 'available');

    if (q.includes('tersedia') || q.includes('available')) {
      return {
        answer: `Saat ini terdapat **${kpis.availableFleet} dari ${kpis.totalFleet} armada** yang berstatus **Tersedia (Ready to Rent)**, termasuk ${availableCars.map((c) => `${c.brand} ${c.model} (${c.plateNumber})`).join(', ')}.`,
        relatedData: { count: kpis.availableFleet, vehicles: availableCars },
        confidence: 99
      };
    }

    if (q.includes('booking') || q.includes('reservasi')) {
      const activeBookings = this.bookings.filter((b) => b.status === 'active' || b.status === 'confirmed');
      return {
        answer: `Hari ini tercatat **${this.bookings.length} total reservasi**, dengan **${activeBookings.length} booking berstatus Aktif/Dikonfirmasi**. Total estimasi omset berjalan adalah **Rp ${kpis.totalActiveRevenueIdr.toLocaleString('id-ID')}**.`,
        relatedData: { totalBookings: this.bookings.length, activeRevenue: kpis.totalActiveRevenueIdr },
        confidence: 98
      };
    }

    if (q.includes('profitable') || q.includes('keuntungan') || q.includes('profit')) {
      const profits = this.getVehicleProfitability().sort((a, b) => b.netProfitIdr - a.netProfitIdr);
      const topCar = profits[0];
      return {
        answer: `Kendaraan paling profitable bulan ini adalah **${topCar.model} (${topCar.plateNumber})** dengan laba bersih **Rp ${topCar.netProfitIdr.toLocaleString('id-ID')}** (Margin: ${topCar.profitMarginPercent}%) dan tingkat utilisasi ${topCar.utilizationRate}%.`,
        relatedData: topCar,
        confidence: 95
      };
    }

    if (q.includes('overdue') || q.includes('terlambat')) {
      const overdueList = this.vehicles.filter((v) => v.status === 'overdue');
      return {
        answer: `Terdapat **${kpis.overdueReturns} kendaraan** yang mengalami keterlambatan pengembalian (Overdue). Denda overtime otomatis berjalan di sistem.`,
        relatedData: overdueList,
        confidence: 99
      };
    }

    if (q.includes('pendapatan') || q.includes('revenue')) {
      return {
        answer: `Total pendapatan sewa yang terakumulasi bulan ini mencapai **Rp ${kpis.totalMonthlyRevenueIdr.toLocaleString('id-ID')}**, dengan rata-rata pendapatan per unit kendaraan (RevPAV) sebesar **Rp ${kpis.revPavIdr.toLocaleString('id-ID')}**. Jaminan deposit escrow aktif yang tersimpan aman di rekening penampung: **Rp ${kpis.securityDepositsHeldIdr.toLocaleString('id-ID')}**.`,
        relatedData: { monthly: kpis.totalMonthlyRevenueIdr, revPav: kpis.revPavIdr, deposit: kpis.securityDepositsHeldIdr },
        confidence: 97
      };
    }

    return {
      answer: `Berdasarkan analisis telematika dan operasional armada rental: Total armada aktif berjumlah **${kpis.totalFleet} unit** dengan utilisasi **${kpis.fleetUtilizationRate}%**. Tidak terdeteksi risiko fatal pada integritas data sewa. Ada hal spesifik mengenai reservasi, KYC, starter-kill, atau laporan keuangan yang ingin Anda tinjau?`,
      confidence: 90
    };
  }

  // ==========================================
  // RENTAL CALENDAR
  // ==========================================
  public getCalendarEvents(): RentalCalendarEvent[] {
    return this.bookings.map((b) => {
      let color = 'bg-cyan-500 text-slate-950';
      if (b.status === 'active') color = 'bg-emerald-500 text-white';
      if (b.status === 'overdue') color = 'bg-rose-500 text-white';
      if (b.status === 'confirmed') color = 'bg-blue-500 text-white';
      if (b.status === 'completed') color = 'bg-slate-700 text-slate-300';

      return {
        id: `cal-${b.id}`,
        bookingId: b.id,
        bookingNumber: b.bookingNumber,
        vehicleId: b.vehicleId,
        vehiclePlate: b.vehiclePlate,
        vehicleModel: `${b.vehicleBrand} ${b.vehicleModel}`,
        customerId: b.customerId,
        customerName: b.customerName,
        driverName: b.driverName,
        startDate: b.startDateTime,
        endDate: b.endDateTime,
        type: b.status === 'active' ? 'active_rental' : 'booking',
        status: b.status,
        color
      };
    });
  }

}

export const rentCarService = new RentCarService();
