/**
 * Fleet Intelligence Smart AI - Command Center Settings & Layer Configuration Modal
 */

import React, { useState } from 'react';
import { SlidersHorizontal, X, Layers, Volume2, ShieldAlert, Check } from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { commandCenterAudioService } from '../../services/commandCenterAudioService';
import { CommandCenterLayerConfig, AudioAlertConfig } from '../../types/commandCenterTypes';

interface CommandCenterSettingsModalProps {
  onClose: () => void;
}

export const CommandCenterSettingsModal: React.FC<CommandCenterSettingsModalProps> = ({ onClose }) => {
  const [layers, setLayers] = useState<CommandCenterLayerConfig>(commandCenterService.getLayerConfig());
  const [audio, setAudio] = useState<AudioAlertConfig>(commandCenterAudioService.getConfig());

  const handleToggleLayer = (key: keyof CommandCenterLayerConfig) => {
    const updated = { ...layers, [key]: !layers[key] };
    setLayers(updated);
    commandCenterService.updateLayerConfig(updated);
  };

  const handleUpdateAudio = (key: keyof AudioAlertConfig, value: unknown) => {
    const updated = { ...audio, [key]: value };
    setAudio(updated);
    commandCenterAudioService.updateConfig(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Konfigurasi Command Center</h2>
              <p className="text-[11px] text-slate-400">Layer peta, audio alarm, dan opsi kontrol</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* GIS Layers */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Layer Visualisasi Peta
            </h3>
            <div className="space-y-2">
              {[
                { key: 'showVehicles' as const, label: 'Tampilkan Marker Kendaraan' },
                { key: 'showGeofences' as const, label: 'Tampilkan Geofence & Batas Depo' },
                { key: 'showEmergencyZones' as const, label: 'Tampilkan Radius Zona Darurat (SOS)' },
                { key: 'clusteringEnabled' as const, label: 'Aktifkan Clustering Kepadatan Armada' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700"
                >
                  <span className="text-xs text-slate-200">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => handleToggleLayer(item.key)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Audio Config */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Audio Alarm & Notifikasi Suara
            </h3>
            <div className="space-y-2.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-200">Aktifkan Bunyi Suara Alarm</span>
                <input
                  type="checkbox"
                  checked={audio.soundEnabled}
                  onChange={(e) => handleUpdateAudio('soundEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
              </label>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Volume Alarm:</span>
                  <span className="font-mono">{Math.round(audio.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={audio.volume}
                  onChange={(e) => handleUpdateAudio('volume', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => commandCenterAudioService.playAlertChime()}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  ▶ Uji Bunyi Alarm
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
