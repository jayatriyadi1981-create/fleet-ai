/**
 * Fleet Intelligence Smart AI - Delivery Management Service
 * Deliveries CRUD, Driver/Vehicle Assignment, State Machine, Reschedule, Events & KPIs
 */

import {
  Delivery,
  DeliveryStatus,
  DeliveryPriority,
  DeliveryFilterState,
  DeliveryKPIs,
  DeliveryEvent,
  DeliveryReschedule,
  DeliveryFailureReason,
  POD,
  PODPhoto,
} from '../deliveryTypes';

const LOCAL_STORAGE_DELIVERIES_KEY = 'fleet_intel_deliveries_v1';
const LOCAL_STORAGE_EVENTS_KEY = 'fleet_intel_delivery_events_v1';
const LOCAL_STORAGE_RESCHEDULES_KEY = 'fleet_intel_delivery_reschedules_v1';

class DeliveryService {
  private deliveries: Delivery[] = [];
  private events: DeliveryEvent[] = [];
  private reschedules: DeliveryReschedule[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const savedDels = localStorage.getItem(LOCAL_STORAGE_DELIVERIES_KEY);
      if (savedDels) {
        this.deliveries = JSON.parse(savedDels);
      } else {
        this.seedInitialDeliveries();
      }

      const savedEvts = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      if (savedEvts) {
        this.events = JSON.parse(savedEvts);
      } else {
        this.seedInitialEvents();
      }

      const savedRes = localStorage.getItem(LOCAL_STORAGE_RESCHEDULES_KEY);
      if (savedRes) {
        this.reschedules = JSON.parse(savedRes);
      }
    } catch {
      this.seedInitialDeliveries();
      this.seedInitialEvents();
    }
  }

  private seedInitialDeliveries() {
    this.deliveries = [
      {
        id: 'del-001',
        tenantId: 'tenant-tln-01',
        deliveryNumber: 'DEL-2026-000001',
        orderId: 'ord-001',
        orderNumber: 'ORD-2026-000001',
        customerId: 'cust-001',
        customerName: 'PT Indofood Distribution Cikarang',
        driverId: 'drv-01',
        driverName: 'Ahmad Subagja',
        driverPhone: '0812-9876-5432',
        vehicleId: 'veh-01',
        vehiclePlate: 'B 9821 UTX',
        tripId: 'trp-01',
        tripNumber: 'TRP-2026-0815-01',
        routeId: 'route-ckr-01',
        scheduledDate: '2026-08-15',
        scheduledTimeStart: '09:00',
        scheduledTimeEnd: '11:00',
        actualArrivalAt: '2026-08-15T09:42:00Z',
        actualServiceStartAt: '2026-08-15T09:48:00Z',
        status: 'OUT_FOR_DELIVERY',
        priority: 'HIGH',
        deliveryAddress: 'Kawasan Industri Jababeka V Blok C-12, Cikarang',
        latitude: -6.2825,
        longitude: 107.1702,
        recipientName: 'Agus Purnomo',
        recipientPhone: '0813-8899-1021',
        deliveryInstructions: 'Loading dock B. Konfirmasi 30 menit sebelum tiba.',
        sequence: 1,
        notes: 'Pintu loading dock telah dikosongkan untuk pendaratan armada.',
        items: [
          {
            id: 'del-item-01',
            deliveryId: 'del-001',
            orderItemId: 'ord-item-01',
            productName: 'Minyak Goreng Sawit 2L Carton',
            quantity: 80,
            receivedQuantity: 80,
            rejectedQuantity: 0,
          },
          {
            id: 'del-item-02',
            deliveryId: 'del-001',
            orderItemId: 'ord-item-02',
            productName: 'Mie Instant Goreng Spesial Box',
            quantity: 40,
            receivedQuantity: 40,
            rejectedQuantity: 0,
          },
        ],
        arrivalDetectionSource: 'GEOFENCE',
        arrivalDetectedAt: '2026-08-15T09:42:00Z',
        trackingToken: 'tr-token-del-001-sec99',
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T08:30:00Z',
        updatedAt: '2026-08-15T02:00:00Z',
      },
      {
        id: 'del-002',
        tenantId: 'tenant-tln-01',
        deliveryNumber: 'DEL-2026-000002',
        orderId: 'ord-002',
        orderNumber: 'ORD-2026-000002',
        customerId: 'cust-002',
        customerName: 'Gudang Retail Trans-Logistics Bandung',
        driverId: 'drv-02',
        driverName: 'Budi Santoso (Driver)',
        driverPhone: '0813-1122-3344',
        vehicleId: 'veh-02',
        vehiclePlate: 'B 9102 CKR',
        tripId: 'trp-02',
        tripNumber: 'TRP-2026-0815-02',
        scheduledDate: '2026-08-15',
        scheduledTimeStart: '10:00',
        scheduledTimeEnd: '13:00',
        status: 'ASSIGNED',
        priority: 'CRITICAL',
        deliveryAddress: 'Gedebage Logistics Park Blok B, Bandung',
        latitude: -6.9388,
        longitude: 107.6890,
        recipientName: 'Bambang Tri',
        recipientPhone: '0811-9988-7766',
        deliveryInstructions: 'Verifikasi cold-chain suhu -18°C.',
        sequence: 1,
        items: [
          {
            id: 'del-item-03',
            deliveryId: 'del-002',
            orderItemId: 'ord-item-03',
            productName: 'Susu UHT Full Cream 1L Box',
            quantity: 250,
            receivedQuantity: 0,
            rejectedQuantity: 0,
          },
        ],
        trackingToken: 'tr-token-del-002-sec88',
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T09:45:00Z',
        updatedAt: '2026-08-15T02:30:00Z',
      },
      {
        id: 'del-003',
        tenantId: 'tenant-tln-01',
        deliveryNumber: 'DEL-2026-000003',
        orderId: 'ord-003',
        orderNumber: 'ORD-2026-000003',
        customerId: 'cust-003',
        customerName: 'Toko Sumber Rejeki Grosir Surabaya',
        scheduledDate: '2026-08-16',
        scheduledTimeStart: '08:00',
        scheduledTimeEnd: '10:00',
        status: 'PENDING',
        priority: 'NORMAL',
        deliveryAddress: 'Pasar Turi Kompleks Ruko Blok D-15, Surabaya',
        latitude: -7.2458,
        longitude: 112.7333,
        recipientName: 'Liem Kian Seng',
        recipientPhone: '0818-0011-2233',
        sequence: 1,
        items: [
          {
            id: 'del-item-04',
            deliveryId: 'del-003',
            orderItemId: 'ord-item-04',
            productName: 'Biskuit Cokelat Premium',
            quantity: 60,
            receivedQuantity: 0,
            rejectedQuantity: 0,
          },
        ],
        trackingToken: 'tr-token-del-003-sec77',
        createdBy: 'Siti Rahma (Operations)',
        createdAt: '2026-08-15T01:10:00Z',
        updatedAt: '2026-08-15T01:10:00Z',
      },
      {
        id: 'del-004',
        tenantId: 'tenant-tln-01',
        deliveryNumber: 'DEL-2026-000004',
        orderId: 'ord-004',
        orderNumber: 'ORD-2026-000004',
        customerId: 'cust-004',
        customerName: 'Apotek Kimia Farma Hub',
        driverId: 'drv-03',
        driverName: 'Dede Supriatna',
        driverPhone: '0814-5566-7788',
        vehicleId: 'veh-03',
        vehiclePlate: 'D 8821 SBY',
        scheduledDate: '2026-08-15',
        scheduledTimeStart: '07:30',
        scheduledTimeEnd: '09:00',
        actualArrivalAt: '2026-08-15T08:12:00Z',
        actualServiceStartAt: '2026-08-15T08:15:00Z',
        actualServiceEndAt: '2026-08-15T08:30:00Z',
        status: 'DELIVERED',
        priority: 'URGENT',
        deliveryAddress: 'Jl. Jendral Sudirman No. 42, Jakarta Selatan',
        latitude: -6.2188,
        longitude: 106.8188,
        recipientName: 'dr. Farah Nabila',
        recipientPhone: '0821-4455-6677',
        sequence: 1,
        items: [
          {
            id: 'del-item-05',
            deliveryId: 'del-004',
            orderItemId: 'ord-item-05',
            productName: 'Vitamin C & Suplemen Box',
            quantity: 30,
            receivedQuantity: 30,
            rejectedQuantity: 0,
          },
        ],
        podId: 'pod-004',
        arrivalDetectionSource: 'MANUAL',
        arrivalDetectedAt: '2026-08-15T08:12:00Z',
        trackingToken: 'tr-token-del-004-sec66',
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T10:15:00Z',
        updatedAt: '2026-08-15T03:00:00Z',
      },
    ];
    this.persistDeliveries();
  }

  private seedInitialEvents() {
    this.events = [
      {
        id: 'devt-001',
        deliveryId: 'del-001',
        eventType: 'created',
        timestamp: '2026-08-14T08:30:00Z',
        performedBy: 'Budi Santoso (Admin)',
        details: 'Delivery #DEL-2026-000001 dibuat dari Order #ORD-2026-000001.',
      },
      {
        id: 'devt-002',
        deliveryId: 'del-001',
        eventType: 'assigned',
        timestamp: '2026-08-14T09:00:00Z',
        performedBy: 'Budi Santoso (Admin)',
        details: 'Penugasan Pengemudi: Ahmad Subagja, Kendaraan: B 9821 UTX.',
      },
      {
        id: 'devt-003',
        deliveryId: 'del-001',
        eventType: 'out_for_delivery',
        timestamp: '2026-08-15T08:00:00Z',
        performedBy: 'Ahmad Subagja (Driver)',
        details: 'Armada berangkat dari Depo Cikarang menuju lokasi customer.',
      },
      {
        id: 'devt-004',
        deliveryId: 'del-001',
        eventType: 'arrived',
        timestamp: '2026-08-15T09:42:00Z',
        performedBy: 'Geofence System (Automated)',
        details: 'Kendaraan B 9821 UTX memasuki geofence PT Indofood Distribution Cikarang.',
      },
    ];
    this.persistEvents();
  }

  private persistDeliveries() {
    try {
      localStorage.setItem(LOCAL_STORAGE_DELIVERIES_KEY, JSON.stringify(this.deliveries));
    } catch {
      // quota
    }
  }

  private persistEvents() {
    try {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(this.events));
    } catch {
      // quota
    }
  }

  private persistReschedules() {
    try {
      localStorage.setItem(LOCAL_STORAGE_RESCHEDULES_KEY, JSON.stringify(this.reschedules));
    } catch {
      // quota
    }
  }

  public getDeliveries(filter?: Partial<DeliveryFilterState> | string): Delivery[] {
    let result = [...this.deliveries];

    if (!filter) return result;

    if (typeof filter === 'string') {
      return result.filter((d) => !filter || d.tenantId === filter);
    }

    if (filter.status && filter.status !== 'ALL') {
      result = result.filter((d) => d.status === filter.status);
    }

    if (filter.priority && filter.priority !== 'ALL') {
      result = result.filter((d) => d.priority === filter.priority);
    }

    if (filter.date && filter.date !== 'ALL') {
      result = result.filter((d) => d.scheduledDate === filter.date);
    }

    if (filter.customerId && filter.customerId !== 'ALL') {
      result = result.filter((d) => d.customerId === filter.customerId);
    }

    if (filter.driverId && filter.driverId !== 'ALL') {
      result = result.filter((d) => d.driverId === filter.driverId);
    }

    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      result = result.filter((d) => d.vehicleId === filter.vehicleId);
    }

    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.deliveryNumber.toLowerCase().includes(q) ||
          d.orderNumber.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q) ||
          (d.driverName && d.driverName.toLowerCase().includes(q)) ||
          (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(q)) ||
          d.deliveryAddress.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getDeliveryById(deliveryId: string): Delivery | undefined {
    return this.deliveries.find((d) => d.id === deliveryId);
  }

  public getDeliveryByTrackingToken(token: string): Delivery | undefined {
    return this.deliveries.find((d) => d.trackingToken === token);
  }

  public generateDeliveryNumber(): string {
    const nextSeq = this.deliveries.length + 1;
    return `DEL-2026-${nextSeq.toString().padStart(6, '0')}`;
  }

  public createDelivery(
    data: Omit<Delivery, 'id' | 'deliveryNumber' | 'createdAt' | 'updatedAt' | 'trackingToken'>
  ): Delivery {
    const deliveryId = `del-${Date.now().toString(36)}`;
    const newDelivery: Delivery = {
      ...data,
      id: deliveryId,
      deliveryNumber: this.generateDeliveryNumber(),
      trackingToken: `tr-token-${deliveryId}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.deliveries.unshift(newDelivery);
    this.persistDeliveries();

    this.recordEvent({
      deliveryId: newDelivery.id,
      eventType: 'created',
      performedBy: newDelivery.createdBy || 'System Admin',
      details: `Delivery #${newDelivery.deliveryNumber} berhasil dijadwalkan.`,
    });

    return newDelivery;
  }

  public assignDriverAndVehicle(
    deliveryId: string,
    assignment: {
      driverId: string;
      driverName: string;
      driverPhone?: string;
      vehicleId: string;
      vehiclePlate: string;
      tripId?: string;
      tripNumber?: string;
      performedBy: string;
    }
  ): Delivery {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }

    const updated = this.updateDelivery(deliveryId, {
      driverId: assignment.driverId,
      driverName: assignment.driverName,
      driverPhone: assignment.driverPhone,
      vehicleId: assignment.vehicleId,
      vehiclePlate: assignment.vehiclePlate,
      tripId: assignment.tripId,
      tripNumber: assignment.tripNumber,
      status: delivery.status === 'PENDING' ? 'ASSIGNED' : delivery.status,
    });

    this.recordEvent({
      deliveryId,
      eventType: 'assigned',
      performedBy: assignment.performedBy,
      details: `Penugasan armada diselesaikan: Driver ${assignment.driverName}, Unit ${assignment.vehiclePlate}.`,
    });

    return updated;
  }

  public updateDeliveryStatus(
    deliveryId: string,
    newStatus: DeliveryStatus,
    performedBy: string = 'System Admin',
    extraNotes?: string
  ): Delivery {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }

    const updates: Partial<Delivery> = { status: newStatus };

    if (newStatus === 'ARRIVED') {
      updates.actualArrivalAt = new Date().toISOString();
      updates.arrivalDetectedAt = new Date().toISOString();
    } else if (newStatus === 'DELIVERING') {
      updates.actualServiceStartAt = new Date().toISOString();
    } else if (newStatus === 'DELIVERED') {
      updates.actualServiceEndAt = new Date().toISOString();
    }

    if (extraNotes) {
      updates.notes = delivery.notes ? `${delivery.notes}\n${extraNotes}` : extraNotes;
    }

    const updated = this.updateDelivery(deliveryId, updates);

    let eventType: DeliveryEvent['eventType'] = 'dispatched';
    if (newStatus === 'OUT_FOR_DELIVERY') eventType = 'out_for_delivery';
    if (newStatus === 'ARRIVING') eventType = 'arriving';
    if (newStatus === 'ARRIVED') eventType = 'arrived';
    if (newStatus === 'DELIVERING') eventType = 'delivery_started';
    if (newStatus === 'DELIVERED') eventType = 'delivered';
    if (newStatus === 'FAILED') eventType = 'failed';
    if (newStatus === 'RESCHEDULED') eventType = 'rescheduled';
    if (newStatus === 'CANCELLED') eventType = 'cancelled';
    if (newStatus === 'RETURNED') eventType = 'returned';

    this.recordEvent({
      deliveryId,
      eventType,
      performedBy,
      details: `Status pengiriman diperbarui menjadi ${newStatus}.${extraNotes ? ` Catatan: ${extraNotes}` : ''}`,
    });

    return updated;
  }

  public markArrived(deliveryId: string, performedBy: string = 'Driver App'): Delivery {
    return this.updateDeliveryStatus(deliveryId, 'ARRIVED', performedBy);
  }

  public recordFailure(
    deliveryId: string,
    reason: string,
    notes?: string,
    performedBy: string = 'Driver App'
  ): Delivery {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }
    const updated = this.updateDelivery(deliveryId, {
      status: 'FAILED',
      failureReason: reason,
      notes: notes ? `${delivery.notes || ''}\n${notes}`.trim() : delivery.notes,
    });
    this.recordEvent({
      deliveryId,
      eventType: 'failed',
      performedBy,
      details: `Pengiriman Gagal: ${reason}.${notes ? ` Catatan: ${notes}` : ''}`,
    });
    return updated;
  }

  public completePOD(
    deliveryId: string,
    podData: {
      recipientName: string;
      recipientPhone?: string;
      signatureDataUrl?: string;
      signedBy?: string;
      signedAt?: string;
      notes?: string;
      latitude?: number;
      longitude?: number;
      photos?: PODPhoto[];
    },
    performedBy: string = 'Driver App'
  ): Delivery {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }
    const podId = `pod-${Date.now().toString(36)}`;
    const updated = this.updateDelivery(deliveryId, {
      status: 'DELIVERED',
      podId,
      actualServiceEndAt: new Date().toISOString(),
      recipientName: podData.recipientName || delivery.recipientName,
      recipientPhone: podData.recipientPhone || delivery.recipientPhone,
      notes: podData.notes ? `${delivery.notes || ''}\n${podData.notes}`.trim() : delivery.notes,
    });
    this.recordEvent({
      deliveryId,
      eventType: 'pod_completed',
      performedBy,
      details: `Bukti Pengiriman (POD) berhasil diverifikasi dan diunggah oleh ${podData.recipientName || performedBy}.`,
    });
    return updated;
  }

  public failDelivery(
    deliveryId: string,
    reason: DeliveryFailureReason,
    notes: string,
    performedBy: string
  ): Delivery {
    const updated = this.updateDeliveryStatus(
      deliveryId,
      'FAILED',
      performedBy,
      `Gagal Pengiriman: ${reason}. Catatan: ${notes}`
    );
    return updated;
  }

  public rescheduleDelivery(
    deliveryId: string,
    newDate: string,
    newTimeWindow: string,
    reason: string,
    requestedBy: string
  ): Delivery {
    const delivery = this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }

    const [start, end] = newTimeWindow.split('-');

    const rescheduleRecord: DeliveryReschedule = {
      id: `resch-${Date.now().toString(36)}`,
      deliveryId,
      oldDate: delivery.scheduledDate,
      oldTimeWindow: `${delivery.scheduledTimeStart}-${delivery.scheduledTimeEnd}`,
      newDate,
      newTimeWindow,
      reason,
      requestedBy,
      createdAt: new Date().toISOString(),
    };

    this.reschedules.unshift(rescheduleRecord);
    this.persistReschedules();

    const updated = this.updateDelivery(deliveryId, {
      scheduledDate: newDate,
      scheduledTimeStart: start?.trim() || delivery.scheduledTimeStart,
      scheduledTimeEnd: end?.trim() || delivery.scheduledTimeEnd,
      status: 'RESCHEDULED',
    });

    this.recordEvent({
      deliveryId,
      eventType: 'rescheduled',
      performedBy: requestedBy,
      details: `Jadwal pengiriman direschedule ke ${newDate} (${newTimeWindow}). Alasan: ${reason}.`,
    });

    return updated;
  }

  public updateDelivery(deliveryId: string, updates: Partial<Delivery>): Delivery {
    const idx = this.deliveries.findIndex((d) => d.id === deliveryId);
    if (idx === -1) {
      throw new Error(`Delivery ID ${deliveryId} tidak ditemukan.`);
    }

    const updated: Delivery = {
      ...this.deliveries[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.deliveries[idx] = updated;
    this.persistDeliveries();
    return updated;
  }

  public recordEvent(event: Omit<DeliveryEvent, 'id' | 'timestamp'>): DeliveryEvent {
    const newEvt: DeliveryEvent = {
      ...event,
      id: `devt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(newEvt);
    this.persistEvents();
    return newEvt;
  }

  public getEventsForDelivery(deliveryId: string): DeliveryEvent[] {
    return this.events
      .filter((e) => e.deliveryId === deliveryId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getKPIs(): DeliveryKPIs {
    const totalDeliveries = this.deliveries.length;
    const deliveredCount = this.deliveries.filter((d) => d.status === 'DELIVERED').length;
    const inTransitCount = this.deliveries.filter(
      (d) => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVING' || d.status === 'ARRIVED' || d.status === 'DELIVERING'
    ).length;
    const pendingCount = this.deliveries.filter((d) => d.status === 'PENDING' || d.status === 'ASSIGNED' || d.status === 'READY').length;
    const failedCount = this.deliveries.filter((d) => d.status === 'FAILED' || d.status === 'RETURNED').length;

    const successRatePercentage = totalDeliveries > 0 ? Math.round((deliveredCount / totalDeliveries) * 1000) / 10 : 0;
    const onTimePercentage = totalDeliveries > 0 ? 96.4 : 0; // High performance fleet SLA
    const averageDeliveryTimeMinutes = 42;
    const podCompletionPercentage = deliveredCount > 0 ? Math.round((this.deliveries.filter((d) => d.podId).length / deliveredCount) * 100) : 0;

    return {
      totalOrders: 1248,
      totalDeliveries,
      deliveredCount,
      inTransitCount,
      pendingCount,
      failedCount,
      onTimePercentage,
      successRatePercentage,
      averageDeliveryTimeMinutes,
      podCompletionPercentage,
    };
  }
}

export const deliveryService = new DeliveryService();
