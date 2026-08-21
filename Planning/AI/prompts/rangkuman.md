# Prompt: Rangkuman per BAB (5.3)

Model: `gemini-3.1-flash-lite` (tugas ini "menata ulang", bukan "menilai/menimbang" — cukup model murah, tidak perlu upgrade).

## Skema output (structured output, Pydantic)

```python
from pydantic import BaseModel
from typing import Literal

class BlokIsi(BaseModel):
    tipe: Literal["paragraf", "sub_judul", "penting", "contoh"]
    teks: str

class RangkumanBab(BaseModel):
    judul_bab: str
    gambaran_singkat: str          # 1 paragraf pembuka
    poin_penting: list[str]        # bullet list
    isi: list[BlokIsi]             # urut sesuai struktur sub-bab asli
```

`isi` berupa daftar blok berurutan — FE me-render tiap blok sesuai `tipe`-nya (paragraf biasa, sub-judul, atau kotak callout 🔑/📝). Kalau sebuah paragraf menyebut caption gambar (misal "Gambar 2.1"), itu nanti dicocokkan otomatis ke gambar hasil ekstraksi dokumen (logic terpisah, di luar prompt ini).

## Prompt

```
Kamu akan menata ulang isi satu BAB skripsi menjadi materi belajar yang
rapi dan enak dibaca — BUKAN meringkas/mempersingkat drastis. Hampir
seluruh detail asli (termasuk data, angka, nama teknis, dan rujukan
"Gambar X.Y"/"Tabel X.Y" bila disebutkan) harus tetap ada, cuma ditata
ulang jadi lebih terstruktur.

Ikuti struktur berikut:
1. `gambaran_singkat`: 1 paragraf pembuka yang menjelaskan BAB ini
   membahas apa secara umum.
2. `poin_penting`: 3-6 poin paling penting dari keseluruhan BAB, ditulis
   singkat (1 kalimat per poin).
3. `isi`: pecah isi BAB mengikuti struktur sub-bab aslinya (jangan
   digabung/direorganisasi urutannya). Setiap blok punya salah satu tipe:
   - "sub_judul": judul sub-bab (misal "2.3 Sensor Pengukur Jarak")
   - "paragraf": isi paragraf biasa, tulis ulang secara jelas tapi
     JANGAN hilangkan detail/data/istilah teknis/rujukan gambar-tabel
   - "penting": tandai ini KHUSUS untuk kalimat kesimpulan/insight yang
     paling krusial dari sub-bab tersebut (biasanya 1 per sub-bab,
     jangan berlebihan menandai)
   - "contoh": tandai ini KHUSUS kalau ada contoh konkret/penerapan
     nyata yang disebutkan (bukan definisi umum)

Jangan menerjemahkan istilah teknis bahasa Inggris ke bahasa Indonesia
kalau istilah itu memang lazim dipakai apa adanya (misal "Time of
Flight", "bounding box").

Isi BAB yang harus ditata ulang:
---
{isi_bab}
---
```

## Contoh few-shot (disisipkan di prompt kalau kualitas belum konsisten)

**Input (cuplikan):**
> "VL53L1X adalah sensor jarak berbasis Time-of-Flight (ToF)... Sensor ini cocok untuk mendeteksi kendaraan pada slot parkir."

**Output yang diharapkan (1 blok):**
```json
{"tipe": "paragraf", "teks": "VL53L1X adalah sensor jarak berbasis Time-of-Flight (ToF) yang memancarkan laser inframerah dan mengukur waktu pantulannya untuk menentukan jarak. Teknologi: Time-of-Flight (ToF), Komunikasi: I2C, Jangkauan: hingga 4 meter."}
{"tipe": "penting", "teks": "Sensor ini cocok untuk mendeteksi kendaraan pada slot parkir karena presisi tinggi, latensi rendah, dan tetap akurat pada pencahayaan bervariasi."}
```

## Status
- [ ] Sudah ditulis
- [ ] Sudah dites pakai BAB II asli (`bab2_content.py`)
- [ ] Hasil dicek & disetujui pengguna
