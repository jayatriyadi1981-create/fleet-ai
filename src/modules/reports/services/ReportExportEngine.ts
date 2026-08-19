/**
 * Fleet Intelligence Smart AI - Enterprise Report Export Engine
 * PROMPT 39 - High-fidelity PDF, Multi-Sheet Excel & CSV Exporter with Async Background Processing
 */

import { ReportDataset, ReportExportFormat, ReportBrandingSettings, GeneratedReport, ReportAuditLog } from '../types';

export class ReportExportEngine {
  /**
   * Export to CSV Format
   */
  public static exportToCSV(dataset: ReportDataset, branding?: Partial<ReportBrandingSettings>): string {
    const visibleCols = dataset.columns.filter(c => c.visible);
    const headers = visibleCols.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');

    const rows = dataset.rows.map(row => {
      return visibleCols.map(col => {
        let val = row[col.id];
        if (val === undefined || val === null) return '""';
        if (col.dataType === 'currency' && typeof val === 'number') {
          val = `Rp ${Math.round(val).toLocaleString('id-ID')}`;
        } else if (col.dataType === 'percentage' && typeof val === 'number') {
          val = `${val}%`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    // Summary Row if available
    let summaryRowStr = '';
    if (dataset.summaryRows && dataset.summaryRows.length > 0) {
      const summaryMap = new Map(dataset.summaryRows.map(s => [s.columnId, s.formatted]));
      const summaryCols = visibleCols.map((c, i) => {
        if (i === 0) return '"TOTAL / RATA-RATA"';
        const formatted = summaryMap.get(c.id);
        return formatted ? `"${formatted.replace(/"/g, '""')}"` : '""';
      }).join(',');
      summaryRowStr = `\n${summaryCols}`;
    }

    const csvContent = '\uFEFF' + [
      `"${branding?.companyName || 'FLEET INTELLIGENCE SMART AI - ENTERPRISE REPORT'}"`,
      `"Laporan: ${dataset.name.replace(/"/g, '""')}"`,
      `"Periode: ${dataset.periodLabel.replace(/"/g, '""')}"`,
      `"Waktu Cetak: ${new Date().toLocaleString('id-ID')}"`,
      `"Filter: ${dataset.filterSummary.replace(/"/g, '""')}"`,
      '',
      headers,
      ...rows,
      summaryRowStr,
    ].filter(Boolean).join('\n');

    return csvContent;
  }

  /**
   * Export to Multi-Sheet XML-based Excel Spreadsheet (.xls / .xlsx readable)
   */
  public static exportToExcelXML(dataset: ReportDataset, branding?: Partial<ReportBrandingSettings>): string {
    const visibleCols = dataset.columns.filter(c => c.visible);
    const company = branding?.companyName || 'PT Fleet Intelligence Indonesia Tbk';

    // Build Sheet 1: Summary KPI
    const kpiRows = dataset.kpis.map(k => `
      <Row>
        <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${k.label}</Data></Cell>
        <Cell ss:StyleID="HighlightCell"><Data ss:Type="String">${k.value}</Data></Cell>
        <Cell><Data ss:Type="String">${k.subtext || ''}</Data></Cell>
      </Row>
    `).join('');

    // Build Sheet 2: Data Records
    const headerCells = visibleCols.map(c => `
      <Cell ss:StyleID="HeaderCell"><Data ss:Type="String">${c.label}</Data></Cell>
    `).join('');

    const dataRows = dataset.rows.map(row => {
      const cells = visibleCols.map(col => {
        const val = row[col.id];
        if (val === undefined || val === null) {
          return '<Cell><Data ss:Type="String">-</Data></Cell>';
        }
        if (col.dataType === 'currency' && typeof val === 'number') {
          return `<Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${val}</Data></Cell>`;
        }
        if (typeof val === 'number') {
          return `<Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${val}</Data></Cell>`;
        }
        return `<Cell><Data ss:Type="String">${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>`;
      }).join('');
      return `<Row>${cells}</Row>`;
    }).join('');

    // Summary Row for Data Sheet
    let summaryRowXML = '';
    if (dataset.summaryRows && dataset.summaryRows.length > 0) {
      const sumMap = new Map(dataset.summaryRows.map(s => [s.columnId, s]));
      const sumCells = visibleCols.map((c, i) => {
        if (i === 0) return '<Cell ss:StyleID="SummaryTotal"><Data ss:Type="String">TOTAL / RATA-RATA</Data></Cell>';
        const s = sumMap.get(c.id);
        if (s) {
          if (c.dataType === 'currency') {
            return `<Cell ss:StyleID="SummaryCurrency"><Data ss:Type="Number">${s.value}</Data></Cell>`;
          }
          return `<Cell ss:StyleID="SummaryNumber"><Data ss:Type="String">${s.formatted}</Data></Cell>`;
        }
        return '<Cell ss:StyleID="SummaryTotal"><Data ss:Type="String"></Data></Cell>';
      }).join('');
      summaryRowXML = `<Row ss:StyleID="SummaryRow">${sumCells}</Row>`;
    }

    // Build Sheet 3: AI Insights & Audit
    const aiSummary = dataset.aiSummary;
    const aiRows = aiSummary ? `
      <Row><Cell ss:StyleID="HeaderCell"><Data ss:Type="String">KOMPONEN ANALISIS AI</Data></Cell><Cell ss:StyleID="HeaderCell"><Data ss:Type="String">TEMUAN &amp; REKOMENDASI</Data></Cell></Row>
      <Row><Cell ss:StyleID="BoldCell"><Data ss:Type="String">Executive Summary</Data></Cell><Cell><Data ss:Type="String">${(aiSummary.executiveSummary || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell></Row>
      <Row><Cell ss:StyleID="BoldCell"><Data ss:Type="String">Temuan Utama</Data></Cell><Cell><Data ss:Type="String">${(aiSummary.keyFindings || []).join('; ').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell></Row>
      <Row><Cell ss:StyleID="BoldCell"><Data ss:Type="String">Tren Positif</Data></Cell><Cell><Data ss:Type="String">${(aiSummary.positiveTrends || []).join('; ').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell></Row>
      <Row><Cell ss:StyleID="BoldCell"><Data ss:Type="String">Isu Kritis &amp; Risiko</Data></Cell><Cell><Data ss:Type="String">${(aiSummary.criticalIssues || []).join('; ').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell></Row>
      <Row><Cell ss:StyleID="BoldCell"><Data ss:Type="String">Estimasi Penghematan</Data></Cell><Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${aiSummary.costSavingEstimateIdr || 0}</Data></Cell></Row>
    ` : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:html="http://www.w3.org/TR/REC-html40">
      <Styles>
        <Style ss:ID="Default" ss:Name="Normal">
          <Alignment ss:Vertical="Center"/>
          <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1E293B"/>
        </Style>
        <Style ss:ID="TitleStyle">
          <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
        </Style>
        <Style ss:ID="SubtitleStyle">
          <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#64748B"/>
        </Style>
        <Style ss:ID="HeaderCell">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0284C7"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
          </Borders>
          <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
          <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="BoldCell">
          <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
        </Style>
        <Style ss:ID="HighlightCell">
          <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#0284C7"/>
        </Style>
        <Style ss:ID="CurrencyCell">
          <NumberFormat ss:Format="Rp\ #,##0"/>
          <Alignment ss:Horizontal="Right"/>
        </Style>
        <Style ss:ID="NumberCell">
          <NumberFormat ss:Format="#,##0"/>
          <Alignment ss:Horizontal="Right"/>
        </Style>
        <Style ss:ID="SummaryTotal">
          <Borders>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F172A"/>
            <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#0F172A"/>
          </Borders>
          <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
          <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="SummaryCurrency">
          <Borders>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F172A"/>
            <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#0F172A"/>
          </Borders>
          <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
          <NumberFormat ss:Format="Rp\ #,##0"/>
          <Alignment ss:Horizontal="Right"/>
          <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="SummaryNumber">
          <Borders>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F172A"/>
            <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#0F172A"/>
          </Borders>
          <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
          <Alignment ss:Horizontal="Right"/>
          <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
        </Style>
      </Styles>

      <!-- Sheet 1: Summary -->
      <Worksheet ss:Name="1. Executive Summary">
        <Table ss:DefaultColumnWidth="180">
          <Row ss:Height="28">
            <Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${company}</Data></Cell>
          </Row>
          <Row>
            <Cell ss:StyleID="BoldCell"><Data ss:Type="String">LAPORAN:</Data></Cell>
            <Cell><Data ss:Type="String">${dataset.name}</Data></Cell>
          </Row>
          <Row>
            <Cell ss:StyleID="BoldCell"><Data ss:Type="String">PERIODE:</Data></Cell>
            <Cell><Data ss:Type="String">${dataset.periodLabel}</Data></Cell>
          </Row>
          <Row>
            <Cell ss:StyleID="BoldCell"><Data ss:Type="String">FILTER:</Data></Cell>
            <Cell><Data ss:Type="String">${dataset.filterSummary}</Data></Cell>
          </Row>
          <Row>
            <Cell ss:StyleID="BoldCell"><Data ss:Type="String">WAKTU GENERATE:</Data></Cell>
            <Cell><Data ss:Type="String">${dataset.generatedAt}</Data></Cell>
          </Row>
          <Row></Row>
          <Row>
            <Cell ss:StyleID="HeaderCell"><Data ss:Type="String">METRIK KUNCI</Data></Cell>
            <Cell ss:StyleID="HeaderCell"><Data ss:Type="String">NILAI REALISASI</Data></Cell>
            <Cell ss:StyleID="HeaderCell"><Data ss:Type="String">KETERANGAN</Data></Cell>
          </Row>
          ${kpiRows}
        </Table>
      </Worksheet>

      <!-- Sheet 2: Detailed Data -->
      <Worksheet ss:Name="2. Data Transaksi">
        <Table ss:DefaultColumnWidth="140">
          <Row ss:Height="24">
            ${headerCells}
          </Row>
          ${dataRows}
          ${summaryRowXML}
        </Table>
      </Worksheet>

      ${aiSummary ? `
      <!-- Sheet 3: AI Intelligence -->
      <Worksheet ss:Name="3. AI Intelligence & Action">
        <Table ss:DefaultColumnWidth="220">
          ${aiRows}
        </Table>
      </Worksheet>
      ` : ''}
    </Workbook>`;
  }

  /**
   * Triggers client-side browser file download
   */
  public static triggerDownload(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Simulates async background report generation with progress tracking
   */
  public static simulateAsyncJob(
    dataset: ReportDataset,
    format: ReportExportFormat,
    userName: string,
    onProgress?: (pct: number) => void
  ): Promise<GeneratedReport> {
    return new Promise((resolve) => {
      const jobId = `JOB-${Date.now().toString(36).toUpperCase()}`;
      const token = `sig_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      let currentPct = 10;
      if (onProgress) onProgress(currentPct);

      const interval = setInterval(() => {
        currentPct += 30;
        if (currentPct >= 100) {
          clearInterval(interval);
          if (onProgress) onProgress(100);

          const sizeKb = Math.round(dataset.rows.length * 1.8 + 84);
          const fileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

          const result: GeneratedReport = {
            id: `GEN-${Date.now().toString(36)}`,
            jobId,
            tenantId: 'tenant-default',
            reportId: dataset.reportId,
            name: dataset.name,
            type: dataset.type,
            subType: dataset.subType,
            format,
            periodStart: '2026-08-01',
            periodEnd: '2026-08-17',
            filters: {
              periodPreset: 'THIS_MONTH',
              startDate: '2026-08-01',
              endDate: '2026-08-17',
            },
            status: 'COMPLETED',
            progressPct: 100,
            fileSize,
            downloadToken: token,
            downloadUrl: `#download-${jobId}`,
            expiresAt,
            generatedBy: 'usr-current',
            generatedByName: userName,
            generatedAt: new Date().toISOString(),
            recordsCount: dataset.rows.length,
          };

          resolve(result);
        } else {
          if (onProgress) onProgress(currentPct);
        }
      }, 250);
    });
  }

  /**
   * Creates an audit log entry
   */
  public static createAuditLog(
    dataset: ReportDataset,
    action: ReportAuditLog['action'],
    userName: string,
    format?: ReportExportFormat
  ): ReportAuditLog {
    return {
      id: `AUD-${Date.now().toString(36)}`,
      tenantId: 'tenant-default',
      userId: 'usr-current',
      userName,
      userEmail: 'executive@fleet-smart.ai',
      reportId: dataset.reportId,
      reportName: dataset.name,
      reportType: dataset.type,
      action,
      format,
      timestamp: new Date().toISOString(),
      ipAddress: '180.252.164.21',
      filterSummary: dataset.filterSummary,
      scope: 'COMPANY_WIDE',
      details: `${action} ${dataset.name} (${dataset.rows.length} rows) via ${format || 'PREVIEW'}`,
    };
  }
}
