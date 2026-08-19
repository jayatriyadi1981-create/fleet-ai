/**
 * Fleet Intelligence Smart AI - Command Center AI Reasoning & Copilot Assistant
 * Handles contextual AI prompts, fleet risk summaries, cross-module correlations, and voice/chat queries
 */

import { commandCenterService } from './commandCenterService';
import { liveTrackingService } from '../../maps/services/liveTrackingService';
import { mockTenant } from '../../../constants/mockData';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionRecommendation?: {
    type: string;
    label: string;
    targetId?: string;
  };
}

class CommandCenterAIService {
  private chatHistory: AIChatMessage[] = [
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Halo Operator Command Center ${mockTenant.name}! Saya Fleet Intelligence AI Assistant siap membantu pemantauan darurat, audit telemetri, analisis anomali BBM, mitigasi fatigue, dan penugasan armada tercepat.`,
      timestamp: new Date().toISOString(),
    },
  ];

  public getChatHistory(): AIChatMessage[] {
    return [...this.chatHistory];
  }

  public async askAI(prompt: string): Promise<AIChatMessage> {
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
    };
    this.chatHistory.push(userMsg);

    // Build context
    const kpis = commandCenterService.getKPIs();
    const emergencies = commandCenterService.getEmergencies();
    const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE');
    const driverRisks = commandCenterService.getDriverRisks().slice(0, 3);
    const vehicleRisks = commandCenterService.getVehicleRisks().slice(0, 3);

    let replyText = '';
    let actionRecommendation = undefined;

    try {
      // Try server API first
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            tenantName: mockTenant.name,
            kpis,
            activeEmergenciesCount: activeEmergencies.length,
            topDriverRisks: driverRisks.map((d) => `${d.driverName} (Risk ${d.riskScore})`),
            topVehicleRisks: vehicleRisks.map((v) => `${v.plateNumber} (${v.title})`),
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          replyText = data.reply;
        }
      }
    } catch {
      // Network or API fallback
    }

    if (!replyText) {
      replyText = this.generateContextualFallback(prompt, kpis, activeEmergencies, driverRisks, vehicleRisks);
    }

    // Attach contextual action if emergency or dispatch mentioned
    if (prompt.toLowerCase().includes('darurat') || prompt.toLowerCase().includes('sos') || prompt.toLowerCase().includes('panic')) {
      if (activeEmergencies.length > 0) {
        actionRecommendation = {
          type: 'OPEN_EMERGENCY',
          label: `Buka Insiden Darurat ${activeEmergencies[0].plateNumber}`,
          targetId: activeEmergencies[0].id,
        };
      }
    } else if (prompt.toLowerCase().includes('dispatch') || prompt.toLowerCase().includes('terdekat') || prompt.toLowerCase().includes('bantuan')) {
      actionRecommendation = {
        type: 'OPEN_DISPATCH',
        label: 'Buka Smart Dispatch Finder',
      };
    }

    const aiMsg: AIChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toISOString(),
      actionRecommendation,
    };
    this.chatHistory.push(aiMsg);

    return aiMsg;
  }

  private generateContextualFallback(
    prompt: string,
    kpis: ReturnType<typeof commandCenterService.getKPIs>,
    activeEmergencies: ReturnType<typeof commandCenterService.getEmergencies>,
    driverRisks: ReturnType<typeof commandCenterService.getDriverRisks>,
    vehicleRisks: ReturnType<typeof commandCenterService.getVehicleRisks>
  ): string {
    const p = prompt.toLowerCase();

    if (p.includes('darurat') || p.includes('sos') || p.includes('panic') || p.includes('bahaya')) {
      if (activeEmergencies.length > 0) {
        const emg = activeEmergencies[0];
        return `🚨 Terdapat ${activeEmergencies.length} insiden darurat aktif:\n• Unit: ${emg.plateNumber} (Driver: ${emg.driverName})\n• Lokasi: ${emg.location.address || 'Tol Cikampek KM 28.5'}\n• Status: ${emg.status} | Eskalasi: ${emg.escalationTier}\n• Rekomendasi AI: Segera hubungi driver melalui telepon darurat atau kirim unit cadangan terdekat melalui Smart Dispatch.`;
      }
      return `✅ Status Aman: Tidak ada panggilan darurat (SOS / Panic) aktif saat ini di seluruh armada ${mockTenant.name}.`;
    }

    if (p.includes('offline') || p.includes('hilang sinyal') || p.includes('gps mati')) {
      return `📡 Status Telematika:\n• ${kpis.offline} kendaraan sedang dalam status Offline.\n• Unit B 9821 UTX belum mengirim heartbeat telemetri selama 2 jam terakhir.\n• Rekomendasi: Periksa kuota SIM Card IoT atau lakukan ping jarak jauh ke modul GPS JT808.`;
    }

    if (p.includes('driver') || p.includes('pengemudi') || p.includes('risiko') || p.includes('fatigue')) {
      const top = driverRisks[0];
      return `⚠️ Analisis Risiko Driver:\n• Driver paling berisiko: ${top.driverName} (Skor Risiko: ${top.riskScore}/100)\n• Faktor utama: ${top.primaryRisks.join(', ')}\n• Rekomendasi: Jadwalkan sesi coaching safety dan berikan peringatan istirahat jika berkendara > 4 jam kontinu.`;
    }

    if (p.includes('bbm') || p.includes('fuel') || p.includes('solar') || p.includes('boros')) {
      return `⛽ Ringkasan Konsumsi BBM Telematika:\n• Armada bergerak: ${kpis.moving} unit.\n• Terdeteksi anomali drop level solar 18L pada unit B 9211 TJP saat idle.\n• Rekomendasi AI: Periksa sensor flow meter dan fisik tangki Depo Cikarang.`;
    }

    return `📊 Ringkasan Live Command Center (${mockTenant.name}):\n• Total Armada: ${kpis.total} (Moving: ${kpis.moving}, Idle: ${kpis.idle}, Offline: ${kpis.offline})\n• Insiden Darurat: ${activeEmergencies.length} aktif\n• Unit dengan Risiko Tertinggi: ${vehicleRisks[0]?.plateNumber || 'Semua Normal'} (${vehicleRisks[0]?.title || 'Tidak ada issue'})\n\nSilakan tanyakan detail rute, dispatch terdekat, atau rekomendasi perbaikan!`;
  }
}

export const commandCenterAIService = new CommandCenterAIService();
