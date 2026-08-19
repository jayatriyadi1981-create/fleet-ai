/**
 * Fleet Intelligence Smart AI - Vehicle Inspection AI Vision & Pattern Analyzer
 * Provides AI Photo Analysis, Repeat Issue Detection, and Predictive Insights
 */

import { InspectionAiInsight, IssueSeverity } from '../types/inspection';
import { mockInspectionAiInsights } from '../data/mockInspectionData';

export interface PhotoAnalysisResult {
  analyzed: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  potentialIssues: string[];
  suggestedSeverity: IssueSeverity;
  notes: string;
  disclaimer: string;
}

class InspectionAiService {
  private insights: InspectionAiInsight[] = [...mockInspectionAiInsights];
  private isAiPhotoAnalysisEnabled: boolean = true;

  public isPhotoAnalysisEnabled(): boolean {
    return this.isAiPhotoAnalysisEnabled;
  }

  public setPhotoAnalysisEnabled(enabled: boolean): void {
    this.isAiPhotoAnalysisEnabled = enabled;
  }

  public getInsights(): InspectionAiInsight[] {
    return this.insights;
  }

  /**
   * Analyze uploaded inspection image using Smart AI Vision rules
   */
  public async analyzePhoto(category: string, itemCode: string, fileName?: string): Promise<PhotoAnalysisResult> {
    if (!this.isAiPhotoAnalysisEnabled) {
      return {
        analyzed: false,
        confidence: 'LOW',
        confidenceScore: 0,
        potentialIssues: [],
        suggestedSeverity: 'LOW',
        notes: 'AI Photo Analysis dinonaktifkan oleh pengaturan privasi tenant.',
        disclaimer: 'Analisis visual AI membutuhkan persetujuan privasi tenant.',
      };
    }

    // Simulate AI inference latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (category === 'TIRE') {
      return {
        analyzed: true,
        confidence: 'HIGH',
        confidenceScore: 92,
        potentialIssues: [
          'Potential tire tread uneven wear (indikasi keausan tapak sisi dalam)',
          'Possible foreign object / screw embedded in outer groove (benda asing terdeteksi)',
        ],
        suggestedSeverity: 'HIGH',
        notes: 'AI mendeteksi pola keausan tidak rata pada permukaan ban. Diperlukan verifikasi fisik oleh mekanik.',
        disclaimer: 'Hasil deteksi bersifat prediktif dan memerlukan verifikasi manual oleh petugas/mekanik.',
      };
    }

    if (category === 'BRAKE') {
      return {
        analyzed: true,
        confidence: 'HIGH',
        confidenceScore: 95,
        potentialIssues: [
          'Potential hose micro-crack / air leak joint (indikasi sambungan selang angin retak)',
          'Possible brake lining thickness below safety threshold (ketebalan kampas tipis)',
        ],
        suggestedSeverity: 'CRITICAL',
        notes: 'Terdeteksi anomali pada klem sambungan selang rem pneumatik. Direkomendasikan uji tekanan kompresor.',
        disclaimer: 'Hasil deteksi AI bersifat pendukung keputusan (decision support) dan bukan jaminan mutlak.',
      };
    }

    if (category === 'OIL') {
      return {
        analyzed: true,
        confidence: 'MEDIUM',
        confidenceScore: 84,
        potentialIssues: [
          'Potential engine oil level below MIN mark (indikasi volume oli kurang)',
          'Possible fluid dark discoloration (pelumas pekat butuh penggantian filter)',
        ],
        suggestedSeverity: 'MEDIUM',
        notes: 'Warna cairan oli terlihat gelap pekat. Disarankan cek kilometer ganti oli terakhir.',
        disclaimer: 'Pengukuran volume fisik pada dipstick tetap menjadi acuan utama.',
      };
    }

    if (category === 'BODY') {
      return {
        analyzed: true,
        confidence: 'HIGH',
        confidenceScore: 88,
        potentialIssues: [
          'Potential minor scratch/dent on bumper corner (goresan sudut bumper)',
          'Possible cracked mirror casing (retak pada rumah spion)',
        ],
        suggestedSeverity: 'LOW',
        notes: 'Kerusakan minor pada estetika bodi luar, tidak mempengaruhi kelaikan jalan mekanis.',
        disclaimer: 'Verifikasi fisik visual mandiri oleh driver tetap diutamakan.',
      };
    }

    return {
      analyzed: true,
      confidence: 'MEDIUM',
      confidenceScore: 78,
      potentialIssues: ['Komponen tampak sesuai standar operasional awal'],
      suggestedSeverity: 'LOW',
      notes: 'Tidak ditemukan anomali visual mayor pada area foto yang diperiksa.',
      disclaimer: 'Pastikan sudut pengambilan foto cukup terang dan fokus.',
    };
  }

  /**
   * Run automated fleet-wide inspection pattern scanner
   */
  public generateAnomalyReport(vehiclePlate: string, failCount: number, category: string): InspectionAiInsight {
    const newInsight: InspectionAiInsight = {
      id: `AI-${Date.now()}`,
      type: 'REPEAT_ISSUE',
      title: `Deteksi Pola Kerusakan Berulang: ${category} (${vehiclePlate})`,
      summary: `Unit ${vehiclePlate} mencatat ${failCount} temuan pada kategori ${category} selama 14 hari terakhir.`,
      vehiclePlate,
      category: category as any,
      severity: failCount >= 3 ? 'CRITICAL' : 'HIGH',
      confidenceScore: 91,
      evidenceCount: failCount,
      recommendation: `Lakukan investigasi menyeluruh pada komponen ${category} dan bandingkan dengan data telematika getaran dan pengereman.`,
      actionRequired: 'Terbitkan Surat Perintah Kerja (Work Order) Pemeriksaan Khusus.',
      detectedAt: new Date().toISOString(),
    };

    this.insights.unshift(newInsight);
    return newInsight;
  }
}

export const inspectionAiService = new InspectionAiService();
