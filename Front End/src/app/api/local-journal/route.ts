import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";

/** Urutan bab yang dicari di dalam folder. */
const CHAPTER_IDS = ["bab1", "bab2", "bab3", "bab4"] as const;
type LocalChapterId = (typeof CHAPTER_IDS)[number];

/**
 * Cocok untuk nama file seperti "bab1.pdf", "Bab 1.pdf", "jurnal_bab-1.pdf",
 * "Jurnal Bab 2 Rangka Batang.pdf" — kata "jurnal" opsional, dan angka bab
 * boleh dipisah spasi/underscore/strip dari kata "bab".
 */
function matchesChapter(fileName: string, chapterId: LocalChapterId): boolean {
  const chapterNumber = chapterId.replace("bab", "");
  const pattern = new RegExp(
    `(^|[^a-z0-9])(jurnal[\\s_-]*)?bab[\\s_-]*${chapterNumber}(?!\\d)`,
    "i"
  );
  return pattern.test(fileName) && fileName.toLowerCase().endsWith(".pdf");
}

interface ChapterReadResult {
  chapterId: LocalChapterId;
  found: boolean;
  fileName?: string;
  charCount?: number;
  preview?: string;
  error?: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const folderPath = body?.folderPath;

  if (typeof folderPath !== "string" || !folderPath.trim()) {
    return NextResponse.json(
      { error: "Path folder wajib diisi." },
      { status: 400 }
    );
  }

  const resolvedFolder = path.resolve(folderPath.trim());

  let entries: string[];
  try {
    entries = await readdir(resolvedFolder);
  } catch {
    return NextResponse.json(
      { error: `Folder tidak ditemukan atau tidak bisa dibaca: ${resolvedFolder}` },
      { status: 400 }
    );
  }

  const results: ChapterReadResult[] = [];

  for (const chapterId of CHAPTER_IDS) {
    const fileName = entries.find((name) => matchesChapter(name, chapterId));

    if (!fileName) {
      results.push({ chapterId, found: false });
      continue;
    }

    const filePath = path.join(resolvedFolder, fileName);
    try {
      const buffer = await readFile(filePath);
      const parser = new PDFParse({ data: buffer });
      const { text } = await parser.getText();
      await parser.destroy();

      results.push({
        chapterId,
        found: true,
        fileName,
        charCount: text.length,
        preview: text.slice(0, 400).trim(),
      });
    } catch (err) {
      results.push({
        chapterId,
        found: true,
        fileName,
        error: err instanceof Error ? err.message : "Gagal membaca PDF.",
      });
    }
  }

  return NextResponse.json({ folder: resolvedFolder, results });
}
