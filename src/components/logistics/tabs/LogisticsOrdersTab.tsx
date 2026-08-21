import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  FileSpreadsheet, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Printer, 
  QrCode,
  DollarSign
} from 'lucide-react';
import { LogisticsOrder, ShipmentServiceType } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  onSelectOrder: (order: LogisticsOrder) => void;
  onCreateOrder: (order: Partial<LogisticsOrder>) => void;
}

export const LogisticsOrdersTab: React.FC<Props> = ({ orders, onSelectOrder, onCreateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Order Form State
  const [shipperName, setShipperName] = useState('');
  const [shipperCity, setShipperCity] = useState('Jakarta');
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneePhone, setConsigneePhone] = useState('');
  const [consigneeAddress, setConsigneeAddress] = useState('');
  const [consigneeCity, setConsigneeCity] = useState('Bandung');
  const [serviceType, setServiceType] = useState<ShipmentServiceType>('REGULAR');
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [codAmount, setCodAmount] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<number>(5);
  const [itemName, setItemName] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.connoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.shipperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.consigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.consigneeCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = serviceFilter === 'ALL' || ord.serviceType === serviceFilter;
    const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  const handleSubmitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipperName || !consigneeName) return;

    onCreateOrder({
      shipperName,
      shipperCity,
      consigneeName,
      consigneePhone,
      consigneeAddress,
      consigneeCity,
      serviceType,
      paymentMethod,
      codAmount: paymentMethod === 'COD' ? codAmount : 0,
      totalWeightKg: weightKg,
      items: [
        {
          id: `itm-${Date.now()}`,
          sku: 'SKU-CUSTOM',
          name: itemName || 'Barang Logistik General',
          qty: 1,
          weightKg: weightKg,
          dimensions: { lengthCm: 30, widthCm: 30, heightCm: 30 },
          volumeCbm: 0.027,
          isFragile: false,
          isDangerousGoods: false,
          declaredValue: 500000
        }
      ]
    });

    setIsModalOpen(false);
    // Reset Form
    setShipperName('');
    setConsigneeName('');
    setItemName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-600" />
            Order Pengiriman (Sales & Booking TMS)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Kelola seluruh pemesanan logistik B2B, marketplace merchant, koli volumetrik, dan booking armada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Buat Order Baru
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. Resi, Pengirim, Penerima..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Layanan:</span>
          </div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Semua Layanan</option>
            <option value="SAMEDAY">Sameday</option>
            <option value="NEXTDAY">Nextday</option>
            <option value="REGULAR">Regular</option>
            <option value="COLD_CHAIN">Cold Chain</option>
            <option value="CARGO_FTL">Cargo FTL</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ORDER_CREATED">Order Created</option>
            <option value="INBOUND_HUB">Inbound Hub</option>
            <option value="LINEHAUL_TRANSIT">Linehaul Transit</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED_DELIVERY">Failed Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Resi / Order</th>
                <th className="py-3 px-4">Pengirim (Shipper)</th>
                <th className="py-3 px-4">Penerima & Alamat</th>
                <th className="py-3 px-4">Layanan & Pembayaran</th>
                <th className="py-3 px-4">Berat & Biaya</th>
                <th className="py-3 px-4">Status & Hub</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada order yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-blue-600 dark:text-blue-400 font-mono text-xs">{ord.connoteNumber}</div>
                      <div className="text-[10px] text-slate-400">{ord.orderNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{new Date(ord.createdAt).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{ord.shipperName}</div>
                      <div className="text-[11px] text-slate-500">{ord.shipperCity} • {ord.shipperPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{ord.consigneeName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{ord.consigneeAddress}, {ord.consigneeCity}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {ord.serviceType}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ord.paymentMethod === 'COD' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}>
                        {ord.paymentMethod} {ord.paymentMethod === 'COD' && `(Rp ${ord.codAmount.toLocaleString()})`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{ord.totalWeightKg} kg</div>
                      <div className="text-[11px] text-slate-500">Rp {ord.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                        ord.status === 'DELIVERED' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : ord.status === 'FAILED_DELIVERY'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      }`}>
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400">{ord.originHubName.split('(')[0]} ➔ {ord.destinationHubName.split('(')[0]}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => onSelectOrder(ord)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-all"
                      >
                        Detail & Resi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Input Order Pengiriman Baru
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nama Shipper (Pengirim) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="PT Mega Distribusi..." 
                    value={shipperName}
                    onChange={(e) => setShipperName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Kota Asal (Origin)</label>
                  <input 
                    type="text" 
                    value={shipperCity}
                    onChange={(e) => setShipperCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nama Penerima (Consignee) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Toko Sumber Rezeki..." 
                    value={consigneeName}
                    onChange={(e) => setConsigneeName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">No. Telp Penerima</label>
                  <input 
                    type="text" 
                    placeholder="0812-xxxx-xxxx"
                    value={consigneePhone}
                    onChange={(e) => setConsigneePhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Alamat Lengkap Tujuan</label>
                <textarea 
                  rows={2}
                  placeholder="Jl. Raya No. XX, Kecamatan, Kota, Kode Pos"
                  value={consigneeAddress}
                  onChange={(e) => setConsigneeAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Layanan</label>
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ShipmentServiceType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="SAMEDAY">Sameday (8 Jam)</option>
                    <option value="NEXTDAY">Nextday (24 Jam)</option>
                    <option value="REGULAR">Regular (2-3 Hari)</option>
                    <option value="COLD_CHAIN">Cold Chain (Reefer)</option>
                    <option value="CARGO_FTL">Cargo FTL Trucking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Metode Bayar</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="PREPAID">Prepaid (Non-COD)</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Berat Total (Kg)</label>
                  <input 
                    type="number" 
                    min={1}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {paymentMethod === 'COD' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nominal Tagihan COD (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 850000"
                    value={codAmount}
                    onChange={(e) => setCodAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md shadow-blue-600/30"
                >
                  Simpan & Terbitkan Resi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
