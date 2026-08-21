# Eduviana

Aplikasi web untuk siapa saja yang perlu mendalami sebuah dokumen sampai benar-benar paham, lalu berlatih menjelaskannya secara lisan — bukan cuma mahasiswa yang bersiap sidang skripsi, tapi juga siapa pun yang bersiap presentasi, wawancara, atau ujian lisan lain. Cukup upload dokumennya, dan Eduviana membuatkan mind map, flashcard, rangkuman, quiz, sampai simulasi tanya-jawab lisan dengan AI yang berperan sebagai penguji.

## Ide Utama

1. **Upload dokumen** (Word/PDF) yang mau dikuasai — skripsi, materi presentasi, bahan wawancara, atau dokumen belajar lainnya.
2. **Materi belajar otomatis** — rangkuman, glosarium, flashcard, quiz, mind map, dibuat dari isi dokumen tersebut.
3. **Ujian lisan simulasi** — mic browser merekam suara, diteruskan real-time ke Gemini Live API yang berperan sebagai penguji: menyapa, mengajukan pertanyaan bertahap dari pemahaman dasar ke analitis/kritis, lalu memberi ringkasan evaluasi (kekuatan & bagian yang masih lemah) di akhir sesi.
4. **Progres per bagian dokumen** — status kuasai/belajar/belum dihitung dari skor quiz & penguasaan flashcard, ditampilkan di halaman Beranda lengkap dengan countdown H- menuju hari-H.

## Struktur Repo

```
Front End/    Next.js (App Router) + TypeScript + Tailwind + shadcn/ui — sudah dibangun
Back End/     Dokumen rencana API (belum diimplementasikan)
Planning/     PRD, wireframe, keputusan teknis AI
```

## Status

- **Front End**: sudah dibangun (Next.js), saat ini masih memakai data dummy.
- **Back End**: belum dibangun. Rencana teknis (lihat [`Back End/README.md`](Back%20End/README.md)):
  - Python + FastAPI + uvicorn (REST API + relay suara via WebSocket)
  - SQLite (dokumen, hasil quiz/flashcard, sesi ujian lisan, catatan)
  - python-multipart, python-docx, PyMuPDF (upload & ekstraksi dokumen)
  - Gemini Live API (ujian lisan real-time) + Gemini untuk generate materi teks
  - API key disimpan di `.env`, tidak pernah dikirim ke sisi browser

## Menjalankan Front End

```bash
cd "Front End"
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Dokumen Perencanaan

- [`Planning/PRD.md`](Planning/PRD.md) — kebutuhan produk lengkap per fase pengerjaan
- [`Planning/WIREFRAMES.md`](Planning/WIREFRAMES.md) — rancangan tampilan
- [`Planning/AI/keputusan-teknik-ai.md`](Planning/AI/keputusan-teknik-ai.md) — keputusan teknis terkait AI
- [`Back End/API_CONTRACT.md`](Back%20End/API_CONTRACT.md), [`Back End/DATA_MODEL.md`](Back%20End/DATA_MODEL.md) — rancangan API & skema data

## Catatan

Saat ini dijalankan lokal di satu komputer, tanpa login/multi-user.
