# File Storage Layout — Eduviana Backend

Konvensi penyimpanan file non-database. Semua path relatif terhadap folder data backend (mis. `Back End/data/`) — **jangan** di-commit ke git (pastikan masuk `.gitignore`, dokumen skripsi & rekaman suara bersifat pribadi sesuai PRD section 12).

```
data/
  eduviana.sqlite3
  documents/
    {document_id}/
      original.docx | original.pdf        # file asli yang diupload
      images/
        {chapter_key}/
          gambar-2.1.png                   # nama file = normalisasi caption ("Gambar 2.1" -> gambar-2.1.png)
          ...
      generated/
        {chapter_key}/
          summary.json                     # ChapterSummary — termasuk blok "figure" yg caption-nya dicocokkan ke images/
          glossary.json                    # GlossaryTerm[]
          mindmap.json                     # MindMapNode
          flashcards.json                  # Flashcard[] (tanpa progress)
          quiz.json                        # QuizQuestion[]
      transcripts/
        {oral_session_id}.txt              # transkrip mentah lengkap satu sesi ujian lisan
  journals/
    source/
      {journal_id}.pdf                     # PDF jurnal referensi asli, disalin saat sync
    extracted/
      {journal_id}.txt                     # teks hasil ekstraksi — dibaca berulang untuk context stuffing ke Quiz & Ujian Lisan (PRD 5.8), bukan di-parse ulang dari PDF tiap generate
```

## Ekstraksi gambar & pencocokan caption (untuk fitur Rangkuman 5.3)

1. Saat upload, `PyMuPDF`/`python-docx` ekstrak semua gambar + cari teks caption terdekat (mis. "Gambar 2.1") di halaman/paragraf yang sama.
2. Gambar disimpan ke `images/{chapter_key}/` dengan nama file dari caption yang dinormalisasi.
3. Saat generate `summary.json`, prompt rangkuman (`Planning/AI/prompts/rangkuman.md`) menghasilkan blok `figure` dengan `caption` yang sama persis — FE mencocokkan `caption` blok ke file gambar lewat mapping yang disimpan bersamaan (tambahkan field `image_map: {caption: filename}` di `summary.json` saat generate, supaya FE tidak perlu tebak-tebak nama file dari teks caption).

## Format audio (Ujian Lisan)

FE menangkap suara mic via **Web Audio API `AudioWorklet`** (bukan `MediaRecorder`) supaya audio yang dikirim ke backend sudah **PCM 16-bit mentah** — format yang sama persis dibutuhkan Gemini Live API. Backend **tidak melakukan konversi/transcoding apa pun** (tidak perlu `pydub`/`ffmpeg`), tinggal terima & teruskan lewat WebSocket (lihat `API_CONTRACT.md`).

## Sync Jurnal Referensi (PRD 5.8)

`POST /api/journals/sync` memindai folder lokal yang dikonfigurasi pengguna, membandingkan nama file dengan yang sudah ada di `journals/source/` — hanya file **baru** yang disalin & diekstrak (incremental, bukan re-proses semua file tiap sync). Teks hasil ekstraksi di `journals/extracted/*.txt` inilah yang disisipkan penuh (context stuffing) ke prompt generate Quiz dan system instruction Ujian Lisan — lihat `Planning/AI/keputusan-teknik-ai.md`.

## Revisi dokumen (re-upload)

Saat dokumen di-reupload (PRD 5.1): folder `documents/{document_id}/generated/` & `images/` ditimpa hasil generate baru. `transcripts/` **tidak** ikut dihapus — riwayat sesi ujian lisan tetap tersimpan meski materi lain diregenerasi.

## Pembersihan

Kalau sebuah `document_id` dihapus total (bukan cuma diganti versi), hapus seluruh folder `documents/{document_id}/` sekaligus row terkait di semua tabel SQLite (`documents`, `chapters`, `flashcards`, `flashcard_progress`, `quiz_questions`, `quiz_attempts`, `oral_sessions`, `notes`) — belum ada endpoint untuk ini di `API_CONTRACT.md` karena PRD belum menyebutkan fitur hapus dokumen secara eksplisit; tambahkan kalau dibutuhkan.
