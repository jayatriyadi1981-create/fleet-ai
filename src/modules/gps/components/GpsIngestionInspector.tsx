/**
 * Fleet Intelligence Smart AI - Live Raw Ingestion & Telemetry Inspector
 */

import React, { useState, useEffect } from 'react';
import { gpsIngestionService } from '../services/GpsIngestionService';
import { RawGpsMessage, GpsTelemetry, GpsIngestRequest } from '../types/gpsArchitecture';
import { GpsEventBus } from '../services/GpsEventBus';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Code2, 
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

export const GpsIngestionInspector: React.FC = () => {
  const [rawMessages, setRawMessages] = useState<RawGpsMessage[]>([]);
  const [telemetryHistory, setTelemetryHistory] = useState<GpsTelemetry[]>([]);
  const [selectedRawMsg, setSelectedRawMsg] = useState<RawGpsMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual Ingest Form state
  const [deviceIdInput, setDeviceIdInput] = useState<string>('GPS-DEV-001');
  const [latInput, setLatInput] = useState<number>(-6.2088);
  const [lngInput, setLngInput] = useState<number>(106.8456);
  const [speedInput, setSpeedInput] = useState<number>(65);
  const [headingInput, setHeadingInput] = useState<number>(180);
  const [protocolInput, setProtocolInput] = useState<string>('GT06');
  const [seqInput, setSeqInput] = useState<number>(2005);
  const [ignitionInput, setIgnitionInput] = useState<boolean>(true);
  const [ingestStatusMessage, setIngestStatusMessage] = useState<string | null>(null);

  const refreshLogs = () => {
    setRawMessages(gpsIngestionService.getRawMessages());
    setTelemetryHistory(gpsIngestionService.getTelemetryHistory(50));
  };

  useEffect(() => {
    refreshLogs();
    const unsub = GpsEventBus.subscribe('TelemetryReceived', () => {
      refreshLogs();
    });
    return unsub;
  }, []);

  const handleManualIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: GpsIngestRequest = {
      deviceId: deviceIdInput,
      timestamp: new Date().toISOString(),
      latitude: latInput,
      longitude: lngInput,
      speed: speedInput,
      heading: headingInput,
      ignition: ignitionInput,
      sequenceNumber: seqInput,
      protocol: protocolInput,
    };

    const res = await gpsIngestionService.ingestTelemetry(req);
    if (res.accepted) {
      setIngestStatusMessage(`✓ Telemetry Diterima & Diproses: ID ${res.telemetryId}`);
    } else {
      setIngestStatusMessage(`⚠️ Diabaikan: ${res.processingStatus} - ${res.reason}`);
    }
    refreshLogs();
    setTimeout(() => setIngestStatusMessage(null), 4000);
  };

  const filteredRaw = rawMessages.filter((msg) => {
    const matchStatus = statusFilter === 'all' || msg.processingStatus === statusFilter;
    const matchSearch = searchQuery === '' || msg.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) || msg.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controller & Ingestion Endpoint Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Endpoint Tester Form */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulasi Ingestion API</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              POST /api/gps/ingest
            </span>
          </div>

          <form onSubmit={handleManualIngest} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Device ID</label>
                <input
                  type="text"
                  value={deviceIdInput}
                  onChange={(e) => setDeviceIdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Protocol</label>
                <select
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="GT06">Concox GT06</option>
                  <option value="Teltonika">Teltonika Codec 8</option>
                  <option value="Generic_HTTP">Generic HTTP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latInput}
                  onChange={(e) => setLatInput(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lngInput}
                  onChange={(e) => setLngInput(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Kecepatan (km/h)</label>
                <input
                  type="number"
                  value={speedInput}
                  onChange={(e) => setSpeedInput(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Heading (°)</label>
                <input
                  type="number"
                  value={headingInput}
                  onChange={(e) => setHeadingInput(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Sequence</label>
                <input
                  type="number"
                  value={seqInput}
                  onChange={(e) => setSeqInput(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignitionInput}
                  onChange={(e) => setIgnitionInput(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span className="text-xs text-slate-300 font-mono">Ignition Status ON</span>
              </label>

              <button
                type="submit"
                className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-cyan-950"
              >
                <Send className="h-3.5 w-3.5" /> Ingest Packet
              </button>
            </div>
          </form>

          {ingestStatusMessage && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 animate-fadeIn">
              {ingestStatusMessage}
            </div>
          )}
        </div>

        {/* Live Raw Messages Stream Table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Raw Telemetry Ingestion Log</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {rawMessages.length} Packet
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Cari Device / ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="PROCESSED">PROCESSED</option>
                <option value="DUPLICATE">DUPLICATE</option>
                <option value="INVALID_LOCATION">INVALID_LOCATION</option>
              </select>

              <button
                onClick={refreshLogs}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                title="Refresh Log"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[320px] rounded-xl border border-slate-800/80 bg-slate-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-mono uppercase text-slate-400 tracking-wider sticky top-0">
                  <th className="p-2.5">Packet ID</th>
                  <th className="p-2.5">Device ID</th>
                  <th className="p-2.5">Protocol</th>
                  <th className="p-2.5">Received At</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right font-mono">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredRaw.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                      Belum ada pesan raw telemetry masuk.
                    </td>
                  </tr>
                ) : (
                  filteredRaw.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-2.5 text-cyan-400 font-bold">{msg.id}</td>
                      <td className="p-2.5 text-white">{msg.deviceId}</td>
                      <td className="p-2.5 text-slate-300">{msg.protocol}</td>
                      <td className="p-2.5 text-slate-400">{new Date(msg.receivedAt).toLocaleTimeString()}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            msg.processingStatus === 'PROCESSED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : msg.processingStatus === 'DUPLICATE'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {msg.processingStatus === 'PROCESSED' && <CheckCircle2 className="h-3 w-3" />}
                          {msg.processingStatus === 'DUPLICATE' && <AlertTriangle className="h-3 w-3" />}
                          {msg.processingStatus !== 'PROCESSED' && msg.processingStatus !== 'DUPLICATE' && <XCircle className="h-3 w-3" />}
                          {msg.processingStatus}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => setSelectedRawMsg(msg)}
                          className="text-cyan-400 hover:text-cyan-300 font-bold text-[10px] underline"
                        >
                          Inspeksi Payload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Raw Payload Inspector Modal / Detail Panel */}
      {selectedRawMsg && (
        <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Raw Packet Detail Inspector: {selectedRawMsg.id}
              </h4>
            </div>
            <button
              onClick={() => setSelectedRawMsg(null)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              [Tutup Inspection]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div><span className="text-slate-500">Tenant ID:</span> <span className="text-white">{selectedRawMsg.tenantId}</span></div>
              <div><span className="text-slate-500">Device ID:</span> <span className="text-cyan-300">{selectedRawMsg.deviceId}</span></div>
              <div><span className="text-slate-500">Protocol:</span> <span className="text-slate-300">{selectedRawMsg.protocol}</span></div>
              <div><span className="text-slate-500">Sequence Number:</span> <span className="text-amber-300">{selectedRawMsg.sequenceNumber || 'N/A'}</span></div>
              <div><span className="text-slate-500">Received At:</span> <span className="text-slate-400">{selectedRawMsg.receivedAt}</span></div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
              <span className="text-slate-500 block mb-1">Raw Payload Json:</span>
              <pre className="text-[11px] text-emerald-400 font-mono leading-tight">
                {JSON.stringify(selectedRawMsg.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
