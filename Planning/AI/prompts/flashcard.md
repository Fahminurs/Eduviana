# Prompt: Flashcard Tanya-Jawab (5.6)

Model: `gemini-3.1-flash-lite` (generate pasangan tanya-jawab dari fakta eksplisit dokumen — tidak butuh penilaian mendalam seperti Quiz).

## Skema output (structured output, Pydantic)

```python
from pydantic import BaseModel

class KartuFlashcard(BaseModel):
    pertanyaan: str
    jawaban: str

class FlashcardBab(BaseModel):
    kartu: list[KartuFlashcard]
```

`id` diisi backend saat menyimpan. `initialCategory`/kategori berjalan (lihat `Flashcard` & `flashcard_progress` di `DATA_MODEL.md`) **bukan** output AI — setiap kartu baru selalu mulai dari kategori "Belum dikenal" secara default, kategori berubah lewat interaksi pengguna di mode Belajar/Uji (PRD 5.6), bukan ditentukan saat generate.

## Prompt

```
Kamu akan membuat kartu flashcard (tanya-jawab) dari isi satu BAB
skripsi, untuk latihan mengingat fakta/konsep kunci sebelum sidang.

Aturan:
1. Satu kartu = satu fakta/konsep spesifik yang bisa dijawab singkat
   (bukan pertanyaan esai panjang). Contoh baik: "Berapa jangkauan
   maksimum sensor VL53L1X?" — bukan "Jelaskan semua sensor di BAB
   ini."
2. `pertanyaan` ditulis natural, seolah ditanyakan langsung (bukan
   format "Apa itu X?" berulang untuk semua kartu — variasikan bentuk
   pertanyaan: "Bagaimana cara kerja...", "Kenapa dipilih...", "Berapa
   ...", "Apa fungsi...").
3. `jawaban` singkat tapi lengkap (1-3 kalimat) — cukup untuk dijawab
   lisan dalam beberapa detik, tapi tidak menghilangkan detail penting
   (angka, nama komponen, alasan teknis).
4. Prioritaskan fakta yang: (a) sering jadi pertanyaan dosen penguji
   ("kenapa pilih X dibanding Y"), (b) angka/spesifikasi teknis
   konkret, (c) definisi istilah kunci BAB ini.
5. Buat sekitar 8-15 kartu per BAB tergantung kepadatan materi — jangan
   dipaksa jumlah tetap kalau isinya tipis.
6. Jangan bikin 2 kartu yang menanyakan fakta yang sama dengan kata
   berbeda.

Isi BAB yang harus dibuatkan flashcard-nya:
---
{isi_bab}
---
```

## Contoh few-shot (disisipkan di prompt kalau kualitas belum konsisten)

**Input (cuplikan):**
> "Motor servo mikro berbasis PWM: rentang sudut 0°–180°, torsi 1,8 kg·cm, dipakai sebagai penggerak palang pintu parkir (0° tertutup, 90° terbuka)."

**Output yang diharapkan (1 kartu):**
```json
{"pertanyaan": "Bagaimana motor servo SG-90 dikendalikan dan untuk apa fungsinya?", "jawaban": "Dikendalikan lewat sinyal PWM, rentang sudut 0°–180°; dipakai menggerakkan palang pintu parkir (0° tertutup, 90° terbuka)."}
```

## Status
- [ ] Sudah ditulis
- [ ] Sudah dites pakai BAB II asli (`bab2_content.py`)
- [ ] Hasil dicek & disetujui pengguna
