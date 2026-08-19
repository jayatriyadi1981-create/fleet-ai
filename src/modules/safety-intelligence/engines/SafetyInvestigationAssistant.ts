/**
 * Safety Investigation Assistant Engine
 * PROMPT 33 Architecture
 * 
 * Provides interactive 5-Whys root cause analysis, evidence gap detection,
 * targeted investigation interview questions, and human-in-the-loop finding confirmation.
 */

import { FiveWhyAnalysis } from '../types';

export class SafetyInvestigationAssistant {
  /**
   * Generates a 5-Why analysis framework with telemetry-supported intermediate factors
   */
  public static get5WhyAnalysis(incidentId: string = 'acc-101'): FiveWhyAnalysis {
    return {
      investigationId: 'inv-201',
      incidentNumber: 'ACC-2026-000001',
      problemStatement: 'Truk Wingbox B 9211 TJP mengalami tabrakan beruntun ringan dan tergelincir di Tol Cipularang KM 26A.',
      why1: {
        question: 'Mengapa kendaraan tidak dapat berhenti sebelum menabrak antrean di depan?',
        answer: 'Jarak pengereman aktual melebihi sisa jarak pandang pengemudi saat rem diinjak penuh.',
        evidence: 'Deselerasi tercatat -0.68 G dan kecepatan saat benturan masih terukur 34 km/h.',
        confirmedByHuman: true,
      },
      why2: {
        question: 'Mengapa jarak henti kendaraan menjadi lebih panjang dari biasanya?',
        answer: 'Koefisien gesek permukaan aspal menurun drastis akibat lapisan air hujan (kondisi jalan basah/licin).',
        evidence: 'Laporan cuaca operasional mencatat intensitas hujan sedang dan jalan basah.',
        confirmedByHuman: true,
      },
      why3: {
        question: 'Mengapa kecepatan kendaraan tetap tinggi (68 km/h) menjelang antrean dalam kondisi hujan?',
        answer: 'Pengemudi terlambat mengantisipasi antrean gerbang tol yang tertutup kabut tipis dan cipratan air.',
        evidence: 'Data telemetri menunjukkan pedal rem baru diinjak 4 detik sebelum titik impak.',
        confirmedByHuman: false,
      },
      why4: {
        question: 'Mengapa waktu reaksi dan tingkat kewaspadaan pengemudi berkurang?',
        answer: 'Pengemudi telah berkendara selama 4.8 jam tanpa jeda istirahat yang cukup pada jadwal perjalanan.',
        evidence: 'Log trip telematika mencatat waktu tempuh kontinu 4 jam 48 menit.',
        confirmedByHuman: true,
      },
      why5: {
        question: 'Mengapa pengemudi tidak berhenti di rest area sebelum mencapai batas 4 jam?',
        answer: 'Tidak ada notifikasi aktif real-time dari sistem dispatch yang menginstruksikan titik singgah rest area terdekat.',
        evidence: 'SOP rest area masih mengandalkan inisiatif manual pengemudi tanpa automated dispatch prompt.',
        confirmedByHuman: false,
      },
      rootCauseConclusion: 'Kombinasi kecepatan operasional yang tidak disesuaikan dengan cuaca hujan dan keterlambatan waktu reaksi pengemudi yang terpengaruh durasi mengemudi panjang tanpa rest stop wajib.',
      actionItem: 'Revisi SOP trip dispatch dengan mewajibkan automated geofenced rest alerts pada jam tempuh ke-3.5.',
    };
  }

  /**
   * Evidence Gap Checklist
   */
  public static getEvidenceGaps(incidentId: string): { name: string; status: 'COLLECTED' | 'MISSING' | 'PENDING_UPLOAD'; source: string; importance: 'CRITICAL' | 'IMPORTANT' | 'OPTIONAL' }[] {
    return [
      { name: 'Data Telemetri GPS 10Hz & CAN-Bus Brake', status: 'COLLECTED', source: 'IoT Device Gateway', importance: 'CRITICAL' },
      { name: 'Hasil Checklist Inspeksi Pra-Jalan (Pre-Trip)', status: 'COLLECTED', source: 'Modul Inspection P26', importance: 'CRITICAL' },
      { name: 'Rekaman Video Dashcam Depan', status: 'MISSING', source: 'Kamera Kabin / SD Card', importance: 'CRITICAL' },
      { name: 'Pernyataan Resmi Pengemudi (Driver Statement)', status: 'COLLECTED', source: 'Formulir Investigasi HSE', importance: 'IMPORTANT' },
      { name: 'Surat Keterangan Kepolisian / Jasa Marga', status: 'PENDING_UPLOAD', source: 'Satlantas / Patroli Jalan Tol', importance: 'IMPORTANT' },
      { name: 'Hasil Tes Cek Kesehatan / Breathalyzer Driver', status: 'MISSING', source: 'Klinik Cabang / Posko Dispatch', importance: 'IMPORTANT' },
      { name: 'Foto Dokumentasi Kerusakan Fisik & Tapak Ban', status: 'COLLECTED', source: 'Tim Lapangan Tanggap Darurat', importance: 'CRITICAL' },
    ];
  }
}
