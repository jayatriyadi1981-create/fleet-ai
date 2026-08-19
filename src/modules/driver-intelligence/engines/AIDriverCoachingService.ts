/**
 * AI Driver Coaching Service - Non-Punitive Coaching Workflow & Effectiveness Engine
 * PROMPT 29 - Generates AI Coaching Plans, Manages Session Lifecycle, Driver Acknowledgement, & Before/After Metrics
 */

import {
  AICoachingPlan,
  CoachingStatus,
  DriverCoachingSession,
  DriverSafetyRecommendation,
  RecommendationFocusType,
  RecommendationPriority,
} from '../types';

export class AIDriverCoachingService {
  private sessions: DriverCoachingSession[] = [];

  constructor() {
    this.seedInitialSessions();
  }

  /**
   * Generates a tailored, non-punitive AI Coaching Plan based on telematics evidence
   */
  public generateAICoachingPlan(
    driverName: string,
    topic: string,
    focusType: RecommendationFocusType,
    observedBehavior: string,
    evidencePoints: string[]
  ): AICoachingPlan {
    const defaultExamples = evidencePoints.length > 0
      ? evidencePoints
      : ['Data telemetri menunjukkan variasi kecepatan di atas toleransi pada rute operasional.'];

    switch (focusType) {
      case 'SPEED_MANAGEMENT':
        return {
          objective: `Membimbing ${driverName} mengontrol batas kecepatan konsisten pada koridor tol & arteri guna meminimalkan risiko tabrakan dan pengereman darurat.`,
          keyBehaviors: [
            'Memperhatikan batas kecepatan rambu (Tol: 80-100 km/jam, Arteri: 50-60 km/jam)',
            'Menghindari mengejar target waktu yang memicu overspeed',
            'Memanfaatkan fitur cruise control atau limit alarm jika tersedia',
          ],
          talkingPoints: [
            'Buka sesi dengan apresiasi atas trip yang telah diselesaikan dengan selamat.',
            'Tunjukkan log telemetri overspeed secara objektif, tanpa nada menyalahkan.',
            'Diskusikan apakah ada kendala waktu pengiriman atau tekanan jadwal yang memicu lonjakan kecepatan.',
            'Jelaskan hubungan langsung antara kecepatan berlebih dan jarak berhenti kendaraan bermuatan berat.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Sepakati komitmen batas toleransi kecepatan maksimal +5 km/jam dari rambu jalan.',
            'Aktifkan peringatan suara batas kecepatan di kabin.',
            'Review bersama pengawas rute jika estimasi waktu jadwal trip terlalu ketat.',
          ],
          followUpMetrics: [
            'Penurunan insiden overspeed > 60% dalam 14 hari ke depan.',
            'Penurunan Risk Score pengemudi menjadi < 40.',
          ],
          suggestedDurationMinutes: 25,
        };

      case 'BRAKING_TECHNIQUE':
      case 'DEFENSIVE_DRIVING':
        return {
          objective: `Meningkatkan antisipasi jarak aman (3-Second Rule) untuk mengeliminasi manuver pengereman mendadak (Harsh Braking).`,
          keyBehaviors: [
            'Menjaga jarak pandang jauh ke depan (10-15 detik ke depan)',
            'Memulai perlambatan lebih dini saat mendekati lampu lalu lintas atau gerbang tol',
            'Menghindari pengereman mendadak yang memicu risiko tubrukan dari belakang',
          ],
          talkingPoints: [
            'Diskusikan situasi lalu lintas saat kejadian pengereman mendadak terekam.',
            'Identifikasi apakah ada kendaraan lain yang memotong jalur secara tiba-tiba.',
            'Tekankan pentingnya ruang penyangga (space cushion) di sekeliling kendaraan.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Praktikkan aturan jarak 3-4 detik pada kecepatan tinggi.',
            'Lakukan perlambatan bertahap dengan engine brake sebelum menginjak rem utama.',
          ],
          followUpMetrics: [
            'Penurunan kejadian Harsh Braking menjadi maksimal 1 kejadian per 200 km.',
            'Perbaikan sub-skor pengereman menjadi di atas 85.',
          ],
          suggestedDurationMinutes: 20,
        };

      case 'REST_BREAK_REMINDER':
        return {
          objective: `Memastikan kepatuhan jam istirahat berkendara demi mencegah penurunan fokus dan risiko microsleep.`,
          keyBehaviors: [
            'Wajib istirahat minimal 30 menit setiap 4 jam berkendara kontinu',
            'Segera menepi di rest area aman saat merasakan tanda kantuk atau mata lelah',
            'Menjaga hidrasi dan sirkulasi udara segar di dalam kabin',
          ],
          talkingPoints: [
            'Tanyakan pola tidur dan kondisi kebugaran driver sebelum memulai shift.',
            'Tegaskan bahwa keselamatan jiwa driver adalah prioritas tertinggi perusahaan.',
            'Jelaskan bahwa perusahaan mendukung penuh waktu jeda istirahat di rest area resmi.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Tentukan titik rest area wajib pada rencana rute perjalanan.',
            'Lakukan peregangan ringan 5 menit saat jeda istirahat.',
          ],
          followUpMetrics: [
            'Zero alert risiko kelelahan operasional pada trip berikutnya.',
            'Kepatuhan 100% pada log waktu istirahat.',
          ],
          suggestedDurationMinutes: 20,
        };

      case 'ROUTE_COMPLIANCE':
        return {
          objective: `Meningkatkan kepatuhan koridor rute master dan disiplin koordinasi komunikasi dengan Dispatcher.`,
          keyBehaviors: [
            'Mengikuti koridor jalur yang sudah diuji kelayakannya untuk dimensi kendaraan',
            'Menghubungi Dispatcher sebelum mengambil jalur alternatif saat ada kendala',
            'Menghindari jalan sempit yang tidak ramah muatan berat',
          ],
          talkingPoints: [
            'Review alasan deviasi yang terekam pada peta rute.',
            'Verifikasi apakah deviasi disebabkan rekayasa lalu lintas atau kendala jalan.',
            'Jelaskan risiko jembatan rendah atau jalan rusak pada jalur tidak terotorisasi.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Gunakan tombol "Lapor Kendala Rute" pada aplikasi mobile driver.',
            'Pastikan GPS aktif dan terkalibrasi sebelum keberangkatan.',
          ],
          followUpMetrics: [
            'Kepatuhan koridor rute > 98% pada 5 trip berikutnya.',
            'Semua deviasi darurat terlaporkan tepat waktu.',
          ],
          suggestedDurationMinutes: 20,
        };

      case 'IDLE_REDUCTION':
        return {
          objective: `Mengoptimalkan efisiensi bahan bakar dengan mengurangi kebiasaan membiarkan mesin hidup saat berhenti lama.`,
          keyBehaviors: [
            'Mematikan mesin saat waktu tunggu di loading dock melebihi 3 menit',
            'Menghindari menyalakan mesin terlalu lama sebelum jadwal keberangkatan',
          ],
          talkingPoints: [
            'Tunjukkan estimasi solar dan biaya yang terbuang saat idling.',
            'Diskusikan kenyamanan kabin dan solusi sirkulasi saat antrean.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Terapkan SOP matikan mesin saat menunggu giliran bongkar muat.',
            'Laporkan ke koordinator DC jika waktu antrean bongkar muat terlalu lambat.',
          ],
          followUpMetrics: [
            'Reduksi durasi idle mesin > 50% per trip.',
            'Peningkatan skor efisiensi BBM armada.',
          ],
          suggestedDurationMinutes: 15,
        };

      default:
        return {
          objective: `Penyegaran komitmen keselamatan berkendara defensif dan kepatuhan SOP telematika armada.`,
          keyBehaviors: [
            'Mematuhi batas kecepatan dan rambu lalu lintas',
            'Menjaga jarak aman dan kehalusan kendali kemudi',
            'Menyelesaikan Pre-Trip Inspection sebelum berangkat',
          ],
          talkingPoints: [
            'Evaluasi menyeluruh skor telematika pengemudi.',
            'Buka ruang tanya jawab bagi pengemudi untuk menyampaikan kendala lapangan.',
          ],
          examples: defaultExamples,
          recommendedActions: [
            'Ikuti rekomendasi perbaikan berkendara berkala.',
            'Konsultasikan kendala kendaraan ke tim maintenance.',
          ],
          followUpMetrics: [
            'Peningkatan skor keselamatan berkendara di atas 80.',
            'Konsistensi tanpa insiden berulang.',
          ],
          suggestedDurationMinutes: 20,
        };
    }
  }

  public getAllSessions(): DriverCoachingSession[] {
    return [...this.sessions];
  }

  public getSessions(): DriverCoachingSession[] {
    return this.getAllSessions();
  }

  public getSessionsByDriver(driverId: string): DriverCoachingSession[] {
    return this.sessions.filter((s) => s.driverId === driverId);
  }

  public getSessionById(sessionId: string): DriverCoachingSession | undefined {
    return this.sessions.find((s) => s.id === sessionId);
  }

  public createSession(
    data: Omit<DriverCoachingSession, 'id' | 'createdAt' | 'updatedAt' | 'driverAcknowledged' | 'followUpAlertActive'>
  ): DriverCoachingSession {
    const newSession: DriverCoachingSession = {
      ...data,
      id: `coach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      driverAcknowledged: false,
      followUpAlertActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.sessions.unshift(newSession);
    return newSession;
  }

  public updateSession(sessionId: string, updates: Partial<DriverCoachingSession>): DriverCoachingSession | null {
    const idx = this.sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return null;

    this.sessions[idx] = {
      ...this.sessions[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.sessions[idx];
  }

  public completeSession(
    sessionId: string,
    afterRiskScore: number,
    afterSafetyScore: number,
    effectivenessSummary?: string
  ): DriverCoachingSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const delta = session.beforeRiskScore - afterRiskScore; // positive delta means risk decreased (improvement)
    const isAlertRequired = afterRiskScore > 60; // follow-up alert if risk remains high

    return this.updateSession(sessionId, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      afterRiskScore,
      afterSafetyScore,
      effectivenessDelta: delta,
      effectivenessSummary:
        effectivenessSummary ||
        (delta > 0
          ? `Perbaikan terasosiasi: Risk score menurun sebesar ${delta} poin pasca-coaching.`
          : 'Belum ada penurunan risiko signifikan, sesi follow-up direkomendasikan.'),
      followUpAlertActive: isAlertRequired,
    });
  }

  public acknowledgeSession(
    sessionId: string,
    driverComments?: string
  ): DriverCoachingSession | null {
    return this.updateSession(sessionId, {
      driverAcknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      driverComments: driverComments || 'Saya telah memahami materi coaching dan berkomitmen mempraktikkannya.',
    });
  }

  /**
   * Evaluates overall coaching program effectiveness across all completed sessions
   */
  public getCoachingEffectivenessMetrics(): {
    totalSessions: number;
    completedSessions: number;
    activeSessions: number;
    avgRiskReduction: number;
    averageRiskReductionPoints: number;
    avgSafetyImprovement: number;
    successRatePercentage: number;
    pendingAcknowledgementCount: number;
    highRiskFollowUpAlertsCount: number;
  } {
    const completed = this.sessions.filter((s) => s.status === 'COMPLETED' && s.afterRiskScore !== undefined);
    const pendingAck = this.sessions.filter((s) => !s.driverAcknowledged && s.status !== 'CANCELLED');
    const alerts = this.sessions.filter((s) => s.followUpAlertActive);
    const active = this.sessions.filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

    let totalRiskDelta = 0;
    let totalSafetyDelta = 0;
    let improvedCount = 0;

    completed.forEach((s) => {
      const riskDelta = s.beforeRiskScore - (s.afterRiskScore || s.beforeRiskScore);
      const safetyDelta = (s.afterSafetyScore || s.beforeSafetyScore) - s.beforeSafetyScore;
      totalRiskDelta += riskDelta;
      totalSafetyDelta += safetyDelta;
      if (riskDelta > 5 || safetyDelta > 5) {
        improvedCount++;
      }
    });

    const count = Math.max(completed.length, 1);
    const avgRiskReduction = Math.round((totalRiskDelta / count) * 10) / 10;
    const avgSafetyImprovement = Math.round((totalSafetyDelta / count) * 10) / 10;
    const successRate = completed.length > 0 ? Math.round((improvedCount / completed.length) * 100) : 85;

    return {
      totalSessions: this.sessions.length,
      completedSessions: completed.length,
      activeSessions: active.length,
      avgRiskReduction,
      averageRiskReductionPoints: avgRiskReduction,
      avgSafetyImprovement,
      successRatePercentage: successRate,
      pendingAcknowledgementCount: pendingAck.length,
      highRiskFollowUpAlertsCount: alerts.length,
    };
  }

  private seedInitialSessions(): void {
    const now = new Date();
    const dMinus2 = new Date(now.getTime() - 2 * 86400000).toISOString();
    const dMinus7 = new Date(now.getTime() - 7 * 86400000).toISOString();
    const dMinus14 = new Date(now.getTime() - 14 * 86400000).toISOString();

    const plan1 = this.generateAICoachingPlan(
      'Bambang Santoso',
      'Manajemen Kecepatan & Antisipasi Koridor Tol',
      'SPEED_MANAGEMENT',
      'Overspeed di Tol Jakarta-Cikampek',
      ['9 kali overspeed di atas batas regulasi.', 'Puncak kecepatan 118 km/jam.']
    );

    const plan2 = this.generateAICoachingPlan(
      'Agus Setiawan',
      'Penerapan Jarak Aman Antisipatif',
      'BRAKING_TECHNIQUE',
      'Harsh Braking di Exit Tol Karawang',
      ['6 pengereman mendadak dalam 3 hari berturut-turut.']
    );

    const plan3 = this.generateAICoachingPlan(
      'Eko Prasetyo',
      'Kepatuhan Waktu Istirahat Operasional',
      'REST_BREAK_REMINDER',
      'Continuous driving > 4.5 hours',
      ['5.5 jam berkendara non-stop di jalur Pantura.']
    );

    this.sessions = [
      {
        id: 'coach-init-01',
        tenantId: 'tenant-tln-01',
        driverId: 'drv-01',
        driverName: 'Bambang Santoso',
        driverPhone: '0812-3456-7890',
        coachId: 'usr-spv-01',
        coachName: 'Hendra Gunawan (Safety Supervisor)',
        supervisorName: 'Hendra Gunawan (Safety Supervisor)',
        title: 'Manajemen Kecepatan & Antisipasi Koridor Tol',
        date: dMinus2.substring(0, 10),
        scheduledDate: dMinus2.substring(0, 10),
        coachingTopic: 'Manajemen Kecepatan & Antisipasi Koridor Tol',
        category: 'SPEED_MANAGEMENT' as any,
        trigger: 'Deteksi 9 insiden overspeed pada rute Tol Jakarta-Cikampek',
        observedBehavior: 'Tercatat kecepatan rata-rata 112 km/jam pada zona batas 100 km/jam saat muatan penuh.',
        aiRecommendation: 'Lakukan review batas kecepatan dan aktifkan audio alert batas kecepatan di kabin.',
        aiCoachingPlan: plan1,
        talkingPoints: plan1.talkingPoints,
        supervisorNotes: 'Driver kooperatif dan menyampaikan bahwa saat itu sedang mengejar jadwal closing gerbang pabrik. Kami telah merevisi window time dengan dispatcher.',
        driverResponse: 'Saya paham dan akan lebih memperhatikan speedometer serta mengabaikan desakan vendor jika membahayakan.',
        actionPlan: ['Patuhi batas maks 90 km/jam di tol', 'Pasang alarm kecepatan di kabin'],
        followUpDate: new Date(now.getTime() + 12 * 86400000).toISOString().substring(0, 10),
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        beforeRiskScore: 78,
        beforeSafetyScore: 68,
        afterRiskScore: undefined,
        afterSafetyScore: undefined,
        driverAcknowledged: true,
        acknowledgedAt: dMinus2,
        driverComments: 'Saya sudah memahami komitmen batas kecepatan tol dan akan melapor jika estimasi waktu terlalu ketat.',
        followUpAlertActive: false,
        createdAt: dMinus2,
        updatedAt: dMinus2,
      },
      {
        id: 'coach-init-02',
        tenantId: 'tenant-tln-01',
        driverId: 'drv-02',
        driverName: 'Agus Setiawan',
        driverPhone: '0813-9876-5432',
        coachId: 'usr-spv-02',
        coachName: 'Budi Raharjo (Fleet Ops Lead)',
        supervisorName: 'Budi Raharjo (Fleet Ops Lead)',
        title: 'Penerapan Jarak Aman Antisipatif (3-Second Rule)',
        date: dMinus14.substring(0, 10),
        scheduledDate: dMinus14.substring(0, 10),
        coachingTopic: 'Penerapan Jarak Aman Antisipatif (3-Second Rule)',
        category: 'BRAKING_TECHNIQUE' as any,
        trigger: 'Pengereman mendadak berulang (6 kali) di exit tol Karawang',
        observedBehavior: 'Deselerasi tajam hingga -4.8 m/s² mendekati antrean gerbang tol.',
        aiRecommendation: 'Berikan modul Defensive Driving mengenai jarak pengereman muatan berat.',
        aiCoachingPlan: plan2,
        talkingPoints: plan2.talkingPoints,
        supervisorNotes: 'Sesi berjalan lancar. Driver mempraktikkan perlambatan bertahap selama 1 minggu evaluasi.',
        driverResponse: 'Terima kasih atas masukannya, saya sekarang menginjak rem lebih awal.',
        actionPlan: ['Menjaga jarak minimal 4 detik di belakang kendaraan lain', 'Lakukan perlambatan bertahap'],
        followUpDate: dMinus7.substring(0, 10),
        status: 'COMPLETED',
        priority: 'MEDIUM',
        beforeRiskScore: 72,
        beforeSafetyScore: 71,
        afterRiskScore: 36,
        afterSafetyScore: 88,
        effectivenessDelta: 36,
        effectivenessSummary: 'Perbaikan terasosiasi signifikan: Risk score menurun 36 poin dan insiden pengereman turun 80%.',
        driverAcknowledged: true,
        acknowledgedAt: dMinus14,
        driverComments: 'Sudah mempraktikkan jarak 4 detik dan rem terasa jauh lebih halus.',
        followUpAlertActive: false,
        createdAt: dMinus14,
        updatedAt: dMinus7,
        completedAt: dMinus7,
      },
      {
        id: 'coach-init-03',
        tenantId: 'tenant-tln-01',
        driverId: 'drv-04',
        driverName: 'Eko Prasetyo',
        driverPhone: '0812-4455-6677',
        coachId: 'usr-spv-01',
        coachName: 'Hendra Gunawan (Safety Supervisor)',
        supervisorName: 'Hendra Gunawan (Safety Supervisor)',
        title: 'Kepatuhan Interval Istirahat Operasional (SOP 4 Jam)',
        date: dMinus7.substring(0, 10),
        scheduledDate: dMinus7.substring(0, 10),
        coachingTopic: 'Kepatuhan Interval Istirahat Operasional (SOP 4 Jam)',
        category: 'REST_BREAK_REMINDER' as any,
        trigger: 'Indikator risiko kelelahan operasional: 5.5 jam berkendara tanpa jeda istirahat',
        observedBehavior: 'Mengemudi lintas provinsi tanpa jeda berhenti di rest area resmi.',
        aiRecommendation: 'Wajibkan jeda istirahat 30 menit setiap 4 jam berkendara.',
        aiCoachingPlan: plan3,
        talkingPoints: plan3.talkingPoints,
        supervisorNotes: 'Jelaskan bahaya microsleep dan tetapkan rest area wajib pada surat jalan.',
        driverResponse: 'Siap, saya akan berhenti di Rest Area KM 207 untuk istirahat dan cuci muka.',
        actionPlan: ['Berhenti setiap 3.5 jam di rest area terdekat', 'Lakukan peregangan 5 menit'],
        followUpDate: new Date(now.getTime() + 5 * 86400000).toISOString().substring(0, 10),
        status: 'SCHEDULED',
        priority: 'CRITICAL',
        beforeRiskScore: 82,
        beforeSafetyScore: 62,
        afterRiskScore: undefined,
        afterSafetyScore: undefined,
        driverAcknowledged: false,
        followUpAlertActive: true,
        createdAt: dMinus7,
        updatedAt: dMinus7,
      },
    ];
  }
}

export const aiDriverCoachingService = new AIDriverCoachingService();
