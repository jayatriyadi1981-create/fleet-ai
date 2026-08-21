import {
  PudOrder,
  PudCourier,
  PudProofOfDelivery,
  PudExceptionTicket,
  PudCodSettlement,
  PudRoutePlan,
  PudTariffZone,
  PudKpis,
  PudOrderStatus,
  PudServiceType,
  VehicleCategory
} from '../types';

class PudService {
  private orders: PudOrder[] = [
    {
      id: 'pud-ord-001',
      orderNumber: 'PUD-2026-0821-001',
      trackingNumber: 'JKT-EXP-88901',
      merchantName: 'Apotek K-24 Menteng',
      merchantId: 'MCH-012',
      serviceType: 'INSTANT',
      status: 'OUT_FOR_DELIVERY',
      sender: {
        contactName: 'Staff Apotek Menteng (Rudi)',
        phone: '0812-9876-1122',
        addressLine: 'Jl. HOS Cokroaminoto No. 42, Menteng',
        district: 'Menteng',
        city: 'Jakarta Pusat',
        postalCode: '10350',
        lat: -6.1953,
        lng: 106.8285,
        notes: 'Depan kasir utama, paket obat medis'
      },
      recipient: {
        contactName: 'Ibu Ratna Dewi',
        phone: '0813-8822-9901',
        addressLine: 'Apartemen Sudirman Tower Lt. 18 Unit 18B',
        district: 'Setiabudi',
        city: 'Jakarta Selatan',
        postalCode: '12920',
        lat: -6.2185,
        lng: 106.8192,
        notes: 'Titip ke resepsionis lobby jika tidak di tempat'
      },
      parcel: {
        id: 'pcl-001',
        trackingNumber: 'JKT-EXP-88901',
        description: 'Paket Obat Resep & Suplemen',
        category: 'DOCUMENTS',
        weightKg: 0.8,
        volumeM3: 0.002,
        lengthCm: 20,
        widthCm: 15,
        heightCm: 10,
        itemValue: 450000,
        insuranceRequired: true
      },
      pickupTimeWindow: { startTime: '09:00', endTime: '09:30' },
      deliveryTimeWindow: { startTime: '10:00', endTime: '11:00' },
      assignedCourierId: 'cur-001',
      assignedCourierName: 'Budi Santoso',
      assignedCourierPhone: '0812-3456-7890',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'B 4120 TXY',
      paymentMethod: 'PREPAID',
      deliveryFee: 28000,
      codAmount: 0,
      notes: 'Harap bawa tas thermal anti-hujan',
      createdAt: '2026-08-21 08:30:00',
      updatedAt: '2026-08-21 09:40:00',
      pickupCompletedAt: '2026-08-21 09:18:00',
      slaDeadline: '2026-08-21 11:00:00',
      slaStatus: 'ON_TRACK',
      distanceKm: 4.8,
      estimatedDurationMins: 22,
      stopSequence: 1,
      publicTrackingCode: 'TRACK-88901'
    },
    {
      id: 'pud-ord-002',
      orderNumber: 'PUD-2026-0821-002',
      trackingNumber: 'JKT-EXP-88902',
      merchantName: 'Zalora Indonesia Hub BSD',
      merchantId: 'MCH-044',
      serviceType: 'SAME_DAY',
      status: 'OUT_FOR_DELIVERY',
      sender: {
        contactName: 'Gudang BSD Fashion (Agus)',
        phone: '0811-2233-4455',
        addressLine: 'Kawasan Industri BSD Blok C No. 5',
        district: 'Serpong',
        city: 'Tangerang Selatan',
        postalCode: '15310',
        lat: -6.3021,
        lng: 106.6521,
        notes: 'Gate Loading D-2'
      },
      recipient: {
        contactName: 'Sdr. Kevin Wijaya',
        phone: '0877-6655-4433',
        addressLine: 'Jl. Senopati Raya No. 88, Kebayoran Baru',
        district: 'Kebayoran Baru',
        city: 'Jakarta Selatan',
        postalCode: '12190',
        lat: -6.2341,
        lng: 106.8094,
        notes: 'Rumah pagar hitam samping cafe'
      },
      parcel: {
        id: 'pcl-002',
        trackingNumber: 'JKT-EXP-88902',
        description: 'Sepatu Sneakers & Jaket Denim',
        category: 'FASHION',
        weightKg: 2.4,
        volumeM3: 0.012,
        lengthCm: 35,
        widthCm: 25,
        heightCm: 15,
        itemValue: 1250000,
        insuranceRequired: true
      },
      pickupTimeWindow: { startTime: '08:00', endTime: '09:00' },
      deliveryTimeWindow: { startTime: '12:00', endTime: '15:00' },
      assignedCourierId: 'cur-002',
      assignedCourierName: 'Dimas Prasetyo',
      assignedCourierPhone: '0813-9988-7766',
      vehicleType: 'BLIND_VAN',
      vehiclePlate: 'B 9044 SXR',
      paymentMethod: 'COD',
      deliveryFee: 45000,
      codAmount: 1250000,
      isCodRemitted: false,
      notes: 'Tagih uang pas atau QRIS on delivery',
      createdAt: '2026-08-21 07:45:00',
      updatedAt: '2026-08-21 10:15:00',
      pickupCompletedAt: '2026-08-21 08:45:00',
      slaDeadline: '2026-08-21 15:00:00',
      slaStatus: 'ON_TRACK',
      distanceKm: 24.5,
      estimatedDurationMins: 48,
      stopSequence: 3,
      publicTrackingCode: 'TRACK-88902'
    },
    {
      id: 'pud-ord-003',
      orderNumber: 'PUD-2026-0821-003',
      trackingNumber: 'JKT-EXP-88903',
      merchantName: 'Toko Kopi Tuku Cipete',
      merchantId: 'MCH-089',
      serviceType: 'INSTANT',
      status: 'DELIVERED',
      sender: {
        contactName: 'Barista Tuku (Rian)',
        phone: '0812-4455-6677',
        addressLine: 'Jl. Cipete Raya No. 7, Cilandak',
        district: 'Cilandak',
        city: 'Jakarta Selatan',
        postalCode: '12410',
        lat: -6.2798,
        lng: 106.7981
      },
      recipient: {
        contactName: 'Amanda Putri',
        phone: '0819-1122-3344',
        addressLine: 'Gedung Menara BTPN Lt. 24, Mega Kuningan',
        district: 'Setiabudi',
        city: 'Jakarta Selatan',
        postalCode: '12950',
        lat: -6.2289,
        lng: 106.8276
      },
      parcel: {
        id: 'pcl-003',
        trackingNumber: 'JKT-EXP-88903',
        description: 'Kopi Literan & Donat Kampoeng',
        category: 'FOOD_BEVERAGE',
        weightKg: 3.0,
        volumeM3: 0.008,
        lengthCm: 25,
        widthCm: 20,
        heightCm: 18,
        itemValue: 185000,
        insuranceRequired: false
      },
      pickupTimeWindow: { startTime: '09:15', endTime: '09:45' },
      deliveryTimeWindow: { startTime: '10:15', endTime: '10:45' },
      assignedCourierId: 'cur-001',
      assignedCourierName: 'Budi Santoso',
      assignedCourierPhone: '0812-3456-7890',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'B 4120 TXY',
      paymentMethod: 'PREPAID',
      deliveryFee: 32000,
      codAmount: 0,
      createdAt: '2026-08-21 09:05:00',
      updatedAt: '2026-08-21 10:28:00',
      pickupCompletedAt: '2026-08-21 09:32:00',
      deliveredAt: '2026-08-21 10:28:00',
      slaDeadline: '2026-08-21 10:45:00',
      slaStatus: 'ON_TRACK',
      distanceKm: 8.2,
      estimatedDurationMins: 26,
      publicTrackingCode: 'TRACK-88903'
    },
    {
      id: 'pud-ord-004',
      orderNumber: 'PUD-2026-0821-004',
      trackingNumber: 'JKT-EXP-88904',
      merchantName: 'iBox Central Park Mall',
      merchantId: 'MCH-105',
      serviceType: 'INSTANT',
      status: 'PENDING_PICKUP',
      sender: {
        contactName: 'Staff Store iBox (Cindy)',
        phone: '0821-5566-7788',
        addressLine: 'Central Park Mall Lt. 1 Unit 120, Jl. Letjen S. Parman',
        district: 'Grogol Petamburan',
        city: 'Jakarta Barat',
        postalCode: '11470',
        lat: -6.1772,
        lng: 106.7903,
        notes: 'Ambil di customer service pickup counter'
      },
      recipient: {
        contactName: 'Bpk. Hendra Gunawan',
        phone: '0818-7788-9900',
        addressLine: 'Jl. Pluit Kencana No. 35, Pluit',
        district: 'Penjaringan',
        city: 'Jakarta Utara',
        postalCode: '14450',
        lat: -6.1215,
        lng: 106.7912
      },
      parcel: {
        id: 'pcl-004',
        trackingNumber: 'JKT-EXP-88904',
        description: 'iPad Pro 11-inch M4 & Apple Pencil',
        category: 'ELECTRONICS',
        weightKg: 1.5,
        volumeM3: 0.005,
        lengthCm: 30,
        widthCm: 22,
        heightCm: 8,
        itemValue: 18999000,
        insuranceRequired: true
      },
      pickupTimeWindow: { startTime: '11:00', endTime: '11:30' },
      deliveryTimeWindow: { startTime: '12:00', endTime: '13:00' },
      vehicleType: 'MOTORCYCLE',
      paymentMethod: 'PREPAID',
      deliveryFee: 42000,
      codAmount: 0,
      notes: 'Barang bernilai tinggi (High-Value Item) wajib segel tamper-evident',
      createdAt: '2026-08-21 10:30:00',
      updatedAt: '2026-08-21 10:30:00',
      slaDeadline: '2026-08-21 13:00:00',
      slaStatus: 'ON_TRACK',
      distanceKm: 9.4,
      estimatedDurationMins: 30,
      publicTrackingCode: 'TRACK-88904'
    },
    {
      id: 'pud-ord-005',
      orderNumber: 'PUD-2026-0821-005',
      trackingNumber: 'JKT-EXP-88905',
      merchantName: 'IKEA Alam Sutera',
      merchantId: 'MCH-023',
      serviceType: 'CARGO_BULKY',
      status: 'ASSIGNED_PICKUP',
      sender: {
        contactName: 'IKEA Bulky Dispatch (Tono)',
        phone: '0812-7788-9911',
        addressLine: 'Jl. Jalur Sutera Boulevard No. 45',
        district: 'Pinang',
        city: 'Tangerang',
        postalCode: '15143',
        lat: -6.2234,
        lng: 106.6623,
        notes: 'Loading Bay 4 Customer Pickup'
      },
      recipient: {
        contactName: 'Ibu Veronica Tan',
        phone: '0811-9988-1122',
        addressLine: 'Cluster Florence No. 12, Pantai Indah Kapuk 2',
        district: 'Kosambi',
        city: 'Tangerang',
        postalCode: '15214',
        lat: -6.0712,
        lng: 106.7118
      },
      parcel: {
        id: 'pcl-005',
        trackingNumber: 'JKT-EXP-88905',
        description: 'Meja Kerja Ergonomis & Kursi Kantor',
        category: 'GENERAL',
        weightKg: 45.0,
        volumeM3: 0.35,
        lengthCm: 140,
        widthCm: 80,
        heightCm: 35,
        itemValue: 4800000,
        insuranceRequired: true
      },
      pickupTimeWindow: { startTime: '11:15', endTime: '12:00' },
      deliveryTimeWindow: { startTime: '14:00', endTime: '17:00' },
      assignedCourierId: 'cur-003',
      assignedCourierName: 'Surya Dharmawan',
      assignedCourierPhone: '0812-8877-6655',
      vehicleType: 'PICKUP_BOX',
      vehiclePlate: 'B 9382 PQR',
      paymentMethod: 'CORPORATE_INVOICE',
      deliveryFee: 220000,
      codAmount: 0,
      notes: 'Termasuk bantuan angkut sampai depan pintu rumah',
      createdAt: '2026-08-21 09:50:00',
      updatedAt: '2026-08-21 10:10:00',
      slaDeadline: '2026-08-21 17:00:00',
      slaStatus: 'ON_TRACK',
      distanceKm: 32.0,
      estimatedDurationMins: 55,
      publicTrackingCode: 'TRACK-88905'
    },
    {
      id: 'pud-ord-006',
      orderNumber: 'PUD-2026-0821-006',
      trackingNumber: 'JKT-EXP-88906',
      merchantName: 'Gramedia Matraman',
      merchantId: 'MCH-056',
      serviceType: 'SAME_DAY',
      status: 'FAILED_DELIVERY',
      sender: {
        contactName: 'Staff Dispatch Gramedia (Bambang)',
        phone: '0813-2211-0099',
        addressLine: 'Jl. Matraman Raya No. 46-48',
        district: 'Matraman',
        city: 'Jakarta Timur',
        postalCode: '13150',
        lat: -6.1994,
        lng: 106.8572
      },
      recipient: {
        contactName: 'Bp. Farhan Alatas',
        phone: '0812-9900-1122',
        addressLine: 'Jl. Tebet Barat Dalam VII No. 14',
        district: 'Tebet',
        city: 'Jakarta Selatan',
        postalCode: '12810',
        lat: -6.2392,
        lng: 106.8481,
        notes: 'Pagar warna krem'
      },
      parcel: {
        id: 'pcl-006',
        trackingNumber: 'JKT-EXP-88906',
        description: 'Buku Ensiklopedia Sains & Novel',
        category: 'GENERAL',
        weightKg: 3.2,
        volumeM3: 0.008,
        lengthCm: 28,
        widthCm: 22,
        heightCm: 12,
        itemValue: 520000,
        insuranceRequired: false
      },
      pickupTimeWindow: { startTime: '08:30', endTime: '09:00' },
      deliveryTimeWindow: { startTime: '10:00', endTime: '12:00' },
      assignedCourierId: 'cur-004',
      assignedCourierName: 'Eko Wahyudi',
      assignedCourierPhone: '0813-1122-3344',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'B 3829 UTZ',
      paymentMethod: 'COD',
      deliveryFee: 25000,
      codAmount: 520000,
      isCodRemitted: false,
      notes: 'Penerima tidak ada di tempat dan nomor telepon tidak dapat dihubungi',
      createdAt: '2026-08-21 08:00:00',
      updatedAt: '2026-08-21 10:45:00',
      pickupCompletedAt: '2026-08-21 08:48:00',
      slaDeadline: '2026-08-21 12:00:00',
      slaStatus: 'BREACHED',
      distanceKm: 6.5,
      estimatedDurationMins: 20,
      publicTrackingCode: 'TRACK-88906'
    }
  ];

  private couriers: PudCourier[] = [
    {
      id: 'cur-001',
      courierCode: 'RIDER-01',
      name: 'Budi Santoso',
      phone: '0812-3456-7890',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'B 4120 TXY',
      status: 'ON_DELIVERY',
      currentLocation: {
        lat: -6.2088,
        lng: 106.8225,
        updatedAt: '2 Menit lalu',
        addressDescription: 'Jl. Jenderal Sudirman (Flyover Karet)'
      },
      assignedHubId: 'hub-jkt-selatan',
      assignedHubName: 'Hub Jakarta Selatan (Kuningan)',
      rating: 4.92,
      todayCompletedPickups: 6,
      todayCompletedDeliveries: 14,
      todayFailedTasks: 0,
      todayCodCollected: 1850000,
      todayCodRemitted: 1000000,
      currentActiveTasksCount: 2,
      maxCapacityKg: 30,
      currentLoadedKg: 8.5,
      batteryLevelPct: 84,
      shiftStartTime: '07:30',
      shiftEndTime: '16:30',
      dailyEarnings: 185000,
      totalIncentiveToday: 45000
    },
    {
      id: 'cur-002',
      courierCode: 'VAN-02',
      name: 'Dimas Prasetyo',
      phone: '0813-9988-7766',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      vehicleType: 'BLIND_VAN',
      vehiclePlate: 'B 9044 SXR',
      status: 'ON_DELIVERY',
      currentLocation: {
        lat: -6.2415,
        lng: 106.8122,
        updatedAt: '1 Menit lalu',
        addressDescription: 'Jl. Wolter Monginsidi, Kebayoran Baru'
      },
      assignedHubId: 'hub-jkt-selatan',
      assignedHubName: 'Hub Jakarta Selatan (Kuningan)',
      rating: 4.88,
      todayCompletedPickups: 3,
      todayCompletedDeliveries: 18,
      todayFailedTasks: 1,
      todayCodCollected: 4200000,
      todayCodRemitted: 2500000,
      currentActiveTasksCount: 5,
      maxCapacityKg: 650,
      currentLoadedKg: 310,
      batteryLevelPct: 92,
      shiftStartTime: '07:00',
      shiftEndTime: '16:00',
      dailyEarnings: 275000,
      totalIncentiveToday: 60000
    },
    {
      id: 'cur-003',
      courierCode: 'CARGO-03',
      name: 'Surya Dharmawan',
      phone: '0812-8877-6655',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      vehicleType: 'PICKUP_BOX',
      vehiclePlate: 'B 9382 PQR',
      status: 'ON_PICKUP',
      currentLocation: {
        lat: -6.2215,
        lng: 106.6645,
        updatedAt: '3 Menit lalu',
        addressDescription: 'Jalur Sutera Boulevard, Alam Sutera'
      },
      assignedHubId: 'hub-tangerang',
      assignedHubName: 'Hub Tangerang Raya (BSD)',
      rating: 4.95,
      todayCompletedPickups: 4,
      todayCompletedDeliveries: 6,
      todayFailedTasks: 0,
      todayCodCollected: 0,
      todayCodRemitted: 0,
      currentActiveTasksCount: 1,
      maxCapacityKg: 1200,
      currentLoadedKg: 450,
      batteryLevelPct: 76,
      shiftStartTime: '08:00',
      shiftEndTime: '17:00',
      dailyEarnings: 320000,
      totalIncentiveToday: 80000
    },
    {
      id: 'cur-004',
      courierCode: 'RIDER-04',
      name: 'Eko Wahyudi',
      phone: '0813-1122-3344',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'B 3829 UTZ',
      status: 'ONLINE_AVAILABLE',
      currentLocation: {
        lat: -6.2355,
        lng: 106.8512,
        updatedAt: 'Baru saja',
        addressDescription: 'Hub Cabang Tebet Timur'
      },
      assignedHubId: 'hub-jkt-timur',
      assignedHubName: 'Hub Jakarta Timur (Matraman)',
      rating: 4.79,
      todayCompletedPickups: 8,
      todayCompletedDeliveries: 12,
      todayFailedTasks: 1,
      todayCodCollected: 940000,
      todayCodRemitted: 940000,
      currentActiveTasksCount: 0,
      maxCapacityKg: 30,
      currentLoadedKg: 0,
      batteryLevelPct: 65,
      shiftStartTime: '07:30',
      shiftEndTime: '16:30',
      dailyEarnings: 160000,
      totalIncentiveToday: 30000
    },
    {
      id: 'cur-005',
      courierCode: 'RIDER-05',
      name: 'Farid Ramadhan',
      phone: '0857-3344-5566',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      vehicleType: 'ELECTRIC_BIKE',
      vehiclePlate: 'B 1980 EV',
      status: 'ONLINE_AVAILABLE',
      currentLocation: {
        lat: -6.1822,
        lng: 106.8244,
        updatedAt: '1 Menit lalu',
        addressDescription: 'Monas Barat Daya, Gambir'
      },
      assignedHubId: 'hub-jkt-pusat',
      assignedHubName: 'Hub Jakarta Pusat (Gambir)',
      rating: 4.90,
      todayCompletedPickups: 5,
      todayCompletedDeliveries: 11,
      todayFailedTasks: 0,
      todayCodCollected: 650000,
      todayCodRemitted: 650000,
      currentActiveTasksCount: 0,
      maxCapacityKg: 25,
      currentLoadedKg: 0,
      batteryLevelPct: 88,
      shiftStartTime: '08:00',
      shiftEndTime: '17:00',
      dailyEarnings: 155000,
      totalIncentiveToday: 35000
    }
  ];

  private epods: PudProofOfDelivery[] = [
    {
      id: 'epod-001',
      orderId: 'pud-ord-003',
      trackingNumber: 'JKT-EXP-88903',
      type: 'POD',
      timestamp: '2026-08-21 10:28:14',
      recipientName: 'Amanda Putri',
      recipientRelationship: 'SELF',
      signatureImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M10 20 Q 30 5, 60 25 T 110 15" stroke="%232563eb" stroke-width="2" fill="none"/></svg>',
      photoEvidenceUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400',
      gpsLocation: {
        lat: -6.2289,
        lng: 106.8276,
        accuracyMeters: 4.2
      },
      otpVerified: true,
      otpCodeUsed: '8492',
      courierId: 'cur-001',
      courierName: 'Budi Santoso',
      notes: 'Diterima langsung di lobby Menara BTPN lantai 24',
      podStatus: 'VALIDATED'
    }
  ];

  private exceptions: PudExceptionTicket[] = [
    {
      id: 'exc-001',
      ticketNumber: 'EXC-2026-0821-001',
      orderId: 'pud-ord-006',
      trackingNumber: 'JKT-EXP-88906',
      courierId: 'cur-004',
      courierName: 'Eko Wahyudi',
      exceptionType: 'RECIPIENT_NOT_HOME',
      notes: 'Rumah kosong, satpam komplek konfirmasi penerima sedang keluar kota sampai sore',
      proofPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
      createdAt: '2026-08-21 10:45:00',
      status: 'RESCHEDULED',
      rescheduledDate: '2026-08-21 16:30:00',
      actionTaken: 'CS telah hubungi pengirim Gramedia & disetujui kirim ulang shift sore'
    }
  ];

  private codSettlements: PudCodSettlement[] = [
    {
      id: 'cod-set-001',
      settlementNumber: 'COD-SET-2026-0821-01',
      courierId: 'cur-001',
      courierName: 'Budi Santoso',
      date: '2026-08-21',
      totalCollectedOrders: 4,
      totalCashAmount: 1400000,
      totalQrisAmount: 450000,
      remittedToHubAmount: 1000000,
      discrepancyAmount: 0,
      status: 'PENDING_REMITTANCE',
      verifiedByHubStaff: 'Kasir Hub Kuningan (Irene)',
      notes: 'Sisa Rp 850.000 akan disetor saat kembali ke Hub pukul 16:30',
      orders: [
        {
          orderNumber: 'PUD-2026-0821-001',
          trackingNumber: 'JKT-EXP-88901',
          customerName: 'Ibu Ratna Dewi',
          amount: 450000,
          paymentMode: 'QRIS',
          collectedAt: '2026-08-21 09:45:00'
        },
        {
          orderNumber: 'PUD-2026-0821-010',
          trackingNumber: 'JKT-EXP-88910',
          customerName: 'Toko Makmur Sejahtera',
          amount: 1400000,
          paymentMode: 'CASH',
          collectedAt: '2026-08-21 10:05:00'
        }
      ]
    }
  ];

  private routePlans: PudRoutePlan[] = [
    {
      id: 'rt-plan-001',
      routeCode: 'RTE-SELATAN-RIDER01',
      courierId: 'cur-001',
      courierName: 'Budi Santoso',
      vehiclePlate: 'B 4120 TXY',
      status: 'IN_PROGRESS',
      totalStops: 5,
      completedStops: 3,
      totalDistanceKm: 18.4,
      estimatedTotalTimeMins: 95,
      optimizedSequence: [
        {
          sequenceNumber: 1,
          taskType: 'PICKUP',
          orderId: 'pud-ord-001',
          trackingNumber: 'JKT-EXP-88901',
          address: 'Jl. HOS Cokroaminoto No. 42, Menteng',
          contactName: 'Staff Apotek Menteng',
          phone: '0812-9876-1122',
          lat: -6.1953,
          lng: 106.8285,
          timeWindow: '09:00 - 09:30',
          status: 'COMPLETED',
          eta: '09:15'
        },
        {
          sequenceNumber: 2,
          taskType: 'PICKUP',
          orderId: 'pud-ord-003',
          trackingNumber: 'JKT-EXP-88903',
          address: 'Jl. Cipete Raya No. 7, Cilandak',
          contactName: 'Barista Tuku',
          phone: '0812-4455-6677',
          lat: -6.2798,
          lng: 106.7981,
          timeWindow: '09:15 - 09:45',
          status: 'COMPLETED',
          eta: '09:30'
        },
        {
          sequenceNumber: 3,
          taskType: 'DELIVERY',
          orderId: 'pud-ord-003',
          trackingNumber: 'JKT-EXP-88903',
          address: 'Menara BTPN Lt. 24, Mega Kuningan',
          contactName: 'Amanda Putri',
          phone: '0819-1122-3344',
          lat: -6.2289,
          lng: 106.8276,
          timeWindow: '10:15 - 10:45',
          status: 'COMPLETED',
          eta: '10:25'
        },
        {
          sequenceNumber: 4,
          taskType: 'DELIVERY',
          orderId: 'pud-ord-001',
          trackingNumber: 'JKT-EXP-88901',
          address: 'Apartemen Sudirman Tower Lt. 18 Unit 18B',
          contactName: 'Ibu Ratna Dewi',
          phone: '0813-8822-9901',
          lat: -6.2185,
          lng: 106.8192,
          timeWindow: '10:00 - 11:00',
          status: 'ARRIVED',
          eta: '10:40'
        },
        {
          sequenceNumber: 5,
          taskType: 'DELIVERY',
          orderId: 'pud-ord-011',
          trackingNumber: 'JKT-EXP-88911',
          address: 'Gedung Wisma Nusantara Lt. 8, Thamrin',
          contactName: 'Bpk. Triyadi',
          phone: '0812-9988-7744',
          lat: -6.1925,
          lng: 106.8236,
          timeWindow: '11:15 - 12:00',
          status: 'PENDING',
          eta: '11:20'
        }
      ]
    }
  ];

  private tariffs: PudTariffZone[] = [
    {
      id: 'trf-001',
      zoneName: 'Dalam Kota Jabodetabek - Instant Bike',
      originCity: 'Jakarta',
      destinationCity: 'Jakarta',
      serviceType: 'INSTANT',
      baseFare: 20000,
      baseDistanceKm: 4,
      perKmRate: 2500,
      baseWeightKg: 5,
      perKgRate: 3000,
      estimatedHours: '1 - 2 Jam',
      surgeMultiplier: 1.0,
      active: true
    },
    {
      id: 'trf-002',
      zoneName: 'Jabodetabek Same-Day Van/Car',
      originCity: 'Jakarta',
      destinationCity: 'Tangerang / Bekasi / Depok',
      serviceType: 'SAME_DAY',
      baseFare: 45000,
      baseDistanceKm: 10,
      perKmRate: 3200,
      baseWeightKg: 20,
      perKgRate: 2000,
      estimatedHours: '4 - 6 Jam',
      surgeMultiplier: 1.0,
      active: true
    },
    {
      id: 'trf-003',
      zoneName: 'Cargo Bulky Pickup Box (Heavy Furniture/Appliances)',
      originCity: 'Jabodetabek',
      destinationCity: 'Jabodetabek',
      serviceType: 'CARGO_BULKY',
      baseFare: 180000,
      baseDistanceKm: 15,
      perKmRate: 5000,
      baseWeightKg: 100,
      perKgRate: 1200,
      estimatedHours: 'Same-Day / Next-Day',
      surgeMultiplier: 1.1,
      active: true
    }
  ];

  // Queries
  getOrders(): PudOrder[] {
    return [...this.orders];
  }

  getCouriers(): PudCourier[] {
    return [...this.couriers];
  }

  getEpods(): PudProofOfDelivery[] {
    return [...this.epods];
  }

  getExceptions(): PudExceptionTicket[] {
    return [...this.exceptions];
  }

  getCodSettlements(): PudCodSettlement[] {
    return [...this.codSettlements];
  }

  getRoutePlans(): PudRoutePlan[] {
    return [...this.routePlans];
  }

  getTariffs(): PudTariffZone[] {
    return [...this.tariffs];
  }

  getKpis(): PudKpis {
    const totalOrders = this.orders.length + 142; // realistic mock scale
    const completed = this.orders.filter(o => o.status === 'DELIVERED').length + 128;
    const failed = this.orders.filter(o => o.status === 'FAILED_DELIVERY').length + 3;
    const activeCouriers = this.couriers.filter(c => c.status !== 'OFFLINE').length;

    return {
      totalOrdersToday: totalOrders,
      pendingPickups: this.orders.filter(o => o.status === 'PENDING_PICKUP' || o.status === 'ASSIGNED_PICKUP').length,
      inTransitDeliveries: this.orders.filter(o => o.status === 'OUT_FOR_DELIVERY' || o.status === 'PICKING_UP').length,
      completedDeliveriesToday: completed,
      failedDeliveriesToday: failed,
      onTimeDeliveryRatePct: 97.4,
      firstAttemptDeliveryRatePct: 96.2,
      activeCouriersOnDuty: activeCouriers,
      totalCodCollectedToday: 18450000,
      totalCodRemittedToday: 14200000,
      averageDeliveryDurationMins: 34.2,
      customerSatisfactionScore: 4.88
    };
  }

  // Mutations
  createOrder(order: Partial<PudOrder>): PudOrder {
    const trackingNo = `JKT-EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: PudOrder = {
      id: `pud-ord-${Date.now()}`,
      orderNumber: `PUD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      trackingNumber: trackingNo,
      merchantName: order.merchantName || 'Direct Customer',
      merchantId: order.merchantId || 'MCH-DIR',
      serviceType: order.serviceType || 'INSTANT',
      status: 'PENDING_PICKUP',
      sender: order.sender || {
        contactName: 'Pengirim',
        phone: '0812-0000-0000',
        addressLine: 'Jl. Sudirman No. 1',
        district: 'Setiabudi',
        city: 'Jakarta Selatan',
        postalCode: '12920',
        lat: -6.2088,
        lng: 106.8225
      },
      recipient: order.recipient || {
        contactName: 'Penerima',
        phone: '0813-0000-0000',
        addressLine: 'Jl. Gatot Subroto No. 2',
        district: 'Mampang Prapatan',
        city: 'Jakarta Selatan',
        postalCode: '12710',
        lat: -6.2388,
        lng: 106.8225
      },
      parcel: order.parcel || {
        id: `pcl-${Date.now()}`,
        trackingNumber: trackingNo,
        description: 'Paket Reguler',
        category: 'GENERAL',
        weightKg: 1.0,
        volumeM3: 0.002,
        lengthCm: 20,
        widthCm: 15,
        heightCm: 10,
        itemValue: 100000,
        insuranceRequired: false
      },
      pickupTimeWindow: order.pickupTimeWindow || { startTime: '10:00', endTime: '11:00' },
      deliveryTimeWindow: order.deliveryTimeWindow || { startTime: '12:00', endTime: '14:00' },
      vehicleType: order.vehicleType || 'MOTORCYCLE',
      paymentMethod: order.paymentMethod || 'PREPAID',
      deliveryFee: order.deliveryFee || 25000,
      codAmount: order.codAmount || 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      slaStatus: 'ON_TRACK',
      distanceKm: order.distanceKm || 5.0,
      estimatedDurationMins: order.estimatedDurationMins || 25,
      publicTrackingCode: `TRACK-${Math.floor(10000 + Math.random() * 90000)}`
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  assignCourierToOrder(orderId: string, courierId: string): PudOrder | undefined {
    const order = this.orders.find(o => o.id === orderId);
    const courier = this.couriers.find(c => c.id === courierId);
    if (!order || !courier) return undefined;

    order.assignedCourierId = courier.id;
    order.assignedCourierName = courier.name;
    order.assignedCourierPhone = courier.phone;
    order.vehiclePlate = courier.vehiclePlate;
    order.status = 'ASSIGNED_PICKUP';
    order.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    courier.currentActiveTasksCount += 1;
    courier.currentLoadedKg += order.parcel.weightKg;
    if (courier.status === 'ONLINE_AVAILABLE') {
      courier.status = 'ON_PICKUP';
    }

    return order;
  }

  autoDispatchPendingOrders(): { assignedCount: number; messages: string[] } {
    let assigned = 0;
    const messages: string[] = [];
    const pendingOrders = this.orders.filter(o => o.status === 'PENDING_PICKUP');

    for (const order of pendingOrders) {
      // Find nearest suitable courier who is online
      const availableCourier = this.couriers.find(c => 
        (c.status === 'ONLINE_AVAILABLE' || c.status === 'ON_DELIVERY') &&
        c.vehicleType === order.vehicleType &&
        c.currentLoadedKg + order.parcel.weightKg <= c.maxCapacityKg
      );

      if (availableCourier) {
        this.assignCourierToOrder(order.id, availableCourier.id);
        assigned++;
        messages.push(`Order ${order.trackingNumber} berhasil dialokasikan ke ${availableCourier.name} (${availableCourier.vehiclePlate})`);
      }
    }

    return {
      assignedCount: assigned,
      messages: messages.length > 0 ? messages : ['Semua kurir yang sesuai sedang penuh atau tidak ada order pending.']
    };
  }

  submitEpod(epodData: Partial<PudProofOfDelivery>): PudProofOfDelivery {
    const order = this.orders.find(o => o.id === epodData.orderId);
    const newEpod: PudProofOfDelivery = {
      id: `epod-${Date.now()}`,
      orderId: epodData.orderId || '',
      trackingNumber: epodData.trackingNumber || (order ? order.trackingNumber : ''),
      type: epodData.type || 'POD',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      recipientName: epodData.recipientName || 'Penerima',
      recipientRelationship: epodData.recipientRelationship || 'SELF',
      signatureImageUrl: epodData.signatureImageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30"><path d="M5 15 Q 25 5, 50 20 T 95 10" stroke="%2316a34a" stroke-width="2" fill="none"/></svg>',
      photoEvidenceUrl: epodData.photoEvidenceUrl || 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400',
      gpsLocation: epodData.gpsLocation || { lat: -6.2088, lng: 106.8225, accuracyMeters: 5.0 },
      otpVerified: !!epodData.otpVerified,
      otpCodeUsed: epodData.otpCodeUsed,
      courierId: epodData.courierId || (order?.assignedCourierId || 'cur-001'),
      courierName: epodData.courierName || (order?.assignedCourierName || 'Kurir'),
      notes: epodData.notes || 'Pengiriman sukses diterima',
      podStatus: 'VALIDATED'
    };

    if (order) {
      order.status = 'DELIVERED';
      order.deliveredAt = newEpod.timestamp;
      order.updatedAt = newEpod.timestamp;
    }

    this.epods.unshift(newEpod);
    return newEpod;
  }

  createExceptionTicket(ticketData: Partial<PudExceptionTicket>): PudExceptionTicket {
    const order = this.orders.find(o => o.id === ticketData.orderId);
    const newTicket: PudExceptionTicket = {
      id: `exc-${Date.now()}`,
      ticketNumber: `EXC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: ticketData.orderId || '',
      trackingNumber: ticketData.trackingNumber || (order?.trackingNumber || ''),
      courierId: ticketData.courierId || (order?.assignedCourierId || 'cur-001'),
      courierName: ticketData.courierName || (order?.assignedCourierName || 'Kurir'),
      exceptionType: ticketData.exceptionType || 'RECIPIENT_NOT_HOME',
      notes: ticketData.notes || 'Kendala pengiriman dilaporkan oleh kurir',
      proofPhotoUrl: ticketData.proofPhotoUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'OPEN'
    };

    if (order) {
      order.status = 'FAILED_DELIVERY';
      order.updatedAt = newTicket.createdAt;
    }

    this.exceptions.unshift(newTicket);
    return newTicket;
  }

  // AI Copilot Integration
  generateAiDailyPudBriefing(): string {
    const kpis = this.getKpis();
    return `📦 **EXECUTIVE BRIEFING OPERASIONAL PICKUP & DELIVERY (PUD CONTROL TOWER)**
📅 **Tanggal**: 21 Agustus 2026 | ⏰ **Pukul**: 10:45 WIB
📍 **Area Operasional**: Jabodetabek Mega-Hub (Jakarta, Tangerang, Bekasi, Depok)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 **RINGKASAN TINGKAT LAYANAN & PERFORMA**:
• Total Order Masuk Hari Ini: **${kpis.totalOrdersToday} Paket**
• On-Time Delivery Rate (SLA): **${kpis.onTimeDeliveryRatePct}%** (Target Standar: >96.0% - *Status Prima*)
• First-Attempt Delivery Rate (FADR): **${kpis.firstAttemptDeliveryRatePct}%**
• Rata-rata Durasi Pengiriman Instant: **${kpis.averageDeliveryDurationMins} Menit**
• Total Kurir On-Duty: **${kpis.activeCouriersOnDuty} Kurir** (Rider Motor, Blind Van, & Cargo Box)
• Skor Kepuasan Pelanggan (CSAT): **${kpis.customerSatisfactionScore} / 5.0 ⭐**

💵 **REKONSILIASI KAS & CASH-ON-DELIVERY (COD)**:
• Total Uang COD Terkumpul Hari Ini: **Rp ${kpis.totalCodCollectedToday.toLocaleString()}**
• Total COD Telah Disetor ke Hub (Remittance): **Rp ${kpis.totalCodRemittedToday.toLocaleString()}**
• Rasio Digital Payment QRIS on Delivery: **32.8%** (Meningkat signifikan mengurangi risiko kas fisik)

⚠️ **RADAR RISIKO & BOTTLENECK LAPANGAN**:
• Terdeteksi kepadatan tinggi di koridor Rasuna Said & Gatot Subroto karena perbaikan jalan (Potensi keterlambatan 15-20 menit).
• Terdapat 1 tiket kendala penerima tidak di tempat (Gramedia Matraman) yang telah dijadwalkan ulang ke pengantaran sore.
• Hub Tangerang BSD mengalami lonjakan permintaan Same-Day Fashion sebesar +40% dari Zalora Hub.

💡 **REKOMENDASI OPTIMASI AI PUD DISPATCHER**:
1. Lakukan re-routing cerdas armada Blind Van B 9044 SXR menggunakan jalan arteri alternatif via Tendean - Wolter Monginsidi.
2. Alokasikan 2 kurir cadangan motor listrik di Hub Gambir untuk mengantisipasi lonjakan order makan siang Instant di perkantoran Sudirman-Thamrin.
3. Otomatisasi notifikasi pengingat WhatsApp interaktif kepada penerima COD agar menyiapkan nominal uang pas atau QRIS 15 menit sebelum kurir tiba.`;
  }
}

export const pudService = new PudService();
