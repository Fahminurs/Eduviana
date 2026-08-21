import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Pisahkan nama file jadi { base, ext } supaya ekstensi bisa tetap terlihat
 *  saat base name-nya dipotong (truncate) di UI. */
export function splitFileName(name: string) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { base: name, ext: "" };
  return { base: name.slice(0, dot), ext: name.slice(dot) };
}

/** Ringkas nama file jadi maksimal `maxWords` kata pertama + "..." + ekstensi,
 *  supaya nama panjang tetap ringkas tapi ekstensinya tetap kelihatan. */
export function shortenFileName(name: string, maxWords = 2) {
  const { base, ext } = splitFileName(name);
  const words = base.split(/[_\s-]+/).filter(Boolean);
  if (words.length <= maxWords) return { short: base, ext, truncated: false };
  return { short: words.slice(0, maxWords).join("_"), ext, truncated: true };
}
