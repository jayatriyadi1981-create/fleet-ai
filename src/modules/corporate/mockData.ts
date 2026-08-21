import { CorporateVehicle, CorporateCarBooking, SmartKeyAccessLog, CorporateDriver } from './types';

export const MOCK_CORP_VEHICLES: CorporateVehicle[] = [
  {
    id: 'corp-v-01',
    assetCode: 'CORP-VIP-01',
    plateNumber: 'B 1001 RFS',
    brandModel: 'Toyota Alphard 2.5 G Executive Lounge',
    category: 'EXECUTIVE_VIP',
    ownership: 'OPERATING_LEASE_TRAC',
    assignedDivision: 'Board of Directors (BOD)',
    assignedUser: 'President Director (CEO)',
    fuelType: 'BBM_PERTAMAX',
    currentOdometerKm: 18450,
    fuelLevelPercent: 88,
    status: 'DEDICATED_ASSIGNED',
    gpsLocation: {
      lat: -6.2297,
      lng: 106.8074,
      speedKmh: 42,
      address: 'Jl. Jend. Sudirman No. 52, SCBD Jakarta Selatan',
      isGeofenceHome: false
    },
    stnkExpiryDate: '2027-04-15',
    insurancePolicyNumber: 'POL-CORP-ALLRISK-9901',
    leaseVendor: 'PT Serasi Autoraya (TRAC Astra)',
    leaseMonthlyCostIdr: 28500000,
    eTollCardNumber: 'ET-MDR-8899-001',
    eTollBalanceIdr: 850000
  },
  {
    id: 'corp-v-02',
    assetCode: 'CORP-POOL-01',
    plateNumber: 'B 2145 SHP',
    brandModel: 'Toyota Innova Zenix 2.0 V CVT',
    category: 'POOL_OPERATIONAL',
    ownership: 'OPERATING_LEASE_MPM',
    assignedDivision: 'General Affairs / Pool Sharing',
    fuelType: 'BBM_PERTAMAX',
    currentOdometerKm: 34200,
    fuelLevelPercent: 65,
    status: 'AVAILABLE_POOL',
    gpsLocation: {
      lat: -6.2088,
      lng: 106.8456,
      speedKmh: 0,
      address: 'Head Office Parking Basement B1, Kuningan Jakarta',
      isGeofenceHome: true
    },
    stnkExpiryDate: '2026-11-20',
    insurancePolicyNumber: 'POL-CORP-ALLRISK-9902',
    leaseVendor: 'PT Mitra Pinasthika Mustika Rent (MPM)',
    leaseMonthlyCostIdr: 11200000,
    eTollCardNumber: 'ET-BCA-5544-012',
    eTollBalanceIdr: 320000
  },
  {
    id: 'corp-v-03',
    assetCode: 'CORP-POOL-02',
    plateNumber: 'B 1876 SZK',
    brandModel: 'Hyundai Ioniq 5 Signature Long Range (EV)',
    category: 'ELECTRIC_VEHICLE_EV',
    ownership: 'COMPANY_OWNED',
    assignedDivision: 'Sustainability & ESG / Pool Sharing',
    fuelType: 'ELECTRIC_BATTERY',
    currentOdometerKm: 12100,
    fuelLevelPercent: 92,
    batteryHealthPercent: 99,
    status: 'ON_TRIP_RESERVED',
    gpsLocation: {
      lat: -6.1754,
      lng: 106.8272,
      speedKmh: 35,
      address: 'Jl. Medan Merdeka Barat, Jakarta Pusat (Menuju Kementerian ESDM)',
      isGeofenceHome: false
    },
    stnkExpiryDate: '2028-02-10',
    insurancePolicyNumber: 'POL-CORP-EV-003',
    eTollCardNumber: 'ET-BRI-7711-008',
    eTollBalanceIdr: 450000
  },
  {
    id: 'corp-v-04',
    assetCode: 'CORP-POOL-03',
    plateNumber: 'B 2990 TZQ',
    brandModel: 'Toyota Avanza 1.5 G CVT',
    category: 'POOL_OPERATIONAL',
    ownership: 'OPERATING_LEASE_ASSA',
    assignedDivision: 'Sales & Commercial Division',
    fuelType: 'BBM_PERTAMAX',
    currentOdometerKm: 58200,
    fuelLevelPercent: 40,
    status: 'AVAILABLE_POOL',
    gpsLocation: {
      lat: -6.2088,
      lng: 106.8456,
      speedKmh: 0,
      address: 'Head Office Parking Basement B1, Kuningan Jakarta',
      isGeofenceHome: true
    },
    stnkExpiryDate: '2026-09-18',
    insurancePolicyNumber: 'POL-CORP-ASSA-4410',
    leaseVendor: 'PT Autopedia Sukses Lestari / ASSA Rent',
    leaseMonthlyCostIdr: 6800000,
    eTollCardNumber: 'ET-MDR-3321-099',
    eTollBalanceIdr: 150000
  },
  {
    id: 'corp-v-05',
    assetCode: 'CORP-SHUTTLE-01',
    plateNumber: 'B 7088 SAA',
    brandModel: 'Toyota HiAce Commuter 16-Seater',
    category: 'STAFF_SHUTTLE_BUS',
    ownership: 'COMPANY_OWNED',
    assignedDivision: 'Human Resources / Employee Shuttle Service',
    fuelType: 'BBM_DEX',
    currentOdometerKm: 78500,
    fuelLevelPercent: 75,
    status: 'AVAILABLE_POOL',
    gpsLocation: {
      lat: -6.2088,
      lng: 106.8456,
      speedKmh: 0,
      address: 'Shuttle Bus Station, Head Office Kuningan',
      isGeofenceHome: true
    },
    stnkExpiryDate: '2026-10-05',
    insurancePolicyNumber: 'POL-CORP-BUS-102',
    eTollCardNumber: 'ET-MDR-9900-112',
    eTollBalanceIdr: 920000
  },
  {
    id: 'corp-v-06',
    assetCode: 'CORP-MGT-01',
    plateNumber: 'B 1552 RFZ',
    brandModel: 'Mitsubishi Pajero Sport 2.4 Dakar 4x2',
    category: 'MANAGEMENT_DEDICATED',
    ownership: 'CAR_OWNERSHIP_PROGRAM_COP',
    assignedDivision: 'Finance & Accounting',
    assignedUser: 'Chief Financial Officer (CFO)',
    fuelType: 'BBM_DEX',
    currentOdometerKm: 42100,
    fuelLevelPercent: 82,
    status: 'DEDICATED_ASSIGNED',
    gpsLocation: {
      lat: -6.2144,
      lng: 106.8188,
      speedKmh: 0,
      address: 'Office Tower VIP Parking Lobby, Jl. Gatot Subroto',
      isGeofenceHome: true
    },
    stnkExpiryDate: '2027-08-30',
    insurancePolicyNumber: 'POL-CORP-COP-3321',
    eTollCardNumber: 'ET-BCA-1122-445',
    eTollBalanceIdr: 500000
  }
];

export const MOCK_CORP_BOOKINGS: CorporateCarBooking[] = [
  {
    id: 'bkg-01',
    bookingNumber: 'REQ-CORP-2026-0881',
    requestorName: 'Dewi Sartika',
    requestorDivision: 'Corporate Legal & Governance',
    requestorRole: 'Senior Legal Counsel',
    purpose: 'Menghadiri Sidang Mediasi Kontrak & Penandatanganan MoU Notaris',
    destination: 'Gedung Pengadilan Negeri Jakarta Selatan & Kantor Notaris Ampera',
    pickupTime: '2026-08-21 09:00',
    expectedReturnTime: '2026-08-21 14:30',
    assignedVehicleAssetCode: 'CORP-POOL-02 (EV)',
    assignedPlate: 'B 1876 SZK',
    driverOption: 'WITH_POOL_DRIVER',
    assignedDriverName: 'Bambang Irawan (Driver Pool)',
    status: 'ACTIVE_ON_GOING',
    approvedByGA: 'Hendro Wijaya (GA Fleet Lead)',
    estimatedCostCenter: 'CC-LEGAL-402',
    startOdometer: 12050
  },
  {
    id: 'bkg-02',
    bookingNumber: 'REQ-CORP-2026-0882',
    requestorName: 'Reza Pratama',
    requestorDivision: 'Enterprise IT & Infrastructure',
    requestorRole: 'Data Center Lead',
    purpose: 'Inspeksi & Maintenance Server Disaster Recovery Center (DRC)',
    destination: 'Data Center Jababeka Cikarang, Jawa Barat',
    pickupTime: '2026-08-21 13:00',
    expectedReturnTime: '2026-08-21 18:00',
    assignedVehicleAssetCode: 'CORP-POOL-01',
    assignedPlate: 'B 2145 SHP',
    driverOption: 'SELF_DRIVE',
    status: 'APPROVED_DISPATCHED',
    approvedByGA: 'Hendro Wijaya (GA Fleet Lead)',
    estimatedCostCenter: 'CC-IT-105'
  },
  {
    id: 'bkg-03',
    bookingNumber: 'REQ-CORP-2026-0883',
    requestorName: 'Andi Nugroho',
    requestorDivision: 'Marketing & Brand Communication',
    requestorRole: 'Event Coordinator',
    purpose: 'Survey Venue Roadshow Gala Dinner Mitra Korporat',
    destination: 'The Langham Hotel SCBD Jakarta',
    pickupTime: '2026-08-22 08:30',
    expectedReturnTime: '2026-08-22 12:00',
    assignedVehicleAssetCode: 'CORP-POOL-03',
    assignedPlate: 'B 2990 TZQ',
    driverOption: 'WITH_POOL_DRIVER',
    assignedDriverName: 'Agus Sunarto (Driver Pool)',
    status: 'PENDING_GA_APPROVAL',
    approvedByGA: 'Menunggu Review GA',
    estimatedCostCenter: 'CC-MKT-301'
  }
];

export const MOCK_SMART_KEY_LOGS: SmartKeyAccessLog[] = [
  {
    id: 'key-log-01',
    lockerNumber: 'BOX-SLOT-02',
    vehicleAssetCode: 'CORP-POOL-02 (EV)',
    plateNumber: 'B 1876 SZK',
    authorizedEmployee: 'Bambang Irawan (Driver Pool)',
    action: 'KEY_CHECKOUT',
    timestamp: '2026-08-21 08:45:12',
    odometerEnteredKm: 12050,
    keyStatus: 'IN_USE_EMPLOYEE'
  },
  {
    id: 'key-log-02',
    lockerNumber: 'BOX-SLOT-01',
    vehicleAssetCode: 'CORP-POOL-01',
    plateNumber: 'B 2145 SHP',
    authorizedEmployee: 'Siti Aminah (Finance Staff)',
    action: 'KEY_RETURN',
    timestamp: '2026-08-20 17:30:00',
    odometerEnteredKm: 34200,
    keyStatus: 'INSIDE_LOCKER'
  }
];

export const MOCK_CORP_DRIVERS: CorporateDriver[] = [
  {
    id: 'drv-01',
    employeeId: 'EMP-DRV-001',
    name: 'Suryadi Kusuma',
    phone: '0812-9900-1122',
    simType: 'SIM_A',
    simExpiryDate: '2028-05-14',
    assignedType: 'EXECUTIVE_VIP_DRIVER',
    currentDuty: 'ON_DUTY_TRIP',
    ratingStars: 4.95,
    monthlyTripsCount: 38,
    overtimeHoursMonth: 18.5,
    assignedExecutive: 'President Director (CEO)'
  },
  {
    id: 'drv-02',
    employeeId: 'EMP-DRV-002',
    name: 'Bambang Irawan',
    phone: '0813-8822-4455',
    simType: 'SIM_A',
    simExpiryDate: '2027-11-20',
    assignedType: 'POOL_DRIVER',
    currentDuty: 'ON_DUTY_TRIP',
    ratingStars: 4.88,
    monthlyTripsCount: 46,
    overtimeHoursMonth: 12.0
  },
  {
    id: 'drv-03',
    employeeId: 'EMP-DRV-003',
    name: 'Agus Sunarto',
    phone: '0857-1133-7788',
    simType: 'SIM_A',
    simExpiryDate: '2029-01-10',
    assignedType: 'POOL_DRIVER',
    currentDuty: 'IDLE_AVAILABLE',
    ratingStars: 4.90,
    monthlyTripsCount: 42,
    overtimeHoursMonth: 8.5
  },
  {
    id: 'drv-04',
    employeeId: 'EMP-DRV-004',
    name: 'Mulyadi Pratama',
    phone: '0821-4455-6677',
    simType: 'SIM_B1_UMUM',
    simExpiryDate: '2028-09-25',
    assignedType: 'SHUTTLE_BUS_DRIVER',
    currentDuty: 'IDLE_AVAILABLE',
    ratingStars: 4.92,
    monthlyTripsCount: 52,
    overtimeHoursMonth: 22.0
  }
];
