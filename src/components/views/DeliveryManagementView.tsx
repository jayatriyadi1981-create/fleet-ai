/**
 * Fleet Intelligence Smart AI - Delivery Management Main View Container
 * Integrates Orders, Deliveries, POD Verification, Customer Tracking & AI Analytics
 */

import React, { useState, useEffect } from 'react';
import {
  DeliveryFilterState,
  Delivery,
  DeliveryStatus,
  DeliveryKPIs,
} from '../../modules/delivery/deliveryTypes';
import { deliveryService } from '../../modules/delivery/services/deliveryService';
import { deliveryPODService } from '../../modules/delivery/services/deliveryPODService';

// UI Components
import { DeliveryKpiBar } from '../../modules/delivery/components/DeliveryKpiBar';
import { DeliveryHeader } from '../../modules/delivery/components/DeliveryHeader';
import { DeliveriesTable } from '../../modules/delivery/components/DeliveriesTable';
import { OrdersTableModal } from '../../modules/delivery/components/OrdersTableModal';
import { CustomersTableModal } from '../../modules/delivery/components/CustomersTableModal';
import { DeliveryDetailModal } from '../../modules/delivery/components/DeliveryDetailModal';
import { PODCaptureModal } from '../../modules/delivery/components/PODCaptureModal';
import { CustomerTrackingModal } from '../../modules/delivery/components/CustomerTrackingModal';
import { DeliveryAiPanel } from '../../modules/delivery/components/DeliveryAiPanel';

import {
  X,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Package,
} from 'lucide-react';

export const DeliveryManagementView: React.FC = () => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<
    'deliveries' | 'orders' | 'customers' | 'pod' | 'tracking' | 'ai'
  >('deliveries');

  // Filters State
  const [filter, setFilter] = useState<DeliveryFilterState>({
    searchQuery: '',
    status: 'ALL',
    priority: 'ALL',
    date: 'ALL',
    customerId: 'ALL',
    driverId: 'ALL',
    vehicleId: 'ALL',
  });

  // Data State
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [kpis, setKpis] = useState<DeliveryKPIs>(deliveryService.getKPIs());

  // Modals
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [rescheduleTimeWindow, setRescheduleTimeWindow] = useState('09:00-12:00');
  const [rescheduleReason, setRescheduleReason] = useState('Permintaan penundaan dari pelanggan');

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setDeliveries(deliveryService.getDeliveries(filter));
    setKpis(deliveryService.getKPIs());
  };

  useEffect(() => {
    refreshData();
  }, [filter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleViewDetail = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDetailModalOpen(true);
  };

  const handleOpenPodModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsPodModalOpen(true);
  };

  const handleOpenTrackingModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsTrackingModalOpen(true);
  };

  const handleOpenRescheduleModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsRescheduleModalOpen(true);
  };

  const handleUpdateStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    deliveryService.updateDeliveryStatus(deliveryId, newStatus, 'Operations Supervisor');
    refreshData();
    showToast(`Status delivery #${deliveryId} berhasil diperbarui menjadi ${newStatus}.`);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    deliveryService.rescheduleDelivery(
      selectedDelivery.id,
      rescheduleDate,
      rescheduleTimeWindow,
      rescheduleReason,
      'Operations Admin'
    );

    setIsRescheduleModalOpen(false);
    refreshData();
    showToast(`Jadwal pengiriman #${selectedDelivery.deliveryNumber} berhasil direschedule.`);
  };

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'DeliveryNumber,OrderNumber,CustomerName,Status,ScheduledDate,Priority\n' +
      deliveries
        .map(
          (d) =>
            `${d.deliveryNumber},${d.orderNumber},"${d.customerName}",${d.status},${d.scheduledDate},${d.priority}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `delivery_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan pengiriman berhasil diekspor ke file CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <DeliveryHeader
        filter={filter}
        onFilterChange={setFilter}
        onOpenCreateOrder={() => setIsOrderModalOpen(true)}
        onOpenCreateDelivery={() => setIsOrderModalOpen(true)}
        onOpenCustomers={() => setIsCustomerModalOpen(true)}
        onOpenOrders={() => setIsOrderModalOpen(true)}
        onExportReport={handleExportReport}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* KPI Stats Bar */}
      <DeliveryKpiBar
        kpis={kpis}
        onFilterByStatus={(st) => setFilter({ ...filter, status: st as any })}
      />

      {/* Tab Views */}
      {activeTab === 'deliveries' && (
        <DeliveriesTable
          deliveries={deliveries}
          onViewDetail={handleViewDetail}
          onOpenPodModal={handleOpenPodModal}
          onOpenTrackingModal={handleOpenTrackingModal}
          onOpenRescheduleModal={handleOpenRescheduleModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {activeTab === 'pod' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                Galeri & Audit Bukti Penyerahan (POD Gallery)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifikasi tanda tangan digital, foto kargo, dan validasi lokasi penerima.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries
              .filter((d) => d.podId || d.status === 'DELIVERED')
              .map((del) => {
                const pod = deliveryPODService.getPODByDeliveryId(del.podId || '');
                return (
                  <div
                    key={del.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-emerald-400 font-mono">
                        {del.deliveryNumber}
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                        POD Verified
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 font-semibold">{del.customerName}</div>

                    {pod && (
                      <div className="space-y-2 text-xs">
                        <div className="text-slate-400">
                          Penerima: <strong className="text-white">{pod.recipientName}</strong> ({pod.recipientRole})
                        </div>

                        {pod.signatureDataUrl && (
                          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                            <span className="text-[10px] text-slate-500 block mb-1">Tanda Tangan Digital</span>
                            <img src={pod.signatureDataUrl} alt="Signature" className="h-12 mx-auto" />
                          </div>
                        )}

                        {pod.photos && pod.photos.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pt-1">
                            {pod.photos.map((ph) => (
                              <img
                                key={ph.id}
                                src={ph.fileUrl}
                                alt="POD Proof"
                                className="w-16 h-16 object-cover rounded-lg border border-slate-800"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {activeTab === 'tracking' && selectedDelivery && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <CustomerTrackingModal
            delivery={selectedDelivery}
            isOpen={true}
            onClose={() => setActiveTab('deliveries')}
          />
        </div>
      )}

      {activeTab === 'tracking' && !selectedDelivery && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Package className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">Pilih Pengiriman untuk Lacak Pelanggan</h3>
          <p className="text-xs text-slate-400 mt-1">
            Klik tombol "Live Tracking" pada salah satu baris pengiriman di tabel utama.
          </p>
        </div>
      )}

      {activeTab === 'ai' && <DeliveryAiPanel />}

      {/* Modals */}
      <OrdersTableModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderCreated={() => {
          refreshData();
          showToast('Order baru berhasil didaftarkan ke sistem.');
        }}
      />

      <CustomersTableModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerUpdated={() => {
          refreshData();
          showToast('Data pelanggan berhasil diperbarui.');
        }}
      />

      <DeliveryDetailModal
        delivery={selectedDelivery}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenPodModal={handleOpenPodModal}
        onOpenTrackingModal={handleOpenTrackingModal}
      />

      <PODCaptureModal
        delivery={selectedDelivery}
        isOpen={isPodModalOpen}
        onClose={() => setIsPodModalOpen(false)}
        onPodSubmitted={() => {
          refreshData();
          showToast('Bukti Penyerahan (POD) berhasil ditangkap dan diverifikasi.');
        }}
      />

      <CustomerTrackingModal
        delivery={selectedDelivery}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Reschedule Pengiriman #{selectedDelivery.deliveryNumber}
              </h3>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tanggal Baru *</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Jendela Waktu *</label>
                <select
                  value={rescheduleTimeWindow}
                  onChange={(e) => setRescheduleTimeWindow(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                >
                  <option value="08:00-11:00">Pagi (08:00 - 11:00 WIB)</option>
                  <option value="11:00-14:00">Siang (11:00 - 14:00 WIB)</option>
                  <option value="14:00-17:00">Sore (14:00 - 17:00 WIB)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Alasan Penundaan *</label>
                <textarea
                  required
                  rows={2}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-2.5 text-slate-200 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-600/30"
                >
                  Konfirmasi Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagementView;
