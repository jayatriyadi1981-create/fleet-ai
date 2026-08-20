export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  unitLabel: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  badge?: string;
  popular?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  tag: string;
  keyMetric: string;
  popularUseCases: string[];
}

export interface ProblemItem {
  title: string;
  description: string;
  iconName: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge?: string;
  category: 'TELEMATICS' | 'MANAGEMENT' | 'AI_SAFETY' | 'ANALYTICS';
  highlights: string[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export const landingContent = {
  announcement: {
    text: "✦ Fleet Intelligence Smart AI v2.5 — Platform Telematika AI & IoT Generasi Baru Indonesia.",
    cta: "Pelajari Fitur AI →",
    link: "#ai",
  },
  hero: {
    badge: "Smart AI & IoT Telematics Platform Indonesia",
    titlePrefix: "Kendalikan Seluruh Armada.",
    titleMiddle: "Tingkatkan Efisiensi.",
    titleHighlight: "Keputusan Lebih Cerdas dengan Smart AI.",
    description:
      "Platform Fleet Management & Telematics Enterprise terpadu untuk melacak posisi kendaraan realtime, mendeteksi kebocoran BBM Biosolar, memprediksi kerusakan mesin, memantau keselamatan pengemudi, dan memangkas biaya operasional hingga 25%.",
    ctaPrimary: "Request Demo Gratis",
    ctaSecondary: "Login ke Dashboard",
    trustText: "Telah dipercaya oleh 500+ korporasi transportasi, logistik, pertambangan, dan rental di seluruh Indonesia.",
  },
  trustMetrics: [
    { label: "Fleet Monitoring", value: "24/7", desc: "Akses lokasi & status tanpa jeda" },
    { label: "GPS Tracking", value: "5 Detik", desc: "Akurasi interval refresh live" },
    { label: "Efisiensi BBM", value: "s/d 18%", desc: "Penurunan biaya solar abnormal" },
    { label: "Uptime SLA", value: "99.99%", desc: "Infrastruktur cloud enterprise" },
  ],
  problems: [
    {
      title: "Posisi kendaraan sulit dipantau",
      description: "Tidak mengetahui posisi pasti kendaraan, rute yang diambil pengemudi, dan ketidakpastian estimasi waktu kedatangan (ETA).",
      iconName: "MapPin",
    },
    {
      title: "Biaya BBM tinggi & kebocoran solar",
      description: "Kesulitan menemukan kendaraan dengan konsumsi BBM tidak wajar, mesin idle berjam-jam, dan transaksi pengisian solar fiktif.",
      iconName: "Fuel",
    },
    {
      title: "Kerusakan mendadak & servis terlambat",
      description: "Truk mogok di jalan raya mengakibatkan ongkos derek bengkak, penalti keterlambatan pengiriman, dan biaya sparepart melonjak.",
      iconName: "Wrench",
    },
    {
      title: "Perilaku berbahaya & risiko pengemudi",
      description: "Overspeed di jalan tol, rem mendadak (harsh braking), dan jam mengemudi melebihi batas tanpa istirahat sulit diawasi.",
      iconName: "ShieldAlert",
    },
    {
      title: "Dokumen & surat jalan berserakan",
      description: "Masa berlaku STNK, KIR, asuransi, serta bukti serah terima (POD) manual sering hilang dan terlambat diperpanjang.",
      iconName: "FolderX",
    },
    {
      title: "Laporan bulanan lambat & manual",
      description: "Manajemen membutuhkan waktu berhari-hari untuk merekap operasional per cabang dan menghitung Cost per Kilometer (CPK).",
      iconName: "Clock",
    },
  ],
  solutionEcosystem: {
    title: "Satu Ekosistem Terpadu untuk Seluruh Siklus Operasional",
    subtitle: "Mengubah data telematika mentah GPS menjadi insight aksi bisnis otomatis dalam hitungan detik.",
    steps: [
      { step: "01", name: "IoT GPS Gateway", desc: "Sensor lokasi, OBD-II, sensor BBM, dan CANbus terhubung" },
      { step: "02", name: "Telematics Engine", desc: "Normalisasi dan pemrosesan data telematika 5 detik" },
      { step: "03", name: "Smart AI Intelligence", desc: "Machine Learning deteksi anomali, siphoning & fatigue" },
      { step: "04", name: "Automated Dispatch", desc: "Peringatan dini, work order otomatis & coaching driver" },
      { step: "05", name: "Executive ROI", desc: "Efisiensi biaya operasional & transparansi armada" },
    ],
  },
  // 10 Core Product Features requested by User
  coreFeatures: [
    {
      id: "gps-tracking",
      title: "Real-Time GPS Tracking",
      shortTitle: "GPS Tracking",
      description: "Pantau lokasi kendaraan secara realtime dengan interval pembaruan 5 detik, status mesin ON/OFF, kecepatan live, dan visualisasi rute interaktif.",
      iconName: "Radio",
      badge: "Realtime",
      category: "TELEMATICS" as const,
      highlights: ["Interval update 5 detik", "Status Mesin ON/OFF", "Engine Cut-Off Remote", "Street View & Satellite"],
    },
    {
      id: "fleet-management",
      title: "Fleet Management",
      shortTitle: "Fleet Control",
      description: "Kelola master data seluruh kendaraan (truk, blindvan, mobil dinas, alat berat), alokasi cabang/depo, plat nomor, odometer, dan kapasitas muatan.",
      iconName: "Truck",
      badge: "Enterprise",
      category: "MANAGEMENT" as const,
      highlights: ["Multi-Cabang & Depo", "Spesifikasi Kendaraan", "Odometer & Jam Mesin", "Dokumen STNK & KIR"],
    },
    {
      id: "driver-management",
      title: "Driver Management",
      shortTitle: "Driver Control",
      description: "Database profil pengemudi lengkap dengan catatan SIM, verifikasi identitas, jadwal shift, absensi mobile, dan riwayat penugasan armada.",
      iconName: "Users",
      category: "MANAGEMENT" as const,
      highlights: ["Profil & Expiry SIM", "Assignment Driver ke Unit", "Riwayat Perjalanan Driver", "Aplikasi Mobile Driver"],
    },
    {
      id: "fuel-management",
      title: "Fuel Management",
      shortTitle: "BBM & Solar",
      description: "Telematika bahan bakar presisi: deteksi penurunan volume solar mendadak (siphoning), pemborosan idle mesin, dan rasio konsumsi km/liter.",
      iconName: "Fuel",
      badge: "Smart Sensor",
      category: "TELEMATICS" as const,
      highlights: ["Deteksi Kebocoran / Siphoning", "Analisis Idle Time BBM", "Audit Struk SPBU vs Odo", "Efisiensi Km per Liter"],
    },
    {
      id: "maintenance",
      title: "Predictive Maintenance",
      shortTitle: "Perawatan Mesin",
      description: "Prediksi potensi kegagalan komponen mekanis berdasarkan jam kerja mesin dan data getaran, otomatisasi jadwal servis, dan Work Order bengkel.",
      iconName: "Wrench",
      category: "MANAGEMENT" as const,
      highlights: ["Prediksi Kerusakan AI", "Work Order & Approval", "Pengingat Servis Berkala", "Riwayat Biaya Bengkel"],
    },
    {
      id: "geofencing",
      title: "Geofencing & Polygon Zones",
      shortTitle: "Geofencing",
      description: "Buat zona virtual tanpa batas untuk area pabrik, pelabuhan, gudang, dan rute pelanggan dengan notifikasi instan saat unit masuk atau keluar.",
      iconName: "MapPin",
      category: "TELEMATICS" as const,
      highlights: ["Polygon, Lingkaran & Koridor", "Dwell Time (Waktu Parkir)", "Notifikasi In/Out Realtime", "Zona Terlarang (Blacklist)"],
    },
    {
      id: "route-management",
      title: "Route Management & Optimization",
      shortTitle: "Manajemen Rute",
      description: "Perencanaan dan optimasi rute pengiriman multi-drop point otomatis, panduan rute terhemat, serta evaluasi deviasi jalur pengemudi.",
      iconName: "Route",
      badge: "AI Optimizer",
      category: "ANALYTICS" as const,
      highlights: ["Optimasi Multi-Drop Point", "Deteksi Deviasi Rute", "Estimasi Waktu Tiba (ETA)", "Riwayat Playback Jalur"],
    },
    {
      id: "ai-analytics",
      title: "AI Fleet Analytics",
      shortTitle: "Smart AI Hub",
      description: "Kecerdasan buatan terpadu untuk pencarian bahasa alami (Fleet Copilot), peramalan biaya operasional, dan identifikasi anomali armada otomatis.",
      iconName: "Sparkles",
      badge: "Generative AI",
      category: "AI_SAFETY" as const,
      highlights: ["Tanya Armada Bahasa Alami", "Deteksi Anomali Otomatis", "Forecasting Biaya & BBM", "Executive Summary Briefing"],
    },
    {
      id: "safety-management",
      title: "Safety Management & Driver Scorecard",
      shortTitle: "Keselamatan & Safety",
      description: "Sistem penilaian keselamatan berkendara (Safety Score 0-100), pencegahan kelelahan pengemudi (Hours of Service), harsh brake & overspeed.",
      iconName: "ShieldAlert",
      badge: "Safety First",
      category: "AI_SAFETY" as const,
      highlights: ["Safety Scorecard (0-100)", "Alarm Overspeed & Rem Kasar", "Deteksi Driver Fatigue (HOS)", "Modul Coaching Driver"],
    },
    {
      id: "reports",
      title: "Automated Enterprise Reports",
      shortTitle: "Laporan & BI",
      description: "Ekspor otomatis laporan rekapitulasi operasional, Cost per Kilometer (CPK), jam kerja, dan utilisasi kendaraan ke format PDF, Excel, dan CSV.",
      iconName: "FileSpreadsheet",
      category: "ANALYTICS" as const,
      highlights: ["Laporan Harian/Bulanan Otomatis", "Kalkulasi CPK (Cost/Km)", "Ekspor PDF Berlogo & Excel", "Integrasi Jadwal Email Otomatis"],
    },
  ],
  conversationalDemo: {
    userQuery: "Kenapa konsumsi BBM armada meningkat minggu ini?",
    aiResponse: {
      headline: "Berdasarkan analisis telematika 7 hari terakhir, konsumsi BBM meningkat 8.7% di Cabang Jakarta & Surabaya.",
      factors: [
        "12 kendaraan memiliki waktu mesin idle > 45 menit/hari saat antre bongkar muat di pelabuhan.",
        "7 armada terdeteksi overspeed > 90 km/jam di Tol Trans Jawa.",
        "4 kendaraan mengalami penurunan volume solar mendadak saat parkir malam (anomali siphoning).",
      ],
      savingPotential: "Rp 18.400.000 / bulan",
      actionText: "Lihat Analisis BBM Detail",
    },
  },
  safetyData: {
    score: 94,
    maxScore: 100,
    rating: "Excellent",
    incidentDecrease: "18%",
    highlights: [
      "Overspeed Alarm Terintegrasi Tol",
      "Harsh Braking & Sudden Acceleration Sensor",
      "Jam Kerja & Pencegahan Fatigue (HOS)",
      "Peringatan Otomatis ke Dispatcher",
    ],
  },
  predictiveMaintenanceSample: {
    vehiclePlate: "B 9123 XYZ",
    vehicleModel: "Hino Ranger FL 235",
    riskLevel: "HIGH",
    issue: "Suhu radiator naik 12% di atas normal & jam kerja oli mesin terlampaui 1,200 km",
    action: "Jadwalkan Servis Berkala & Work Order Radiator",
  },
  // 12 Industry Solutions requested by User
  industries: [
    {
      id: "logistics",
      name: "Logistics",
      subtitle: "Logistik & Pergudangan",
      description: "Jaminan SLA pengiriman on-time, pemantauan status muatan kontainer, dan transparansi pelacakan langsung ke pelanggan.",
      iconName: "Package",
      tag: "Supply Chain",
      keyMetric: "99.4% On-Time Delivery",
      popularUseCases: ["Live Tracking untuk Klien", "Integrasi WMS Gudang", "Laporan ETA Realtime"],
    },
    {
      id: "expedition",
      name: "Expedition",
      subtitle: "Ekspedisi & Kargo Antarpulau",
      description: "Kontrol pergerakan truk wingbox, tronton, dan trailer jarak jauh melintasi koridor Trans Jawa, Sumatra, hingga Indonesia Timur.",
      iconName: "Truck",
      tag: "Cargo & Courier",
      keyMetric: "-18% Waktu Transit",
      popularUseCases: ["Geofence Pelabuhan & Penyeberangan", "Sensor Buka Pintu Box", "Multi-Driver Relay"],
    },
    {
      id: "rental",
      name: "Rental",
      subtitle: "Rental Mobil & Leasing",
      description: "Perlindungan aset 24/7 dari risiko penggelapan, fitur pemutus mesin jarak jauh (remote immobilizer), dan pemantauan batas area sewa.",
      iconName: "Key",
      tag: "Asset Protection",
      keyMetric: "100% Asset Recovery",
      popularUseCases: ["Engine Immobilizer Remote", "Alarm Lepas Aki / Tamper", "Geofence Wilayah Sewa"],
    },
    {
      id: "transportation",
      name: "Transportation",
      subtitle: "Transportasi Berat & Logistik Khusus",
      description: "Manajemen armada pengangkutan bahan kimia, semen curah, tabung gas, dan muatan khusus dengan standar HSE ketat.",
      iconName: "Navigation",
      tag: "Heavy Transport",
      keyMetric: "Zero Fatal Incident",
      popularUseCases: ["Sensor Suhu & Tekanan", "Sertifikasi HSE & KIR", "Safety Scorecard Driver"],
    },
    {
      id: "bus",
      name: "Bus",
      subtitle: "Bus Antarkota & Pariwisata",
      description: "Keamanan penumpang prima, pemantauan batas kecepatan maksimum bus, monitoring AC penumpang, dan ketepatan jadwal trayek.",
      iconName: "Bus",
      tag: "Public Transport",
      keyMetric: "-25% Pelanggaran Kecepatan",
      popularUseCases: ["Batas Kecepatan Tol", "Monitoring Jam Istirahat Supir", "Integrasi Tiket & Jadwal"],
    },
    {
      id: "travel",
      name: "Travel",
      subtitle: "Travel Shuttle & Jemputan",
      description: "Akurasi penjemputan penumpang point-to-point, evaluasi rute tercepat menghindari kemacetan, dan transparansi ke penumpang.",
      iconName: "Compass",
      tag: "Shuttle Service",
      keyMetric: "98% Ketepatan Penjemputan",
      popularUseCases: ["Optimasi Titik Antar-Jemput", "Aplikasi Mobile Driver", "Monitoring BBM Armada"],
    },
    {
      id: "mining",
      name: "Mining",
      subtitle: "Pertambangan & Heavy Equipment",
      description: "Pelacakan dump truck tambang, excavator, dan loader di remote area dengan sinyal satelit, monitoring jam kerja (Hour Meter), dan efisiensi solar.",
      iconName: "HardHat",
      tag: "Heavy Equipment",
      keyMetric: "+22% Utilisasi Alat",
      popularUseCases: ["Hour Meter Mesin", "Telematika Konsumsi Solar", "Zona Pit & Disposal Tambang"],
    },
    {
      id: "plantation",
      name: "Plantation",
      subtitle: "Perkebunan & Sawit",
      description: "Pengawasan truk pengangkut Tandan Buah Segar (TBS) sawit di area perkebunan luas dengan penyimpanan data offline dan sinkronisasi otomatis.",
      iconName: "Trees",
      tag: "Agriculture",
      keyMetric: "-15% Siklus Angkut TBS",
      popularUseCases: ["Penyimpanan Data Offline GPS", "Peta Blok Perkebunan", "Pencegahan Muatan Liar"],
    },
    {
      id: "construction",
      name: "Construction",
      subtitle: "Kontraktor & Konstruksi Proyek",
      description: "Kelola armada truk mixer semen (molen), crane, dump truck tanah, dan alat proyek infrastruktur agar tepat jadwal di lokasi pengecoran.",
      iconName: "Building2",
      tag: "Infrastructure",
      keyMetric: "-30% Waktu Tunggu Cor",
      popularUseCases: ["Sensor Putaran Drum Molen", "Alokasi Truk ke Batching Plant", "Audit Jam Operasional"],
    },
    {
      id: "distribution",
      name: "Distribution",
      subtitle: "FMCG & Distribusi Ritel",
      description: "Manajemen ribuan titik pengantaran toko harian dengan rute teroptimal, bukti serah terima digital (Proof of Delivery), dan rekap surat jalan.",
      iconName: "Store",
      tag: "FMCG Retail",
      keyMetric: "+35% Kunjungan Toko / Hari",
      popularUseCases: ["Multi-Stop Routing Otomatis", "POD Tanda Tangan Digital & Foto", "Pengawasan Waktu Bongkar"],
    },
    {
      id: "government",
      name: "Government",
      subtitle: "Instansi Pemerintah & BUMN",
      description: "Transparansi penggunaan mobil dinas dinas operasional, pertanggungjawaban anggaran BBM negara, dan audit kepatuhan aset publik.",
      iconName: "Landmark",
      tag: "Public Sector",
      keyMetric: "100% Akuntabilitas Anggaran",
      popularUseCases: ["Audit Penggunaan Mobil Dinas", "Laporan Rekonsiliasi BBM SPBU", "Role Access Tingkat Kementerian"],
    },
    {
      id: "corporate-fleet",
      name: "Corporate Fleet",
      subtitle: "Armada Korporasi & Sales Team",
      description: "Sistem pemesanan (pool car booking) kendaraan dinas kantor, penggantian reimbursement BBM transparan, dan rekap utilisasi per divisi.",
      iconName: "Briefcase",
      tag: "Enterprise Pool",
      keyMetric: "-20% Biaya Armada Kantor",
      popularUseCases: ["Sistem Booking Mobil Dinas", "Otomasi Reimburse BBM", "Evaluasi Produktivitas Sales"],
    },
  ],
  // 5 Trust Pillars requested by User
  trustPillars: [
    {
      id: "security",
      title: "Enterprise Security",
      badge: "ISO 27001 Ready",
      description: "Enkripsi data end-to-end (AES-256), otentikasi multi-faktor (MFA / 2FA), Single Sign-On (SSO), dan perlindungan dari ancaman siber.",
      iconName: "Lock",
      points: ["Enkripsi AES-256 & SSL TLS 1.3", "Role-Based Access Control (9 Peran)", "Audit Log Aktivitas Terpusat"],
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud Infrastructure",
      badge: "99.99% Uptime",
      description: "Arsitektur cloud terdistribusi dengan auto-scaling otomatis, latensi rendah untuk telematika Indonesia, dan failover multi-region.",
      iconName: "Cloud",
      points: ["High Availability SLA 99.99%", "Data Center Indonesia & Singapura", "Skalabilitas s/d 50.000+ Unit"],
    },
    {
      id: "data-protection",
      title: "Data Protection & Privacy",
      badge: "Multi-Tenant Isolation",
      description: "Isolasi data ketat antartenant perusahaan. Data lokasi armada, rute, dan finansial Anda dijamin terproteksi dan tidak pernah dibagikan.",
      iconName: "ShieldCheck",
      points: ["Isolasi Database Multi-Tenant", "Redaksi PII (Data Pribadi) Otomatis", "Backup Data Otomatis Harian"],
    },
    {
      id: "monitoring",
      title: "24/7 Proactive Monitoring",
      badge: "24/7 Telemetry SOC",
      description: "Pusat operasi telematika aktif 24 jam nonstop untuk mendeteksi heartbeat GPS, memantau server, dan memastikan peringatan darurat terkirim.",
      iconName: "Activity",
      points: ["Pusat Pemantauan Server 24/7/365", "Deteksi Sinyal GPS Terputus", "Notifikasi Multi-Kanal (WA/Push/Email)"],
    },
    {
      id: "api-integration",
      title: "API & Enterprise Integration",
      badge: "REST & Webhooks",
      description: "Integrasikan data telematika dengan lancar ke sistem ERP perusahaan (SAP, Oracle, Odoo, Microsoft Dynamics) melalui REST API dan Webhooks.",
      iconName: "Code2",
      points: ["OpenAPI 3.0 Standard & SDK", "Webhooks Event Realtime", "Kompatibel Sensor IoT Pihak Ketiga"],
    },
  ],
  // 4 Pricing Tiers requested by User
  pricingPlans: [
    {
      id: "starter",
      name: "STARTER",
      description: "Solusi esensial untuk bisnis berkembang atau armada kecil hingga 15 kendaraan yang membutuhkan pelacakan live akurat.",
      monthlyPrice: "Rp 79.000",
      annualPrice: "Rp 69.000",
      unitLabel: "/ unit / bulan",
      features: [
        "Live GPS Tracking (Interval 10 Detik)",
        "Playback Riwayat Perjalanan 30 Hari",
        "Status Mesin ON/OFF & Odometer",
        "Geofence Polygon & Lingkaran (s/d 10 Zona)",
        "Manajemen Kendaraan & Pengemudi",
        "Laporan Jarak Tempuh & Perjalanan (PDF/Excel)",
        "Aplikasi Web & Mobile (Android/iOS)",
        "Support Teknis Standar via Email & Chat",
      ],
      ctaText: "Mulai Paket Starter",
    },
    {
      id: "business",
      name: "BUSINESS",
      description: "Paket komprehensif untuk perusahaan logistik, rental, dan distribusi menengah yang ingin menekan biaya BBM dan risiko armada.",
      monthlyPrice: "Rp 119.000",
      annualPrice: "Rp 99.000",
      unitLabel: "/ unit / bulan",
      popular: true,
      badge: "Paling Populer",
      features: [
        "Semua fitur Paket Starter",
        "Interval GPS Realtime Cepat (5 Detik)",
        "Telematika BBM Biosolar & Deteksi Mesin Idle",
        "Driver Safety Scorecard & Alarm Overspeed",
        "Geofence Depo & Rute Tidak Terbatas",
        "Remote Engine Cut-Off (Immobilizer)",
        "Modul Pengingat STNK, KIR & Servis Berkala",
        "Multi-User Access & Manajemen Peran Cabang",
        "Playback Riwayat Perjalanan 90 Hari",
        "Dukungan WhatsApp Priority Support",
      ],
      ctaText: "Pilih Paket Business",
    },
    {
      id: "professional",
      name: "PROFESSIONAL",
      description: "Untuk operasional skala besar yang membutuhkan kekuatan Smart AI, pemeliharaan prediktif, dan optimasi rute cerdas.",
      monthlyPrice: "Rp 169.000",
      annualPrice: "Rp 149.000",
      unitLabel: "/ unit / bulan",
      highlighted: true,
      badge: "Smart AI Powered",
      features: [
        "Semua fitur Paket Business",
        "Smart AI Fleet Intelligence & Copilot Asisten",
        "Deteksi Kebocoran Solar (Siphoning Anomaly AI)",
        "Predictive Maintenance & Work Order Bengkel",
        "AI Route Optimization & Multi-Drop Planning",
        "Driver Fatigue & Hours of Service (HOS) Engine",
        "Executive Daily AI Briefing & Analisis CPK",
        "Playback Riwayat Perjalanan 1 Tahun Penuh",
        "Integrasi Sensor Suhu Kargo & Pintu Box",
        "Dedicated Account Manager & Training Tim",
      ],
      ctaText: "Mulai Uji Coba Professional",
    },
    {
      id: "enterprise",
      name: "ENTERPRISE",
      description: "Solusi telematika kustom untuk korporasi besar, tambang, BUMN, dan armada 100+ unit dengan integrasi ERP dan SLA 99.99%.",
      monthlyPrice: "Hubungi Sales",
      annualPrice: "Custom Pricing",
      unitLabel: "Kustom / Sesuai Kebutuhan",
      badge: "Custom SLA & ERP",
      features: [
        "Semua fitur Paket Professional",
        "Dedicated Private Cloud / On-Premise Gateway",
        "Integrasi REST API & Webhooks ke SAP / ERP",
        "Koneksi Sensor Berat Muatan (Axle Load) & CANbus",
        "Custom Machine Learning Model untuk Armada Anda",
        "Perjanjian Layanan Service Level Agreement (SLA 99.99%)",
        "Audit Keamanan Enterprise & Dukungan SSO",
        "Dukungan Tim Teknis On-Site & Instalasi Nasional",
      ],
      ctaText: "Konsultasi Enterprise",
    },
  ],
  howItWorks: [
    { step: "01", title: "Pasang GPS Tracker IoT", description: "Pasang perangkat GPS tracker pilihan atau sambungkan gateway telematika yang sudah terpasang pada unit armada Anda." },
    { step: "02", title: "Registrasi Armada & Cabang", description: "Masukkan nomor polisi, tipe kendaraan, masa berlaku STNK/KIR, dan alokasikan ke cabang operasional." },
    { step: "03", title: "Assign Pengemudi & Dispatch", description: "Hubungkan pengemudi dengan kendaraan, tetapkan jadwal pengiriman, dan aktifkan batasan rute/geofence." },
    { step: "04", title: "Pantau Realtime di Peta Live", description: "Lihat pergerakan live, evaluasi kecepatan, pantau konsumsi BBM Biosolar, dan terima alert seketika." },
    { step: "05", title: "Optimasi dengan Smart AI", description: "Manfaatkan rekomendasi kecerdasan buatan untuk menghemat BBM, mencegah mogok, dan memangkas biaya operasional." },
  ],
  testimonials: [
    {
      quote: "Penghematan solar hingga 14% langsung kami rasakan di bulan pertama. Fleet AI mendeteksi truk yang idle berlebihan saat antre di pelabuhan dan memotong jam kerja mesin sia-sia.",
      author: "Budi Santoso",
      role: "Head of Logistics Operations",
      company: "PT Trans Cemerlang Express (Logistik)",
    },
    {
      quote: "Fitur Driver Safety Scorecard dan alarm fatigue sangat efektif mengurangi insiden di jalan tol. Disiplin supir meningkat drastis dan premi asuransi armada kami turun 20%.",
      author: "Hendra Wijaya",
      role: "Fleet & Safety Director",
      company: "PT Kargo Nusantara Utama (Transportasi)",
    },
    {
      quote: "Fitur deteksi siphoning BBM menyelamatkan puluhan juta rupiah per bulan di unit tambang kami. Ditambah asisten AI yang bisa langsung menjawab pertanyaan armada dalam hitungan detik.",
      author: "Raden Gunawan",
      role: "Operations VP",
      company: "PT Borneo Mineral Transport (Mining)",
    },
  ],
  faqs: [
    {
      question: "Apakah perangkat GPS lama perusahaan kami bisa diintegrasikan?",
      answer: "Ya. Fleet Intelligence mendukung lebih dari 100+ protokol perangkat GPS IoT global terkemuka termasuk GT06, Concox, Teltonika, TK103, Meitrack, Queclink, dan OBD-II standard.",
    },
    {
      question: "Bagaimana cara kerja deteksi pencurian BBM solar (siphoning)?",
      answer: "Sistem menggunakan sensor ultrasonik BBM berakurasi tinggi yang dipadukan dengan algoritma AI. Jika terjadi penurunan drastis volume bahan bakar saat mesin dalam kondisi mati, alarm instan seketika dikirim ke dispatcher.",
    },
    {
      question: "Apakah tersedia aplikasi mobile untuk pengemudi dan manajemen?",
      answer: "Tentu. Tersedia aplikasi mobile responsif untuk manajemen (iOS & Android) untuk memantau armada dari mana saja, serta aplikasi khusus Driver untuk absensi, rute navigasi, dan Proof of Delivery (POD) digital.",
    },
    {
      question: "Bagaimana integrasi dengan sistem ERP perusahaan seperti SAP atau Oracle?",
      answer: "Paket Professional dan Enterprise menyediakan REST API lengkap berstandar OpenAPI 3.0 dan Webhooks realtime untuk integrasi data perjalanan, konsumsi BBM, dan status armada ke ERP perusahaan Anda.",
    },
    {
      question: "Bagaimana sistem AI memberikan rekomendasi operasional?",
      answer: "Sistem AI menganalisis ribuan titik data telematika harian (jarak, kecepatan, BBM, jam kerja, suhu mesin) lalu membandingkannya dengan pola operasional optimal. AI kemudian menyajikan rekomendasi hemat biaya dalam bahasa Indonesia yang sederhana.",
    },
    {
      question: "Apakah data perusahaan dan posisi lokasi armada aman?",
      answer: "Keamanan data adalah prioritas utama. Seluruh data diisolasi per tenant perusahaan, dienkripsi saat transmisi, dan hanya dapat diakses oleh user yang memiliki otoritas resmi dari perusahaan Anda.",
    },
  ],
  finalCta: {
    title: "Siap Mengubah Cara Anda Mengelola Armada?",
    subtitle: "Mulai pantau armada secara realtime, cegah pemborosan BBM, dan gunakan kecerdasan AI untuk mengambil keputusan operasional yang lebih tepat.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Jadwalkan Demo Perusahaan",
  },
};

