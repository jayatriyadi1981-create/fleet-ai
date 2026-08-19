/**
 * Fleet Intelligence Smart AI - Vehicle Service & Repository
 * PROMPT 9 - Master Data Vehicle CRUD, Groups, Branches, Departments & Documents
 */

import { 
  VehicleExtended, 
  VehicleGroup, 
  BranchExtended, 
  Department, 
  VehicleDocument, 
  VehicleAssignmentHistory, 
  VehicleActivityLog, 
  VehicleFilterParams, 
  VehicleListResponse,
  VehicleAIInsightDetail
} from '../types/vehicle';
import { mockVehicles, mockBranches, mockDrivers, mockGpsDevices } from '../constants/mockData';

// Initial Repository Seed Data
let vehiclesRepository: VehicleExtended[] = mockVehicles.map((v, i) => ({
  id: v.id,
  tenantId: v.tenantId || 'tenant-tln-01',
  vehicleCode: `VH-00${120 + i}`,
  name: `${v.brand} ${v.model}`,
  licensePlate: v.plateNumber,
  type: v.type,
  brand: v.brand,
  model: v.model,
  variant: i % 2 === 0 ? 'Long Chassis Box' : 'Standard Heavy Duty',
  year: v.year,
  color: i % 2 === 0 ? 'Putih - White' : 'Kuning - Yellow',
  fuelType: v.fuelType,
  transmission: 'manual',
  ownership: 'company_owned',

  // Technical Specs
  vin: v.vin || `MHF1TR30928${1000 + i}`,
  chassisNumber: `CHS-${v.brand.substring(0, 3).toUpperCase()}-202${i}-${100 + i}`,
  engineNumber: `ENG-J08E-UT${200 + i}`,
  engineCapacityCc: 7684,
  fuelCapacityLiters: v.fuelCapacityLiters || 200,
  payloadKg: 12000,
  grossVehicleWeightKg: 18000,
  numberOfWheels: 6,
  tireSize: '10.00-20 16PR',
  odometerKm: v.odometerKm,
  engineHours: v.engineHours,

  // Legal & Registration
  stnkNumber: `STNK-0912384-${i + 1}`,
  stnkExpiry: v.stnkExpiry || '2027-08-20',
  bpkbNumber: `BPKB-J821903-${i + 1}`,
  kirNumber: `KIR-JABAR-92019-${i + 1}`,
  kirExpiry: v.kirExpiry || '2026-12-10',
  pajakExpiry: '2027-08-20',
  insuranceCompany: 'PT Asuransi Sinar Mas',
  insurancePolicyNumber: `POL-SM-2026-${500 + i}`,
  insuranceExpiry: v.insuranceExpiry || '2027-03-15',
  registrationStatus: 'valid',

  // Organization
  groupId: `grp-${(i % 3) + 1}`,
  groupName: v.groupName || 'Armada Trans-Jawa',
  branchId: v.branchId || 'br-jkt',
  branchName: mockBranches.find((b) => b.id === v.branchId)?.name || 'HQ & Depo Jakarta',
  departmentId: 'dept-ops',
  departmentName: 'Operations & Logistics',
  primaryDriverId: v.currentDriverId,
  primaryDriverName: mockDrivers.find((d) => d.id === v.currentDriverId)?.name || 'Sutrisno Hartono',
  backupDriverId: undefined,
  backupDriverName: undefined,

  // GPS
  gpsDeviceId: v.gpsDeviceId || `dev-0${(i % 5) + 1}`,
  gpsImei: mockGpsDevices.find((g) => g.id === v.gpsDeviceId)?.imei || '864201049283011',
  gpsStatus: v.status === 'offline' ? 'offline' : 'online',
  latestTelemetry: v.latestTelemetry,

  // Statuses
  status: v.status === 'moving' || v.status === 'idle' || v.status === 'parking' ? 'moving' : v.status,
  operationalStatus: v.status === 'moving' ? 'moving' : v.status === 'idle' ? 'idle' : 'stopped',

  // Metadata
  maintenanceOverdue: v.maintenanceOverdue,
  createdAt: '2025-01-10T08:00:00Z',
  updatedAt: '2026-08-14T10:30:00Z',
  healthScore: 88 - i * 3,
}));

// Additional Seed Vehicles for Enterprise Depth
vehiclesRepository.push(
  {
    id: 'veh-06',
    tenantId: 'tenant-tln-01',
    vehicleCode: 'VH-00125',
    name: 'Scania R450 Streamline Tanker',
    licensePlate: 'B 9876 SCB',
    type: 'truck_container',
    brand: 'Scania',
    model: 'R450 Tractor Head',
    variant: '6x2 Heavy Hauler',
    year: 2024,
    color: 'Merah - Red',
    fuelType: 'biodiesel_b35',
    transmission: 'automatic',
    ownership: 'company_owned',
    vin: 'SCN91823019283019',
    chassisNumber: 'CHS-SCN-2024-901',
    engineNumber: 'ENG-DC13-148',
    engineCapacityCc: 12700,
    fuelCapacityLiters: 400,
    payloadKg: 35000,
    grossVehicleWeightKg: 45000,
    numberOfWheels: 10,
    tireSize: '315/80 R22.5',
    odometerKm: 112450,
    engineHours: 4200,
    stnkNumber: 'STNK-0912384-6',
    stnkExpiry: '2026-08-28', // Expiring Soon!
    bpkbNumber: 'BPKB-J821903-6',
    kirNumber: 'KIR-JABAR-92019-6',
    kirExpiry: '2026-08-25', // Expiring Soon!
    pajakExpiry: '2026-08-28',
    insuranceCompany: 'PT Asuransi Astra Buana',
    insurancePolicyNumber: 'POL-ASTRA-2026-901',
    insuranceExpiry: '2027-01-10',
    registrationStatus: 'expiring_soon',
    groupId: 'grp-2',
    groupName: 'Armada Heavy Tanker',
    branchId: 'br-ckr',
    branchName: 'Hub Logistik Cikarang Dry Port',
    departmentId: 'dept-ops',
    departmentName: 'Operations & Logistics',
    primaryDriverId: 'drv-02',
    primaryDriverName: 'Ahmad Dahlan',
    gpsDeviceId: 'dev-04',
    gpsImei: '864201049283044',
    gpsStatus: 'online',
    status: 'idle',
    operationalStatus: 'idle',
    maintenanceOverdue: true,
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2026-08-14T11:00:00Z',
    healthScore: 74,
  },
  {
    id: 'veh-07',
    tenantId: 'tenant-tln-01',
    vehicleCode: 'VH-00126',
    name: 'Mitsubishi Fuso Canter FE 74 HD',
    licensePlate: 'D 8812 BNG',
    type: 'truck_box',
    brand: 'Mitsubishi Fuso',
    model: 'Canter FE 74 HD',
    variant: 'Light Truck Box 6-Roda',
    year: 2023,
    color: 'Kuning - Yellow',
    fuelType: 'biodiesel_b35',
    transmission: 'manual',
    ownership: 'leased',
    vin: 'MFT1TR30928108812',
    chassisNumber: 'CHS-FSO-2023-812',
    engineNumber: 'ENG-4D34-2AT2',
    engineCapacityCc: 3908,
    fuelCapacityLiters: 100,
    payloadKg: 5000,
    grossVehicleWeightKg: 7500,
    numberOfWheels: 6,
    tireSize: '7.50-16 14PR',
    odometerKm: 64200,
    engineHours: 2100,
    stnkNumber: 'STNK-0912384-7',
    stnkExpiry: '2026-07-15', // Expired!
    bpkbNumber: 'BPKB-J821903-7',
    kirNumber: 'KIR-JABAR-92019-7',
    kirExpiry: '2026-07-20', // Expired!
    pajakExpiry: '2026-07-15',
    insuranceCompany: 'PT Asuransi MSIG Indonesia',
    insurancePolicyNumber: 'POL-MSIG-2026-812',
    insuranceExpiry: '2027-02-15',
    registrationStatus: 'expired',
    groupId: 'grp-1',
    groupName: 'Armada Jabodetabek',
    branchId: 'br-jkt',
    branchName: 'HQ & Depo Jakarta (Tanjung Priok)',
    departmentId: 'dept-dist',
    departmentName: 'Distribution & Retail',
    primaryDriverId: 'drv-01',
    primaryDriverName: 'Sutrisno Hartono',
    gpsDeviceId: 'dev-05',
    gpsImei: '864201049283055',
    gpsStatus: 'offline',
    status: 'under_maintenance',
    operationalStatus: 'stopped',
    maintenanceOverdue: true,
    createdAt: '2025-03-12T08:00:00Z',
    updatedAt: '2026-08-14T11:15:00Z',
    healthScore: 62,
  }
);

// Initial Vehicle Groups Repository
let vehicleGroupsRepository: VehicleGroup[] = [
  { id: 'grp-1', tenantId: 'tenant-tln-01', name: 'Armada Jabodetabek & Express', code: 'GRP-JBD', description: 'Armada distribusi khusus wilayah Jakarta, Bogor, Depok, Tangerang, Bekasi', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Bambang Soeprapto', vehiclesCount: 18, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'grp-2', tenantId: 'tenant-tln-01', name: 'Armada Trans-Jawa Long Haul', code: 'GRP-TJW', description: 'Truk Tronton & Trailer khusus rute antar kota Jalur Pantura Trans-Jawa', branchId: 'br-ckr', branchName: 'Hub Logistik Cikarang', managerName: 'Rudi Hermawan', vehiclesCount: 24, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'grp-3', tenantId: 'tenant-tln-01', name: 'Armada Tanker BBM & Cairan', code: 'GRP-TNK', description: 'Kendaraan kargo tangki BBM Biodiesel B35 dan bahan kimia cair Industri', branchId: 'br-sby', branchName: 'Depo Surabaya', managerName: 'Agus Wijaya', vehiclesCount: 12, status: 'active', createdAt: '2025-02-15T00:00:00Z' },
  { id: 'grp-4', tenantId: 'tenant-tln-01', name: 'Armada Cold Chain Refrigerator', code: 'GRP-CCL', description: 'Truk box refrigasi suhu terkatub untuk produk bahan pangan & farmasi', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Bambang Soeprapto', vehiclesCount: 8, status: 'active', createdAt: '2025-03-20T00:00:00Z' },
];

// Initial Branches Repository
let branchesRepository: BranchExtended[] = mockBranches.map((b) => ({
  id: b.id,
  tenantId: b.tenantId || 'tenant-tln-01',
  name: b.name,
  code: b.code,
  address: 'Jl. Raya Tanjung Priok No. 102, Jakarta Utara',
  province: 'DKI Jakarta',
  city: b.city,
  district: 'Tanjung Priok',
  village: 'Kebon Bawang',
  postalCode: '14320',
  phone: '+62 21 4390 1234',
  email: `branch.${b.code.toLowerCase()}@translogistik.co.id`,
  managerName: b.managerName,
  status: 'active',
  vehiclesCount: b.vehiclesCount,
}));

// Initial Departments Repository
let departmentsRepository: Department[] = [
  { id: 'dept-ops', tenantId: 'tenant-tln-01', name: 'Operations & Logistics Dispatch', code: 'D-OPS', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Hendrikus Setiawan', vehiclesCount: 32, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-dist', tenantId: 'tenant-tln-01', name: 'Distribution & Retail Delivery', code: 'D-DST', branchId: 'br-ckr', branchName: 'Hub Cikarang Dry Port', managerName: 'Rudi Hermawan', vehiclesCount: 20, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-maint', tenantId: 'tenant-tln-01', name: 'Fleet Maintenance & Workshop', code: 'D-MNT', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Toni Suhendar', vehiclesCount: 0, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-sales', tenantId: 'tenant-tln-01', name: 'Commercial & Sales Fleet', code: 'D-SLS', branchId: 'br-sby', branchName: 'Depo Surabaya', managerName: 'Agus Wijaya', vehiclesCount: 10, status: 'active', createdAt: '2025-02-10T00:00:00Z' },
];

// Initial Documents Mock Repository
let vehicleDocumentsRepository: Record<string, VehicleDocument[]> = {
  'veh-01': [
    { id: 'doc-1', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'stnk', documentNumber: 'STNK-0912384-1', title: 'Surat Tanda Nomor Kendaraan (STNK)', issueDate: '2022-08-20', expiryDate: '2027-08-20', fileName: 'STNK_B9482UTX.pdf', fileSizeMb: 1.8, status: 'valid', createdAt: '2022-08-20T00:00:00Z' },
    { id: 'doc-2', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'kir', documentNumber: 'KIR-JABAR-92019-1', title: 'Buku Uji Berkala KIR Dishub', issueDate: '2026-06-10', expiryDate: '2026-12-10', fileName: 'KIR_B9482UTX.pdf', fileSizeMb: 2.1, status: 'valid', createdAt: '2026-06-10T00:00:00Z' },
    { id: 'doc-3', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'insurance', documentNumber: 'POL-SM-2026-501', title: 'Polis Asuransi All Risk Commercial', issueDate: '2026-03-15', expiryDate: '2027-03-15', fileName: 'Asuransi_SinarMas_B9482UTX.pdf', fileSizeMb: 3.4, status: 'valid', createdAt: '2026-03-15T00:00:00Z' },
  ],
};

// Activity Log Repository
let vehicleActivityLogsRepository: Record<string, VehicleActivityLog[]> = {
  'veh-01': [
    { id: 'act-1', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-08-10T14:30:00Z', eventType: 'driver_assigned', title: 'Penugasan Pengemudi Utama', description: 'Pengemudi Sutrisno Hartono ditugaskan ke kendaraan Hino Ranger B 9482 UTX.', performedBy: 'Hendrikus Setiawan (Fleet Mgr)' },
    { id: 'act-2', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-08-01T09:15:00Z', eventType: 'branch_assigned', title: 'Mutasi Cabang Operasional', description: 'Lokasi cabang diperbarui dari Depo Bandung ke HQ & Depo Jakarta.', performedBy: 'System Admin' },
    { id: 'act-3', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-07-20T11:00:00Z', eventType: 'gps_assigned', title: 'Pemasangan Sensor GPS Teltonika', description: 'GPS Device dev-01 (IMEI: 864201049283011) di-binding ke kendaraan.', performedBy: 'Teknisi Workshop' },
  ],
};

export const vehicleService = {
  /**
   * List vehicles with searching, filtering, pagination, and tenant isolation
   */
  async listVehicles(params: VehicleFilterParams = {}): Promise<VehicleListResponse> {
    await new Promise((res) => setTimeout(res, 120)); // simulated latency

    const {
      tenantId = 'tenant-tln-01',
      branchId = 'all',
      departmentId = 'all',
      groupId = 'all',
      status = 'all',
      operationalStatus = 'all',
      gpsStatus = 'all',
      type = 'all',
      fuelType = 'all',
      ownership = 'all',
      search = '',
      page = 1,
      pageSize = 25,
      sortBy = 'name',
      sortOrder = 'asc',
      isArchived = false,
    } = params;

    let filtered = vehiclesRepository.filter((v) => {
      // Tenant Isolation Check
      if (tenantId && v.tenantId !== tenantId) return false;

      // Archive Status Filter
      if (isArchived ? !v.archivedAt : v.archivedAt) return false;

      // Branch Scope Filter
      if (branchId !== 'all' && v.branchId !== branchId) return false;

      // Department Filter
      if (departmentId !== 'all' && v.departmentId !== departmentId) return false;

      // Group Filter
      if (groupId !== 'all' && v.groupId !== groupId) return false;

      // Status Filter
      if (status !== 'all' && v.status.toLowerCase() !== status.toLowerCase()) return false;

      // Operational Status Filter
      if (operationalStatus !== 'all' && v.operationalStatus !== operationalStatus) return false;

      // GPS Status Filter
      if (gpsStatus !== 'all' && v.gpsStatus !== gpsStatus) return false;

      // Vehicle Type Filter
      if (type !== 'all' && v.type !== type) return false;

      // Fuel Type Filter
      if (fuelType !== 'all' && v.fuelType !== fuelType) return false;

      // Ownership Filter
      if (ownership !== 'all' && v.ownership !== ownership) return false;

      // Multi-Field Search Query Match
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesPlate = v.licensePlate.toLowerCase().includes(q);
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesCode = v.vehicleCode.toLowerCase().includes(q);
        const matchesVin = v.vin.toLowerCase().includes(q);
        const matchesChassis = v.chassisNumber.toLowerCase().includes(q);
        const matchesEngine = v.engineNumber.toLowerCase().includes(q);
        const matchesGps = v.gpsDeviceId.toLowerCase().includes(q) || (v.gpsImei && v.gpsImei.includes(q));
        const matchesDriver = v.primaryDriverName ? v.primaryDriverName.toLowerCase().includes(q) : false;
        const matchesGroup = v.groupName ? v.groupName.toLowerCase().includes(q) : false;
        const matchesBranch = v.branchName ? v.branchName.toLowerCase().includes(q) : false;

        return (
          matchesPlate ||
          matchesName ||
          matchesCode ||
          matchesVin ||
          matchesChassis ||
          matchesEngine ||
          matchesGps ||
          matchesDriver ||
          matchesGroup ||
          matchesBranch
        );
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof VehicleExtended] || '';
      let valB: any = b[sortBy as keyof VehicleExtended] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination Calculation
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedVehicles = filtered.slice(startIndex, startIndex + pageSize);

    return {
      vehicles: paginatedVehicles,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Get single vehicle profile by ID
   */
  async getVehicleById(id: string): Promise<VehicleExtended | null> {
    await new Promise((res) => setTimeout(res, 80));
    const vehicle = vehiclesRepository.find((v) => v.id === id);
    return vehicle || null;
  },

  /**
   * Create vehicle with duplicate license plate check per tenant scope
   */
  async createVehicle(data: Partial<VehicleExtended> & { name: string; licensePlate: string; type: any }): Promise<VehicleExtended> {
    await new Promise((res) => setTimeout(res, 200));

    const tenantId = data.tenantId || 'tenant-tln-01';
    const normalizedPlate = data.licensePlate.trim().toUpperCase();

    // License Plate Duplicate Check per Tenant Scope
    const existing = vehiclesRepository.find(
      (v) => v.tenantId === tenantId && v.licensePlate.toUpperCase() === normalizedPlate && !v.archivedAt
    );

    if (existing) {
      throw new Error(`Plat nomor "${normalizedPlate}" sudah terdaftar pada tenant ini. Silakan periksa kembali.`);
    }

    const newId = `veh-${Date.now().toString().slice(-4)}`;
    const newCode = `VH-00${vehiclesRepository.length + 120}`;

    const newVehicle: VehicleExtended = {
      id: newId,
      tenantId,
      vehicleCode: data.vehicleCode || newCode,
      name: data.name,
      licensePlate: normalizedPlate,
      type: data.type,
      brand: data.brand || 'Isuzu',
      model: data.model || 'Giga Series',
      variant: data.variant || 'Standard Truck',
      year: data.year || 2024,
      color: data.color || 'Putih - White',
      fuelType: data.fuelType || 'biodiesel_b35',
      transmission: data.transmission || 'manual',
      ownership: data.ownership || 'company_owned',

      vin: data.vin || `MHF1TR${Date.now()}`,
      chassisNumber: data.chassisNumber || `CHS-ISZ-${Date.now().toString().slice(-5)}`,
      engineNumber: data.engineNumber || `ENG-4HK1-${Date.now().toString().slice(-5)}`,
      engineCapacityCc: data.engineCapacityCc || 5193,
      fuelCapacityLiters: data.fuelCapacityLiters || 200,
      payloadKg: data.payloadKg || 8000,
      grossVehicleWeightKg: data.grossVehicleWeightKg || 14000,
      numberOfWheels: data.numberOfWheels || 6,
      tireSize: data.tireSize || '8.25-16 14PR',
      odometerKm: data.odometerKm || 0,
      engineHours: data.engineHours || 0,

      stnkNumber: data.stnkNumber || '',
      stnkExpiry: data.stnkExpiry || '2027-12-31',
      bpkbNumber: data.bpkbNumber || '',
      kirNumber: data.kirNumber || '',
      kirExpiry: data.kirExpiry || '2027-06-30',
      pajakExpiry: data.pajakExpiry || '2027-12-31',
      insuranceCompany: data.insuranceCompany || 'PT Asuransi Sinar Mas',
      insurancePolicyNumber: data.insurancePolicyNumber || '',
      insuranceExpiry: data.insuranceExpiry || '2027-12-31',
      registrationStatus: 'valid',

      groupId: data.groupId || 'grp-1',
      groupName: vehicleGroupsRepository.find((g) => g.id === data.groupId)?.name || 'Armada Jabodetabek',
      branchId: data.branchId || 'br-jkt',
      branchName: branchesRepository.find((b) => b.id === data.branchId)?.name || 'HQ & Depo Jakarta',
      departmentId: data.departmentId || 'dept-ops',
      departmentName: departmentsRepository.find((d) => d.id === data.departmentId)?.name || 'Operations & Logistics',

      primaryDriverId: data.primaryDriverId,
      primaryDriverName: mockDrivers.find((d) => d.id === data.primaryDriverId)?.name,
      backupDriverId: data.backupDriverId,
      backupDriverName: mockDrivers.find((d) => d.id === data.backupDriverId)?.name,

      gpsDeviceId: data.gpsDeviceId || 'dev-01',
      gpsImei: mockGpsDevices.find((g) => g.id === data.gpsDeviceId)?.imei || '864201049283011',
      gpsStatus: 'online',

      status: data.status || 'moving',
      operationalStatus: 'stopped',

      maintenanceOverdue: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthScore: 95,
    };

    vehiclesRepository.unshift(newVehicle);

    // Add activity log
    this.addActivityLog(newId, {
      eventType: 'created',
      title: 'Kendaraan Baru Dibuat',
      description: `Unit ${newVehicle.name} (${newVehicle.licensePlate}) berhasil ditambahkan ke sistem master data.`,
      performedBy: 'User Administrator',
    });

    return newVehicle;
  },

  /**
   * Update existing vehicle
   */
  async updateVehicle(id: string, updates: Partial<VehicleExtended>): Promise<VehicleExtended> {
    await new Promise((res) => setTimeout(res, 180));

    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Kendaraan ID ${id} tidak ditemukan.`);
    }

    const current = vehiclesRepository[index];

    // Duplicate plate check if plate is updated
    if (updates.licensePlate && updates.licensePlate.toUpperCase() !== current.licensePlate.toUpperCase()) {
      const normalizedPlate = updates.licensePlate.trim().toUpperCase();
      const existing = vehiclesRepository.find(
        (v) => v.tenantId === current.tenantId && v.licensePlate.toUpperCase() === normalizedPlate && v.id !== id && !v.archivedAt
      );
      if (existing) {
        throw new Error(`Plat nomor "${normalizedPlate}" sudah digunakan oleh kendaraan lain.`);
      }
      updates.licensePlate = normalizedPlate;
    }

    const updatedVehicle: VehicleExtended = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    vehiclesRepository[index] = updatedVehicle;

    this.addActivityLog(id, {
      eventType: 'updated',
      title: 'Profil Kendaraan Diperbarui',
      description: 'Data spesifikasi teknis / pendaftaran kendaraan telah diperbarui.',
      performedBy: 'User Administrator',
    });

    return updatedVehicle;
  },

  /**
   * Archive vehicle (Soft Delete)
   */
  async archiveVehicle(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 150));
    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehiclesRepository[index].archivedAt = new Date().toISOString();
      vehiclesRepository[index].status = 'archived';

      this.addActivityLog(id, {
        eventType: 'archived',
        title: 'Kendaraan Diarsipkan (Soft Delete)',
        description: 'Unit kendaraan diarsipkan. Riwayat GPS dan historical trip tetap tersimpan aman.',
        performedBy: 'User Administrator',
      });
      return true;
    }
    return false;
  },

  /**
   * Restore archived vehicle
   */
  async restoreVehicle(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 150));
    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehiclesRepository[index].archivedAt = undefined;
      vehiclesRepository[index].status = 'moving';
      return true;
    }
    return false;
  },

  /**
   * Driver Assignment
   */
  async assignDriver(vehicleId: string, driverId: string, driverName?: string): Promise<VehicleExtended> {
    const drv = mockDrivers.find((d) => d.id === driverId);
    const name = driverName || drv?.name || 'Driver Assigned';

    const vehicle = await this.updateVehicle(vehicleId, {
      primaryDriverId: driverId,
      primaryDriverName: name,
    });

    this.addActivityLog(vehicleId, {
      eventType: 'driver_assigned',
      title: 'Penugasan Pengemudi Baru',
      description: `Pengemudi ${name} resmi ditugaskan membawa unit ${vehicle.licensePlate}.`,
      performedBy: 'Fleet Operations Manager',
    });

    return vehicle;
  },

  /**
   * GPS Device Assignment
   */
  async assignGpsDevice(vehicleId: string, gpsDeviceId: string): Promise<VehicleExtended> {
    const dev = mockGpsDevices.find((g) => g.id === gpsDeviceId);

    const vehicle = await this.updateVehicle(vehicleId, {
      gpsDeviceId,
      gpsImei: dev?.imei || '864201049283099',
      gpsStatus: 'online',
    });

    this.addActivityLog(vehicleId, {
      eventType: 'gps_assigned',
      title: 'Binding Perangkat GPS Telematika',
      description: `GPS ID ${gpsDeviceId} (${dev?.model || 'Device'}) berhasil terhubung ke kendaraan.`,
      performedBy: 'IoT Support Engineer',
    });

    return vehicle;
  },

  /**
   * Vehicle Documents Management
   */
  async getVehicleDocuments(vehicleId: string): Promise<VehicleDocument[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleDocumentsRepository[vehicleId] || [];
  },

  async addVehicleDocument(vehicleId: string, doc: Omit<VehicleDocument, 'id' | 'createdAt'>): Promise<VehicleDocument> {
    await new Promise((res) => setTimeout(res, 100));

    const newDoc: VehicleDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (!vehicleDocumentsRepository[vehicleId]) {
      vehicleDocumentsRepository[vehicleId] = [];
    }

    vehicleDocumentsRepository[vehicleId].unshift(newDoc);

    this.addActivityLog(vehicleId, {
      eventType: 'document_added',
      title: `Dokumen ${newDoc.type.toUpperCase()} Ditambahkan`,
      description: `Dokumen ${newDoc.title} (${newDoc.documentNumber}) berlaku hingga ${newDoc.expiryDate}.`,
      performedBy: 'Legal & Registration Staff',
    });

    return newDoc;
  },

  /**
   * Activity Timeline & Audit Logs
   */
  async getVehicleActivityLogs(vehicleId: string): Promise<VehicleActivityLog[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleActivityLogsRepository[vehicleId] || [];
  },

  addActivityLog(vehicleId: string, log: Omit<VehicleActivityLog, 'id' | 'vehicleId' | 'tenantId' | 'timestamp'>) {
    const newLog: VehicleActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
      vehicleId,
      tenantId: 'tenant-tln-01',
      timestamp: new Date().toISOString(),
    };

    if (!vehicleActivityLogsRepository[vehicleId]) {
      vehicleActivityLogsRepository[vehicleId] = [];
    }
    vehicleActivityLogsRepository[vehicleId].unshift(newLog);
  },

  /**
   * AI Insight for Vehicle
   */
  async getVehicleAIInsight(vehicleId: string): Promise<VehicleAIInsightDetail> {
    await new Promise((res) => setTimeout(res, 100));
    const vehicle = vehiclesRepository.find((v) => v.id === vehicleId);

    return {
      id: `ai-veh-${vehicleId}`,
      vehicleId,
      healthScore: vehicle?.healthScore || 85,
      healthBreakdown: {
        engine: 88,
        battery: 92,
        gpsSensor: 98,
        tires: 78,
        fuelSystem: 84,
      },
      anomalies: [
        {
          id: 'anom-1',
          type: 'fuel_consumption',
          title: 'Konsumsi BBM 18% Diatas Baseline',
          description: 'Telemetri mendeteksi konsumsi BBM 18% lebih boros dibanding rata-rata 30 hari untuk rute Jakarta - Cikarang.',
          confidencePercent: 87,
          recommendation: 'Jadwalkan pemeriksaan injector bahan bakar & bersihkan filter udara pada perawatan berikutnya.',
        },
        {
          id: 'anom-2',
          type: 'tire_wear',
          title: 'Prediksi Keausan Ban Depan Kanan',
          description: 'Getaran sensor akselerometer mendeteksi ketidakseimbangan roda depan (wheel alignment issue).',
          confidencePercent: 82,
          recommendation: 'Lakukan Spooring & Balancing ban depan sebelum perjalanan jarak jauh berikutnya.',
        },
      ],
      riskLevel: vehicle?.maintenanceOverdue ? 'HIGH' : 'LOW',
    };
  },

  /**
   * Vehicle Groups CRUD
   */
  async listGroups(tenantId = 'tenant-tln-01'): Promise<VehicleGroup[]> {
    await new Promise((res) => setTimeout(res, 60));
    return vehicleGroupsRepository.filter((g) => g.tenantId === tenantId);
  },

  async createGroup(name: string, description: string, branchId?: string): Promise<VehicleGroup> {
    const newGrp: VehicleGroup = {
      id: `grp-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name,
      code: `GRP-${name.substring(0, 3).toUpperCase()}`,
      description,
      branchId,
      vehiclesCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    vehicleGroupsRepository.push(newGrp);
    return newGrp;
  },

  /**
   * Branches CRUD
   */
  async listBranches(tenantId = 'tenant-tln-01'): Promise<BranchExtended[]> {
    await new Promise((res) => setTimeout(res, 60));
    return branchesRepository.filter((b) => b.tenantId === tenantId);
  },

  async createBranch(data: Partial<BranchExtended> & { name: string; city: string }): Promise<BranchExtended> {
    const newBranch: BranchExtended = {
      id: `br-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name: data.name,
      code: data.code || `BR-${data.city.substring(0, 3).toUpperCase()}`,
      address: data.address || 'Jl. Raya Industri Utama No. 45',
      province: data.province || 'Jawa Barat',
      city: data.city,
      phone: data.phone || '+62 21 8900 1122',
      email: data.email || `branch.${data.city.toLowerCase()}@translogistik.co.id`,
      managerName: data.managerName || 'Manager Cabang',
      status: 'active',
      vehiclesCount: 0,
    };
    branchesRepository.push(newBranch);
    return newBranch;
  },

  /**
   * Departments CRUD
   */
  async listDepartments(tenantId = 'tenant-tln-01'): Promise<Department[]> {
    await new Promise((res) => setTimeout(res, 60));
    return departmentsRepository.filter((d) => d.tenantId === tenantId);
  },

  async createDepartment(name: string, branchId: string, managerName: string): Promise<Department> {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name,
      code: `D-${name.substring(0, 3).toUpperCase()}`,
      branchId,
      branchName: branchesRepository.find((b) => b.id === branchId)?.name || 'HQ Branch',
      managerName,
      vehiclesCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    departmentsRepository.push(newDept);
    return newDept;
  },

  /**
   * Bulk Actions
   */
  async bulkAssignGroup(vehicleIds: string[], groupId: string): Promise<number> {
    const group = vehicleGroupsRepository.find((g) => g.id === groupId);
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.groupId = groupId;
        v.groupName = group?.name || 'Group';
        count++;
      }
    });
    return count;
  },

  async bulkAssignBranch(vehicleIds: string[], branchId: string): Promise<number> {
    const branch = branchesRepository.find((b) => b.id === branchId);
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.branchId = branchId;
        v.branchName = branch?.name || 'Branch';
        count++;
      }
    });
    return count;
  },

  async bulkChangeStatus(vehicleIds: string[], status: any): Promise<number> {
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.status = status;
        count++;
      }
    });
    return count;
  },

  async bulkArchive(vehicleIds: string[]): Promise<number> {
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.archivedAt = new Date().toISOString();
        v.status = 'archived';
        count++;
      }
    });
    return count;
  },

  /**
   * Export Vehicles to CSV string
   */
  exportVehiclesToCsv(vehicles: VehicleExtended[]): string {
    const headers = [
      'Vehicle Code',
      'License Plate',
      'Vehicle Name',
      'Type',
      'Brand',
      'Model',
      'Year',
      'Fuel Type',
      'Status',
      'Branch',
      'Group',
      'Primary Driver',
      'GPS Device ID',
      'Odometer (KM)',
      'STNK Expiry',
      'KIR Expiry',
    ];

    const rows = vehicles.map((v) => [
      v.vehicleCode,
      v.licensePlate,
      `"${v.name}"`,
      v.type,
      v.brand,
      v.model,
      v.year,
      v.fuelType,
      v.status,
      `"${v.branchName}"`,
      `"${v.groupName}"`,
      `"${v.primaryDriverName || 'Unassigned'}"`,
      v.gpsDeviceId,
      v.odometerKm,
      v.stnkExpiry || '-',
      v.kirExpiry || '-',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
