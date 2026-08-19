/**
 * Fleet Intelligence Smart AI - AI Inspection Vision & Anomaly Intelligence Console
 * AI Photo Vision analysis, repeated failure patterns, and predictive maintenance linkages.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  Activity, 
  Camera, 
  RefreshCw, 
  Wrench, 
  Check 
} from 'lucide-react';
import { inspectionAiService } from '../services/inspectionAiService';
import { InspectionAiInsight } from '../types/inspection';

export const InspectionAiView: React.FC = () => {
  const [insights, setInsights] = useState<InspectionAiInsight[]>(() => inspectionAiService.getInsights());
  const [privacyEnabled, setPrivacyEnabled] = useState<boolean>(() => inspectionAiService.isPhotoAnalysisEnabled());

  // Interactive AI Vision Photo Tester
  const [testCategory, setTestCategory] = useState<string>('TIRE');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleTogglePrivacy = (enabled: boolean) => {
    setPrivacyEnabled(enabled);
    inspectionAiService.setPhotoAnalysisEnabled(enabled);
  };

  const handleRunAiPhotoScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    const result = await inspectionAiService.analyzePhoto(testCategory, `${testCategory}_SAMPLE`);
    setScanResult(result);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-900/50 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Smart AI Inspection & Vision Intelligence
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                Gemini Vision Engine
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Analisis citra komputer visi foto kerusakan, korelasi telematika keausan ban/rem, dan deteksi anomali kegagalan berulang.
            </p>
          </div>
        </div>

        {/* Privacy Switch */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <Lock className="w-4 h-4 text-cyan-400" />
          <div className="text-xs">
            <div className="font-semibold text-white">AI Photo Vision Analysis</div>
            <div className="text-[10px] text-slate-400">Persetujuan pemrosesan citra tenant</div>
          </div>
          <button
            type="button"
            onClick={() => handleTogglePrivacy(!privacyEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              privacyEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>
      </div>

      {/* 2-Column Grid: AI Insights Feed & AI Vision Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Insights & Anomaly Detections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Wawasan Prediktif & Deteksi Anomali Berulang
            </h2>

            <div className="space-y-4">
              {insights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-cyan-900/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">{ins.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        ins.severity === 'CRITICAL' 
                          ? 'bg-rose-500/20 text-rose-300' 
                          : ins.severity === 'HIGH' 
                          ? 'bg-orange-500/20 text-orange-300' 
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {ins.severity}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {ins.confidenceScore}% Confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ins.summary}</p>

                  <div className="mt-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/30 text-xs space-y-1">
                    <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Rekomendasi Tindak Lanjut:
                    </div>
                    <p className="text-slate-300 text-[11px]">{ins.recommendation}</p>
                    <div className="text-[11px] text-cyan-400 font-medium pt-1">
                      Aksi Wajib: {ins.actionRequired}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Vision Testing Sandbox */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Konsol Uji AI Photo Vision</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uji coba algoritma Computer Vision dalam mendeteksi retak ban, kebocoran pelumas, atau kerusakan selang rem.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Pilih Sampel Komponen</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="TIRE">Foto Ban (Tire Tread Wear & Screws)</option>
                  <option value="BRAKE">Foto Selang Rem Pneumatik (Air Brake Joint)</option>
                  <option value="OIL">Foto Dipstick & Rembesan Oli Mesin</option>
                  <option value="BODY">Foto Sudut Bumper & Kaca Spion</option>
                </select>
              </div>

              <button
                type="button"
                disabled={isScanning}
                onClick={handleRunAiPhotoScan}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Memindai Pola Citra...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Jalankan Analisis AI Vision
                  </>
                )}
              </button>
            </div>

            {/* Scan Output */}
            {scanResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Hasil Analisis Visi AI:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {scanResult.confidence} ({scanResult.confidenceScore}%)
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  {scanResult.potentialIssues.map((issue: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-amber-300">
                      <span>•</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 italic pt-1">"{scanResult.notes}"</p>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500">
                  ⚠️ {scanResult.disclaimer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
