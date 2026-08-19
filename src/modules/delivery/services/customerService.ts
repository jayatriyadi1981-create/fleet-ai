/**
 * Fleet Intelligence Smart AI - Customer Management Service
 * Customer Profiles, Contacts, Multiple Delivery Addresses & Performance
 */

import { Customer, CustomerAddress, CustomerContact, CustomerType } from '../deliveryTypes';

const LOCAL_STORAGE_CUSTOMERS_KEY = 'fleet_intel_customers_v1';

class CustomerService {
  private customers: Customer[] = [];

  constructor() {
    this.initCustomers();
  }

  private initCustomers() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
      if (saved) {
        this.customers = JSON.parse(saved);
      } else {
        this.seedInitialCustomers();
      }
    } catch {
      this.seedInitialCustomers();
    }
  }

  private seedInitialCustomers() {
    this.customers = [
      {
        id: 'cust-001',
        tenantId: 'tenant-tln-01',
        customerCode: 'CUST-IND-001',
        customerType: 'DISTRIBUTOR',
        companyName: 'PT Indofood Distribution Cikarang',
        contactName: 'Hendra Setiawan',
        phone: '0812-3456-7890',
        email: 'hendra@indofood-dist.co.id',
        address: 'Kawasan Industri Jababeka V Blok C-12, Cikarang',
        latitude: -6.2825,
        longitude: 107.1702,
        status: 'ACTIVE',
        addresses: [
          {
            id: 'caddr-01',
            customerId: 'cust-001',
            label: 'Gudang Utama Jababeka',
            address: 'Kawasan Industri Jababeka V Blok C-12, Cikarang',
            latitude: -6.2825,
            longitude: 107.1702,
            contactName: 'Agus Purnomo (Warehouse Mgr)',
            contactPhone: '0813-8899-1021',
            deliveryInstructions: 'Loading dock B, pintu masuk truk tronton dari sisi utara.',
            isPrimary: true,
          },
          {
            id: 'caddr-02',
            customerId: 'cust-001',
            label: 'Hub Karawang Timur',
            address: 'Kawasan Industri KIIC Parung Mulya, Karawang',
            latitude: -6.3501,
            longitude: 107.2800,
            contactName: 'Surya Permana (Inbound Supv)',
            contactPhone: '0815-7766-3321',
            deliveryInstructions: 'Restriksi jam masuk truk: 08:00 - 17:00.',
            isPrimary: false,
          },
        ],
        contacts: [
          {
            id: 'ccont-01',
            customerId: 'cust-001',
            name: 'Hendra Setiawan',
            role: 'Supply Chain Director',
            phone: '0812-3456-7890',
            email: 'hendra@indofood-dist.co.id',
            isPrimary: true,
          },
          {
            id: 'ccont-02',
            customerId: 'cust-001',
            name: 'Agus Purnomo',
            role: 'Warehouse Manager',
            phone: '0813-8899-1021',
            email: 'agus.p@indofood-dist.co.id',
            isPrimary: false,
          },
        ],
        notes: 'VIP Key Account. SLA waktu bongkar muat maksimal 45 menit.',
        createdAt: '2026-01-10T08:00:00Z',
        updatedAt: '2026-08-10T10:00:00Z',
      },
      {
        id: 'cust-002',
        tenantId: 'tenant-tln-01',
        customerCode: 'CUST-UNI-002',
        customerType: 'CORPORATE',
        companyName: 'Gudang Retail Trans-Logistics Bandung',
        contactName: 'Rina Wijaya',
        phone: '0811-9988-7766',
        email: 'rina.w@translog-bandung.co.id',
        address: 'Gedebage Logistics Park Blok B, Bandung',
        latitude: -6.9388,
        longitude: 107.6890,
        status: 'ACTIVE',
        addresses: [
          {
            id: 'caddr-03',
            customerId: 'cust-002',
            label: 'Central Hub Gedebage',
            address: 'Gedebage Logistics Park Blok B, Bandung',
            latitude: -6.9388,
            longitude: 107.6890,
            contactName: 'Bambang Tri',
            contactPhone: '0811-9988-7766',
            deliveryInstructions: 'Wajib verifikasi cold-chain suhu -18°C sebelum pembongkaran.',
            isPrimary: true,
          },
        ],
        contacts: [
          {
            id: 'ccont-03',
            customerId: 'cust-002',
            name: 'Rina Wijaya',
            role: 'Logistics Head',
            phone: '0811-9988-7766',
            email: 'rina.w@translog-bandung.co.id',
            isPrimary: true,
          },
        ],
        notes: 'Fasilitas Cold Storage. Bebas antrean untuk armada pendingin.',
        createdAt: '2026-02-01T09:00:00Z',
        updatedAt: '2026-08-01T12:00:00Z',
      },
      {
        id: 'cust-003',
        tenantId: 'tenant-tln-01',
        customerCode: 'CUST-MAY-003',
        customerType: 'RETAIL',
        companyName: 'Toko Sumber Rejeki Grosir Surabaya',
        contactName: 'Liem Kian Seng',
        phone: '0818-0011-2233',
        email: 'sumberrejeki@grosir-sby.com',
        address: 'Pasar Turi Kompleks Ruko Blok D-15, Surabaya',
        latitude: -7.2458,
        longitude: 112.7333,
        status: 'ACTIVE',
        addresses: [
          {
            id: 'caddr-04',
            customerId: 'cust-003',
            label: 'Toko & Gudang Pasar Turi',
            address: 'Pasar Turi Kompleks Ruko Blok D-15, Surabaya',
            latitude: -7.2458,
            longitude: 112.7333,
            contactName: 'Liem Kian Seng',
            contactPhone: '0818-0011-2233',
            deliveryInstructions: 'Akses gang Ruko sempit, gunakan Colt Diesel Engkel / Blind Van.',
            isPrimary: true,
          },
        ],
        contacts: [
          {
            id: 'ccont-04',
            customerId: 'cust-003',
            name: 'Liem Kian Seng',
            role: 'Pemilik Toko',
            phone: '0818-0011-2233',
            email: 'sumberrejeki@grosir-sby.com',
            isPrimary: true,
          },
        ],
        notes: 'Grosir bahan makanan harian.',
        createdAt: '2026-03-15T11:00:00Z',
        updatedAt: '2026-08-05T14:00:00Z',
      },
      {
        id: 'cust-004',
        tenantId: 'tenant-tln-01',
        customerCode: 'CUST-KIM-004',
        customerType: 'STORE',
        companyName: 'Apotek Kimia Farma Hub',
        contactName: 'dr. Farah Nabila',
        phone: '0821-4455-6677',
        email: 'farah.nabila@kimiafarma.co.id',
        address: 'Jl. Jendral Sudirman No. 42, Jakarta Selatan',
        latitude: -6.2188,
        longitude: 106.8188,
        status: 'ACTIVE',
        addresses: [
          {
            id: 'caddr-05',
            customerId: 'cust-004',
            label: 'Hub Sudirman',
            address: 'Jl. Jendral Sudirman No. 42, Jakarta Selatan',
            latitude: -6.2188,
            longitude: 106.8188,
            contactName: 'dr. Farah Nabila',
            contactPhone: '0821-4455-6677',
            deliveryInstructions: 'Serah terima di apoteker jaga lantai 1.',
            isPrimary: true,
          },
        ],
        contacts: [
          {
            id: 'ccont-05',
            customerId: 'cust-004',
            name: 'dr. Farah Nabila',
            role: 'Head Pharmacist',
            phone: '0821-4455-6677',
            email: 'farah.nabila@kimiafarma.co.id',
            isPrimary: true,
          },
        ],
        notes: 'Distribusi farmasi & obat-obatan medis.',
        createdAt: '2026-04-10T10:00:00Z',
        updatedAt: '2026-08-12T09:00:00Z',
      },
    ];
    this.persistCustomers();
  }

  private persistCustomers() {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(this.customers));
    } catch {
      // localStorage quota
    }
  }

  public getCustomers(searchQuery: string = ''): Customer[] {
    if (!searchQuery.trim()) return [...this.customers];

    const q = searchQuery.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }

  public getCustomerById(customerId: string): Customer | undefined {
    return this.customers.find((c) => c.id === customerId);
  }

  public createCustomer(
    data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ): Customer {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.customers.unshift(newCustomer);
    this.persistCustomers();
    return newCustomer;
  }

  public updateCustomer(customerId: string, updates: Partial<Customer>): Customer {
    const idx = this.customers.findIndex((c) => c.id === customerId);
    if (idx === -1) {
      throw new Error(`Customer ID ${customerId} tidak ditemukan.`);
    }

    const updated: Customer = {
      ...this.customers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.customers[idx] = updated;
    this.persistCustomers();
    return updated;
  }

  public deleteCustomer(customerId: string): boolean {
    const initialLen = this.customers.length;
    this.customers = this.customers.filter((c) => c.id !== customerId);
    this.persistCustomers();
    return this.customers.length < initialLen;
  }
}

export const customerService = new CustomerService();
