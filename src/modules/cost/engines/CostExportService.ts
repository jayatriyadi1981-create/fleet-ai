/**
 * Fleet Intelligence Smart AI - Cost Export Service
 * PROMPT 37 - Multi-format Financial Statement & Cost Data Exporter
 */

import { CostRecord, CostBudgetVariance, FuelCostMetric, MaintenanceCostMetric } from '../types';

export class CostExportService {
  /**
   * Export Cost Records to CSV
   */
  public static exportToCsv(records: CostRecord[], filename: string = 'Cost_Records_Export') {
    const headers = [
      'ID',
      'Tanggal',
      'Kategori',
      'Tipe Biaya',
      'Jumlah (IDR)',
      'Plat Kendaraan',
      'Pengemudi',
      'Cabang',
      'Sumber Biaya',
      'Metode Alokasi',
      'Status Alokasi',
      'Status Approval',
      'Catatan',
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.date}"`,
      `"${r.category}"`,
      `"${r.type}"`,
      r.amount,
      `"${r.vehiclePlate || '-'}"`,
      `"${r.driverName || '-'}"`,
      `"${r.branchName || '-'}"`,
      `"${r.source}"`,
      `"${r.allocationMethod}"`,
      `"${r.allocationStatus}"`,
      `"${r.status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${filename}.csv`);
  }

  /**
   * Export to JSON
   */
  public static exportToJson(data: any, filename: string = 'Cost_Analytics_Data') {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    this.downloadBlob(blob, `${filename}.json`);
  }

  /**
   * Export to Excel (HTML table MIME)
   */
  public static exportToExcel(records: CostRecord[], filename: string = 'Laporan_Biaya_Operasional') {
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Laporan Biaya</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
        <h2>PT TRANS LOGISTIK NUSANTARA - LAPORAN BIAYA OPERASIONAL ARMADA</h2>
        <p>Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}</p>
        <table border="1">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th>ID</th>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Tipe</th>
              <th>Jumlah (IDR)</th>
              <th>Plat Kendaraan</th>
              <th>Pengemudi</th>
              <th>Cabang</th>
              <th>Sumber</th>
              <th>Status</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (r) => `
              <tr>
                <td>${r.id}</td>
                <td>${r.date}</td>
                <td>${r.category}</td>
                <td>${r.type}</td>
                <td>${r.amount}</td>
                <td>${r.vehiclePlate || '-'}</td>
                <td>${r.driverName || '-'}</td>
                <td>${r.branchName || '-'}</td>
                <td>${r.source}</td>
                <td>${r.status}</td>
                <td>${r.notes || '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    this.downloadBlob(blob, `${filename}.xls`);
  }

  /**
   * Print or PDF Preview
   */
  public static triggerPrintReport(title: string = 'Laporan Biaya Operasional Armada') {
    window.print();
  }

  private static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
