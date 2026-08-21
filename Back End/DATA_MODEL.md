# Data Model — Eduviana Backend

Skema SQLite. Diturunkan langsung dari interface TypeScript di `Front End/src/lib/data.ts` supaya konsisten dengan apa yang sudah dirender FE. File JSON besar (blocks rangkuman, mindmap tree, dll) disimpan sebagai file biasa di disk (lihat `FILE_STORAGE_LAYOUT.md`), bukan di kolom SQLite — DB cukup simpan metadata + path/hasil kecil yang perlu di-query.

## `documents`
Sumber: `ThesisDocument`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | TEXT PK | |
| `original_filename` | TEXT | |
| `stored_path` | TEXT | lihat `FILE_STORAGE_LAYOUT.md` |
| `status` | TEXT | `diproses` \| `selesai` \| `gagal` |
| `chapter_count` | INTEGER NULL | |
| `uploaded_at` | DATETIME | pengganti `uploadedAgo`/`uploadedDate`/`uploadedTime` FE — FE format ulang dari timestamp asli |
| `is_active` | INTEGER (0/1) | hanya satu row boleh `1` — dipakai `GET /api/documents/active` |
| `replaces_document_id` | TEXT NULL FK→documents.id | terisi kalau ini hasil re-upload revisi dokumen lain |

## `chapters`
Metadata generate per BAB per dokumen (bukan isi materinya — itu di file JSON).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | TEXT PK | `{document_id}:{chapter_key}` |
| `document_id` | TEXT FK | |
| `chapter_key` | TEXT | `bab1`..`bab4` |
| `label` | TEXT | mis. "2. Dasar Teori" |
| `generation_status` | TEXT | `diproses` \| `selesai` \| `gagal` |
| `generated_at` | DATETIME NULL | |

## `flashcards`
Sumber: `Flashcard` (tanpa `initialCategory` — kategori berjalan ada di `flashcard_progress`).

| Kolom | Tipe |
|---|---|
| `id` | TEXT PK |
| `document_id` | TEXT FK |
| `chapter_key` | TEXT |
| `question` | TEXT |
| `answer` | TEXT |

## `flashcard_progress`
Riwayat jawaban per kartu — dasar logic "sering salah" & kategori (PRD 5.6).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `flashcard_id` | TEXT FK | |
| `mode` | TEXT | `standar` \| `belajar` \| `uji` |
| `category_after` | TEXT | `unknown` \| `learning` \| `known` — hasil setelah attempt ini |
| `answered_at` | DATETIME | |

Kategori kartu "saat ini" = `category_after` dari attempt terakhir kartu itu (query `ORDER BY answered_at DESC LIMIT 1`).

## `quiz_questions`
Sumber: `QuizQuestion`.

| Kolom | Tipe |
|---|---|
| `id` | TEXT PK |
| `document_id` | TEXT FK |
| `chapter_key` | TEXT |
| `question` | TEXT |
| `options_json` | TEXT (JSON array 4 string) |
| `answer_index` | INTEGER |
| `explanation` | TEXT |
| `source_ref` | TEXT |
| `document_excerpt` | TEXT |
| `ai_flag_wrong_text` | TEXT NULL | isi hanya kalau AI temukan dokumen pengguna keliru |
| `ai_flag_correct_text` | TEXT NULL | |
| `journal_ref` | TEXT NULL | isi hanya untuk soal perbandingan dengan Jurnal Referensi (PRD 5.8) — nama file jurnal + konteks singkat, lihat `Planning/AI/prompts/quiz.md` |

## `quiz_attempts`

| Kolom | Tipe |
|---|---|
| `id` | INTEGER PK AUTOINCREMENT |
| `quiz_question_id` | TEXT FK |
| `selected_index` | INTEGER |
| `is_correct` | INTEGER (0/1) |
| `answered_at` | DATETIME |

## `oral_sessions`
Sumber: `OralSession`. Transkrip lengkap **tidak** di sini (file `.txt`, lihat `FILE_STORAGE_LAYOUT.md`) — hanya path + ringkasan evaluasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `document_id` | TEXT FK | |
| `chapter_key` | TEXT | |
| `started_at` | DATETIME | |
| `duration_seconds` | INTEGER | |
| `transcript_path` | TEXT | |
| `rapor_line_1` | TEXT | progres — 2 baris rapor singkat (PRD 5.2) |
| `rapor_line_2` | TEXT | fokus berikutnya |
| `strengths_json` | TEXT (JSON array) | |
| `weaknesses_json` | TEXT (JSON array) | dibaca ulang sesi berikutnya untuk callback topik lemah |

## `notes`
Catatan pribadi per BAB (Rangkuman) atau per istilah (Glosarium) — PRD 5.3/5.4.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `document_id` | TEXT FK | |
| `scope_type` | TEXT | `chapter` \| `glossary_term` |
| `scope_id` | TEXT | `chapter_key` atau `id` istilah glosarium |
| `content` | TEXT | |
| `updated_at` | DATETIME | |

Unique constraint: `(document_id, scope_type, scope_id)` — satu catatan per scope (upsert, bukan banyak entri).

## `reference_journals`
Sumber: fitur Jurnal Referensi (PRD 5.8). **Tidak** terikat ke `document_id` — daftar jurnal ini global/lintas dokumen skripsi (satu pengguna, satu folder jurnal referensi).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | TEXT PK | |
| `filename` | TEXT | |
| `stored_path` | TEXT | PDF asli hasil sync |
| `extracted_text_path` | TEXT | teks hasil ekstraksi — dibaca ulang tiap generate Quiz/Ujian Lisan (context stuffing), bukan di-parse ulang dari PDF tiap kali |
| `status` | TEXT | `ok` \| `gagal` |
| `error_note` | TEXT NULL | mis. "Gagal dibaca" |
| `indexed_at` | DATETIME | |

Dibaca **hanya** oleh generate Quiz (`GET /api/chapters/{chapter}/quiz`) dan system instruction Ujian Lisan (`WS /ws/oral-session`) — tidak dijoin ke tabel lain.
