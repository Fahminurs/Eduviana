"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudy, type ChapterSelection } from "@/components/providers";
import { chapters } from "@/lib/data";

/**
 * Pemilih BAB bersama untuk semua tab (Rangkuman, Glosarium, Mind Map,
 * Flashcard, Quiz). Opsi "Semua BAB" hanya muncul di tab yang meneruskan
 * `allowAll` (saat ini: Glosarium, Mind Map).
 */
export function ChapterSelect({ allowAll = false }: { allowAll?: boolean }) {
  const { chapterId, setChapterId, concreteChapter } = useStudy();
  const value = allowAll ? chapterId : concreteChapter;

  // Skeleton jujur: bentuk persis trigger asli tapi kosong/pudar, dipakai
  // sesaat sebelum client selesai mount — daripada trigger asli sempat
  // ter-render tanpa label (kosong menyesatkan) atau isi lompat mendadak.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        BAB
      </span>
      {mounted ? (
        <Select
          value={value}
          onValueChange={(v) => setChapterId(v as ChapterSelection)}
        >
          <SelectTrigger
            className="min-w-44 bg-card duration-200 animate-in fade-in"
            aria-label="Pilih BAB"
          >
            <SelectValue placeholder="Pilih BAB" />
          </SelectTrigger>
          <SelectContent position="popper">
            {allowAll && <SelectItem value="all">Semua BAB</SelectItem>}
            {chapters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div
          aria-hidden
          className="h-8 min-w-44 animate-pulse rounded-lg bg-card ring-1 ring-foreground/10"
        />
      )}
    </div>
  );
}
