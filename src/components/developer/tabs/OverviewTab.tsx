import React, { useState } from 'react';
import {
  Code2,
  KeyRound,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  Server,
  Activity,
} from 'lucide-react';
import { APIKeyRecord } from '../../../types/externalApi';

interface OverviewTabProps {
  apiKeys: APIKeyRecord[];
  onNavigateTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ apiKeys, onNavigateTab }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'nodejs' | 'python' | 'go'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeKey = apiKeys.find(k => k.status === 'ACTIVE' && k.environment === 'PRODUCTION') || apiKeys[0];
  const sampleKey = activeKey ? activeKey.maskedKey : 'flt_live_your_api_key_here';

  const codeSnippets = {
    curl: `# 1. Ambil Data Real-time Lokasi Armada
curl -X GET "https://api.fleetintelligence.ai/api/v1/vehicles" \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Accept: application/json"

# 2. Kirim Analisis Prediktif AI BBM
curl -X POST "https://api.fleetintelligence.ai/api/v1/ai/fuel/analyze" \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"vehicleId": "veh_01"}'`,

    nodejs: `import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.fleetintelligence.ai/api/v1',
  headers: {
    'X-API-Key': '${sampleKey}',
    'Content-Type': 'application/json',
  },
});

async function getLiveFleet() {
  try {
    const { data } = await client.get('/vehicles', {
      params: { status: 'moving', limit: 20 }
    });
    console.log(\`Armada Bergerak: \${data.data.length} unit\`, data.data);
  } catch (error) {
    console.error('API Error:', error.response?.data);
  }
}

getLiveFleet();`,

    python: `import requests

API_KEY = "${sampleKey}"
BASE_URL = "https://api.fleetintelligence.ai/api/v1"

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

# Ambil telemetri kendaraan & CAN-bus
response = requests.get(f"{BASE_URL}/vehicles/veh_01/telemetry", headers=headers)
if response.status_code == 200:
    telemetry = response.json().get("data", {})
    print(f"BBM: {telemetry.get('fuelLevelLiters')} L, Speed: {telemetry.get('speed')} km/h")
else:
    print("Error:", response.json())`,

    go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("GET", "https://api.fleetintelligence.ai/api/v1/vehicles", nil)
	req.Header.Set("X-API-Key", "${sampleKey}")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println("Fleet Data:", string(body))
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Architecture Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROMPT 44 • External API Gateway & Developer Platform v1</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Integration Gateway
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrasikan armada telematika, live tracking GPS, insiden alert, dan AI Intelligence
              ke sistem ERP (SAP, Oracle, Odoo), TMS, WMS, HRIS, dan Mobile Apps melalui REST API standar & Webhooks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('api_explorer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka API Explorer (Swagger)</span>
            </button>
            <button
              onClick={() => onNavigateTab('api_keys')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Kelola API Keys</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 text-cyan-400 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant Isolation</span>
            </div>
            <p className="text-slate-400 text-xs">
              Isolasi data ketat berbasis Tenant Context Resolver & token API.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-xs mb-1">
              <Zap className="w-4 h-4" />
              <span>Unified Telematics</span>
            </div>
            <p className="text-slate-400 text-xs">
              Akses vendor-agnostic format terstandarisasi dari layer PROMPT 43.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs mb-1">
              <Globe className="w-4 h-4" />
              <span>HMAC Signed Webhooks</span>
            </div>
            <p className="text-slate-400 text-xs">
              Event stream realtime dengan HMAC SHA-256 signature & auto-retry.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 text-purple-400 font-semibold text-xs mb-1">
              <Activity className="w-4 h-4" />
              <span>Async Report Queue</span>
            </div>
            <p className="text-slate-400 text-xs">
              Export PDF/CSV/XLSX volume besar via non-blocking job queue.
            </p>
          </div>
        </div>
      </div>

      {/* Quickstart Code Generator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Quickstart Integration Snippet</span>
            </h3>
            <p className="text-slate-400 text-xs">
              Contoh request siap pakai ke endpoint Gateway <code className="text-cyan-300">/api/v1</code>
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(['curl', 'nodejs', 'python', 'go'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedLanguage === lang
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
            <span className="text-slate-400 text-xs">
              Base URL: <span className="text-cyan-400">https://api.fleetintelligence.ai/api/v1</span>
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Disalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed">
            <code>{codeSnippets[selectedLanguage]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
