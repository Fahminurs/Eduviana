# Instruksi untuk Agent FE (Fable/Sonnet, Antigravity)

> **Sebelum kirim ke agent:** pastikan model picker sudah diset ke **Sonnet**, **Effort: xhigh + workflows**, **Thinking: ON** — instruksi ini cuma teks tugas, bukan pengatur model (itu setting UI terpisah, dicek manual tiap kali sebelum kirim).

---

Baca dulu 3 hal ini di folder Planning/ pada project ini sebelum mulai:
- PRD.md (spesifikasi lengkap: fitur, tech stack, arsitektur, database)
- WIREFRAMES.md (sketsa layout tiap fitur)
- referensi-fe/ (2 contoh PDF dari aplikasi belajar sejenis, buat rujukan visual)

**Lokasi project: inisialisasi & simpan seluruh kode di `D:\AI\Oram Exam Test Gemini\coba_fable`** — folder ini khusus untuk percobaan build dari Fable/Sonnet (terpisah dari `Planning/` yang isinya cuma dokumen, dan terpisah juga dari build Antigravity yang lain kalau ada). Jangan bangun kode Next.js-nya di dalam folder Planning.

**Catatan soal ikon di WIREFRAMES.md:** emoji (🎓📄🔤🧠🃏📝🎙) yang muncul di sketsa ASCII itu cuma PLACEHOLDER buat mewakili konsep ikon — JANGAN dipakai sebagai emoji beneran di kode. Ganti semua jadi ikon Lucide (`lucide-react`) yang maknanya sepadan (misal 🎓→GraduationCap, 📄→FileText, 🔤→BookOpen, 🧠→Network/Brain, 🃏→Layers, 📝→ClipboardList, 🎙→Mic).

Stack final (lihat PRD.md bagian "Ringkasan stack"):
Next.js (App Router) + shadcn/ui (di atas Radix UI) + Tailwind CSS +
Lucide (lucide-react) untuk ikon + React Flow (@xyflow/react) khusus
untuk fitur Mind Map.

Tema visual final (lihat PRD.md bagian 9):
- Dark mode permanen, tanpa toggle ke mode terang
- Background dasar: Zinc/Graphite (#18181B)
- Warna aksen: Indigo/Violet "Iris" (#6E56CF, skala Radix Colors),
  dipakai hemat - untuk item sidebar aktif, tombol utama, penanda progres
- Font judul/heading/menu: Bricolage Grotesque
- Font isi paragraf: IBM Plex Sans

PENTING - urutan pengerjaan: kerjakan FRONTEND DULU pakai DATA
DUMMY/MOCK untuk semua fitur. Backend FastAPI belum ada sama sekali,
JANGAN nunggu backend siap - nanti data dummy tinggal diganti jadi
panggilan API sungguhan setelah backend jalan.

Kerjakan LANGSUNG SEKALIGUS, jangan bertahap per komponen - bangun
semua dalam satu kali jalan:

1. Setup project Next.js + Tailwind + shadcn/ui + font di atas
2. Layout shell + sidebar navigasi persisten (menu: History File,
   Ujian Lisan, Rangkuman, Glosarium, Mind Map, Flashcard, Quiz)
3. Semua 7 halaman fitur, masing-masing sesuai sketsa & detail di
   WIREFRAMES.md (5.1 - 5.7), berisi data dummy yang masuk akal
   (contoh isi dari tema sistem parkir cerdas, sesuai konten skripsi
   di PRD.md) - termasuk:
   - History File: contoh 2 dokumen dengan status berbeda
   - Ujian Lisan: UI sesi + riwayat sesi dummy
   - Rangkuman: struktur Gambaran Singkat -> Poin Penting -> isi
     dengan kotak callout Penting/Contoh
   - Glosarium: daftar istilah + pencarian
   - Mind Map: pohon React Flow kiri-ke-kanan, kurva bezier, dot-grid
     background, expand/collapse per node (lihat detail di WIREFRAMES.md 5.5)
   - Flashcard: 3 mode (Standar/Belajar/Uji) dengan kategori
     Belum dikenal/Sedang dipelajari/Dikuasai
   - Quiz: soal pilihan ganda + skor akhir

SETELAH semua halaman selesai dibangun, lakukan VERIFIKASI VISUAL
sendiri pakai Playwright (pakai Playwright MCP kalau tersedia di
environment-mu; kalau tidak, install & jalankan Playwright lewat
script/terminal biasa):

1. Jalankan dev server, buka SETIAP halaman (History File, Ujian
   Lisan, Rangkuman, Glosarium, Mind Map, Flashcard, Quiz), ambil
   screenshot penuh tiap halaman.
2. Periksa tiap screenshot, cek:
   - Spacing/jarak antar elemen konsisten
   - Elemen sejajar/simetris dengan benar
   - Teks kebaca jelas di dark mode (kontras cukup)
   - Sidebar & item aktifnya konsisten di semua halaman
   - Tidak ada elemen terpotong/overflow/bertabrakan
3. Kalau nemu yang kurang rapi, PERBAIKI kodenya, lalu screenshot
   ULANG halaman yang sama buat pastikan sudah benar.
4. Ulangi langkah 1-3 sampai SEMUA halaman rapi tanpa masalah visual
   - jangan berhenti di 1 kali cek saja kalau masih ada yang kurang pas.
5. Terakhir, cek juga tampilan di lebar layar sempit (mobile, ~375px)
   dan lebar penuh (desktop, ~1440px) - pastikan tidak rusak di keduanya.

Baru setelah semua ini beres dan rapi, laporkan ringkasan hasil akhirnya.
