/**
 * Fleet Intelligence Smart AI - Daily Briefing Export & Notification Dispatch Service (PROMPT 51)
 * Multi-format export (PDF print sheet, CSV/Excel, JSON) and messaging integrations
 */

import { FleetDailyBriefing } from '../../types/dailyBriefing';

export class DailyBriefingExportService {
  /**
   * Export to CSV Format
   */
  public static exportToCsv(briefing: FleetDailyBriefing): void {
    const rows: string[][] = [
      ['AI FLEET DAILY BRIEFING REPORT', ''],
      ['Report ID', briefing.id],
      ['Date', briefing.reportDate],
      ['Tenant', briefing.tenantName],
      ['Generated At', briefing.generatedAt],
      ['Overall Fleet Health', `${briefing.fleetHealth.overallScore}/100 (${briefing.fleetHealth.grade})`],
      ['Fleet Risk Score', `${briefing.fleetRisk.riskScore}/100 (${briefing.fleetRisk.riskLevel})`],
      ['', ''],
      ['SECTION', 'METRIC', 'VALUE'],
      ['Fleet Status', 'Total Vehicles', String(briefing.fleetStatus.totalVehicles)],
      ['Fleet Status', 'Online', String(briefing.fleetStatus.online)],
      ['Fleet Status', 'Offline', String(briefing.fleetStatus.offline)],
      ['Fleet Status', 'Moving', String(briefing.fleetStatus.moving)],
      ['Fleet Status', 'Maintenance', String(briefing.fleetStatus.maintenance)],
      ['Fuel', 'Total Liters', String(briefing.fuelIntelligence.totalFuelLiters)],
      ['Fuel', 'Total Cost IDR', String(briefing.fuelIntelligence.totalFuelCostIdr)],
      ['Fuel', 'Avg KM/L', String(briefing.fuelIntelligence.avgConsumptionKmPerLiter)],
      ['Maintenance', 'Overdue Count', String(briefing.maintenanceOverview.overdueCount)],
      ['Maintenance', 'Critical Count', String(briefing.maintenanceOverview.criticalCount)],
      ['Driver', 'Avg Safety Score', `${briefing.driverOverview.avgSafetyScore}/100`],
      ['Driver', 'Overspeed Events', String(briefing.driverOverview.overspeedEventsTotal)],
      ['GPS Health', 'Health Rate %', `${briefing.gpsHealth.overallHealthPercent}%`],
      ['', ''],
      ['TOP PROBLEMS DETECTED', '', ''],
      ['Category', 'Severity', 'Title', 'Recommended Action'],
      ...briefing.problems.map(p => [p.category, p.severity, p.title, p.recommendedAction]),
      ['', ''],
      ['ACTIONABLE AI RECOMMENDATIONS', '', ''],
      ['Priority', 'Module', 'Title', 'Expected Impact'],
      ...briefing.recommendations.map(r => [r.priority, r.targetModule.toUpperCase(), r.title, r.expectedImpact]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fleet_Daily_Briefing_${briefing.reportDate}_${briefing.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export to Structured JSON
   */
  public static exportToJson(briefing: FleetDailyBriefing): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(briefing, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Fleet_Daily_Briefing_${briefing.reportDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Format WhatsApp message payload
   */
  public static formatWhatsAppMessage(briefing: FleetDailyBriefing): string {
    const text = `🚛 *AI FLEET DAILY BRIEFING* 📊
*Tanggal:* ${briefing.reportDate} | *Status:* ${briefing.status}
*Tenant:* ${briefing.tenantName}

🌟 *Skor Kesehatan Armada:* ${briefing.fleetHealth.overallScore}/100 (Grade ${briefing.fleetHealth.grade})
⚠️ *Indeks Risiko:* ${briefing.fleetRisk.riskScore}/100 [${briefing.fleetRisk.riskLevel}]

📋 *Ringkasan Operasional:*
• Unit Aktif: ${briefing.fleetStatus.online}/${briefing.fleetStatus.totalVehicles} unit (${briefing.fleetStatus.moving} bergerak)
• BBM Kemarin: ${briefing.fuelIntelligence.totalFuelLiters} L (Rp ${briefing.fuelIntelligence.totalFuelCostIdr.toLocaleString('id-ID')})
• Servis Mendesak: ${briefing.maintenanceOverview.criticalCount} unit
• Rata-rata Safety Driver: ${briefing.driverOverview.avgSafetyScore}/100
• GPS Health: ${briefing.gpsHealth.overallHealthPercent}%

🚨 *Top Masalah Terdeteksi:*
${briefing.problems.slice(0, 3).map((p, i) => `${i + 1}. [${p.severity}] ${p.title}`).join('\n')}

💡 *Rekomendasi AI Prioritas Utama:*
${briefing.recommendations.slice(0, 2).map((r, i) => `👉 *${r.title}* (${r.priority})\n   _${r.suggestedAction}_`).join('\n\n')}

🔗 *Akses Dashboard Lengkap:*
https://fleet-intelligence.id/briefing/${briefing.id}`;

    return text;
  }

  /**
   * Copy WhatsApp message to clipboard
   */
  public static async copyWhatsAppSummary(briefing: FleetDailyBriefing): Promise<boolean> {
    try {
      const text = this.formatWhatsAppMessage(briefing);
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Trigger Printable Executive PDF View
   */
  public static printExecutiveReport(): void {
    window.print();
  }
}
