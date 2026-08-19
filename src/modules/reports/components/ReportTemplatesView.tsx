/**
 * Fleet Intelligence Smart AI - Report Templates Management View
 * PROMPT 39 - Standard & Custom Reusable Templates with Favorites, Tags & Instant Execution
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  FileText,
  Star,
  Play,
  Trash2,
  Sliders,
  Sparkles,
  Search,
  Plus,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { ReportTemplate } from '../types';

export const ReportTemplatesView: React.FC = () => {
  const {
    templates,
    loadTemplate,
    deleteTemplate,
    toggleFavoriteTemplate,
    setActiveTab,
  } = useReports();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const allTags = ['ALL', 'Executive', 'Finance', 'Cost', 'Fuel', 'Safety', 'Driver', 'Maintenance', 'GPS', 'Audit'];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      selectedTag === 'ALL' || t.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Template Laporan Siap Pakai ({templates.length})</h2>
          <p className="text-xs text-slate-400">Pilih template terstandarisasi atau buat template kustom baru dengan susunan kolom dan filter khusus</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama template..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-600/20 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Template Baru</span>
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTag === tag
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {tag === 'ALL' ? 'Semua Tag' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                  {tpl.type}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFavoriteTemplate(tpl.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition"
                  >
                    <Star className={`h-4 w-4 ${tpl.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                  {!tpl.isDefault && (
                    <button
                      onClick={() => deleteTemplate(tpl.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{tpl.name}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {tpl.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">{tpl.usageCount}x digenerate</span>
              <button
                onClick={() => loadTemplate(tpl)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-md shadow-cyan-600/20"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Gunakan Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
