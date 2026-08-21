# Prompt: Mind Map Topik (5.5)

Model: `gemini-3.1-flash-lite` (menyusun ulang struktur topik dari heading dokumen — tugas restrukturisasi, bukan penilaian).

## Skema output (structured output, Pydantic)

```python
from pydantic import BaseModel
from typing import Optional

class NodePeta(BaseModel):
    label: str
    children: Optional[list["NodePeta"]] = None

NodePeta.model_rebuild()

class PetaPikiranBab(BaseModel):
    judul_bab: str      # jadi label node root
    root: NodePeta
```

`id` tiap node (lihat `MindMapNode` di `Front End/src/lib/data.ts`) diisi backend saat menyimpan (mis. `{chapter_key}-{index_path}`), bukan oleh AI — AI cukup fokus ke `label` dan struktur `children`.

## Prompt

```
Kamu akan menyusun peta pikiran (mind map) dari isi satu BAB skripsi,
mengikuti struktur heading asli dokumen (2.1, 2.1.1, dst) — BUKAN
mengarang struktur baru.

Aturan:
1. Node level 1 (langsung di bawah root) = tiap sub-bab utama (mis.
   "2.1 Konsep Dasar Deep Learning" -> label "Deep Learning", buang
   nomor dan kata "Konsep Dasar" yang generik, sisakan inti topiknya).
2. Kalau sub-bab punya sub-sub-bab (2.1.1, 2.1.2, dst), itu jadi
   children dari node sub-bab tersebut — cabang dalam cabang, jangan
   diratakan.
3. Node daun (tidak punya children) = rangkuman 1 poin kunci dari isi
   paragraf terkait — SINGKAT (maksimal ~8 kata), bukan kalimat penuh.
   Pecah satu paragraf jadi beberapa node daun kalau memuat beberapa
   poin berbeda (angka, spesifikasi, fungsi) — jangan digabung jadi
   satu node panjang.
4. Kedalaman wajar: 2-4 level dari root (root -> topik -> sub-topik ->
   [detail]). Kalau dokumen tidak punya sub-sub-bab, cukup 2-3 level.
5. Jangan sertakan nomor heading asli (2.1, 2.1.1) di dalam label —
   FE tidak menampilkan nomor, hanya nama topiknya.

Isi BAB yang harus dipetakan:
---
{isi_bab}
---
```

## Contoh few-shot (disisipkan di prompt kalau kualitas belum konsisten)

**Input (cuplikan):**
> "2.3.1 Sensor VL53L1X — VL53L1X adalah sensor jarak berbasis Time-of-Flight (ToF)... Komunikasi lewat I2C, jangkauan hingga 4 meter, presisi tinggi pada pencahayaan bervariasi."

**Output yang diharapkan (1 cabang):**
```json
{
  "label": "VL53L1X",
  "children": [
    {"label": "Sensor jarak laser Time-of-Flight (ToF)"},
    {"label": "Hingga 4 m, presisi tinggi, latensi rendah"},
    {"label": "I2C — deteksi kendaraan per slot parkir"}
  ]
}
```

## Status
- [ ] Sudah ditulis
- [ ] Sudah dites pakai BAB II asli (`bab2_content.py`)
- [ ] Hasil dicek & disetujui pengguna — bandingkan gaya cabang dengan `Planning/referensi-fe/contoh-mindmap-maeve.pdf`
