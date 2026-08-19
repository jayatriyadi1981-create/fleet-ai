/**
 * Fleet Intelligence Smart AI - Natural Language Automation Builder Parser
 * PROMPT 35 - Section 76, 77, 78
 */

import { AutomationWorkflow, AutomationNode, AutomationEdge, AutomationEventType, WorkflowCategory } from '../types';

export interface NLPParsingResult {
  confidence: number;
  parsedSummary: string;
  suggestedName: string;
  suggestedCategory: WorkflowCategory;
  triggerEvent: AutomationEventType;
  workflowDraft: Partial<AutomationWorkflow>;
  explanation: {
    whatItDoes: string;
    whenItRuns: string;
    whatDataItUses: string;
    whatAIAnalyzes: string;
    whatActionsItPerforms: string;
    whoReceivesNotification: string;
  };
}

export class NaturalLanguageAutomationParser {
  private static instance: NaturalLanguageAutomationParser;

  private constructor() {}

  public static getInstance(): NaturalLanguageAutomationParser {
    if (!NaturalLanguageAutomationParser.instance) {
      NaturalLanguageAutomationParser.instance = new NaturalLanguageAutomationParser();
    }
    return NaturalLanguageAutomationParser.instance;
  }

  /**
   * Translates natural language Indonesian user prompts into fully-structured automation workflows
   */
  public parsePrompt(promptText: string): NLPParsingResult {
    const text = promptText.toLowerCase();

    // 1. Overspeed / Speeding
    if (text.includes('overspeed') || text.includes('kecepatan') || text.includes('ngebut')) {
      const speedMatch = promptText.match(/(\d+)\s*(km\/h|km\/jam|kpj)/i);
      const thresholdSpeed = speedMatch ? parseInt(speedMatch[1], 10) : 80;

      const nodes: AutomationNode[] = [
        {
          id: 'node_event_1',
          type: 'EVENT',
          label: 'Deteksi Overspeed GPS',
          description: `Menerima event telemetri kecepatan > ${thresholdSpeed} km/h`,
          position: { x: 250, y: 50 },
          config: {
            eventType: 'OVERSPEED',
            eventSource: 'GPS',
            deduplicationWindowSec: 300,
          },
        },
        {
          id: 'node_cond_1',
          type: 'CONDITION',
          label: `Kecepatan > ${thresholdSpeed} km/h`,
          description: 'Validasi ambang batas kecepatan koridor',
          position: { x: 250, y: 150 },
          config: {
            conditionGroup: {
              id: 'cg_speed',
              combinator: 'AND',
              conditions: [
                {
                  id: 'c1',
                  field: 'speed',
                  fieldLabel: 'Kecepatan Terkini',
                  operator: '>',
                  value: thresholdSpeed,
                },
              ],
            },
          },
        },
        {
          id: 'node_ai_1',
          type: 'AI_ANALYSIS',
          label: 'AI Driver Risk Intelligence',
          description: 'Analisis profil risiko driver & historis insiden',
          position: { x: 250, y: 260 },
          config: {
            aiConfig: {
              aiCapability: 'driver_risk',
              model: 'gemini-2.5-flash',
              contextFields: ['driver_history', 'speed_telemetry', 'road_type'],
              confidenceThreshold: 0.85,
            },
          },
        },
        {
          id: 'node_dec_1',
          type: 'DECISION',
          label: 'Evaluasi Tingkat Risiko',
          description: 'Apakah risiko tergolong HIGH / CRITICAL?',
          position: { x: 250, y: 370 },
          config: {
            decisionBranches: [
              { id: 'branch_high', label: 'HIGH / CRITICAL', conditionType: 'AI_RISK', targetValue: 'HIGH' },
              { id: 'branch_low', label: 'LOW / SAFE', conditionType: 'AI_RISK', targetValue: 'LOW' },
            ],
          },
        },
        {
          id: 'node_act_1',
          type: 'ACTION',
          label: 'Buat Safety Alert & Penugasan Coaching',
          description: 'Mencatat tiket keselamatan dan alokasi coaching',
          position: { x: 120, y: 480 },
          config: {
            actionConfig: {
              actionType: 'CREATE_ALERT',
              parameters: {
                severity: 'high',
                title: 'Pelanggaran Overspeed Berulang Berisiko Tinggi',
                category: 'SAFETY_VIOLATION',
              },
              requiresApproval: false,
            },
          },
        },
        {
          id: 'node_notif_1',
          type: 'NOTIFICATION',
          label: 'Kirim Notifikasi Multi-Channel',
          description: 'Broadcast push & in-app alert ke Fleet Manager',
          position: { x: 120, y: 590 },
          config: {
            notificationConfig: {
              channels: ['IN_APP', 'PUSH', 'EMAIL'],
              targetRoles: ['fleet_manager', 'safety_manager'],
              titleTemplate: '🚨 [Overspeed Alert] Kendaraan {{entityName}} melaju {{speed}} km/h',
              messageTemplate: 'Pengemudi teridentifikasi berisiko tinggi. AI menyarankan intervensi coaching.',
              priority: 'high',
              throttling: { cooldownSeconds: 300, maxPerWindow: 2 },
            },
          },
        },
        {
          id: 'node_rep_1',
          type: 'REPORT',
          label: 'Rekam ke Laporan Harian Safety',
          description: 'Kompilasi audit insiden harian',
          position: { x: 120, y: 700 },
          config: {
            reportConfig: {
              reportType: 'DAILY_OVERSPEED',
              format: 'PDF',
              autoDistribute: true,
            },
          },
        },
        {
          id: 'node_end_1',
          type: 'END',
          label: 'Selesai',
          description: 'Alur automasi berhasil diselesaikan',
          position: { x: 250, y: 810 },
          config: {},
        },
      ];

      const edges: AutomationEdge[] = [
        { id: 'e1', sourceNodeId: 'node_event_1', targetNodeId: 'node_cond_1' },
        { id: 'e2', sourceNodeId: 'node_cond_1', targetNodeId: 'node_ai_1' },
        { id: 'e3', sourceNodeId: 'node_ai_1', targetNodeId: 'node_dec_1' },
        { id: 'e4', sourceNodeId: 'node_dec_1', targetNodeId: 'node_act_1', sourceHandle: 'high', label: 'High Risk' },
        { id: 'e5', sourceNodeId: 'node_dec_1', targetNodeId: 'node_end_1', sourceHandle: 'low', label: 'Low Risk' },
        { id: 'e6', sourceNodeId: 'node_act_1', targetNodeId: 'node_notif_1' },
        { id: 'e7', sourceNodeId: 'node_notif_1', targetNodeId: 'node_rep_1' },
        { id: 'e8', sourceNodeId: 'node_rep_1', targetNodeId: 'node_end_1' },
      ];

      return {
        confidence: 0.95,
        parsedSummary: `Automasi mendeteksi overspeed > ${thresholdSpeed} km/h, menganalisis risiko pengemudi dengan AI, membuat safety alert, notifikasi Fleet Manager, dan mencatat ke laporan harian.`,
        suggestedName: `Overspeed Risk Automation (${thresholdSpeed} km/h)`,
        suggestedCategory: 'SAFETY',
        triggerEvent: 'OVERSPEED',
        workflowDraft: {
          name: `Overspeed Risk Automation (${thresholdSpeed} km/h)`,
          description: `Otomasi keselamatan mendeteksi kecepatan > ${thresholdSpeed} km/h, evaluasi risiko pengemudi dengan AI, pembuatan alert darurat, dan notifikasi manajer.`,
          category: 'SAFETY',
          triggerType: 'EVENT_BASED',
          status: 'DRAFT',
          priority: 'HIGH',
          nodes,
          edges,
        },
        explanation: {
          whatItDoes: `Memantau laju armada secara real-time dan mengeksekusi tindakan mitigasi keselamatan jika terjadi overspeed di atas ${thresholdSpeed} km/h.`,
          whenItRuns: 'Setiap kali perangkat telematika GPS mengirimkan data kecepatan melebihi batas yang ditentukan.',
          whatDataItUses: 'Kecepatan GPS, batas kecepatan koridor, histori skor keselamatan pengemudi, data trip aktif.',
          whatAIAnalyzes: 'AI Driver Intelligence menilai apakah pelanggaran bersifat anomali atau kebiasaan agresif.',
          whatActionsItPerforms: 'Membuat safety alert, menjadwalkan coaching driver, dan membukukan kejadian.',
          whoReceivesNotification: 'Fleet Manager, Safety Supervisor, dan Dispatcher Operasional.',
        },
      };
    }

    // 2. GPS Offline
    if (text.includes('offline') || text.includes('mati') || text.includes('hilang sinyal') || text.includes('gps')) {
      return {
        confidence: 0.92,
        parsedSummary:
          'Automasi mendeteksi GPS offline > 30 menit, melakukan diagnostik perangkat & SIM M2M dengan AI, membuat tiket perbaikan, dan notifikasi tim teknisi.',
        suggestedName: 'GPS Device Offline & Health Monitor',
        suggestedCategory: 'TELEMATICS',
        triggerEvent: 'GPS_OFFLINE',
        workflowDraft: {
          name: 'GPS Device Offline & Health Monitor',
          description: 'Mendeteksi hilangnya transmisi sinyal GPS, evaluasi diagnostik hardware dengan AI, dan alokasi tugas investigasi.',
          category: 'TELEMATICS',
          triggerType: 'EVENT_BASED',
          status: 'DRAFT',
          priority: 'HIGH',
          nodes: [
            {
              id: 'node_event_1',
              type: 'EVENT',
              label: 'GPS Sinyal Terputus',
              description: 'Deteksi kehilangan heartbeat GPS',
              position: { x: 250, y: 50 },
              config: { eventType: 'GPS_OFFLINE', eventSource: 'GPS', deduplicationWindowSec: 600 },
            },
            {
              id: 'node_cond_1',
              type: 'CONDITION',
              label: 'Durasi Offline > 30 Menit',
              description: 'Memeriksa lama waktu tidak ada sinyal',
              position: { x: 250, y: 150 },
              config: {
                conditionGroup: {
                  id: 'cg_offline',
                  combinator: 'AND',
                  conditions: [{ id: 'c1', field: 'offlineMinutes', operator: '>', value: 30 }],
                },
              },
            },
            {
              id: 'node_ai_1',
              type: 'AI_ANALYSIS',
              label: 'AI GPS Diagnostic Intelligence',
              description: 'Diagnosis hardware vs blank spot vs kartu SIM',
              position: { x: 250, y: 260 },
              config: {
                aiConfig: {
                  aiCapability: 'gps_diagnostics',
                  model: 'gemini-2.5-flash',
                  contextFields: ['battery_volt', 'last_address', 'sim_status'],
                },
              },
            },
            {
              id: 'node_act_1',
              type: 'ACTION',
              label: 'Buat GPS Maintenance Ticket',
              description: 'Registrasi tiket pengecekan teknisi',
              position: { x: 250, y: 370 },
              config: {
                actionConfig: {
                  actionType: 'CREATE_TASK',
                  parameters: { title: 'Pemeriksaan Hardware GPS Offline', assignedRole: 'maintenance' },
                  requiresApproval: false,
                },
              },
            },
            {
              id: 'node_notif_1',
              type: 'NOTIFICATION',
              label: 'Notifikasi Tim Operasional',
              description: 'Kirim alert ke Operation & Maintenance Team',
              position: { x: 250, y: 480 },
              config: {
                notificationConfig: {
                  channels: ['IN_APP', 'PUSH'],
                  targetRoles: ['operations', 'maintenance'],
                  titleTemplate: '⚠️ GPS Unit {{entityName}} Offline > 30 Menit',
                  messageTemplate: 'Diagnosis AI mengindikasikan kemungkinan kendala daya/sinyal. Segera tindak lanjuti.',
                  priority: 'normal',
                  throttling: { cooldownSeconds: 600, maxPerWindow: 1 },
                },
              },
            },
            {
              id: 'node_end_1',
              type: 'END',
              label: 'Selesai',
              description: 'Workflow selesai dieksekusi',
              position: { x: 250, y: 590 },
              config: {},
            },
          ],
          edges: [
            { id: 'e1', sourceNodeId: 'node_event_1', targetNodeId: 'node_cond_1' },
            { id: 'e2', sourceNodeId: 'node_cond_1', targetNodeId: 'node_ai_1' },
            { id: 'e3', sourceNodeId: 'node_ai_1', targetNodeId: 'node_act_1' },
            { id: 'e4', sourceNodeId: 'node_act_1', targetNodeId: 'node_notif_1' },
            { id: 'e5', sourceNodeId: 'node_notif_1', targetNodeId: 'node_end_1' },
          ],
        },
        explanation: {
          whatItDoes: 'Memonitor kontinuitas transmisi sinyal GPS dan otomatis membuat tiket teknis bila terputus lebih dari 30 menit.',
          whenItRuns: 'Saat gateway GPS tidak menerima paket heartbeat data telemetri sesuai interval normal.',
          whatDataItUses: 'Status IMEI, tegangan aki cadangan, log koneksi seluler SIM card.',
          whatAIAnalyzes: 'AI membedakan antara area blank spot geografis atau kerusakan fisik unit GPS.',
          whatActionsItPerforms: 'Membuat tiket investigasi perangkat telematika.',
          whoReceivesNotification: 'Tim Maintenance Perangkat IoT & Staf Operasional.',
        },
      };
    }

    // 3. Fuel Anomaly / Drop
    if (text.includes('bbm') || text.includes('solar') || text.includes('fuel') || text.includes('drain')) {
      return {
        confidence: 0.93,
        parsedSummary:
          'Automasi mendeteksi anomali penurunan level BBM > 15%, analisis AI Fuel Intelligence, membuat task investigasi, dan notifikasi manajer BBM.',
        suggestedName: 'Fuel Anomaly & Drainage Detection',
        suggestedCategory: 'FUEL',
        triggerEvent: 'FUEL_ANOMALY',
        workflowDraft: {
          name: 'Fuel Anomaly & Drainage Detection',
          description: 'Mendeteksi penurunan volume BBM abnormal saat posisi parkir, analisis potensi kebocoran, dan alokasi audit.',
          category: 'FUEL',
          triggerType: 'EVENT_BASED',
          status: 'DRAFT',
          priority: 'CRITICAL',
          nodes: [
            {
              id: 'node_event_1',
              type: 'EVENT',
              label: 'Sensor BBM Mengirim Anomali',
              description: 'Penurunan drastis volume solar tangki',
              position: { x: 250, y: 50 },
              config: { eventType: 'FUEL_ANOMALY', eventSource: 'Fuel', deduplicationWindowSec: 600 },
            },
            {
              id: 'node_cond_1',
              type: 'CONDITION',
              label: 'Penurunan > 15% & Mesin OFF',
              description: 'Kondisi tangki berkurang tanpa pembakaran mesin',
              position: { x: 250, y: 150 },
              config: {
                conditionGroup: {
                  id: 'cg_fuel',
                  combinator: 'AND',
                  conditions: [
                    { id: 'c1', field: 'dropPercent', operator: '>=', value: 15 },
                    { id: 'c2', field: 'isEngineOff', operator: '=', value: true },
                  ],
                },
              },
            },
            {
              id: 'node_ai_1',
              type: 'AI_ANALYSIS',
              label: 'AI Fuel Intelligence Engine',
              description: 'Kalkulasi pola konsumsi & deviasi rute SPBU',
              position: { x: 250, y: 260 },
              config: {
                aiConfig: {
                  aiCapability: 'fuel_anomaly',
                  model: 'gemini-2.5-flash',
                  contextFields: ['tank_level', 'engine_status', 'location_type'],
                },
              },
            },
            {
              id: 'node_act_1',
              type: 'ACTION',
              label: 'Buat Fuel Audit Task',
              description: 'Tiket investigasi kejanggalan BBM',
              position: { x: 250, y: 370 },
              config: {
                actionConfig: {
                  actionType: 'CREATE_TASK',
                  parameters: { title: 'Audit Investigasi BBM Unit Anomali', assignedRole: 'operations' },
                  requiresApproval: false,
                },
              },
            },
            {
              id: 'node_notif_1',
              type: 'NOTIFICATION',
              label: 'Eskalasi Notifikasi Kritis',
              description: 'Alert WhatsApp & Push ke Fleet Manager',
              position: { x: 250, y: 480 },
              config: {
                notificationConfig: {
                  channels: ['IN_APP', 'PUSH', 'EMAIL', 'WHATSAPP_READY'],
                  targetRoles: ['fleet_manager', 'finance'],
                  titleTemplate: '🚨 Anomali Penurunan BBM Drastis pada {{entityName}}',
                  messageTemplate: 'Terdeteksi penurunan volume tangki {{dropPercent}}% saat parkir. Harap verifikasi audit.',
                  priority: 'critical',
                  throttling: { cooldownSeconds: 900, maxPerWindow: 1 },
                },
              },
            },
            {
              id: 'node_end_1',
              type: 'END',
              label: 'Selesai',
              description: 'Workflow selesai',
              position: { x: 250, y: 590 },
              config: {},
            },
          ],
          edges: [
            { id: 'e1', sourceNodeId: 'node_event_1', targetNodeId: 'node_cond_1' },
            { id: 'e2', sourceNodeId: 'node_cond_1', targetNodeId: 'node_ai_1' },
            { id: 'e3', sourceNodeId: 'node_ai_1', targetNodeId: 'node_act_1' },
            { id: 'e4', sourceNodeId: 'node_act_1', targetNodeId: 'node_notif_1' },
            { id: 'e5', sourceNodeId: 'node_notif_1', targetNodeId: 'node_end_1' },
          ],
        },
        explanation: {
          whatItDoes: 'Mencegah kerugian bahan bakar dengan mendeteksi indikasi anomali penurunan solar saat mesin kendaraan mati.',
          whenItRuns: 'Saat sensor ultrasonik / float tangki mendeteksi penurunan volume mendadak di luar transaksi SPBU.',
          whatDataItUses: 'Grafik telemetri sensor tangki BBM, status kontak mesin, koordinat GPS lokasi berhenti.',
          whatAIAnalyzes: 'AI memvalidasi kemiringan tanah jalan vs indikasi anomali aktual.',
          whatActionsItPerforms: 'Menerbitkan tugas audit investigasi BBM dan eskalasi notifikasi segera.',
          whoReceivesNotification: 'Fleet Manager & Manajer Keuangan Operasional.',
        },
      };
    }

    // Default Fallback
    return {
      confidence: 0.88,
      parsedSummary:
        'Workflow automasi terstruktur dengan evaluasi kondisi berbasis aturan, analisis kecerdasan buatan, pembuatan alert, dan notifikasi terpusat.',
      suggestedName: 'Custom AI Fleet Automation Workflow',
      suggestedCategory: 'OPERATIONS',
      triggerEvent: 'MANUAL_TRIGGER',
      workflowDraft: {
        name: 'Custom AI Fleet Automation Workflow',
        description: `Otomasi yang dikonfigurasi dari deskripsi: "${promptText.substring(0, 100)}..."`,
        category: 'OPERATIONS',
        triggerType: 'EVENT_BASED',
        status: 'DRAFT',
        priority: 'NORMAL',
        nodes: [
          {
            id: 'node_event_1',
            type: 'EVENT',
            label: 'Event Pemicu Sistem',
            description: 'Menerima event operasional telematika',
            position: { x: 250, y: 50 },
            config: { eventType: 'MANUAL_TRIGGER', eventSource: 'System' },
          },
          {
            id: 'node_ai_1',
            type: 'AI_ANALYSIS',
            label: 'Analisis Kecerdasan Buatan (AI)',
            description: 'Evaluasi risiko komprehensif',
            position: { x: 250, y: 160 },
            config: {
              aiConfig: {
                aiCapability: 'general_fleet_reasoning',
                model: 'gemini-2.5-flash',
                contextFields: ['telemetry', 'historical_events'],
              },
            },
          },
          {
            id: 'node_act_1',
            type: 'ACTION',
            label: 'Eksekusi Tindakan Otomatis',
            description: 'Menerbitkan alert dan task terkelola',
            position: { x: 250, y: 270 },
            config: {
              actionConfig: {
                actionType: 'CREATE_ALERT',
                parameters: { title: 'Peringatan Operasional Automasi' },
                requiresApproval: false,
              },
            },
          },
          {
            id: 'node_notif_1',
            type: 'NOTIFICATION',
            label: 'Kirim Notifikasi',
            description: 'Broadcast informasi ke staf terkait',
            position: { x: 250, y: 380 },
            config: {
              notificationConfig: {
                channels: ['IN_APP', 'PUSH'],
                targetRoles: ['fleet_manager', 'operations'],
                titleTemplate: 'Pemberitahuan Otomasi AI',
                messageTemplate: 'Tindakan automasi telah berhasil diproses oleh sistem.',
                priority: 'normal',
                throttling: { cooldownSeconds: 300, maxPerWindow: 3 },
              },
            },
          },
          {
            id: 'node_end_1',
            type: 'END',
            label: 'Selesai',
            description: 'Alur selesai',
            position: { x: 250, y: 490 },
            config: {},
          },
        ],
        edges: [
          { id: 'e1', sourceNodeId: 'node_event_1', targetNodeId: 'node_ai_1' },
          { id: 'e2', sourceNodeId: 'node_ai_1', targetNodeId: 'node_act_1' },
          { id: 'e3', sourceNodeId: 'node_act_1', targetNodeId: 'node_notif_1' },
          { id: 'e4', sourceNodeId: 'node_notif_1', targetNodeId: 'node_end_1' },
        ],
      },
      explanation: {
        whatItDoes: 'Mengeksekusi analisis cerdas berdasarkan parameter telematika yang dimasukkan.',
        whenItRuns: 'Dapat dijalankan berdasarkan event pemicu atau jadwal rutin.',
        whatDataItUses: 'Data telematika sensor armada dan profil driver.',
        whatAIAnalyzes: 'AI menganalisis pola korelasi multi-parameter.',
        whatActionsItPerforms: 'Menghasilkan tiket alert dan log terkelola.',
        whoReceivesNotification: 'Manajer Armada & Tim Operasional.',
      },
    };
  }
}

export const naturalLanguageAutomationParser = NaturalLanguageAutomationParser.getInstance();
