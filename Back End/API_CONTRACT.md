# API Contract — Eduviana Backend

Kontrak endpoint REST + WebSocket antara Next.js (FE) dan FastAPI (BE). Shape response mengikuti persis interface TypeScript yang sudah ada di `Front End/src/lib/data.ts` — tujuannya supaya swap dummy→API (lihat `DUMMY_TO_API_MAPPING.md`) tidak perlu ubah struktur data di FE, cukup ganti sumbernya.

**Keputusan terbuka:** FastAPI/Pydantic default snake_case, FE (TS) pakai camelCase. Belum diputuskan apakah response di-alias ke camelCase di backend (`alias_generator`) atau FE yang menyesuaikan. Catat keputusan ini di sini begitu ditentukan.

## Dokumen (Fase 1)

### `POST /api/documents`
Upload dokumen skripsi baru (multipart/form-data, field `file`, `.docx`/`.pdf`).
- Response `202`: `{ id, name, status: "diproses" }`
- Memicu proses async: ekstraksi teks per BAB → generate materi (rangkuman/glosarium/flashcard/quiz/mindmap) → `status` jadi `"selesai"` atau `"gagal"`.

### `GET /api/documents`
List semua dokumen pernah diupload → `ThesisDocument[]` (id, name, uploadedAt, status, chapterCount).

### `GET /api/documents/active`
Dokumen yang sedang aktif (dipakai saat aplikasi dibuka ulang, sesuai PRD 5.1).

### `POST /api/documents/{id}/activate`
Set dokumen ini jadi aktif (hanya satu dokumen aktif dalam satu waktu).

### `POST /api/documents/{id}/reupload`
Upload revisi baru untuk dokumen yang sama — materi lama diganti hasil generate baru, riwayat progres (skor, flashcard mastery) **tidak dihapus** kecuali diminta eksplisit (PRD 5.1).

## Materi per BAB (Fase 2 & 3)

Semua endpoint di bawah pakai `?document_id=` (default: dokumen aktif) dan path `{chapter}` = `bab1`..`bab4`.

| Endpoint | Response shape (FE) |
|---|---|
| `GET /api/chapters/{chapter}/summary` | `ChapterSummary` (overview, keyPoints, blocks) |
| `GET /api/chapters/{chapter}/glossary` | `GlossaryTerm[]` |
| `GET /api/chapters/{chapter}/mindmap` | `MindMapNode` |
| `GET /api/chapters/{chapter}/flashcards` | `Flashcard[]` (+ kategori berjalan dari `flashcard_progress`) |
| `GET /api/chapters/{chapter}/quiz` | `QuizQuestion[]` (generate-nya ikut disisipi konteks Jurnal Referensi — lihat section di bawah) |
| `GET /api/chapters/{chapter}/progress` | `ChapterProgress` (status, quizScore, flashcardMastered/Total) |

### `POST /api/flashcards/{id}/attempt`
Body: `{ mode: "standar"|"belajar"|"uji", result: "tahu"|"tidak_tahu" }`
Response: kategori baru kartu (`unknown`/`learning`/`known`) — logic transisi kategori ada di backend, bukan FE.

### `POST /api/quiz/attempts`
Body: `{ questionId, selectedIndex }`
Response: `{ isCorrect, explanation, sourceRef, aiFlag? }` — dipakai layar hasil quiz.

## Catatan Pribadi

### `GET /api/notes?scope=chapter|glossary_term&scopeId=...`
### `PUT /api/notes`
Body: `{ scope, scopeId, content }` — upsert, dipakai `rangkuman/page.tsx` & `glosarium/page.tsx`.

## Ujian Lisan (Fase 1, fitur inti)

### `WS /ws/oral-session?document_id=...&chapter=...`
Relay audio real-time ke Gemini Live API (lihat `FILE_STORAGE_LAYOUT.md` untuk format audio).
- Client → Server: frame binary PCM 16-bit (dari `AudioWorklet`), atau JSON `{type:"end"}` untuk sudahi sesi.
- Server → Client: frame binary audio balasan Gemini, atau JSON `{type:"session_summary", rapor, strengths, weaknesses}` di akhir sesi.
- Saat sesi mulai, backend membaca ringkasan evaluasi sesi-sesi sebelumnya (BAB yang sama) dan menyisipkannya ke system instruction (lihat `Planning/AI/prompts/ujian-lisan-system-instruction.md`) supaya AI mengangkat lagi topik yang masih lemah — plus konteks Jurnal Referensi (lihat section di bawah) supaya AI bisa menanyakan perbandingan dengan penelitian terkait.

### `GET /api/oral-sessions?chapter=...`
Riwayat sesi → `OralSession[]` (dateLabel, durationLabel, rapor, strengths, weaknesses, transcriptPreview).

### `GET /api/oral-sessions/{id}/transcript`
Transkrip lengkap satu sesi (file `.txt`, lihat `FILE_STORAGE_LAYOUT.md`).

## Jurnal Referensi (PRD 5.8 — hanya dipakai Quiz & Ujian Lisan)

### `POST /api/journals/sync`
Body: `{ folderPath }`. Scan folder, ekstrak teks PDF yang belum pernah diindeks (incremental — file yang sudah ada di `reference_journals` di-skip), simpan hasil.
Response: `{ newly_indexed: JournalEntry[], failed: JournalEntry[] }` — `JournalEntry = { id, filename, ok, note? }`.

### `GET /api/journals`
Daftar semua jurnal terindeks → `JournalEntry[]` (dipakai render "Semua jurnal terindeks" di panel Jurnal Referensi).

**Cara pakai di generate Quiz & Ujian Lisan:** seluruh teks jurnal terindeks (`GET /api/journals` + isi teksnya) disisipkan langsung ke prompt (context stuffing, bukan retrieval per-query — lihat `Planning/AI/keputusan-teknik-ai.md`). Rangkuman/Glosarium/Mind Map/Flashcard **tidak** memanggil data ini sama sekali.

*(Catatan: `api/local-journal/route.ts` yang sudah ada sekarang adalah hal berbeda — utilitas dev untuk baca BAB skripsi dari folder lokal, tidak terkait fitur Jurnal Referensi ini.)*
