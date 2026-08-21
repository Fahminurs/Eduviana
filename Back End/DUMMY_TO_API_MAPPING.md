# Dummy → API Mapping — Eduviana

Checklist swap data dummy (`Front End/src/lib/data.ts`) ke panggilan API FastAPI sungguhan (PRD section 10: FE dibangun dulu pakai dummy, BE menyusul). Centang tiap baris kalau sudah diganti.

| File FE | Import dummy dari `data.ts` | Endpoint pengganti | Catatan |
|---|---|---|---|
| `components/app-shell.tsx` | `documents` | `GET /api/documents` | daftar "History File" di sidebar |
| — | `INITIAL_ACTIVE_DOC` (`components/providers.tsx`) | `GET /api/documents/active` | dibaca sekali saat app mount |
| — | `setActiveDocId` (klik dokumen di sidebar) | `POST /api/documents/{id}/activate` | |
| `components/upload-fab.tsx` | progress disimulasikan `setInterval` | `POST /api/documents` | progress asli dari event upload/SSE, bukan timer acak |
| `app/rangkuman/page.tsx` | `summaries[chapterId]` | `GET /api/chapters/{chapter}/summary` | |
| — | textarea "Catatan Pribadi" (state lokal) | `GET`/`PUT /api/notes?scope=chapter` | belum persist sama sekali saat ini |
| `app/glosarium/page.tsx` | `glossary` | `GET /api/chapters/{chapter}/glossary` | |
| — | catatan per istilah | `GET`/`PUT /api/notes?scope=glossary_term` | |
| `app/mindmap/page.tsx`, `components/mindmap-canvas.tsx` | `mindmaps`, `allChaptersMindMap` | `GET /api/chapters/{chapter}/mindmap` | opsi "Semua BAB" berarti FE fetch 4x lalu gabung, atau backend sediakan endpoint gabungan — putuskan salah satu |
| `app/flashcard/page.tsx` | `flashcards` | `GET /api/chapters/{chapter}/flashcards` | |
| — | update kategori saat klik tahu/tidak tahu | `POST /api/flashcards/{id}/attempt` | |
| `app/quiz/page.tsx` | `quizQuestions` | `GET /api/chapters/{chapter}/quiz` | |
| — | submit jawaban | `POST /api/quiz/attempts` | |
| `app/ujian-lisan/page.tsx` | `oralSessions` (riwayat) | `GET /api/oral-sessions?chapter=...` | |
| — | `liveScript`, `liveEvaluation` (simulasi sesi live) | `WS /ws/oral-session` | perubahan paling besar — dari skrip statis ke audio real-time |
| `components/journal-sync-sheet.tsx` | `INDEXED_JOURNALS`, `NEW_JOURNAL_POOL` | `POST /api/journals/sync` + `GET /api/journals` | dipakai memperkaya Quiz & Ujian Lisan saja — lihat PRD 5.8 |
| `app/quiz/page.tsx`, `WS /ws/oral-session` | *(tidak eksplisit di FE — logic backend)* | generate Quiz & system instruction Ujian Lisan ikut baca `reference_journals` | context stuffing, bukan tampilan baru di FE — swap ini di sisi backend saja |
| `app/api/local-journal/route.ts` | *(bukan dummy, dan bukan bagian fitur Jurnal Referensi — beda hal)* | tetap utilitas dev di Next.js, baca BAB skripsi dari folder lokal | jangan tertukar dengan endpoint `/api/journals/*` di atas |

## Urutan disarankan

Ikuti urutan Fase di PRD (`Planning/PRD.md` section 10): Dokumen + Ujian Lisan dulu (Fase 1), baru Rangkuman/Glosarium/Mind Map (Fase 2), baru Flashcard/Quiz (Fase 3). Dalam tiap fase, ganti endpoint `GET` (baca) dulu sebelum endpoint yang menyimpan progres (`POST`/`PUT`), supaya tampilan bisa dicek jalan dulu dengan data asli sebelum interaksi tulis-nya disambungkan.
