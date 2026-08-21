# Keputusan Teknik AI — Eduviana

## Teknik yang dipakai: Prompt Engineering (+ Few-shot bila perlu), Structured Output

**Bukan** fine-tuning, **bukan** LangChain/LlamaIndex/framework orkestrasi lain.

### Tingkatan teknik customize AI (rendah → tinggi), posisi Eduviana ditandai ✅

```
                              ┌───────────────────────────────┐
                              │         FINE-TUNING            │  ▲ paling tinggi
                              │  Latih ulang model pakai         │  kompleksitas,
                              │  ratusan/ribuan contoh data       │  biaya, waktu
                              │  💰 Berbayar   🕐 Lambat (jam)    │  makin naik
                              └───────────────────────────────┘
                    ┌─────────────────────────────────────────────────┐
                    │            FEW-SHOT PROMPTING                     │
                    │   1-2 contoh langsung di dalam prompt              │
                    │   💰 Gratis   🕐 Instan                            │
                    └─────────────────────────────────────────────────┘
          ┌───────────────────────────────────────────────────────────────────┐
          │              PROMPT ENGINEERING (ZERO-SHOT)              ✅ EDUVIANA │  ▼ paling rendah
          │   Instruksi jelas, tanpa contoh, tanpa training                     │
          │   💰 Gratis   🕐 Instan                                             │
          └───────────────────────────────────────────────────────────────────┘
```

### Kenapa bukan fine-tuning
- Butuh ratusan-ribuan contoh data training + proses training (menit-jam) + biaya nyata — gak sepadan buat skala pemakaian Eduviana (~30 request/dokumen).
- Kita **masih sering ubah pikiran** soal format tiap fitur (contoh: format Rangkuman sudah berubah beberapa kali selama perencanaan) — fine-tuning bikin tiap perubahan kecil harus training ulang. Prompt tinggal edit teks, langsung jalan.
- Tugas kita (rangkuman, quiz, flashcard, mindmap, persona penguji) adalah tugas yang **sudah dikuasai model modern dari sononya** — gak butuh dilatih ulang.
- Dugaan kami: aplikasi sejenis (Maeve) kemungkinan besar juga cuma pakai prompt engineering + structured output untuk tugas yang sama, bukan fine-tuning (lihat alasan di bawah).

### Kenapa bukan LangChain/framework orkestrasi
- Semua fitur teks Eduviana polanya **1 prompt → 1 jawaban terstruktur**, bukan rangkaian panggilan bertahap.
- Isi 1 BAB skripsi jauh di bawah kapasitas konteks Gemini — gak perlu RAG (retrieval dari korpus besar).
- Latihan Sidang Lisan pakai Gemini Live API langsung (fitur real-time khusus) — kurang didukung baik oleh LangChain, lebih aman pakai SDK `google-genai` langsung (sudah terbukti jalan di `live_practice.py`).
- Sudah komit ke Gemini saja (bukan mau gonta-ganti provider AI), jadi lapisan abstraksi multi-provider LangChain gak ada gunanya.

### Yang justru dipakai: Structured Output (`response_schema`)
Fitur bawaan SDK `google-genai` (bukan library tambahan) — memaksa Gemini balas dalam bentuk JSON sesuai skema Pydantic yang kita definisikan, supaya hasil quiz/flashcard/mindmap langsung bisa dipakai kode tanpa parsing teks bebas.

## Pengecualian scope: Jurnal Referensi (HANYA Quiz & Ujian Lisan)

Fitur "Jurnal Referensi" (index PDF jurnal eksternal dari folder lokal, `journal-sync-sheet.tsx` — lihat PRD 5.8) **diputuskan masuk scope AI**, tapi dibatasi ketat: **cuma dipakai memperkaya Quiz (5.7) dan Ujian Lisan (5.2)**. Rangkuman, Glosarium, Mind Map, Flashcard tetap murni dari isi dokumen skripsi pengguna sendiri — tidak disentuh jurnal referensi sama sekali, supaya representasinya tetap akurat ke skripsi asli.

Ini **bukan** pembatalan keputusan "tidak perlu RAG" di atas. Pendekatannya tetap **context stuffing** (seluruh teks jurnal terindeks disisipkan langsung ke prompt), **bukan** retrieval berbasis vector embedding/similarity search:
- Jumlah jurnal yang realistis diindeks kecil (contoh dummy: 5-8 PDF) — total teksnya jauh di bawah kapasitas konteks Gemini, jadi tidak perlu memilih-milih jurnal mana yang relevan lewat retrieval, cukup masukkan semua teks jurnal terindeks ke prompt Quiz/Ujian Lisan.
- Kalau nanti jumlah jurnal membengkak sampai tidak muat konteks, baru pertimbangkan retrieval sungguhan — bukan didesain dari awal untuk skenario itu.
- Ekstraksi teks jurnal PDF pakai mekanisme yang sama seperti ekstraksi dokumen skripsi (`PyMuPDF`), disimpan sebagai cache teks supaya tidak parse ulang PDF tiap kali generate (lihat `Back End/DATA_MODEL.md` tabel `reference_journals` dan `Back End/FILE_STORAGE_LAYOUT.md`).

## Strategi dapat hasil terbaik (tanpa nambah tools)

1. **Prompt detail + few-shot** — bukan instruksi singkat, tapi lengkap dengan 1 contoh hasil yang diinginkan langsung di dalam prompt.
2. **Pilih model per fitur sesuai kebutuhan "pertimbangan"** — biaya nyaris gak berasa di skala ini, jadi boleh pakai model lebih mumpuni buat tugas yang butuh penilaian lebih dalam (misal quiz yang benar-benar menguji pemahaman, rapor evaluasi sidang lisan), bukan pukul rata `gemini-3.1-flash-lite` semua. *(Pembagian model per fitur — belum diputuskan, menyusul.)*
3. **Tes pakai isi BAB II skripsi asli** sebelum prompt dianggap final — bukan langsung dipakai tanpa dicoba.

## Proses pengerjaan prompt

Dikerjakan **satu fitur per satu waktu** (bukan sekaligus semua), disimpan di `Planning/AI/prompts/` — satu file per fitur, ditulis & diuji coba dulu pakai konten skripsi asli sebelum lanjut ke fitur berikutnya.
