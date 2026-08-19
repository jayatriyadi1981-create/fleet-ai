/**
 * Fleet Intelligence Smart AI - Document OCR & AI Intelligence Service
 * PROMPT 48 - AI Document Classification, Field Extraction, Quality Check, Duplicate Detection, and Natural Language Assistant
 */

import {
  DocumentType,
  DocumentItem,
  OcrExtractionResult,
  DocumentQuality,
  DocumentAiPromptResponse,
  MissingDocumentItem,
  DocumentComplianceSummary,
} from '../types/documentTypes';

export class DocumentOcrAiService {
  private static instance: DocumentOcrAiService;

  public static getInstance(): DocumentOcrAiService {
    if (!DocumentOcrAiService.instance) {
      DocumentOcrAiService.instance = new DocumentOcrAiService();
    }
    return DocumentOcrAiService.instance;
  }

  /**
   * Process and extract data from an uploaded document image or PDF
   */
  public async processOcr(
    fileName: string,
    fileType: string,
    hintEntityType?: string,
    hintEntityName?: string
  ): Promise<OcrExtractionResult> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = fileName.toLowerCase();

    // Classification heuristics based on filename or simulated content
    let detectedType: DocumentType = 'STNK';
    let confidence = 94;
    let quality: DocumentQuality = 'READABLE';
    let docNumber = '';
    let plateNumber = '';
    let entityName = '';
    let issueDate = '2024-08-15';
    let expiryDate = '2027-08-15';
    let issuer = 'Kepolisian Negara Republik Indonesia (Korlantas)';
    let policyNumber = '';
    let possibleMismatch = false;
    let mismatchReason = '';

    if (lower.includes('kir') || lower.includes('dishub') || lower.includes('uji')) {
      detectedType = 'KIR';
      confidence = 96;
      docNumber = `KIR-JKT-${Math.floor(100000 + Math.random() * 900000)}`;
      plateNumber = hintEntityName && hintEntityName.includes('B ') ? hintEntityName.split(' ')[0] + ' ' + hintEntityName.split(' ')[1] : 'B 9481 UCH';
      issuer = 'Dinas Perhubungan & Pengujian Kendaraan Bermotor';
      issueDate = '2026-02-10';
      expiryDate = '2026-08-10'; // 6 months standard KIR
    } else if (lower.includes('sim') || lower.includes('driver') || lower.includes('license')) {
      detectedType = lower.includes('b2') || lower.includes('bii') ? 'SIM_B2' : lower.includes('b1') ? 'SIM_B1' : 'SIM_A';
      confidence = 98;
      docNumber = `9408-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
      entityName = hintEntityName || 'Bambang Supriyanto';
      issuer = 'Satpas SIM Polda Metro Jaya';
      issueDate = '2022-09-20';
      expiryDate = '2027-09-20';
    } else if (lower.includes('asuransi') || lower.includes('insurance') || lower.includes('polis')) {
      detectedType = 'INSURANCE';
      confidence = 92;
      docNumber = `POL-TPL-${Math.floor(100000 + Math.random() * 900000)}`;
      policyNumber = docNumber;
      plateNumber = hintEntityName || 'B 9102 TGA';
      issuer = 'PT Asuransi Central Asia (ACA) Fleet Dept';
      issueDate = '2025-08-01';
      expiryDate = '2026-08-01';
    } else if (lower.includes('siup') || lower.includes('nib') || lower.includes('legal') || lower.includes('business')) {
      detectedType = 'BUSINESS_LICENSE';
      confidence = 95;
      docNumber = `NIB-9120003418291`;
      entityName = 'PT Nusantara Trans Logistics';
      issuer = 'Kementerian Investasi / BKPM RI (OSS RBA)';
      issueDate = '2021-04-12';
      expiryDate = '2031-04-12';
    } else if (lower.includes('cert') || lower.includes('training') || lower.includes('defensive')) {
      detectedType = 'DRIVER_CERT';
      confidence = 93;
      docNumber = `CERT-DDT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      entityName = hintEntityName || 'Bambang Supriyanto';
      issuer = 'Indonesia Defensive Driving Center (IDDC)';
      issueDate = '2024-05-18';
      expiryDate = '2026-05-18';
    } else {
      // Default STNK
      detectedType = 'STNK';
      confidence = 94;
      docNumber = `STNK-09384712-B`;
      plateNumber = hintEntityName && hintEntityName.includes('B ') ? hintEntityName : 'B 9234 TGA';
      issuer = 'Samsat Polda Metro Jaya';
      issueDate = '2022-08-15';
      expiryDate = '2027-08-15';
    }

    // Check potential mismatch if user selected one entity but OCR saw another
    if (hintEntityName && plateNumber && !hintEntityName.toLowerCase().includes(plateNumber.toLowerCase().replace(/\s+/g, '')) && !plateNumber.includes(hintEntityName)) {
      if (Math.random() < 0.25) {
        possibleMismatch = true;
        mismatchReason = `AI mendeteksi kemungkinan nomor polisi (${plateNumber}) tidak sesuai dengan unit terpilih (${hintEntityName}).`;
      }
    }

    const extractedFields = [
      { field: 'documentNumber', label: 'Nomor Dokumen / Registrasi', value: docNumber, confidence: 97, confirmed: true },
      { field: 'documentType', label: 'Jenis Dokumen Terdeteksi', value: detectedType, confidence, confirmed: true },
      { field: 'plateNumber', label: 'Nomor Polisi / Plat', value: plateNumber, confidence: 95, confirmed: true },
      { field: 'entityName', label: 'Nama Pemegang / Entitas', value: entityName, confidence: 94, confirmed: true },
      { field: 'issuer', label: 'Instansi Penerbit / Asuransi', value: issuer, confidence: 91, confirmed: true },
      { field: 'issueDate', label: 'Tanggal Terbit (Issue Date)', value: issueDate, confidence: 93, confirmed: true },
      { field: 'expiryDate', label: 'Masa Berlaku (Expiry Date)', value: expiryDate, confidence: 96, confirmed: true },
    ];

    if (policyNumber) {
      extractedFields.push({ field: 'policyNumber', label: 'Nomor Polis Asuransi', value: policyNumber, confidence: 95, confirmed: true });
    }

    return {
      documentNumber: docNumber,
      entityName,
      plateNumber,
      issueDate,
      expiryDate,
      issuer,
      policyNumber,
      detectedType,
      confidence,
      quality,
      possibleMismatch,
      mismatchReason,
      rawExtractedText: `[OCR SCAN SUCCESSFUL]\nKOP: ${issuer}\nNOMOR: ${docNumber}\nENTITAS/PLAT: ${plateNumber || entityName}\nBERLAKU S/D: ${expiryDate}\nSTATUS: TERDAFTAR SAH`,
      extractedFields,
    };
  }

  /**
   * Check for duplicate document number
   */
  public checkDuplicate(documentNumber: string, existingDocs: DocumentItem[], excludeId?: string): { isDuplicate: boolean; duplicateDoc?: DocumentItem } {
    if (!documentNumber) return { isDuplicate: false };
    const cleaned = documentNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = existingDocs.find(
      (d) => d.id !== excludeId && d.documentNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === cleaned && d.status !== 'ARCHIVED'
    );
    return {
      isDuplicate: !!found,
      duplicateDoc: found,
    };
  }

  /**
   * Natural Language Document AI Assistant
   */
  public async askDocumentAi(
    prompt: string,
    context: {
      documents: DocumentItem[];
      missingDocs: MissingDocumentItem[];
      summary: DocumentComplianceSummary;
      userRole?: string;
    }
  ): Promise<DocumentAiPromptResponse> {
    const q = prompt.toLowerCase();
    const { documents, missingDocs, summary } = context;

    const expiringSoon = documents.filter((d) => d.status === 'EXPIRING_SOON');
    const expired = documents.filter((d) => d.status === 'EXPIRED');

    if (q.includes('expired bulan ini') || q.includes('kedaluwarsa bulan') || q.includes('habis bulan ini')) {
      const expiringThisMonth = expiringSoon.filter((d) => d.daysRemaining <= 30 && d.daysRemaining >= 0);
      const vehicleDocs = expiringThisMonth.filter((d) => d.entityType === 'VEHICLE');
      const driverDocs = expiringThisMonth.filter((d) => d.entityType === 'DRIVER');

      const answer = `Terdapat **${expiringThisMonth.length} dokumen** yang akan kedaluwarsa dalam 30 hari ke depan:\n\n` +
        `• **Dokumen Kendaraan (${vehicleDocs.length} unit):**\n` +
        vehicleDocs.map((d) => `  - ${d.entityName} (${d.documentType}): Jatuh tempo **${d.expiryDate}** (${d.daysRemaining} hari lagi)`).join('\n') +
        `\n\n• **Dokumen Pengemudi (${driverDocs.length} orang):**\n` +
        driverDocs.map((d) => `  - ${d.entityName} (${d.documentType.replace('_', ' ')}): Jatuh tempo **${d.expiryDate}** (${d.daysRemaining} hari lagi)`).join('\n') +
        `\n\n⚠️ **Rekomendasi AI:** Segera jadwalkan pengujian KIR Dishub dan perpanjangan SIM sebelum jatuh tempo untuk mencegah pembatasan dispatch unit.`;

      return {
        query: prompt,
        answer,
        suggestedActions: [
          { label: 'Lihat Antrean Expiring Soon (30 Hari)', actionType: 'FILTER', payload: { filter: 'expiring_30' } },
          { label: 'Kirim Pengingat WhatsApp ke Driver', actionType: 'SEND_REMINDER', payload: { driverDocs } },
        ],
        relatedDocuments: expiringThisMonth,
      };
    }

    if (q.includes('kir') || q.includes('uji berkala') || q.includes('dishub')) {
      const kirDocs = documents.filter((d) => d.documentType === 'KIR');
      const expiredKir = kirDocs.filter((d) => d.status === 'EXPIRED');
      const expiringKir = kirDocs.filter((d) => d.status === 'EXPIRING_SOON');

      const answer = `Analisis Kepatuhan Uji KIR Dishub Armada:\n\n` +
        `• **Total Dokumen KIR Terdaftar:** ${kirDocs.length} unit\n` +
        `• **KIR EXPIRED (Kritis):** ${expiredKir.length} unit → ${expiredKir.map((k) => `**${k.entityName}** (overdue ${Math.abs(k.daysRemaining)} hari)`).join(', ') || 'Tidak ada'}\n` +
        `• **KIR Mendekati Kedaluwarsa:** ${expiringKir.length} unit\n\n` +
        `🚨 **Dampak Operasional:** Unit dengan KIR expired otomatis dibatasi dari penugasan rute antarkota sesuai regulasi Kemenhub RI.`;

      return {
        query: prompt,
        answer,
        suggestedActions: [
          { label: 'Jadwalkan Servis & Uji KIR Dishub (WO)', actionType: 'CREATE_TASK', payload: { type: 'KIR_INSPECTION' } },
          { label: 'Filter Khusus Dokumen KIR', actionType: 'FILTER', payload: { documentType: 'KIR' } },
        ],
        relatedDocuments: [...expiredKir, ...expiringKir],
      };
    }

    if (q.includes('sim') || q.includes('driver') || q.includes('pengemudi')) {
      const simDocs = documents.filter((d) => d.documentType.startsWith('SIM'));
      const expiredSim = simDocs.filter((d) => d.status === 'EXPIRED');
      const expiringSim = simDocs.filter((d) => d.status === 'EXPIRING_SOON');

      const answer = `Status Kepatuhan SIM Pengemudi:\n\n` +
        `• **Total Driver dengan SIM Terverifikasi:** ${simDocs.length} orang\n` +
        `• **SIM Telah Kedaluwarsa:** ${expiredSim.length} orang ${expiredSim.length > 0 ? `(${expiredSim.map((s) => s.entityName).join(', ')})` : '(Nihil)'}\n` +
        `• **SIM Akan Kedaluwarsa Segera:** ${expiringSim.length} orang\n` +
        `• **Skor Kepatuhan Pengemudi:** **${summary.driverComplianceScore}%**\n\n` +
        `💡 *Sistem otomatis mengirimkan pengingat SMS/WhatsApp ke driver bersangkutan 30, 14, dan 7 hari sebelum masa berlaku habis.*`;

      return {
        query: prompt,
        answer,
        suggestedActions: [
          { label: 'Filter Dokumen Driver', actionType: 'FILTER', payload: { entityType: 'DRIVER' } },
          { label: 'Kirim Notifikasi Push ke Driver', actionType: 'SEND_REMINDER', payload: { simDocs } },
        ],
        relatedDocuments: [...expiredSim, ...expiringSim],
      };
    }

    if (q.includes('kurang') || q.includes('missing') || q.includes('belum ada') || q.includes('belum lengkap')) {
      const answer = `Daftar Dokumen Wajib yang Belum Terunggah (Missing Documents):\n\n` +
        `Ditemukan **${missingDocs.length} dokumen wajib** yang belum lengkap berdasarkan standar armada:\n\n` +
        missingDocs.map((m, i) => `${i + 1}. **${m.entityName}** (${m.entityType}): ${m.documentTypeName} [${m.urgency}]\n   *${m.impactDescription}*`).join('\n\n') +
        `\n\n📌 **Rekomendasi Tindakan:** Buka menu Tambah Dokumen atau gunakan fitur AI Camera Scanner untuk melengkapi berkas.`;

      return {
        query: prompt,
        answer,
        suggestedActions: [
          { label: 'Unggah Dokumen yang Hilang Sekarang', actionType: 'NAVIGATE', payload: { tab: 'missing' } },
          { label: 'Ekspor Checklist Dokumen Kurang (PDF)', actionType: 'NAVIGATE', payload: { action: 'export_missing' } },
        ],
      };
    }

    // Default General Overview
    const answer = `📊 **Ringkasan Intelijen Kepatuhan Dokumen Armada:**\n\n` +
      `• **Fleet Compliance Index:** **${summary.fleetComplianceScore}%** (${summary.fleetComplianceScore >= 90 ? 'Sangat Baik' : 'Perlu Perhatian'})\n` +
      `• **Total Dokumen Aktif:** ${summary.totalDocuments} berkas\n` +
      `• **Valid & Terverifikasi:** ${summary.validCount} berkas (${Math.round((summary.validCount / Math.max(summary.totalDocuments, 1)) * 100)}%)\n` +
      `• **Mendekati Kedaluwarsa:** ${summary.expiringSoonCount} berkas\n` +
      `• **Telah EXPIRED:** ${summary.expiredCount} berkas\n` +
      `• **Antrean Verifikasi:** ${summary.pendingVerificationCount} berkas\n` +
      `• **Dokumen Wajib Hilang:** ${summary.missingRequiredCount} item\n\n` +
      `Ada yang ingin Anda tanyakan lebih rinci terkait STNK, KIR Dishub, Asuransi, atau SIM Driver?`;

    return {
      query: prompt,
      answer,
      suggestedActions: [
        { label: 'Lihat Semua Dokumen Kedaluwarsa', actionType: 'FILTER', payload: { status: 'EXPIRED' } },
        { label: 'Review Antrean Verifikasi', actionType: 'NAVIGATE', payload: { tab: 'verification' } },
      ],
      relatedDocuments: expired.slice(0, 5),
    };
  }

  /**
   * Generate an automated Executive Compliance AI Summary
   */
  public generateExecutiveSummary(summary: DocumentComplianceSummary, expiring: DocumentItem[], expired: DocumentItem[]): string {
    return `Rangkuman Kepatuhan Dokumen Legalitas Armada:\n` +
      `Indeks kepatuhan berada pada ${summary.fleetComplianceScore}%. ` +
      `Terdapat ${summary.validCount} dokumen valid, ${summary.expiringSoonCount} dokumen memasuki jendela kedaluwarsa 30–90 hari, dan ${summary.expiredCount} dokumen kedaluwarsa aktif. ` +
      `${summary.operationalRestrictionsActive > 0 ? `Tercatat ${summary.operationalRestrictionsActive} unit terkena pembatasan operasional akibat KIR/STNK kedaluwarsa.` : 'Seluruh armada utama beroperasi penuh tanpa pembatasan dispatch.'}`;
  }
}

export const documentOcrAiService = DocumentOcrAiService.getInstance();
