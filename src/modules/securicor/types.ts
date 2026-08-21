export type SecuricorVehicleType =
  | 'ARMORED_CIT_VAN'
  | 'HEAVY_ARMORED_TRUCK'
  | 'TACTICAL_ESCORT_SUV'
  | 'VIP_PROTECTION_SEDAN'
  | 'GUARD_PATROL_MOTORCYCLE'
  | 'MOBILE_COMMAND_UNIT';

export type BallisticProtectionLevel =
  | 'NIJ_III_A'
  | 'CEN_B6_STANAG'
  | 'CEN_B7_ARMOR_PIERCING'
  | 'VPAM_VR9'
  | 'STANDARD_REINFORCED';

export type CitMissionStatus =
  | 'STANDBY_VAULT'
  | 'CASH_LOADING'
  | 'EN_ROUTE_TRANSIT'
  | 'ATM_SERVICING'
  | 'CLIENT_BRANCH_PICKUP'
  | 'RETURN_TO_BASE'
  | 'EMERGENCY_DURESS_ALERT'
  | 'MISSION_COMPLETED';

export type CargoValuablesType =
  | 'CASH_BANK_NOTES_IDR'
  | 'FOREIGN_CURRENCY_VALAS'
  | 'GOLD_BULLION_ANTAM'
  | 'PRECIOUS_GEMS_JEWELRY'
  | 'HIGH_SECURITY_DOCUMENTS'
  | 'ATM_CASSETTES';

export interface SecuricorArmoredVehicle {
  id: string;
  hullNumber: string;
  plateNumber: string;
  vehicleType: SecuricorVehicleType;
  ballisticLevel: BallisticProtectionLevel;
  runFlatTyreStatus: 'OPTIMAL_100KM' | 'PRESSURE_WARNING' | 'MAINTENANCE_DUE';
  interlockingDoors: 'LOCKED_SECURE' | 'AIRLOCK_OPEN' | 'TAMPER_BREACH';
  vaultDoorStatus: 'LOCKED_DUAL_KEY' | 'OPENED_AUTHORIZED' | 'TAMPER_ALARM';
  dropChuteActive: boolean;
  gpsLocation: {
    lat: number;
    lng: number;
    speedKmh: number;
    address: string;
    corridorName: string;
  };
  currentStatus: CitMissionStatus;
  currentCashPayloadIdr: number; // In Billion IDR
  insuredCoverageIdr: number;
  chiefEscortOfficer: string;
  armedPoliceEscort: string;
  driverName: string;
  cctvLiveFeedsCount: number;
  silentDuressArmed: boolean;
  smokeDyePackArmed: boolean;
  lastVaultOpenTimestamp?: string;
  assignedBankClient: string;
  nextCheckpointName: string;
  ktaSenpiExpiry: string;
}

export interface CitMissionRecord {
  id: string;
  missionCode: string;
  clientBank: string;
  serviceType: 'ATM_REPLENISHMENT' | 'BANK_BRANCH_DELIVERY' | 'RETAIL_CASH_PICKUP' | 'BANK_INDONESIA_CLEARING';
  assignedHull: string;
  originVault: string;
  destinationNode: string;
  totalCashDeclaredIdr: number;
  cassettesCount: number;
  dualCustodyOfficerA: string;
  dualCustodyOfficerB: string;
  status: CitMissionStatus;
  scheduledTime: string;
  departureTime: string;
  estimatedArrival: string;
  policeBadgeNumber: string;
  otpVaultToken: string;
}

export interface SmartAtmCassette {
  id: string;
  cassetteCode: string;
  atmId: string;
  atmLocation: string;
  denomination: 'IDR_100K' | 'IDR_50K' | 'IDR_20K';
  billCount: number;
  totalAmountIdr: number;
  antiTheftSmokeStainArmed: boolean;
  rfidSealNumber: string;
  lockStatus: 'SECURED_SEALED' | 'DISPENSED' | 'OPEN_AUDIT';
  lastHandledBy: string;
}

export interface SecurityGuardPatrol {
  id: string;
  guardName: string;
  regNumber: string;
  assignedZone: string;
  patrolMode: 'MOTORCYCLE_MOBILE' | 'FOOT_PATROL' | 'GUARD_POST_STATIC';
  checkpointsCompleted: number;
  totalCheckpoints: number;
  lastNfcScanAt: string;
  lastCheckpointName: string;
  duressStatus: 'NORMAL_STANDBY' | 'INCIDENT_REPORTED' | 'SOS_EMERGENCY';
  bodyCamStreaming: boolean;
  shift: 'PAGI' | 'SIANG' | 'MALAM_SUB_DURESS';
}
