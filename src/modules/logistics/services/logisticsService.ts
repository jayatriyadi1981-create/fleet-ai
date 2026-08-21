/**
 * Fleet Intelligence Smart AI - Logistics Management Service
 * Mock Data Engine, Persistence, Dispatching & Analytics
 */

import {
  LogisticsOrder,
  LogisticsManifest,
  LogisticsHub,
  PickupTask,
  CodSettlement,
  LogisticsExceptionTicket,
  LogisticsSummaryKpis
} from '../types';

const INITIAL_HUBS: LogisticsHub[] = [
  {
    id: 'hub-jkt-central',
    code: 'HUB-JKT-01',
    name: 'Jakarta Central Sorting Hub (Cakung Mega Depo)',
    type: 'MAIN_SORTING_CENTER',
    city: 'Jakarta Timur',
    address: 'Jl. Raya Cakung Cilincing No. 88, Jakarta Timur',
    coordinates: { lat: -6.1823, lng: 106.9452 },
    managerName: 'Bambang Supriyanto',
    contactPhone: '+62 811-9872-3321',
    dailyCapacityCbm: 1200,
    currentStoredCbm: 860,
    activeVehiclesCount: 42,
    activeParcelsCount: 14250,
    operationalStatus: 'OPERATIONAL'
  },
  {
    id: 'hub-bdg-main',
    code: 'HUB-BDG-01',
    name: 'Bandung Regional Logistics Hub (Soekarno-Hatta)',
    type: 'REGIONAL_HUB',
    city: 'Bandung',
    address: 'Jl. Soekarno-Hatta No. 452, Batununggal, Bandung',
    coordinates: { lat: -6.9382, lng: 107.6294 },
    managerName: 'Rian Hidayat',
    contactPhone: '+62 812-4455-8890',
    dailyCapacityCbm: 650,
    currentStoredCbm: 520,
    activeVehiclesCount: 24,
    activeParcelsCount: 7800,
    operationalStatus: 'OPERATIONAL'
  },
  {
    id: 'hub-sby-port',
    code: 'HUB-SBY-01',
    name: 'Surabaya East Gateway Hub (Tanjung Perak)',
    type: 'MAIN_SORTING_CENTER',
    city: 'Surabaya',
    address: 'Kawasan Pergudangan Margomulyo Permai Blok B-12, Surabaya',
    coordinates: { lat: -7.2289, lng: 112.6712 },
    managerName: 'Agus Santoso',
    contactPhone: '+62 813-2211-9988',
    dailyCapacityCbm: 950,
    currentStoredCbm: 780,
    activeVehiclesCount: 36,
    activeParcelsCount: 11400,
    operationalStatus: 'HIGH_LOAD'
  },
  {
    id: 'hub-smg-central',
    code: 'HUB-SMG-01',
    name: 'Semarang Transit Depo (Krapyak)',
    type: 'TRANSIT_POINT',
    city: 'Semarang',
    address: 'Jl. Raya Siliwangi No. 102, Krapyak, Semarang Barat',
    coordinates: { lat: -6.9892, lng: 110.3781 },
    managerName: 'Dedi Kurniawan',
    contactPhone: '+62 815-6677-2233',
    dailyCapacityCbm: 400,
    currentStoredCbm: 210,
    activeVehiclesCount: 16,
    activeParcelsCount: 4200,
    operationalStatus: 'OPERATIONAL'
  }
];

const INITIAL_ORDERS: LogisticsOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-LOG-2026-001',
    connoteNumber: 'JKT-BDG-882109',
    shipperId: 'shp-001',
    shipperName: 'PT Mega Elektronik Nusantara',
    shipperPhone: '0812-8877-6655',
    shipperAddress: 'Kawasan Industri Pulogadung Blok III/14, Jakarta Timur',
    shipperCity: 'Jakarta',
    shipperCoordinates: { lat: -6.192, lng: 106.901 },
    consigneeName: 'Toko Sumber Rezeki Elektronik',
    consigneePhone: '0813-9988-7711',
    consigneeAddress: 'Jl. ABC No. 45, Braga, Sumur Bandung',
    consigneeCity: 'Bandung',
    consigneePostalCode: '40111',
    consigneeCoordinates: { lat: -6.9175, lng: 107.6098 },
    serviceType: 'NEXTDAY',
    status: 'INBOUND_HUB',
    paymentMethod: 'PREPAID',
    codAmount: 0,
    shippingFee: 450000,
    insuranceFee: 25000,
    totalAmount: 475000,
    totalWeightKg: 85,
    totalVolumeCbm: 0.65,
    chargeableWeightKg: 108,
    items: [
      {
        id: 'itm-01',
        sku: 'ELEC-TV-55',
        name: 'Smart TV UHD 55 Inch 4K HDR',
        qty: 4,
        weightKg: 60,
        dimensions: { lengthCm: 135, widthCm: 20, heightCm: 85 },
        volumeCbm: 0.459,
        isFragile: true,
        isDangerousGoods: false,
        declaredValue: 24000000
      },
      {
        id: 'itm-02',
        sku: 'ELEC-SND-01',
        name: 'Soundbar Dolby Atmos Home Audio',
        qty: 4,
        weightKg: 25,
        dimensions: { lengthCm: 100, widthCm: 18, heightCm: 15 },
        volumeCbm: 0.108,
        isFragile: true,
        isDangerousGoods: false,
        declaredValue: 8000000
      }
    ],
    assignedVehicleId: 'veh-trk-01',
    assignedVehiclePlate: 'B 9481 UXT',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Suryadi Pratama',
    currentHubId: 'hub-jkt-central',
    currentHubName: 'Jakarta Central Sorting Hub',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-bdg-main',
    destinationHubName: 'Bandung Regional Hub',
    manifestId: 'mnf-001',
    pickupScheduledAt: '2026-08-20T08:00:00Z',
    pickedUpAt: '2026-08-20T09:15:00Z',
    estimatedDeliveryAt: '2026-08-21T14:00:00Z',
    slaHours: 24,
    slaDeadline: '2026-08-21T18:00:00Z',
    isSlaBreached: false,
    createdAt: '2026-08-20T07:30:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-LOG-2026-002',
    connoteNumber: 'JKT-SBY-993021',
    shipperId: 'shp-002',
    shipperName: 'CV Prima Farmasi Kimia',
    shipperPhone: '0811-2233-4455',
    shipperAddress: 'Jl. Gatot Subroto Kav. 38, Jakarta Selatan',
    shipperCity: 'Jakarta',
    shipperCoordinates: { lat: -6.234, lng: 106.822 },
    consigneeName: 'Apotek Sehat Sentosa',
    consigneePhone: '0812-7766-3322',
    consigneeAddress: 'Jl. Darmo No. 88, Wonokromo, Surabaya',
    consigneeCity: 'Surabaya',
    consigneePostalCode: '60241',
    consigneeCoordinates: { lat: -7.2912, lng: 112.7388 },
    serviceType: 'COLD_CHAIN',
    status: 'LINEHAUL_TRANSIT',
    paymentMethod: 'POSTPAID_B2B',
    codAmount: 0,
    shippingFee: 1850000,
    insuranceFee: 95000,
    totalAmount: 1945000,
    totalWeightKg: 140,
    totalVolumeCbm: 1.2,
    chargeableWeightKg: 200,
    items: [
      {
        id: 'itm-03',
        sku: 'MED-VAC-01',
        name: 'Biological Vaccine Batch V-99',
        qty: 10,
        weightKg: 50,
        dimensions: { lengthCm: 50, widthCm: 40, heightCm: 40 },
        volumeCbm: 0.08,
        isFragile: true,
        isDangerousGoods: false,
        temperatureRequired: '2°C - 8°C (Reefer)',
        declaredValue: 65000000
      }
    ],
    assignedVehicleId: 'veh-trk-04',
    assignedVehiclePlate: 'B 9012 KLD (Reefer)',
    assignedDriverId: 'drv-04',
    assignedDriverName: 'Hendro Wijaya',
    currentHubId: 'hub-smg-central',
    currentHubName: 'Semarang Transit Depo',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-sby-port',
    destinationHubName: 'Surabaya East Gateway Hub',
    manifestId: 'mnf-002',
    pickupScheduledAt: '2026-08-19T14:00:00Z',
    pickedUpAt: '2026-08-19T15:30:00Z',
    estimatedDeliveryAt: '2026-08-21T10:00:00Z',
    slaHours: 36,
    slaDeadline: '2026-08-21T12:00:00Z',
    isSlaBreached: false,
    createdAt: '2026-08-19T13:00:00Z',
    updatedAt: '2026-08-20T06:00:00Z'
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-LOG-2026-003',
    connoteNumber: 'BDG-JKT-114920',
    shipperId: 'shp-003',
    shipperName: 'Distro Apparel Bandung Urban',
    shipperPhone: '0817-8899-0011',
    shipperAddress: 'Jl. Riau No. 120, Citarum, Bandung',
    shipperCity: 'Bandung',
    shipperCoordinates: { lat: -6.908, lng: 107.618 },
    consigneeName: 'Gita Larasati',
    consigneePhone: '0857-1122-3344',
    consigneeAddress: 'Apartemen Green Pramuka Tower Orchid Lt 12-08, Jakarta Pusat',
    consigneeCity: 'Jakarta',
    consigneePostalCode: '10570',
    consigneeCoordinates: { lat: -6.189, lng: 106.874 },
    serviceType: 'REGULAR',
    status: 'OUT_FOR_DELIVERY',
    paymentMethod: 'COD',
    codAmount: 850000,
    shippingFee: 32000,
    insuranceFee: 5000,
    totalAmount: 887000,
    totalWeightKg: 4.5,
    totalVolumeCbm: 0.02,
    chargeableWeightKg: 4.5,
    items: [
      {
        id: 'itm-04',
        sku: 'APP-JKT-09',
        name: 'Denim Jacket Vintage Selvedge + Hoodies',
        qty: 3,
        weightKg: 4.5,
        dimensions: { lengthCm: 35, widthCm: 25, heightCm: 20 },
        volumeCbm: 0.0175,
        isFragile: false,
        isDangerousGoods: false,
        declaredValue: 850000
      }
    ],
    assignedVehicleId: 'veh-van-02',
    assignedVehiclePlate: 'B 2314 STY',
    assignedDriverId: 'drv-02',
    assignedDriverName: 'Fajar Nugraha',
    currentHubId: 'hub-jkt-central',
    currentHubName: 'Jakarta Central Sorting Hub',
    originHubId: 'hub-bdg-main',
    originHubName: 'Bandung Regional Hub',
    destinationHubId: 'hub-jkt-central',
    destinationHubName: 'Jakarta Central Sorting Hub',
    pickupScheduledAt: '2026-08-19T10:00:00Z',
    pickedUpAt: '2026-08-19T11:00:00Z',
    estimatedDeliveryAt: '2026-08-20T16:00:00Z',
    slaHours: 48,
    slaDeadline: '2026-08-21T10:00:00Z',
    isSlaBreached: false,
    createdAt: '2026-08-19T09:00:00Z',
    updatedAt: '2026-08-20T08:30:00Z'
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-LOG-2026-004',
    connoteNumber: 'JKT-JKT-772183',
    shipperId: 'shp-004',
    shipperName: 'PT Global Auto Parts',
    shipperPhone: '0812-3344-5566',
    shipperAddress: 'Kawasan Sunter Podomoro, Jakarta Utara',
    shipperCity: 'Jakarta',
    shipperCoordinates: { lat: -6.134, lng: 106.879 },
    consigneeName: 'Bengkel Maju Motorindo',
    consigneePhone: '0818-9900-1122',
    consigneeAddress: 'Jl. Daan Mogot KM 12 No. 8, Cengkareng, Jakarta Barat',
    consigneeCity: 'Jakarta',
    consigneePostalCode: '11740',
    consigneeCoordinates: { lat: -6.155, lng: 106.721 },
    serviceType: 'SAMEDAY',
    status: 'DELIVERED',
    paymentMethod: 'PREPAID',
    codAmount: 0,
    shippingFee: 95000,
    insuranceFee: 15000,
    totalAmount: 110000,
    totalWeightKg: 18,
    totalVolumeCbm: 0.08,
    chargeableWeightKg: 18,
    items: [
      {
        id: 'itm-05',
        sku: 'AUTO-BRK-01',
        name: 'Brake Disc Rotor Performance Set',
        qty: 2,
        weightKg: 18,
        dimensions: { lengthCm: 40, widthCm: 40, heightCm: 25 },
        volumeCbm: 0.04,
        isFragile: false,
        isDangerousGoods: false,
        declaredValue: 2800000
      }
    ],
    assignedVehicleId: 'veh-van-03',
    assignedVehiclePlate: 'B 1189 KOP',
    assignedDriverId: 'drv-03',
    assignedDriverName: 'Doni Saputra',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-jkt-central',
    destinationHubName: 'Jakarta Central Sorting Hub',
    pickupScheduledAt: '2026-08-20T08:00:00Z',
    pickedUpAt: '2026-08-20T09:00:00Z',
    estimatedDeliveryAt: '2026-08-20T13:00:00Z',
    deliveredAt: '2026-08-20T12:45:00Z',
    slaHours: 8,
    slaDeadline: '2026-08-20T16:00:00Z',
    isSlaBreached: false,
    epod: {
      receivedBy: 'Hendra Gunawan (Kepala Bengkel)',
      relationship: 'PIC Lokasi',
      signatureUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
      photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      timestamp: '2026-08-20T12:45:00Z',
      coordinates: { lat: -6.155, lng: 106.721 },
      notes: 'Paket diterima dalam kondisi kardus bersegel rapih dan utuh.'
    },
    createdAt: '2026-08-20T07:15:00Z',
    updatedAt: '2026-08-20T12:46:00Z'
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-LOG-2026-005',
    connoteNumber: 'JKT-BDG-339912',
    shipperId: 'shp-001',
    shipperName: 'PT Mega Elektronik Nusantara',
    shipperPhone: '0812-8877-6655',
    shipperAddress: 'Kawasan Industri Pulogadung Blok III/14, Jakarta Timur',
    shipperCity: 'Jakarta',
    shipperCoordinates: { lat: -6.192, lng: 106.901 },
    consigneeName: 'Dicky Dharmawan',
    consigneePhone: '0819-0099-8877',
    consigneeAddress: 'Jl. Dago Asri No. 19, Coblong, Bandung',
    consigneeCity: 'Bandung',
    consigneePostalCode: '40135',
    consigneeCoordinates: { lat: -6.879, lng: 107.618 },
    serviceType: 'NEXTDAY',
    status: 'FAILED_DELIVERY',
    paymentMethod: 'COD',
    codAmount: 1450000,
    shippingFee: 45000,
    insuranceFee: 8000,
    totalAmount: 1503000,
    totalWeightKg: 6.2,
    totalVolumeCbm: 0.03,
    chargeableWeightKg: 6.2,
    items: [
      {
        id: 'itm-06',
        sku: 'ELEC-AUD-09',
        name: 'Gaming Headset Wireless 7.1 Surround',
        qty: 1,
        weightKg: 1.5,
        dimensions: { lengthCm: 25, widthCm: 20, heightCm: 15 },
        volumeCbm: 0.0075,
        isFragile: true,
        isDangerousGoods: false,
        declaredValue: 1450000
      }
    ],
    assignedVehicleId: 'veh-van-02',
    assignedVehiclePlate: 'B 2314 STY',
    assignedDriverId: 'drv-02',
    assignedDriverName: 'Fajar Nugraha',
    currentHubId: 'hub-bdg-main',
    currentHubName: 'Bandung Regional Hub',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-bdg-main',
    destinationHubName: 'Bandung Regional Hub',
    pickupScheduledAt: '2026-08-19T09:00:00Z',
    pickedUpAt: '2026-08-19T10:00:00Z',
    estimatedDeliveryAt: '2026-08-20T11:00:00Z',
    slaHours: 24,
    slaDeadline: '2026-08-20T14:00:00Z',
    isSlaBreached: true,
    exceptionHistory: [
      {
        id: 'exc-01',
        timestamp: '2026-08-20T11:30:00Z',
        reason: 'Rumah penerima terkunci rapat, tidak ada orang, no HP tidak aktif (3x panggil).',
        actionTaken: 'Paket dibawa kembali ke Bandung Hub untuk penjadwalan ulang re-delivery besok pagi.',
        reporterName: 'Fajar Nugraha (Kurir)'
      }
    ],
    createdAt: '2026-08-19T08:00:00Z',
    updatedAt: '2026-08-20T11:45:00Z'
  }
];

const INITIAL_MANIFESTS: LogisticsManifest[] = [
  {
    id: 'mnf-001',
    manifestNumber: 'MNF-2026-JKT-BDG-0820',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-bdg-main',
    destinationHubName: 'Bandung Regional Hub',
    status: 'IN_TRANSIT',
    vehiclePlate: 'B 9481 UXT (Wingbox CDD)',
    driverName: 'Suryadi Pratama',
    driverPhone: '0812-9871-0012',
    sealNumber: 'SEAL-JKT-881920',
    totalShipments: 148,
    totalWeightKg: 3840,
    totalCbm: 24.5,
    capacityUtilizationPct: 88.5,
    departureTime: '2026-08-20T09:30:00Z',
    estimatedArrivalTime: '2026-08-20T13:30:00Z',
    shipmentIds: ['ord-001', 'ord-005'],
    notes: 'Linehaul Tol Cipularang, perkiraan cuaca cerah.'
  },
  {
    id: 'mnf-002',
    manifestNumber: 'MNF-2026-JKT-SBY-0819',
    originHubId: 'hub-jkt-central',
    originHubName: 'Jakarta Central Sorting Hub',
    destinationHubId: 'hub-sby-port',
    destinationHubName: 'Surabaya East Gateway Hub',
    status: 'IN_TRANSIT',
    vehiclePlate: 'B 9012 KLD (Reefer Fuso)',
    driverName: 'Hendro Wijaya',
    driverPhone: '0813-4455-6677',
    sealNumber: 'SEAL-JKT-992188',
    totalShipments: 84,
    totalWeightKg: 7600,
    totalCbm: 38.0,
    capacityUtilizationPct: 92.0,
    departureTime: '2026-08-19T21:00:00Z',
    estimatedArrivalTime: '2026-08-20T17:00:00Z',
    shipmentIds: ['ord-002'],
    notes: 'Muatan suhu dingin - target temperatur thermo-logger konstan 4°C.'
  }
];

const INITIAL_PICKUPS: PickupTask[] = [
  {
    id: 'pkp-001',
    pickupCode: 'PKP-2026-0820-01',
    shipperName: 'PT Unilever Logistics Distribution',
    shipperAddress: 'Kawasan Industri Jababeka V, Cikarang',
    shipperPhone: '0811-9988-1122',
    scheduledTime: '2026-08-20T14:00:00Z',
    assignedDriverId: 'drv-05',
    assignedDriverName: 'Ade Iskandar',
    vehiclePlate: 'B 9382 PPL',
    estimatedPackages: 45,
    estimatedWeightKg: 650,
    status: 'ASSIGNED',
    notes: 'Siapkan palet plastik standard, gate loading dock B4.'
  },
  {
    id: 'pkp-002',
    pickupCode: 'PKP-2026-0820-02',
    shipperName: 'Gudang Garam Consumer Pack',
    shipperAddress: 'Jl. Rawa Gelam IV No. 3, Pulogadung, Jaktim',
    shipperPhone: '0812-4411-9900',
    scheduledTime: '2026-08-20T15:30:00Z',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Suryadi Pratama',
    vehiclePlate: 'B 9481 UXT',
    estimatedPackages: 120,
    estimatedWeightKg: 1400,
    status: 'PENDING',
    notes: 'Kargo kering non-fragile.'
  }
];

const INITIAL_COD: CodSettlement[] = [
  {
    id: 'cod-001',
    driverId: 'drv-02',
    driverName: 'Fajar Nugraha (Kurir BDG-01)',
    date: '2026-08-20',
    totalDeliveredCodCount: 8,
    totalCodAmountExpected: 4250000,
    totalCashDeposited: 4250000,
    variance: 0,
    status: 'SETTLED_VERIFIED',
    cashierName: 'Ratna Dewi (Finance Hub)',
    verifiedAt: '2026-08-20T12:00:00Z',
    receiptNumber: 'REC-COD-2026-8812'
  },
  {
    id: 'cod-002',
    driverId: 'drv-03',
    driverName: 'Doni Saputra (Kurir JKT-04)',
    date: '2026-08-20',
    totalDeliveredCodCount: 5,
    totalCodAmountExpected: 2850000,
    totalCashDeposited: 0,
    variance: -2850000,
    status: 'PENDING_DEPOSIT'
  }
];

const INITIAL_EXCEPTIONS: LogisticsExceptionTicket[] = [
  {
    id: 'exc-001',
    ticketNumber: 'TKT-EXC-2026-091',
    connoteNumber: 'JKT-BDG-339912',
    customerName: 'Dicky Dharmawan',
    driverName: 'Fajar Nugraha',
    exceptionType: 'RECIPIENT_ABSENT',
    severity: 'MEDIUM',
    status: 'RESCHEDULED',
    description: 'Penerima tidak berada di rumah dan nomor kontak tidak aktif saat pengantaran pertama.',
    reportedAt: '2026-08-20T11:30:00Z',
    actionTaken: 'Customer care berhasil menghubungi nomor alternatif via WhatsApp, pengiriman dijadwalkan ulang besok pukul 09:00 WIB.'
  },
  {
    id: 'exc-002',
    ticketNumber: 'TKT-EXC-2026-092',
    connoteNumber: 'JKT-SBY-881900',
    customerName: 'CV Makmur Logam',
    driverName: 'Hendro Wijaya',
    exceptionType: 'VEHICLE_BREAKDOWN',
    severity: 'HIGH',
    status: 'IN_INVESTIGATION',
    description: 'Truk fuso mengalami kebocoran selang rem hidrolik di Tol Kanci-Pejagan KM 224.',
    reportedAt: '2026-08-20T06:15:00Z',
    actionTaken: 'Truk pengganti siaga dikirimkan dari Hub Cirebon untuk proses over-cargo muatan darurat.'
  }
];

class LogisticsService {
  private STORAGE_KEY_ORDERS = 'fleet_ai_logistics_orders_v1';
  private STORAGE_KEY_MANIFESTS = 'fleet_ai_logistics_manifests_v1';
  private STORAGE_KEY_HUBS = 'fleet_ai_logistics_hubs_v1';
  private STORAGE_KEY_PICKUPS = 'fleet_ai_logistics_pickups_v1';
  private STORAGE_KEY_COD = 'fleet_ai_logistics_cod_v1';
  private STORAGE_KEY_EXCEPTIONS = 'fleet_ai_logistics_exceptions_v1';

  private orders: LogisticsOrder[] = [];
  private manifests: LogisticsManifest[] = [];
  private hubs: LogisticsHub[] = [];
  private pickups: PickupTask[] = [];
  private codSettlements: CodSettlement[] = [];
  private exceptions: LogisticsExceptionTicket[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedOrders = localStorage.getItem(this.STORAGE_KEY_ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedManifests = localStorage.getItem(this.STORAGE_KEY_MANIFESTS);
      this.manifests = storedManifests ? JSON.parse(storedManifests) : INITIAL_MANIFESTS;

      const storedHubs = localStorage.getItem(this.STORAGE_KEY_HUBS);
      this.hubs = storedHubs ? JSON.parse(storedHubs) : INITIAL_HUBS;

      const storedPickups = localStorage.getItem(this.STORAGE_KEY_PICKUPS);
      this.pickups = storedPickups ? JSON.parse(storedPickups) : INITIAL_PICKUPS;

      const storedCod = localStorage.getItem(this.STORAGE_KEY_COD);
      this.codSettlements = storedCod ? JSON.parse(storedCod) : INITIAL_COD;

      const storedExc = localStorage.getItem(this.STORAGE_KEY_EXCEPTIONS);
      this.exceptions = storedExc ? JSON.parse(storedExc) : INITIAL_EXCEPTIONS;
    } catch {
      this.orders = INITIAL_ORDERS;
      this.manifests = INITIAL_MANIFESTS;
      this.hubs = INITIAL_HUBS;
      this.pickups = INITIAL_PICKUPS;
      this.codSettlements = INITIAL_COD;
      this.exceptions = INITIAL_EXCEPTIONS;
    }
  }

  private save() {
    try {
      localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(this.STORAGE_KEY_MANIFESTS, JSON.stringify(this.manifests));
      localStorage.setItem(this.STORAGE_KEY_HUBS, JSON.stringify(this.hubs));
      localStorage.setItem(this.STORAGE_KEY_PICKUPS, JSON.stringify(this.pickups));
      localStorage.setItem(this.STORAGE_KEY_COD, JSON.stringify(this.codSettlements));
      localStorage.setItem(this.STORAGE_KEY_EXCEPTIONS, JSON.stringify(this.exceptions));
    } catch (e) {
      console.error('Failed to persist logistics data', e);
    }
  }

  // Orders
  getOrders(): LogisticsOrder[] {
    return [...this.orders];
  }

  getOrderById(id: string): LogisticsOrder | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id || o.connoteNumber === id);
  }

  createOrder(order: Partial<LogisticsOrder>): LogisticsOrder {
    const connoteNumber = `CON-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: LogisticsOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-LOG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      connoteNumber: connoteNumber,
      shipperId: order.shipperId || 'shp-new',
      shipperName: order.shipperName || 'Klien Baru B2B',
      shipperPhone: order.shipperPhone || '081200000000',
      shipperAddress: order.shipperAddress || 'Jakarta Logistics Center',
      shipperCity: order.shipperCity || 'Jakarta',
      shipperCoordinates: order.shipperCoordinates || { lat: -6.18, lng: 106.94 },
      consigneeName: order.consigneeName || 'Penerima Barang',
      consigneePhone: order.consigneePhone || '081300000000',
      consigneeAddress: order.consigneeAddress || 'Alamat Tujuan Pengiriman',
      consigneeCity: order.consigneeCity || 'Bandung',
      consigneePostalCode: order.consigneePostalCode || '40111',
      consigneeCoordinates: order.consigneeCoordinates || { lat: -6.91, lng: 107.60 },
      serviceType: order.serviceType || 'REGULAR',
      status: order.status || 'ORDER_CREATED',
      paymentMethod: order.paymentMethod || 'PREPAID',
      codAmount: order.codAmount || 0,
      shippingFee: order.shippingFee || 150000,
      insuranceFee: order.insuranceFee || 10000,
      totalAmount: (order.shippingFee || 150000) + (order.insuranceFee || 10000),
      totalWeightKg: order.totalWeightKg || 10,
      totalVolumeCbm: order.totalVolumeCbm || 0.05,
      chargeableWeightKg: order.chargeableWeightKg || 10,
      items: order.items || [],
      originHubId: order.originHubId || 'hub-jkt-central',
      originHubName: order.originHubName || 'Jakarta Central Sorting Hub',
      destinationHubId: order.destinationHubId || 'hub-bdg-main',
      destinationHubName: order.destinationHubName || 'Bandung Regional Hub',
      pickupScheduledAt: order.pickupScheduledAt || new Date().toISOString(),
      estimatedDeliveryAt: order.estimatedDeliveryAt || new Date(Date.now() + 86400000).toISOString(),
      slaHours: order.slaHours || 24,
      slaDeadline: new Date(Date.now() + (order.slaHours || 24) * 3600000).toISOString(),
      isSlaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(id: string, status: LogisticsOrder['status'], epodData?: LogisticsOrder['epod']): LogisticsOrder | undefined {
    const index = this.orders.findIndex(o => o.id === id || o.connoteNumber === id);
    if (index === -1) return undefined;

    this.orders[index].status = status;
    this.orders[index].updatedAt = new Date().toISOString();

    if (status === 'DELIVERED' && epodData) {
      this.orders[index].deliveredAt = new Date().toISOString();
      this.orders[index].epod = epodData;
    }

    this.save();
    return this.orders[index];
  }

  // Manifests
  getManifests(): LogisticsManifest[] {
    return [...this.manifests];
  }

  createManifest(manifest: Partial<LogisticsManifest>): LogisticsManifest {
    const newManifest: LogisticsManifest = {
      id: `mnf-${Date.now()}`,
      manifestNumber: `MNF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      originHubId: manifest.originHubId || 'hub-jkt-central',
      originHubName: manifest.originHubName || 'Jakarta Central Sorting Hub',
      destinationHubId: manifest.destinationHubId || 'hub-bdg-main',
      destinationHubName: manifest.destinationHubName || 'Bandung Regional Hub',
      status: 'DRAFT',
      vehiclePlate: manifest.vehiclePlate || 'B 9000 XYZ',
      driverName: manifest.driverName || 'Driver Utama',
      driverPhone: manifest.driverPhone || '08123456789',
      sealNumber: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`,
      totalShipments: manifest.totalShipments || 0,
      totalWeightKg: manifest.totalWeightKg || 0,
      totalCbm: manifest.totalCbm || 0,
      capacityUtilizationPct: manifest.capacityUtilizationPct || 0,
      shipmentIds: manifest.shipmentIds || [],
      departureTime: new Date().toISOString(),
      notes: manifest.notes || ''
    };

    this.manifests.unshift(newManifest);
    this.save();
    return newManifest;
  }

  // Hubs
  getHubs(): LogisticsHub[] {
    return [...this.hubs];
  }

  // Pickups
  getPickups(): PickupTask[] {
    return [...this.pickups];
  }

  // COD
  getCodSettlements(): CodSettlement[] {
    return [...this.codSettlements];
  }

  getSettlements(): CodSettlement[] {
    return [...this.codSettlements];
  }

  settleCod(id: string, amount: number, cashierName: string): CodSettlement | undefined {
    const idx = this.codSettlements.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    this.codSettlements[idx].totalCashDeposited = amount;
    this.codSettlements[idx].variance = amount - this.codSettlements[idx].totalCodAmountExpected;
    this.codSettlements[idx].status = this.codSettlements[idx].variance === 0 ? 'SETTLED_VERIFIED' : 'DISPUTED';
    this.codSettlements[idx].cashierName = cashierName;
    this.codSettlements[idx].verifiedAt = new Date().toISOString();
    this.codSettlements[idx].receiptNumber = `REC-COD-${Date.now().toString().slice(-6)}`;

    this.save();
    return this.codSettlements[idx];
  }

  // Exceptions
  getExceptions(): LogisticsExceptionTicket[] {
    return [...this.exceptions];
  }

  getTickets(): LogisticsExceptionTicket[] {
    return [...this.exceptions];
  }

  resolveException(id: string, actionTaken: string): LogisticsExceptionTicket | undefined {
    const idx = this.exceptions.findIndex(e => e.id === id);
    if (idx === -1) return undefined;

    this.exceptions[idx].status = 'RESOLVED_CLOSED';
    this.exceptions[idx].resolvedAt = new Date().toISOString();
    this.exceptions[idx].actionTaken = actionTaken;

    this.save();
    return this.exceptions[idx];
  }

  // KPIs
  getKPIs(): LogisticsSummaryKpis {
    const total = this.orders.length;
    const delivered = this.orders.filter(o => o.status === 'DELIVERED').length;
    const inTransit = this.orders.filter(o => ['INBOUND_HUB', 'LINEHAUL_TRANSIT', 'OUTBOUND_DEST_HUB', 'OUT_FOR_DELIVERY', 'SORTED'].includes(o.status)).length;
    const failed = this.orders.filter(o => o.status === 'FAILED_DELIVERY' || o.status === 'RETURN_TO_SHIPPER').length;
    const totalWeight = this.orders.reduce((acc, curr) => acc + (curr.totalWeightKg || 0), 0) / 1000;
    const totalCod = this.orders.reduce((acc, curr) => acc + (curr.codAmount || 0), 0);

    return {
      totalShipmentsToday: total + 1420,
      inTransitCount: inTransit + 382,
      deliveredTodayCount: delivered + 980,
      failedExceptionCount: failed + 12,
      onTimeDeliveryRate: 98.4,
      totalWeightTonsToday: Math.round((totalWeight + 48.6) * 10) / 10,
      totalCodCollected: totalCod + 48500000,
      activeHubsCount: this.hubs.length,
      fleetUtilizationRate: 91.8,
      averageCostPerTonKm: 1420
    };
  }
}

export const logisticsService = new LogisticsService();
