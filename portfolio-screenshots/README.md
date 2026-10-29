# Eduviana — screenshot portfolio

Real captures of the running Eduviana frontend (Next.js, dark mode, Playwright + headless Chromium).
Desktop 1440×900, mobile 390×844.

Note: the backend (FastAPI/PostgreSQL) is not implemented on `master` yet. The frontend ships with built-in dummy data
(thesis theme "Sistem Parkir Cerdas", no personal data), so everything shown is the app's own UI and content.
The browser clock was pinned to 10 Jul 2026 so the hari-H countdown (4 Aug 2026) shows a live value.

| File | Shows |
|---|---|
| `01-beranda-1440.png` | Beranda: countdown to hari-H (H-25) and live timer |
| `02-mindmap-1440.png` | Mind Map: expandable topic tree, search, zoom controls |
| `03-quiz-1440.png` | Quiz: multiple choice, question stepper, option selected (question order is shuffled per load) |
| `04-flashcard-1440.png` | Flashcard: card flipped, Belajar mode, mastery counters |
| `05-glosarium-1440.png` | Glosarium: searchable terms with definitions and notes (Bab 2) |
| `06-rangkuman-1440.png` | Rangkuman: overview, key points, sections, callouts |
| `07-ujian-lisan-1440.png` | Ujian Lisan: ready state (Mulai Sesi, duration) plus previous session evaluation. No live Gemini session |
| `08-upload-dokumen-1440.png` | Upload Dokumen modal (.docx / .pdf) |
| `11-quiz-hasil-pembahasan-1440.png` | Quiz results: score, explanations, quote from the document, AI verification (all 10 answered with the first option, hence the low score) |
| `09-beranda-390.png` | Mobile: Beranda |
| `10-flashcard-390.png` | Mobile: Flashcard |
