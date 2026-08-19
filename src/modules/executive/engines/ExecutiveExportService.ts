/**
 * Fleet Intelligence Smart AI - Executive Export Service
 * Supports PDF generation, formatted CSV data dumps, and Excel workbook layouts
 */

import { ExecutiveReportData } from '../types';

export class ExecutiveExportService {
  /**
   * Export executive summary data to CSV
   */
  public static exportToCSV(data: ExecutiveReportData): void {
    const lines: string[] = [];

    // Header info
    lines.push(`"FLEET INTELLIGENCE - EXECUTIVE DASHBOARD REPORT"`);
    lines.push(`"Perusahaan","${data.companyName}"`);
    lines.push(`"Periode","${data.periodLabel}"`);
    lines.push(`"Tanggal Dibuat","${data.generatedAt}"`);
    lines.push(`"Pembuat Laporan","${data.generatedBy}"`);
    lines.push(`"Skor Eksekutif Keseluruhan","${data.overallScore.overallScore}/100 (${data.overallScore.status})"`);
    lines.push('');

    // Executive KPIs
    lines.push(`"EXECUTIVE KEY PERFORMANCE INDICATORS"`);
    lines.push(`"Indikator","Nilai Saat Ini","Periode Sebelumnya","Perubahan (%)","Status"`);
    data.kpis.forEach((kpi) => {
      lines.push(`"${kpi.title}","${kpi.displayValue}","${kpi.previousDisplayValue}","${kpi.percentageChange}%","${kpi.status}"`);
    });
    lines.push('');

    // Branch Performance
    lines.push(`"PERFORMA CABANG & DEPO"`);
    lines.push(`"Peringkat","Cabang","Jumlah Unit","Utilisasi (%)","Cost/KM (Rp)","Skor Produktivitas","Skor Safety","BBM (KM/L)","Skor Total"`);
    data.branches.forEach((b) => {
      lines.push(`"${b.rank}","${b.branchName}","${b.fleetCount}","${b.utilizationPct}%","Rp ${b.costPerKmIdr.toLocaleString('id-ID')}","${b.productivityScore}","${b.safetyScore}","${b.fuelEfficiencyKmL}","${b.overallScore}"`);
    });
    lines.push('');

    // High Risk Vehicles
    lines.push(`"KENDARAAN BUTUH PERHATIAN KHUSUS"`);
    lines.push(`"No. Polisi","Tipe Unit","Cabang","Skor Risiko","Cost/KM","Downtime (Jam)","Prioritas","Alasan","Tindakan Rekomendasi"`);
    data.highRiskVehicles.forEach((v) => {
      lines.push(`"${v.plateNumber}","${v.model}","${v.branchName}","${v.compositeRiskScore}","Rp ${v.costPerKm.toLocaleString('id-ID')}","${v.downtimeHours}","${v.priority}","${v.reason}","${v.recommendedAction}"`);
    });
    lines.push('');

    // AI Key Insights
    lines.push(`"AI EXECUTIVE INSIGHTS & REKOMENDASI"`);
    lines.push(`"Kategori","Prioritas","Judul Insight","Dampak Finansial (Rp)","Tingkat Keyakinan (%)","Rekomendasi AI"`);
    data.insights.forEach((ins) => {
      lines.push(`"${ins.category}","${ins.priority}","${ins.title}","${ins.estimatedFinancialImpactIdr ? 'Rp ' + ins.estimatedFinancialImpactIdr.toLocaleString('id-ID') : '-'}","${ins.confidencePct}%","${ins.recommendedAction}"`);
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Executive_Report_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export to Excel formatted HTML spreadsheet
   */
  public static exportToExcel(data: ExecutiveReportData): void {
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Executive Summary</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          .header { background-color: #0f172a; color: #ffffff; font-size: 14pt; font-weight: bold; padding: 10px; }
          .subhead { background-color: #1e293b; color: #94a3b8; font-weight: bold; }
          .title { background-color: #334155; color: #ffffff; font-weight: bold; }
          .data { padding: 5px; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="7" class="header">FLEET INTELLIGENCE EXECUTIVE DASHBOARD REPORT</td></tr>
          <tr><td colspan="2" class="bold">Perusahaan:</td><td colspan="5">${data.companyName}</td></tr>
          <tr><td colspan="2" class="bold">Periode:</td><td colspan="5">${data.periodLabel}</td></tr>
          <tr><td colspan="2" class="bold">Tanggal Generate:</td><td colspan="5">${data.generatedAt}</td></tr>
          <tr><td colspan="2" class="bold">Skor Eksekutif:</td><td colspan="5">${data.overallScore.overallScore}/100 (${data.overallScore.status})</td></tr>
          <tr><td colspan="7"></td></tr>
          <tr><td colspan="7" class="title">EXECUTIVE KPIS</td></tr>
          <tr class="subhead">
            <td>Indikator</td><td>Nilai Saat Ini</td><td>Periode Sebelumnya</td><td>Perubahan</td><td>Status</td><td colspan="2">Catatan</td>
          </tr>
          ${data.kpis
            .map(
              (k) => `
            <tr>
              <td class="bold">${k.title}</td>
              <td>${k.displayValue}</td>
              <td>${k.previousDisplayValue}</td>
              <td>${k.percentageChange}%</td>
              <td>${k.status}</td>
              <td colspan="2">${k.subtitle}</td>
            </tr>`
            )
            .join('')}
          <tr><td colspan="7"></td></tr>
          <tr><td colspan="7" class="title">PERFORMA CABANG & DEPO</td></tr>
          <tr class="subhead">
            <td>Rank</td><td>Cabang</td><td>Jumlah Unit</td><td>Utilisasi</td><td>Cost/KM</td><td>Skor Safety</td><td>Overall Score</td>
          </tr>
          ${data.branches
            .map(
              (b) => `
            <tr>
              <td>${b.rank}</td>
              <td class="bold">${b.branchName}</td>
              <td>${b.fleetCount}</td>
              <td>${b.utilizationPct}%</td>
              <td>Rp ${b.costPerKmIdr.toLocaleString('id-ID')}</td>
              <td>${b.safetyScore}</td>
              <td class="bold">${b.overallScore}</td>
            </tr>`
            )
            .join('')}
          <tr><td colspan="7"></td></tr>
          <tr><td colspan="7" class="title">POTENSI PENGHEMATAN BIAYA (SAVING OPPORTUNITIES)</td></tr>
          <tr class="subhead">
            <td colspan="2">Inisiatif Efisiensi</td><td colspan="2">Estimasi Penghematan/Bulan</td><td colspan="3">Metode Perhitungan</td>
          </tr>
          ${data.savingOpportunities
            .map(
              (s) => `
            <tr>
              <td colspan="2" class="bold">${s.title}</td>
              <td colspan="2" style="color: #059669; font-weight: bold;">Rp ${s.estimatedMonthlySavingIdr.toLocaleString('id-ID')}</td>
              <td colspan="3">${s.calculationMethod}</td>
            </tr>`
            )
            .join('')}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Executive_Report_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
