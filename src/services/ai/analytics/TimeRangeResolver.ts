/**
 * Fleet Intelligence Smart AI - Time Range Resolver
 * PROMPT 53 — Section 8 & 9
 * Resolves Indonesian Natural Language Time Expressions with Tenant Timezone support.
 */

import { NLTimeRange } from '../../../types/nlAnalytics';

export class TimeRangeResolver {
  public static resolve(
    rawText: string,
    timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura' = 'Asia/Jakarta'
  ): NLTimeRange {
    const text = rawText.toLowerCase().trim();
    const now = new Date();

    // Default: Bulan Ini (Current Month)
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    let label = 'Bulan Ini (Agustus 2026)';
    let periodType: NLTimeRange['periodType'] = 'month';

    let comparisonStartDate: string | undefined;
    let comparisonEndDate: string | undefined;
    let comparisonLabel: string | undefined;

    // 1. Hari Ini / Realtime
    if (text.includes('hari ini') || text.includes('saat ini') || text.includes('sekarang') || text.includes('today')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      label = 'Hari Ini';
      periodType = 'day';

      const prevDay = new Date(startDate);
      prevDay.setDate(prevDay.getDate() - 1);
      comparisonStartDate = new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate(), 0, 0, 0).toISOString();
      comparisonEndDate = new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate(), 23, 59, 59).toISOString();
      comparisonLabel = 'Kemarin';
    }

    // 2. Kemarin
    else if (text.includes('kemarin') || text.includes('yesterday')) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      label = 'Kemarin';
      periodType = 'day';

      const dayBefore = new Date(startDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      comparisonStartDate = new Date(dayBefore.getFullYear(), dayBefore.getMonth(), dayBefore.getDate(), 0, 0, 0).toISOString();
      comparisonEndDate = new Date(dayBefore.getFullYear(), dayBefore.getMonth(), dayBefore.getDate(), 23, 59, 59).toISOString();
      comparisonLabel = '2 Hari Lalu';
    }

    // 3. Minggu Ini
    else if (text.includes('minggu ini') || text.includes('pekan ini') || text.includes('this week')) {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      label = 'Minggu Ini';
      periodType = 'week';

      const prevWeekStart = new Date(startDate);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(endDate);
      prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
      comparisonStartDate = prevWeekStart.toISOString();
      comparisonEndDate = prevWeekEnd.toISOString();
      comparisonLabel = 'Minggu Lalu';
    }

    // 4. Minggu Lalu
    else if (text.includes('minggu lalu') || text.includes('pekan lalu') || text.includes('last week')) {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      label = 'Minggu Lalu';
      periodType = 'week';

      const prevWeekStart = new Date(startDate);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(endDate);
      prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
      comparisonStartDate = prevWeekStart.toISOString();
      comparisonEndDate = prevWeekEnd.toISOString();
      comparisonLabel = '2 Minggu Lalu';
    }

    // 5. Bulan Lalu
    else if (text.includes('bulan lalu') || text.includes('last month')) {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      label = 'Bulan Lalu (Juli 2026)';
      periodType = 'month';

      const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const twoMonthsAgoEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
      comparisonStartDate = twoMonthsAgoStart.toISOString();
      comparisonEndDate = twoMonthsAgoEnd.toISOString();
      comparisonLabel = '2 Bulan Lalu (Juni 2026)';
    }

    // 6. 3 Bulan Terakhir / 90 Hari Terakhir
    else if (text.includes('3 bulan') || text.includes('90 hari') || text.includes('last 3 months')) {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      label = '3 Bulan Terakhir (Jun – Agu 2026)';
      periodType = 'quarter';

      const prevQuarterStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const prevQuarterEnd = new Date(now.getFullYear(), now.getMonth() - 2, 0, 23, 59, 59);
      comparisonStartDate = prevQuarterStart.toISOString();
      comparisonEndDate = prevQuarterEnd.toISOString();
      comparisonLabel = '3 Bulan Sebelumnya (Mar – Mei 2026)';
    }

    // 7. 6 Bulan Terakhir
    else if (text.includes('6 bulan') || text.includes('last 6 months')) {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      label = '6 Bulan Terakhir (Mar – Agu 2026)';
      periodType = 'custom';

      const prev6MonthsStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      const prev6MonthsEnd = new Date(now.getFullYear(), now.getMonth() - 5, 0, 23, 59, 59);
      comparisonStartDate = prev6MonthsStart.toISOString();
      comparisonEndDate = prev6MonthsEnd.toISOString();
      comparisonLabel = '6 Bulan Sebelumnya';
    }

    // 8. 30 Hari Terakhir
    else if (text.includes('30 hari') || text.includes('last 30 days')) {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      label = '30 Hari Terakhir';
      periodType = 'month';

      const prev30Start = new Date(startDate);
      prev30Start.setDate(prev30Start.getDate() - 30);
      const prev30End = new Date(startDate);
      comparisonStartDate = prev30Start.toISOString();
      comparisonEndDate = prev30End.toISOString();
      comparisonLabel = '30 Hari Sebelumnya';
    }

    // 9. Tahun Ini / Tahun Berjalan (YTD)
    else if (text.includes('tahun ini') || text.includes('tahun berjalan') || text.includes('ytd') || text.includes('this year')) {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      label = `Tahun Ini (${now.getFullYear()} YTD)`;
      periodType = 'year';

      const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0, 23, 59, 59);
      comparisonStartDate = lastYearStart.toISOString();
      comparisonEndDate = lastYearEnd.toISOString();
      comparisonLabel = `Tahun Lalu (${now.getFullYear() - 1})`;
    }

    // 10. Tahun Lalu
    else if (text.includes('tahun lalu') || text.includes('last year')) {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      label = `Tahun Lalu (${now.getFullYear() - 1})`;
      periodType = 'year';

      const twoYearsAgoStart = new Date(now.getFullYear() - 2, 0, 1);
      const twoYearsAgoEnd = new Date(now.getFullYear() - 2, 11, 31, 23, 59, 59);
      comparisonStartDate = twoYearsAgoStart.toISOString();
      comparisonEndDate = twoYearsAgoEnd.toISOString();
      comparisonLabel = `Tahun ${now.getFullYear() - 2}`;
    }

    // 11. Kuartal Ini (Q3)
    else if (text.includes('kuartal ini') || text.includes('q3') || text.includes('quarter ini')) {
      startDate = new Date(2026, 6, 1);
      endDate = new Date(2026, 8, 30, 23, 59, 59);
      label = 'Kuartal 3 (Q3 2026)';
      periodType = 'quarter';

      comparisonStartDate = new Date(2026, 3, 1).toISOString();
      comparisonEndDate = new Date(2026, 5, 30, 23, 59, 59).toISOString();
      comparisonLabel = 'Kuartal 2 (Q2 2026)';
    }

    // Default: Current Month Comparison vs Previous Month
    if (!comparisonStartDate) {
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      comparisonStartDate = prevMonthStart.toISOString();
      comparisonEndDate = prevMonthEnd.toISOString();
      comparisonLabel = 'Bulan Lalu (Juli 2026)';
    }

    return {
      raw: rawText,
      label,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timezone,
      periodType,
      comparisonStartDate,
      comparisonEndDate,
      comparisonLabel,
    };
  }
}
