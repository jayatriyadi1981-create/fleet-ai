/**
 * Fleet Intelligence Smart AI - Vehicle Inspection Full Detail Modal
 * Displays comprehensive inspection breakdown, photo gallery, AI insights, digital signature, and audit timeline.
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Printer, 
  Download, 
  Calendar, 
  MapPin, 
  Gauge, 
  FileText, 
  Clock, 
  Camera, 
  Wrench, 
  Sparkles 
} from 'lucide-react';
import { VehicleInspection } from '../types/inspection';

interface InspectionDetailModalProps {
  inspection: VehicleInspection | null;
  onClose: () => void;
  onNavigateWorkOrder?: (workOrderId: string) => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  onClose,
  onNavigateWorkOrder,
}) => {
  if (!inspection) return null;

  const [activeDetailTab, setActiveDetailTab] = useState<'checklist' | 'photos' | 'timeline' | 'issues'>('checklist');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                {inspection.inspectionNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                {inspection.type}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                inspection.result === 'PASS' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : inspection.result === 'ATTENTION' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
              }`}>
                {inspection.result} ({inspection.overallScore}%)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {inspection.vehiclePlate} — {inspection.vehicleModel}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Cetak Laporan PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grounding Warning Banner if Grounded */}
        {inspection.grounded && (
          <div className="p-4 bg-rose-950/60 border-b border-rose-800 text-rose-200 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <strong className="font-bold">KENDARAAN DI-GROUNDED (OUT OF SERVICE):</strong> {inspection.groundingReason || 'Ditemukan kegagalan pada komponen pengereman atau peralatan keselamatan.'}
            </div>
            {inspection.workOrderId && (
              <button
                onClick={() => onNavigateWorkOrder && onNavigateWorkOrder(inspection.workOrderId!)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold whitespace-nowrap transition-colors"
              >
                Lihat Work Order
              </button>
            )}
          </div>
        )}

        {/* Metadata Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">Waktu Pelaksanaan</div>
              <div className="font-semibold">{new Date(inspection.completedAt || inspection.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">Odometer Terbaca</div>
              <div className="font-semibold">{inspection.odometer.toLocaleString()} KM</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">Lokasi Pos</div>
              <div className="font-semibold truncate">{inspection.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">Pemeriksa (Driver)</div>
              <div className="font-semibold">{inspection.driverName}</div>
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-5 gap-4">
          <button
            onClick={() => setActiveDetailTab('checklist')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all ${
              activeDetailTab === 'checklist' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Checklist ({inspection.items?.length || 0} Item)
          </button>
          <button
            onClick={() => setActiveDetailTab('photos')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all ${
              activeDetailTab === 'photos' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Bukti Foto ({inspection.photos?.length || 0})
          </button>
          <button
            onClick={() => setActiveDetailTab('timeline')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all ${
              activeDetailTab === 'timeline' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Audit Log Timeline
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto max-h-[50vh] space-y-4">
          {/* TAB 1: Checklist Items */}
          {activeDetailTab === 'checklist' && (
            <div className="space-y-3">
              {inspection.items && inspection.items.length > 0 ? (
                inspection.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.result === 'FAIL' 
                        ? 'bg-rose-950/20 border-rose-800' 
                        : item.result === 'ATTENTION' 
                        ? 'bg-amber-950/20 border-amber-800' 
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{item.itemName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.category})</span>
                        {item.groundingTrigger && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">Grounding Trigger</span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-slate-300 mt-1 italic">"{item.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                        item.result === 'PASS' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : item.result === 'ATTENTION' 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {item.result}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  Data rincian checklist item default tersimpan dalam rekam arsip standar.
                </div>
              )}

              {/* Digital Signature Footer */}
              {inspection.signature && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Tanda Tangan Pengemudi</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Ditandatangani oleh: {inspection.signature.signedBy} pada {new Date(inspection.signature.signedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-700">
                    <img src={inspection.signature.signatureUrl} alt="Signature" className="h-8 object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Photos */}
          {activeDetailTab === 'photos' && (
            <div className="space-y-4">
              {inspection.photos && inspection.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inspection.photos.map((ph) => (
                    <div key={ph.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <img
                        src={ph.fileUrl}
                        alt="Evidence"
                        className="w-full h-44 object-cover rounded-lg border border-slate-800"
                      />
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-white">{ph.caption}</p>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Kategori: {ph.category}</span>
                          <span>Lat: {ph.latitude}, Lng: {ph.longitude}</span>
                        </div>
                        {ph.aiAnalysis?.analyzed && (
                          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                            <div className="flex items-center gap-1 font-bold">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              AI Vision Insight:
                            </div>
                            <p className="mt-0.5">{ph.aiAnalysis.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500 flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-slate-700" />
                  Tidak ada bukti foto yang dilampirkan pada inspeksi ini.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Timeline */}
          {activeDetailTab === 'timeline' && (
            <div className="space-y-3 relative pl-6 border-l-2 border-slate-800 ml-2">
              {inspection.timeline && inspection.timeline.length > 0 ? (
                inspection.timeline.map((event) => (
                  <div key={event.id} className="relative space-y-0.5">
                    <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>{event.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400">{event.description}</p>
                    <div className="text-[10px] text-slate-500">Aktor: {event.actor}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Log timeline standar tercatat pada sistem inti.</div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
