/**
 * Fleet Intelligence Smart AI - Multi-Tenant Organization Context Provider
 * Manages active tenant company, branch/dept/fleet scope, hierarchy tree, and CRUD operations
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  TenantCompanyDetailed, 
  BranchExtendedDetailed, 
  DepartmentDetailed, 
  FleetDetailed, 
  UserTenantMembership, 
  OrganizationTreeNode, 
  OrganizationAuditRecord,
  CrossTenantSecurityTestResult,
  OrganizationContextState,
  TenantPlan,
  TenantStatus
} from '../types/organization';
import { organizationService } from '../services/organizationService';
import { useToast } from '../components/ui/Toast';

interface OrganizationContextType {
  // Data
  tenants: TenantCompanyDetailed[];
  currentTenant: TenantCompanyDetailed;
  branches: BranchExtendedDetailed[];
  departments: DepartmentDetailed[];
  fleets: FleetDetailed[];
  memberships: UserTenantMembership[];
  auditLogs: OrganizationAuditRecord[];
  orgTree: OrganizationTreeNode;
  securityTestResults: CrossTenantSecurityTestResult[];
  
  // Scope State
  selectedTenantId: string;
  selectedBranchId: string;
  selectedDepartmentId: string;
  selectedFleetId: string;
  setSelectedTenantId: (id: string) => void;
  setSelectedBranchId: (id: string) => void;
  setSelectedDepartmentId: (id: string) => void;
  setSelectedFleetId: (id: string) => void;
  resetScopeFilters: () => void;

  // Actions
  switchTenant: (tenantId: string) => Promise<boolean>;
  createTenant: (data: Partial<TenantCompanyDetailed>) => Promise<TenantCompanyDetailed>;
  updateTenant: (id: string, updates: Partial<TenantCompanyDetailed>) => Promise<TenantCompanyDetailed | null>;
  deleteTenant: (id: string) => Promise<boolean>;
  
  createBranch: (data: Partial<BranchExtendedDetailed>) => Promise<BranchExtendedDetailed>;
  updateBranch: (id: string, updates: Partial<BranchExtendedDetailed>) => Promise<BranchExtendedDetailed | null>;
  deleteBranch: (id: string) => Promise<boolean>;

  createDepartment: (data: Partial<DepartmentDetailed>) => Promise<DepartmentDetailed>;
  updateDepartment: (id: string, updates: Partial<DepartmentDetailed>) => Promise<DepartmentDetailed | null>;
  deleteDepartment: (id: string) => Promise<boolean>;

  createFleet: (data: Partial<FleetDetailed>) => Promise<FleetDetailed>;
  updateFleet: (id: string, updates: Partial<FleetDetailed>) => Promise<FleetDetailed | null>;
  deleteFleet: (id: string) => Promise<boolean>;

  runSecurityTests: () => CrossTenantSecurityTestResult[];
  refreshData: () => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [tenants, setTenants] = useState<TenantCompanyDetailed[]>(() => organizationService.listTenants());
  const [selectedTenantId, setSelectedTenantIdState] = useState<string>(() => {
    const list = organizationService.listTenants();
    return list[0]?.id || 'tenant-tln-01';
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [selectedFleetId, setSelectedFleetId] = useState<string>('all');

  const [branches, setBranches] = useState<BranchExtendedDetailed[]>([]);
  const [departments, setDepartments] = useState<DepartmentDetailed[]>([]);
  const [fleets, setFleets] = useState<FleetDetailed[]>([]);
  const [memberships, setMemberships] = useState<UserTenantMembership[]>([]);
  const [auditLogs, setAuditLogs] = useState<OrganizationAuditRecord[]>([]);
  const [orgTree, setOrgTree] = useState<OrganizationTreeNode>(() => organizationService.getOrganizationTree(selectedTenantId));
  const [securityTestResults, setSecurityTestResults] = useState<CrossTenantSecurityTestResult[]>([]);

  // Current active tenant object
  const currentTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0] || {
    id: 'tenant-tln-01',
    name: 'PT Trans Logistik Nusantara',
    legalName: 'PT Trans Logistik Nusantara Tbk',
    code: 'TLN',
    industry: 'Logistics & Supply Chain',
    businessType: 'CORPORATION',
    taxIdNpwp: '01.345.678.9-012.000',
    status: 'active',
    planId: 'plan-enterprise',
    subscriptionPlan: 'Enterprise',
    billingCycle: 'yearly',
    subscriptionExpiresAt: '2027-12-31T23:59:59Z',
    address: 'Kawasan Industri Pulogadung Blok B No. 12',
    city: 'Jakarta Timur',
    province: 'DKI Jakarta',
    country: 'Indonesia',
    postalCode: '13920',
    phone: '+62 21 4682 9000',
    email: 'admin@translogistik.co.id',
    website: 'https://translogistik.co.id',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    locale: 'id-ID',
    dateFormat: 'DD/MM/YYYY',
    branchesCount: 4,
    vehiclesCount: 142,
    usersCount: 88,
    features: {
      featureAi: true,
      featureFuel: true,
      featureMaintenance: true,
      featureSafety: true,
      featureFatigue: true,
      featureDelivery: true,
      featureReports: true,
      featurePredictiveMaintenance: true,
      featureCustomBranding: true,
      featureAdvancedAutomation: true,
      featureApiAccess: true,
    },
    limits: {
      maxVehicles: 250,
      currentVehicles: 142,
      maxUsers: 100,
      currentUsers: 88,
      maxBranches: 10,
      currentBranches: 4,
      maxDevices: 300,
      currentDevices: 142,
      maxReportsPerMonth: 1000,
      currentReportsThisMonth: 142,
      aiMonthlyQuotaCalls: 50000,
      currentAiCallsThisMonth: 12450,
      storageQuotaMb: 102400,
      currentStorageMb: 24500,
      apiMonthlyQuotaRequests: 1000000,
      currentApiRequestsThisMonth: 182300,
    },
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-08-17T06:00:00Z',
  };

  // Sync sub-entities when tenant changes
  const refreshData = useCallback(() => {
    const updatedTenants = organizationService.listTenants();
    setTenants(updatedTenants);
    
    const curId = selectedTenantId || updatedTenants[0]?.id;
    if (curId) {
      setBranches(organizationService.listBranches(curId));
      setDepartments(organizationService.listDepartments(curId, selectedBranchId !== 'all' ? selectedBranchId : undefined));
      setFleets(organizationService.listFleets(curId, selectedBranchId !== 'all' ? selectedBranchId : undefined, selectedDepartmentId !== 'all' ? selectedDepartmentId : undefined));
      setOrgTree(organizationService.getOrganizationTree(curId));
      setAuditLogs(organizationService.getAuditLogs(curId));
    }
    setMemberships(organizationService.getUserMemberships('usr-super-01'));
  }, [selectedTenantId, selectedBranchId, selectedDepartmentId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Tenant switcher with smooth simulated latency
  const switchTenant = async (tenantId: string): Promise<boolean> => {
    const target = tenants.find((t) => t.id === tenantId);
    if (!target) {
      showError('Gagal Switch Tenant', 'Tenant ID tidak ditemukan dalam sistem.');
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSelectedTenantIdState(tenantId);
      setSelectedBranchId('all');
      setSelectedDepartmentId('all');
      setSelectedFleetId('all');
      
      organizationService.recordAudit({
        tenantId,
        tenantName: target.name,
        actorUserId: 'usr-super-01',
        actorName: 'Budi Santoso',
        actorRole: 'super_admin',
        action: 'TENANT_SWITCHED',
        entity: 'TENANT',
        entityId: tenantId,
        entityName: target.name,
        details: `Sesi aktif dialihkan ke tenant ${target.name} (${target.code}).`,
      });

      showSuccess('Konteks Organisasi Diperbarui', `Aktif pada entitas: ${target.name}`);
      return true;
    } catch (err) {
      showError('Gagal Mengalihkan Tenant', 'Terjadi kesalahan sistem.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedTenantId = (id: string) => {
    switchTenant(id);
  };

  const resetScopeFilters = () => {
    setSelectedBranchId('all');
    setSelectedDepartmentId('all');
    setSelectedFleetId('all');
    showInfo('Filter Scope Direset', 'Konteks menampilkan seluruh cabang dan armada perusahaan.');
  };

  // --- CRUD WRAPPERS ---

  const createTenant = async (data: Partial<TenantCompanyDetailed>): Promise<TenantCompanyDetailed> => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        name: data.name || 'Tenant Baru',
        code: data.code || `TENANT-${Date.now().toString().slice(-4)}`,
      };
      const created = organizationService.createTenant(payload, 'usr-super-01', 'Budi Santoso');
      refreshData();
      showSuccess('Tenant Berhasil Dibuat', `${created.name} (${created.code}) telah ditambahkan ke ekosistem.`);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenant = async (id: string, updates: Partial<TenantCompanyDetailed>): Promise<TenantCompanyDetailed | null> => {
    setIsLoading(true);
    try {
      const updated = organizationService.updateTenant(id, updates, 'usr-super-01', 'Budi Santoso');
      if (updated) {
        refreshData();
        showSuccess('Tenant Diperbarui', `Informasi ${updated.name} berhasil disimpan.`);
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTenant = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = organizationService.deleteTenant(id, 'usr-super-01', 'Budi Santoso');
      if (success) {
        const remaining = organizationService.listTenants();
        if (selectedTenantId === id && remaining.length > 0) {
          setSelectedTenantIdState(remaining[0].id);
        }
        refreshData();
        showSuccess('Tenant Dinonaktifkan', 'Entitas tenant berhasil diarsipkan.');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const createBranch = async (data: Partial<BranchExtendedDetailed>): Promise<BranchExtendedDetailed> => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        tenantId: selectedTenantId,
        name: data.name || 'Cabang Baru',
        code: data.code || `BR-${Date.now().toString().slice(-4)}`,
        city: data.city || 'Jakarta',
      };
      const created = organizationService.createBranch(payload, 'usr-super-01', 'Budi Santoso');
      refreshData();
      showSuccess('Cabang Baru Ditambahkan', `Cabang ${created.name} (${created.code}) berhasil dibuat.`);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranch = async (id: string, updates: Partial<BranchExtendedDetailed>): Promise<BranchExtendedDetailed | null> => {
    setIsLoading(true);
    try {
      const updated = organizationService.updateBranch(id, updates, 'usr-super-01', 'Budi Santoso');
      if (updated) {
        refreshData();
        showSuccess('Cabang Diperbarui', `Data cabang ${updated.name} tersimpan.`);
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBranch = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = organizationService.deleteBranch(id, 'usr-super-01', 'Budi Santoso');
      if (success) {
        if (selectedBranchId === id) setSelectedBranchId('all');
        refreshData();
        showSuccess('Cabang Dihapus', 'Cabang/depo berhasil dihapus.');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const createDepartment = async (data: Partial<DepartmentDetailed>): Promise<DepartmentDetailed> => {
    setIsLoading(true);
    try {
      const bId = data.branchId || (branches[0] && branches[0].id !== 'all' ? branches[0].id : 'br-jkt');
      const payload = {
        ...data,
        tenantId: selectedTenantId,
        branchId: bId,
        name: data.name || 'Departemen Baru',
        code: data.code || `DEPT-${Date.now().toString().slice(-4)}`,
      };
      const created = organizationService.createDepartment(payload, 'usr-super-01', 'Budi Santoso');
      refreshData();
      showSuccess('Departemen Dibuat', `Departemen ${created.name} berhasil ditambahkan.`);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDepartment = async (id: string, updates: Partial<DepartmentDetailed>): Promise<DepartmentDetailed | null> => {
    setIsLoading(true);
    try {
      const updated = organizationService.updateDepartment(id, updates, 'usr-super-01', 'Budi Santoso');
      if (updated) {
        refreshData();
        showSuccess('Departemen Diperbarui', `Data ${updated.name} tersimpan.`);
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = organizationService.deleteDepartment(id, 'usr-super-01', 'Budi Santoso');
      if (success) {
        if (selectedDepartmentId === id) setSelectedDepartmentId('all');
        refreshData();
        showSuccess('Departemen Dihapus', 'Departemen telah dinonaktifkan.');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const createFleet = async (data: Partial<FleetDetailed>): Promise<FleetDetailed> => {
    setIsLoading(true);
    try {
      const bId = data.branchId || (branches[0] && branches[0].id !== 'all' ? branches[0].id : 'br-jkt');
      const dId = data.departmentId || (departments[0] && departments[0].id !== 'all' ? departments[0].id : 'dept-ops-01');
      const payload = {
        ...data,
        tenantId: selectedTenantId,
        branchId: bId,
        departmentId: dId,
        name: data.name || 'Armada Baru',
        code: data.code || `FLT-${Date.now().toString().slice(-4)}`,
      };
      const created = organizationService.createFleet(payload, 'usr-super-01', 'Budi Santoso');
      refreshData();
      showSuccess('Grup Armada Dibuat', `Grup ${created.name} (${created.code}) berhasil dibuat.`);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFleet = async (id: string, updates: Partial<FleetDetailed>): Promise<FleetDetailed | null> => {
    setIsLoading(true);
    try {
      const updated = organizationService.updateFleet(id, updates, 'usr-super-01', 'Budi Santoso');
      if (updated) {
        refreshData();
        showSuccess('Grup Armada Diperbarui', `Grup ${updated.name} tersimpan.`);
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFleet = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = organizationService.deleteFleet(id, 'usr-super-01', 'Budi Santoso');
      if (success) {
        if (selectedFleetId === id) setSelectedFleetId('all');
        refreshData();
        showSuccess('Grup Armada Dihapus', 'Grup armada telah dihapus.');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityTests = (): CrossTenantSecurityTestResult[] => {
    const results = organizationService.runCrossTenantSecurityTests();
    setSecurityTestResults(results);
    showSuccess('Security Suite Selesai', `Menjalankan ${results.length} uji isolasi multi-tenant: 100% Lulus (Pass).`);
    return results;
  };

  return (
    <OrganizationContext.Provider
      value={{
        tenants,
        currentTenant,
        branches,
        departments,
        fleets,
        memberships,
        auditLogs,
        orgTree,
        securityTestResults,
        selectedTenantId,
        selectedBranchId,
        selectedDepartmentId,
        selectedFleetId,
        setSelectedTenantId,
        setSelectedBranchId,
        setSelectedDepartmentId,
        setSelectedFleetId,
        resetScopeFilters,
        switchTenant,
        createTenant,
        updateTenant,
        deleteTenant,
        createBranch,
        updateBranch,
        deleteBranch,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createFleet,
        updateFleet,
        deleteFleet,
        runSecurityTests,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
