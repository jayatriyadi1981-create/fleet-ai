/**
 * Fleet Intelligence Smart AI - Mining Operations & Fleet Service
 * Complete Service Layer for Mining Operations Management Suite
 */

import {
  MiningSite,
  MiningPit,
  MiningBench,
  MiningMaterial,
  MiningEquipmentAsset,
  MiningOperatorProfile,
  MiningShiftRecord,
  MiningDispatchCycle,
  MiningWeighbridgeTicket,
  MiningSafetyIncident,
  MiningOtrTyreLog,
  MiningCostPnl,
  AIMiningDailyBriefing,
  MiningDispatchCycleStatus,
  MiningEquipmentStatus
} from '../types';

class MiningService {
  private sites: MiningSite[] = [
    {
      id: 'site-kpc-01',
      code: 'SITE-KPC-SGT',
      name: 'Sangatta Coal Mining Project (Pit Hatari)',
      miningCompany: 'PT Kaltim Prima Coal (BUMI Resources Group)',
      contractor: 'PT Pama Persada Nusantara (PAMA)',
      commodityType: 'COAL',
      location: 'Kutai Timur, Kalimantan Timur',
      coordinates: { lat: 0.5412, lng: 117.5518 },
      boundaryPolygon: [
        { lat: 0.5500, lng: 117.5400 },
        { lat: 0.5520, lng: 117.5650 },
        { lat: 0.5350, lng: 117.5680 },
        { lat: 0.5320, lng: 117.5420 }
      ],
      operatingHours: '24 Jam Non-Stop (2 Shift: 06:00-18:00 & 18:00-06:00)',
      status: 'ACTIVE',
      productionTargetMonthlyTon: 1850000,
      productionTargetMonthlyBcm: 9500000,
      currentMonthActualTon: 1420000,
      safetyRules: [
        'Wajib APD Lengkap K3 Tambang (Helm, Rompi Reflektif, Safety Boot, Kacamata UV)',
        'Batas Kecepatan Maksimal Haul Road: 40 km/jam (Jalan Utama) & 20 km/jam (Front Pit/Disposal)',
        'Dilarang Membawa Ponsel Aktif saat Mengoperasikan Alat Berat Tanpa Handsfree DSS',
        'Jarak Aman Antar-Unit Dump Truck: Minimal 50 Meter saat Kecepatan Operasional'
      ],
      kttName: 'Ir. Agus Setyabudi, M.Sc (KTT Kelas 1 ESDM)',
      kttPhone: '+62 811-5542-8901',
      concessionAreaHa: 14500,
      totalActivePits: 4,
      totalAssignedFleets: 48,
      createdAt: '2025-01-15T08:00:00Z'
    },
    {
      id: 'site-morowali-02',
      code: 'SITE-VALE-MORO',
      name: 'Bahodopi Nickel Mine & Smelter Feed Project',
      miningCompany: 'PT Vale Indonesia Tbk / IMIP Consortium',
      contractor: 'PT Bukit Makmur Mandiri Utama (BUMA)',
      commodityType: 'NICKEL',
      location: 'Morowali, Sulawesi Tengah',
      coordinates: { lat: -2.8251, lng: 122.1582 },
      operatingHours: '24 Jam Non-Stop (Shift 1 & Shift 2)',
      status: 'ACTIVE',
      productionTargetMonthlyTon: 950000,
      productionTargetMonthlyBcm: 4200000,
      currentMonthActualTon: 780000,
      safetyRules: [
        'Wajib Pengujian Gas Beracun di Area Lembah Saprolite Terbuka',
        'Kamera Anti-Fatigue DSS Aktif 100% di Setiap Kabin Unit Hauler',
        'Water Truck Wajib Menyiram Haul Road Setiap 45 Menit di Musim Kemarau'
      ],
      kttName: 'Bambang Triatmojo, ST (KTT Madya)',
      kttPhone: '+62 812-8871-3344',
      concessionAreaHa: 8900,
      totalActivePits: 3,
      totalAssignedFleets: 32,
      createdAt: '2025-02-10T08:00:00Z'
    },
    {
      id: 'site-freeport-03',
      code: 'SITE-FI-GRASBERG',
      name: 'Grasberg Open Pit & Mineral Haulage',
      miningCompany: 'PT Freeport Indonesia (MIND ID Group)',
      contractor: 'PT Petrosea Tbk & Internal Mining Ops',
      commodityType: 'COPPER',
      location: 'Mimika, Papua Tengah (Ketinggian 4.285 mdpl)',
      coordinates: { lat: -4.0538, lng: 137.1165 },
      operatingHours: '24 Jam Non-Stop dengan Protokol Cuaca Ekstrem',
      status: 'ACTIVE',
      productionTargetMonthlyTon: 1200000,
      productionTargetMonthlyBcm: 5800000,
      currentMonthActualTon: 910000,
      safetyRules: [
        'Pemeriksaan Saturasi Oksigen & Tensi Operator Sebelum Masuk Shift di Ketinggian',
        'Penggunaan Rantai Roda Khusus saat Jalur Licin Berselimut Es/Kabut Tebal',
        'Pemberlakuan Red Alert saat Petir (Lightning Detector) Radius 5 KM'
      ],
      kttName: 'Dr. Michael Korwa, MT (KTT Utama)',
      kttPhone: '+62 813-9002-1188',
      concessionAreaHa: 21300,
      totalActivePits: 2,
      totalAssignedFleets: 55,
      createdAt: '2025-01-05T08:00:00Z'
    },
    {
      id: 'site-quarry-04',
      code: 'SITE-QUARRY-BOGOR',
      name: 'Rumpin Andesite & Limestone Quarry Site',
      miningCompany: 'PT Solusi Bangun Indonesia (SIG Group)',
      contractor: 'PT Adhi Persada Mining',
      commodityType: 'LIMESTONE',
      location: 'Rumpin, Bogor, Jawa Barat',
      coordinates: { lat: -6.4215, lng: 106.6120 },
      operatingHours: '07:00 - 18:00 (1 Shift Operasional & Peledakan)',
      status: 'ACTIVE',
      productionTargetMonthlyTon: 450000,
      productionTargetMonthlyBcm: 1800000,
      currentMonthActualTon: 360000,
      safetyRules: [
        'Evakuasi Seluruh Alat dan Personel 30 Menit Sebelum Jadwal Blasting Pukul 12:00',
        'Pembersihan Material Batuan Lepas di Jenjang Atas (Scaling Bench) Setiap Pagi'
      ],
      kttName: 'Ir. Dedi Supriyadi, MM',
      kttPhone: '+62 818-4421-0099',
      concessionAreaHa: 620,
      totalActivePits: 2,
      totalAssignedFleets: 18,
      createdAt: '2025-03-01T08:00:00Z'
    }
  ];

  private pits: MiningPit[] = [
    {
      id: 'pit-01',
      code: 'PIT-HATARI-SOUTH',
      name: 'Pit Hatari South Main Pit',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      coordinates: { lat: 0.5420, lng: 117.5525 },
      geofenceRadiusMeters: 1800,
      miningArea: 'Sektor 3 Blok Seam Pinang',
      currentBench: 'Bench RL +45 & RL +30',
      elevationRlMeters: 30.5,
      materialType: 'COAL',
      primaryTargetBcmDaily: 28000,
      status: 'ACTIVE',
      highwallRiskLevel: 'LOW',
      assignedExcavatorCodes: ['EX-1201 (PC1250)', 'EX-1202 (PC2000)'],
      activeDumpTrucksCount: 14,
      notes: 'Kondisi jalur hauling kering, stripping ratio OB optimal pada 4.8:1',
      lastBlastingDate: '2026-08-18',
      nextBlastingScheduled: '2026-08-25 12:00 WIB'
    },
    {
      id: 'pit-02',
      code: 'PIT-BENDILI-WEST',
      name: 'Pit Bendili West Overburden Cut',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      coordinates: { lat: 0.5380, lng: 117.5450 },
      geofenceRadiusMeters: 2200,
      miningArea: 'Blok Overburden Stripping 2',
      currentBench: 'Bench RL +90 (Top Level)',
      elevationRlMeters: 90.0,
      materialType: 'OVERBURDEN',
      primaryTargetBcmDaily: 45000,
      status: 'ACTIVE',
      highwallRiskLevel: 'MEDIUM',
      assignedExcavatorCodes: ['EX-1203 (CAT 6020B)', 'EX-1204 (PC1250)'],
      activeDumpTrucksCount: 18,
      notes: 'Pengupasan tanah penutup menuju Disposal Timur Sektor B',
      lastBlastingDate: '2026-08-19',
      nextBlastingScheduled: '2026-08-23 12:00 WIB'
    },
    {
      id: 'pit-03',
      code: 'PIT-SAPROLITE-01',
      name: 'Pit Nikel Saprolite High Grade',
      siteId: 'site-morowali-02',
      siteName: 'Bahodopi Nickel Mine & Smelter Feed Project',
      coordinates: { lat: -2.8240, lng: 122.1570 },
      geofenceRadiusMeters: 1500,
      miningArea: 'Bukit Bahodopi Blok Alpha',
      currentBench: 'Bench RL +120',
      elevationRlMeters: 120.0,
      materialType: 'NICKEL_ORE',
      primaryTargetBcmDaily: 16000,
      status: 'ACTIVE',
      highwallRiskLevel: 'LOW',
      assignedExcavatorCodes: ['EX-N01 (PC400)', 'EX-N02 (PC850)'],
      activeDumpTrucksCount: 10,
      notes: 'Kadar Ni 1.85% (Saprolite) dikirim ke EAF Smelter Line 4',
      lastBlastingDate: '2026-08-15',
      nextBlastingScheduled: '2026-08-28'
    },
    {
      id: 'pit-04',
      code: 'PIT-LIMONITE-LOW',
      name: 'Pit Limonite Low Grade (HPAL Feed)',
      siteId: 'site-morowali-02',
      siteName: 'Bahodopi Nickel Mine & Smelter Feed Project',
      coordinates: { lat: -2.8270, lng: 122.1610 },
      geofenceRadiusMeters: 1400,
      miningArea: 'Blok Lembah Limonite 2',
      currentBench: 'Bench RL +75',
      elevationRlMeters: 75.0,
      materialType: 'NICKEL_ORE',
      primaryTargetBcmDaily: 14000,
      status: 'ACTIVE',
      highwallRiskLevel: 'LOW',
      assignedExcavatorCodes: ['EX-N03 (PC400)'],
      activeDumpTrucksCount: 8,
      notes: 'Kadar Ni 1.25% (Limonite) untuk pabrik HPAL baterai EV',
      lastBlastingDate: '2026-08-10'
    },
    {
      id: 'pit-05',
      code: 'PIT-GRASBERG-HIGH',
      name: 'Grasberg Deep Open Pit Sector A',
      siteId: 'site-freeport-03',
      siteName: 'Grasberg Open Pit & Mineral Haulage',
      coordinates: { lat: -4.0545, lng: 137.1150 },
      geofenceRadiusMeters: 2500,
      miningArea: 'Deep Pit High Wall Zone',
      currentBench: 'Bench RL 3800m',
      elevationRlMeters: 3800.0,
      materialType: 'GOLD_ORE',
      primaryTargetBcmDaily: 35000,
      status: 'RESTRICTED',
      highwallRiskLevel: 'HIGH',
      assignedExcavatorCodes: ['EX-FP01 (CAT 7495 Electric)', 'EX-FP02 (PC4000)'],
      activeDumpTrucksCount: 22,
      notes: 'Zona lereng tinggi diawasi radar Slope Stability Radar (SSR) 24/7'
    }
  ];

  private benches: MiningBench[] = [
    {
      id: 'bnc-01',
      benchNumber: 'Bench RL +30 (Coal Loading Face)',
      pitId: 'pit-01',
      pitName: 'Pit Hatari South Main Pit',
      elevationRl: 30.0,
      materialId: 'mat-01',
      materialName: 'Thermal Coal (Seam Pinang GAR 5000)',
      materialCategory: 'COAL',
      workingAreaStatus: 'STABLE',
      loadingZoneName: 'Front Loading Alpha 1',
      haulingRouteId: 'route-h1',
      haulingRouteName: 'Main Haul Road Sangatta to Port Balikpapan Jetty (8.5 KM)',
      status: 'ACTIVE',
      widthMeters: 45,
      heightMeters: 10,
      safetyBermHeightMeters: 2.2
    },
    {
      id: 'bnc-02',
      benchNumber: 'Bench RL +45 (Interburden Shovel Face)',
      pitId: 'pit-01',
      pitName: 'Pit Hatari South Main Pit',
      elevationRl: 45.0,
      materialId: 'mat-05',
      materialName: 'Sandstone & Clay Overburden',
      materialCategory: 'OVERBURDEN',
      workingAreaStatus: 'STABLE',
      loadingZoneName: 'Front Loading Alpha 2',
      haulingRouteId: 'route-h2',
      haulingRouteName: 'Pit to In-Pit Disposal Dump Route (2.4 KM)',
      status: 'ACTIVE',
      widthMeters: 50,
      heightMeters: 12,
      safetyBermHeightMeters: 2.5
    },
    {
      id: 'bnc-03',
      benchNumber: 'Bench RL +90 (Top Soil & OB Cut)',
      pitId: 'pit-02',
      pitName: 'Pit Bendili West Overburden Cut',
      elevationRl: 90.0,
      materialId: 'mat-05',
      materialName: 'Hard Siltstone Overburden',
      materialCategory: 'OVERBURDEN',
      workingAreaStatus: 'STABLE',
      loadingZoneName: 'Front Loading Beta 1',
      haulingRouteId: 'route-h3',
      haulingRouteName: 'Bendili to Out-Pit Waste Disposal (4.1 KM)',
      status: 'ACTIVE',
      widthMeters: 60,
      heightMeters: 15,
      safetyBermHeightMeters: 3.0
    },
    {
      id: 'bnc-04',
      benchNumber: 'Bench RL +120 (Saprolite Ridge Face)',
      pitId: 'pit-03',
      pitName: 'Pit Nikel Saprolite High Grade',
      elevationRl: 120.0,
      materialId: 'mat-02',
      materialName: 'Saprolite High Grade Ore (1.85% Ni)',
      materialCategory: 'NICKEL_ORE',
      workingAreaStatus: 'STABLE',
      loadingZoneName: 'Front Loading Nikel 1',
      haulingRouteId: 'route-h4',
      haulingRouteName: 'Pit Morowali to Smelter Stockpile ROM (6.2 KM)',
      status: 'ACTIVE',
      widthMeters: 35,
      heightMeters: 8,
      safetyBermHeightMeters: 1.8
    }
  ];

  private materials: MiningMaterial[] = [
    {
      id: 'mat-01',
      materialCode: 'COAL-GAR5000',
      name: 'Thermal Coal Seam Pinang',
      category: 'COAL',
      densityTonPerM3: 1.32,
      gradeInfo: 'GAR 5,000 kcal/kg | Total Moisture 22% | Ash 6.5%',
      unit: 'TON',
      defaultDestination: 'STOCKPILE_ROM',
      stockpileName: 'ROM Stockpile Sangatta Port A',
      colorHex: '#1e293b'
    },
    {
      id: 'mat-02',
      materialCode: 'NICKEL-SAPROLITE-HG',
      name: 'Saprolite High Grade Ore',
      category: 'NICKEL_ORE',
      densityTonPerM3: 1.58,
      gradeInfo: 'Ni 1.85% - 2.10% | Fe 14% | SiO2/MgO 1.9',
      unit: 'WMT',
      defaultDestination: 'SMELTER_FEED',
      stockpileName: 'Smelter Feed ROM Pad 3',
      colorHex: '#059669'
    },
    {
      id: 'mat-03',
      materialCode: 'NICKEL-LIMONITE-LG',
      name: 'Limonite Low Grade (HPAL)',
      category: 'NICKEL_ORE',
      densityTonPerM3: 1.45,
      gradeInfo: 'Ni 1.20% - 1.35% | Co 0.12% | Fe 42%',
      unit: 'WMT',
      defaultDestination: 'STOCKPILE_ROM',
      stockpileName: 'HPAL Plant Feed Stockpile 2',
      colorHex: '#d97706'
    },
    {
      id: 'mat-04',
      materialCode: 'GOLD-COPPER-GRASBERG',
      name: 'Copper-Gold Massive Ore',
      category: 'GOLD_ORE',
      densityTonPerM3: 2.65,
      gradeInfo: 'Au 2.45 g/t | Cu 1.65% | Ag 8.2 g/t',
      unit: 'TON',
      defaultDestination: 'CRUSHER_PLANT',
      stockpileName: 'Primary Gyratory Crusher Hopper 1',
      colorHex: '#eab308'
    },
    {
      id: 'mat-05',
      materialCode: 'OB-SANDSTONE-SILT',
      name: 'Overburden Rock & Clay',
      category: 'OVERBURDEN',
      densityTonPerM3: 2.25,
      gradeInfo: 'Swell Factor 0.82 | Compressive Strength 45 MPa',
      unit: 'BCM',
      defaultDestination: 'DISPOSAL_DUMP',
      stockpileName: 'Disposal Dump Sektor Timur',
      colorHex: '#854d0e'
    },
    {
      id: 'mat-06',
      materialCode: 'QUARRY-ANDESITE-CRUSH',
      name: 'Andesite Rock Aggregate',
      category: 'LIMESTONE',
      densityTonPerM3: 2.50,
      gradeInfo: 'Abrasion < 18% | Specific Gravity 2.68',
      unit: 'TON',
      defaultDestination: 'CRUSHER_PLANT',
      stockpileName: 'Jaw Crusher Hopper Rumpin',
      colorHex: '#64748b'
    }
  ];

  private equipments: MiningEquipmentAsset[] = [
    // Excavator / Shovel
    {
      id: 'eq-ex-1201',
      code: 'EX-1201',
      name: 'Komatsu PC1250-8R Heavy Excavator',
      category: 'HYDRAULIC_EXCAVATOR',
      brand: 'Komatsu',
      model: 'PC1250-8R',
      serialNumber: 'KMT-PC1250-88412',
      capacityM3: 6.7,
      payloadCapacityTon: 14.5,
      hourMeter: 4820.5,
      fuelLevelPct: 78,
      fuelBurnRatePerHour: 88.5,
      gps: {
        lat: 0.5422,
        lng: 117.5528,
        speedKmh: 0,
        heading: 145,
        altitudeMeters: 31.0,
        lastUpdated: '2026-08-21T03:20:00Z'
      },
      telemetry: {
        engineRpm: 1850,
        oilPressureKpa: 420,
        coolantTempC: 84,
        hydraulicTempC: 68,
        payloadWeightTon: 12.8,
        tirePressureAvgPsi: 0,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-01',
      currentOperatorName: 'Surya Dharmawan (SIO-1)',
      status: 'LOADING',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-8891',
      siloExpiryDate: '2026-11-20',
      lastServiceHM: 4750,
      nextServiceDueHM: 5000,
      availabilityStats: {
        physicalAvailabilityPct: 94.2,
        utilizationAvailabilityPct: 88.5,
        mechanicalAvailabilityPct: 96.0,
        effectiveUtilizationPct: 83.1
      }
    },
    {
      id: 'eq-ex-1202',
      code: 'EX-1202',
      name: 'Komatsu PC2000-8 Mining Shovel',
      category: 'HYDRAULIC_EXCAVATOR',
      brand: 'Komatsu',
      model: 'PC2000-8',
      serialNumber: 'KMT-PC2000-99201',
      capacityM3: 12.0,
      payloadCapacityTon: 26.0,
      hourMeter: 6120.0,
      fuelLevelPct: 65,
      fuelBurnRatePerHour: 145.0,
      gps: {
        lat: 0.5415,
        lng: 117.5535,
        speedKmh: 0,
        heading: 90,
        altitudeMeters: 30.5,
        lastUpdated: '2026-08-21T03:21:00Z'
      },
      telemetry: {
        engineRpm: 1800,
        oilPressureKpa: 435,
        coolantTempC: 86,
        hydraulicTempC: 72,
        payloadWeightTon: 24.5,
        tirePressureAvgPsi: 0,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-02',
      currentOperatorName: 'Rudi Hartono (SIO-1 Master)',
      status: 'LOADING',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-9104',
      siloExpiryDate: '2026-12-15',
      lastServiceHM: 6000,
      nextServiceDueHM: 6250,
      availabilityStats: {
        physicalAvailabilityPct: 92.8,
        utilizationAvailabilityPct: 86.4,
        mechanicalAvailabilityPct: 94.5,
        effectiveUtilizationPct: 80.2
      }
    },
    // Dump Trucks / Haulers
    {
      id: 'eq-dt-785-01',
      code: 'DT-785-01',
      name: 'Komatsu HD785-7 Mining Dump Truck (100 Ton)',
      category: 'HAUL_TRUCK',
      brand: 'Komatsu',
      model: 'HD785-7',
      serialNumber: 'KMT-HD785-33101',
      capacityM3: 60.0,
      payloadCapacityTon: 91.0,
      hourMeter: 7420.5,
      fuelLevelPct: 82,
      fuelBurnRatePerHour: 62.0,
      gps: {
        lat: 0.5440,
        lng: 117.5550,
        speedKmh: 34,
        heading: 210,
        altitudeMeters: 45.0,
        lastUpdated: '2026-08-21T03:22:00Z'
      },
      telemetry: {
        engineRpm: 1950,
        oilPressureKpa: 410,
        coolantTempC: 85,
        hydraulicTempC: 62,
        payloadWeightTon: 88.5,
        tirePressureAvgPsi: 110,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-03',
      currentOperatorName: 'Agus Salim (KIMPER DT-785)',
      status: 'HAULING',
      assignedLoadingUnitCode: 'EX-1201',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-7741',
      siloExpiryDate: '2027-01-10',
      lastServiceHM: 7250,
      nextServiceDueHM: 7500,
      availabilityStats: {
        physicalAvailabilityPct: 91.5,
        utilizationAvailabilityPct: 85.0,
        mechanicalAvailabilityPct: 93.0,
        effectiveUtilizationPct: 77.8
      }
    },
    {
      id: 'eq-dt-785-02',
      code: 'DT-785-02',
      name: 'Komatsu HD785-7 Mining Dump Truck (100 Ton)',
      category: 'HAUL_TRUCK',
      brand: 'Komatsu',
      model: 'HD785-7',
      serialNumber: 'KMT-HD785-33102',
      capacityM3: 60.0,
      payloadCapacityTon: 91.0,
      hourMeter: 7180.0,
      fuelLevelPct: 74,
      fuelBurnRatePerHour: 64.5,
      gps: {
        lat: 0.5423,
        lng: 117.5529,
        speedKmh: 0,
        heading: 140,
        altitudeMeters: 31.0,
        lastUpdated: '2026-08-21T03:22:15Z'
      },
      telemetry: {
        engineRpm: 1200,
        oilPressureKpa: 390,
        coolantTempC: 83,
        hydraulicTempC: 60,
        payloadWeightTon: 62.4,
        tirePressureAvgPsi: 108,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-04',
      currentOperatorName: 'Deni Priyatna (KIMPER DT-785)',
      status: 'LOADING',
      assignedLoadingUnitCode: 'EX-1201',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-7742',
      siloExpiryDate: '2027-01-10',
      lastServiceHM: 7000,
      nextServiceDueHM: 7250,
      availabilityStats: {
        physicalAvailabilityPct: 93.0,
        utilizationAvailabilityPct: 87.2,
        mechanicalAvailabilityPct: 95.1,
        effectiveUtilizationPct: 81.0
      }
    },
    {
      id: 'eq-dt-777-03',
      code: 'DT-777-03',
      name: 'Caterpillar 777E Off-Highway Truck (100 Ton)',
      category: 'HAUL_TRUCK',
      brand: 'Caterpillar',
      model: 'CAT 777E',
      serialNumber: 'CAT-777E-66290',
      capacityM3: 60.2,
      payloadCapacityTon: 96.0,
      hourMeter: 8430.0,
      fuelLevelPct: 88,
      fuelBurnRatePerHour: 68.0,
      gps: {
        lat: 0.5480,
        lng: 117.5610,
        speedKmh: 28,
        heading: 45,
        altitudeMeters: 62.0,
        lastUpdated: '2026-08-21T03:22:20Z'
      },
      telemetry: {
        engineRpm: 1900,
        oilPressureKpa: 425,
        coolantTempC: 86,
        hydraulicTempC: 65,
        payloadWeightTon: 0.0,
        tirePressureAvgPsi: 112,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-05',
      currentOperatorName: 'Bambang Irawan',
      status: 'RETURNING',
      assignedLoadingUnitCode: 'EX-1202',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-5510',
      siloExpiryDate: '2026-10-30',
      lastServiceHM: 8250,
      nextServiceDueHM: 8500,
      availabilityStats: {
        physicalAvailabilityPct: 90.4,
        utilizationAvailabilityPct: 83.5,
        mechanicalAvailabilityPct: 92.0,
        effectiveUtilizationPct: 75.5
      }
    },
    // Support Equipments (Dozer, Grader, Water Truck, Fuel Truck)
    {
      id: 'eq-dz-375-01',
      code: 'DZ-375-01',
      name: 'Komatsu D375A-6 Mining Heavy Bulldozer',
      category: 'BULLDOZER',
      brand: 'Komatsu',
      model: 'D375A-6',
      serialNumber: 'KMT-D375-10492',
      capacityM3: 18.5,
      payloadCapacityTon: 72.0,
      hourMeter: 5120.0,
      fuelLevelPct: 62,
      fuelBurnRatePerHour: 55.0,
      gps: {
        lat: 0.5425,
        lng: 117.5532,
        speedKmh: 4,
        heading: 270,
        altitudeMeters: 31.5,
        lastUpdated: '2026-08-21T03:21:40Z'
      },
      telemetry: {
        engineRpm: 1750,
        oilPressureKpa: 410,
        coolantTempC: 85,
        hydraulicTempC: 70,
        payloadWeightTon: 0,
        tirePressureAvgPsi: 0,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentBenchId: 'bnc-01',
      currentBenchName: 'Bench RL +30 (Coal Loading Face)',
      currentOperatorId: 'op-06',
      currentOperatorName: 'Slamet Riyadi (KIMPER Dozer)',
      status: 'WORKING',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-4412',
      siloExpiryDate: '2027-02-14',
      lastServiceHM: 5000,
      nextServiceDueHM: 5250,
      availabilityStats: {
        physicalAvailabilityPct: 95.0,
        utilizationAvailabilityPct: 89.0,
        mechanicalAvailabilityPct: 96.5,
        effectiveUtilizationPct: 84.5
      }
    },
    {
      id: 'eq-mg-16m-01',
      code: 'MG-16M-01',
      name: 'Caterpillar 16M Haul Road Motor Grader',
      category: 'MOTOR_GRADER',
      brand: 'Caterpillar',
      model: '16M',
      serialNumber: 'CAT-16M-99120',
      capacityM3: 4.8,
      payloadCapacityTon: 32.0,
      hourMeter: 6840.0,
      fuelLevelPct: 70,
      fuelBurnRatePerHour: 34.0,
      gps: {
        lat: 0.5460,
        lng: 117.5580,
        speedKmh: 8,
        heading: 180,
        altitudeMeters: 50.0,
        lastUpdated: '2026-08-21T03:22:10Z'
      },
      telemetry: {
        engineRpm: 1600,
        oilPressureKpa: 395,
        coolantTempC: 82,
        hydraulicTempC: 58,
        payloadWeightTon: 0,
        tirePressureAvgPsi: 65,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentOperatorId: 'op-07',
      currentOperatorName: 'Joko Prabowo',
      status: 'WORKING',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2024-3311',
      siloExpiryDate: '2026-09-18',
      lastServiceHM: 6750,
      nextServiceDueHM: 7000,
      availabilityStats: {
        physicalAvailabilityPct: 93.5,
        utilizationAvailabilityPct: 86.0,
        mechanicalAvailabilityPct: 94.8,
        effectiveUtilizationPct: 80.4
      }
    },
    {
      id: 'eq-wt-01',
      code: 'WT-40KL-01',
      name: 'Scania P460 Water Truck Sprinkler (40,000L)',
      category: 'WATER_TRUCK',
      brand: 'Scania',
      model: 'P460 CB 8x4',
      serialNumber: 'SCN-WT-44109',
      capacityM3: 40.0,
      payloadCapacityTon: 40.0,
      hourMeter: 4320.0,
      fuelLevelPct: 85,
      fuelBurnRatePerHour: 28.5,
      gps: {
        lat: 0.5475,
        lng: 117.5595,
        speedKmh: 20,
        heading: 135,
        altitudeMeters: 55.0,
        lastUpdated: '2026-08-21T03:22:18Z'
      },
      telemetry: {
        engineRpm: 1500,
        oilPressureKpa: 400,
        coolantTempC: 80,
        hydraulicTempC: 50,
        payloadWeightTon: 38.0,
        tirePressureAvgPsi: 115,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentOperatorId: 'op-08',
      currentOperatorName: 'Yusuf Maulana',
      status: 'WORKING',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2025-1102',
      siloExpiryDate: '2027-03-22',
      lastServiceHM: 4250,
      nextServiceDueHM: 4500,
      availabilityStats: {
        physicalAvailabilityPct: 96.0,
        utilizationAvailabilityPct: 90.0,
        mechanicalAvailabilityPct: 97.0,
        effectiveUtilizationPct: 86.4
      }
    },
    {
      id: 'eq-ft-01',
      code: 'FT-20KL-01',
      name: 'Hino 500 Pitstop Fuel Bowser Truck (20,000L)',
      category: 'FUEL_TRUCK',
      brand: 'Hino',
      model: 'FM 260 JD',
      serialNumber: 'HNO-FT-88120',
      capacityM3: 20.0,
      payloadCapacityTon: 18.0,
      hourMeter: 3650.0,
      fuelLevelPct: 92,
      fuelBurnRatePerHour: 22.0,
      gps: {
        lat: 0.5430,
        lng: 117.5510,
        speedKmh: 0,
        heading: 0,
        altitudeMeters: 35.0,
        lastUpdated: '2026-08-21T03:20:50Z'
      },
      telemetry: {
        engineRpm: 900,
        oilPressureKpa: 380,
        coolantTempC: 78,
        hydraulicTempC: 45,
        payloadWeightTon: 17.5,
        tirePressureAvgPsi: 120,
        isEngineOn: true
      },
      currentSiteId: 'site-kpc-01',
      currentSiteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      currentPitId: 'pit-01',
      currentPitName: 'Pit Hatari South Main Pit',
      currentOperatorId: 'op-09',
      currentOperatorName: 'Ahmad Fauzi (Fuelman Senior)',
      status: 'STANDBY',
      siloCertificateNumber: 'SILO-DISNAKER-KTM-2025-2244',
      siloExpiryDate: '2027-04-10',
      lastServiceHM: 3500,
      nextServiceDueHM: 3750,
      availabilityStats: {
        physicalAvailabilityPct: 97.5,
        utilizationAvailabilityPct: 75.0,
        mechanicalAvailabilityPct: 98.0,
        effectiveUtilizationPct: 73.1
      }
    }
  ];

  private operators: MiningOperatorProfile[] = [
    {
      id: 'op-01',
      name: 'Surya Dharmawan',
      nik: '6408-0192-8810-0001',
      badgeNumber: 'PAMA-KPC-22041',
      phone: '+62 812-4419-8821',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      certificationNumber: 'SIO-ESDM-EX-2023-0912',
      certificationType: 'SIO Kelas 1 Excavator > 100 Ton',
      kimperNumber: 'KMP-KPC-EX-0991',
      kimperExpiryDate: '2027-05-15',
      authorizedEquipments: ['EXCAVATOR', 'HYDRAULIC_EXCAVATOR'],
      trainingHistory: [
        { courseName: 'Advanced Hydraulic Excavator PC1250/2000 Operation', trainingDate: '2024-02-10', validUntil: '2027-02-10', institution: 'UT School Komatsu' },
        { courseName: 'Mining Safety Golden Rules & Highwall Hazard Awareness', trainingDate: '2025-01-15', validUntil: '2027-01-15', institution: 'KPC HSE Training Center' }
      ],
      skillLevel: 'SENIOR',
      experienceYears: 11,
      totalOperatingHoursHM: 14200,
      currentShift: 'DAY_SHIFT',
      workingHoursToday: 6.5,
      drivingHoursToday: 5.8,
      fatigueScore: 18,
      safetyScore: 98,
      bloodPressureMorning: '120/80 mmHg',
      dssAlertsTodayCount: 0,
      assignedEquipmentCode: 'EX-1201',
      status: 'ACTIVE_WORKING'
    },
    {
      id: 'op-02',
      name: 'Rudi Hartono',
      nik: '6408-0588-7712-0002',
      badgeNumber: 'PAMA-KPC-19012',
      phone: '+62 813-8822-1100',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      certificationNumber: 'SIO-ESDM-EX-2022-0144',
      certificationType: 'SIO Kelas 1 Mining Shovel & Super Heavy Excavator',
      kimperNumber: 'KMP-KPC-EX-0552',
      kimperExpiryDate: '2026-10-20',
      authorizedEquipments: ['EXCAVATOR', 'HYDRAULIC_EXCAVATOR'],
      trainingHistory: [
        { courseName: 'Mining Shovel PC2000 Production Optimization', trainingDate: '2023-04-12', validUntil: '2026-04-12', institution: 'PAMA Academy' }
      ],
      skillLevel: 'MASTER',
      experienceYears: 16,
      totalOperatingHoursHM: 19800,
      currentShift: 'DAY_SHIFT',
      workingHoursToday: 6.5,
      drivingHoursToday: 6.0,
      fatigueScore: 22,
      safetyScore: 99,
      bloodPressureMorning: '118/78 mmHg',
      dssAlertsTodayCount: 0,
      assignedEquipmentCode: 'EX-1202',
      status: 'ACTIVE_WORKING'
    },
    {
      id: 'op-03',
      name: 'Agus Salim',
      nik: '6408-1194-6621-0003',
      badgeNumber: 'PAMA-KPC-24105',
      phone: '+62 821-9988-3341',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      certificationNumber: 'SIO-ESDM-DT-2023-4411',
      certificationType: 'SIO Kelas 1 Heavy Haul Truck > 80 Ton',
      kimperNumber: 'KMP-KPC-DT-8812',
      kimperExpiryDate: '2027-08-30',
      authorizedEquipments: ['HAUL_TRUCK', 'DUMP_TRUCK'],
      trainingHistory: [
        { courseName: 'Komatsu HD785-7 Defensive Driving & Retarder Braking', trainingDate: '2024-05-18', validUntil: '2027-05-18', institution: 'KPC Driver Academy' }
      ],
      skillLevel: 'SENIOR',
      experienceYears: 8,
      totalOperatingHoursHM: 9400,
      currentShift: 'DAY_SHIFT',
      workingHoursToday: 6.5,
      drivingHoursToday: 5.5,
      fatigueScore: 25,
      safetyScore: 96,
      bloodPressureMorning: '122/82 mmHg',
      dssAlertsTodayCount: 0,
      assignedEquipmentCode: 'DT-785-01',
      status: 'ACTIVE_WORKING'
    },
    {
      id: 'op-04',
      name: 'Deni Priyatna',
      nik: '6408-0496-5512-0004',
      badgeNumber: 'PAMA-KPC-25088',
      phone: '+62 852-7712-4490',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      certificationNumber: 'SIO-ESDM-DT-2024-1109',
      certificationType: 'SIO Kelas 1 Heavy Haul Truck > 80 Ton',
      kimperNumber: 'KMP-KPC-DT-9941',
      kimperExpiryDate: '2027-11-12',
      authorizedEquipments: ['HAUL_TRUCK', 'DUMP_TRUCK'],
      trainingHistory: [
        { courseName: 'Safety Haulage & Blindspot Mitigation in Active Pit', trainingDate: '2024-08-10', validUntil: '2027-08-10', institution: 'PAMA Safety Center' }
      ],
      skillLevel: 'JUNIOR',
      experienceYears: 4,
      totalOperatingHoursHM: 4800,
      currentShift: 'DAY_SHIFT',
      workingHoursToday: 6.5,
      drivingHoursToday: 5.2,
      fatigueScore: 32,
      safetyScore: 94,
      bloodPressureMorning: '124/84 mmHg',
      dssAlertsTodayCount: 1,
      assignedEquipmentCode: 'DT-785-02',
      status: 'ACTIVE_WORKING'
    }
  ];

  private shifts: MiningShiftRecord[] = [
    {
      id: 'shift-d-20260821-01',
      shiftCode: 'SHIFT-DAY-210826-01',
      shiftType: 'DAY_SHIFT',
      shiftDate: '2026-08-21',
      startTime: '06:00 WIB',
      endTime: '18:00 WIB',
      siteId: 'site-kpc-01',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitId: 'pit-01',
      pitName: 'Pit Hatari South Main Pit',
      supervisorName: 'Ir. Ferry Irawan (Mining Pit Superintendent)',
      activeEquipmentCount: 28,
      activeOperatorsCount: 32,
      targetTon: 62000,
      actualTon: 44800,
      targetBcm: 320000,
      actualBcm: 238000,
      totalTrips: 482,
      totalFuelConsumedLiters: 28450,
      toolboxMeetingTopic: 'P5M: Kesiapan Jalur Haul Road Basah & Disiplin Jarak Aman 50M saat Turun Hujan Gerimis',
      weatherCondition: 'CLOUDY',
      rainDelayHours: 0.0,
      slipperyDelayHours: 0.0,
      status: 'ONGOING'
    }
  ];

  private dispatchCycles: MiningDispatchCycle[] = [
    {
      id: 'cyc-01',
      cycleNumber: 'CYC-KPC-260821-0089',
      excavatorId: 'eq-ex-1201',
      excavatorCode: 'EX-1201 (PC1250)',
      dumpTruckId: 'eq-dt-785-01',
      dumpTruckCode: 'DT-785-01 (HD785)',
      operatorId: 'op-03',
      operatorName: 'Agus Salim',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitName: 'Pit Hatari South Main Pit',
      benchName: 'Bench RL +30 (Coal Loading Face)',
      loadingPoint: 'Front Loading Alpha 1',
      dumpingPoint: 'ROM Stockpile Sangatta Port A',
      materialName: 'Thermal Coal Seam Pinang',
      materialCategory: 'COAL',
      payloadTon: 88.5,
      payloadBcm: 67.0,
      status: 'HAULING',
      startTime: '09:42 WIB',
      queueLoadingTimeMin: 1.2,
      loadingTimeMin: 3.4,
      haulingTimeMin: 12.8,
      queueDumpingTimeMin: 0.8,
      dumpingTimeMin: 1.5,
      returnTimeMin: 10.2,
      totalCycleTimeMin: 29.9,
      haulingDistanceKm: 8.5,
      avgHaulSpeedKmh: 34.2,
      matchFactor: 0.96,
      notes: 'Ritase lancar, muatan optimal 88.5 Ton (target 90 Ton)'
    },
    {
      id: 'cyc-02',
      cycleNumber: 'CYC-KPC-260821-0090',
      excavatorId: 'eq-ex-1201',
      excavatorCode: 'EX-1201 (PC1250)',
      dumpTruckId: 'eq-dt-785-02',
      dumpTruckCode: 'DT-785-02 (HD785)',
      operatorId: 'op-04',
      operatorName: 'Deni Priyatna',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitName: 'Pit Hatari South Main Pit',
      benchName: 'Bench RL +30 (Coal Loading Face)',
      loadingPoint: 'Front Loading Alpha 1',
      dumpingPoint: 'ROM Stockpile Sangatta Port A',
      materialName: 'Thermal Coal Seam Pinang',
      materialCategory: 'COAL',
      payloadTon: 62.4,
      payloadBcm: 47.2,
      status: 'LOADING',
      startTime: '09:55 WIB',
      queueLoadingTimeMin: 0.5,
      loadingTimeMin: 2.1,
      haulingTimeMin: 0,
      queueDumpingTimeMin: 0,
      dumpingTimeMin: 0,
      returnTimeMin: 0,
      totalCycleTimeMin: 0,
      haulingDistanceKm: 8.5,
      avgHaulSpeedKmh: 0,
      matchFactor: 0.96,
      notes: 'Pass ke-4 dari 6 pass bucket PC1250'
    },
    {
      id: 'cyc-03',
      cycleNumber: 'CYC-KPC-260821-0091',
      excavatorId: 'eq-ex-1202',
      excavatorCode: 'EX-1202 (PC2000)',
      dumpTruckId: 'eq-dt-777-03',
      dumpTruckCode: 'DT-777-03 (CAT 777E)',
      operatorId: 'op-05',
      operatorName: 'Bambang Irawan',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitName: 'Pit Hatari South Main Pit',
      benchName: 'Bench RL +30 (Coal Loading Face)',
      loadingPoint: 'Front Loading Alpha 2',
      dumpingPoint: 'Disposal Dump Sektor Timur',
      materialName: 'Sandstone & Clay Overburden',
      materialCategory: 'OVERBURDEN',
      payloadTon: 0.0,
      payloadBcm: 0.0,
      status: 'RETURNING',
      startTime: '09:30 WIB',
      queueLoadingTimeMin: 0.8,
      loadingTimeMin: 2.2,
      haulingTimeMin: 6.5,
      queueDumpingTimeMin: 0.5,
      dumpingTimeMin: 1.2,
      returnTimeMin: 5.8,
      totalCycleTimeMin: 17.0,
      haulingDistanceKm: 3.8,
      avgHaulSpeedKmh: 36.5,
      matchFactor: 1.04,
      notes: 'Kembali kosongan dari Disposal Timur menuju Front Shovel EX-1202'
    }
  ];

  private weighbridgeTickets: MiningWeighbridgeTicket[] = [
    {
      id: 'wb-tk-01',
      ticketNumber: 'WB-SGT-20260821-0412',
      date: '2026-08-21',
      timeIn: '09:20:14 WIB',
      timeOut: '09:21:05 WIB',
      dumpTruckCode: 'DT-785-01',
      operatorName: 'Agus Salim',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitOrigin: 'Pit Hatari South Main Pit',
      destinationStockpile: 'ROM Stockpile Sangatta Port A',
      materialName: 'Thermal Coal Seam Pinang',
      grossWeightTon: 161.5,
      tareWeightTon: 72.0,
      netPayloadTon: 89.5,
      targetCapacityTon: 91.0,
      complianceStatus: 'OPTIMAL',
      weighbridgeScaleId: 'WEIGHBRIDGE-SCALE-01 (Avery Weigh-Tronix 200T)',
      rfidCardTag: 'RFID-TAG-DT785-01'
    },
    {
      id: 'wb-tk-02',
      ticketNumber: 'WB-SGT-20260821-0413',
      date: '2026-08-21',
      timeIn: '09:25:30 WIB',
      timeOut: '09:26:15 WIB',
      dumpTruckCode: 'DT-777-03',
      operatorName: 'Bambang Irawan',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitOrigin: 'Pit Hatari South Main Pit',
      destinationStockpile: 'Disposal Dump Sektor Timur',
      materialName: 'Sandstone & Clay Overburden',
      grossWeightTon: 168.2,
      tareWeightTon: 71.5,
      netPayloadTon: 96.7,
      targetCapacityTon: 96.0,
      complianceStatus: 'OPTIMAL',
      weighbridgeScaleId: 'WEIGHBRIDGE-SCALE-02 (Avery Weigh-Tronix 200T)',
      rfidCardTag: 'RFID-TAG-DT777-03'
    }
  ];

  private safetyIncidents: MiningSafetyIncident[] = [
    {
      id: 'inc-01',
      incidentCode: 'INC-HSE-KPC-2026-004',
      date: '2026-08-16 14:30 WIB',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      pitName: 'Pit Hatari South Main Pit',
      locationDetails: 'Simpang Tiga Haul Road KM 4.2',
      severity: 'LOW',
      category: 'NEAR_MISS',
      involvedEquipmentCode: 'DT-785-08 & LV-04',
      operatorName: 'Hendra Setiawan & Staff Survey',
      description: 'Kendaraan ringan (Light Vehicle) mendahului dump truck di area blindspot tanpa konfirmasi radio komunikasi channel 4.',
      immediateAction: 'Penghentian sementara operasional LV, peringatan radio terbuka oleh Dispatcher, dan coaching 1-on-1 pengemudi LV.',
      rootCauseAnalysis: 'Ketidaksabaran pengemudi LV dan pelanggaran SOP komunikasi radio sebelum mendahului alat berat bermuatan.',
      correctiveActions: [
        'Wajib broadcast radio 2 arah sebelum mendahului unit Hauler',
        'Pemasangan bendera tiang tinggi (Buggy Whip 3.5 meter) dengan lampu strobo LED di semua unit LV',
        'Sosialisasi ulang K3 SOP Mendahului pada P5M Shift'
      ],
      investigatorKtt: 'Ir. Agus Setyabudi, M.Sc (KTT KPC)',
      status: 'CLOSED'
    }
  ];

  private otrTyres: MiningOtrTyreLog[] = [
    {
      id: 'tyre-01',
      tyreSerialNumber: 'BS-27R49-881024',
      equipmentCode: 'DT-785-01',
      position: 'FRONT_LEFT',
      brand: 'Bridgestone',
      size: '27.00R49 V-Steel Rock E-Lug',
      initialTreadDepthMm: 95.0,
      currentTreadDepthMm: 72.5,
      treadWearPct: 23.7,
      currentPressurePsi: 110,
      recommendedPressurePsi: 110,
      tkphRating: 420,
      operatingHours: 2450,
      estimatedCostPerOperatingHourIdr: 42500,
      conditionStatus: 'EXCELLENT'
    },
    {
      id: 'tyre-02',
      tyreSerialNumber: 'MCH-27R49-994112',
      equipmentCode: 'DT-785-01',
      position: 'REAR_OUTER_RIGHT',
      brand: 'Michelin',
      size: '27.00R49 X-Traction E4',
      initialTreadDepthMm: 98.0,
      currentTreadDepthMm: 64.0,
      treadWearPct: 34.6,
      currentPressurePsi: 108,
      recommendedPressurePsi: 110,
      tkphRating: 440,
      operatingHours: 3200,
      estimatedCostPerOperatingHourIdr: 44000,
      conditionStatus: 'GOOD'
    }
  ];

  private costPnlRecords: MiningCostPnl[] = [
    {
      id: 'pnl-ex-1201',
      equipmentCode: 'EX-1201',
      equipmentType: 'HYDRAULIC_EXCAVATOR',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      periodMonth: 'Agustus 2026',
      operatingHoursHM: 420.5,
      productionTon: 342000,
      productionBcm: 155000,
      revenueIdr: 1881000000, // Rp 5.500 / Ton
      fuelCostIdr: 539691250, // 37.214 L * Rp 14.500
      maintenanceCostIdr: 185000000,
      tyreCostIdr: 0,
      operatorWagesIdr: 48000000,
      depreciationCostIdr: 220000000,
      totalCostIdr: 992691250,
      netMarginIdr: 888308750,
      marginPct: 47.2,
      costPerTonIdr: 2902,
      costPerBcmIdr: 6404,
      costPerKmIdr: 0
    },
    {
      id: 'pnl-dt-785-01',
      equipmentCode: 'DT-785-01',
      equipmentType: 'HAUL_TRUCK',
      siteName: 'Sangatta Coal Mining Project (Pit Hatari)',
      periodMonth: 'Agustus 2026',
      operatingHoursHM: 435.0,
      productionTon: 118000,
      productionBcm: 53600,
      revenueIdr: 944000000, // Rp 8.000 / Ton-KM
      fuelCostIdr: 391065000, // 26.970 L * Rp 14.500
      maintenanceCostIdr: 98000000,
      tyreCostIdr: 38500000,
      operatorWagesIdr: 42000000,
      depreciationCostIdr: 145000000,
      totalCostIdr: 714565000,
      netMarginIdr: 229435000,
      marginPct: 24.3,
      costPerTonIdr: 6055,
      costPerBcmIdr: 13331,
      costPerKmIdr: 712
    }
  ];

  // Getters
  getSites(): MiningSite[] {
    return [...this.sites];
  }

  getPits(): MiningPit[] {
    return [...this.pits];
  }

  getBenches(): MiningBench[] {
    return [...this.benches];
  }

  getMaterials(): MiningMaterial[] {
    return [...this.materials];
  }

  getEquipments(): MiningEquipmentAsset[] {
    return [...this.equipments];
  }

  getOperators(): MiningOperatorProfile[] {
    return [...this.operators];
  }

  getShifts(): MiningShiftRecord[] {
    return [...this.shifts];
  }

  getDispatchCycles(): MiningDispatchCycle[] {
    return [...this.dispatchCycles];
  }

  getWeighbridgeTickets(): MiningWeighbridgeTicket[] {
    return [...this.weighbridgeTickets];
  }

  getSafetyIncidents(): MiningSafetyIncident[] {
    return [...this.safetyIncidents];
  }

  getOtrTyres(): MiningOtrTyreLog[] {
    return [...this.otrTyres];
  }

  getCostPnlRecords(): MiningCostPnl[] {
    return [...this.costPnlRecords];
  }

  // Mutations
  addSite(siteData: Partial<MiningSite>): MiningSite {
    const newSite: MiningSite = {
      id: `site-${Date.now()}`,
      code: siteData.code || `SITE-${Date.now().toString().slice(-4)}`,
      name: siteData.name || 'Tambang Baru',
      miningCompany: siteData.miningCompany || 'PT Mining Company Indonesia',
      contractor: siteData.contractor || 'PT Kontraktor Tambang',
      commodityType: siteData.commodityType || 'COAL',
      location: siteData.location || 'Kalimantan Timur',
      coordinates: siteData.coordinates || { lat: -0.5, lng: 117.0 },
      operatingHours: siteData.operatingHours || '24 Jam Non-Stop (2 Shifts)',
      status: siteData.status || 'ACTIVE',
      productionTargetMonthlyTon: siteData.productionTargetMonthlyTon || 1000000,
      productionTargetMonthlyBcm: siteData.productionTargetMonthlyBcm || 5000000,
      currentMonthActualTon: 0,
      safetyRules: siteData.safetyRules || ['Wajib APD Lengkap K3 Tambang'],
      kttName: siteData.kttName || 'Kepala Teknik Tambang',
      kttPhone: siteData.kttPhone || '+62 811-0000-0000',
      concessionAreaHa: siteData.concessionAreaHa || 5000,
      totalActivePits: 1,
      totalAssignedFleets: 10,
      createdAt: new Date().toISOString()
    };
    this.sites.unshift(newSite);
    return newSite;
  }

  addPit(pitData: Partial<MiningPit>): MiningPit {
    const newPit: MiningPit = {
      id: `pit-${Date.now()}`,
      code: pitData.code || `PIT-${Date.now().toString().slice(-4)}`,
      name: pitData.name || 'Pit Tambang Baru',
      siteId: pitData.siteId || this.sites[0].id,
      siteName: pitData.siteName || this.sites[0].name,
      coordinates: pitData.coordinates || { lat: -0.5, lng: 117.0 },
      geofenceRadiusMeters: pitData.geofenceRadiusMeters || 1500,
      miningArea: pitData.miningArea || 'Blok Utama',
      currentBench: pitData.currentBench || 'Bench RL +50',
      elevationRlMeters: pitData.elevationRlMeters || 50,
      materialType: pitData.materialType || 'COAL',
      primaryTargetBcmDaily: pitData.primaryTargetBcmDaily || 20000,
      status: pitData.status || 'ACTIVE',
      highwallRiskLevel: pitData.highwallRiskLevel || 'LOW',
      assignedExcavatorCodes: pitData.assignedExcavatorCodes || ['EX-1201'],
      activeDumpTrucksCount: pitData.activeDumpTrucksCount || 6,
      notes: pitData.notes || 'Pit baru dibuat'
    };
    this.pits.unshift(newPit);
    return newPit;
  }

  addBench(benchData: Partial<MiningBench>): MiningBench {
    const newBench: MiningBench = {
      id: `bnc-${Date.now()}`,
      benchNumber: benchData.benchNumber || `Bench RL +${benchData.elevationRl || 50}`,
      pitId: benchData.pitId || this.pits[0].id,
      pitName: benchData.pitName || this.pits[0].name,
      elevationRl: benchData.elevationRl || 50,
      materialId: benchData.materialId || this.materials[0].id,
      materialName: benchData.materialName || this.materials[0].name,
      materialCategory: benchData.materialCategory || 'COAL',
      workingAreaStatus: benchData.workingAreaStatus || 'STABLE',
      loadingZoneName: benchData.loadingZoneName || 'Front Loading Baru',
      haulingRouteId: benchData.haulingRouteId || 'route-01',
      haulingRouteName: benchData.haulingRouteName || 'Haul Road Utama (4.0 KM)',
      status: benchData.status || 'ACTIVE',
      widthMeters: benchData.widthMeters || 40,
      heightMeters: benchData.heightMeters || 10,
      safetyBermHeightMeters: benchData.safetyBermHeightMeters || 2.0
    };
    this.benches.unshift(newBench);
    return newBench;
  }

  addMaterial(matData: Partial<MiningMaterial>): MiningMaterial {
    const newMat: MiningMaterial = {
      id: `mat-${Date.now()}`,
      materialCode: matData.materialCode || `MAT-${Date.now().toString().slice(-4)}`,
      name: matData.name || 'Material Tambang',
      category: matData.category || 'COAL',
      densityTonPerM3: matData.densityTonPerM3 || 1.3,
      gradeInfo: matData.gradeInfo,
      unit: matData.unit || 'TON',
      defaultDestination: matData.defaultDestination || 'STOCKPILE_ROM',
      stockpileName: matData.stockpileName || 'ROM Stockpile Utama',
      colorHex: matData.colorHex || '#3b82f6'
    };
    this.materials.unshift(newMat);
    return newMat;
  }

  updateEquipmentStatus(id: string, status: MiningEquipmentStatus): MiningEquipmentAsset | null {
    const eq = this.equipments.find(e => e.id === id || e.code === id);
    if (eq) {
      eq.status = status;
      return { ...eq };
    }
    return null;
  }

  createDispatchCycle(data: Partial<MiningDispatchCycle>): MiningDispatchCycle {
    const cycleNum = `CYC-KPC-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCycle: MiningDispatchCycle = {
      id: `cyc-${Date.now()}`,
      cycleNumber: cycleNum,
      excavatorId: data.excavatorId || this.equipments[0].id,
      excavatorCode: data.excavatorCode || this.equipments[0].code,
      dumpTruckId: data.dumpTruckId || this.equipments[2].id,
      dumpTruckCode: data.dumpTruckCode || this.equipments[2].code,
      operatorId: data.operatorId || this.operators[0].id,
      operatorName: data.operatorName || this.operators[0].name,
      siteName: data.siteName || this.sites[0].name,
      pitName: data.pitName || this.pits[0].name,
      benchName: data.benchName || this.benches[0].benchNumber,
      loadingPoint: data.loadingPoint || 'Front Loading Alpha 1',
      dumpingPoint: data.dumpingPoint || 'ROM Stockpile Sangatta Port A',
      materialName: data.materialName || this.materials[0].name,
      materialCategory: data.materialCategory || 'COAL',
      payloadTon: data.payloadTon || 88.0,
      payloadBcm: data.payloadBcm || 66.5,
      status: data.status || 'LOADING',
      startTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      queueLoadingTimeMin: data.queueLoadingTimeMin || 0.8,
      loadingTimeMin: data.loadingTimeMin || 3.0,
      haulingTimeMin: data.haulingTimeMin || 12.5,
      queueDumpingTimeMin: data.queueDumpingTimeMin || 0.5,
      dumpingTimeMin: data.dumpingTimeMin || 1.2,
      returnTimeMin: data.returnTimeMin || 10.0,
      totalCycleTimeMin: (data.loadingTimeMin || 3.0) + (data.haulingTimeMin || 12.5) + (data.dumpingTimeMin || 1.2) + (data.returnTimeMin || 10.0),
      haulingDistanceKm: data.haulingDistanceKm || 8.5,
      avgHaulSpeedKmh: data.avgHaulSpeedKmh || 34.0,
      matchFactor: data.matchFactor || 0.98,
      notes: data.notes
    };
    this.dispatchCycles.unshift(newCycle);

    // Update truck status
    const truck = this.equipments.find(e => e.id === newCycle.dumpTruckId || e.code === newCycle.dumpTruckCode);
    if (truck) {
      truck.status = newCycle.status === 'LOADING' ? 'LOADING' : (newCycle.status === 'HAULING' ? 'HAULING' : 'WORKING');
    }

    return newCycle;
  }

  advanceDispatchCycle(cycleId: string): MiningDispatchCycle | null {
    const cycle = this.dispatchCycles.find(c => c.id === cycleId);
    if (!cycle) return null;

    const flow: MiningDispatchCycleStatus[] = [
      'QUEUE_LOADING',
      'LOADING',
      'HAULING',
      'QUEUE_DUMPING',
      'DUMPING',
      'RETURNING',
      'COMPLETED'
    ];

    const currentIdx = flow.indexOf(cycle.status);
    if (currentIdx !== -1 && currentIdx < flow.length - 1) {
      cycle.status = flow[currentIdx + 1];
      
      // Update truck status in equipment list
      const truck = this.equipments.find(e => e.id === cycle.dumpTruckId || e.code === cycle.dumpTruckCode);
      if (truck) {
        if (cycle.status === 'LOADING') truck.status = 'LOADING';
        else if (cycle.status === 'HAULING') truck.status = 'HAULING';
        else if (cycle.status === 'DUMPING') truck.status = 'DUMPING';
        else if (cycle.status === 'RETURNING') truck.status = 'AVAILABLE';
        else if (cycle.status === 'COMPLETED') truck.status = 'AVAILABLE';
      }
    }
    return { ...cycle };
  }

  recordWeighbridge(data: Partial<MiningWeighbridgeTicket>): MiningWeighbridgeTicket {
    const gross = Number(data.grossWeightTon) || 160.0;
    const tare = Number(data.tareWeightTon) || 72.0;
    const net = gross - tare;
    const target = Number(data.targetCapacityTon) || 90.0;
    
    let compliance: 'OPTIMAL' | 'OVERLOAD' | 'UNDERLOAD' = 'OPTIMAL';
    if (net > target * 1.05) compliance = 'OVERLOAD';
    else if (net < target * 0.9) compliance = 'UNDERLOAD';

    const newTicket: MiningWeighbridgeTicket = {
      id: `wb-${Date.now()}`,
      ticketNumber: `WB-SGT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      timeIn: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      timeOut: new Date(Date.now() + 60000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      dumpTruckCode: data.dumpTruckCode || 'DT-785-01',
      operatorName: data.operatorName || 'Agus Salim',
      siteName: data.siteName || this.sites[0].name,
      pitOrigin: data.pitOrigin || this.pits[0].name,
      destinationStockpile: data.destinationStockpile || 'ROM Stockpile Sangatta Port A',
      materialName: data.materialName || 'Thermal Coal Seam Pinang',
      grossWeightTon: gross,
      tareWeightTon: tare,
      netPayloadTon: Number(net.toFixed(1)),
      targetCapacityTon: target,
      complianceStatus: compliance,
      weighbridgeScaleId: 'WEIGHBRIDGE-SCALE-01 (Digital 200T)',
      rfidCardTag: `RFID-TAG-${data.dumpTruckCode || 'DT785'}`
    };
    this.weighbridgeTickets.unshift(newTicket);
    return newTicket;
  }

  // AI Mining Intelligence & Copilot
  askMiningAI(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('match factor') || q.includes('antrean') || q.includes('queue') || q.includes('efisiensi armada')) {
      return `📊 **Analisis AI Match Factor & Sinkronisasi Armada Excavator-Hauler**:
• **Pit Hatari South (EX-1201 PC1250)**: Match Factor saat ini **0.96** (Sangat Optimal). Rasio 1 Shovel melayani 5 unit HD785 dengan jarak angkut 8.5 KM.
• **Pit Bendili West (EX-1202 PC2000)**: Match Factor **1.04** (Sedikit Truck Antre di Loading Point, rata-rata 1.2 menit).
• **Rekomendasi AI Dispatcher**:
  1. Geser 1 unit DT-777 dari Shovel EX-1202 ke Shovel EX-1201 untuk menyeimbangkan cycle time.
  2. Naikkan batas kecepatan kosongan (empty haul) di jalan datar dari 35 km/jam ke 38 km/jam bila kondisi kering.`;
    }

    if (q.includes('k3') || q.includes('fatigue') || q.includes('kantuk') || q.includes('safety') || q.includes('dss')) {
      return `🦺 **Radar AI K3 Pertambangan & Fatigue Monitoring (DSS)**:
• **Fatigue Risk Level**: Rata-rata skor kelelahan operator shift siang saat ini **24.5 / 100 (Kategori Hijau / Bugar)**.
• **Peringatan DSS**: Terdeteksi 1x peringatan micro-sleep pada operator **Deni Priyatna (DT-785-02)** pada pukul 08:45 WIB setelah 3 jam non-stop di haul road berdebu.
• **Tindakan K3**:
  1. Jadwalkan istirahat rotasi kabin 15 menit di Rest Shelter Pitstop.
  2. Pastikan konsumsi air mineral & suplemen elektrolit mencukupi sebelum puncak terik siang.`;
    }

    if (q.includes('solar') || q.includes('fuel') || q.includes('boros') || q.includes('konsumsi')) {
      return `⛽ **Analisis AI Efisiensi BBM Solar B35 (Burn Rate)**:
• **Unit Paling Efisien**: **EX-1201** (88.5 L/HM) menghasilkan **3.86 BCM/Liter**.
• **Anomali Boros**: **DT-777-03** mencatat laju 68.0 L/HM (+12% di atas baseline). Sensor telematika mendeteksi 22 menit idle dengan AC kabin menyala saat menunggu giliran dumping di Disposal Timur.
• **Potensi Penghematan**: Mematikan mesin saat antrean disposal > 5 menit dapat menghemat ±140 Liter solar per shift.`;
    }

    if (q.includes('produksi') || q.includes('target') || q.includes('bcm') || q.includes('ton')) {
      return `📈 **Status Pencapaian Produksi Real-Time Hari Ini**:
• **Total Volume Batu Bara**: **44,800 Ton** dari target harian 62,000 Ton (**72.2% tercapai** pada jam ke-6 shift siang).
• **Total Overburden (OB)**: **238,000 BCM** dari target 320,000 BCM (**74.3% tercapai**).
• **Total Ritase Hauling**: **482 Trips** tercatat di Jembatan Timbang & Dispatcher.
• **Prakiraan Akhir Shift**: Diperkirakan mencapai **64,500 Ton (104% Target)** jika cuaca tetap cerah hingga pukul 18:00 WIB.`;
    }

    if (q.includes('servis') || q.includes('maintenance') || q.includes('breakdown') || q.includes('rusak')) {
      return `🔧 **Jadwal Servis Berkala & Prediksi Kerusakan Mesin**:
• **Mendekati Servis PS 250**: **DT-785-01** saat ini di **7,420.5 HM** (Jatuh tempo servis di 7,500 HM - sisa 79.5 jam operasi).
• **Prediksi AI**: Tekanan oli hidrolik **EX-1201** stabil pada 420 kPa, suhu transmisi HD785 dalam batas aman 62°C.
• **Ketersediaan Sparepart**: Filter kit PS 250 & oli SAE 15W-40 tersedia lengkap di Central Workshop Sangatta.`;
    }

    return `🤖 **AI Mining Fleet Copilot**:
Sistem memonitor **${this.equipments.length} Alat Berat Tambang**, **${this.pits.length} Pit Aktif**, dan **${this.dispatchCycles.length} Siklus Hauling Berjalan** di Sangatta, Morowali, dan Grasberg.

Anda bisa menanyakan:
• *"Bagaimana match factor dan antrean di loading point?"*
• *"Apakah ada operator terindikasi fatigue atau pelanggaran K3?"*
• *"Unit dump truck mana yang paling boros bahan bakar?"*
• *"Berapa pencapaian produksi Ton dan BCM shift ini?"*
• *"Alat berat mana yang mendekati jadwal servis berkala?"*`;
  }

  getDailyMiningBriefing(): AIMiningDailyBriefing {
    const activeEq = this.equipments.filter(e => e.status !== 'BREAKDOWN' && e.status !== 'OFFLINE').length;
    return {
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      shift: 'Day Shift (06:00 - 18:00 WIB)',
      siteName: 'PT Kaltim Prima Coal (Pit Hatari Sangatta)',
      kttName: 'Ir. Agus Setyabudi, M.Sc (KTT Kelas 1 ESDM)',
      executiveSummary: 'Operasi penambangan berjalan optimal pada ketersediaan fisik (PA) 93.4% dan utilisasi (UA) 87.1%. Kondisi haul road kering dan stabil, kecepatan rata-rata hauler 34.2 km/jam. Target harian 62.000 Ton diproyeksikan terlampaui 104% berkat sinkronisasi match factor 0.96 pada loading front Shovel PC1250 dan PC2000.',
      totalProductionTon: 44800,
      targetProductionTon: 62000,
      achievementPct: 72.2,
      totalBcmAchieved: 238000,
      activeFleetsCount: activeEq,
      averageMatchFactor: 0.98,
      fuelBurnRateAvg: 64.2,
      lostTimeInjuryHours: 0,
      highRiskAlerts: [
        'Prakiraan cuaca hujan lokal pukul 15:30 WIB di Sektor Disposal Timur (Potensi jalur licin / slippery)',
        'Jadwal Peledakan (Blasting) Bench RL +90 Pit Bendili dijadwalkan pukul 12:00 WIB - Evakuasi armada radius 500m'
      ],
      optimizationRecommendations: [
        'Aktifkan Scania Water Truck WT-01 untuk penyiraman debu di Haul Road KM 2-6 sebelum shift puncak siang',
        'Lakukan rotasi istirahat 15 menit bagi operator DT-785-02 untuk mitigasi skor fatigue DSS',
        'Pastikan Fuel Bowser FT-20KL siap di Pitstop Alpha pukul 11:30 WIB untuk refueling excavator'
      ],
      weatherForecastImpact: 'Cerah Berawan pagi hingga siang, potensi hujan intensitas sedang sore hari. Siapkan grader MG-16M untuk pemeliharaan kemiringan jalan (camber).'
    };
  }

  generateAiDailyBriefing(): string {
    const briefing = this.getDailyMiningBriefing();
    return `📋 **EXECUTIVE BRIEFING OPERASIONAL TAMBANG (KTT / SUPERINTENDENT)**
📅 **Tanggal**: ${briefing.date} | ⏱️ **Shift**: ${briefing.shift}
📍 **Site**: ${briefing.siteName}
👤 **KTT Penanggung Jawab**: ${briefing.kttName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **RINGKASAN EKSEKUTIF OPERASIONAL**:
${briefing.executiveSummary}

📊 **INDIKATOR KUNCI PRODUKSI**:
• Realisasi Batubara / Ore: **${briefing.totalProductionTon.toLocaleString()} Ton** (Target: ${briefing.targetProductionTon.toLocaleString()} Ton - **${briefing.achievementPct}%**)
• Volume Overburden Stripping: **${briefing.totalBcmAchieved.toLocaleString()} BCM**
• Armada Operasi Aktif: **${briefing.activeFleetsCount} Unit** (Physical Availability: 93.4%, UA: 87.1%)
• Rata-rata Match Factor: **${briefing.averageMatchFactor}** (Efisiensi Shovel-Hauler Sangat Baik)
• Rata-rata Burn Rate BBM: **${briefing.fuelBurnRateAvg} Liter/HM** (Dalam standar anggaran B35)
• Keselamatan Tambang: **${briefing.lostTimeInjuryHours} Jam LTI (Zero Lost Time Injury)**

⚠️ **RADAR RISIKO & PERINGATAN DINI K3/GEOTEKNIK**:
${briefing.highRiskAlerts.map(a => `• ${a}`).join('\n')}

💡 **REKOMENDASI OPTIMASI AI MINING DISPATCHER**:
${briefing.optimizationRecommendations.map(r => `• ${r}`).join('\n')}

⛅ **DAMPAK KONDISI CUACA & HAUL ROAD**:
${briefing.weatherForecastImpact}`;
  }

  getKpis() {
    const activeEq = this.equipments.filter(e => e.status !== 'BREAKDOWN' && e.status !== 'OFFLINE').length;
    return {
      dailyCoalProductionTon: 44800,
      dailyObStrippingBcm: 238000,
      strippingRatio: 5.31,
      totalHaulingTrips: 482,
      activeFleetsCount: activeEq,
      physicalAvailabilityPct: 93.4,
      mechanicalAvailabilityPct: 95.2,
      utilizationAvailabilityPct: 87.1,
      effectiveUtilizationPct: 81.3,
      fuelConsumptionTotalLiter: 38450,
      fuelConsumedLitersDaily: 38450,
      fuelBurnRateAvg: 64.2,
      fuelBurnRateAvgLitersPerHm: 64.2,
      zeroLtiManHours: 3254000,
      matchFactorAvg: 0.98
    };
  }
}

export const miningService = new MiningService();
