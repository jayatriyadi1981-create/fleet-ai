/**
 * Fleet Intelligence Smart AI - Pre-Trip Vehicle Inspection Interactive Console
 * Complete step-by-step checklist, photo evidence, conditional questions, digital signature, and grounding gate.
 */

import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Upload, 
  FileCheck2, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Check, 
  MapPin, 
  Info
} from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { inspectionService } from '../services/inspectionService';
import { inspectionAiService } from '../services/inspectionAiService';
import { 
  InspectionCategoryType, 
  InspectionItem, 
  InspectionPhotoMetadata, 
  ItemConditionResult, 
  VehicleInspection 
} from '../types/inspection';

interface PreTripInspectionViewProps {
  onCompleted: (inspection: VehicleInspection) => void;
  onCancel?: () => void;
}

export const PreTripInspectionView: React.FC<PreTripInspectionViewProps> = ({
  onCompleted,
}) => {
  const { vehicles, currentUser } = useFleet();
  
  // Available vehicles that can be selected
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Vehicle Telemetry & Input States
  const [currentOdometer, setCurrentOdometer] = useState<number>(selectedVehicle?.odometerKm || 89450);
  const [currentEngineHours, setCurrentEngineHours] = useState<number>(selectedVehicle?.engineHours || 2840);
  const [locationName, setLocationName] = useState<string>('Depot Operasional Cakung, Jakarta Timur');
  const [overallNotes, setOverallNotes] = useState<string>('');
  
  // Active Category tab
  const [activeCategory, setActiveCategory] = useState<InspectionCategoryType>('TIRE');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Template items
  const template = inspectionService.getTemplateForVehicleType(selectedVehicle?.type || 'truck_box');

  // Interactive Checklist Item State
  const [checklistItems, setChecklistItems] = useState<InspectionItem[]>(() => {
    const items: InspectionItem[] = [];
    template.categories.forEach(cat => {
      cat.items.forEach(tmplItem => {
        items.push({
          id: `ITM-${tmplItem.id}`,
          inspectionId: '',
          category: tmplItem.category,
          itemCode: tmplItem.itemCode,
          itemName: tmplItem.itemName,
          description: tmplItem.description,
          required: tmplItem.required,
          result: 'PASS',
          severity: tmplItem.severityIfFailed,
          groundingTrigger: tmplItem.causesGroundingIfFailed,
          photoRequired: tmplItem.photoRequiredOnFail,
          photos: [],
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });
    return items;
  });

  // Digital Signature
  const [signatureSigned, setSignatureSigned] = useState<boolean>(false);
  const [declarationAccepted, setDeclarationAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // AI Photo Analysis active testing state
  const [analyzingItemId, setAnalyzingItemId] = useState<string | null>(null);

  // Handle Item Result Change (PASS / ATTENTION / FAIL / NOT_APPLICABLE)
  const handleItemResult = (itemId: string, result: ItemConditionResult) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          result,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));
  };

  // Handle Item Notes Change
  const handleItemNotes = (itemId: string, notes: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, notes, updatedAt: new Date().toISOString() };
      }
      return item;
    }));
  };

  // Handle Photo Addition Simulation
  const handleAddPhoto = async (itemId: string) => {
    const item = checklistItems.find(i => i.id === itemId);
    if (!item) return;

    setAnalyzingItemId(itemId);

    // Default sample image according to category
    let sampleUrl = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80';
    if (item.category === 'TIRE') {
      sampleUrl = 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80';
    } else if (item.category === 'LIGHT') {
      sampleUrl = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
    }

    // AI Analysis
    const aiResult = await inspectionAiService.analyzePhoto(item.category, item.itemCode);

    const newPhoto: InspectionPhotoMetadata = {
      id: `PH-${Date.now()}`,
      inspectionId: '',
      inspectionItemId: itemId,
      fileUrl: sampleUrl,
      caption: `Foto bukti kondisi ${item.itemName} (${item.result})`,
      category: item.category,
      timestamp: new Date().toISOString(),
      latitude: -6.2088,
      longitude: 106.8456,
      accuracyMeters: 2.1,
      uploadedBy: currentUser?.id || 'D-001',
      uploaderName: currentUser?.name || 'Driver Pengemudi',
      aiAnalysis: {
        analyzed: aiResult.analyzed,
        confidence: aiResult.confidence,
        potentialIssues: aiResult.potentialIssues,
        suggestedSeverity: aiResult.suggestedSeverity,
        notes: aiResult.notes,
      },
      createdAt: new Date().toISOString(),
    };

    setChecklistItems(prev => prev.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          photos: [...it.photos, newPhoto],
          notes: it.notes || (aiResult.potentialIssues.length > 0 ? aiResult.potentialIssues.join(', ') : ''),
        };
      }
      return it;
    }));

    setAnalyzingItemId(null);
  };

  const handleRemovePhoto = (itemId: string, photoId: string) => {
    setChecklistItems(prev => prev.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          photos: it.photos.filter(p => p.id !== photoId),
        };
      }
      return it;
    }));
  };

  // Check vehicle status warning
  const isVehicleUnavailable = selectedVehicle?.status === 'maintenance' || selectedVehicle?.status === 'under_maintenance' || selectedVehicle?.status === 'emergency';

  // Calculate live summary score
  const evaluation = inspectionService.calculateInspectionResult(checklistItems, template);

  // Submit Inspection
  const handleSubmit = () => {
    if (!declarationAccepted) {
      setSubmissionError('Harap centang konfirmasi deklarasi kebenaran data pemeriksaan.');
      return;
    }

    if (!signatureSigned) {
      setSubmissionError('Tanda tangan digital pengemudi diperlukan sebelum submit.');
      return;
    }

    // Check required photos for failed critical items
    const missingPhotos = checklistItems.filter(
      item => item.result === 'FAIL' && item.photoRequired && item.photos.length === 0
    );

    if (missingPhotos.length > 0) {
      setSubmissionError(`Item ${missingPhotos[0].itemName} berstatus GAGAL dan wajib melampirkan minimal 1 bukti foto.`);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const allPhotos = checklistItems.flatMap(it => it.photos);

      const newInspection = inspectionService.submitInspection({
        vehicleId: selectedVehicle.id,
        vehiclePlate: selectedVehicle.plateNumber,
        vehicleModel: `${selectedVehicle.brand} ${selectedVehicle.model}`,
        vehicleType: selectedVehicle.type,
        driverId: currentUser?.id || 'D-001',
        driverName: currentUser?.name || 'Driver Pengemudi',
        tripId: 'TRIP-TODAY-01',
        tripRoute: 'Depot Utama -> Area Pengiriman',
        type: 'PRE_TRIP',
        odometer: currentOdometer,
        previousOdometer: selectedVehicle.odometerKm,
        engineHours: currentEngineHours,
        locationName,
        latitude: -6.2088,
        longitude: 106.8456,
        notes: overallNotes,
        items: checklistItems,
        photos: allPhotos,
        templateId: template.id,
        signature: {
          signatureUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiPjxwYXRoIGQ9Ik0xMCwyMCBRNDAsMTAgNjAsMjUgVDkwLDE1IiBzdHJva2U9IiMwNmI2ZDRCIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
          signedAt: new Date().toISOString(),
          signedBy: currentUser?.name || 'Driver',
          declarationAccepted: true,
        },
      });

      setIsSubmitting(false);
      onCompleted(newInspection);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(err.message || 'Gagal mengirim formulir inspeksi. Data tersimpan di antrean offline.');
    }
  };

  const categories = template.categories;
  const currentCategoryItems = checklistItems.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
              Formulir Pre-Trip Driver
            </span>
            <span className="text-xs text-slate-400 font-mono">Template: {template.name}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white mt-1">Pemeriksaan Kendaraan Sebelum Jalan</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pastikan seluruh komponen wajib dicek secara teliti. Kendaraan dengan rem atau APAR bermasalah otomatis di-grounded.
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Skor Kelaikan</div>
            <div className={`text-2xl font-bold ${
              evaluation.result === 'PASS' 
                ? 'text-emerald-400' 
                : evaluation.result === 'ATTENTION' 
                ? 'text-amber-400' 
                : 'text-rose-400'
            }`}>
              {evaluation.score}%
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            evaluation.result === 'PASS' 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : evaluation.result === 'ATTENTION' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
          }`}>
            {evaluation.result}
          </div>
        </div>
      </div>

      {/* STEP 1: Vehicle & Telemetry Selection Card */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          1. Pilih Unit Kendaraan & Verifikasi Telemetri Awal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vehicle Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Pilih Kendaraan Armada</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const found = vehicles.find(v => v.id === e.target.value);
                if (found) {
                  setCurrentOdometer(found.odometerKm);
                  setCurrentEngineHours(found.engineHours);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} — {v.brand} {v.model} ({v.status})
                </option>
              ))}
            </select>
          </div>

          {/* Odometer Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Odometer Fisik (KM)
              <span className="text-[10px] text-slate-500 ml-1">(Odo Lalu: {selectedVehicle.odometerKm.toLocaleString()})</span>
            </label>
            <input
              type="number"
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(Number(e.target.value))}
              className={`w-full p-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none ${
                currentOdometer < selectedVehicle.odometerKm 
                  ? 'border-amber-500 bg-amber-950/20' 
                  : 'border-slate-700 focus:border-cyan-500'
              }`}
            />
            {currentOdometer < selectedVehicle.odometerKm && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Nilai odometer lebih rendah dari data sebelumnya. Mohon periksa kembali.
              </p>
            )}
          </div>

          {/* Engine Hours */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Engine Hours (Jam Kerja)</label>
            <input
              type="number"
              value={currentEngineHours}
              onChange={(e) => setCurrentEngineHours(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Lokasi Pos Pemeriksaan</label>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2.5 pl-8 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-cyan-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Warning if vehicle is currently in maintenance or breakdown */}
        {isVehicleUnavailable && (
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800 text-amber-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <strong>Pemberitahuan Status Kendaraan:</strong> Unit ini saat ini berstatus <em>{selectedVehicle.status.toUpperCase()}</em>. 
              Melakukan inspeksi baru dan menyelesaikannya dengan status <strong>PASS</strong> dapat memulihkan status kelaikan operasional.
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: Interactive Checklist by Category */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        {/* Category Tab Bar */}
        <div className="flex items-center overflow-x-auto border-b border-slate-800 bg-slate-950/70 p-2 gap-1.5 scrollbar-thin">
          {categories.map((cat) => {
            const catItems = checklistItems.filter(i => i.category === cat.category);
            const hasFail = catItems.some(i => i.result === 'FAIL');
            const hasAttention = catItems.some(i => i.result === 'ATTENTION');
            const allPass = catItems.every(i => i.result === 'PASS');

            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.category
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{cat.title}</span>
                {hasFail ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                ) : hasAttention ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                ) : allPass ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Category Items List */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Kategori: {categories.find(c => c.category === activeCategory)?.title}
            </h2>
            <span className="text-xs text-slate-400">
              {currentCategoryItems.filter(i => i.result === 'PASS').length} dari {currentCategoryItems.length} Selesai
            </span>
          </div>

          <div className="space-y-4">
            {currentCategoryItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.result === 'FAIL'
                    ? 'bg-rose-950/20 border-rose-800/80 shadow-md'
                    : item.result === 'ATTENTION'
                    ? 'bg-amber-950/20 border-amber-800/70'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Item Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{item.itemName}</span>
                      {item.groundingTrigger && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
                          Grounding Trigger
                        </span>
                      )}
                      {item.required && (
                        <span className="text-[10px] text-cyan-400 font-mono">*Wajib</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>

                  {/* Result Toggle Buttons */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      type="button"
                      onClick={() => handleItemResult(item.id, 'PASS')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        item.result === 'PASS'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      GOOD / PASS
                    </button>

                    <button
                      type="button"
                      onClick={() => handleItemResult(item.id, 'ATTENTION')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        item.result === 'ATTENTION'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      ATTENTION
                    </button>

                    <button
                      type="button"
                      onClick={() => handleItemResult(item.id, 'FAIL')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        item.result === 'FAIL'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      FAIL
                    </button>
                  </div>
                </div>

                {/* Conditional Failure Block (Notes + Photo Evidence) */}
                {(item.result === 'FAIL' || item.result === 'ATTENTION') && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {item.result === 'FAIL' ? 'Jelaskan Kerusakan / Alasan Gagal:' : 'Catatan Perhatian Khusus:'}
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Tekanan ban hanya 60 PSI / Ada desis bocor angin pengereman..."
                        value={item.notes || ''}
                        onChange={(e) => handleItemNotes(item.id, e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    {/* Photo Evidence Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          Bukti Foto {item.photoRequired && <span className="text-rose-400">*Wajib untuk status FAIL</span>}
                        </span>

                        <button
                          type="button"
                          disabled={analyzingItemId === item.id}
                          onClick={() => handleAddPhoto(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
                        >
                          {analyzingItemId === item.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Memindai AI Vision...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              Ambil Foto / Galeri
                            </>
                          )}
                        </button>
                      </div>

                      {/* Photo Thumbnail Gallery */}
                      {item.photos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {item.photos.map((ph) => (
                            <div
                              key={ph.id}
                              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3"
                            >
                              <img
                                src={ph.fileUrl}
                                alt="Evidence"
                                className="w-16 h-16 rounded-md object-cover border border-slate-700"
                              />
                              <div className="text-xs space-y-1 flex-1">
                                <p className="text-slate-200 font-medium line-clamp-1">{ph.caption}</p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  {new Date(ph.timestamp).toLocaleTimeString()} • Lat: {ph.latitude}
                                </p>
                                {ph.aiAnalysis?.analyzed && (
                                  <div className="flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    AI: {ph.aiAnalysis.potentialIssues[0] || 'Tervalidasi'}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(item.id, ph.id)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 3: Overall Notes & Digital Signature Declaration */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          3. Catatan Keseluruhan & Deklarasi Tanda Tangan Driver
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Catatan Tambahan Pengemudi (Opsional)</label>
          <textarea
            rows={2}
            placeholder="Catatan kondisi kabin, kelengkapan surat STNK/KIR, atau kendala rute..."
            value={overallNotes}
            onChange={(e) => setOverallNotes(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Declaration Checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={declarationAccepted}
            onChange={(e) => setDeclarationAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 border-slate-700 bg-slate-900"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            <strong>Deklarasi Pengemudi:</strong> Saya menyatakan bahwa pemeriksaan fisik kendaraan telah dilakukan secara jujur dan akurat sesuai checklist di atas. Apabila terdapat temuan kritis yang membatalkan keberangkatan, saya bersedia mematuhi protokol penanganan bengkel.
          </span>
        </label>

        {/* Digital Signature Pad Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-white">Tanda Tangan Digital Pengemudi</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Driver: {currentUser?.name || 'Agus Santoso'} (NIK: DRV-001)
            </div>
          </div>

          <div className="flex items-center gap-3">
            {signatureSigned ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Check className="w-4 h-4" />
                Telah Ditandatangani
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSignatureSigned(true)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all shadow"
              >
                Bubuhkan Tanda Tangan
              </button>
            )}

            {signatureSigned && (
              <button
                type="button"
                onClick={() => setSignatureSigned(false)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Ulangi
              </button>
            )}
          </div>
        </div>

        {/* Submission Error Banner */}
        {submissionError && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Vehicle Grounding Warning Notice on Critical Failure */}
        {evaluation.grounded && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-700/80 text-rose-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-2 text-rose-300">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
              🚨 PERINGATAN: KENDARAAN AKAN OTOMATIS DI-GROUNDED SAAT SUBMIT
            </div>
            <p className="text-rose-300/80 leading-relaxed">
              Karena ditemukan kegagalan pada komponen pengereman/APAR, sistem akan langsung memblokir keberangkatan kendaraan, memicu status <strong>OUT_OF_SERVICE</strong>, dan menerbitkan Work Order perbaikan ke tim bengkel.
            </p>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              evaluation.grounded
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30'
            } active:scale-95 disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Memproses Inspeksi...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {evaluation.grounded ? 'SUBMIT & GROUND KENDARAAN' : 'SUBMIT INSPEKSI PRE-TRIP'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
