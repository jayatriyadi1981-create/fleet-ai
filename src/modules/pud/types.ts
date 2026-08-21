export type PudServiceType = 'INSTANT' | 'SAME_DAY' | 'NEXT_DAY' | 'REGULAR' | 'CARGO_BULKY';

export type PudOrderStatus = 
  | 'DRAFT'
  | 'PENDING_PICKUP'
  | 'ASSIGNED_PICKUP'
  | 'PICKING_UP'
  | 'PICKED_UP'
  | 'AT_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'RETURN_TO_ORIGIN'
  | 'CANCELLED';

export type PudTaskType = 'PICKUP' | 'DELIVERY' | 'RETURN';

export type PudPaymentMethod = 'PREPAID' | 'COD' | 'CORPORATE_INVOICE' | 'QRIS_ON_DELIVERY';

export type VehicleCategory = 'MOTORCYCLE' | 'BLIND_VAN' | 'PICKUP_BOX' | 'CDE_TRUCK' | 'ELECTRIC_BIKE';

export interface PudAddress {
  contactName: string;
  phone: string;
  email?: string;
  addressLine: string;
  district: string; // Kecamatan
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  notes?: string;
  landmark?: string;
}

export interface PudParcel {
  id: string;
  trackingNumber: string;
  description: string;
  category: 'DOCUMENTS' | 'ELECTRONICS' | 'FOOD_BEVERAGE' | 'FASHION' | 'FRAGILE' | 'GENERAL';
  weightKg: number;
  volumeM3: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  itemValue: number;
  insuranceRequired: boolean;
}

export interface PudOrder {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  merchantName: string;
  merchantId: string;
  serviceType: PudServiceType;
  status: PudOrderStatus;
  sender: PudAddress;
  recipient: PudAddress;
  parcel: PudParcel;
  pickupTimeWindow: {
    startTime: string;
    endTime: string;
  };
  deliveryTimeWindow: {
    startTime: string;
    endTime: string;
  };
  assignedCourierId?: string;
  assignedCourierName?: string;
  assignedCourierPhone?: string;
  vehicleType: VehicleCategory;
  vehiclePlate?: string;
  paymentMethod: PudPaymentMethod;
  deliveryFee: number;
  codAmount?: number;
  isCodRemitted?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  pickupCompletedAt?: string;
  deliveredAt?: string;
  slaDeadline: string;
  slaStatus: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
  distanceKm: number;
  estimatedDurationMins: number;
  stopSequence?: number;
  publicTrackingCode: string;
}

export interface PudCourier {
  id: string;
  courierCode: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  vehicleType: VehicleCategory;
  vehiclePlate: string;
  status: 'ONLINE_AVAILABLE' | 'ON_DELIVERY' | 'ON_PICKUP' | 'BREAK' | 'OFFLINE';
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: string;
    addressDescription?: string;
  };
  assignedHubId: string;
  assignedHubName: string;
  rating: number; // e.g. 4.85
  todayCompletedPickups: number;
  todayCompletedDeliveries: number;
  todayFailedTasks: number;
  todayCodCollected: number;
  todayCodRemitted: number;
  currentActiveTasksCount: number;
  maxCapacityKg: number;
  currentLoadedKg: number;
  batteryLevelPct: number;
  shiftStartTime: string;
  shiftEndTime: string;
  dailyEarnings: number;
  totalIncentiveToday: number;
}

export interface PudProofOfDelivery {
  id: string;
  orderId: string;
  trackingNumber: string;
  type: 'POP' | 'POD'; // Proof of Pickup or Delivery
  timestamp: string;
  recipientName: string;
  recipientRelationship: 'SELF' | 'FAMILY' | 'SECURITY_SATPAM' | 'RECEPTIONIST' | 'NEIGHBOR' | 'COLLEAGUE';
  signatureImageUrl?: string;
  photoEvidenceUrl: string;
  gpsLocation: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  otpVerified: boolean;
  otpCodeUsed?: string;
  courierId: string;
  courierName: string;
  notes?: string;
  podStatus: 'VALIDATED' | 'UNDER_AUDIT' | 'REJECTED';
}

export interface PudExceptionTicket {
  id: string;
  ticketNumber: string;
  orderId: string;
  trackingNumber: string;
  courierId: string;
  courierName: string;
  exceptionType: 
    | 'RECIPIENT_NOT_HOME'
    | 'WRONG_ADDRESS'
    | 'RECIPIENT_REJECTED'
    | 'COD_UNPAID'
    | 'PACKAGE_DAMAGED'
    | 'WEATHER_FLOOD_RAIN'
    | 'VEHICLE_BREAKDOWN'
    | 'CUSTOMER_REQUEST_RESCHEDULE';
  notes: string;
  proofPhotoUrl?: string;
  createdAt: string;
  status: 'OPEN' | 'RESCHEDULED' | 'RETURN_TO_HUB' | 'RESOLVED_DELIVERED' | 'CANCELLED';
  rescheduledDate?: string;
  actionTaken?: string;
}

export interface PudCodSettlement {
  id: string;
  settlementNumber: string;
  courierId: string;
  courierName: string;
  date: string;
  totalCollectedOrders: number;
  totalCashAmount: number;
  totalQrisAmount: number;
  remittedToHubAmount: number;
  discrepancyAmount: number;
  status: 'PENDING_REMITTANCE' | 'VERIFIED' | 'DISCREPANCY_FLAGGED';
  verifiedByHubStaff?: string;
  notes?: string;
  orders: {
    orderNumber: string;
    trackingNumber: string;
    customerName: string;
    amount: number;
    paymentMode: 'CASH' | 'QRIS';
    collectedAt: string;
  }[];
}

export interface PudRoutePlan {
  id: string;
  routeCode: string;
  courierId: string;
  courierName: string;
  vehiclePlate: string;
  status: 'OPTIMIZED' | 'IN_PROGRESS' | 'COMPLETED';
  totalStops: number;
  completedStops: number;
  totalDistanceKm: number;
  estimatedTotalTimeMins: number;
  optimizedSequence: {
    sequenceNumber: number;
    taskType: PudTaskType;
    orderId: string;
    trackingNumber: string;
    address: string;
    contactName: string;
    phone: string;
    lat: number;
    lng: number;
    timeWindow: string;
    status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'FAILED';
    eta: string;
  }[];
}

export interface PudTariffZone {
  id: string;
  zoneName: string;
  originCity: string;
  destinationCity: string;
  serviceType: PudServiceType;
  baseFare: number; // Rp
  baseDistanceKm: number;
  perKmRate: number;
  baseWeightKg: number;
  perKgRate: number;
  estimatedHours: string;
  surgeMultiplier: number;
  active: boolean;
}

export interface PudKpis {
  totalOrdersToday: number;
  pendingPickups: number;
  inTransitDeliveries: number;
  completedDeliveriesToday: number;
  failedDeliveriesToday: number;
  onTimeDeliveryRatePct: number;
  firstAttemptDeliveryRatePct: number;
  activeCouriersOnDuty: number;
  totalCodCollectedToday: number;
  totalCodRemittedToday: number;
  averageDeliveryDurationMins: number;
  customerSatisfactionScore: number; // 4.9 out of 5
}
