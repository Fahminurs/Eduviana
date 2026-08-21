# Wireframe ASCII — Eduviana

Sketsa kasar struktur layout untuk seluruh 7 fitur + Beranda, **bukan** desain visual final (warna/font asli ditentukan lewat pratinjau visual terpisah sebelum implementasi FE). Sidebar kiri sama persis di semua halaman — cuma menu yang aktif (ditandai `◀━━`) yang berubah.

## 5.0 Beranda

*(Ditambahkan belakangan — sudah dibangun di FE, lihat `PRD.md` 5.0. Halaman `/`, bukan bagian menu sidebar — diakses lewat klik logo Eduviana.)*

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │                                                       │
│                  │              Menuju Sidang Skripsi                   │
│  ▸ History File  │                                                       │
│    ⌄ (2)         │                  ┌─────────┐                        │
│    • skripsi_v2  │                  │  H-16   │                        │
│    • skripsi_v1  │                  └─────────┘                        │
│  ─────────────   │              4 Agustus 2026                          │
│  🎙 Latihan       │      2 dari 4 BAB sudah kamu kuasai.                 │
│     Sidang Lisan │      Yuk lanjutkan biar makin siap!                  │
│                  │                                                       │
│  📄 Rangkuman     │  ┌─────────────────────────────────────────────────┐ │
│                  │  │           ✨ Waktu Terus Berjalan                │ │
│  🔤 Glosarium     │  │                                                   │ │
│                  │  │     16      08      42      07                  │ │
│  🧠 Mind Map      │  │    Hari    Jam    Menit   Detik                 │ │
│                  │  │   (update tiap detik, live)                      │ │
│  🃏 Flashcard     │  └─────────────────────────────────────────────────┘ │
│                  │                                                       │
│  📝 Quiz          │                                                       │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: kartu H- berubah warna makin "genting" mendekati hari-H (iris → amber ≤14 hari → merah ≤7 hari, dengan efek glow berdenyut). Status "kuasai" per BAB dipakai untuk hitung "X dari Y BAB" — lihat aturan yang diusulkan di `PRD.md` 5.0 (belum final).

## 5.1 Manajemen Dokumen Skripsi (History File)

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  History File                                        │
│                  │                                                       │
│  ▸ History File◀━│  ┌─────────────────────────────────────────────────┐ │
│    ⌄ (2)         │  │  📤  Tarik file ke sini, atau klik untuk upload  │ │
│    • skripsi_v2  │  │      (.docx / .pdf)                              │ │
│    • skripsi_v1  │  └─────────────────────────────────────────────────┘ │
│  ─────────────   │                                                       │
│  🎙 Latihan       │  DOKUMEN TERSIMPAN                                   │
│     Sidang Lisan │  ┌─────────────────────────────────────────────────┐ │
│                  │  │ ● skripsi_v2.docx          [Aktif]  ✓ Selesai    │ │
│  📄 Rangkuman     │  │   diupload 3 hari lalu                8 BAB      │ │
│                  │  ├─────────────────────────────────────────────────┤ │
│  🔤 Glosarium     │  │ ○ skripsi_v1.docx                    ✓ Selesai   │ │
│                  │  │   diupload 2 minggu lalu    [Jadikan Aktif]      │ │
│  🧠 Mind Map      │  ├─────────────────────────────────────────────────┤ │
│                  │  │ ○ draft_bab3.docx           ⏳ Sedang diproses... │ │
│  🃏 Flashcard     │  └─────────────────────────────────────────────────┘ │
│                  │                                                       │
│  📝 Quiz          │  [+ Upload Dokumen Baru]                             │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: daftar dokumen fleksibel (bukan slot tetap), tiap item bisa "Jadikan Aktif", status generate (selesai/diproses/gagal) tampil per dokumen. Header grup "History File" juga punya ikon sync kecil (🔄, di sebelah label) yang membuka panel **Jurnal Referensi** — lihat 5.8 di bawah, terpisah dari daftar dokumen skripsi di atas.

### Panel Jurnal Referensi (5.8, dibuka dari ikon 🔄 di atas)

```
┌─────────────────────────────────┐
│  Jurnal Referensi            [x]│
│  Sumber sitasi buat Quiz &       │
│  Ujian Lisan.                    │
│                                   │
│  📁 D:\Skripsi\Dokumen\Jurnal    │
│                                   │
│  5 jurnal terindeks   ✓ Sinkron  │
│                        2 jam lalu│
│                                   │
│  [ 🔄 Sync Jurnal ]              │
│                                   │
│  SEMUA JURNAL TERINDEKS          │
│  ✓ deteksi-plat-yolo-2023.pdf    │
│  ✓ sensor-tof-parkir-2022.pdf    │
│  ✓ paddleocr-akurasi-plat-24.pdf │
│  ...                              │
└─────────────────────────────────┘
```

Catatan: sync incremental (cuma file baru yang diproses, bukan re-index semua), status per file (✓ berhasil / ✕ gagal dibaca). Isi jurnal **tidak** dipakai Rangkuman/Glosarium/Mind Map/Flashcard — cuma Quiz & Ujian Lisan (lihat `PRD.md` 5.8).

## 5.2 Latihan Sidang Lisan

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  🎙 Latihan Sidang Lisan                              │
│                  │                                                       │
│  ▸ History File  │  Durasi sesi: [ 20 menit ▾ ]      [ ● Mulai Sesi ]   │
│    ⌄ (2)         │                                                       │
│    • skripsi_v2  │  ┌─────────────────────────────────────────────────┐ │
│    • skripsi_v1  │  │             🎙  (mic aktif, bicara...)           │ │
│  ─────────────   │  │                                                   │ │
│  🎙 Latihan    ◀━━│  │  PENGUJI: Selamat pagi. Coba jelaskan singkat    │ │
│     Sidang Lisan │  │  urgensi utama penelitian Anda?                  │ │
│                  │  │                                                   │ │
│  📄 Rangkuman     │  │  ANDA: (sedang bicara...)                        │ │
│                  │  └─────────────────────────────────────────────────┘ │
│  🔤 Glosarium     │                                                       │
│                  │  ⏱ 04:32 / 20:00                    [ ■ Akhiri Sesi ] │
│  🧠 Mind Map      │  ─────────────────────────────────────────────────── │
│                  │  RIWAYAT SESI SEBELUMNYA                             │
│  🃏 Flashcard     │  ┌─────────────────────────────────────────────────┐ │
│                  │  │ Sesi #3 — 8 Jul, 23:10 (18 menit)                │ │
│  📝 Quiz          │  │ 🔑 Rapor: Kuat di latar belakang, masih lemah    │ │
│                  │  │    di penjelasan research gap        [Lihat >]   │ │
│                  │  └─────────────────────────────────────────────────┘ │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: transkrip live streaming selama sesi, ringkasan evaluasi ("Rapor") terpisah dari transkrip mentah, riwayat sesi sebelumnya bisa dibuka lagi.

## 5.3 Rangkuman per BAB

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  BAB:  [ 2. Dasar Teori ▾ ]                          │
│                  │                                                       │
│  ▸ History File  │  ┌─────────────────────────────────────────────────┐ │
│    ⌄ (2)         │  │ GAMBARAN SINGKAT                                │ │
│    • skripsi_v2  │  │ Bab ini membahas dasar teori sensor jarak,      │ │
│    • skripsi_v1  │  │ deep learning, dan komponen perangkat keras      │ │
│                  │  │ yang mendukung sistem parkir cerdas.             │ │
│  ─────────────   │  └─────────────────────────────────────────────────┘ │
│  🎙 Latihan       │                                                       │
│     Sidang Lisan │  POIN PENTING                                        │
│                  │  • Sensor VL53L1X (ToF) lebih akurat & rendah        │
│  📄 Rangkuman  ◀━━│    latensi dibanding sensor ultrasonik              │
│                  │  • YOLO menyederhanakan deteksi objek jadi 1 langkah │
│  🔤 Glosarium     │  • ESP32 jadi unit pemrosesan utama sistem           │
│                  │                                                       │
│  🧠 Mind Map      │  2.3 Sensor Pengukur Jarak                           │
│                  │  ──────────────────────────                          │
│  🃏 Flashcard     │  2.3.1 Sensor VL53L1X                                │
│                  │  VL53L1X adalah sensor jarak berbasis Time-of-Flight │
│  📝 Quiz          │  (ToF)... mengukur waktu pantulan laser inframerah.  │
│                  │                                                       │
│                  │  ┌───────────────────────────────────┐               │
│                  │  │ [gambar: rangkaian sensor VL53L1X]  │  ← nempel di │
│                  │  │        (auto dari caption)          │    teks ini  │
│                  │  └───────────────────────────────────┘               │
│                  │                                                       │
│                  │  🔑 Penting                                          │
│                  │  ┃ Sensor ToF unggul di akurasi & latensi rendah    │
│                  │  ┃ dibanding ultrasonik/infrared konvensional.       │
│                  │                                                       │
│                  │  2.3.2 Sensor HC-SR04                                │
│                  │  HC-SR04 adalah sensor jarak ultrasonik...            │
│                  │                                                       │
│                  │  📝 Contoh                                           │
│                  │  ┃ HC-SR04 dipakai deteksi kendaraan di gerbang.      │
│                  │                                                       │
│                  │  ┌─────────────────────────────────────────────────┐ │
│                  │  │ ✏ Catatan pribadi untuk BAB ini...              │ │
│                  │  └─────────────────────────────────────────────────┘ │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan struktur:
- Sidebar kiri: "History File" collapsible (fleksibel, menampung berapa pun dokumen), menu lain di bawahnya, item aktif (Rangkuman) ditandai highlight aksen.
- Pemilih BAB di kanan atas, dipakai bersama semua tab (Rangkuman, Glosarium, Mind Map, Flashcard, Quiz).
- Urutan konten: Gambaran Singkat → Poin Penting → isi lengkap per sub-bab → gambar nempel otomatis dekat teks relevan → kotak callout 🔑 Penting / 📝 Contoh → catatan pribadi di paling bawah.

## 5.4 Glosarium Istilah

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  BAB:  [ Semua BAB ▾ ]      🔍 [ cari istilah...   ] │
│                  │                                                       │
│  ▸ History File  │  ┌─────────────────────────────────────────────────┐ │
│    ⌄ (2)         │  │ YOLO (You Only Look Once)                       │ │
│    • skripsi_v2  │  │ Algoritma deteksi objek yang memproses seluruh   │ │
│    • skripsi_v1  │  │ gambar sekaligus untuk mendeteksi objek & kelas  │ │
│  ─────────────   │  │ secara bersamaan.                                │ │
│  🎙 Latihan       │  │ ✏ Catatan: inget sebut versi YOLOv8 dipakai      │ │
│     Sidang Lisan │  ├─────────────────────────────────────────────────┤ │
│                  │  │ Time of Flight (ToF)                            │ │
│  📄 Rangkuman     │  │ Teknologi sensor yang mengukur jarak dengan     │ │
│                  │  │ menghitung waktu pantul cahaya inframerah.       │ │
│  🔤 Glosarium  ◀━━│  ├─────────────────────────────────────────────────┤ │
│                  │  │ PaddleOCR                                        │ │
│  🧠 Mind Map      │  │ Toolkit OCR untuk membaca karakter dari gambar. │ │
│                  │  └─────────────────────────────────────────────────┘ │
│  🃏 Flashcard     │                                                       │
│                  │                                                       │
│  📝 Quiz          │                                                       │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: pencarian istilah di atas, catatan pribadi per istilah, BAB selector di sini juga bisa "Semua BAB" (istilah biasanya tidak terikat 1 BAB saja).

## 5.5 Mind Map Topik

```
┌─────────────────┬──────────────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  BAB:  [ 2. Dasar Teori ▾ ]                    [ + ] [ - ]   │
│                  │ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│  ▸ History File  │ · · · · · · · · · · ┌───────────┐    ┌────────────┐ · · · · │
│    ⌄ (2)         │ · · · · · · ┌──────▸│ Sensor   ▾│───▸│  VL53L1X   │ · · · · │
│    • skripsi_v2  │ · · · · · · │       │ Jarak     │    └────────────┘ · · · · │
│    • skripsi_v1  │ · · · · · · │       └───────────┘                  · · · · │
│  ─────────────   │ ┌─────────┐ │       ┌───────────┐                  · · · · │
│  🎙 Latihan       │ │ Dasar  ▾│─┼──────▸│  YOLO    ›│  (tertutup)      · · · · │
│     Sidang Lisan │ │ Teori   │ │       └───────────┘                  · · · · │
│                  │ └─────────┘ │       ┌───────────┐                  · · · · │
│  📄 Rangkuman     │ · · · · · · └──────▸│  ESP32   ›│  (tertutup)      · · · · │
│                  │ · · · · · · · · ·    └───────────┘                  · · · · │
│  🔤 Glosarium     │ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│                  │ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│  🧠 Mind Map   ◀━━│   (kanvas dot-grid, root di kiri, cabang meluas ke kanan)   │
│                  │ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · │
│  🃏 Flashcard     │                                                             │
│  📝 Quiz          │                                                             │
└─────────────────┴──────────────────────────────────────────────────────────────┘
```
`▾` = cabang lagi terbuka (anaknya kelihatan) · `›` = cabang tertutup (klik buat buka, anaknya tersembunyi sementara)

Catatan (sudah divalidasi, bukan cuma rencana di atas kertas):
- Library: **React Flow** (`@xyflow/react`) — dikonfirmasi dari kode aslinya, aplikasi belajar sejenis (Maeve) juga pakai library yang sama persis untuk mind map mereka, hasilnya rapi.
- **Orientasi kiri-ke-kanan** (root/BAB di kolom paling kiri, meluas ke kanan per tingkat kedalaman) — dikonfirmasi dari koordinat asli di kode Maeve, **bukan** atas-ke-bawah.
- Garis penghubung digambar melengkung (kurva bezier halus), **bukan** garis siku-siku lurus seperti di ASCII di atas (ASCII cuma representasi kasar, gak bisa gambar kurva) — ini kunci supaya hasilnya terasa "mind map" bukan "flowchart".
- Layout node (root → topik → konsep → sub-konsep) dihitung otomatis oleh `dagre`.
- Background dot-grid + radial fade tetap dipakai (fitur bawaan React Flow), bisa di-zoom/pan.
- **Expand/collapse per node** — React Flow sendiri tidak punya fitur ini bawaan (beda dari Maeve yang menampilkan semua sekaligus tanpa collapse), jadi ini **dibangun manual di atas React Flow**: tiap node yang punya anak dikasih ikon `▾`/`›`, diklik buat sembunyikan/tampilkan node & garis anaknya.

## 5.6 Flashcard Tanya-Jawab

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  BAB: [ 2. Dasar Teori ▾ ]  Mode: [ Belajar ▾ ]      │
│                  │                                                       │
│  ▸ History File  │   ● 14 Belum dikenal   ● 5 Sedang dipelajari  ● 3 OK │
│    ⌄ (2)         │                                                       │
│    • skripsi_v2  │  ┌─────────────────────────────────────────────────┐ │
│    • skripsi_v1  │  │                                                   │ │
│  ─────────────   │  │      Apa keunggulan sensor ToF dibanding         │ │
│  🎙 Latihan       │  │      sensor ultrasonik untuk deteksi slot        │ │
│     Sidang Lisan │  │      parkir?                                     │ │
│                  │  │                                                   │ │
│  📄 Rangkuman     │  │         (klik / tekan Spasi untuk buka jawaban)  │ │
│                  │  │                                                   │ │
│  🔤 Glosarium     │  └─────────────────────────────────────────────────┘ │
│                  │                                                       │
│  🧠 Mind Map      │  [ ✕ Saya tidak tahu ]        [ ✓ Saya tahu ]        │
│                  │                                                       │
│  🃏 Flashcard  ◀━━│   ◂          12 / 42          ▸            🔀        │
│                  │                                                       │
│  📝 Quiz          │                                                       │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: badge kategori cuma tampil di mode Belajar/Uji (mode Standar tanpa tombol Tahu/Tidak tahu & tanpa badge). Tombol panah atas/bawah = shortcut keyboard buat Tahu/Tidak tahu.

## 5.7 Quiz Pilihan Ganda

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│  🎓 Eduviana     │  BAB: [ 2. Dasar Teori ▾ ]  Soal: [ 10 ▾ ]  4 / 10   │
│                  │                              (5/10/15/20 pilihan)    │
│  ▸ History File  │  ┌─────────────────────────────────────────────────┐ │
│    ⌄ (2)         │  │ Apa fungsi utama TCA9548A dalam sistem ini?      │ │
│    • skripsi_v2  │  └─────────────────────────────────────────────────┘ │
│    • skripsi_v1  │                                                       │
│  ─────────────   │  ○ A. Mengukur jarak kendaraan                       │
│  🎙 Latihan       │  ○ B. Mengelola beberapa sensor I2C beralamat sama   │
│     Sidang Lisan │  ○ C. Membaca karakter plat nomor                    │
│                  │  ○ D. Menggerakkan palang pintu                      │
│  📄 Rangkuman     │                                                       │
│                  │                          [ Soal Berikutnya → ]        │
│  🔤 Glosarium     │  ─────────────────────────────────────────────────── │
│                  │  ── setelah soal terakhir ──                         │
│  🧠 Mind Map      │  ┌─────────────────────────────────────────────────┐ │
│                  │  │        🎯  Skor Anda: 7 / 10                    │ │
│  🃏 Flashcard     │  │  2 soal yang salah otomatis lebih sering         │ │
│                  │  │  muncul di sesi quiz berikutnya.                 │ │
│  📝 Quiz       ◀━━│  │              [ Ulangi Quiz ]                     │ │
│                  │  └─────────────────────────────────────────────────┘ │
└─────────────────┴──────────────────────────────────────────────────────┘
```

Catatan: soal & urutan diacak tiap sesi, skor tampil di akhir, soal yang salah masuk logic "sering salah" (sama seperti flashcard). Layar hasil (setelah soal terakhir) juga menampilkan pembahasan per soal: kutipan dokumen pengguna + kotak "Verifikasi AI" (konfirmasi kalau dokumen sudah benar, atau koreksi eksplisit kalau dokumen keliru secara faktual) — belum tergambar di sketsa ASCII di atas, lihat `PRD.md` 5.7.
