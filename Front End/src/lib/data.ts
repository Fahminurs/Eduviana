/**
 * Data dummy/mock untuk seluruh fitur Eduviana.
 * Konten mengikuti tema skripsi "Sistem Parkir Cerdas" (lihat PRD.md &
 * Planning/referensi-fe). Nanti diganti panggilan API FastAPI sungguhan.
 */

/* ========== BAB ========== */

export type ChapterId = "bab1" | "bab2" | "bab3" | "bab4";

export const DEFAULT_CHAPTER: ChapterId = "bab2";

export const chapters: { id: ChapterId; label: string }[] = [
  { id: "bab1", label: "1. Pendahuluan" },
  { id: "bab2", label: "2. Dasar Teori" },
  { id: "bab3", label: "3. Metodologi Perancangan" },
  { id: "bab4", label: "4. Hasil Pengujian" },
];

export function chapterLabel(id: ChapterId) {
  return chapters.find((c) => c.id === id)?.label ?? "";
}

/* ========== Dokumen (History File) ========== */

export type DocStatus = "selesai" | "diproses" | "gagal";

export interface ThesisDocument {
  id: string;
  name: string;
  uploadedAgo: string;
  /** Label tanggal upload untuk timeline di sidebar (mis. "7 Juli"). */
  uploadedDate: string;
  /** Jam upload format jam.menit (mis. "14.20") untuk widget mengambang. */
  uploadedTime: string;
  status: DocStatus;
  chapterCount?: number;
}

export const documents: ThesisDocument[] = [
  {
    id: "doc-v2",
    name: "Laporan_Skripsi_Sistem_Parkir_Cerdas_Revisi_Dosen_Pembimbing_Final_Banget.docx",
    uploadedAgo: "diupload 3 hari lalu",
    uploadedDate: "7 Juli",
    uploadedTime: "14.20",
    status: "selesai",
    chapterCount: 4,
  },
  {
    id: "doc-v1",
    name: "skripsi_v1.docx",
    uploadedAgo: "diupload 2 minggu lalu",
    uploadedDate: "26 Juni",
    uploadedTime: "09.05",
    status: "selesai",
    chapterCount: 4,
  },
  {
    id: "doc-draft",
    name: "draft_bab3.docx",
    uploadedAgo: "diupload baru saja",
    uploadedDate: "10 Juli",
    uploadedTime: "16.42",
    status: "diproses",
  },
];

export const INITIAL_ACTIVE_DOC = "doc-v2";

/* ========== Countdown Sidang & Progres BAB ========== */

/** Tanggal sidang skripsi (bulan 0-indeks: 7 = Agustus). */
export const SIDANG_DATE = new Date(2026, 7, 4);

export type ChapterMastery = "kuasai" | "belajar" | "belum";

export interface ChapterProgress {
  id: ChapterId;
  status: ChapterMastery;
  quizScore: number;
  flashcardMastered: number;
  flashcardTotal: number;
}

export const chapterProgress: Record<ChapterId, ChapterProgress> = {
  bab1: {
    id: "bab1",
    status: "kuasai",
    quizScore: 90,
    flashcardMastered: 5,
    flashcardTotal: 5,
  },
  bab2: {
    id: "bab2",
    status: "belajar",
    quizScore: 65,
    flashcardMastered: 7,
    flashcardTotal: 12,
  },
  bab3: {
    id: "bab3",
    status: "belum",
    quizScore: 0,
    flashcardMastered: 0,
    flashcardTotal: 8,
  },
  bab4: {
    id: "bab4",
    status: "belum",
    quizScore: 0,
    flashcardMastered: 0,
    flashcardTotal: 6,
  },
};

/* ========== Rangkuman ========== */

export type SummaryBlock =
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "callout"; variant: "penting" | "contoh"; text: string }
  | { kind: "figure"; caption: string };

export interface ChapterSummary {
  overview: string;
  keyPoints: string[];
  blocks: SummaryBlock[];
}

export const summaries: Record<ChapterId, ChapterSummary> = {
  bab1: {
    overview:
      "Bab ini memaparkan latar belakang masalah pengelolaan parkir konvensional, kebutuhan akan sistem parkir cerdas, serta solusi yang diusulkan: integrasi deteksi plat nomor otomatis, monitoring slot real-time, dan aplikasi pendukung.",
    keyPoints: [
      "Jumlah kendaraan bermotor di Indonesia mencapai ±166 juta unit (2024), naik rata-rata 6,66% per tahun",
      "Sistem parkir konvensional rawan kesalahan pencatatan dan tidak real-time",
      "Solusi: integrasi YOLO (deteksi objek) + PaddleOCR (baca plat) + sensor slot",
    ],
    blocks: [
      { kind: "h3", text: "1.1 Latar Belakang Masalah" },
      {
        kind: "ul",
        items: [
          "Peningkatan jumlah kendaraan: jumlah kendaraan bermotor terus meningkat, mencapai sekitar 166 juta unit pada 2024; mobil penumpang naik rata-rata 6,66% per tahun.",
          "Tekanan pada ruang parkir: terutama di kota besar — pusat perbelanjaan, perkantoran, dan kampus.",
          "Sistem parkir konvensional tidak efisien: pengelolaan dengan petugas atau papan informasi statis menyebabkan kesalahan pencatatan dan keterlambatan pembaruan status.",
          "Dampak bagi pengemudi: berkeliling mencari slot kosong membuang waktu, menambah kemacetan, dan meningkatkan konsumsi bahan bakar.",
        ],
      },
      {
        kind: "callout",
        variant: "penting",
        text: "Manajemen lahan parkir yang efisien sangat penting untuk mobilitas perkotaan — ini urgensi utama penelitian.",
      },
      { kind: "h3", text: "1.2 Kebutuhan Sistem Parkir Cerdas" },
      {
        kind: "p",
        text: "Sistem parkir konvensional tidak mampu memberikan informasi ketersediaan parkir secara akurat dan real-time. Sistem yang mampu memantau ketersediaan tempat parkir secara langsung membantu pengemudi menemukan slot lebih cepat, mengurangi waktu pencarian dan kemacetan di area parkir.",
      },
      {
        kind: "callout",
        variant: "contoh",
        text: "Integrasi deteksi objek (YOLO) dan pengenalan karakter (PaddleOCR) dipakai untuk mendeteksi kendaraan sekaligus mengidentifikasi status ketersediaan ruang parkir.",
      },
      { kind: "h3", text: "1.3 Sistem yang Diusulkan" },
      {
        kind: "ul",
        items: [
          "Deteksi plat nomor: algoritma YOLOv26 + PaddleOCR di gerbang parkir.",
          "Monitoring slot: mikrokontroler ESP32 + sensor jarak VL53L1X per slot, status real-time.",
          "Aplikasi mobile untuk pengemudi: pantau ketersediaan, reservasi, pembayaran digital.",
          "Web dashboard untuk pengelola: monitoring aktivitas, kelola slot, laporan keuangan.",
        ],
      },
    ],
  },
  bab2: {
    overview:
      "Bab ini membahas dasar teori teknologi pendukung sistem parkir cerdas: konsep deep learning, algoritma deteksi objek YOLO, sensor pengukur jarak, dan komponen perangkat keras yang menjadi tulang punggung sistem.",
    keyPoints: [
      "Sensor VL53L1X (ToF) lebih akurat & rendah latensi dibanding sensor ultrasonik",
      "YOLO menyederhanakan deteksi objek menjadi satu langkah komputasi",
      "ESP32 menjadi unit pemrosesan utama sistem",
      "Multiplekser TCA9548A mengatasi konflik alamat I2C antar sensor sejenis",
    ],
    blocks: [
      { kind: "h3", text: "2.1 Konsep Dasar Deep Learning" },
      {
        kind: "p",
        text: "Deep learning adalah cabang machine learning yang menggunakan jaringan saraf tiruan berlapis, meniru cara kerja otak manusia dalam memproses data besar.",
      },
      {
        kind: "ul",
        items: [
          "Neuron: menerima input, dikalikan bobot dan bias, lalu fungsi aktivasi non-linear menghasilkan output.",
          "Lapisan: input → tersembunyi → output; lapisan tersembunyi mengenali pola non-linear kompleks.",
        ],
      },
      { kind: "h3", text: "2.2 Algoritma Deteksi Objek YOLO" },
      {
        kind: "p",
        text: "Metode deteksi objek tradisional memisahkan pelokalan dan klasifikasi sehingga butuh komputasi tinggi. You Only Look Once (YOLO) menyederhanakannya: objek dideteksi dalam satu langkah komputasi, memprediksi bounding box dan probabilitas kelas secara bersamaan.",
      },
      {
        kind: "callout",
        variant: "penting",
        text: "YOLO: deteksi dan klasifikasi dalam satu proses — inilah alasan utama pemilihannya untuk deteksi plat nomor real-time.",
      },
      { kind: "h3", text: "2.3 Sensor Pengukur Jarak" },
      { kind: "h4", text: "2.3.1 Sensor VL53L1X" },
      {
        kind: "p",
        text: "VL53L1X adalah sensor jarak berbasis Time-of-Flight (ToF): memancarkan laser inframerah dan mengukur waktu pantulannya untuk menentukan jarak. Komunikasi lewat I2C, jangkauan hingga 4 meter, presisi tinggi pada pencahayaan bervariasi — cocok untuk mendeteksi kendaraan pada slot parkir.",
      },
      {
        kind: "figure",
        caption:
          "Gambar 2.1 — Skema rangkaian sensor VL53L1X, multiplekser TCA9548A, dan ESP32",
      },
      {
        kind: "callout",
        variant: "penting",
        text: "Sensor ToF unggul di akurasi & latensi rendah dibanding sensor ultrasonik/infrared konvensional.",
      },
      { kind: "h4", text: "2.3.2 Sensor HC-SR04" },
      {
        kind: "p",
        text: "HC-SR04 adalah sensor jarak ultrasonik yang mengirim dan menerima gelombang suara; waktu tempuh gelombang dihitung untuk menentukan jarak. Rentang 2 cm – 400 cm, akurasi ±3 mm, tegangan operasi 5V DC.",
      },
      {
        kind: "callout",
        variant: "contoh",
        text: "HC-SR04 dipakai mendeteksi kedatangan kendaraan di gerbang masuk/keluar parkir (jarak < 10 cm memicu kamera).",
      },
      { kind: "h3", text: "2.4 Komponen Perangkat Keras" },
      { kind: "h4", text: "2.4.1 Motor Servo SG-90" },
      {
        kind: "p",
        text: "Motor servo mikro berbasis PWM: rentang sudut 0°–180°, torsi 1,8 kg·cm, dipakai sebagai penggerak palang pintu parkir (0° tertutup, 90° terbuka).",
      },
      { kind: "h4", text: "2.4.2 LCD I2C 20×4" },
      {
        kind: "p",
        text: "Menampilkan 20 karakter × 4 baris (80 karakter total) lewat antarmuka I2C sehingga hemat pin mikrokontroler; dipakai menampilkan status gerbang dan informasi parkir.",
      },
      { kind: "h4", text: "2.4.3 Mikrokontroler ESP32" },
      {
        kind: "p",
        text: "Prosesor dual-core Xtensa LX6 hingga 240 MHz, 520 KB SRAM, Wi-Fi + Bluetooth. Berperan sebagai unit pemrosesan utama: pembacaan sensor, kontrol aktuator, dan komunikasi nirkabel.",
      },
      {
        kind: "callout",
        variant: "penting",
        text: "ESP32 adalah pusat kendali seluruh perangkat fisik — semua sensor dan aktuator bermuara ke sini sebelum data diteruskan ke server edge.",
      },
      { kind: "h4", text: "2.4.4 Multiplekser TCA9548A" },
      {
        kind: "p",
        text: "Multiplekser I2C 8-kanal yang mengatasi masalah beberapa perangkat I2C beralamat sama: kanal yang diinginkan diaktifkan lewat perintah, dipakai mengelola beberapa sensor VL53L1X dan LCD pada satu bus yang sama.",
      },
    ],
  },
  bab3: {
    overview:
      "Bab ini menjelaskan metodologi Design and Development (D&D) yang dipakai, identifikasi masalah, analisis kebutuhan, serta perancangan sistem: pipeline deteksi plat nomor, database, aplikasi mobile, dan web dashboard.",
    keyPoints: [
      "Metode D&D: tahapan desain → implementasi → evaluasi yang jelas",
      "Pipeline deteksi plat: YOLOv26 → koreksi perspektif (OpenCV) → PaddleOCR",
      "ESP32 berkomunikasi ke server edge lewat serial UART",
      "Aplikasi mobile (Flutter) untuk pengemudi; web dashboard (React) untuk pengelola",
    ],
    blocks: [
      { kind: "h3", text: "3.1 Metodologi Design and Development (D&D)" },
      {
        kind: "p",
        text: "Pendekatan penelitian sistematis untuk merancang, mengembangkan, dan mengevaluasi produk. Dipilih karena sesuai untuk pengembangan sistem kompleks dengan tahapan desain, implementasi, dan evaluasi yang jelas.",
      },
      { kind: "h3", text: "3.2 Identifikasi Masalah" },
      {
        kind: "ul",
        items: [
          "Pengelolaan manual: rawan kesalahan dan memakan waktu saat volume kendaraan tinggi.",
          "Informasi slot tidak real-time: pengemudi kesulitan mencari slot kosong.",
          "Manajemen terpusat minim: pengelola tidak punya gambaran menyeluruh.",
          "Identifikasi kendaraan otomatis belum ada: proses masuk/keluar lambat.",
        ],
      },
      {
        kind: "callout",
        variant: "penting",
        text: "Masalah-masalah ini menggarisbawahi perlunya otomatisasi, informasi real-time, dan integrasi sistem untuk efisiensi operasional parkir.",
      },
      { kind: "h3", text: "3.3 Perancangan Pipeline Deteksi Plat Nomor" },
      {
        kind: "ul",
        items: [
          "Kamera USB menangkap gambar kendaraan di gerbang.",
          "YOLOv26 mendeteksi lokasi plat nomor (bounding box).",
          "Area plat dipotong dan dikoreksi perspektif (OpenCV, four-point transform).",
          "Preprocessing: grayscale, inversi warna untuk plat gelap, CLAHE, penajaman.",
          "PaddleOCR (PP-OCRv4) membaca karakter plat.",
          "Koreksi format sesuai aturan plat nomor Indonesia.",
        ],
      },
      {
        kind: "figure",
        caption: "Gambar 3.2 — Diagram pipeline deteksi plat nomor end-to-end",
      },
      {
        kind: "callout",
        variant: "contoh",
        text: "Sensor HC-SR04 di gerbang masuk terhubung ke pin TRIG GPIO14 dan ECHO GPIO27 pada ESP32.",
      },
      { kind: "h3", text: "3.4 Perancangan Aplikasi Mobile & Web Dashboard" },
      {
        kind: "p",
        text: "Aplikasi mobile (Flutter, Android) untuk pengemudi: registrasi 3 tahap, lihat ketersediaan slot, top-up saldo via Midtrans, manajemen kendaraan, dan pembayaran tagihan parkir. Web dashboard (React + Vite + Tailwind) untuk admin dan operator dengan pembatasan hak akses.",
      },
    ],
  },
  bab4: {
    overview:
      "Bab ini menyajikan hasil implementasi dan pengujian sistem: performa model YOLOv26, PaddleOCR, pipeline end-to-end, serta pengujian black box aplikasi mobile, pembayaran, dan web dashboard.",
    keyPoints: [
      "YOLOv26: precision 98,19%, recall 93,83% (epoch ke-47), detection rate 85% pada data baru",
      "PaddleOCR: akurasi 55%, CER rata-rata 31,93% — plat gelap miring paling menantang",
      "Pipeline end-to-end: plate accuracy 55%, CER rata-rata 24,4%",
      "Seluruh 31 skenario pengujian aplikasi mobile berhasil (100%)",
    ],
    blocks: [
      { kind: "h3", text: "4.1 Hasil Implementasi Sistem" },
      {
        kind: "p",
        text: "Sistem berhasil diimplementasikan: ESP32 mengendalikan sensor HC-SR04, VL53L1X, motor servo SG-90, LCD I2C, dan buzzer; server edge menjalankan FastAPI dengan model YOLOv26 dan PaddleOCR, terhubung ke ESP32 lewat serial UART.",
      },
      { kind: "h3", text: "4.2 Hasil Pengujian Model YOLOv26" },
      {
        kind: "ul",
        items: [
          "Training 50 epoch (dataset Roboflow): performa terbaik di epoch ke-47 — precision 98,19%, recall 93,83%, mAP@50 96,99%.",
          "Pada 20 gambar baru: detection rate 85%, confidence rata-rata 0,8103, inferensi 93,2 ms/gambar.",
        ],
      },
      {
        kind: "callout",
        variant: "contoh",
        text: "Kegagalan deteksi terjadi pada gambar dengan kontras rendah dan sudut miring; kategori plat terang posisi lurus mencapai detection rate 100%.",
      },
      { kind: "h3", text: "4.3 Hasil Pengujian PaddleOCR & Pipeline End-to-End" },
      {
        kind: "p",
        text: "PaddleOCR membaca benar 11 dari 20 sampel (akurasi 55%, CER 31,93%). Pipeline lengkap (YOLOv26 + koreksi perspektif + preprocessing + PaddleOCR + koreksi format) menghasilkan detection rate 85%, plate accuracy 55%, dan CER rata-rata 24,4%.",
      },
      {
        kind: "figure",
        caption:
          "Gambar 4.5 — Contoh hasil deteksi plat nomor dan pembacaan karakter",
      },
      { kind: "h3", text: "4.4 Pengujian Aplikasi & Rekapitulasi" },
      {
        kind: "ul",
        items: [
          "Aplikasi mobile: 31/31 skenario black box berhasil (autentikasi, kendaraan, sesi parkir, dompet, riwayat, profil).",
          "Pembayaran: 15/15 skenario berhasil, integrasi Midtrans stabil.",
          "Web dashboard: 36 skenario, mayoritas berhasil — kendala pada filter transaksi dan ekspor laporan.",
        ],
      },
      {
        kind: "callout",
        variant: "penting",
        text: "Sistem berhasil diimplementasikan; performa AI (deteksi & OCR) adalah area yang perlu ditingkatkan pada kondisi pencahayaan rendah dan sudut miring.",
      },
    ],
  },
};

/* ========== Glosarium ========== */

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  chapter: ChapterId;
  note?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    id: "yolo",
    term: "YOLO (You Only Look Once)",
    definition:
      "Algoritma deteksi objek yang memproses seluruh gambar sekaligus untuk memprediksi bounding box dan probabilitas kelas secara bersamaan, dikenal karena kecepatannya.",
    chapter: "bab2",
    note: "Inget sebut versi YOLOv26 yang dipakai di penelitian ini.",
  },
  {
    id: "tof",
    term: "Time of Flight (ToF)",
    definition:
      "Teknologi sensor yang mengukur jarak dengan menghitung waktu pantul cahaya inframerah dari objek kembali ke sensor.",
    chapter: "bab2",
  },
  {
    id: "paddleocr",
    term: "PaddleOCR",
    definition:
      "Toolkit Optical Character Recognition (OCR) dari Baidu untuk membaca karakter dari gambar — dipakai membaca karakter plat nomor.",
    chapter: "bab3",
  },
  {
    id: "vl53l1x",
    term: "VL53L1X",
    definition:
      "Sensor jarak berbasis Time-of-Flight yang memancarkan laser inframerah; jangkauan hingga 4 meter, komunikasi I2C, presisi tinggi dan latensi rendah.",
    chapter: "bab2",
  },
  {
    id: "hcsr04",
    term: "HC-SR04",
    definition:
      "Sensor jarak ultrasonik dengan rentang 2–400 cm; bekerja dengan mengirim gelombang suara dan menghitung waktu pantulnya lewat pin Trigger dan Echo.",
    chapter: "bab2",
  },
  {
    id: "esp32",
    term: "ESP32",
    definition:
      "Mikrokontroler dual-core dengan Wi-Fi dan Bluetooth terintegrasi; berperan sebagai unit pemrosesan utama: baca sensor, kontrol aktuator, komunikasi nirkabel.",
    chapter: "bab2",
  },
  {
    id: "tca9548a",
    term: "TCA9548A",
    definition:
      "Multiplekser I2C 8-kanal yang memungkinkan beberapa perangkat I2C beralamat sama berkomunikasi secara selektif melalui satu bus.",
    chapter: "bab2",
    note: "Sering ditanya: kenapa butuh multiplekser? Karena beberapa VL53L1X punya alamat I2C default yang sama.",
  },
  {
    id: "bounding-box",
    term: "Bounding Box",
    definition:
      "Kotak persegi panjang yang menandai dan mengisolasi objek yang terdeteksi dalam sebuah gambar.",
    chapter: "bab2",
  },
  {
    id: "deep-learning",
    term: "Deep Learning",
    definition:
      "Sub-bidang machine learning yang menggunakan jaringan saraf tiruan berlapis untuk mempelajari representasi data yang kompleks.",
    chapter: "bab2",
  },
  {
    id: "clahe",
    term: "CLAHE",
    definition:
      "Contrast Limited Adaptive Histogram Equalization — algoritma peningkatan kontras untuk memperbaiki kualitas gambar plat sebelum dibaca OCR.",
    chapter: "bab3",
  },
  {
    id: "four-point",
    term: "Four-Point Transform",
    definition:
      "Teknik koreksi perspektif untuk memperbaiki distorsi gambar plat nomor akibat sudut pandang kamera agar lebih mudah dibaca.",
    chapter: "bab3",
  },
  {
    id: "edge-server",
    term: "Edge Server",
    definition:
      "Server yang ditempatkan dekat sumber data untuk memproses informasi secara lokal — di sini laptop yang menjalankan FastAPI, YOLOv26, dan PaddleOCR.",
    chapter: "bab3",
  },
  {
    id: "midtrans",
    term: "Midtrans",
    definition:
      "Payment gateway yang diintegrasikan untuk fitur top-up saldo dan pembayaran biaya parkir di aplikasi mobile.",
    chapter: "bab3",
  },
  {
    id: "cer",
    term: "Character Error Rate (CER)",
    definition:
      "Metrik tingkat kesalahan pembacaan karakter OCR — membandingkan hasil pembacaan dengan teks sebenarnya (berbasis Levenshtein distance).",
    chapter: "bab4",
    note: "CER pipeline 24,4% — siapkan jawaban kenapa masih tinggi & rencana perbaikannya.",
  },
  {
    id: "detection-rate",
    term: "Detection Rate",
    definition:
      "Persentase gambar yang plat nomornya berhasil dideteksi dari total gambar uji; menunjukkan efektivitas model menemukan plat nomor.",
    chapter: "bab4",
  },
  {
    id: "map50",
    term: "mAP@50",
    definition:
      "Mean Average Precision pada ambang IoU 0,5 — metrik evaluasi umum untuk model deteksi objek.",
    chapter: "bab4",
  },
];

/* ========== Mind Map ========== */

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export const mindmaps: Record<ChapterId, MindMapNode> = {
  bab1: {
    id: "b1",
    label: "Pendahuluan Sistem Parkir Cerdas",
    children: [
      {
        id: "b1-1",
        label: "Peningkatan jumlah kendaraan",
        children: [
          { id: "b1-1a", label: "±166 juta unit (2024)" },
          { id: "b1-1b", label: "Naik 6,66% per tahun" },
        ],
      },
      {
        id: "b1-2",
        label: "Tekanan pada ruang parkir",
        children: [
          { id: "b1-2a", label: "Kebutuhan di kota besar" },
          { id: "b1-2b", label: "Mal, perkantoran, kampus" },
        ],
      },
      {
        id: "b1-3",
        label: "Parkir konvensional tidak efisien",
        children: [
          { id: "b1-3a", label: "Kesalahan pencatatan" },
          { id: "b1-3b", label: "Status tidak real-time" },
        ],
      },
      {
        id: "b1-4",
        label: "Dampak bagi pengemudi",
        children: [
          { id: "b1-4a", label: "Buang waktu & BBM" },
          { id: "b1-4b", label: "Kemacetan area parkir" },
        ],
      },
      {
        id: "b1-5",
        label: "Kebutuhan sistem parkir cerdas",
        children: [
          { id: "b1-5a", label: "Info slot real-time" },
          { id: "b1-5b", label: "Integrasi YOLO + OCR" },
        ],
      },
    ],
  },
  /* Pohon bab 2 mengikuti struktur heading dokumen (2.1.x, nomor dibuang);
     daun = rangkuman poin kunci isi paragraf — contoh kontrak output AI */
  bab2: {
    id: "b2",
    label: "Kajian Pustaka",
    children: [
      {
        id: "b2-1",
        label: "Deep Learning",
        children: [
          { id: "b2-1a", label: "Jaringan saraf berlapis: input → hidden → output" },
          { id: "b2-1b", label: "Hidden layer menangkap pola non-linear" },
          { id: "b2-1c", label: "Makin banyak lapisan: akurasi naik, komputasi naik" },
          {
            /* Contoh heading level berikutnya (mis. 2.1.1.1) — cabang dalam cabang */
            id: "b2-1d",
            label: "Arsitektur Lapisan",
            children: [
              { id: "b2-1d1", label: "Input layer: menerima data mentah" },
              { id: "b2-1d2", label: "Hidden layer: ekstraksi fitur bertingkat" },
              { id: "b2-1d3", label: "Output layer: hasil prediksi akhir" },
            ],
          },
        ],
      },
      {
        id: "b2-2",
        label: "You Only Look Once (YOLO)",
        children: [
          {
            id: "b2-2a",
            label: "Deteksi objek satu langkah (regresi tunggal)",
            children: [
              { id: "b2-2a1", label: "Satu CNN memproses seluruh gambar sekali" },
              { id: "b2-2a2", label: "Tanpa tahap proposal wilayah terpisah" },
            ],
          },
          { id: "b2-2b", label: "Bounding box + probabilitas kelas sekaligus" },
          { id: "b2-2c", label: "Lebih efisien dari multi-tahap (R-CNN)" },
        ],
      },
      {
        id: "b2-3",
        label: "VL53L1X",
        children: [
          { id: "b2-3a", label: "Sensor jarak laser Time-of-Flight (ToF)" },
          { id: "b2-3b", label: "Hingga 4 m, presisi tinggi, latensi rendah" },
          { id: "b2-3c", label: "I2C — deteksi kendaraan per slot parkir" },
        ],
      },
      {
        id: "b2-4",
        label: "HC-SR04",
        children: [
          { id: "b2-4a", label: "Ultrasonik: Trigger kirim, Echo terima pantulan" },
          { id: "b2-4b", label: "Rentang 2–400 cm, akurasi ±3 mm, 5V" },
          { id: "b2-4c", label: "Pemicu awal deteksi di pintu masuk/keluar" },
        ],
      },
      {
        id: "b2-5",
        label: "Servo SG-90",
        children: [
          { id: "b2-5a", label: "Servo mikro dikendalikan sinyal PWM" },
          { id: "b2-5b", label: "0–180°, torsi 1,8 kg·cm, 0,1 dtk/60°" },
          { id: "b2-5c", label: "Penggerak palang pintu otomatis" },
        ],
      },
      {
        id: "b2-6",
        label: "LCD I2C 20x4",
        children: [
          { id: "b2-6a", label: "4 baris × 20 karakter (80 total)" },
          { id: "b2-6b", label: "Cukup 2 jalur data: SDA & SCL" },
          { id: "b2-6c", label: "Tampilkan slot tersedia & status pintu" },
        ],
      },
      {
        id: "b2-7",
        label: "ESP32",
        children: [
          { id: "b2-7a", label: "Dual-core 240 MHz + Wi-Fi & Bluetooth" },
          { id: "b2-7b", label: "GPIO, I2C, PWM, ADC, UART lengkap" },
          { id: "b2-7c", label: "Unit pemrosesan utama sensor & aktuator" },
        ],
      },
      {
        id: "b2-8",
        label: "TCA9548A",
        children: [
          { id: "b2-8a", label: "Multiplekser I2C 8 kanal (switching bus)" },
          { id: "b2-8b", label: "Solusi konflik alamat sensor kembar (0x29)" },
          { id: "b2-8c", label: "Pembacaan tiap slot digilir sekuensial" },
        ],
      },
      {
        id: "b2-9",
        label: "Webcam",
        children: [
          { id: "b2-9a", label: "Sumber citra real-time, murah, mudah dipasang" },
          { id: "b2-9b", label: "Terintegrasi OpenCV / perangkat embedded" },
          { id: "b2-9c", label: "Kualitas cukup untuk deteksi kendaraan" },
        ],
      },
      {
        id: "b2-10",
        label: "Sistem Parkir",
        children: [
          { id: "b2-10a", label: "Alur: masuk → cari slot → parkir → bayar" },
          { id: "b2-10b", label: "Palang otomatis + tiket berbasis waktu" },
          { id: "b2-10c", label: "Kelola ruang parkir efisien & aman" },
        ],
      },
      {
        id: "b2-11",
        label: "Plat Nomor",
        children: [
          { id: "b2-11a", label: "TNKB — identitas resmi kendaraan" },
          { id: "b2-11b", label: "Warna dasar menandai jenis penggunaan" },
          { id: "b2-11c", label: "NRKB: kode wilayah + angka + sub-daerah" },
        ],
      },
      {
        id: "b2-12",
        label: "Character Error Rate (CER)",
        children: [
          { id: "b2-12a", label: "Metrik kesalahan OCR tingkat karakter" },
          { id: "b2-12b", label: "CER = (S+D+I)/N — jarak Levenshtein" },
          { id: "b2-12c", label: "Makin kecil makin akurat (evaluasi OCR)" },
        ],
      },
    ],
  },
  bab3: {
    id: "b3",
    label: "Metodologi Perancangan & Implementasi",
    children: [
      {
        id: "b3-1",
        label: "Metodologi D&D",
        children: [
          { id: "b3-1a", label: "Desain → implementasi → evaluasi" },
          { id: "b3-1b", label: "Produk non-instruksional" },
        ],
      },
      {
        id: "b3-2",
        label: "Identifikasi masalah parkir",
        children: [
          { id: "b3-2a", label: "Pengelolaan manual tidak efisien" },
          { id: "b3-2b", label: "Informasi slot tidak real-time" },
          { id: "b3-2c", label: "Manajemen terpusat minim" },
        ],
      },
      {
        id: "b3-3",
        label: "Analisis kebutuhan perangkat keras",
        children: [
          { id: "b3-3a", label: "ESP32 pusat kendali" },
          { id: "b3-3b", label: "Sensor + aktuator + LCD" },
        ],
      },
      {
        id: "b3-4",
        label: "Pipeline deteksi plat nomor",
        children: [
          { id: "b3-4a", label: "YOLOv26 untuk bounding box" },
          { id: "b3-4b", label: "PaddleOCR baca karakter" },
          { id: "b3-4c", label: "Koreksi perspektif OpenCV" },
        ],
      },
      {
        id: "b3-5",
        label: "Perancangan aplikasi mobile",
        children: [
          { id: "b3-5a", label: "Registrasi akun" },
          { id: "b3-5b", label: "Top-up saldo via Midtrans" },
          { id: "b3-5c", label: "Manajemen kendaraan" },
          { id: "b3-5d", label: "Pembayaran tagihan parkir" },
        ],
      },
    ],
  },
  bab4: {
    id: "b4",
    label: "Hasil Pengujian Sistem",
    children: [
      {
        id: "b4-1",
        label: "Hasil implementasi sistem",
        children: [
          { id: "b4-1a", label: "ESP32 kendalikan sensor & aktuator" },
          { id: "b4-1b", label: "Server edge: YOLOv26 + PaddleOCR" },
        ],
      },
      {
        id: "b4-2",
        label: "Pengujian YOLOv26",
        children: [
          { id: "b4-2a", label: "Precision 98,19%" },
          { id: "b4-2b", label: "Recall 93,83%" },
          { id: "b4-2c", label: "Detection rate 85,0%" },
        ],
      },
      {
        id: "b4-3",
        label: "Pengujian PaddleOCR",
        children: [
          { id: "b4-3a", label: "Akurasi 55,0%" },
          { id: "b4-3b", label: "CER rata-rata 31,93%" },
        ],
      },
      {
        id: "b4-4",
        label: "Pipeline end-to-end",
        children: [
          { id: "b4-4a", label: "Detection rate 85,0%" },
          { id: "b4-4b", label: "Plate accuracy 55,0%" },
          { id: "b4-4c", label: "CER rata-rata 24,4%" },
        ],
      },
      {
        id: "b4-5",
        label: "Pengujian aplikasi mobile",
        children: [
          { id: "b4-5a", label: "31 skenario berhasil" },
          { id: "b4-5b", label: "Autentikasi & pembayaran berfungsi" },
        ],
      },
    ],
  },
};

/** Gabungan semua bab jadi satu pohon — dipakai saat opsi "Semua BAB" dipilih. */
export const allChaptersMindMap: MindMapNode = {
  id: "all",
  label: "Semua BAB",
  children: chapters.map((c) => mindmaps[c.id]),
};

/* ========== Flashcard ========== */

export type CardCategory = "unknown" | "learning" | "known";
export type FlashcardMode = "standar" | "belajar" | "uji";

export interface Flashcard {
  id: string;
  chapter: ChapterId;
  question: string;
  answer: string;
  initialCategory: CardCategory;
}

export const flashcards: Flashcard[] = [
  // BAB 1
  {
    id: "f1-1",
    chapter: "bab1",
    question: "Apa urgensi utama penelitian sistem parkir cerdas ini?",
    answer:
      "Pengelolaan parkir konvensional tidak efisien (pencatatan manual, status tidak real-time), sementara jumlah kendaraan terus naik — manajemen lahan parkir yang efisien penting untuk mobilitas perkotaan.",
    initialCategory: "learning",
  },
  {
    id: "f1-2",
    chapter: "bab1",
    question: "Berapa jumlah kendaraan bermotor di Indonesia pada 2024?",
    answer:
      "Sekitar 166 juta unit, dengan mobil penumpang naik rata-rata 6,66% per tahun.",
    initialCategory: "unknown",
  },
  {
    id: "f1-3",
    chapter: "bab1",
    question: "Apa dampak sistem parkir konvensional bagi pengemudi?",
    answer:
      "Pengemudi berkeliling mencari slot kosong: membuang waktu, menambah kemacetan, meningkatkan konsumsi bahan bakar, dan menyebabkan ketidaknyamanan.",
    initialCategory: "unknown",
  },
  {
    id: "f1-4",
    chapter: "bab1",
    question: "Sebutkan 4 komponen solusi sistem parkir cerdas yang diusulkan.",
    answer:
      "1) Deteksi plat nomor (YOLOv26 + PaddleOCR), 2) monitoring slot real-time (ESP32 + VL53L1X), 3) aplikasi mobile untuk pengemudi, 4) web dashboard untuk pengelola.",
    initialCategory: "known",
  },
  {
    id: "f1-5",
    chapter: "bab1",
    question: "Apa research gap yang diangkat penelitian ini?",
    answer:
      "Deteksi slot parkir umumnya belum terintegrasi dengan sistem identifikasi kendaraan — penelitian ini menggabungkan sensor, kecerdasan buatan, dan aplikasi berbasis internet dalam satu sistem.",
    initialCategory: "unknown",
  },
  // BAB 2
  {
    id: "f2-1",
    chapter: "bab2",
    question:
      "Apa keunggulan sensor ToF dibanding sensor ultrasonik untuk deteksi slot parkir?",
    answer:
      "Akurasi lebih tinggi dan latensi lebih rendah, serta tetap presisi pada kondisi pencahayaan bervariasi — karena mengukur waktu pantul laser inframerah, bukan gelombang suara.",
    initialCategory: "unknown",
  },
  {
    id: "f2-2",
    chapter: "bab2",
    question: "Bagaimana cara kerja sensor VL53L1X?",
    answer:
      "Memancarkan laser inframerah lalu mengukur waktu pantulannya (Time-of-Flight) untuk menentukan jarak; komunikasi lewat I2C, jangkauan hingga 4 meter.",
    initialCategory: "unknown",
  },
  {
    id: "f2-3",
    chapter: "bab2",
    question: "Apa yang membedakan YOLO dari metode deteksi objek tradisional?",
    answer:
      "YOLO mendeteksi objek dalam satu langkah komputasi — memprediksi bounding box dan probabilitas kelas sekaligus, sementara metode tradisional memisahkan pelokalan dan klasifikasi.",
    initialCategory: "learning",
  },
  {
    id: "f2-4",
    chapter: "bab2",
    question: "Apa fungsi multiplekser TCA9548A dalam sistem ini?",
    answer:
      "Mengelola beberapa perangkat I2C yang beralamat sama (beberapa VL53L1X dan LCD) pada satu bus, dengan mengaktifkan kanal yang diinginkan lewat perintah — total 8 kanal.",
    initialCategory: "unknown",
  },
  {
    id: "f2-5",
    chapter: "bab2",
    question: "Berapa rentang pengukuran sensor HC-SR04?",
    answer: "2 cm hingga 400 cm, dengan akurasi sekitar 3 mm dan tegangan operasi 5V DC.",
    initialCategory: "learning",
  },
  {
    id: "f2-6",
    chapter: "bab2",
    question: "Apa peran ESP32 dalam sistem parkir cerdas?",
    answer:
      "Unit pemrosesan utama: membaca sensor, mengontrol aktuator (servo, buzzer, LCD), dan komunikasi nirkabel; dual-core hingga 240 MHz dengan Wi-Fi + Bluetooth.",
    initialCategory: "unknown",
  },
  {
    id: "f2-7",
    chapter: "bab2",
    question: "Bagaimana motor servo SG-90 dikendalikan dan untuk apa?",
    answer:
      "Dikendalikan lewat PWM (Pulse Width Modulation), rentang 0°–180°; dipakai menggerakkan palang pintu parkir (0° tertutup, 90° terbuka).",
    initialCategory: "learning",
  },
  {
    id: "f2-8",
    chapter: "bab2",
    question: "Kenapa LCD yang dipakai memakai antarmuka I2C?",
    answer:
      "Supaya hemat pin mikrokontroler — cukup 2 jalur (SDA & SCL) untuk menampilkan 20×4 karakter informasi status parkir.",
    initialCategory: "unknown",
  },
  {
    id: "f2-9",
    chapter: "bab2",
    question: "Apa itu deep learning dan bagaimana strukturnya?",
    answer:
      "Cabang machine learning berbasis jaringan saraf tiruan berlapis (input → tersembunyi → output); lapisan tersembunyi mengenali pola non-linear kompleks dari data besar.",
    initialCategory: "known",
  },
  {
    id: "f2-10",
    chapter: "bab2",
    question: "Komponen apa yang menangkap gambar untuk deteksi objek?",
    answer:
      "Webcam (kamera USB) — kualitas gambarnya cukup untuk deteksi objek, terjangkau, dan mudah diintegrasikan dengan server edge.",
    initialCategory: "known",
  },
  {
    id: "f2-11",
    chapter: "bab2",
    question: "Sensor apa yang dipakai di gerbang vs di slot parkir?",
    answer:
      "Gerbang: HC-SR04 (deteksi kedatangan kendaraan). Slot parkir: VL53L1X (monitoring terisi/kosong) — dikelola multiplekser TCA9548A.",
    initialCategory: "unknown",
  },
  {
    id: "f2-12",
    chapter: "bab2",
    question: "Apa isi prediksi YOLO untuk setiap objek terdeteksi?",
    answer:
      "Bounding box (koordinat lokasi objek) beserta probabilitas kelasnya, dihasilkan bersamaan dalam satu proses.",
    initialCategory: "learning",
  },
  // BAB 3
  {
    id: "f3-1",
    chapter: "bab3",
    question: "Kenapa metodologi D&D dipilih untuk penelitian ini?",
    answer:
      "Karena sesuai untuk pengembangan sistem kompleks dengan tahapan desain, implementasi, dan evaluasi yang jelas — fokusnya membangun produk.",
    initialCategory: "unknown",
  },
  {
    id: "f3-2",
    chapter: "bab3",
    question: "Sebutkan urutan pipeline deteksi plat nomor.",
    answer:
      "Kamera USB → YOLOv26 (bounding box) → potong & koreksi perspektif (OpenCV) → preprocessing (grayscale, inversi, CLAHE, penajaman) → PaddleOCR → koreksi format plat Indonesia.",
    initialCategory: "unknown",
  },
  {
    id: "f3-3",
    chapter: "bab3",
    question: "Bagaimana ESP32 berkomunikasi dengan server edge?",
    answer: "Melalui koneksi serial UART; server edge ↔ backend/aplikasi memakai REST API dan WebSocket.",
    initialCategory: "learning",
  },
  {
    id: "f3-4",
    chapter: "bab3",
    question: "Apa fungsi CLAHE dalam preprocessing?",
    answer:
      "Meningkatkan kontras gambar plat nomor secara adaptif (Contrast Limited Adaptive Histogram Equalization) supaya karakter lebih mudah dibaca OCR.",
    initialCategory: "unknown",
  },
  {
    id: "f3-5",
    chapter: "bab3",
    question: "Apa saja fungsionalitas utama aplikasi mobile untuk pengemudi?",
    answer:
      "Registrasi akun, lihat ketersediaan slot & lokasi, top-up saldo via Midtrans, manajemen kendaraan, riwayat sesi, dan pembayaran tagihan parkir dari saldo wallet.",
    initialCategory: "learning",
  },
  {
    id: "f3-6",
    chapter: "bab3",
    question: "Apa perbedaan hak akses Admin dan Operator di web dashboard?",
    answer:
      "Admin: akses penuh (KPI, manajemen akun, transaksi, laporan). Operator: terbatas — monitoring sesi parkir, manajemen slot, dan monitoring perangkat IoT.",
    initialCategory: "unknown",
  },
  {
    id: "f3-7",
    chapter: "bab3",
    question: "Kenapa dibutuhkan koreksi perspektif (four-point transform)?",
    answer:
      "Untuk memperbaiki distorsi gambar plat akibat sudut pandang kamera yang miring, sehingga karakter plat lebih mudah dibaca oleh PaddleOCR.",
    initialCategory: "unknown",
  },
  {
    id: "f3-8",
    chapter: "bab3",
    question: "Arsitektur sistem dibagi menjadi layer apa saja?",
    answer:
      "Software layer (mobile, dashboard, backend API), hardware layer server edge (FastAPI + YOLOv26 + PaddleOCR), dan hardware layer perangkat fisik (ESP32 + sensor + aktuator).",
    initialCategory: "learning",
  },
  // BAB 4
  {
    id: "f4-1",
    chapter: "bab4",
    question: "Berapa precision dan recall YOLOv26 pada epoch terbaik?",
    answer: "Epoch ke-47: precision 98,19%, recall 93,83%, mAP@50 96,99%.",
    initialCategory: "unknown",
  },
  {
    id: "f4-2",
    chapter: "bab4",
    question: "Berapa detection rate model pada 20 gambar plat baru?",
    answer:
      "85% (17 dari 20 terdeteksi), confidence rata-rata 0,8103, waktu inferensi 93,2 ms per gambar.",
    initialCategory: "learning",
  },
  {
    id: "f4-3",
    chapter: "bab4",
    question: "Kategori plat apa yang paling sulit untuk OCR dan kenapa?",
    answer:
      "Plat gelap posisi miring — kontras rendah dan distorsi perspektif membuat CER-nya tertinggi (187,5% pada sampel uji).",
    initialCategory: "unknown",
  },
  {
    id: "f4-4",
    chapter: "bab4",
    question: "Berapa hasil pipeline end-to-end secara keseluruhan?",
    answer:
      "Detection rate 85%, plate accuracy 55% (11/20 terbaca benar seluruh karakternya), CER rata-rata 24,4%.",
    initialCategory: "unknown",
  },
  {
    id: "f4-5",
    chapter: "bab4",
    question: "Bagaimana hasil pengujian black box aplikasi mobile?",
    answer:
      "Seluruh 31 skenario di 7 modul berhasil (100%) — autentikasi, kendaraan, lokasi & slot, sesi parkir, dompet & top-up, riwayat, profil.",
    initialCategory: "known",
  },
  {
    id: "f4-6",
    chapter: "bab4",
    question: "Fitur web dashboard apa yang masih gagal saat pengujian?",
    answer:
      "Filter transaksi berdasarkan tipe, ekspor laporan ke PDF, dan ekspor laporan ke Excel.",
    initialCategory: "unknown",
  },
];

/* ========== Quiz ========== */

export interface QuizQuestion {
  id: string;
  chapter: ChapterId;
  question: string;
  options: string[];
  answerIndex: number;
  /** Alasan jawaban benar — ditampilkan di layar hasil, diverifikasi AI. */
  explanation: string;
  /** Rujukan bagian dokumen skripsi yang jadi dasar jawaban & alasan. */
  sourceRef: string;
  /** Kutipan/parafrase isi dokumen skripsi pengguna untuk topik ini. */
  documentExcerpt: string;
  /** Terisi hanya kalau AI menemukan isi dokumen pengguna keliru dibanding
   *  fakta yang benar — dipakai menampilkan koreksi "seharusnya ...". */
  aiFlag?: { wrongText: string; correctText: string };
}

export const quizQuestions: QuizQuestion[] = [
  // BAB 1
  {
    id: "q1-1",
    chapter: "bab1",
    question: "Apa masalah utama sistem parkir konvensional?",
    options: [
      "Biaya pembangunan gedung parkir terlalu mahal",
      "Pencatatan manual rawan salah dan status slot tidak real-time",
      "Jumlah petugas parkir terlalu banyak",
      "Kendaraan listrik tidak bisa terdeteksi",
    ],
    answerIndex: 1,
    explanation:
      "Parkir konvensional dikelola manual oleh petugas atau papan informasi statis, sehingga rawan salah catat dan status slotnya tidak diperbarui real-time — ini akar masalah yang mendorong penelitian ini.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Sistem parkir konvensional tidak efisien\"",
    documentExcerpt:
      "Pengelolaan dengan petugas atau papan informasi statis menyebabkan kesalahan pencatatan dan keterlambatan pembaruan status.",
  },
  {
    id: "q1-2",
    chapter: "bab1",
    question: "Berapa perkiraan jumlah kendaraan bermotor di Indonesia (2024)?",
    options: ["66 juta unit", "100 juta unit", "166 juta unit", "266 juta unit"],
    answerIndex: 2,
    explanation:
      "Dokumen menyebut jumlah kendaraan bermotor di Indonesia mencapai sekitar 166 juta unit pada 2024, dengan mobil penumpang naik rata-rata 6,66% per tahun.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Peningkatan jumlah kendaraan\"",
    documentExcerpt: "Jumlah kendaraan bermotor mencapai sekitar 116 juta unit pada 2024.",
    aiFlag: {
      wrongText: "116 juta unit",
      correctText:
        "166 juta unit — dua digit terakhir tertukar di dokumen kamu, angka resminya 166 juta bukan 116 juta",
    },
  },
  {
    id: "q1-3",
    chapter: "bab1",
    question: "Kombinasi teknologi apa yang diusulkan untuk identifikasi kendaraan?",
    options: [
      "RFID + barcode",
      "YOLO + PaddleOCR",
      "GPS + Bluetooth",
      "NFC + QR code",
    ],
    answerIndex: 1,
    explanation:
      "Sistem yang diusulkan mengintegrasikan YOLOv26 untuk mendeteksi lokasi plat nomor dan PaddleOCR untuk membaca karakternya di gerbang parkir.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Deteksi plat nomor\"",
    documentExcerpt:
      "Deteksi plat nomor memakai algoritma YOLOv26 + PaddleOCR di gerbang parkir.",
  },
  {
    id: "q1-4",
    chapter: "bab1",
    question: "Aplikasi mobile dalam sistem yang diusulkan ditujukan untuk siapa?",
    options: ["Petugas parkir", "Pengelola gedung", "Pengemudi", "Teknisi IoT"],
    answerIndex: 2,
    explanation:
      "Aplikasi mobile dirancang untuk pengemudi — memantau ketersediaan slot, reservasi, dan pembayaran digital — berbeda dari web dashboard yang ditujukan untuk pengelola.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Aplikasi mobile untuk pengemudi\"",
    documentExcerpt:
      "Aplikasi mobile untuk pengemudi: pantau ketersediaan, reservasi, pembayaran digital.",
  },
  {
    id: "q1-5",
    chapter: "bab1",
    question: "Apa dampak langsung pengemudi berkeliling mencari slot kosong?",
    options: [
      "Menambah pendapatan parkir",
      "Buang waktu, macet, dan boros bahan bakar",
      "Memperpanjang umur kendaraan",
      "Mengurangi polusi udara",
    ],
    answerIndex: 1,
    explanation:
      "Dokumen menyebut pengemudi yang berkeliling mencari slot kosong membuang waktu, menambah kemacetan, dan meningkatkan konsumsi bahan bakar.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Dampak bagi pengemudi\"",
    documentExcerpt:
      "Berkeliling mencari slot kosong membuang waktu, menambah kemacetan, dan meningkatkan konsumsi bahan bakar.",
  },
  {
    id: "q1-6",
    chapter: "bab1",
    question: "Di mana tekanan kebutuhan ruang parkir paling terasa?",
    options: [
      "Pedesaan",
      "Kota besar: mal, perkantoran, kampus",
      "Pelabuhan",
      "Bandara kecil",
    ],
    answerIndex: 1,
    explanation:
      "Dokumen menyebut tekanan pada ruang parkir paling terasa di kota besar — pusat perbelanjaan, perkantoran, dan kampus — bukan di area dengan kepadatan kendaraan rendah.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Tekanan pada ruang parkir\"",
    documentExcerpt: "Tekanan pada ruang parkir terutama di kota besar — pusat perbelanjaan, perkantoran, dan kampus.",
  },
  {
    id: "q1-7",
    chapter: "bab1",
    question: "Apa fungsi utama web dashboard untuk pengelola?",
    options: [
      "Reservasi slot untuk pengemudi",
      "Monitoring aktivitas, kelola slot, dan laporan keuangan",
      "Membaca plat nomor kendaraan",
      "Mengganti oli kendaraan",
    ],
    answerIndex: 1,
    explanation:
      "Web dashboard ditujukan untuk pengelola: memantau aktivitas parkir, mengelola slot, dan melihat laporan keuangan — berbeda dari aplikasi mobile yang ditujukan untuk pengemudi.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Web dashboard untuk pengelola\"",
    documentExcerpt: "Web dashboard untuk pengelola: monitoring aktivitas, kelola slot, laporan keuangan.",
  },
  {
    id: "q1-8",
    chapter: "bab1",
    question: "Fitur apa saja yang tersedia di aplikasi mobile pengemudi?",
    options: [
      "Pantau ketersediaan, reservasi, pembayaran digital",
      "Kelola akun admin sistem",
      "Kalibrasi sensor ESP32",
      "Mengatur harga sewa gedung",
    ],
    answerIndex: 0,
    explanation:
      "Aplikasi mobile untuk pengemudi menyediakan fitur pantau ketersediaan slot, reservasi, dan pembayaran digital.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Aplikasi mobile untuk pengemudi\"",
    documentExcerpt: "Aplikasi mobile untuk pengemudi: pantau ketersediaan, reservasi, pembayaran digital.",
  },
  {
    id: "q1-9",
    chapter: "bab1",
    question: "Berapa rata-rata kenaikan jumlah mobil penumpang per tahun?",
    options: ["3,3%", "6,66%", "10%", "1,2%"],
    answerIndex: 1,
    explanation:
      "Dokumen menyebut mobil penumpang naik rata-rata 6,66% per tahun, sejalan dengan total kendaraan bermotor yang mencapai sekitar 166 juta unit pada 2024.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Peningkatan jumlah kendaraan\"",
    documentExcerpt: "Mobil penumpang naik rata-rata 6,66% per tahun.",
  },
  {
    id: "q1-10",
    chapter: "bab1",
    question: "Apa dampak sistem parkir konvensional yang tidak real-time bagi pengelola?",
    options: [
      "Informasi ketersediaan slot tidak akurat",
      "Biaya listrik naik drastis",
      "Kendaraan otomatis terdeteksi salah",
      "Aplikasi mobile jadi lambat",
    ],
    answerIndex: 0,
    explanation:
      "Pengelolaan dengan petugas atau papan informasi statis membuat informasi ketersediaan slot parkir tidak akurat dan terlambat diperbarui.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah — \"Sistem parkir konvensional tidak efisien\"",
    documentExcerpt: "Pengelolaan dengan petugas atau papan informasi statis menyebabkan keterlambatan pembaruan status.",
  },
  {
    id: "q1-11",
    chapter: "bab1",
    question: "Kombinasi apa yang dipakai untuk monitoring slot secara real-time?",
    options: [
      "ESP32 + sensor jarak VL53L1X",
      "Kamera CCTV + operator manual",
      "GPS kendaraan + cloud server",
      "RFID tag + gerbang manual",
    ],
    answerIndex: 0,
    explanation:
      "Monitoring slot memakai mikrokontroler ESP32 dipadukan sensor jarak VL53L1X per slot, sehingga status terisi/kosong bisa dipantau real-time.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Monitoring slot\"",
    documentExcerpt: "Monitoring slot: mikrokontroler ESP32 + sensor jarak VL53L1X per slot, status real-time.",
  },
  {
    id: "q1-12",
    chapter: "bab1",
    question: "Apa research gap yang diangkat penelitian ini?",
    options: [
      "Belum ada penelitian soal parkir",
      "Deteksi slot umumnya belum terintegrasi dengan identifikasi kendaraan",
      "Sensor ultrasonik belum pernah dipakai",
      "Aplikasi mobile parkir belum pernah dibuat",
    ],
    answerIndex: 1,
    explanation:
      "Penelitian ini menyoroti bahwa deteksi slot parkir umumnya belum terintegrasi dengan sistem identifikasi kendaraan, sehingga menggabungkan sensor, AI, dan aplikasi dalam satu sistem.",
    sourceRef: "BAB 1 — Research Gap",
    documentExcerpt: "Deteksi slot parkir umumnya belum terintegrasi dengan sistem identifikasi kendaraan.",
  },
  {
    id: "q1-13",
    chapter: "bab1",
    question: "Apa manfaat utama integrasi deteksi objek dan pengenalan karakter di gerbang parkir?",
    options: [
      "Mendeteksi kendaraan sekaligus identifikasi ketersediaan ruang",
      "Mengurangi biaya listrik gedung",
      "Mempercepat pengecatan marka parkir",
      "Mengganti kebutuhan CCTV sepenuhnya",
    ],
    answerIndex: 0,
    explanation:
      "Integrasi deteksi objek (YOLO) dan pengenalan karakter (PaddleOCR) dipakai untuk mendeteksi kendaraan sekaligus mengidentifikasi status ketersediaan ruang parkir.",
    sourceRef: "BAB 1.2 Kebutuhan Sistem Parkir Cerdas",
    documentExcerpt: "Integrasi deteksi objek dan pengenalan karakter dipakai mendeteksi kendaraan sekaligus mengidentifikasi status ketersediaan ruang parkir.",
  },
  {
    id: "q1-14",
    chapter: "bab1",
    question: "Kenapa manajemen lahan parkir yang efisien dianggap penting?",
    options: [
      "Untuk menaikkan harga sewa gedung",
      "Untuk mobilitas perkotaan yang lebih baik",
      "Untuk mengurangi jumlah kendaraan",
      "Untuk memperbanyak petugas parkir",
    ],
    answerIndex: 1,
    explanation:
      "Manajemen lahan parkir yang efisien dianggap sangat penting untuk mobilitas perkotaan — ini menjadi urgensi utama penelitian.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah",
    documentExcerpt: "Manajemen lahan parkir yang efisien sangat penting untuk mobilitas perkotaan.",
  },
  {
    id: "q1-15",
    chapter: "bab1",
    question: "Siapa target pengguna utama web dashboard?",
    options: ["Pengemudi", "Teknisi IoT", "Pengelola gedung parkir", "Produsen kendaraan"],
    answerIndex: 2,
    explanation:
      "Web dashboard ditujukan untuk pengelola gedung parkir agar bisa memonitor aktivitas, mengelola slot, dan melihat laporan keuangan.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Web dashboard untuk pengelola\"",
    documentExcerpt: "Web dashboard untuk pengelola: monitoring aktivitas, kelola slot, laporan keuangan.",
  },
  {
    id: "q1-16",
    chapter: "bab1",
    question: "Apa yang menyebabkan kesalahan pencatatan pada sistem parkir konvensional?",
    options: [
      "Pengelolaan manual oleh petugas/papan statis",
      "Terlalu banyak sensor terpasang",
      "Kesalahan software dashboard",
      "Koneksi internet terputus",
    ],
    answerIndex: 0,
    explanation:
      "Pengelolaan dengan petugas atau papan informasi statis menyebabkan kesalahan pencatatan dan keterlambatan pembaruan status slot.",
    sourceRef: "BAB 1.1 Latar Belakang Masalah",
    documentExcerpt: "Pengelolaan dengan petugas atau papan informasi statis menyebabkan kesalahan pencatatan.",
  },
  {
    id: "q1-17",
    chapter: "bab1",
    question: "Selain mengurangi waktu pencarian slot, apa manfaat lain sistem real-time bagi pengemudi?",
    options: [
      "Mengurangi kemacetan area parkir",
      "Menambah jumlah kendaraan pribadi",
      "Menghapus kebutuhan aplikasi mobile",
      "Meningkatkan biaya parkir",
    ],
    answerIndex: 0,
    explanation:
      "Sistem yang mampu memantau ketersediaan tempat parkir secara real-time membantu mengurangi waktu pencarian slot sekaligus kemacetan di area parkir.",
    sourceRef: "BAB 1.2 Kebutuhan Sistem Parkir Cerdas",
    documentExcerpt: "Sistem real-time membantu pengemudi menemukan slot lebih cepat, mengurangi waktu pencarian dan kemacetan.",
  },
  {
    id: "q1-18",
    chapter: "bab1",
    question: "Apa yang dimaksud reservasi pada aplikasi mobile pengemudi?",
    options: [
      "Memesan slot parkir sebelum datang",
      "Membeli kendaraan baru",
      "Mendaftar jadi petugas parkir",
      "Mengunduh laporan keuangan gedung",
    ],
    answerIndex: 0,
    explanation:
      "Reservasi adalah fitur aplikasi mobile yang memungkinkan pengemudi memesan slot parkir sebelum tiba di lokasi.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Aplikasi mobile untuk pengemudi\"",
    documentExcerpt: "Aplikasi mobile untuk pengemudi: pantau ketersediaan, reservasi, pembayaran digital.",
  },
  {
    id: "q1-19",
    chapter: "bab1",
    question: "Komponen apa yang disebut sebagai solusi identifikasi kendaraan otomatis?",
    options: [
      "Deteksi plat nomor otomatis",
      "Formulir pendaftaran manual",
      "Kartu member fisik",
      "Barcode tiket kertas",
    ],
    answerIndex: 0,
    explanation:
      "Deteksi plat nomor otomatis (YOLOv26 + PaddleOCR) menjadi solusi identifikasi kendaraan yang diusulkan, menggantikan pencatatan manual.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Deteksi plat nomor\"",
    documentExcerpt: "Deteksi plat nomor: algoritma YOLOv26 + PaddleOCR di gerbang parkir.",
  },
  {
    id: "q1-20",
    chapter: "bab1",
    question: "Apa istilah untuk laporan yang bisa diakses pengelola lewat web dashboard?",
    options: ["Laporan keuangan", "Laporan cuaca", "Laporan kesehatan", "Laporan lalu lintas kota"],
    answerIndex: 0,
    explanation:
      "Web dashboard untuk pengelola menyediakan monitoring aktivitas, kelola slot, dan laporan keuangan gedung parkir.",
    sourceRef: "BAB 1.3 Sistem yang Diusulkan — \"Web dashboard untuk pengelola\"",
    documentExcerpt: "Web dashboard untuk pengelola: monitoring aktivitas, kelola slot, laporan keuangan.",
  },
  // BAB 2
  {
    id: "q2-1",
    chapter: "bab2",
    question: "Apa fungsi utama TCA9548A dalam sistem ini?",
    options: [
      "Mengukur jarak kendaraan",
      "Mengelola beberapa sensor I2C beralamat sama",
      "Membaca karakter plat nomor",
      "Menggerakkan palang pintu",
    ],
    answerIndex: 1,
    explanation:
      "TCA9548A adalah multiplekser I2C 8-kanal yang mengatasi konflik saat beberapa perangkat I2C (seperti VL53L1X) punya alamat yang sama, dengan mengaktifkan kanal yang dituju secara bergantian.",
    sourceRef: "BAB 2.4.4 Multiplekser TCA9548A",
    documentExcerpt:
      "TCA9548A dipakai mengelola beberapa sensor VL53L1X dan LCD pada satu bus I2C yang sama.",
  },
  {
    id: "q2-2",
    chapter: "bab2",
    question: "Teknologi apa yang mendasari sensor VL53L1X?",
    options: [
      "Gelombang ultrasonik",
      "Time-of-Flight (laser inframerah)",
      "Radar gelombang mikro",
      "Kamera stereo",
    ],
    answerIndex: 1,
    explanation:
      "VL53L1X memancarkan laser inframerah dan mengukur waktu pantulannya (Time-of-Flight) untuk menentukan jarak — berbeda dari HC-SR04 yang berbasis gelombang ultrasonik.",
    sourceRef: "BAB 2.3.1 Sensor VL53L1X",
    documentExcerpt:
      "VL53L1X memancarkan laser inframerah dan mengukur waktu pantulannya (Time-of-Flight) untuk menentukan jarak.",
  },
  {
    id: "q2-3",
    chapter: "bab2",
    question: "Apa keunggulan utama YOLO dibanding metode deteksi tradisional?",
    options: [
      "Tidak butuh data training",
      "Deteksi dan klasifikasi dalam satu langkah komputasi",
      "Hanya berjalan di GPU",
      "Akurasinya selalu 100%",
    ],
    answerIndex: 1,
    explanation:
      "Berbeda dari metode tradisional yang memisahkan pelokalan dan klasifikasi, YOLO memprediksi bounding box dan probabilitas kelas sekaligus dalam satu langkah komputasi.",
    sourceRef: "BAB 2.2 Algoritma Deteksi Objek YOLO",
    documentExcerpt:
      "YOLO menyederhanakan deteksi objek: bounding box dan probabilitas kelas diprediksi bersamaan dalam satu langkah komputasi.",
  },
  {
    id: "q2-4",
    chapter: "bab2",
    question: "Berapa rentang pengukuran sensor HC-SR04?",
    options: ["2–400 cm", "1–100 cm", "10–1000 cm", "0,5–4 cm"],
    answerIndex: 0,
    explanation:
      "HC-SR04 punya rentang pengukuran 2 cm hingga 400 cm, dengan akurasi ±3 mm pada tegangan operasi 5V DC.",
    sourceRef: "BAB 2.3.2 Sensor HC-SR04",
    documentExcerpt: "HC-SR04 punya rentang pengukuran 2 cm – 400 cm, akurasi ±3 mm.",
  },
  {
    id: "q2-5",
    chapter: "bab2",
    question: "Komponen apa yang menjadi unit pemrosesan utama sistem?",
    options: ["Raspberry Pi", "Arduino Uno", "ESP32", "TCA9548A"],
    answerIndex: 2,
    explanation:
      "ESP32 berperan sebagai unit pemrosesan utama: membaca sensor, mengontrol aktuator, dan berkomunikasi nirkabel — pusat kendali seluruh perangkat fisik.",
    sourceRef: "BAB 2.4.3 Mikrokontroler ESP32",
    documentExcerpt:
      "ESP32 berperan sebagai unit pemrosesan utama: pembacaan sensor, kontrol aktuator, dan komunikasi nirkabel.",
  },
  {
    id: "q2-6",
    chapter: "bab2",
    question: "Motor servo SG-90 dikendalikan menggunakan teknik apa?",
    options: [
      "PWM (Pulse Width Modulation)",
      "I2C",
      "UART",
      "Analog voltage control",
    ],
    answerIndex: 0,
    explanation:
      "Motor servo SG-90 dikendalikan lewat sinyal PWM (Pulse Width Modulation) untuk mengatur sudut putarannya (0°–180°) sebagai penggerak palang pintu.",
    sourceRef: "BAB 2.4.1 Motor Servo SG-90",
    documentExcerpt: "Motor servo SG-90 berbasis PWM, rentang sudut 0°–180°.",
  },
  {
    id: "q2-7",
    chapter: "bab2",
    question: "Apa fungsi sensor HC-SR04 dalam sistem parkir ini?",
    options: [
      "Memantau slot parkir terisi/kosong",
      "Mendeteksi kedatangan kendaraan di gerbang",
      "Membaca plat nomor",
      "Mengukur suhu ruangan parkir",
    ],
    answerIndex: 1,
    explanation:
      "HC-SR04 dipakai mendeteksi kedatangan kendaraan di gerbang masuk/keluar (jarak < 10 cm memicu kamera) — memantau slot terisi/kosong adalah tugas VL53L1X, bukan HC-SR04.",
    sourceRef: "BAB 2.3.2 Sensor HC-SR04",
    documentExcerpt: "HC-SR04 dipakai mendeteksi kedatangan kendaraan di gerbang masuk/keluar.",
  },
  {
    id: "q2-8",
    chapter: "bab2",
    question: "Kenapa LCD 20×4 memakai antarmuka I2C?",
    options: [
      "Supaya bisa menampilkan warna",
      "Supaya hemat pin mikrokontroler",
      "Supaya lebih murah",
      "Supaya tahan air",
    ],
    answerIndex: 1,
    explanation:
      "Antarmuka I2C memungkinkan LCD 20×4 dikendalikan hanya lewat 2 pin (SDA/SCL), jauh lebih hemat pin mikrokontroler dibanding koneksi paralel langsung.",
    sourceRef: "BAB 2.4.2 LCD I2C 20×4",
    documentExcerpt: "LCD 20×4 memakai antarmuka I2C sehingga hemat pin mikrokontroler.",
  },
  {
    id: "q2-9",
    chapter: "bab2",
    question: "Apa yang diprediksi YOLO secara bersamaan?",
    options: [
      "Bounding box dan probabilitas kelas",
      "Jarak dan kecepatan objek",
      "Warna dan bentuk plat",
      "Posisi GPS kendaraan",
    ],
    answerIndex: 0,
    explanation:
      "YOLO memprediksi bounding box (lokasi objek) dan probabilitas kelas secara bersamaan dalam satu langkah komputasi, bukan bertahap seperti metode tradisional.",
    sourceRef: "BAB 2.2 Algoritma Deteksi Objek YOLO",
    documentExcerpt: "YOLO memprediksi bounding box dan probabilitas kelas secara bersamaan.",
  },
  {
    id: "q2-10",
    chapter: "bab2",
    question: "Berapa jangkauan maksimum sensor VL53L1X?",
    options: ["1 meter", "2 meter", "4 meter", "10 meter"],
    answerIndex: 2,
    explanation:
      "VL53L1X punya jangkauan pengukuran hingga 4 meter dengan presisi tinggi pada pencahayaan yang bervariasi.",
    sourceRef: "BAB 2.3.1 Sensor VL53L1X",
    documentExcerpt: "VL53L1X punya jangkauan maksimum 2 meter.",
    aiFlag: {
      wrongText: "jangkauan maksimum 2 meter",
      correctText:
        "4 meter — sesuai datasheet VL53L1X yang kamu lampirkan sendiri di BAB 2.3.1, bukan 2 meter",
    },
  },
  {
    id: "q2-11",
    chapter: "bab2",
    question: "Apa yang dilakukan neuron dalam jaringan saraf tiruan?",
    options: [
      "Menerima input, dikalikan bobot dan bias, lalu diproses fungsi aktivasi",
      "Menyimpan seluruh dataset training",
      "Mengatur kecepatan clock prosesor",
      "Mengubah gambar jadi suara",
    ],
    answerIndex: 0,
    explanation:
      "Neuron menerima input, mengalikannya dengan bobot dan bias, lalu fungsi aktivasi non-linear menghasilkan output — dasar cara kerja jaringan saraf tiruan.",
    sourceRef: "BAB 2.1 Konsep Dasar Deep Learning",
    documentExcerpt: "Neuron: menerima input, dikalikan bobot dan bias, lalu fungsi aktivasi non-linear menghasilkan output.",
  },
  {
    id: "q2-12",
    chapter: "bab2",
    question: "Apa peran lapisan tersembunyi (hidden layer) dalam deep learning?",
    options: [
      "Menyimpan data mentah",
      "Mengenali pola non-linear kompleks",
      "Menampilkan hasil akhir prediksi",
      "Mengatur koneksi internet",
    ],
    answerIndex: 1,
    explanation:
      "Lapisan tersembunyi berperan mengenali pola non-linear kompleks dari data yang diterima, sebelum diteruskan ke lapisan output.",
    sourceRef: "BAB 2.1 Konsep Dasar Deep Learning",
    documentExcerpt: "Lapisan tersembunyi mengenali pola non-linear kompleks.",
  },
  {
    id: "q2-13",
    chapter: "bab2",
    question: "Urutan struktur dasar jaringan saraf tiruan adalah?",
    options: [
      "Output → hidden → input",
      "Input → hidden → output",
      "Hidden → output → input",
      "Input → output langsung tanpa hidden",
    ],
    answerIndex: 1,
    explanation:
      "Struktur dasarnya berurutan: lapisan input menerima data, lapisan tersembunyi mengekstraksi pola, lapisan output menghasilkan prediksi akhir.",
    sourceRef: "BAB 2.1 Konsep Dasar Deep Learning",
    documentExcerpt: "Lapisan: input → tersembunyi → output.",
  },
  {
    id: "q2-14",
    chapter: "bab2",
    question: "Apa perbedaan utama sensor Time-of-Flight dengan sensor ultrasonik?",
    options: [
      "ToF pakai laser inframerah, ultrasonik pakai gelombang suara",
      "ToF lebih murah dari ultrasonik",
      "Ultrasonik lebih akurat dari ToF",
      "Keduanya menggunakan prinsip yang sama persis",
    ],
    answerIndex: 0,
    explanation:
      "Sensor ToF (VL53L1X) memancarkan laser inframerah dan mengukur waktu pantulnya, sedangkan sensor ultrasonik (HC-SR04) mengirim dan menerima gelombang suara.",
    sourceRef: "BAB 2.3 Sensor Pengukur Jarak",
    documentExcerpt: "VL53L1X berbasis laser inframerah (ToF); HC-SR04 berbasis gelombang ultrasonik.",
  },
  {
    id: "q2-15",
    chapter: "bab2",
    question: "Berapa rentang sudut putar motor servo SG-90?",
    options: ["0°–90°", "0°–180°", "0°–270°", "0°–360°"],
    answerIndex: 1,
    explanation:
      "Motor servo SG-90 punya rentang sudut 0°–180°, dipakai sebagai penggerak palang pintu parkir (0° tertutup, 90° terbuka).",
    sourceRef: "BAB 2.4.1 Motor Servo SG-90",
    documentExcerpt: "Rentang sudut 0°–180°, torsi 1,8 kg·cm.",
  },
  {
    id: "q2-16",
    chapter: "bab2",
    question: "Berapa kapasitas tampilan karakter LCD I2C yang dipakai?",
    options: ["16×2 (32 karakter)", "20×4 (80 karakter)", "40×4 (160 karakter)", "20×2 (40 karakter)"],
    answerIndex: 1,
    explanation:
      "LCD I2C yang dipakai berukuran 20×4 — menampilkan 20 karakter × 4 baris (80 karakter total) lewat antarmuka I2C.",
    sourceRef: "BAB 2.4.2 LCD I2C 20×4",
    documentExcerpt: "Menampilkan 20 karakter × 4 baris (80 karakter total).",
  },
  {
    id: "q2-17",
    chapter: "bab2",
    question: "Berapa banyak kanal yang dimiliki multiplekser TCA9548A?",
    options: ["4 kanal", "6 kanal", "8 kanal", "16 kanal"],
    answerIndex: 2,
    explanation:
      "TCA9548A adalah multiplekser I2C 8-kanal yang mengelola beberapa sensor VL53L1X dan LCD pada satu bus I2C yang sama.",
    sourceRef: "BAB 2.4.4 Multiplekser TCA9548A",
    documentExcerpt: "Multiplekser I2C 8-kanal.",
  },
  {
    id: "q2-18",
    chapter: "bab2",
    question: "Apa yang dimaksud bounding box dalam deteksi objek?",
    options: [
      "Kotak yang menandai lokasi objek terdeteksi",
      "Nilai probabilitas kelas objek",
      "Jarak antara dua sensor",
      "Kecepatan proses inferensi model",
    ],
    answerIndex: 0,
    explanation:
      "Bounding box adalah kotak persegi panjang yang menandai dan mengisolasi lokasi objek yang terdeteksi dalam sebuah gambar.",
    sourceRef: "BAB 2 — Glosarium: Bounding Box",
    documentExcerpt: "Bounding box menandai dan mengisolasi objek yang terdeteksi dalam gambar.",
  },
  {
    id: "q2-19",
    chapter: "bab2",
    question: "Fitur wireless apa yang dimiliki ESP32?",
    options: ["Hanya Bluetooth", "Hanya Wi-Fi", "Wi-Fi dan Bluetooth", "Tidak ada fitur wireless"],
    answerIndex: 2,
    explanation:
      "ESP32 punya Wi-Fi dan Bluetooth terintegrasi, mendukung perannya sebagai unit pemrosesan utama dengan komunikasi nirkabel.",
    sourceRef: "BAB 2.4.3 Mikrokontroler ESP32",
    documentExcerpt: "ESP32: dual-core hingga 240 MHz, Wi-Fi + Bluetooth.",
  },
  {
    id: "q2-20",
    chapter: "bab2",
    question: "Kenapa deep learning disebut meniru cara kerja otak manusia?",
    options: [
      "Karena memakai jaringan saraf tiruan berlapis untuk memproses data",
      "Karena berjalan di perangkat biologis",
      "Karena tidak butuh listrik",
      "Karena hanya bisa dipakai untuk gambar",
    ],
    answerIndex: 0,
    explanation:
      "Deep learning memakai jaringan saraf tiruan berlapis yang meniru cara kerja otak manusia dalam memproses data besar.",
    sourceRef: "BAB 2.1 Konsep Dasar Deep Learning",
    documentExcerpt: "Deep learning menggunakan jaringan saraf tiruan berlapis, meniru cara kerja otak manusia.",
  },
  // BAB 3
  {
    id: "q3-1",
    chapter: "bab3",
    question: "Metodologi penelitian apa yang dipakai?",
    options: [
      "Waterfall",
      "Design and Development (D&D)",
      "Agile Scrum",
      "Prototyping klasik",
    ],
    answerIndex: 1,
    explanation:
      "Penelitian ini memakai metodologi Design and Development (D&D) karena sesuai untuk pengembangan sistem kompleks dengan tahapan desain, implementasi, dan evaluasi yang jelas.",
    sourceRef: "BAB 3.1 Metodologi Design and Development (D&D)",
    documentExcerpt:
      "Metodologi Design and Development (D&D) dipilih karena sesuai untuk pengembangan sistem kompleks.",
  },
  {
    id: "q3-2",
    chapter: "bab3",
    question: "Apa langkah pertama pipeline deteksi plat nomor?",
    options: [
      "PaddleOCR membaca karakter",
      "Kamera USB menangkap gambar kendaraan",
      "Koreksi format plat Indonesia",
      "CLAHE meningkatkan kontras",
    ],
    answerIndex: 1,
    explanation:
      "Pipeline deteksi plat nomor dimulai dari kamera USB menangkap gambar kendaraan di gerbang, baru kemudian YOLOv26 mendeteksi lokasi platnya.",
    sourceRef: "BAB 3.3 Perancangan Pipeline Deteksi Plat Nomor",
    documentExcerpt: "Pipeline dimulai dari kamera USB menangkap gambar kendaraan di gerbang.",
  },
  {
    id: "q3-3",
    chapter: "bab3",
    question: "Teknik apa yang dipakai memperbaiki distorsi sudut gambar plat?",
    options: [
      "Grayscale conversion",
      "Four-point transform (koreksi perspektif)",
      "Edge detection",
      "Image compression",
    ],
    answerIndex: 1,
    explanation:
      "Area plat yang terdeteksi dikoreksi perspektifnya memakai four-point transform (OpenCV) agar sudut pengambilan gambar yang miring tidak mengganggu pembacaan OCR.",
    sourceRef: "BAB 3.3 Perancangan Pipeline Deteksi Plat Nomor",
    documentExcerpt:
      "Area plat dipotong dan dikoreksi perspektif memakai four-point transform (OpenCV).",
  },
  {
    id: "q3-4",
    chapter: "bab3",
    question: "Bagaimana ESP32 terhubung ke server edge?",
    options: ["Bluetooth", "Serial UART", "LoRa", "Ethernet"],
    answerIndex: 1,
    explanation:
      "ESP32 berkomunikasi ke server edge lewat serial UART untuk mengirim data sensor dan menerima perintah aktuator.",
    sourceRef: "BAB 3 — Ringkasan Bab: \"ESP32 berkomunikasi ke server edge lewat serial UART\"",
    documentExcerpt: "ESP32 terhubung ke server edge lewat Bluetooth.",
    aiFlag: {
      wrongText: "terhubung ke server edge lewat Bluetooth",
      correctText:
        "Serial UART — sesuai skema rangkaian di dokumen kamu sendiri, bukan Bluetooth",
    },
  },
  {
    id: "q3-5",
    chapter: "bab3",
    question: "Payment gateway apa yang diintegrasikan untuk top-up saldo?",
    options: ["Xendit", "Midtrans", "Stripe", "Doku"],
    answerIndex: 1,
    explanation:
      "Aplikasi mobile terintegrasi dengan payment gateway Midtrans untuk top-up saldo dan pembayaran tagihan parkir.",
    sourceRef: "BAB 3.4 Perancangan Aplikasi Mobile & Web Dashboard",
    documentExcerpt:
      "Top-up saldo dan pembayaran tagihan parkir terintegrasi dengan Midtrans.",
  },
  {
    id: "q3-6",
    chapter: "bab3",
    question: "Model OCR apa yang dipakai membaca karakter plat?",
    options: [
      "Tesseract",
      "EasyOCR",
      "PaddleOCR (PP-OCRv4)",
      "Google Vision API",
    ],
    answerIndex: 2,
    explanation:
      "Karakter plat dibaca menggunakan PaddleOCR (PP-OCRv4) sebagai tahap akhir pipeline, setelah area plat dipotong dan melalui preprocessing.",
    sourceRef: "BAB 3.3 Perancangan Pipeline Deteksi Plat Nomor",
    documentExcerpt: "Karakter plat dibaca menggunakan PaddleOCR (PP-OCRv4).",
  },
  // BAB 4
  {
    id: "q4-1",
    chapter: "bab4",
    question: "Berapa precision YOLOv26 pada epoch terbaik (ke-47)?",
    options: ["85,0%", "93,83%", "96,99%", "98,19%"],
    answerIndex: 3,
    explanation:
      "Pada epoch terbaik (ke-47) dari 50 epoch training, YOLOv26 mencapai precision 98,19%, recall 93,83%, dan mAP@50 96,99% — angka 85,0% adalah detection rate pada data baru, bukan precision training.",
    sourceRef: "BAB 4.2 Hasil Pengujian Model YOLOv26",
    documentExcerpt:
      "Pada epoch terbaik (ke-47), YOLOv26 mencapai precision 98,19%, recall 93,83%, mAP@50 96,99%.",
  },
  {
    id: "q4-2",
    chapter: "bab4",
    question: "Berapa plate accuracy pipeline end-to-end?",
    options: ["24,4%", "55,0%", "85,0%", "100%"],
    answerIndex: 1,
    explanation:
      "Pipeline end-to-end (YOLOv26 + koreksi perspektif + preprocessing + PaddleOCR + koreksi format) menghasilkan plate accuracy 55,0% dengan CER rata-rata 24,4% — 24,4% adalah nilai CER, bukan plate accuracy.",
    sourceRef: "BAB 4.3 Hasil Pengujian PaddleOCR & Pipeline End-to-End",
    documentExcerpt:
      "Pipeline end-to-end menghasilkan plate accuracy 55,0% dan CER rata-rata 24,4%.",
  },
  {
    id: "q4-3",
    chapter: "bab4",
    question: "Kategori plat apa yang detection rate-nya terendah?",
    options: [
      "Plat terang posisi lurus",
      "Plat kuning",
      "Plat gelap posisi miring",
      "Plat dari ilustrasi digital",
    ],
    answerIndex: 2,
    explanation:
      "Kegagalan deteksi paling banyak terjadi pada gambar berkontras rendah dan bersudut miring, sehingga kategori plat gelap posisi miring punya detection rate terendah — berbanding terbalik dengan plat terang posisi lurus yang mencapai 100%.",
    sourceRef: "BAB 4.2 Hasil Pengujian Model YOLOv26",
    documentExcerpt:
      "Kegagalan deteksi terjadi pada gambar kontras rendah dan sudut miring; plat gelap posisi miring paling menantang.",
  },
  {
    id: "q4-4",
    chapter: "bab4",
    question: "Berapa skenario pengujian aplikasi mobile yang berhasil?",
    options: [
      "28 dari 31",
      "30 dari 31",
      "31 dari 31 (100%)",
      "25 dari 31",
    ],
    answerIndex: 2,
    explanation:
      "Seluruh 31 skenario pengujian black box aplikasi mobile (autentikasi, kendaraan, sesi parkir, dompet, riwayat, profil) berhasil 100%.",
    sourceRef: "BAB 4.4 Pengujian Aplikasi & Rekapitulasi",
    documentExcerpt:
      "Seluruh 31 skenario pengujian black box aplikasi mobile berhasil (100%).",
  },
  {
    id: "q4-5",
    chapter: "bab4",
    question: "Fitur web dashboard apa yang gagal saat pengujian?",
    options: [
      "Login admin",
      "Ekspor laporan ke PDF/Excel",
      "Manajemen slot parkir",
      "Pembatasan hak akses",
    ],
    answerIndex: 1,
    explanation:
      "Dari 36 skenario pengujian web dashboard, kendala ditemukan pada filter transaksi dan ekspor laporan — bukan pada login, manajemen slot, atau hak akses.",
    sourceRef: "BAB 4.4 Pengujian Aplikasi & Rekapitulasi",
    documentExcerpt:
      "Kendala pengujian web dashboard ditemukan pada filter transaksi dan ekspor laporan.",
  },
  {
    id: "q4-6",
    chapter: "bab4",
    question: "Berapa waktu inferensi rata-rata YOLOv26 per gambar?",
    options: ["9,3 ms", "93,2 ms", "932 ms", "9,32 detik"],
    answerIndex: 1,
    explanation:
      "Pada pengujian 20 gambar baru, YOLOv26 punya waktu inferensi rata-rata 93,2 ms per gambar dengan confidence rata-rata 0,8103.",
    sourceRef: "BAB 4.2 Hasil Pengujian Model YOLOv26",
    documentExcerpt: "Waktu inferensi rata-rata YOLOv26 adalah 9,32 detik per gambar.",
    aiFlag: {
      wrongText: "9,32 detik per gambar",
      correctText:
        "93,2 milidetik (ms) per gambar — ada salah satuan di dokumen kamu, bukan 9,32 detik",
    },
  },
];

/* ========== Ujian Lisan ========== */

export interface OralSession {
  id: number;
  chapter: ChapterId;
  dateLabel: string;
  durationLabel: string;
  rapor: [string, string];
  strengths: string[];
  weaknesses: string[];
  transcriptPreview: { speaker: "penguji" | "anda"; text: string }[];
}

export const oralSessions: OralSession[] = [
  {
    id: 3,
    chapter: "bab1",
    dateLabel: "8 Jul 2026, 23:10",
    durationLabel: "18 menit",
    rapor: [
      "Kuat di latar belakang & tujuan penelitian.",
      "Masih lemah di penjelasan research gap dan alasan memilih metode D&D.",
    ],
    strengths: [
      "Menjelaskan urgensi penelitian dengan runtut dan percaya diri",
      "Hafal angka-angka kunci (166 juta kendaraan, kenaikan 6,66%/tahun)",
    ],
    weaknesses: [
      "Penjelasan research gap masih berputar-putar",
      "Belum bisa menjawab kenapa memilih metode D&D dibanding metodologi lain",
    ],
    transcriptPreview: [
      {
        speaker: "penguji",
        text: "Apa yang membedakan penelitian Anda dari sistem parkir berbasis sensor yang sudah ada?",
      },
      {
        speaker: "anda",
        text: "Sistem yang ada umumnya hanya mendeteksi slot... eh, maksud saya, belum terintegrasi dengan identifikasi kendaraan...",
      },
    ],
  },
  {
    id: 2,
    chapter: "bab3",
    dateLabel: "5 Jul 2026, 21:04",
    durationLabel: "25 menit",
    rapor: [
      "Penjelasan arsitektur sistem runtut.",
      "Jawaban soal akurasi PaddleOCR (55%) masih ragu-ragu — perlu siapkan analisis penyebab & rencana perbaikan.",
    ],
    strengths: [
      "Arsitektur 3 layer dijelaskan lengkap dengan alur datanya",
      "Menguasai detail pipeline deteksi plat nomor",
    ],
    weaknesses: [
      "Terbata-bata saat ditanya kenapa akurasi OCR hanya 55%",
      "Belum menyebut rencana perbaikan (dataset, pencahayaan, sudut kamera)",
    ],
    transcriptPreview: [
      {
        speaker: "penguji",
        text: "Akurasi OCR Anda hanya 55 persen. Menurut Anda apa penyebab utamanya?",
      },
      {
        speaker: "anda",
        text: "Kalau dari hasil pengujian... plat gelap yang miring paling sulit karena kontrasnya rendah, Pak.",
      },
    ],
  },
  {
    id: 1,
    chapter: "bab2",
    dateLabel: "2 Jul 2026, 20:15",
    durationLabel: "20 menit",
    rapor: [
      "Masih sering membaca ulang isi bab; perlu menjawab dengan bahasa sendiri.",
      "Topik lemah: perbedaan ToF vs ultrasonik.",
    ],
    strengths: ["Sikap tenang, tidak panik saat dipotong pertanyaan"],
    weaknesses: [
      "Jawaban terdengar seperti membaca teks skripsi",
      "Tertukar menjelaskan cara kerja ToF dan ultrasonik",
    ],
    transcriptPreview: [
      {
        speaker: "penguji",
        text: "Coba jelaskan perbedaan prinsip kerja sensor ToF dan ultrasonik.",
      },
      {
        speaker: "anda",
        text: "ToF itu... memakai gelombang suara... eh maaf, maksudnya laser inframerah, Pak.",
      },
    ],
  },
];

/** Skrip percakapan simulasi untuk sesi live (dummy) — beda per BAB. */
export const liveScript: Record<
  ChapterId,
  { speaker: "penguji" | "anda"; text: string }[]
> = {
  bab1: [
    {
      speaker: "penguji",
      text: "Selamat pagi. Sebelum masuk ke detail teknis, coba jelaskan secara singkat urgensi utama penelitian Anda.",
    },
    {
      speaker: "anda",
      text: "Baik, Pak. Penelitian ini berangkat dari pengelolaan parkir konvensional yang tidak efisien — pencatatan manual rawan salah dan status slot tidak real-time, padahal jumlah kendaraan terus meningkat...",
    },
    {
      speaker: "penguji",
      text: "Di sesi sebelumnya Anda masih lemah menjelaskan research gap. Sekarang coba: apa yang membedakan sistem Anda dari sistem parkir berbasis sensor yang sudah ada?",
    },
    {
      speaker: "anda",
      text: "Sistem yang sudah ada umumnya hanya mendeteksi slot kosong, tapi tidak terintegrasi dengan identifikasi kendaraan. Sistem saya menggabungkan deteksi plat nomor YOLOv26 + PaddleOCR dengan monitoring slot berbasis VL53L1X dalam satu kesatuan...",
    },
    {
      speaker: "penguji",
      text: "Bagus, ada peningkatan. Kenapa masalah ini penting diselesaikan sekarang, bukan lima tahun lalu?",
    },
    {
      speaker: "anda",
      text: "(sedang bicara...)",
    },
  ],
  bab2: [
    {
      speaker: "penguji",
      text: "Kita masuk ke dasar teori. Coba jelaskan prinsip kerja sensor Time-of-Flight yang Anda pakai untuk slot parkir.",
    },
    {
      speaker: "anda",
      text: "ToF mengukur jarak dengan menghitung waktu tempuh pulsa laser inframerah dari sensor ke objek dan kembali, Pak. Waktu tempuh itu dikalikan kecepatan cahaya untuk dapat jaraknya...",
    },
    {
      speaker: "penguji",
      text: "Kenapa Anda memilih ToF, bukan ultrasonik yang jauh lebih murah?",
    },
    {
      speaker: "anda",
      text: "Ultrasonik rentan terhadap pantulan permukaan miring dan noise suara sekitar, sementara ToF lebih presisi untuk jarak dekat dan tidak terganggu kondisi pencahayaan...",
    },
    {
      speaker: "penguji",
      text: "Bagaimana dengan algoritma deteksi plat nomornya — kenapa pilih YOLOv26 dibanding versi sebelumnya?",
    },
    {
      speaker: "anda",
      text: "(sedang bicara...)",
    },
  ],
  bab3: [
    {
      speaker: "penguji",
      text: "Coba jelaskan arsitektur sistem Anda secara keseluruhan, dari input sampai output.",
    },
    {
      speaker: "anda",
      text: "Sistem terdiri dari 3 layer, Pak: layer sensor untuk deteksi slot via VL53L1X, layer pemrosesan citra untuk deteksi plat pakai YOLOv26 dan PaddleOCR, dan layer aplikasi untuk menampilkan status ke pengguna...",
    },
    {
      speaker: "penguji",
      text: "Kenapa Anda memilih metode Design and Development (D&D) dibanding metodologi penelitian lain?",
    },
    {
      speaker: "anda",
      text: "Karena penelitian ini menghasilkan produk/prototipe sistem, bukan sekadar menguji hipotesis, jadi D&D lebih cocok karena tahapannya iteratif: analisis kebutuhan, desain, pengembangan, lalu evaluasi berulang...",
    },
    {
      speaker: "penguji",
      text: "Bagaimana alur datanya dari kamera sampai status slot ter-update di aplikasi?",
    },
    {
      speaker: "anda",
      text: "(sedang bicara...)",
    },
  ],
  bab4: [
    {
      speaker: "penguji",
      text: "Mari bahas hasil pengujian. Akurasi OCR Anda hanya 55 persen — menurut Anda apa penyebab utamanya?",
    },
    {
      speaker: "anda",
      text: "Dari hasil pengujian, plat yang gelap dan posisinya miring paling sering salah baca karena kontrasnya rendah dan sudut pengambilan gambar tidak tegak lurus, Pak...",
    },
    {
      speaker: "penguji",
      text: "Bagaimana dengan waktu inferensi YOLOv26 — apakah sudah cukup cepat untuk real-time?",
    },
    {
      speaker: "anda",
      text: "Rata-rata 93,2 milidetik per gambar, Pak, jadi masih tergolong real-time untuk kebutuhan monitoring slot parkir...",
    },
    {
      speaker: "penguji",
      text: "Kalau begitu, apa rencana perbaikan Anda untuk menaikkan akurasi OCR itu?",
    },
    {
      speaker: "anda",
      text: "(sedang bicara...)",
    },
  ],
};

export const liveEvaluation: Record<
  ChapterId,
  { rapor: [string, string]; strengths: string[]; weaknesses: string[] }
> = {
  bab1: {
    rapor: [
      "Progres bagus: urgensi penelitian sudah terjawab runtut.",
      "Fokus berikutnya — perkuat argumen kenapa masalah ini mendesak diselesaikan sekarang.",
    ],
    strengths: [
      "Urgensi penelitian dijelaskan dengan data & konteks yang jelas",
      "Percaya diri dan tidak terbata-bata di pembukaan",
    ],
    weaknesses: [
      "Argumen urgensi waktu (kenapa sekarang) masih umum, belum spesifik",
      "Belum menyinggung dampak kalau masalah ini dibiarkan",
    ],
  },
  bab2: {
    rapor: [
      "Progres bagus: prinsip kerja ToF sudah dijelaskan runtut.",
      "Fokus berikutnya — alasan teknis pemilihan komponen (ToF vs ultrasonik) dan justifikasi biaya.",
    ],
    strengths: [
      "Prinsip kerja sensor ToF dijelaskan dengan istilah teknis yang tepat",
      "Menghubungkan jawaban dengan hasil pengujian di BAB 4",
    ],
    weaknesses: [
      "Perbandingan ToF vs ultrasonik masih menyebut fitur, belum trade-off",
      "Belum menyinggung pertimbangan biaya komponen",
    ],
  },
  bab3: {
    rapor: [
      "Progres bagus: arsitektur 3 layer sudah dijelaskan lengkap.",
      "Fokus berikutnya — perkuat justifikasi pemilihan metode D&D dibanding metodologi lain.",
    ],
    strengths: [
      "Arsitektur sistem dijelaskan runtut dari sensor sampai aplikasi",
      "Paham alasan memilih metode D&D untuk penelitian berbasis produk",
    ],
    weaknesses: [
      "Alur data antar-layer masih perlu diperjelas dengan diagram",
      "Belum menyebut alternatif metodologi yang dipertimbangkan & alasan menolaknya",
    ],
  },
  bab4: {
    rapor: [
      "Progres bagus: penyebab akurasi OCR rendah sudah teridentifikasi.",
      "Fokus berikutnya — siapkan rencana perbaikan konkret (dataset, pencahayaan, sudut kamera).",
    ],
    strengths: [
      "Waktu inferensi YOLOv26 dihafal dan dijelaskan dengan tepat",
      "Mengenali pola kegagalan OCR (plat gelap & miring)",
    ],
    weaknesses: [
      "Rencana perbaikan akurasi OCR belum konkret",
      "Belum membandingkan hasil dengan penelitian sejenis",
    ],
  },
};
