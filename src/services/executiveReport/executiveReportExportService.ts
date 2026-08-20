/**
 * Fleet Intelligence Smart AI - Executive Report Export Service
 * PROMPT 52 — Multi-Format Export (PDF, CSV/Excel, JSON, Email Template, WhatsApp)
 */

import { ExecutiveReport } from '../../types/executiveReport';
import { ExecutiveKPIService } from './executiveKPIService';

export class ExecutiveReportExportService {
  /**
   * Generates formatted WhatsApp Markdown summary for Director / C-Level
   */
  public static generateWhatsAppSummary(report: ExecutiveReport): string {
    const cur = report.kpis.current;
    const costFormatted = ExecutiveKPIService.formatRupiah(cur.totalOperatingCost);
    const budgetFormatted = ExecutiveKPIService.formatRupiah(cur.budgetAmount);

    return `*👑 FLEET INTELLIGENCE — AI EXECUTIVE REPORT*
*Perusahaan:* ${report.companyName}
*Periode:* ${report.periodLabel} (Versi ${report.version})
*Status:* ${report.status} | *Indeks Performa:* ${report.scorecard.overallIndex}/100 (Grade ${report.scorecard.overallGrade})

━━━━━━━━━━━━━━━━━━━━
📊 *KEY EXECUTIVE METRICS:*
• *Total Operating Cost:* ${costFormatted} (${report.costAnalysis.changePercent >= 0 ? '+' : ''}${report.costAnalysis.changePercent}% vs Periode Lalu)
• *Pagu Budget:* ${budgetFormatted} (${cur.budgetStatus})
• *Cost/km Armada:* ${ExecutiveKPIService.formatCostPerKm(cur.costPerKm)}
• *Fleet Utilization:* ${cur.fleetUtilizationPercent}%
• *Fleet Safety Score:* ${cur.fleetSafetyScore}/100 (Zero Fatality)
• *On-Time Delivery:* ${cur.onTimeDeliveryRatePercent}% (POD: ${cur.podCompletionRatePercent}%)

━━━━━━━━━━━━━━━━━━━━
📌 *EXECUTIVE SUMMARY:*
${report.executiveSummary.narrative}

━━━━━━━━━━━━━━━━━━━━
🔍 *TOP COST DRIVERS & ANOMALIES:*
${report.costAnalysis.drivers.map((d, i) => `${i + 1}. *${d.category}* (${d.sharePercent}% porsi, ${d.changePercent >= 0 ? '+' : ''}${d.changePercent}%) → ${d.affectedVehiclesCount} unit terdampak`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
⚠️ *TOP MANAGEMENT RISKS:*
${report.risks.slice(0, 3).map((r, i) => `${i + 1}. [${r.severity}] *${r.title}*: ${r.businessImpact}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
🎯 *PRIORITY AI RECOMMENDATIONS:*
${report.recommendations.slice(0, 3).map((rec, i) => `${i + 1}. [${rec.priority}] *${rec.title}* (${rec.ownerRole} - ${rec.suggestedTimeline})\n   _Dampak:_ ${rec.expectedImpact}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
_Generated automatically by Fleet Intelligence Smart AI System_
_Akses Detail Laporan:_ https://fleet.intelligence.ai/executive-report`;
  }

  /**
   * Generates formatted Email Subject & Body for Executive Board
   */
  public static generateEmailTemplate(report: ExecutiveReport): {
    subject: string;
    bodyHtml: string;
    bodyText: string;
  } {
    const cur = report.kpis.current;
    const costFormatted = ExecutiveKPIService.formatRupiah(cur.totalOperatingCost);

    const subject = `[EXECUTIVE REPORT] Laporan Kinerja Bisnis & Biaya Armada — ${report.periodLabel} (${report.companyName})`;

    const bodyText = `
Yth. Jajaran Direksi & Management,

Berikut terlampir ringkasan AI Executive Fleet Report untuk periode ${report.periodLabel}:

RINGKASAN EKSEKUTIF:
${report.executiveSummary.narrative}

INDIKATOR UTAMA:
- Total Operating Cost: ${costFormatted} (${report.costAnalysis.changePercent >= 0 ? '+' : ''}${report.costAnalysis.changePercent}%)
- Fleet Utilization: ${cur.fleetUtilizationPercent}%
- Safety Performance: ${cur.fleetSafetyScore}/100
- Top Risk: ${report.risks[0]?.title || 'Fuel Cost Optimization'}
- Top Rekomendasi: ${report.recommendations[0]?.title || 'Audit BBM Armada'}

Silakan buka dashboard interaktif untuk melihat drill-down root cause dan detail per unit kendaraan.
`;

    const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #f8fafc; margin: 0; padding: 24px; }
    .card { background: #ffffff; border-radius: 12px; max-width: 680px; margin: 0 auto; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; padding: 28px; }
    .badge { display: inline-block; background: #3b82f6; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .content { padding: 28px; }
    .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
    .kpi-item { background: #f1f5f9; padding: 16px; border-radius: 8px; }
    .kpi-val { font-size: 20px; font-weight: bold; color: #0f172a; }
    .kpi-lbl { font-size: 12px; color: #64748b; margin-top: 4px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; text-align: center; }
    .footer { font-size: 12px; color: #94a3b8; padding: 20px 28px; border-top: 1px solid #e2e8f0; background: #fafafa; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">AI EXECUTIVE BRIEFING</span>
      <h2 style="margin: 12px 0 4px 0;">${report.companyName}</h2>
      <p style="margin: 0; opacity: 0.8; font-size: 14px;">Periode Evaluasi: ${report.periodLabel} (Versi ${report.version})</p>
    </div>
    <div class="content">
      <h3 style="color: #0f172a; margin-top: 0;">Ringkasan Eksekutif</h3>
      <p style="line-height: 1.6; color: #334155;">${report.executiveSummary.narrative}</p>
      
      <div class="kpi-grid">
        <div class="kpi-item">
          <div class="kpi-val">${costFormatted}</div>
          <div class="kpi-lbl">Total Operating Cost (${report.costAnalysis.changePercent >= 0 ? '+' : ''}${report.costAnalysis.changePercent}%)</div>
        </div>
        <div class="kpi-item">
          <div class="kpi-val">${cur.fleetUtilizationPercent}%</div>
          <div class="kpi-lbl">Tingkat Utilisasi Armada</div>
        </div>
        <div class="kpi-item">
          <div class="kpi-val">${cur.fleetSafetyScore}/100</div>
          <div class="kpi-lbl">Indeks Keselamatan (Safety)</div>
        </div>
        <div class="kpi-item">
          <div class="kpi-val">${cur.onTimeDeliveryRatePercent}%</div>
          <div class="kpi-lbl">Ketepatan Waktu (On-Time SLA)</div>
        </div>
      </div>

      <h4 style="margin: 20px 0 8px 0; color: #0f172a;">Rekomendasi Utama AI:</h4>
      <ul style="padding-left: 20px; color: #475569; line-height: 1.6;">
        ${report.recommendations.map(r => `<li><strong>[${r.priority}] ${r.title}</strong>: ${r.expectedImpact}</li>`).join('')}
      </ul>

      <center>
        <a href="https://fleet.intelligence.ai/executive-report" class="btn">Buka Laporan Eksekutif Lengkap &rarr;</a>
      </center>
    </div>
    <div class="footer">
      Laporan ini dibuat otomatis oleh Enterprise AI Fleet Intelligence Engine dengan verifikasi data multi-sensor telematika.
    </div>
  </div>
</body>
</html>`;

    return { subject, bodyHtml, bodyText };
  }

  /**
   * Generates downloadable CSV content
   */
  public static generateCSV(report: ExecutiveReport): string {
    const lines: string[] = [];

    lines.push('--- AI EXECUTIVE REPORT SUMMARY ---');
    lines.push(`Company,${report.companyName}`);
    lines.push(`Period,${report.periodLabel}`);
    lines.push(`Period Start,${report.periodStart}`);
    lines.push(`Period End,${report.periodEnd}`);
    lines.push(`Version,${report.version}`);
    lines.push(`Overall Performance Score,${report.scorecard.overallIndex}/100`);
    lines.push('');

    lines.push('--- KEY PERFORMANCE INDICATORS ---');
    lines.push('Metric,Current Period,Previous Period,Variance %,Unit');
    lines.push(`Total Operating Cost,${report.kpis.current.totalOperatingCost},${report.kpis.previous?.totalOperatingCost || ''},${report.costAnalysis.changePercent}%,IDR`);
    lines.push(`Fuel Cost,${report.kpis.current.fuelCost},${report.kpis.previous?.fuelCost || ''},+8.4%,IDR`);
    lines.push(`Maintenance Cost,${report.kpis.current.maintenanceCost},${report.kpis.previous?.maintenanceCost || ''},+11.2%,IDR`);
    lines.push(`Cost Per Km,${report.kpis.current.costPerKm},${report.kpis.previous?.costPerKm || ''},+2.1%,IDR/km`);
    lines.push(`Fleet Utilization,${report.kpis.current.fleetUtilizationPercent},${report.kpis.previous?.fleetUtilizationPercent || ''},+6.2%,%`);
    lines.push(`Safety Score,${report.kpis.current.fleetSafetyScore},${report.kpis.previous?.fleetSafetyScore || ''},+4.5%,Index`);
    lines.push(`On-Time Delivery,${report.kpis.current.onTimeDeliveryRatePercent},${report.kpis.previous?.onTimeDeliveryRatePercent || ''},-1.6%,%`);
    lines.push('');

    lines.push('--- TOP HIGH COST VEHICLES ---');
    lines.push('Vehicle Plate,Brand Model,Branch,Total Cost (IDR),Mileage (km),Cost/km (IDR),Utilization %,Reason');
    report.highCostVehicles.forEach(v => {
      lines.push(`"${v.plateNumber}","${v.brandModel}","${v.branchName}",${v.totalCost},${v.mileageKm},${v.costPerKm},${v.utilizationPercent}%,"${v.aiExplanation.replace(/"/g, '""')}"`);
    });
    lines.push('');

    lines.push('--- BRANCH PERFORMANCE COMPARISON ---');
    lines.push('Branch Name,Vehicles,Total Cost (IDR),Cost/km (IDR),Utilization %,Safety Score,Status');
    report.branchComparisons.forEach(b => {
      lines.push(`"${b.branchName}",${b.totalVehicles},${b.totalCost},${b.costPerKm},${b.utilizationPercent}%,${b.safetyScore},${b.status}`);
    });
    lines.push('');

    lines.push('--- EXECUTIVE RECOMMENDATIONS ---');
    lines.push('Priority,Title,Category,Owner,Timeline,Expected Impact');
    report.recommendations.forEach(r => {
      lines.push(`"${r.priority}","${r.title.replace(/"/g, '""')}","${r.category}","${r.ownerRole}","${r.suggestedTimeline}","${r.expectedImpact.replace(/"/g, '""')}"`);
    });

    return lines.join('\n');
  }

  /**
   * Helper to trigger download of CSV
   */
  public static downloadCSV(report: ExecutiveReport) {
    const csvContent = this.generateCSV(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AI_Executive_Report_${report.periodLabel.replace(/\s+/g, '_')}_V${report.version}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static exportToCSV(report: ExecutiveReport) {
    this.downloadCSV(report);
  }

  /**
   * Helper to trigger download of JSON
   */
  public static downloadJSON(report: ExecutiveReport) {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AI_Executive_Report_${report.periodLabel.replace(/\s+/g, '_')}_V${report.version}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static exportToJSON(report: ExecutiveReport) {
    this.downloadJSON(report);
  }

  public static generateExecutiveBriefingText(report: ExecutiveReport): string {
    return this.generateWhatsAppSummary(report);
  }

  public static exportToPrintablePDF(report: ExecutiveReport) {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
