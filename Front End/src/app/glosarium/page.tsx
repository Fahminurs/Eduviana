"use client";

import * as React from "react";
import { PenLineIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { glossary, chapterLabel } from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";
import { useStudy } from "@/components/providers";

/* Kartu istilah bergaya "indeks kamus" — tab huruf di kiri + wobble halus,
   pengganti daftar polos supaya glosarium ikut terasa "digambar tangan"
   seperti Beranda/History/Flashcard, bukan cuma daftar admin. */
const TERM_CARD = "rounded-[14px_10px_16px_12px/10px_14px_12px_16px]";

/* Warna tab huruf — tiap huruf A-Z dapat hue sendiri (26 warna beda,
   disebar merata di roda warna) supaya konsisten per abjad, bukan cuma
   5 warna yang diulang. Saturasi & lightness tinggi biar "menyala" di
   latar gelap, TANPA box-shadow glow. Karakter di luar A-Z (angka dll.)
   di-modulo supaya tetap dapat warna yang masuk akal. */
function letterTabColor(letter: string) {
  const rawIndex = letter.toUpperCase().charCodeAt(0) - 65;
  const index = ((rawIndex % 26) + 26) % 26;
  const hue = Math.round((index / 26) * 360);
  return {
    bg: `hsla(${hue}, 70%, 55%, 0.3)`,
    border: `hsla(${hue}, 75%, 72%, 0.75)`,
    text: `hsl(${hue}, 85%, 83%)`,
  };
}

export default function GlosariumPage() {
  const { chapterId } = useStudy();
  const [query, setQuery] = React.useState("");
  const [notes, setNotes] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(
      glossary.filter((t) => t.note).map((t) => [t.id, t.note as string])
    )
  );
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  const filtered = glossary.filter((t) => {
    const matchChapter = chapterId === "all" || t.chapter === chapterId;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q);
    return matchChapter && matchQuery;
  });

  const startEdit = (id: string) => {
    setEditingId(id);
    setDraft(notes[id] ?? "");
  };

  const saveEdit = () => {
    if (!editingId) return;
    setNotes((n) => {
      const next = { ...n };
      if (draft.trim()) next[editingId] = draft.trim();
      else delete next[editingId];
      return next;
    });
    setEditingId(null);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Glosarium
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <ChapterSelect allowAll />
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="cari istilah..."
              className="w-48 bg-card pl-8 sm:w-56"
              aria-label="Cari istilah"
            />
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-card px-6 py-14 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            {query.trim() ? (
              <>
                Tidak ada istilah yang cocok dengan pencarian{" "}
                <span className="text-foreground">“{query}”</span>.
              </>
            ) : (
              <>
                Belum ada istilah untuk{" "}
                <span className="text-foreground">
                  {chapterId === "all" ? "glosarium ini" : chapterLabel(chapterId)}
                </span>
                .
              </>
            )}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {filtered.map((term) => {
            const note = notes[term.id];
            const isEditing = editingId === term.id;
            return (
              <li key={term.id}>
                <div
                  className={cn(
                    "flex overflow-hidden border-2 border-white/15 bg-card",
                    TERM_CARD
                  )}
                >
                  <span
                    className="flex w-9 shrink-0 items-center justify-center border-r-2 border-dashed font-heading text-base font-bold"
                    style={{
                      backgroundColor: letterTabColor(term.term.charAt(0)).bg,
                      borderColor: letterTabColor(term.term.charAt(0)).border,
                      color: letterTabColor(term.term.charAt(0)).text,
                    }}
                  >
                    {term.term.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-base font-semibold">
                        {term.term}
                      </h2>
                      <Badge variant="outline" className="text-muted-foreground">
                        {chapterLabel(term.chapter)}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/90">
                      {term.definition}
                    </p>

                    {/* Catatan pribadi per istilah */}
                    {isEditing ? (
                      <div className="mt-3">
                        <Textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="Catatan pribadi untuk istilah ini..."
                          className="min-h-16 bg-black/20"
                          autoFocus
                        />
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" onClick={saveEdit}>
                            Simpan
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            <XIcon data-icon="inline-start" />
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : note ? (
                      <button
                        type="button"
                        onClick={() => startEdit(term.id)}
                        className="mt-3 flex w-full gap-2 rounded-lg border-l-2 border-primary/60 bg-primary/8 p-3 text-left transition-colors hover:bg-primary/12"
                      >
                        <PenLineIcon className="mt-0.5 size-3.5 shrink-0 text-iris-soft" />
                        <span className="text-sm text-foreground/90">
                          <span className="mr-1 font-medium text-iris-soft">
                            Catatan:
                          </span>
                          {note}
                        </span>
                      </button>
                    ) : (
                      <Button
                        size="xs"
                        variant="ghost"
                        className="mt-2.5 text-muted-foreground"
                        onClick={() => startEdit(term.id)}
                      >
                        <PlusIcon data-icon="inline-start" />
                        Tambah catatan
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} istilah ditampilkan
        {chapterId !== "all" && <> dari {chapterLabel(chapterId)}</>}.
      </p>
    </div>
  );
}
