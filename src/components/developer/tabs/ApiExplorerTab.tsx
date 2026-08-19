import React, { useState } from 'react';
import {
  BookOpen,
  Send,
  Code2,
  Copy,
  Check,
  Zap,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Layers,
} from 'lucide-react';
import { APIKeyRecord } from '../../../types/externalApi';
import { externalApiService } from '../../../services/api/externalApiService';

interface ApiExplorerTabProps {
  apiKeys: APIKeyRecord[];
}

interface EndpointDefinition {
  id: string;
  category: 'VEHICLES' | 'DRIVERS' | 'GPS_TELEMETRY' | 'TRIPS' | 'GEOFENCES' | 'ALERTS' | 'ASYNC_REPORTS' | 'AI_INTELLIGENCE' | 'WEBHOOKS';
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requiredScope: string;
  defaultQueryParams?: Record<string, string>;
  defaultBody?: any;
  defaultPathParams?: Record<string, string>;
}

const ENDPOINTS_CATALOG: EndpointDefinition[] = [
  {
    id: 'get_vehicles',
    category: 'VEHICLES',
    method: 'GET',
    path: '/api/v1/vehicles',
    summary: 'List Fleet Vehicles',
    description: 'Mengambil daftar armada dengan filter status, cabang, dan paginasi.',
    requiredScope: 'vehicles:read',
    defaultQueryParams: { page: '1', limit: '10', status: 'moving' },
  },
  {
    id: 'get_vehicle_location',
    category: 'VEHICLES',
    method: 'GET',
    path: '/api/v1/vehicles/:id/location',
    summary: 'Get Real-time Vehicle Location',
    description: 'Mengambil koordinat presisi GPS, kecepatan, heading, dan ignition dari Unified Telematics Layer.',
    requiredScope: 'gps:read',
    defaultPathParams: { id: 'veh_01' },
  },
  {
    id: 'get_vehicle_telemetry',
    category: 'VEHICLES',
    method: 'GET',
    path: '/api/v1/vehicles/:id/telemetry',
    summary: 'Get Vehicle CAN-bus Telemetry',
    description: 'Mengambil level BBM, suhu mesin, voltase aki, dan odometer.',
    requiredScope: 'gps:read',
    defaultPathParams: { id: 'veh_01' },
  },
  {
    id: 'create_vehicle',
    category: 'VEHICLES',
    method: 'POST',
    path: '/api/v1/vehicles',
    summary: 'Create New Vehicle',
    description: 'Mendaftarkan unit kendaraan baru ke katalog master armada.',
    requiredScope: 'vehicles:write',
    defaultBody: {
      name: 'Isuzu Giga Wingbox 285PS',
      plateNumber: 'B 9912 WXB',
      vehicleType: 'truck_box',
      brand: 'Isuzu',
      model: 'FVZ 34 P',
      year: 2024,
      branchId: 'br_cikarang',
    },
  },
  {
    id: 'get_drivers',
    category: 'DRIVERS',
    method: 'GET',
    path: '/api/v1/drivers',
    summary: 'List Drivers (With PII Masking)',
    description: 'Mengambil profil pengemudi dengan masking nomor telepon & SIM (kecuali ada scope drivers:pii).',
    requiredScope: 'drivers:read',
    defaultQueryParams: { page: '1', limit: '10' },
  },
  {
    id: 'get_gps_devices',
    category: 'GPS_TELEMETRY',
    method: 'GET',
    path: '/api/v1/gps/devices',
    summary: 'List GPS Hardware Devices',
    description: 'Melihat status koneksi socket, protokol, vendor, dan sinyal modem seluruh GPS.',
    requiredScope: 'gps:read',
  },
  {
    id: 'send_gps_command',
    category: 'GPS_TELEMETRY',
    method: 'POST',
    path: '/api/v1/gps/devices/:id/commands',
    summary: 'Send Remote GPS Command (Sensitif)',
    description: 'Mengirimkan remote command: REQUEST_LOCATION, SET_INTERVAL, atau LOCK_ENGINE.',
    requiredScope: 'gps:write',
    defaultPathParams: { id: 'dev_01' },
    defaultBody: {
      commandType: 'REQUEST_LOCATION',
      params: { intervalSeconds: 30 },
      confirmedHighRisk: false,
    },
  },
  {
    id: 'get_trips',
    category: 'TRIPS',
    method: 'GET',
    path: '/api/v1/trips',
    summary: 'List Trips & Dispatches',
    description: 'Melihat jadwal perjalanan, rute asal-tujuan, dan jarak tempuh.',
    requiredScope: 'trips:read',
  },
  {
    id: 'get_geofences',
    category: 'GEOFENCES',
    method: 'GET',
    path: '/api/v1/geofences',
    summary: 'List Geofence Boundaries',
    description: 'Mengambil koordinat batas geofence polygon dan circle.',
    requiredScope: 'geofences:read',
  },
  {
    id: 'get_alerts',
    category: 'ALERTS',
    method: 'GET',
    path: '/api/v1/alerts',
    summary: 'List Telematics Alerts',
    description: 'Melihat histori peringatan overspeed, idle, geofence, dan BBM.',
    requiredScope: 'alerts:read',
    defaultQueryParams: { severity: 'critical' },
  },
  {
    id: 'create_report_job',
    category: 'ASYNC_REPORTS',
    method: 'POST',
    path: '/api/v1/reports',
    summary: 'Create Async Telematics Report',
    description: 'Memicu background job pembuatan laporan PDF/CSV/XLSX volume besar.',
    requiredScope: 'reports:write',
    defaultBody: {
      reportType: 'fleet',
      format: 'PDF',
      dateFrom: '2026-08-01',
      dateTo: '2026-08-18',
    },
  },
  {
    id: 'ai_fuel_analyze',
    category: 'AI_INTELLIGENCE',
    method: 'POST',
    path: '/api/v1/ai/fuel/analyze',
    summary: 'AI Fuel Efficiency & Drain Analysis',
    description: 'Analisis kurva konsumsi BBM berbasis probabilitas telemetri.',
    requiredScope: 'ai:read',
    defaultBody: {
      vehicleId: 'veh_01',
      dateFrom: '2026-08-15',
    },
  },
  {
    id: 'ai_assistant_query',
    category: 'AI_INTELLIGENCE',
    method: 'POST',
    path: '/api/v1/ai/assistant',
    summary: 'AI Natural Language Assistant API',
    description: 'Tanya jawab telemetri armada real-time berbasis tools permission.',
    requiredScope: 'ai:execute',
    defaultBody: {
      message: 'Berapa kendaraan yang saat ini sedang moving dan ada insiden alert kritis?',
    },
  },
];

export const ApiExplorerTab: React.FC<ApiExplorerTabProps> = ({ apiKeys }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition>(ENDPOINTS_CATALOG[0]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>(apiKeys[0]?.id || '');
  const [pathParams, setPathParams] = useState<Record<string, string>>(selectedEndpoint.defaultPathParams || {});
  const [queryParams, setQueryParams] = useState<Record<string, string>>(selectedEndpoint.defaultQueryParams || {});
  const [requestBodyText, setRequestBodyText] = useState<string>(
    selectedEndpoint.defaultBody ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) : ''
  );

  // Response state
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<{
    status: number;
    latencyMs: number;
    headers: Record<string, string>;
    body: any;
  } | null>(null);

  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleSelectEndpoint = (ep: EndpointDefinition) => {
    setSelectedEndpoint(ep);
    setPathParams(ep.defaultPathParams || {});
    setQueryParams(ep.defaultQueryParams || {});
    setRequestBodyText(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseResult(null);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    // Construct path with path params
    let finalPath = selectedEndpoint.path;
    Object.entries(pathParams).forEach(([k, v]) => {
      finalPath = finalPath.replace(`:${k}`, v);
    });

    const activeKey = apiKeys.find(k => k.id === selectedKeyId) || apiKeys[0];

    try {
      // Mock execution through ExternalAPIService gateway
      const auth = await externalApiService.authenticateAndAuthorize({
        rawKey: activeKey ? activeKey.maskedKey.replace(/•+/g, 'secret123') : 'flt_live_demo',
        requiredScope: selectedEndpoint.requiredScope as any,
        path: finalPath,
        method: selectedEndpoint.method,
      });

      let resData: any = null;
      let statusCode = 200;

      if (!auth.ok) {
        statusCode = auth.statusCode || 401;
        resData = auth.errorResponse;
      } else {
        const ctx = auth.context!;
        if (selectedEndpoint.id === 'get_vehicles') {
          resData = await externalApiService.getVehicles(ctx, queryParams);
        } else if (selectedEndpoint.id === 'get_vehicle_location') {
          resData = externalApiService.successResponse(
            await externalApiService.getVehicleLocation(ctx, pathParams.id || 'veh_01'),
            ctx
          );
        } else if (selectedEndpoint.id === 'get_vehicle_telemetry') {
          resData = externalApiService.successResponse(
            await externalApiService.getVehicleTelemetry(ctx, pathParams.id || 'veh_01'),
            ctx
          );
        } else if (selectedEndpoint.id === 'create_vehicle') {
          let parsedBody = {};
          try { parsedBody = JSON.parse(requestBodyText); } catch (e) {}
          const created = await externalApiService.createVehicle(ctx, parsedBody);
          resData = externalApiService.successResponse(created.data, ctx);
          statusCode = 201;
        } else if (selectedEndpoint.id === 'get_drivers') {
          resData = await externalApiService.getDrivers(ctx, queryParams);
        } else if (selectedEndpoint.id === 'get_gps_devices') {
          resData = await externalApiService.getGpsDevices(ctx);
        } else if (selectedEndpoint.id === 'send_gps_command') {
          let parsedBody: any = {};
          try { parsedBody = JSON.parse(requestBodyText); } catch (e) {}
          resData = externalApiService.successResponse(
            await externalApiService.sendGpsCommand(ctx, pathParams.id || 'dev_01', parsedBody),
            ctx
          );
        } else if (selectedEndpoint.id === 'get_trips') {
          resData = await externalApiService.getTrips(ctx);
        } else if (selectedEndpoint.id === 'get_geofences') {
          resData = await externalApiService.getGeofences(ctx);
        } else if (selectedEndpoint.id === 'get_alerts') {
          resData = await externalApiService.getAlerts(ctx, queryParams);
        } else if (selectedEndpoint.id === 'create_report_job') {
          let parsedBody: any = {};
          try { parsedBody = JSON.parse(requestBodyText); } catch (e) {}
          resData = externalApiService.successResponse(
            await externalApiService.createReportJob(ctx, parsedBody),
            ctx
          );
          statusCode = 202;
        } else if (selectedEndpoint.id === 'ai_fuel_analyze') {
          resData = externalApiService.successResponse(
            await externalApiService.analyzeFuel(ctx, {}),
            ctx
          );
        } else if (selectedEndpoint.id === 'ai_assistant_query') {
          let parsedBody: any = {};
          try { parsedBody = JSON.parse(requestBodyText); } catch (e) {}
          resData = externalApiService.successResponse(
            await externalApiService.askAssistant(ctx, parsedBody.message || 'Status armada'),
            ctx
          );
        }
      }

      const latencyMs = Math.max(12, Math.round(performance.now() - startTime));
      setResponseResult({
        status: statusCode,
        latencyMs,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-request-id': resData?.meta?.requestId || `req_${Date.now().toString(36)}`,
          'x-ratelimit-limit': '500',
          'x-ratelimit-remaining': '498',
          'x-ratelimit-reset': '52',
        },
        body: resData,
      });
    } catch (err: any) {
      setResponseResult({
        status: 500,
        latencyMs: Math.round(performance.now() - startTime),
        headers: { 'content-type': 'application/json' },
        body: { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!responseResult) return;
    navigator.clipboard.writeText(JSON.stringify(responseResult.body, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar: Endpoint Catalog */}
      <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Katalog Endpoint v1</span>
          </span>
          <span className="text-[10px] text-slate-400">{ENDPOINTS_CATALOG.length} API Routes</span>
        </div>

        <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
          {ENDPOINTS_CATALOG.map(ep => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ep.method === 'POST'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : ep.method === 'PATCH'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">{ep.summary}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate">{ep.path}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area: Interactive Tester & Live Response */}
      <div className="lg:col-span-8 space-y-6">
        {/* Endpoint Detail & Config Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedEndpoint.method === 'POST'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-bold text-white">{selectedEndpoint.summary}</span>
              </div>
              <p className="text-xs text-slate-400">{selectedEndpoint.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Scope:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-cyan-300 font-mono">
                {selectedEndpoint.requiredScope}
              </span>
            </div>
          </div>

          {/* Key Selector & Request Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gunakan Kredensial Key</label>
              <select
                value={selectedKeyId}
                onChange={e => setSelectedKeyId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {apiKeys.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.environment})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-8 flex items-end">
              <div className="flex items-center w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                <span className="px-3 py-2 text-cyan-400 bg-slate-900 border-r border-slate-800 select-none">
                  {selectedEndpoint.method}
                </span>
                <input
                  type="text"
                  readOnly
                  value={selectedEndpoint.path}
                  className="flex-1 px-3 py-2 bg-transparent text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Mengirim...' : 'Kirim Request'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Path Params Editor (if any) */}
          {selectedEndpoint.defaultPathParams && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">Path Parameters</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(selectedEndpoint.defaultPathParams).map(paramKey => (
                  <div key={paramKey} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400">:{paramKey}</span>
                    <input
                      type="text"
                      value={pathParams[paramKey] || ''}
                      onChange={e => setPathParams({ ...pathParams, [paramKey]: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Params Editor (if any) */}
          {selectedEndpoint.defaultQueryParams && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">Query Parameters</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.keys(selectedEndpoint.defaultQueryParams).map(qKey => (
                  <div key={qKey} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{qKey}=</span>
                    <input
                      type="text"
                      value={queryParams[qKey] || ''}
                      onChange={e => setQueryParams({ ...queryParams, [qKey]: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body Editor (for POST/PATCH) */}
          {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PATCH') && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-300">Request Body (JSON)</label>
              <textarea
                rows={5}
                value={requestBodyText}
                onChange={e => setRequestBodyText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Live Response Card */}
        {responseResult && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">HTTP Response</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    responseResult.status >= 200 && responseResult.status < 300
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {responseResult.status} {responseResult.status === 200 ? 'OK' : responseResult.status === 201 ? 'CREATED' : responseResult.status === 202 ? 'ACCEPTED' : 'ERROR'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Latency: <strong className="text-cyan-400">{responseResult.latencyMs}ms</strong>
                </span>
              </div>

              <button
                onClick={handleCopyResponse}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResponse ? 'Disalin!' : 'Salin JSON'}</span>
              </button>
            </div>

            {/* Response Headers */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              {Object.entries(responseResult.headers).map(([k, v]) => (
                <div key={k}>
                  <span className="text-cyan-400">{k}:</span> {v}
                </div>
              ))}
            </div>

            {/* Response Body */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
              <pre className="p-4 text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
                <code>{JSON.stringify(responseResult.body, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
