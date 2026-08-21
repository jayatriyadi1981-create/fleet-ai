import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  UserCheck,
  Camera,
  Signature,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudProofOfDelivery, PudOrder } from '../../../modules/pud/types';

export const PudEpodTab: React.FC = () => {
  const [epods, setEpods] = useState<PudProofOfDelivery[]>(pudService.getEpods());
  const [orders] = useState<PudOrder[]>(pudService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpod, setSelectedEpod] = useState<PudProofOfDelivery | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Form State
  const [newRecipient, setNewRecipient] = useState('');
  const [newRelation, setNewRelation] = useState<'SELF' | 'FAMILY' | 'SECURITY_SATPAM' | 'RECEPTIONIST' | 'NEIGHBOR' | 'COLLEAGUE'>('SELF');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [otpCode, setOtpCode] = useState('');
  const [notes, setNotes] = useState('Diterima langsung');

  const filteredEpods = epods.filter(e => 
    e.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitEpod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    pudService.submitEpod({
      orderId: selectedOrderId,
      recipientName: newRecipient || 'Penerima',
      recipientRelationship: newRelation,
      otpVerified: otpCode.length > 0,
      otpCodeUsed: otpCode || undefined,
      notes: notes
    });

    setEpods(pudService.getEpods());
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6" id="pud-epod-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            Bukti Pengiriman & Penjemputan Digital (ePOD / ePOP)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi tanda tangan digital, foto serah terima paket, geotag koordinat GPS, dan validasi OTP penerima.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Input Bukti Serah Terima (ePOD)</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari resi, nama penerima, kurir..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Menampilkan {filteredEpods.length} arsip ePOD tervalidasi
        </span>
      </div>

      {/* ePOD Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEpods.map((epod) => (
          <div key={epod.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-indigo-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {epod.trackingNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {epod.podStatus}
              </span>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 relative group">
              <img
                src={epod.photoEvidenceUrl}
                alt="Bukti Serah Terima"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => setSelectedEpod(epod)}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded-lg shadow"
                >
                  Perbesar Bukti
                </button>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Penerima:</span>
                <span className="font-bold text-slate-900">{epod.recipientName} ({epod.recipientRelationship})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kurir:</span>
                <span className="font-semibold text-slate-800">{epod.courierName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Waktu Terima:</span>
                <span className="font-mono text-slate-600">{epod.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Geotag Akurasi:</span>
                <span className="text-emerald-700 font-bold">{epod.gpsLocation.accuracyMeters} Meter</span>
              </div>
              {epod.otpVerified && (
                <div className="p-1.5 bg-emerald-50 rounded text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verifikasi OTP Penerima Berhasil
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedEpod(epod)}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-xs rounded-xl border border-slate-200 transition"
            >
              Lihat Detail & Tanda Tangan
            </button>
          </div>
        ))}
      </div>

      {/* Modal Detail ePOD */}
      {selectedEpod && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700">{selectedEpod.trackingNumber}</span>
                <h3 className="font-black text-slate-900 text-base mt-0.5">Bukti Pengiriman Digital (ePOD)</h3>
              </div>
              <button onClick={() => setSelectedEpod(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={selectedEpod.photoEvidenceUrl}
                  alt="Bukti Foto"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Penerima:</strong> {selectedEpod.recipientName} ({selectedEpod.recipientRelationship})</p>
                <p><strong>Kurir:</strong> {selectedEpod.courierName}</p>
                <p><strong>Waktu:</strong> {selectedEpod.timestamp}</p>
                <p><strong>Koordinat GPS:</strong> {selectedEpod.gpsLocation.lat}, {selectedEpod.gpsLocation.lng}</p>
                <p><strong>Catatan:</strong> {selectedEpod.notes}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-1">Tanda Tangan Digital Penerima:</span>
                <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                  <div dangerouslySetInnerHTML={{ __html: selectedEpod.signatureImageUrl || '<p>Tidak ada ttd</p>' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedEpod(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Manual ePOD */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-black text-slate-900 text-base mb-3">Input Bukti Serah Terima (ePOD)</h3>
            <form onSubmit={handleSubmitEpod} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Paket Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.trackingNumber} - {o.recipient.contactName} ({o.merchantName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Penerima Langsung</label>
                <input
                  type="text"
                  required
                  placeholder="Nama orang yang menerima"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hubungan Penerima</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="SELF">Penerima Sendiri (Ybs)</option>
                  <option value="FAMILY">Anggota Keluarga / Serumah</option>
                  <option value="SECURITY_SATPAM">Security / Satpam Pos</option>
                  <option value="RECEPTIONIST">Resepsionis / Front Desk</option>
                  <option value="COLLEAGUE">Rekan Kerja</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kode OTP Penerima (Opsional)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 8492"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow"
                >
                  Simpan ePOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
