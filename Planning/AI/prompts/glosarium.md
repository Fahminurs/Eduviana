# Prompt: Glosarium Istilah (5.4)

Model: `gemini-3.1-flash-lite` (ekstraksi istilah + definisi singkat — tugas sederhana, tidak butuh "pertimbangan" mendalam).

## Skema output (structured output, Pydantic)

```python
from pydantic import BaseModel

class IstilahGlosarium(BaseModel):
    istilah: str        # nama istilah/singkatan, mis. "VL53L1X" atau "Time of Flight (ToF)"
    definisi: str        # definisi singkat, 1-2 kalimat

class GlosariumBab(BaseModel):
    istilah: list[IstilahGlosarium]
```

`id` dan `chapter` (lihat `GlossaryTerm` di `Front End/src/lib/data.ts`) diisi backend saat menyimpan hasil, bukan oleh AI. Kolom `note` (catatan pribadi pengguna) juga bukan output AI — itu diisi manual lewat fitur catatan.

## Prompt

```
Kamu akan mengekstrak istilah teknis dari satu BAB skripsi menjadi
daftar glosarium. Untuk tiap istilah:

1. Pilih istilah yang benar-benar teknis/spesifik ke bidang penelitian
   ini (nama komponen, singkatan, algoritma, metrik, konsep khusus) —
   JANGAN masukkan kata umum yang sudah dipahami semua orang.
2. `definisi`: tulis definisi singkat (1-2 kalimat) berdasarkan
   penjelasan di dalam dokumen ini — bukan definisi generik dari luar
   dokumen kalau dokumen sudah menjelaskannya dengan caranya sendiri.
3. Kalau ada singkatan (mis. "ToF"), tulis istilah lengkap dengan
   singkatannya dalam kurung: "Time of Flight (ToF)".
4. Jangan duplikat istilah yang maknanya sama walau penyebutannya
   berbeda di beberapa tempat dalam BAB yang sama.
5. Urutkan berdasarkan kemunculan pertama dalam dokumen (bukan
   alfabetis) — supaya urutan glosarium mengikuti alur baca BAB.

Isi BAB yang harus diekstrak istilahnya:
---
{isi_bab}
---
```

## Contoh few-shot (disisipkan di prompt kalau kualitas belum konsisten)

**Input (cuplikan):**
> "Multiplekser I2C 8-kanal yang mengatasi masalah beberapa perangkat I2C beralamat sama: kanal yang diinginkan diaktifkan lewat perintah, dipakai mengelola beberapa sensor VL53L1X dan LCD pada satu bus yang sama."

**Output yang diharapkan:**
```json
{"istilah": "TCA9548A", "definisi": "Multiplekser I2C 8-kanal yang memungkinkan beberapa perangkat I2C beralamat sama berkomunikasi secara selektif melalui satu bus, dengan mengaktifkan kanal yang dituju lewat perintah."}
```

## Status
- [ ] Sudah ditulis
- [ ] Sudah dites pakai BAB II asli (`bab2_content.py`)
- [ ] Hasil dicek & disetujui pengguna
