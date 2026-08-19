/**
 * Fleet Intelligence Smart AI - Analytics Export Service
 * PROMPT 36 - Export to CSV, Excel-ready CSV, and JSON format
 */

export class AnalyticsExportService {
  /**
   * Generates and triggers browser download of CSV data
   */
  public static exportToCsv(filename: string, rows: Record<string, any>[]): boolean {
    if (!rows || rows.length === 0) return false;

    try {
      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          headers
            .map((header) => {
              const val = row[header];
              if (val === null || val === undefined) return '""';
              const stringVal = String(val).replace(/"/g, '""');
              return `"${stringVal}"`;
            })
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Export CSV error:', err);
      return false;
    }
  }

  /**
   * Generates and triggers browser download of formatted JSON report
   */
  public static exportToJson(filename: string, data: any): boolean {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Export JSON error:', err);
      return false;
    }
  }

  /**
   * Triggers native print/PDF generator for Analytics Reports
   */
  public static triggerPrintReport(): void {
    window.print();
  }
}
