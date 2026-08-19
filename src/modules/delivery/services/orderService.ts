/**
 * Fleet Intelligence Smart AI - Order Management Service
 * Order CRUD, Order Items, State Machine & Partial Delivery Split
 */

import { Order, OrderItem, OrderStatus, OrderPriority } from '../deliveryTypes';

const LOCAL_STORAGE_ORDERS_KEY = 'fleet_intel_orders_v1';

class OrderService {
  private orders: Order[] = [];

  constructor() {
    this.initOrders();
  }

  private initOrders() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) {
        this.orders = JSON.parse(saved);
      } else {
        this.seedInitialOrders();
      }
    } catch {
      this.seedInitialOrders();
    }
  }

  private seedInitialOrders() {
    this.orders = [
      {
        id: 'ord-001',
        tenantId: 'tenant-tln-01',
        orderNumber: 'ORD-2026-000001',
        externalOrderNumber: 'PO-PT-ABC-992',
        customerId: 'cust-001',
        customerName: 'PT Indofood Distribution Cikarang',
        orderDate: '2026-08-15',
        requestedDeliveryDate: '2026-08-15',
        priority: 'HIGH',
        status: 'IN_TRANSIT',
        originAddress: 'Depo Utama Cikarang Barat, Bekasi',
        destinationAddress: 'Kawasan Industri Jababeka V, Cikarang',
        totalItems: 120,
        totalWeightKg: 2400,
        totalVolumeCbm: 12.5,
        notes: 'Bongkar muat pintu loading dock B. Harap konfirmasi 30 menit sebelum tiba.',
        items: [
          {
            id: 'ord-item-01',
            orderId: 'ord-001',
            sku: 'SKU-FMCG-01',
            productName: 'Minyak Goreng Sawit 2L Carton',
            description: 'Karton isi 6 pcs x 2L',
            quantity: 80,
            unit: 'carton',
            weightKg: 1600,
            volumeCbm: 8.0,
            fragile: false,
            temperatureControlled: false,
          },
          {
            id: 'ord-item-02',
            orderId: 'ord-001',
            sku: 'SKU-FMCG-02',
            productName: 'Mie Instant Goreng Spesial Box',
            description: 'Box isi 40 bungkus',
            quantity: 40,
            unit: 'carton',
            weightKg: 800,
            volumeCbm: 4.5,
            fragile: false,
            temperatureControlled: false,
          },
        ],
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T08:00:00Z',
        updatedAt: '2026-08-15T02:00:00Z',
      },
      {
        id: 'ord-002',
        tenantId: 'tenant-tln-01',
        orderNumber: 'ORD-2026-000002',
        externalOrderNumber: 'PO-UNILEVER-881',
        customerId: 'cust-002',
        customerName: 'Gudang Retail Trans-Logistics Bandung',
        orderDate: '2026-08-15',
        requestedDeliveryDate: '2026-08-15',
        priority: 'CRITICAL',
        status: 'ASSIGNED',
        originAddress: 'Marunda Logistics Hub, Jakarta Utara',
        destinationAddress: 'Gedebage Logistics Park, Bandung',
        totalItems: 250,
        totalWeightKg: 5000,
        totalVolumeCbm: 22.0,
        notes: 'Pengiriman cold-chain & rantai dingin.',
        items: [
          {
            id: 'ord-item-03',
            orderId: 'ord-002',
            sku: 'SKU-COLD-01',
            productName: 'Susu UHT Full Cream 1L Box',
            quantity: 250,
            unit: 'carton',
            weightKg: 5000,
            volumeCbm: 22.0,
            fragile: true,
            temperatureControlled: true,
          },
        ],
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T09:30:00Z',
        updatedAt: '2026-08-15T02:30:00Z',
      },
      {
        id: 'ord-003',
        tenantId: 'tenant-tln-01',
        orderNumber: 'ORD-2026-000003',
        externalOrderNumber: 'PO-MAYORA-104',
        customerId: 'cust-003',
        customerName: 'Toko Sumber Rejeki Grosir Surabaya',
        orderDate: '2026-08-15',
        requestedDeliveryDate: '2026-08-16',
        priority: 'NORMAL',
        status: 'CONFIRMED',
        originAddress: 'Surabaya Port Cargo Terminal',
        destinationAddress: 'Pasar Turi Grosir, Surabaya',
        totalItems: 60,
        totalWeightKg: 1200,
        totalVolumeCbm: 6.0,
        notes: 'Pengiriman reguler toko grosir.',
        items: [
          {
            id: 'ord-item-04',
            orderId: 'ord-003',
            sku: 'SKU-SNACK-01',
            productName: 'Biskuit Cokelat Premium',
            quantity: 60,
            unit: 'carton',
            weightKg: 1200,
            volumeCbm: 6.0,
            fragile: false,
            temperatureControlled: false,
          },
        ],
        createdBy: 'Siti Rahma (Operations)',
        createdAt: '2026-08-15T01:00:00Z',
        updatedAt: '2026-08-15T01:00:00Z',
      },
      {
        id: 'ord-004',
        tenantId: 'tenant-tln-01',
        orderNumber: 'ORD-2026-000004',
        externalOrderNumber: 'PO-APOTEK-331',
        customerId: 'cust-004',
        customerName: 'Apotek Kimia Farma Hub',
        orderDate: '2026-08-15',
        requestedDeliveryDate: '2026-08-15',
        priority: 'URGENT',
        status: 'DELIVERED',
        originAddress: 'Pharma Central Hub Tangerang',
        destinationAddress: 'Apotek Kimia Farma Sudirman Jakarta',
        totalItems: 30,
        totalWeightKg: 300,
        totalVolumeCbm: 2.0,
        notes: 'Obat-obatan mendesak.',
        items: [
          {
            id: 'ord-item-05',
            orderId: 'ord-004',
            sku: 'SKU-MED-01',
            productName: 'Vitamin C & Suplemen Box',
            quantity: 30,
            unit: 'box',
            weightKg: 300,
            volumeCbm: 2.0,
            fragile: true,
            temperatureControlled: true,
          },
        ],
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-08-14T10:00:00Z',
        updatedAt: '2026-08-15T03:00:00Z',
      },
    ];
    this.persistOrders();
  }

  private persistOrders() {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(this.orders));
    } catch {
      // localStorage quota
    }
  }

  public getOrders(searchQuery: string = '', status: string = 'ALL'): Order[] {
    let result = [...this.orders];

    if (status !== 'ALL') {
      result = result.filter((o) => o.status === status);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.externalOrderNumber && o.externalOrderNumber.toLowerCase().includes(q)) ||
          o.customerName.toLowerCase().includes(q) ||
          o.originAddress.toLowerCase().includes(q) ||
          o.destinationAddress.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  public generateOrderNumber(): string {
    const nextSeq = this.orders.length + 1;
    return `ORD-2026-${nextSeq.toString().padStart(6, '0')}`;
  }

  public createOrder(
    data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Order {
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now().toString(36)}`,
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.persistOrders();
    return newOrder;
  }

  public updateOrder(orderId: string, updates: Partial<Order>): Order {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new Error(`Order ID ${orderId} tidak ditemukan.`);
    }

    const updated: Order = {
      ...this.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.orders[idx] = updated;
    this.persistOrders();
    return updated;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): Order {
    return this.updateOrder(orderId, { status: newStatus });
  }

  public deleteOrder(orderId: string): boolean {
    const initialLen = this.orders.length;
    this.orders = this.orders.filter((o) => o.id !== orderId);
    this.persistOrders();
    return this.orders.length < initialLen;
  }
}

export const orderService = new OrderService();
