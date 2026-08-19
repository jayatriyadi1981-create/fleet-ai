export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  badge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface ProblemItem {
  title: string;
  description: string;
  iconName: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export const landingContent = {
  announcement: {
    text: "✦ Smart AI Fleet Management untuk era transportasi modern Indonesia.",
    cta: "Pelajari Lebih Lanjut →",
    link: "#ai",
  },
  hero: {
    titlePrefix: "Kendalikan Armada.",
    titleMiddle: "Optimalkan Operasional.",
    titleHighlight: "Ambil Keputusan Lebih Cerdas dengan AI.",
    description:
      "Platform Fleet Management berbasis GPS dan Smart AI untuk memantau kendaraan secara realtime, meningkatkan keselamatan, mengoptimalkan BBM, memprediksi maintenance, dan membantu perusahaan mengurangi biaya operasional.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Lihat Demo",
    trustText: "Dirancang & diuji untuk kebutuhan bisnis & jalanan Indonesia.",
  },
  trustMetrics: [
    { label: "Fleet Monitoring", value: "24/7", desc: "Akses lokasi & status tanpa henti" },
    { label: "GPS Tracking", value: "Realtime", desc: "Akurasi interval 5 detik" },
    { label: "AI Analytics", value: "Smart AI", desc: "Deteksi anomali & rekomendasi" },
    { label: "Multi-Platform", value: "Web & Mobile", desc: "Desktop, Tablet, iOS & Android" },
  ],
  problems: [
    {
      title: "Kendaraan sulit dipantau",
      description: "Tidak mengetahui posisi pasti kendaraan, rute yang diambil, dan kepastian estimasi waktu kedatangan secara realtime.",
      iconName: "MapPin",
    },
    {
      title: "Biaya BBM tinggi & bocor",
      description: "Kesulitan menemukan kendaraan dengan konsumsi BBM Biosolar tidak normal, transaksi SPBU fiktif, dan kecurangan solar.",
      iconName: "Fuel",
    },
    {
      title: "Maintenance terlambat",
      description: "Kerusakan baru diketahui setelah armada mogok di jalan, menyebabkan ongkos perbaikan membengkak dan waktu pengiriman tertunda.",
      iconName: "Wrench",
    },
    {
      title: "Risiko keselamatan driver",
      description: "Perilaku berbahaya seperti overspeed, rem mendadak (harsh braking), dan jam kerja mengantuk sulit terawasi.",
      iconName: "ShieldAlert",
    },
    {
      title: "Data operasional tersebar",
      description: "Catatan riwayat perjalanan, surat jalan, STNK/KIR, dan biaya servis tersimpan acak di kertas dan chat WhatsApp.",
      iconName: "FolderX",
    },
    {
      title: "Keputusan manajemen lambat",
      description: "Butuh berhari-hari untuk merekap laporan bulanan dan menemukan kendaraan mana yang menyerap biaya paling besar.",
      iconName: "Clock",
    },
  ],
  solutionEcosystem: {
    title: "Satu Platform untuk Seluruh Operasional Armada",
    subtitle: "Fleet Intelligence mengubah data telematika mentah menjadi insight aksi bisnis secara otomatis.",
    steps: [
      { step: "01", name: "GPS IoT Gateway", desc: "Sensor lokasi, BBM, dan mesin terhubung" },
      { step: "02", name: "Fleet Data Engine", desc: "Normalisasi data telematika secara realtime" },
      { step: "03", name: "AI Intelligence", desc: "Analisis kecerdasan buatan & deteksi anomali" },
      { step: "04", name: "Actionable Insights", desc: "Peringatan dini & rekomendasi optimasi" },
      { step: "05", name: "Business Growth", desc: "Penghematan biaya & operasi lebih aman" },
    ],
  },
  coreFeatures: [
    {
      id: "gps",
      title: "Live GPS Tracking",
      description: "Pantau lokasi kendaraan secara realtime dengan pembaruan interval cepat, riwayat rute, dan geofence depo.",
      iconName: "MapPin",
      badge: "Realtime",
    },
    {
      id: "fleet",
      title: "Fleet Management",
      description: "Kelola data kendaraan, pengemudi, STNK, KIR, pengelompokan cabang, dan assignment status dalam satu sistem.",
      iconName: "Truck",
    },
    {
      id: "ai",
      title: "AI Intelligence Hub",
      description: "Dapatkan analisis otomatis, asisten percakapan AI, deteksi risiko, dan forecasting operasional.",
      iconName: "Sparkles",
      badge: "Smart AI",
    },
    {
      id: "fuel",
      title: "Fuel Management",
      description: "Analisis konsumsi BBM Biosolar, deteksi kebocoran solar, waktu idle mesin berlebih, dan efisiensi per kilometer.",
      iconName: "Fuel",
    },
    {
      id: "maintenance",
      title: "Predictive Maintenance",
      description: "Identifikasi potensi kerusakan mesin sebelum terjadi, kelola Work Order perbaikan, dan jadwal servis berkala.",
      iconName: "Wrench",
    },
    {
      id: "safety",
      title: "Driver Safety Scorecard",
      description: "Sistem penilaian pengemudi berdasarkan overspeed, harsh braking, akselerasi mendadak, dan risiko kecelakaan.",
      iconName: "ShieldAlert",
    },
    {
      id: "geofence",
      title: "Geofence & POI Area",
      description: "Buat zona virtual untuk pabrik, pelabuhan, dan pelanggan dengan notifikasi otomatis saat kendaraan masuk/keluar.",
      iconName: "Map",
    },
    {
      id: "alerts",
      title: "Real-time Alerts",
      description: "Terima notifikasi instan untuk kondisi kritis seperti mesin mati mendadak, pemutusan aki, atau kontak darurat.",
      iconName: "Bell",
    },
    {
      id: "analytics",
      title: "Fleet Analytics",
      description: "Grafik kinerja utilitas armada, perbandingan efisiensi antarcabang, dan analisis biaya operasional bulanan.",
      iconName: "BarChart3",
    },
    {
      id: "reports",
      title: "Automated Reports",
      description: "Generate laporan perjalanan, pengeluaran BBM, dan jam kerja driver secara otomatis dalam format PDF dan Excel.",
      iconName: "FileText",
    },
  ],
  conversationalDemo: {
    userQuery: "Kenapa konsumsi BBM armada meningkat minggu ini?",
    aiResponse: {
      headline: "Berdasarkan analisis telematika 7 hari terakhir, konsumsi BBM meningkat 8.7% di Cabang Jakarta & Surabaya.",
      factors: [
        "12 kendaraan memiliki waktu mesin idle > 45 menit/hari saat bongkar muat.",
        "7 armada terdeteksi overspeed > 90 km/jam di Tol Trans Jawa.",
        "4 kendaraan mengalami kenaikan rasio konsumsi solar abnormal (potensi kebocoran/pencurian).",
      ],
      savingPotential: "Rp 18.400.000 / bulan",
      actionText: "Lihat Analisis BBM Detail",
    },
  },
  safetyData: {
    score: 92,
    maxScore: 100,
    rating: "Excellent",
    incidentDecrease: "14%",
    highlights: [
      "Overspeed Alarm Terintegrasi",
      "Harsh Braking & Acceleration Sensor",
      "Jam Kerja & Pencegahan Fatigue",
      "Peringatan Otomatis ke Dispatcher",
    ],
  },
  predictiveMaintenanceSample: {
    vehiclePlate: "B 9123 XYZ",
    vehicleModel: "Hino Ranger FL 235",
    riskLevel: "HIGH",
    issue: "Suhu mesin naik 12% di atas rata-rata & masa ganti oli terlampaui 1,200 km",
    action: "Jadwalkan Servis Berkala & Cek Radiator",
  },
  industries: [
    {
      id: "logistics",
      name: "Logistik & Ekspedisi",
      description: "Optimalkan pengiriman tepat waktu, pelacakan kontainer, dan kepastian SLA ke pelanggan.",
      iconName: "Package",
      tag: "Logistics",
    },
    {
      id: "transport",
      name: "Transportasi & Cargo",
      description: "Pantau truk tronton, wingbox, dan trailer secara terus-menerus di seluruh jalur pulau.",
      iconName: "Truck",
      tag: "Transport",
    },
    {
      id: "rental",
      name: "Rental & Leasing Kendaraan",
      description: "Lindungi aset kendaraan dari pencurian, pemutusan GPS, dan penyalahgunaan area.",
      iconName: "Key",
      tag: "Rental",
    },
    {
      id: "distribution",
      name: "FMCG & Distribusi",
      description: "Kontrol pengiriman barang harian ke ribuan outlet toko dengan kepastian rute hemat.",
      iconName: "Store",
      tag: "FMCG",
    },
    {
      id: "mining",
      name: "Tambang & Heavy Equipment",
      description: "Monitor jam kerja dump truck tambang, konsumsi alat berat, dan kondisi area ekstrem.",
      iconName: "HardHat",
      tag: "Mining",
    },
    {
      id: "construction",
      name: "Kontraktor & Konstruksi",
      description: "Kelola armada semen, crane, dan kendaraan operasional proyek lapangan.",
      iconName: "Building",
      tag: "Construction",
    },
    {
      id: "manufacturing",
      name: "Manufaktur & Pabrik",
      description: "Integrasikan armada antar-pabrik dengan pasokan bahan baku secara lancar.",
      iconName: "Factory",
      tag: "Manufacturing",
    },
    {
      id: "oilgas",
      name: "Oil & Gas / B3 Hazardous",
      description: "Standar keselamatan ekstra ketat untuk pengangkutan bahan bakar dan kimia berbahaya.",
      iconName: "Droplet",
      tag: "Oil & Gas",
    },
    {
      id: "passenger",
      name: "Bus & Travel Penumpang",
      description: "Keamanan penumpang utama dengan kenyamanan rute dan pemantauan batas kecepatan.",
      iconName: "Bus",
      tag: "Passenger",
    },
  ],
  howItWorks: [
    { step: "01", title: "Hubungkan GPS Device", description: "Pasang GPS tracker atau hubungkan API gateway IoT yang telah terpasang di kendaraan Anda." },
    { step: "02", title: "Tambahkan Data Armada", description: "Daftarkan nomor plat, tipe kendaraan, cabang operasional, dan surat dokumen STNK/KIR." },
    { step: "03", title: "Assign Pengemudi", description: "Hubungkan driver dengan kendaraan operasional dan tetapkan rute perjalanan dispatch." },
    { step: "04", title: "Pantau & Analisis Realtime", description: "Lihat lokasi live di peta, terima notifikasi kondisi kritis, dan evaluasi konsumsi BBM." },
    { step: "05", title: "Optimalkan dengan AI", description: "Gunakan rekomendasi kecerdasan buatan untuk menghemat biaya operasional dan memperpanjang umur mesin." },
  ],
  pricingPlans: [
    {
      id: "starter",
      name: "STARTER FLEET",
      description: "Cocok untuk UMKM, pengusaha rental, atau armada kecil hingga 10 unit.",
      price: "Rp 89.000",
      billingPeriod: "/ unit / bulan",
      features: [
        "Live GPS Tracking (Interval 10 Detik)",
        "Manajemen Kendaraan & Driver Basic",
        "Geofence Depo & Peringatan Keluar Area",
        "Laporan Perjalanan & Distance Logs",
        "Notifikasi Peringatan via Web App",
        "Dukungan Aplikasi Mobile",
      ],
      ctaText: "Mulai Paket Starter",
    },
    {
      id: "professional",
      name: "PROFESSIONAL AI",
      description: "Pilihan paling populer untuk perusahaan logistik & transportasi menengah.",
      price: "Rp 149.000",
      billingPeriod: "/ unit / bulan",
      highlighted: true,
      badge: "Paling Populer",
      features: [
        "Semua fitur Paket Starter",
        "Interval GPS Realtime Ultra-Cepat (3-5 Detik)",
        "Telematika BBM Biosolar & Deteksi Kebocoran",
        "AI Fleet Analyst & Asisten Recommendation",
        "Driver Safety Scorecard & Alarm Overspeed",
        "Predictive Maintenance & Work Order System",
        "Akses Multi-Branch & Manajemen User Role",
        "Export Laporan Otomatis Excel & PDF",
      ],
      ctaText: "Pilih Professional AI",
    },
    {
      id: "enterprise",
      name: "ENTERPRISE FLEET",
      description: "Solusi khusus untuk korporasi skala besar, manufaktur, tambang & Oil/Gas.",
      price: "Custom",
      billingPeriod: "Sesuai kebutuhan & SLA",
      features: [
        "Semua fitur Paket Professional",
        "Integrasi Sensor Sensor Suhu / Door / Fuel Cap",
        "API & Webhook Custom untuk ERP/SAP Corporate",
        "Kecerdasan AI Custom Model & Forecasting",
        "Dedicated Account Manager & Training On-Site",
        "Jaminan Service Level Agreement (SLA 99.9%)",
        "Keamanan Khusus Single Sign-On (SSO)",
      ],
      ctaText: "Hubungi Tim Enterprise",
    },
  ],
  testimonials: [
    {
      quote: "Penghematan BBM solar hingga 14% terjadi di bulan pertama penggunaan Fleet Intelligence AI. Kami bisa langsung mendeteksi truk mana yang suka idle berlebihan saat antre bongkar muat.",
      author: "Budi Santoso",
      role: "Logistics Manager",
      company: "PT Trans Cemerlang Express (Sample Preview)",
    },
    {
      quote: "Fitur Driver Safety Scorecard membantu kami mengurangi kecelakaan dan rem mendadak secara signifikan. Pengemudi kini lebih disiplin di jalan tol.",
      author: "Hendra Wijaya",
      role: "Head of Operations",
      company: "PT Kargo Nusantara Utama (Sample Preview)",
    },
  ],
  securityFeatures: [
    { title: "Authentication Secure Access", desc: "Sistem otentikasi ketat dengan opsi multi-factor dan enkripsi kata sandi." },
    { title: "Role-Based Access Control (RBAC)", desc: "Batasi hak akses pengguna berdasarkan cabang, peran Manajer, Dispatcher, atau Teknisi." },
    { title: "Multi-Tenant Data Isolation", desc: "Data telematika dan aset perusahaan diisolasi secara independen di tingkat database." },
    { title: "Enkripsi Data Telematika", desc: "Seluruh lalu lintas data lokasi GPS dan sensor dilindungi dengan TLS 1.3 / HTTPS." },
    { title: "Audit Trail & Activity Logs", desc: "Riwayat aktivitas perubahan data dan penghapusan sistem tercatat penuh untuk keamanan." },
    { title: "Skalabilitas Cloud Reliable", desc: "Arsitektur cloud container modern berdaya tahan tinggi dan tahan lonjakan trafik." },
  ],
  faqs: [
    {
      question: "Apa itu Fleet Intelligence Smart AI?",
      answer: "Fleet Intelligence Smart AI adalah platform pengolahan data telematika GPS dan manajemen armada berbasis cloud yang dilengkapi kecerdasan buatan (AI) untuk membantu perusahaan memantau lokasi kendaraan, efisiensi BBM, keselamatan driver, dan kebutuhan servis mesin secara terpusat.",
    },
    {
      question: "Apakah pelacakan lokasi kendaraan dilakukan secara realtime?",
      answer: "Ya, posisi GPS kendaraan diperbarui secara live setiap 3 hingga 10 detik depending paket yang dipilih. Anda dapat melihat arah kendaraan, kecepatan, dan riwayat animasi perjalanan secara interaktif di peta.",
    },
    {
      question: "Dapatkah platform ini digunakan untuk armada dengan ratusan atau ribuan kendaraan?",
      answer: "Tentu saja. Platform dirancang dengan arsitektur enterprise multi-tenant yang mampu menampung ribuan unit kendaraan, puluhan cabang operasional, dan banyak grup fleet tanpa penurunan performa.",
    },
    {
      question: "Bagaimana cara kerja fitur pemantauan BBM Biosolar B35?",
      answer: "Platform mengambil data dari sensor tangki BBM GPS atau membandingkan rasio jarak tempuh kendaraan dengan standar konsumsi solar. AI akan menandai adanya lonjakan penurunan BBM mendadak (potensi kecurangan/pencurian) serta waktu idle yang tidak efisien.",
    },
    {
      question: "Apakah bisa diakses melalui smartphone Android dan iOS?",
      answer: "Ya! Aplikasi memiliki tampilan Responsive Native View System yang dioptimalkan penuh untuk Android, iPhone/iOS, Tablet, Laptop, dan Desktop. Anda dapat mengontrol armada langsung dari genggaman tangan.",
    },
    {
      question: "Apakah platform ini mendukung perangkat GPS tracker yang sudah kami miliki?",
      answer: "Kami mendukung berbagai standar protokol GPS Gateway populer (seperti JT808, Concox, Queclink, Meitrack, Teltonika, dll.). Tim teknis kami siap membantu integrasi gateway IoT existing Anda.",
    },
    {
      question: "Bagaimana sistem AI memberikan rekomendasi operasional?",
      answer: "Sistem AI menganalisis ribuan titik data telematika harian (jarak, kecepatan, BBM, jam kerja, suhu mesin) lalu membandingkannya dengan pola operasional optimal. AI kemudian menyajikan rekomendasi hemat biaya dalam bahasa Indonesia yang sederhana.",
    },
    {
      question: "Apakah data perusahaan dan posisi lokasi armada aman?",
      answer: "Keamanan data adalah prioritas utama. Seluruh data diisolasi per tenant perusahaan, dienkripsi saat transmisi, dan hanya dapat diakses oleh user yang memiliki otoritas resmi dari perusahaan Anda.",
    },
    {
      question: "Apakah tersedia pilihan laporan otomatis?",
      answer: "Ya, Anda dapat men-generate laporan ringkasan operasional harian, mingguan, atau bulanan dalam format PDF dan Excel yang siap dipresentasikan ke jajaran manajemen.",
    },
    {
      question: "Bagaimana skema biaya dan mekanisme langganan?",
      answer: "Skema biaya menggunakan sistem fleksibel per unit kendaraan per bulan. Tersedia pilihan paket Starter, Professional AI, dan Enterprise sesuai skala bisnis Anda.",
    },
  ],
  finalCta: {
    title: "Siap Mengubah Cara Anda Mengelola Armada?",
    subtitle: "Mulai pantau armada secara realtime, cegah pemborosan BBM, dan gunakan kecerdasan AI untuk mengambil keputusan operasional yang lebih tepat.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Jadwalkan Demo Perusahaan",
  },
};
