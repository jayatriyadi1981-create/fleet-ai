import React, { useState } from 'react';
import { 
  PackageCheck, 
  Search, 
  MapPin, 
  Camera, 
  PenTool, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Image as ImageIcon,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  onUpdateStatus: (id: string, status: LogisticsOrder['status'], epod?: LogisticsOrder['epod']) => void;
}

export const LogisticsDeliveriesTab: React.FC<Props> = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpod, setSelectedEpod] = useState<LogisticsOrder | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeOrderForPod, setActiveOrderForPod] = useState<LogisticsOrder | null>(null);

  // Form ePOD
  const [receiverName, setReceiverName] = useState('');
  const [relationship, setRelationship] = useState('Penerima Langsung');
  const [notes, setNotes] = useState('Paket diserahkan dalam kondisi baik dan tersegel.');

  const deliveryOrders = orders.filter(
    (o) =>
      o.status === 'OUT_FOR_DELIVERY' ||
      o.status === 'DELIVERED' ||
      o.status === 'FAILED_DELIVERY'
  );

  const filtered = deliveryOrders.filter(
    (o) =>
      o.connoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.consigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.consigneeCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitEpod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderForPod || !receiverName) return;

    onUpdateStatus(activeOrderForPod.id, 'DELIVERED', {
      receivedBy: receiverName,
      relationship: relationship,
      signatureUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
      photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      timestamp: new Date().toISOString(),
      coordinates: activeOrderForPod.consigneeCoordinates,
      notes: notes
    });

    setIsSubmitModalOpen(false);
    setActiveOrderForPod(null);
    setReceiverName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 text-emerald-600" />
            Last-Mile Delivery & Electronic Proof of Delivery (e-POD)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Verifikasi tanda tangan elektronik, foto geotag penyerahan barang, dan konfirmasi penyelesaian resi.
          </p>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ord) => (
          <div 
            key={ord.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">{ord.connoteNumber}</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ord.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : ord.status === 'FAILED_DELIVERY'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {ord.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-semibold">PENERIMA (CONSIGNEE)</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{ord.consigneeName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{ord.consigneeAddress}, {ord.consigneeCity}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">📞 {ord.consigneePhone}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kurir Pengantar:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ord.assignedDriverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Armada:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{ord.assignedVehiclePlate}</span>
                </div>
                {ord.paymentMethod === 'COD' && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                    <span>Tagihan COD:</span>
                    <span>Rp {ord.codAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {ord.epod && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Diterima oleh: {ord.epod.receivedBy} ({ord.epod.relationship})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Waktu: {new Date(ord.epod.timestamp).toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {ord.status === 'DELIVERED' && ord.epod ? (
                <button
                  onClick={() => setSelectedEpod(ord)}
                  className="w-full py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-4 h-4" /> Lihat Dokumen e-POD
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveOrderForPod(ord);
                    setIsSubmitModalOpen(true);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <PenTool className="w-4 h-4" /> Selesaikan Pengiriman & POD
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ePOD Document View Modal */}
      {selectedEpod && selectedEpod.epod && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Bukti Penyerahan Barang (e-POD)
              </h3>
              <button 
                onClick={() => setSelectedEpod(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">No. Resi</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedEpod.connoteNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Penerima Fisik</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEpod.epod.receivedBy} ({selectedEpod.epod.relationship})</span>
                </div>
              </div>

              {/* Photo & Signature mockup */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Foto Geotag Serah Terima:</div>
                <div className="h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                  <img 
                    src={selectedEpod.epod.photoUrl} 
                    alt="ePOD Foto" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                    GPS: {selectedEpod.epod.coordinates.lat}, {selectedEpod.epod.coordinates.lng} • {new Date(selectedEpod.epod.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Catatan Penerima:</div>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {selectedEpod.epod.notes || 'Tidak ada catatan tambahan.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedEpod(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input ePOD Modal */}
      {isSubmitModalOpen && activeOrderForPod && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-emerald-600" />
                Input e-POD Penyelesaian
              </h3>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEpod} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nama Penerima Fisik *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama orang yang menerima..."
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Hubungan / Status</label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Penerima Langsung">Penerima Langsung</option>
                  <option value="Keluarga / Serumah">Keluarga / Serumah</option>
                  <option value="Staff Kantor / PIC">Staff Kantor / PIC</option>
                  <option value="Security / Satpam">Security / Satpam</option>
                  <option value="Tetangga">Tetangga</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Catatan Serah Terima</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/30"
                >
                  Konfirmasi Pengiriman Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
