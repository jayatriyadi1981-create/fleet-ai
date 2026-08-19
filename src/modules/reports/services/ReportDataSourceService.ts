/**
 * Fleet Intelligence Smart AI - Centralized Report Data Source Service
 * PROMPT 39 - Bridges all platform modules (GPS, Vehicle, Driver, Trip, Fuel, Maintenance, Safety, Cost, Fleet, Executive, Delivery)
 */

import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockGeofences, mockMaintenanceOrders, mockBranches, mockGpsDevices } from '../../../constants/mockData';
import {
  ReportDomainType,
  ReportSubType,
  ReportFilterCriteria,
  ReportDataset,
  ReportColumnDefinition,
  ReportSummaryValue,
  ReportGroupBy,
} from '../types';

export class ReportDataSourceService {
  /**
   * Generates a fully aggregated, filtered, and typed ReportDataset
   */
  public static generateReportDataset(
    domain: ReportDomainType,
    subType: ReportSubType,
    filters: ReportFilterCriteria,
    selectedColumnIds?: string[],
    groupBy: ReportGroupBy = 'NONE',
    sortBy?: string,
    sortAsc: boolean = true
  ): ReportDataset {
    const reportId = `REP-${Date.now().toString(36).toUpperCase()}`;
    const generatedAt = new Date().toISOString();
    const periodLabel = this.formatPeriodLabel(filters);
    const filterSummary = this.buildFilterSummaryString(filters);

    // 1. Get raw columns definition
    const allColumns = this.getColumnDefinitions(domain, subType);
    const columns = selectedColumnIds && selectedColumnIds.length > 0
      ? allColumns.filter(c => selectedColumnIds.includes(c.id))
      : allColumns.filter(c => c.visible);

    // 2. Extract & filter domain raw rows
    let rawRows = this.extractDomainRecords(domain, subType, filters);

    // 3. Sorting
    if (sortBy) {
      rawRows.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
    }

    // 4. Calculate Summary Rows (SUM, AVG, MIN, MAX, COUNT)
    const summaryRows = this.calculateSummaryRows(columns, rawRows);

    // 5. Generate KPIs
    const kpis = this.generateKPIs(domain, subType, rawRows);

    // 6. Generate Chart Data
    const chartData = this.generateChartData(domain, subType, rawRows);

    // 7. Grouped Data if requested
    const groupedData = groupBy !== 'NONE' ? this.buildGroupedData(rawRows, groupBy) : undefined;

    return {
      reportId,
      name: this.getReportName(domain, subType),
      type: domain,
      subType,
      generatedAt,
      periodLabel,
      filterSummary,
      columns,
      rows: rawRows,
      summaryRows,
      totalRecords: rawRows.length,
      kpis,
      chartData,
      groupedData,
    };
  }

  /**
   * Human readable report title
   */
  public static getReportName(domain: ReportDomainType, subType: ReportSubType): string {
    const titles: Record<ReportSubType, string> = {
      // GPS
      GPS_ACTIVITY: 'Laporan Aktivitas & Telematika GPS Harian',
      GPS_LOCATION: 'Laporan Riwayat Koordinat & Lokasi GPS',
      GPS_EVENT: 'Laporan Peringatan & Event Sensor GPS',
      GPS_MILEAGE: 'Laporan Jarak Tempuh & Odometer GPS',
      GPS_STOP: 'Laporan Pemberhentian & Lokasi Parkir GPS',
      GPS_IDLE: 'Laporan Waktu Mesin Menyala Diam (Engine Idle)',
      GPS_OFFLINE: 'Laporan Status Perangkat GPS Offline & Sinyal',
      GPS_DEVICE_HEALTH: 'Laporan Kesehatan Perangkat & Sensor IoT GPS',
      // Vehicle
      VEHICLE_MASTER: 'Laporan Master Data Kendaraan & GPS Terpasang',
      VEHICLE_STATUS: 'Laporan Status Operasional & Kondisi Kendaraan',
      VEHICLE_UTILIZATION: 'Laporan Utilisasi Jam Kerja Kendaraan',
      VEHICLE_MILEAGE: 'Laporan Rekapitulasi Odometer Armada',
      VEHICLE_COST: 'Laporan Total Biaya Operasional per Kendaraan',
      VEHICLE_PERFORMANCE: 'Laporan Kinerja & Produktivitas Kendaraan',
      VEHICLE_HEALTH: 'Laporan Kesehatan Mesin & Diagnostik OBD-II',
      // Driver
      DRIVER_MASTER: 'Laporan Master Data & Dokumen Pengemudi',
      DRIVER_ACTIVITY: 'Laporan Log Aktivitas Mengemudi Harian',
      DRIVER_BEHAVIOR: 'Laporan Skor Perilaku Mengemudi (Driver Behavior)',
      DRIVER_SAFETY: 'Laporan Kepatuhan Keselamatan Pengemudi',
      DRIVER_FATIGUE: 'Laporan Manajemen Kelelahan & Jam Kerja Driver',
      DRIVER_PERFORMANCE: 'Laporan Kartu Evaluasi Kinerja Pengemudi (Scorecard)',
      DRIVER_COST: 'Laporan Alokasi Pengeluaran per Driver',
      // Trip
      TRIP_SUMMARY: 'Laporan Ringkasan Surat Jalan & Perjalanan Armada',
      TRIP_DETAIL: 'Laporan Rincian Titik Singgah & Manifest Kargo',
      TRIP_PERFORMANCE: 'Laporan Ketepatan Waktu & SLA Pengiriman (On-Time %)',
      TRIP_DELAY: 'Laporan Analisis Keterlambatan Perjalanan & Deviasi',
      TRIP_ROUTE: 'Laporan Kepatuhan Koridor Rute & Deviasi Geofence',
      TRIP_COST: 'Laporan Biaya Operasional per Surat Jalan / Trip',
      TRIP_DRIVER: 'Laporan Distribusi Penugasan Trip Pengemudi',
      TRIP_VEHICLE: 'Laporan Alokasi Perjalanan Unit Armada',
      // Fuel
      FUEL_CONSUMPTION: 'Laporan Konsumsi Bahan Bakar (BBM) & Efisiensi KM/L',
      FUEL_COST: 'Laporan Pengeluaran & Anggaran Biaya BBM',
      FUEL_EFFICIENCY: 'Laporan Rasio Efisiensi BBM vs Standar Industri',
      FUEL_REFUELING: 'Laporan Transaksi & Struk Pengisian Solar / SPBU',
      FUEL_ANOMALY: 'Laporan Deteksi Anomali & Pemborosan Bahan Bakar',
      FUEL_THEFT_RISK: 'Laporan Audit Dugaan Pencurian BBM (Fuel Siphon)',
      // Maintenance
      MAINTENANCE_SUMMARY: 'Laporan Ringkasan Perawatan & Pemeliharaan Armada',
      MAINTENANCE_HISTORY: 'Laporan Riwayat Servis Berkala & Work Order',
      MAINTENANCE_COST: 'Laporan Biaya Perbaikan, Suku Cadang & Jasa Bengkel',
      MAINTENANCE_SERVICE_DUE: 'Laporan Jadwal Servis & Penggantian Oli Mendatang',
      MAINTENANCE_OVERDUE: 'Laporan Pemeliharaan Terlambat (Overdue Service)',
      MAINTENANCE_BREAKDOWN: 'Laporan Insiden Mogok Jalan (Vehicle Breakdown)',
      MAINTENANCE_REPAIR: 'Laporan Perbaikan & Reparasi Kerusakan Armada',
      MAINTENANCE_PARTS: 'Laporan Pemakaian Suku Cadang & Ban Kendaraan',
      MAINTENANCE_PREDICTIVE: 'Laporan AI Predictive Maintenance & Usia Komponen',
      // Safety
      SAFETY_SUMMARY: 'Laporan Ringkasan Keselamatan Berkendara & Insiden',
      SAFETY_ACCIDENT: 'Laporan Kronologi & Klaim Kecelakaan Lalu Lintas',
      SAFETY_INCIDENT: 'Laporan Rekam Jejak Pelanggaran & Kejadian Kritis',
      SAFETY_NEAR_MISS: 'Laporan Potensi Bahaya & Insiden Nyaris Terjadi (Near Miss)',
      SAFETY_DRIVER_SAFETY: 'Laporan Peringkat Risiko Keselamatan Driver',
      SAFETY_EVENT: 'Laporan Rekapitulasi Overspeed, Harsh Brake & Cornering',
      SAFETY_FATIGUE: 'Laporan Peringatan Sensor AI Fatigue & Mengantuk',
      SAFETY_CORRECTIVE_ACTION: 'Laporan Rencana Tindak Lanjut & Program Coaching Safety',
      // Cost
      COST_OPERATING: 'Laporan Total Biaya Operasional Kendaraan (TOC Statement)',
      COST_FUEL: 'Laporan Rincian Biaya Pembelian Bahan Bakar',
      COST_MAINTENANCE: 'Laporan Rincian Biaya Servis & Perawatan',
      COST_DRIVER: 'Laporan Biaya Gaji, Uang Jalan & Lembur Driver',
      COST_PER_KM: 'Laporan Analisis Biaya Operasional per Kilometer (Cost/KM)',
      COST_PER_TRIP: 'Laporan Analisis Biaya Rata-rata per Surat Jalan (Cost/Trip)',
      COST_VEHICLE: 'Laporan Biaya Kepemilikan & Total Cost of Ownership (TCO)',
      COST_BRANCH: 'Laporan Konsolidasi Biaya Operasional Antar Depo/Cabang',
      COST_VARIANCE: 'Laporan Selisih Anggaran vs Realisasi Pengeluaran (Budget Variance)',
      COST_SAVING: 'Laporan Realisasi Peluang Penghematan Biaya Armada',
      // Fleet
      FLEET_SUMMARY: 'Laporan Konsolidasi Status & Efektivitas Armada Nasional',
      FLEET_UTILIZATION: 'Laporan Rasio Utilisasi & Waktu Operasional Armada',
      FLEET_PRODUCTIVITY: 'Laporan Indeks Produktivitas Ton-KM & Trip Delivery',
      FLEET_AVAILABILITY: 'Laporan Kesiapan Armada Siap Jalan (Availability Rate)',
      FLEET_MILEAGE: 'Laporan Distribusi Jarak Tempuh Armada',
      FLEET_DOWNTIME: 'Laporan Jam Tidak Beroperasi & Kerugian Downtime',
      FLEET_IDLE: 'Laporan Kerugian Finansial Akibat Idling Mesin',
      FLEET_EFFICIENCY: 'Laporan Skor Efisiensi Terpadu Armada',
      FLEET_PERFORMANCE: 'Laporan Matriks Kinerja Menyeluruh Armada',
      FLEET_HEALTH: 'Laporan Indeks Kesehatan Teknis Armada',
      // Executive
      EXECUTIVE_MONTHLY: 'Laporan Eksekutif Bulanan Direksi (Board of Directors Briefing)',
      EXECUTIVE_WEEKLY: 'Laporan Eksekutif Mingguan Operasional & Finansial',
      EXECUTIVE_FLEET: 'Laporan Strategis Portofolio & Manajemen Aset Armada',
      EXECUTIVE_COST: 'Laporan Analisis Biaya & Profitabilitas Logistik C-Level',
      EXECUTIVE_SAFETY: 'Laporan Audit Kepatuhan & Mitigasi Risiko Keselamatan',
      EXECUTIVE_PERFORMANCE: 'Laporan KPI Strategis & Skor Terpadu Perusahaan',
      // Delivery
      DELIVERY_SUMMARY: 'Laporan Ringkasan Distribusi & Pengiriman Logistik',
      DELIVERY_POD: 'Laporan Bukti Penerimaan Barang Elektronik (e-POD)',
      DELIVERY_CUSTOMER: 'Laporan Kinerja Pengiriman per Akun Pelanggan',
      DELIVERY_ON_TIME: 'Laporan Kepatuhan Jadwal Pengiriman & SLA',
    };

    return titles[subType] || `${domain} - ${subType} Report`;
  }

  /**
   * Available Column Definitions for each domain / sub-type
   */
  public static getColumnDefinitions(domain: ReportDomainType, subType: ReportSubType): ReportColumnDefinition[] {
    switch (domain) {
      case 'GPS':
        if (subType === 'GPS_ACTIVITY') {
          return [
            { id: 'date', label: 'Tanggal', dataType: 'date', visible: true, width: '120px' },
            { id: 'time', label: 'Waktu', dataType: 'string', visible: true, width: '90px' },
            { id: 'vehiclePlate', label: 'No Polisi', dataType: 'string', visible: true, width: '120px' },
            { id: 'driverName', label: 'Pengemudi', dataType: 'string', visible: true, width: '140px' },
            { id: 'speed', label: 'Kecepatan (KM/H)', dataType: 'number', visible: true, width: '130px', align: 'right', summaryType: 'AVG' },
            { id: 'ignition', label: 'Kontak Mesin', dataType: 'badge', visible: true, width: '110px', align: 'center' },
            { id: 'location', label: 'Lokasi Terakhir', dataType: 'string', visible: true, width: '220px' },
            { id: 'gpsStatus', label: 'Sinyal GPS', dataType: 'badge', visible: true, width: '100px', align: 'center' },
            { id: 'deviceImei', label: 'IMEI GPS', dataType: 'string', visible: false, width: '140px' },
          ];
        }
        if (subType === 'GPS_EVENT') {
          return [
            { id: 'timestamp', label: 'Waktu Kejadian', dataType: 'date', visible: true, width: '150px' },
            { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
            { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
            { id: 'eventType', label: 'Jenis Event', dataType: 'badge', visible: true, width: '140px' },
            { id: 'severity', label: 'Tingkat Bahaya', dataType: 'badge', visible: true, width: '110px', align: 'center' },
            { id: 'speed', label: 'Kecepatan', dataType: 'number', visible: true, width: '100px', align: 'right' },
            { id: 'location', label: 'Titik Lokasi', dataType: 'string', visible: true, width: '220px' },
            { id: 'duration', label: 'Durasi (Detik)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
            { id: 'status', label: 'Status Penanganan', dataType: 'badge', visible: true, width: '120px', align: 'center' },
          ];
        }
        return [
          { id: 'vehiclePlate', label: 'No Polisi', dataType: 'string', visible: true, width: '120px' },
          { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
          { id: 'startMileage', label: 'KM Awal', dataType: 'number', visible: true, width: '110px', align: 'right' },
          { id: 'endMileage', label: 'KM Akhir', dataType: 'number', visible: true, width: '110px', align: 'right' },
          { id: 'distance', label: 'Jarak (KM)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'drivingHours', label: 'Jam Gerak (Jam)', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'idleHours', label: 'Jam Idle (Jam)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'stopHours', label: 'Jam Parkir (Jam)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
        ];

      case 'VEHICLE':
        return [
          { id: 'vehiclePlate', label: 'No Polisi', dataType: 'string', visible: true, width: '120px' },
          { id: 'vehicleType', label: 'Jenis Unit', dataType: 'string', visible: true, width: '130px' },
          { id: 'brandModel', label: 'Merk & Model', dataType: 'string', visible: true, width: '140px' },
          { id: 'branchName', label: 'Cabang/Depo', dataType: 'string', visible: true, width: '120px' },
          { id: 'status', label: 'Status', dataType: 'badge', visible: true, width: '110px', align: 'center' },
          { id: 'odometer', label: 'Odometer (KM)', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'AVG' },
          { id: 'utilizationPct', label: 'Utilisasi %', dataType: 'percentage', visible: true, width: '110px', align: 'right', summaryType: 'AVG' },
          { id: 'healthScore', label: 'Health Score', dataType: 'rating', visible: true, width: '110px', align: 'center', summaryType: 'AVG' },
          { id: 'totalCostIdr', label: 'Total Biaya (IDR)', dataType: 'currency', visible: true, width: '150px', align: 'right', summaryType: 'SUM' },
          { id: 'costPerKmIdr', label: 'Biaya / KM', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'AVG' },
        ];

      case 'DRIVER':
        if (subType === 'DRIVER_FATIGUE') {
          return [
            { id: 'driverName', label: 'Nama Pengemudi', dataType: 'string', visible: true, width: '150px' },
            { id: 'branchName', label: 'Depo', dataType: 'string', visible: true, width: '120px' },
            { id: 'shift', label: 'Shift Kerja', dataType: 'string', visible: true, width: '110px' },
            { id: 'drivingHours', label: 'Jam Mengemudi', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
            { id: 'restHours', label: 'Jam Istirahat', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
            { id: 'nightDrivingHours', label: 'Jam Malam', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
            { id: 'fatigueAlerts', label: 'Alert Sensor AI', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
            { id: 'fatigueScore', label: 'Skor Kelelahan', dataType: 'rating', visible: true, width: '120px', align: 'center', summaryType: 'AVG' },
            { id: 'riskLevel', label: 'Tingkat Risiko', dataType: 'badge', visible: true, width: '120px', align: 'center' },
          ];
        }
        return [
          { id: 'driverName', label: 'Nama Pengemudi', dataType: 'string', visible: true, width: '150px' },
          { id: 'branchName', label: 'Cabang', dataType: 'string', visible: true, width: '120px' },
          { id: 'totalTrips', label: 'Total Trip', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'totalDistanceKm', label: 'Jarak (KM)', dataType: 'number', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'overspeedCount', label: 'Overspeed', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'harshBrakingCount', label: 'Harsh Brake', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'idleHours', label: 'Jam Idle', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'safetyScore', label: 'Safety Score', dataType: 'rating', visible: true, width: '110px', align: 'center', summaryType: 'AVG' },
          { id: 'riskRank', label: 'Kategori Risiko', dataType: 'badge', visible: true, width: '120px', align: 'center' },
        ];

      case 'TRIP':
        return [
          { id: 'tripId', label: 'ID Surat Jalan', dataType: 'string', visible: true, width: '120px' },
          { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
          { id: 'driverName', label: 'Pengemudi', dataType: 'string', visible: true, width: '140px' },
          { id: 'origin', label: 'Asal (Origin)', dataType: 'string', visible: true, width: '150px' },
          { id: 'destination', label: 'Tujuan (Dest)', dataType: 'string', visible: true, width: '150px' },
          { id: 'distanceKm', label: 'Jarak (KM)', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'durationHours', label: 'Durasi (Jam)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'AVG' },
          { id: 'delayMinutes', label: 'Keterlambatan (Mnt)', dataType: 'number', visible: true, width: '130px', align: 'right', summaryType: 'SUM' },
          { id: 'status', label: 'Status Trip', dataType: 'badge', visible: true, width: '110px', align: 'center' },
          { id: 'tripCostIdr', label: 'Biaya Trip (IDR)', dataType: 'currency', visible: true, width: '130px', align: 'right', summaryType: 'SUM' },
        ];

      case 'FUEL':
        if (subType === 'FUEL_ANOMALY' || subType === 'FUEL_THEFT_RISK') {
          return [
            { id: 'date', label: 'Tanggal', dataType: 'date', visible: true, width: '110px' },
            { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
            { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
            { id: 'expectedKmL', label: 'Target KM/L', dataType: 'number', visible: true, width: '110px', align: 'right' },
            { id: 'actualKmL', label: 'Aktual KM/L', dataType: 'number', visible: true, width: '110px', align: 'right' },
            { id: 'variancePct', label: 'Penyimpangan %', dataType: 'percentage', visible: true, width: '120px', align: 'right' },
            { id: 'possibleCause', label: 'Dugaan Penyebab', dataType: 'string', visible: true, width: '160px' },
            { id: 'threatLevel', label: 'Tingkat Ancaman', dataType: 'badge', visible: true, width: '120px', align: 'center' },
            { id: 'estimatedLossIdr', label: 'Potensi Rugi (IDR)', dataType: 'currency', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          ];
        }
        return [
          { id: 'date', label: 'Tanggal', dataType: 'date', visible: true, width: '110px' },
          { id: 'vehiclePlate', label: 'No Polisi', dataType: 'string', visible: true, width: '120px' },
          { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
          { id: 'fuelType', label: 'Jenis BBM', dataType: 'string', visible: true, width: '100px' },
          { id: 'liters', label: 'Volume (Liter)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'pricePerLiter', label: 'Harga / L (IDR)', dataType: 'currency', visible: true, width: '120px', align: 'right' },
          { id: 'totalFuelCostIdr', label: 'Total Biaya BBM', dataType: 'currency', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          { id: 'distanceKm', label: 'Jarak (KM)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'fuelEfficiencyKmL', label: 'Rasio KM/L', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'AVG' },
          { id: 'fuelCostPerKm', label: 'Biaya BBM/KM', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'AVG' },
        ];

      case 'MAINTENANCE':
        return [
          { id: 'orderNumber', label: 'No Work Order', dataType: 'string', visible: true, width: '130px' },
          { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
          { id: 'serviceType', label: 'Kategori Servis', dataType: 'badge', visible: true, width: '130px' },
          { id: 'serviceDate', label: 'Tanggal Servis', dataType: 'date', visible: true, width: '110px' },
          { id: 'workshopName', label: 'Bengkel / Rekanan', dataType: 'string', visible: true, width: '150px' },
          { id: 'partsReplaced', label: 'Suku Cadang / Komponen', dataType: 'string', visible: true, width: '180px' },
          { id: 'partsCostIdr', label: 'Biaya Sparepart', dataType: 'currency', visible: true, width: '130px', align: 'right', summaryType: 'SUM' },
          { id: 'laborCostIdr', label: 'Jasa Mekanik', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'totalCostIdr', label: 'Total Biaya (IDR)', dataType: 'currency', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          { id: 'status', label: 'Status WO', dataType: 'badge', visible: true, width: '110px', align: 'center' },
        ];

      case 'SAFETY':
        return [
          { id: 'incidentId', label: 'ID Insiden', dataType: 'string', visible: true, width: '110px' },
          { id: 'date', label: 'Tanggal', dataType: 'date', visible: true, width: '110px' },
          { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
          { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
          { id: 'eventType', label: 'Jenis Pelanggaran', dataType: 'badge', visible: true, width: '140px' },
          { id: 'severity', label: 'Tingkat Bahaya', dataType: 'badge', visible: true, width: '110px', align: 'center' },
          { id: 'location', label: 'Lokasi Kejadian', dataType: 'string', visible: true, width: '200px' },
          { id: 'damageCostIdr', label: 'Estimasi Kerugian', dataType: 'currency', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          { id: 'investigationStatus', label: 'Status Investigasi', dataType: 'badge', visible: true, width: '130px', align: 'center' },
        ];

      case 'COST':
        return [
          { id: 'vehiclePlate', label: 'No Polisi', dataType: 'string', visible: true, width: '120px' },
          { id: 'branchName', label: 'Cabang', dataType: 'string', visible: true, width: '120px' },
          { id: 'fuelCostIdr', label: 'BBM Solar', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'maintenanceCostIdr', label: 'Pemeliharaan', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'driverCostIdr', label: 'Gaji/Uang Jalan', dataType: 'currency', visible: true, width: '130px', align: 'right', summaryType: 'SUM' },
          { id: 'tollParkingCostIdr', label: 'Tol & Parkir', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'fixedCostIdr', label: 'Asuransi & Pajak', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'SUM' },
          { id: 'totalCostIdr', label: 'Total TOC (IDR)', dataType: 'currency', visible: true, width: '150px', align: 'right', summaryType: 'SUM' },
          { id: 'totalDistanceKm', label: 'Jarak (KM)', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'costPerKmIdr', label: 'Biaya / KM', dataType: 'currency', visible: true, width: '120px', align: 'right', summaryType: 'AVG' },
        ];

      case 'FLEET':
        return [
          { id: 'branchName', label: 'Depo / Wilayah', dataType: 'string', visible: true, width: '140px' },
          { id: 'fleetCount', label: 'Total Unit', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'activeCount', label: 'Unit Aktif', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'maintenanceCount', label: 'Dalam Bengkel', dataType: 'number', visible: true, width: '110px', align: 'right', summaryType: 'SUM' },
          { id: 'utilizationPct', label: 'Utilisasi %', dataType: 'percentage', visible: true, width: '110px', align: 'right', summaryType: 'AVG' },
          { id: 'totalMileageKm', label: 'Jarak Tempuh (KM)', dataType: 'number', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          { id: 'totalTrips', label: 'Total Trip', dataType: 'number', visible: true, width: '100px', align: 'right', summaryType: 'SUM' },
          { id: 'safetyScore', label: 'Skor Safety', dataType: 'rating', visible: true, width: '110px', align: 'center', summaryType: 'AVG' },
          { id: 'totalCostIdr', label: 'Total Biaya', dataType: 'currency', visible: true, width: '140px', align: 'right', summaryType: 'SUM' },
          { id: 'compositeScore', label: 'Indeks Kinerja', dataType: 'rating', visible: true, width: '110px', align: 'center', summaryType: 'AVG' },
        ];

      case 'EXECUTIVE':
        return [
          { id: 'metricCategory', label: 'Domain Strategis', dataType: 'string', visible: true, width: '180px' },
          { id: 'currentMonthValue', label: 'Realisasi Bulan Ini', dataType: 'string', visible: true, width: '160px' },
          { id: 'targetBenchmark', label: 'Target / KPI', dataType: 'string', visible: true, width: '140px' },
          { id: 'variancePct', label: 'Variansi %', dataType: 'percentage', visible: true, width: '110px', align: 'right' },
          { id: 'trendStatus', label: 'Status Tren', dataType: 'badge', visible: true, width: '120px', align: 'center' },
          { id: 'financialImpactIdr', label: 'Dampak Biaya (IDR)', dataType: 'currency', visible: true, width: '150px', align: 'right' },
          { id: 'aiObservation', label: 'Observasi & Rekomendasi AI', dataType: 'string', visible: true, width: '260px' },
        ];

      case 'DELIVERY':
        return [
          { id: 'deliveryId', label: 'ID Pengiriman', dataType: 'string', visible: true, width: '130px' },
          { id: 'customerName', label: 'Pelanggan / Outlet', dataType: 'string', visible: true, width: '160px' },
          { id: 'destination', label: 'Alamat Tujuan', dataType: 'string', visible: true, width: '200px' },
          { id: 'vehiclePlate', label: 'Kendaraan', dataType: 'string', visible: true, width: '120px' },
          { id: 'driverName', label: 'Driver', dataType: 'string', visible: true, width: '140px' },
          { id: 'deliveryDate', label: 'Jadwal Tiba', dataType: 'date', visible: true, width: '110px' },
          { id: 'actualArrival', label: 'Waktu Kedatangan', dataType: 'string', visible: true, width: '120px' },
          { id: 'slaStatus', label: 'Kepatuhan SLA', dataType: 'badge', visible: true, width: '120px', align: 'center' },
          { id: 'podStatus', label: 'Status e-POD', dataType: 'badge', visible: true, width: '120px', align: 'center' },
        ];

      default:
        return [
          { id: 'id', label: 'ID', dataType: 'string', visible: true, width: '100px' },
          { id: 'name', label: 'Deskripsi', dataType: 'string', visible: true, width: '200px' },
          { id: 'status', label: 'Status', dataType: 'badge', visible: true, width: '100px' },
        ];
    }
  }

  /**
   * Domain Records Extractor
   */
  private static extractDomainRecords(
    domain: ReportDomainType,
    subType: ReportSubType,
    filters: ReportFilterCriteria
  ): Record<string, any>[] {
    const branchMap = new Map(mockBranches.map(b => [b.id, b.name]));

    // Apply branch filter helper
    const filterByBranch = (branchId?: string) => {
      if (!filters.branchId || filters.branchId === 'ALL') return true;
      return branchId === filters.branchId;
    };

    switch (domain) {
      case 'GPS':
        return mockVehicles
          .filter(v => filterByBranch(v.branchId))
          .map((v, i) => {
            const isMoving = v.status === 'moving';
            const speed = isMoving ? 58 + (i * 7) % 35 : 0;
            const distance = 145 + (i * 28);
            const drivingHours = Math.round((distance / (speed || 40)) * 10) / 10;
            const idleHours = Math.round(((i % 4) * 0.8 + 0.4) * 10) / 10;
            const stopHours = Math.round((24 - drivingHours - idleHours) * 10) / 10;

            if (subType === 'GPS_EVENT') {
              const events = ['Overspeed (88 km/h)', 'Hard Braking (-0.45g)', 'Harsh Cornering', 'Geofence Exit', 'Idle > 30 Mins', 'Panic SOS Test'];
              const severities = ['CRITICAL', 'WARNING', 'WARNING', 'INFO', 'INFO', 'CRITICAL'];
              const evtIdx = i % events.length;
              return {
                id: `EVT-${1000 + i}`,
                timestamp: '2026-08-17 10:24:00',
                vehiclePlate: (v as any).licensePlate || v.plateNumber,
                driverName: mockDrivers[i % mockDrivers.length]?.name || 'Budi Santoso',
                eventType: events[evtIdx],
                severity: severities[evtIdx],
                speed: 75 + (i % 20),
                location: v.latestTelemetry?.location?.address || 'Tol Cipularang KM 92, Jawa Barat',
                duration: 15 + (i * 8),
                status: i % 2 === 0 ? 'RESOLVED' : 'OPEN',
              };
            }

            if (subType === 'GPS_ACTIVITY') {
              return {
                id: `GPS-${1000 + i}`,
                date: '2026-08-17',
                time: `09:${(i * 12) % 60 < 10 ? '0' : ''}${(i * 12) % 60}:00`,
                vehiclePlate: (v as any).licensePlate || v.plateNumber,
                driverName: mockDrivers[i % mockDrivers.length]?.name || 'Budi Santoso',
                speed,
                ignition: isMoving || v.status === 'idle' ? 'ON' : 'OFF',
                location: v.latestTelemetry?.location?.address || 'Kawasan Industri MM2100, Cikarang',
                gpsStatus: 'GOOD (12 Sat)',
                deviceImei: (v as any).gpsDevice?.imei || (v as any).gpsDeviceId || `8649201948201${i}`,
              };
            }

            // GPS_MILEAGE default
            return {
              id: `MIL-${1000 + i}`,
              vehiclePlate: (v as any).licensePlate || v.plateNumber,
              driverName: mockDrivers[i % mockDrivers.length]?.name || 'Budi Santoso',
              startMileage: (v.odometerKm || 120000) - distance,
              endMileage: v.odometerKm || 120000,
              distance,
              drivingHours,
              idleHours,
              stopHours,
            };
          });

      case 'VEHICLE':
        return mockVehicles
          .filter(v => filterByBranch(v.branchId))
          .map((v, i) => {
            const distance = 2800 + (i * 450);
            const totalCost = 8500000 + (i * 750000);
            const costPerKm = Math.round(totalCost / distance);
            const util = 72 + (i * 4) % 24;
            const health = 85 + (i * 3) % 15;

            return {
              id: v.id,
              vehiclePlate: (v as any).licensePlate || v.plateNumber,
              vehicleType: v.type,
              brandModel: `${(v as any).make || v.brand} ${v.model}`,
              branchName: branchMap.get(v.branchId || '') || 'Depo Jakarta',
              status: v.status,
              odometer: v.odometerKm || 125000,
              utilizationPct: util,
              healthScore: health,
              totalCostIdr: totalCost,
              costPerKmIdr: costPerKm,
              fuelEfficiencyKmL: Math.round((3.2 + (i % 3) * 0.4) * 10) / 10,
              maintenanceCount: (i % 3) + 1,
            };
          });

      case 'DRIVER':
        return mockDrivers
          .filter(d => filterByBranch(d.branchId))
          .map((d, i) => {
            const dist = 3200 + (i * 380);
            const trips = 24 + (i * 3);
            const overspeed = (i % 4) * 2;
            const harsh = (i % 3) * 3;
            const safety = Math.max(68, 96 - overspeed * 3 - harsh * 2);
            const drivingHrs = 140 + (i * 12);
            const restHrs = 70 + (i * 8);

            return {
              id: d.id,
              driverName: d.name,
              branchName: branchMap.get(d.branchId || '') || 'Depo Jakarta',
              shift: i % 2 === 0 ? 'Day Shift (06:00 - 18:00)' : 'Night Shift (18:00 - 06:00)',
              totalTrips: trips,
              totalDistanceKm: dist,
              drivingHours: drivingHrs,
              restHours: restHrs,
              nightDrivingHours: i % 2 === 1 ? 48 : 12,
              overspeedCount: overspeed,
              harshBrakingCount: harsh,
              idleHours: 18 + (i * 2),
              fatigueAlerts: (i % 3) * 2,
              fatigueScore: Math.min(95, 60 + (i * 6) % 35),
              safetyScore: safety,
              riskLevel: safety < 75 ? 'HIGH_RISK' : safety < 85 ? 'MEDIUM_RISK' : 'LOW_RISK',
              riskRank: safety < 75 ? 'HIGH' : safety < 85 ? 'MODERATE' : 'EXCELLENT',
            };
          });

      case 'TRIP':
        return mockTrips.map((t, i) => {
          const tAny = t as any;
          const delay = (i % 4) * 15;
          const cost = 1250000 + (i * 180000);
          const origName = typeof t.origin === 'object' ? (t.origin as any)?.name || 'Gudang Cakung' : t.origin || 'Gudang Cakung, JKT';
          const destName = typeof t.destination === 'object' ? (t.destination as any)?.name || 'Depo Karawang' : t.destination || 'Depo Karawang, JBW';
          const dist = t.actualDistanceKm || t.plannedDistanceKm || 120 + (i * 25);
          const durHours = Math.round(((tAny.durationMinutes || (t.plannedDurationHours ? t.plannedDurationHours * 60 : 180)) / 60) * 10) / 10;

          return {
            id: t.id,
            tripId: t.id,
            vehiclePlate: tAny.vehiclePlate || `B ${9100 + i} TDF`,
            driverName: tAny.driverName || 'Budi Santoso',
            origin: origName,
            destination: destName,
            distanceKm: dist,
            durationHours: durHours,
            delayMinutes: delay,
            status: delay > 30 ? 'DELAYED' : (t.status || 'COMPLETED'),
            tripCostIdr: cost,
          };
        });

      case 'FUEL':
        return mockVehicles
          .filter(v => filterByBranch(v.branchId))
          .map((v, i) => {
            const liters = 550 + (i * 85);
            const price = 14500;
            const cost = liters * price;
            const distance = liters * (3.4 + (i % 3) * 0.3);
            const kmL = Math.round((distance / liters) * 10) / 10;
            const costPerKm = Math.round(cost / distance);

            const isAnomaly = i % 4 === 1;

            return {
              id: `FUEL-${1000 + i}`,
              date: '2026-08-16',
              vehiclePlate: (v as any).licensePlate || v.plateNumber,
              driverName: mockDrivers[i % mockDrivers.length]?.name || 'Agus Wijaya',
              fuelType: 'Bio Solar B35',
              liters,
              pricePerLiter: price,
              totalFuelCostIdr: cost,
              distanceKm: Math.round(distance),
              fuelEfficiencyKmL: kmL,
              fuelCostPerKm: costPerKm,
              expectedKmL: 3.8,
              actualKmL: isAnomaly ? 2.4 : kmL,
              variancePct: isAnomaly ? -36.8 : -2.5,
              possibleCause: isAnomaly ? 'Excessive Idling & Siphon Risk' : 'Normal Driving',
              threatLevel: isAnomaly ? 'HIGH' : 'LOW',
              estimatedLossIdr: isAnomaly ? 2450000 : 0,
            };
          });

      case 'MAINTENANCE':
        return mockMaintenanceOrders.map((m, i) => {
          const mAny = m as any;
          const orderCost = mAny.actualCostIdr || mAny.estimatedCostIdr || mAny.cost || 2450000;
          const partsCost = Math.round(orderCost * 0.65);
          const laborCost = Math.round(orderCost * 0.35);
          const total = partsCost + laborCost;

          return {
            id: m.id,
            orderNumber: m.id,
            vehiclePlate: mAny.vehiclePlate || `B ${9200 + i} TDF`,
            serviceType: m.type || (i % 2 === 0 ? 'PREVENTIVE' : 'CORRECTIVE'),
            serviceDate: m.scheduledDate || '2026-08-15',
            workshopName: i % 2 === 0 ? 'Bengkel Pusat Cakung' : 'Astra Isuzu Karawang',
            partsReplaced: i % 2 === 0 ? 'Oli Mesin 15W-40, Filter Solar, Filter Oli' : 'Kampas Rem Depan, Seal As Roda',
            partsCostIdr: partsCost,
            laborCostIdr: laborCost,
            totalCostIdr: total,
            status: m.status || 'COMPLETED',
          };
        });

      case 'SAFETY':
        return [
          {
            id: 'SAF-01',
            incidentId: 'INC-2026-081',
            date: '2026-08-14',
            vehiclePlate: 'B 9214 TDF',
            driverName: 'Eko Prasetyo',
            eventType: 'Overspeed (98 KM/H in 60 Zone)',
            severity: 'CRITICAL',
            location: 'Tol Cipali KM 118, Subang',
            damageCostIdr: 0,
            investigationStatus: 'COACHING_ASSIGNED',
          },
          {
            id: 'SAF-02',
            incidentId: 'INC-2026-082',
            date: '2026-08-15',
            vehiclePlate: 'B 9840 UXZ',
            driverName: 'Joko Widodo',
            eventType: 'Harsh Braking & Tailgating',
            severity: 'WARNING',
            location: 'Pantura Pamanukan KM 44',
            damageCostIdr: 0,
            investigationStatus: 'RESOLVED',
          },
          {
            id: 'SAF-03',
            incidentId: 'INC-2026-083',
            date: '2026-08-16',
            vehiclePlate: 'B 9102 KDA',
            driverName: 'Rudi Hartono',
            eventType: 'Side-Mirror Scratch at Depo Gate',
            severity: 'MINOR',
            location: 'Gerbang Depo Surabaya Barat',
            damageCostIdr: 1200000,
            investigationStatus: 'UNDER_INVESTIGATION',
          },
          {
            id: 'SAF-04',
            incidentId: 'INC-2026-084',
            date: '2026-08-17',
            vehiclePlate: 'B 9301 SYZ',
            driverName: 'Hendra Gunawan',
            eventType: 'Driver Fatigue / Micro-Sleep Alert',
            severity: 'CRITICAL',
            location: 'Tol Trans Jawa Batang KM 370',
            damageCostIdr: 0,
            investigationStatus: 'REST_ORDERED',
          },
        ];

      case 'COST':
        return mockVehicles
          .filter(v => filterByBranch(v.branchId))
          .map((v, i) => {
            const distance = 3400 + (i * 320);
            const fuel = 6800000 + (i * 450000);
            const maint = 2200000 + (i * 280000);
            const driver = 4500000;
            const toll = 1400000 + (i * 120000);
            const fixed = 850000;
            const total = fuel + maint + driver + toll + fixed;
            const costPerKm = Math.round(total / distance);

            return {
              id: `COST-${v.id}`,
              vehiclePlate: v.plateNumber || (v as any).licensePlate || v.id,
              branchName: branchMap.get(v.branchId || '') || 'Depo Jakarta',
              fuelCostIdr: fuel,
              maintenanceCostIdr: maint,
              driverCostIdr: driver,
              tollParkingCostIdr: toll,
              fixedCostIdr: fixed,
              totalCostIdr: total,
              totalDistanceKm: distance,
              costPerKmIdr: costPerKm,
            };
          });

      case 'FLEET':
        return mockBranches.map((b, i) => {
          const fleetCount = 8 + (i * 4);
          const activeCount = Math.round(fleetCount * 0.85);
          const maintCount = fleetCount - activeCount;
          const util = 82 + (i % 3) * 4;
          const mileage = fleetCount * 3150;
          const trips = fleetCount * 22;
          const cost = fleetCount * 14200000;
          const score = 88 + (i % 2) * 4;

          return {
            id: b.id,
            branchName: b.name,
            fleetCount,
            activeCount,
            maintenanceCount: maintCount,
            utilizationPct: util,
            totalMileageKm: mileage,
            totalTrips: trips,
            safetyScore: score,
            totalCostIdr: cost,
            compositeScore: score,
          };
        });

      case 'EXECUTIVE':
        return [
          {
            id: 'EX-01',
            metricCategory: '1. Fleet Utilization & Output',
            currentMonthValue: '86.4% Active (42 / 48 Units)',
            targetBenchmark: '85.0%',
            variancePct: 1.6,
            trendStatus: 'HEALTHY',
            financialImpactIdr: 45000000,
            aiObservation: 'Utilisasi melampaui target Q3 berkat otomatisasi dispatching AI & efisiensi rute.',
          },
          {
            id: 'EX-02',
            metricCategory: '2. Total Operating Cost (TOC)',
            currentMonthValue: 'Rp 642.500.000 (Rp 4.120 / KM)',
            targetBenchmark: 'Rp 4.300 / KM',
            variancePct: -4.2,
            trendStatus: 'HEALTHY',
            financialImpactIdr: 28000000,
            aiObservation: 'Cost per KM turun 4.2% dipicu penurunan idle time sebesar 18% dan optimalisasi SPBU.',
          },
          {
            id: 'EX-03',
            metricCategory: '3. Fuel Consumption & Efficiency',
            currentMonthValue: '3.62 KM / Liter (44.200 Liters)',
            targetBenchmark: '3.50 KM / L',
            variancePct: 3.4,
            trendStatus: 'HEALTHY',
            financialImpactIdr: 18500000,
            aiObservation: 'Konsumsi solar membaik secara merata. Terdeteksi 3 unit dengan rasio anomali di Depo Cikarang.',
          },
          {
            id: 'EX-04',
            metricCategory: '4. Fleet Safety & Violation Index',
            currentMonthValue: '91.8 / 100 (Zero Fatality)',
            targetBenchmark: '90.0 / 100',
            variancePct: 2.0,
            trendStatus: 'HEALTHY',
            financialImpactIdr: 0,
            aiObservation: 'Program coaching mandiri driver menurunkan overspeed di jalan tol hingga 34%.',
          },
          {
            id: 'EX-05',
            metricCategory: '5. Maintenance & Workshop Downtime',
            currentMonthValue: 'Rp 118.400.000 (Downtime 4.2%)',
            targetBenchmark: '< 5.0% Downtime',
            variancePct: -0.8,
            trendStatus: 'HEALTHY',
            financialImpactIdr: 12000000,
            aiObservation: 'Preventive maintenance mencapai 88% ketaatan. Tidak ada keterlambatan uji KIR STNK bulan ini.',
          },
        ];

      case 'DELIVERY':
        return [
          {
            id: 'DEL-01',
            deliveryId: 'DO-JKT-8821',
            customerName: 'PT Indofood CBP Sukses Makmur',
            destination: 'Distribusi Center Cikarang Barat',
            vehiclePlate: 'B 9214 TDF',
            driverName: 'Agus Wijaya',
            deliveryDate: '2026-08-17',
            actualArrival: '10:15 WIB',
            slaStatus: 'ON_TIME',
            podStatus: 'SIGNED_VERIFIED',
          },
          {
            id: 'DEL-02',
            deliveryId: 'DO-JKT-8822',
            customerName: 'PT Unilever Indonesia Logistik',
            destination: 'Gudang Rungkut Industri Surabaya',
            vehiclePlate: 'B 9482 SXB',
            driverName: 'Budi Santoso',
            deliveryDate: '2026-08-17',
            actualArrival: '14:40 WIB',
            slaStatus: 'ON_TIME',
            podStatus: 'SIGNED_VERIFIED',
          },
          {
            id: 'DEL-03',
            deliveryId: 'DO-JKT-8823',
            customerName: 'PT Mayora Indah Tbk',
            destination: 'Depo Balaraja Barat, Tangerang',
            vehiclePlate: 'B 9102 KDA',
            driverName: 'Rudi Hartono',
            deliveryDate: '2026-08-17',
            actualArrival: '16:10 WIB (Late 25m)',
            slaStatus: 'DELAYED',
            podStatus: 'PENDING_SIGNATURE',
          },
        ];

      default:
        return [];
    }
  }

  /**
   * Calculates summary values (SUM, AVG, MIN, MAX, COUNT)
   */
  private static calculateSummaryRows(
    columns: ReportColumnDefinition[],
    rows: Record<string, any>[]
  ): ReportSummaryValue[] {
    const summary: ReportSummaryValue[] = [];

    columns.forEach(col => {
      if (!col.summaryType || col.summaryType === 'NONE') return;

      const numericValues = rows
        .map(r => r[col.id])
        .filter(v => typeof v === 'number' && !isNaN(v)) as number[];

      if (numericValues.length === 0 && col.summaryType !== 'COUNT') return;

      let value: number = 0;
      switch (col.summaryType) {
        case 'SUM':
          value = numericValues.reduce((sum, n) => sum + n, 0);
          break;
        case 'AVG':
          value = numericValues.length > 0
            ? Math.round((numericValues.reduce((sum, n) => sum + n, 0) / numericValues.length) * 10) / 10
            : 0;
          break;
        case 'MIN':
          value = Math.min(...numericValues);
          break;
        case 'MAX':
          value = Math.max(...numericValues);
          break;
        case 'COUNT':
          value = rows.length;
          break;
      }

      let formatted = `${value}`;
      if (col.dataType === 'currency') {
        formatted = `Rp ${Math.round(value).toLocaleString('id-ID')}`;
      } else if (col.dataType === 'percentage') {
        formatted = `${value}%`;
      } else if (col.dataType === 'number') {
        formatted = value.toLocaleString('id-ID');
      }

      summary.push({
        columnId: col.id,
        type: col.summaryType,
        value,
        formatted,
      });
    });

    return summary;
  }

  /**
   * Generate Domain KPIs
   */
  private static generateKPIs(
    domain: ReportDomainType,
    subType: ReportSubType,
    rows: Record<string, any>[]
  ) {
    const count = rows.length;

    switch (domain) {
      case 'COST': {
        const totalTOC = rows.reduce((s, r) => s + (r.totalCostIdr || 0), 0);
        const totalKM = rows.reduce((s, r) => s + (r.totalDistanceKm || 0), 0);
        const avgCostKM = totalKM > 0 ? Math.round(totalTOC / totalKM) : 0;
        return [
          { label: 'Total Operating Cost (TOC)', value: `Rp ${totalTOC.toLocaleString('id-ID')}`, subtext: 'Seluruh armada aktif', trend: { value: 3.8, isPositive: true } },
          { label: 'Rata-rata Biaya / KM', value: `Rp ${avgCostKM.toLocaleString('id-ID')}`, subtext: 'Target Rp 4.300 / KM', trend: { value: 4.2, isPositive: true } },
          { label: 'Total Jarak Tempuh', value: `${totalKM.toLocaleString('id-ID')} KM`, subtext: `${count} unit terdata` },
          { label: 'Penghematan Terealisasi', value: 'Rp 28.500.000', subtext: 'Vs Estimasi Anggaran' },
        ];
      }
      case 'FUEL': {
        const totalLiters = rows.reduce((s, r) => s + (r.liters || 0), 0);
        const totalFuelCost = rows.reduce((s, r) => s + (r.totalFuelCostIdr || 0), 0);
        const avgKmL = rows.length > 0
          ? Math.round((rows.reduce((s, r) => s + (r.fuelEfficiencyKmL || 0), 0) / rows.length) * 10) / 10
          : 3.5;
        return [
          { label: 'Total Konsumsi BBM', value: `${totalLiters.toLocaleString('id-ID')} L`, subtext: 'Bio Solar B35' },
          { label: 'Total Pengeluaran BBM', value: `Rp ${totalFuelCost.toLocaleString('id-ID')}`, subtext: 'Rata-rata Rp 14.500 / L' },
          { label: 'Rasio Efisiensi Rata-rata', value: `${avgKmL} KM/L`, subtext: 'Standar Industri 3.4 KM/L', trend: { value: 2.9, isPositive: true } },
          { label: 'Anomali BBM Terdeteksi', value: '3 Unit', subtext: 'Potensi kerugian Rp 2.45 Jt' },
        ];
      }
      case 'FLEET':
      case 'EXECUTIVE':
        return [
          { label: 'Total Unit Terdaftar', value: `${mockVehicles.length} Unit`, subtext: '4 Depo Operasional' },
          { label: 'Tingkat Utilisasi Armada', value: '86.4%', subtext: 'Target 85.0%', trend: { value: 1.6, isPositive: true } },
          { label: 'Skor Keselamatan Terpadu', value: '91.8 / 100', subtext: 'Kategori Sangat Baik', trend: { value: 2.1, isPositive: true } },
          { label: 'Kesiapan Armada (Availability)', value: '94.2%', subtext: 'Hanya 2 unit di bengkel' },
        ];
      default:
        return [
          { label: 'Total Baris Data', value: count.toString(), subtext: 'Terekam dalam periode ini' },
          { label: 'Status Eksekusi', value: 'Valid & Verified', subtext: 'Tersinkronisasi telematika IoT' },
          { label: 'Cakupan Filter', value: 'Semua Depo / Cabang', subtext: '100% data terintegrasi' },
        ];
    }
  }

  /**
   * Generate Chart Dataset
   */
  private static generateChartData(
    domain: ReportDomainType,
    subType: ReportSubType,
    rows: Record<string, any>[]
  ) {
    if (domain === 'COST') {
      return rows.slice(0, 8).map(r => ({
        name: r.vehiclePlate,
        fuel: r.fuelCostIdr,
        maintenance: r.maintenanceCostIdr,
        driver: r.driverCostIdr,
        toll: r.tollParkingCostIdr,
        total: r.totalCostIdr,
      }));
    }
    if (domain === 'FUEL') {
      return rows.slice(0, 8).map(r => ({
        name: r.vehiclePlate,
        liters: r.liters,
        kmL: r.fuelEfficiencyKmL,
        cost: r.totalFuelCostIdr,
      }));
    }
    if (domain === 'FLEET') {
      return rows.map(r => ({
        name: r.branchName,
        utilization: r.utilizationPct,
        safety: r.safetyScore,
        fleet: r.fleetCount,
      }));
    }
    return rows.slice(0, 8).map((r, i) => ({
      name: r.vehiclePlate || r.driverName || r.orderNumber || `Item ${i + 1}`,
      value: r.distanceKm || r.totalCostIdr || r.safetyScore || 10,
    }));
  }

  /**
   * Group dataset by key
   */
  private static buildGroupedData(
    rows: Record<string, any>[],
    groupBy: ReportGroupBy
  ) {
    const keyMap: Record<ReportGroupBy, string> = {
      NONE: '',
      VEHICLE: 'vehiclePlate',
      DRIVER: 'driverName',
      BRANCH: 'branchName',
      DATE: 'date',
      MONTH: 'month',
      TRIP: 'tripId',
      ROUTE: 'routeId',
      CUSTOMER: 'customerName',
      CATEGORY: 'serviceType',
    };

    const targetKey = keyMap[groupBy];
    if (!targetKey) return undefined;

    const groups = new Map<string, Record<string, any>[]>();

    rows.forEach(r => {
      const groupVal = r[targetKey] || 'Uncategorized';
      if (!groups.has(groupVal)) {
        groups.set(groupVal, []);
      }
      groups.get(groupVal)!.push(r);
    });

    return Array.from(groups.entries()).map(([groupLabel, items]) => ({
      groupKey: groupLabel,
      groupLabel,
      count: items.length,
      items,
    }));
  }

  /**
   * Formats human readable period
   */
  private static formatPeriodLabel(filters: ReportFilterCriteria): string {
    const presetLabels: Record<string, string> = {
      TODAY: 'Hari Ini (17 Agustus 2026)',
      YESTERDAY: 'Kemarin (16 Agustus 2026)',
      THIS_WEEK: 'Minggu Ini (11 - 17 Agustus 2026)',
      LAST_WEEK: 'Minggu Lalu (4 - 10 Agustus 2026)',
      THIS_MONTH: 'Bulan Ini (Agustus 2026)',
      LAST_MONTH: 'Bulan Lalu (Juli 2026)',
      THIS_QUARTER: 'Kuartal Ini (Q3 2026)',
      THIS_YEAR: 'Tahun 2026 (YTD)',
      LAST_YEAR: 'Tahun 2025',
      CUSTOM: `${filters.startDate || '2026-08-01'} s/d ${filters.endDate || '2026-08-17'}`,
    };
    return presetLabels[filters.periodPreset] || filters.periodPreset;
  }

  /**
   * Summary of applied filters
   */
  private static buildFilterSummaryString(filters: ReportFilterCriteria): string {
    const parts: string[] = [];
    if (filters.branchId && filters.branchId !== 'ALL') {
      const branch = mockBranches.find(b => b.id === filters.branchId);
      parts.push(`Cabang: ${branch?.name || filters.branchId}`);
    } else {
      parts.push('Semua Cabang');
    }

    if (filters.vehicleId && filters.vehicleId !== 'ALL') {
      const v = mockVehicles.find(item => item.id === filters.vehicleId);
      parts.push(`Unit: ${v?.plateNumber || (v as any)?.licensePlate || filters.vehicleId}`);
    }

    if (filters.driverId && filters.driverId !== 'ALL') {
      const d = mockDrivers.find(item => item.id === filters.driverId);
      parts.push(`Driver: ${d?.name || filters.driverId}`);
    }

    return parts.join(' | ');
  }
}
