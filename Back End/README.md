# Eduviana — Back End

Backend belum dibangun. Sesuai PRD (`D:\AI\Oram Exam Test Gemini\Planning\PRD.md`),
rencananya:

- **Python + FastAPI + uvicorn** (REST API + WebSocket relay suara)
- **SQLite** (documents, quiz_attempts, flashcard_attempts, oral_sessions, notes)
- **python-multipart, python-docx, PyMuPDF** (upload & ekstraksi dokumen)
- **Gemini Live API** (ujian lisan real-time) + **gemini-3.1-flash-lite** (generate materi teks)
- API key di `.env`, tidak pernah dikirim ke sisi browser

Frontend (Next.js, di `../Front End`) saat ini masih memakai data dummy —
setelah backend ini jalan, data dummy tinggal diganti panggilan API.
