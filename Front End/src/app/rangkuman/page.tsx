"use client";

import * as React from "react";
import {
  CheckIcon,
  ImageIcon,
  KeyRoundIcon,
  NotebookPenIcon,
  PenLineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { summaries, type SummaryBlock } from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";
import { useStudy } from "@/components/providers";

function Callout({
  variant,
  text,
}: {
  variant: "penting" | "contoh";
  text: string;
}) {
  const isPenting = variant === "penting";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border-l-2 p-3.5",
        isPenting
          ? "border-primary bg-primary/8"
          : "border-emerald-400/70 bg-emerald-400/8"
      )}
    >
      {isPenting ? (
        <KeyRoundIcon className="mt-0.5 size-4 shrink-0 text-iris-soft" />
      ) : (
        <NotebookPenIcon className="mt-0.5 size-4 shrink-0 text-emerald-300" />
      )}
      <div className="text-sm leading-relaxed">
        <span
          className={cn(
            "mr-1.5 font-heading font-semibold",
            isPenting ? "text-iris-soft" : "text-emerald-300"
          )}
        >
          {isPenting ? "Penting" : "Contoh"}
        </span>
        {text}
      </div>
    </div>
  );
}

function Figure({ caption }: { caption: string }) {
  return (
    <figure className="overflow-hidden rounded-xl bg-black/25 ring-1 ring-white/8">
      <div className="flex h-44 flex-col items-center justify-center gap-2 text-muted-foreground sm:h-52">
        <ImageIcon className="size-8 opacity-60" />
        <span className="px-6 text-center text-xs">
          gambar dari dokumen asli disisipkan otomatis di sini
        </span>
      </div>
      <figcaption className="border-t border-white/6 px-4 py-2.5 text-center text-xs text-muted-foreground italic">
        {caption}
      </figcaption>
    </figure>
  );
}

function Block({ block }: { block: SummaryBlock }) {
  switch (block.kind) {
    case "h3":
      return (
        <h3 className="border-b border-white/8 pb-2 font-heading text-lg font-semibold tracking-tight">
          {block.text}
        </h3>
      );
    case "h4":
      return (
        <h4 className="font-heading text-base font-semibold">{block.text}</h4>
      );
    case "p":
      return (
        <p className="text-sm leading-7 text-foreground/90">{block.text}</p>
      );
    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-6 text-foreground/90"
            >
              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-iris-soft" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout variant={block.variant} text={block.text} />;
    case "figure":
      return <Figure caption={block.caption} />;
  }
}

export default function RangkumanPage() {
  const { concreteChapter } = useStudy();
  const summary = summaries[concreteChapter];

  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = React.useState(false);
  const note = notes[concreteChapter] ?? "";

  const saveNote = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Rangkuman
        </h1>
        <ChapterSelect />
      </header>

      {/* Gambaran Singkat */}
      <section className="rounded-xl bg-gradient-to-br from-blue-600/30 via-blue-500/15 to-blue-400/25 p-5 ring-1 ring-blue-400/20">
        <h2 className="mb-2 text-xs font-semibold tracking-widest text-blue-300 uppercase">
          Gambaran Singkat
        </h2>
        <p className="text-sm leading-7">{summary.overview}</p>
      </section>

      {/* Poin Penting */}
      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Poin Penting
        </h2>
        <ul className="space-y-2">
          {summary.keyPoints.map((point) => (
            <li key={point} className="flex gap-2.5 text-sm leading-6">
              <CheckIcon className="mt-1 size-3.5 shrink-0 text-iris-soft" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Isi lengkap */}
      <section className="mt-8 space-y-5">
        {summary.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </section>

      {/* Catatan pribadi */}
      <section className="mt-10 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          <PenLineIcon className="size-3.5" />
          Catatan Pribadi untuk BAB Ini
        </h2>
        <Textarea
          value={note}
          onChange={(e) =>
            setNotes((n) => ({ ...n, [concreteChapter]: e.target.value }))
          }
          placeholder="Tulis pengingat, kemungkinan pertanyaan dosen, atau hal yang masih membingungkan..."
          className="min-h-24 bg-black/20"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={saveNote} disabled={!note.trim()}>
            Simpan Catatan
          </Button>
          {savedFlash && (
            <span className="flex items-center gap-1 text-xs text-emerald-300">
              <CheckIcon className="size-3.5" /> Tersimpan
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
