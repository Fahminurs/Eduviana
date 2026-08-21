# Prompt: Quiz Pilihan Ganda (5.7)

Model: pertimbangkan model yang lebih mumpuni dari `gemini-3.1-flash-lite` untuk fitur ini (belum diputuskan — lihat `Planning/AI/keputusan-teknik-ai.md` poin 2) karena ada tugas **verifikasi fakta** (bandingkan isi dokumen pengguna vs fakta yang benar), bukan sekadar menata ulang teks.

## Fitur khusus: deteksi kekeliruan dokumen (`ai_flag`)

Ini bagian paling berbeda dari fitur teks lain: AI **membandingkan klaim di dokumen skripsi pengguna dengan fakta yang sebenarnya benar** (dari pengetahuan umum AI, bukan dari dokumen). Kalau dokumen keliru (mis. salah ketik angka, salah sebut satuan, tertukar dua istilah), quiz tetap dibuat dari isi dokumen (`document_excerpt` mengikuti apa yang **tertulis di dokumen**, termasuk kalau keliru), tapi `ai_flag` diisi untuk menampilkan koreksi ke pengguna di layar hasil — **bukan** diam-diam membetulkan menjadi versi yang benar tanpa memberi tahu.

## Skema output (structured output, Pydantic)

```python
from pydantic import BaseModel
from typing import Optional

class KoreksiAI(BaseModel):
    teks_salah: str      # kutipan persis yang keliru di dokumen pengguna
    teks_benar: str       # koreksi + penjelasan singkat kenapa keliru

class SoalQuiz(BaseModel):
    pertanyaan: str
    opsi: list[str]                  # persis 4 opsi
    indeks_jawaban: int              # 0-3, index opsi yang benar
    penjelasan: str                  # kenapa jawaban itu benar (tampil di layar hasil)
    rujukan_sumber: str              # mis. "BAB 1.1 Latar Belakang Masalah"
    kutipan_dokumen: str             # kutipan/parafrase ASLI dari dokumen pengguna, termasuk kalau keliru
    koreksi_ai: Optional[KoreksiAI] = None   # isi HANYA kalau dokumen pengguna terbukti keliru dibanding fakta sebenarnya
    rujukan_jurnal: Optional[str] = None     # isi HANYA untuk soal yang menanyakan perbandingan dengan jurnal referensi (PRD 5.8) — nama file jurnal + 1 kalimat konteks temuannya. null untuk soal biasa (mayoritas)

class QuizBab(BaseModel):
    soal: list[SoalQuiz]
```

## Konteks Jurnal Referensi (opsional, PRD 5.8)

Kalau ada jurnal referensi terindeks (`reference_journals`), seluruh teksnya disisipkan sebagai `{konteks_jurnal_referensi}` di prompt (context stuffing, bukan retrieval — lihat `Planning/AI/keputusan-teknik-ai.md`). Dipakai untuk membuat SEBAGIAN KECIL soal yang menanyakan perbandingan dengan penelitian terkait — mayoritas soal tetap murni dari isi BAB skripsi sendiri, bukan didominasi soal jurnal.

## Prompt

```
Kamu akan membuat soal pilihan ganda dari isi satu BAB skripsi untuk
latihan sebelum sidang, SEKALIGUS memeriksa apakah ada klaim di
dokumen yang keliru dibanding fakta yang sebenarnya benar.

{konteks_jurnal_referensi ? "Beberapa jurnal referensi terkait tersedia (lihat di bawah). Buat 1-3 soal (dari total soal) yang menanyakan perbandingan isi skripsi dengan penelitian di jurnal ini — mayoritas soal lain tetap murni dari isi BAB, JANGAN sampai kebanyakan soal berbasis jurnal.\n\nJurnal referensi:\n---\n" + konteks_jurnal_referensi + "\n---" : ""}

Untuk tiap soal:
1. `pertanyaan` dan `opsi` (4 pilihan) dibuat dari isi dokumen —
   1 jawaban benar, 3 pengecoh yang masuk akal (bukan asal-asalan
   salah, tapi bisa jadi jebakan kalau materinya belum dikuasai).
2. `kutipan_dokumen`: kutip/parafrase persis apa yang TERTULIS di
   dokumen untuk topik ini — walaupun kamu tahu itu keliru secara
   fakta, tulis apa adanya di sini.
3. Bandingkan klaim di dokumen dengan pengetahuan faktual kamu:
   - Kalau dokumen BENAR: `koreksi_ai` dikosongkan (null).
   - Kalau dokumen KELIRU (angka salah, satuan salah, istilah
     tertukar, dll — bukan beda gaya penulisan): isi `koreksi_ai`
     dengan kutipan persis bagian yang salah (`teks_salah`) dan
     koreksinya (`teks_benar`), sopan tapi jelas ("ada salah satuan di
     dokumen kamu, bukan X, seharusnya Y").
4. Jangan mengarang-ada kekeliruan kalau sebenarnya dokumen sudah
   benar — proporsi soal ber-`koreksi_ai` seharusnya kecil (mayoritas
   dokumen pengguna sudah benar).
5. Buat sekitar 15-20 soal per BAB, jangan menanyakan hal yang sama
   berulang dengan kata berbeda.

Isi BAB yang harus dibuatkan soalnya:
---
{isi_bab}
---
```

## Contoh few-shot (disisipkan di prompt kalau kualitas belum konsisten)

**Input dokumen (cuplikan, keliru):**
> "Jumlah kendaraan bermotor mencapai sekitar 116 juta unit pada 2024."
(Fakta sebenarnya: ±166 juta unit — dua digit terakhir tertukar.)

**Output yang diharapkan:**
```json
{
  "pertanyaan": "Berapa perkiraan jumlah kendaraan bermotor di Indonesia (2024)?",
  "opsi": ["66 juta unit", "100 juta unit", "166 juta unit", "266 juta unit"],
  "indeks_jawaban": 2,
  "penjelasan": "Dokumen menyebut jumlah kendaraan bermotor di Indonesia mencapai sekitar 166 juta unit pada 2024.",
  "rujukan_sumber": "BAB 1.1 Latar Belakang Masalah — \"Peningkatan jumlah kendaraan\"",
  "kutipan_dokumen": "Jumlah kendaraan bermotor mencapai sekitar 116 juta unit pada 2024.",
  "koreksi_ai": {
    "teks_salah": "116 juta unit",
    "teks_benar": "166 juta unit — dua digit terakhir tertukar di dokumen kamu, angka resminya 166 juta bukan 116 juta"
  }
}
```

## Contoh few-shot — soal berbasis Jurnal Referensi (PRD 5.8)

**Isi dokumen skripsi (BAB 2.3, sudah ada di dummy data):**
> "VL53L1X adalah sensor jarak berbasis Time-of-Flight (ToF)... Sensor ToF unggul di akurasi & latensi rendah dibanding sensor ultrasonik/infrared konvensional."

**Cuplikan `{konteks_jurnal_referensi}` (dari `sensor-tof-parkir-2022.pdf`, salah satu jurnal terindeks):**
> "Studi ini mengkaji keterbatasan sensor ultrasonik (mis. HC-SR04) pada sistem parkir cerdas: rentan noise lingkungan dan pembacaan tidak akurat saat permukaan pantulan miring, sehingga direkomendasikan Time-of-Flight sebagai alternatif yang lebih presisi untuk deteksi slot jarak dekat."

**Output yang diharapkan (1 soal, dari total 15-20 soal BAB ini — sisanya tetap soal biasa tanpa `rujukan_jurnal`):**
```json
{
  "pertanyaan": "Menurut jurnal referensi terkait, apa kelemahan utama sensor ultrasonik yang jadi alasan penelitian ini memilih sensor ToF (VL53L1X) untuk monitoring slot parkir?",
  "opsi": [
    "Sensor ultrasonik terlalu mahal dibanding ToF",
    "Sensor ultrasonik rentan noise lingkungan dan tidak akurat pada permukaan pantulan miring",
    "Sensor ultrasonik tidak kompatibel dengan mikrokontroler ESP32",
    "Sensor ultrasonik membutuhkan daya listrik jauh lebih besar"
  ],
  "indeks_jawaban": 1,
  "penjelasan": "Baik dokumen skripsi maupun jurnal referensi sama-sama menunjukkan sensor ToF (VL53L1X) unggul di akurasi & latensi dibanding ultrasonik — jurnal menambahkan detail spesifik: ultrasonik rentan noise dan pantulan permukaan miring, sesuai konteks kenapa VL53L1X dipilih untuk slot parkir jarak dekat.",
  "rujukan_sumber": "BAB 2.3 Sensor Pengukur Jarak — perbandingan VL53L1X vs sensor ultrasonik",
  "kutipan_dokumen": "Sensor ToF unggul di akurasi & latensi rendah dibanding sensor ultrasonik/infrared konvensional.",
  "koreksi_ai": null,
  "rujukan_jurnal": "sensor-tof-parkir-2022.pdf — kajian keterbatasan sensor ultrasonik pada sistem parkir akibat noise & pantulan permukaan miring, merekomendasikan ToF sebagai alternatif"
}
```

Catatan: soal jenis ini **tidak** menggantikan `koreksi_ai` — keduanya independen. Kalau kebetulan dokumen pengguna juga keliru secara faktual PADA topik yang sama, `koreksi_ai` tetap bisa diisi berdampingan dengan `rujukan_jurnal` (dua isu berbeda: benar/salah vs pembanding literatur).

## Status
- [ ] Sudah ditulis
- [ ] Keputusan model final diambil (lihat catatan di atas)
- [ ] Sudah dites pakai BAB II asli (`bab2_content.py`) — termasuk kasus dokumen yang sengaja dibuat keliru untuk tes `koreksi_ai`
- [ ] Hasil dicek & disetujui pengguna
