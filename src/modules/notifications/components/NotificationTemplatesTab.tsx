/**
 * Fleet Intelligence Smart AI - Notification Templates Tab Component
 */

import React, { useState } from 'react';
import { notificationTemplateService } from '../services/notificationTemplateService';
import { NotificationTemplate, DeliveryChannel } from '../types';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Send,
  Smartphone,
  Mail,
  MessageSquare,
  MessageCircle,
  Copy,
} from 'lucide-react';

export const NotificationTemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState(() => notificationTemplateService.getTemplates());
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<any>('ALERT');
  const [formChannel, setFormChannel] = useState<DeliveryChannel>('IN_APP');
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');

  const filtered = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.titleTemplate.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = selectedChannel === 'ALL' || t.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormCategory('ALERT');
    setFormChannel('IN_APP');
    setFormTitle('⚠️ {{alert.type}} — Armada {{vehicle.plate}}');
    setFormBody('Peringatan {{alert.type}} terdeteksi pada kendaraan {{vehicle.plate}} (Driver: {{driver.name}}) lokasi {{location.address}}.');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (t: NotificationTemplate) => {
    setEditingTemplate(t);
    setFormName(t.name);
    setFormCategory(t.category);
    setFormChannel(t.channel);
    setFormTitle(t.titleTemplate);
    setFormBody(t.bodyTemplate);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      notificationTemplateService.updateTemplate(editingTemplate.id, {
        name: formName,
        category: formCategory,
        channel: formChannel,
        titleTemplate: formTitle,
        bodyTemplate: formBody,
      });
    } else {
      notificationTemplateService.createTemplate({
        tenantId: 'tenant-indonesia-logistics',
        name: formName || 'Template Baru',
        category: formCategory,
        channel: formChannel,
        language: 'id',
        status: 'ACTIVE',
        titleTemplate: formTitle,
        bodyTemplate: formBody,
        variables: ['vehicle.plate', 'driver.name', 'location.address', 'alert.type'],
      });
    }
    setTemplates([...notificationTemplateService.getTemplates()]);
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string) => {
    notificationTemplateService.deleteTemplate(id);
    setTemplates([...notificationTemplateService.getTemplates()]);
  };

  const insertVariable = (varName: string) => {
    setFormBody((prev) => `${prev} {{${varName}}}`);
  };

  const samplePreview = previewTemplate
    ? notificationTemplateService.generateSamplePreview(previewTemplate.id)
    : null;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Manajemen Template Notifikasi (Notification Templates Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur format judul & isi pesan dengan variabel dinamis (`vehicle.plate`, `driver.name`) untuk semua kanal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Buat Template Baru
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama template, variabel..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'IN_APP', 'PUSH', 'EMAIL', 'WHATSAPP', 'SMS'].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedChannel === ch
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{t.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.channel}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                  {t.category}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <p className="text-indigo-300 font-bold truncate">{t.titleTemplate}</p>
              <p className="text-slate-400 line-clamp-2">{t.bodyTemplate}</p>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                Variabel: {t.variables.join(', ')}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setPreviewTemplate(t);
                    setIsPreviewOpen(true);
                  }}
                  className="p-1.5 text-cyan-400 hover:bg-slate-800 rounded-lg"
                  title="Simulasi Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 text-indigo-400 hover:bg-slate-800 rounded-lg"
                  title="Edit Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && samplePreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Simulasi Multi-Channel Live Preview
              </h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Channel target: {samplePreview.channel}</span>
                <p className="font-bold text-cyan-300 text-xs">{samplePreview.title}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{samplePreview.body}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Sample Render Context Data</span>
                <pre className="text-[10px] font-mono text-emerald-400 bg-slate-900 p-2.5 rounded-xl overflow-x-auto">
                  {JSON.stringify(samplePreview.sampleData, null, 2)}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {editingTemplate ? 'Edit Template Notifikasi' : 'Buat Template Notifikasi Baru'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Template</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Email Warning Overspeed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Kanal (Channel)</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="IN_APP">IN_APP</option>
                    <option value="PUSH">PUSH</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Kategori Isu</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="ALERT">ALERT</option>
                    <option value="DELIVERY">DELIVERY</option>
                    <option value="TRIP">TRIP</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="GEOFENCE">GEOFENCE</option>
                    <option value="SYSTEM">SYSTEM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Template Judul (Title Format)</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400">Template Isi Pesan (Body Format)</label>
                  <span className="text-[10px] text-indigo-400">Klik variabel untuk menyisipkan</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {['vehicle.plate', 'driver.name', 'location.address', 'telemetry.speed', 'delivery.orderNumber'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded text-[10px] font-mono border border-slate-700 transition-colors"
                    >
                      + {v}
                    </button>
                  ))}
                </div>

                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Simpan Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
