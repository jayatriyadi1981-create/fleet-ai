import React, { useState } from 'react';
import {
  FileText,
  Smartphone,
  Mail,
  MessageSquare,
  Sparkles,
  Check,
  Copy,
  Eye,
  Plus,
  Save,
  Tag,
  Languages,
} from 'lucide-react';
import { NotificationTemplate } from '../../../modules/notifications/types/notificationEngineTypes';
import { notificationTemplateEngine } from '../../../modules/notifications/core/NotificationTemplateEngine';

export const TemplateManagerTab: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(() =>
    notificationTemplateEngine.getAllTemplates()
  );
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>(templates[0]);
  const [previewChannel, setPreviewChannel] = useState<'WHATSAPP' | 'EMAIL' | 'PUSH'>('WHATSAPP');
  const [isSaved, setIsSaved] = useState(false);

  // Sample simulation variable data for live preview
  const sampleData: Record<string, string | number> = {
    driverName: 'Budi Santoso',
    vehiclePlate: 'B 9128 UXT',
    speed: 104,
    speedLimit: 80,
    location: 'Tol Cipali KM 102',
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    coordinates: '-6.52184, 107.48291',
    durationMinutes: 20,
    odometer: '49.850',
    serviceType: 'Servis 50.000 KM & Ganti Oli Mesin',
    dueDate: '25 Agustus 2026',
    dropLiters: 28,
    ignitionStatus: 'MATI (Off)',
    companyName: 'PT Nusantara Logistik Express',
    recommendationTitle: 'Optimasi Rute & Efisiensi Bahan Bakar',
    summary: 'Penghematan 14.2% BBM terdeteksi jika menghindari rute lingkar luar Cikampek.',
    riskLevel: 'SEDANG',
    potentialImpact: 'Rp 4.250.000/bulan',
    otpCode: '849201',
    expiryMinutes: 5,
    totalVehicles: 125,
    activeCount: 118,
    offlineCount: 5,
    totalDistanceKm: '14.820',
    fuelConsumedLiters: '4.210',
    overspeedCount: 17,
    maintenanceCount: 7,
    fleetScore: 94,
  };

  const rendered = notificationTemplateEngine.render(selectedTemplate, sampleData);

  const handleSave = () => {
    notificationTemplateEngine.saveTemplate(selectedTemplate);
    setTemplates(notificationTemplateEngine.getAllTemplates());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleInsertVariable = (token: string) => {
    setSelectedTemplate(prev => ({
      ...prev,
      bodyTemplate: `${prev.bodyTemplate} {{${token}}}`,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Notification Template Engine & Variable Interpolator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kelola template pesan multi-bahasa, token dinamis variabel armada, serta validasi preview rendering WhatsApp, Email, dan Push.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Bahasa:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold flex items-center gap-1">
            <Languages className="w-3.5 h-3.5" />
            <span>Bahasa Indonesia (Default)</span>
          </span>
        </div>
      </div>

      {/* Main Layout: Template List (Left), Editor (Center), Live Device Mockup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Catalog (3 Cols) */}
        <div className="lg:col-span-3 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Template Catalog ({templates.length})
          </h3>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {templates.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full text-left p-3 rounded-xl border transition text-xs space-y-1 ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">v{tmpl.version}</span>
                </div>
                <div className="font-bold text-white truncate">{tmpl.name}</div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{tmpl.event}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Template Editor (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white truncate">{selectedTemplate.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">Event: {selectedTemplate.event}</p>
            </div>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Versi'}</span>
            </button>
          </div>

          {/* Title Template */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Judul / Subject Notifikasi:</label>
            <input
              type="text"
              value={selectedTemplate.titleTemplate}
              onChange={e => setSelectedTemplate({ ...selectedTemplate, titleTemplate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Body Template */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Body Pesan (Mendukung Token {'{{...}}'}):</label>
              <span className="text-[10px] text-slate-500">Mendukung format Markdown & WA bold (*)</span>
            </div>
            <textarea
              rows={8}
              value={selectedTemplate.bodyTemplate}
              onChange={e => setSelectedTemplate({ ...selectedTemplate, bodyTemplate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Dynamic Token Variable Inserter */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Klik token untuk menyisipkan variabel dinamis:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {selectedTemplate.variables.map(token => (
                <button
                  key={token}
                  onClick={() => handleInsertVariable(token)}
                  className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/30 text-[11px] font-mono transition"
                >
                  +{`{{${token}}}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Device Mockup Preview (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Multi-Device Preview</span>
            </h3>

            {/* Preview Channel Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setPreviewChannel('WHATSAPP')}
                className={`px-2 py-1 rounded font-bold transition flex items-center gap-1 ${
                  previewChannel === 'WHATSAPP' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>WA</span>
              </button>
              <button
                onClick={() => setPreviewChannel('PUSH')}
                className={`px-2 py-1 rounded font-bold transition flex items-center gap-1 ${
                  previewChannel === 'PUSH' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Push</span>
              </button>
              <button
                onClick={() => setPreviewChannel('EMAIL')}
                className={`px-2 py-1 rounded font-bold transition flex items-center gap-1 ${
                  previewChannel === 'EMAIL' ? 'bg-purple-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Mockup Container */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl min-h-[440px] flex flex-col justify-start">
            {previewChannel === 'WHATSAPP' && (
              <div className="space-y-3">
                {/* WhatsApp Chat Header Mockup */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-emerald-950/60 text-emerald-400">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    FI
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Fleet Intelligence AI Verified</div>
                    <div className="text-[10px] text-emerald-500/80">Official Business Account</div>
                  </div>
                </div>

                {/* Chat Bubble */}
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-emerald-950/40 border border-emerald-800/40 text-emerald-100 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                  {rendered.body}
                  <div className="text-[10px] text-emerald-400/60 text-right flex items-center justify-end gap-1">
                    <span>14:32</span>
                    <span>✓✓</span>
                  </div>
                </div>
              </div>
            )}

            {previewChannel === 'PUSH' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  Android / iOS Notification Shade
                </div>
                {/* Push Notification Card Mockup */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>FLEET INTELLIGENCE AI</span>
                    </span>
                    <span>Just now</span>
                  </div>
                  <div className="text-xs font-bold text-white">{rendered.title}</div>
                  <div className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {rendered.body}
                  </div>
                </div>
              </div>
            )}

            {previewChannel === 'EMAIL' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  Transactional HTML Email Header
                </div>
                {/* Email Client Preview */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-2 text-xs">
                  <div className="border-b border-slate-800 pb-2 space-y-1">
                    <div><strong className="text-slate-400">From:</strong> Fleet Intelligence &lt;no-reply@fleet-intel.id&gt;</div>
                    <div><strong className="text-slate-400">Subject:</strong> <span className="text-white font-bold">{rendered.title}</span></div>
                  </div>
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed pt-2">
                    {rendered.body}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
