"use client";

import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PartyPopperIcon,
  ShuffleIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  flashcards,
  type CardCategory,
  type FlashcardMode,
} from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";
import { useStudy } from "@/components/providers";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CATEGORY_META: Record<
  CardCategory,
  { label: string; dot: string; text: string; border: string }
> = {
  unknown: {
    label: "Belum dikenal",
    dot: "bg-red-400",
    text: "text-red-300",
    border: "border-red-400/50",
  },
  learning: {
    label: "Sedang dipelajari",
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-400/50",
  },
  known: {
    label: "Dikuasai",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-400/50",
  },
};

/** Naik/turun satu tingkat kategori berdasarkan jawaban. */
function nextCategory(current: CardCategory, knew: boolean): CardCategory {
  if (knew) {
    if (current === "unknown") return "learning";
    return "known";
  }
  if (current === "known") return "learning";
  return "unknown";
}

/* Radius "goyang" khas sketsa: tiap sudut beda, seolah digambar tangan
   — konsisten dengan bahasa visual modal upload (upload-fab.tsx). */
const WOBBLY_CARD = "rounded-[28px_36px_30px_38px/36px_28px_38px_30px]";
const WOBBLY_CARD_ALT = "rounded-[34px_26px_36px_30px/26px_34px_28px_36px]";
const WOBBLY_TILE = "rounded-[14px_18px_12px_20px/18px_12px_20px_14px]";
const WOBBLY_BTN = "rounded-[14px_10px_16px_12px/10px_16px_12px_14px]";
const WOBBLY_CHIP = "rounded-[999px_996px_998px_997px/997px_999px_996px_998px]";

/* Selotip washi semi-transparan bergaris */
const TAPE_BG =
  "[background:repeating-linear-gradient(-45deg,rgba(186,167,255,0.32)_0_5px,rgba(186,167,255,0.18)_5px_10px)]";

/* Isian arsir ungu — goresan diagonal ala spidol */
const HATCH_TILE =
  "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.45)_0_2px,transparent_2px_5px)_#2b273e]";
const HATCH_CTA_IRIS = "[background:linear-gradient(to_bottom_right,#7d66db,#5c48bd)]";
const HATCH_CTA_EMERALD =
  "[background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.2)_0_2px,transparent_2px_6px),linear-gradient(to_bottom_right,#34d399,#0d9488)]";
const HATCH_CTA_RED =
  "[background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_6px),linear-gradient(to_bottom_right,#3a2426,#2a1c1e)]";

/** Coretan bawah judul — "digambar" saat halaman terbuka */
function TitleSquiggle() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 150 8"
      fill="none"
      className="mt-1 block h-2 w-36 text-primary"
    >
      <path
        d="M2 5c13-4 25 4 37 1s24-5 36-1 24 4 36 1 22-4 37-1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100}
        className="animate-[sketch-draw_700ms_ease-out_150ms_forwards]"
      />
    </svg>
  );
}

/** Kilau doodle kecil (garis silang ala bintang sketsa) */
function DoodleSparkle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cn("pointer-events-none", className)}
    >
      <path d="M12 4v5M12 15v5M4 12h5M15 12h5" />
    </svg>
  );
}

export default function FlashcardPage() {
  const { concreteChapter } = useStudy();
  const [mode, setMode] = React.useState<FlashcardMode>("belajar");

  const chapterCards = React.useMemo(
    () => flashcards.filter((c) => c.chapter === concreteChapter),
    [concreteChapter]
  );

  const [categories, setCategories] = React.useState<
    Record<string, CardCategory>
  >(() =>
    Object.fromEntries(flashcards.map((c) => [c.id, c.initialCategory]))
  );
  const [deck, setDeck] = React.useState<string[]>(() =>
    chapterCards.map((c) => c.id)
  );
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);

  const rebuildDeck = React.useCallback(
    (randomize: boolean) => {
      // Mode Belajar: kartu "Belum dikenal" diprioritaskan lebih dulu.
      // Mode Uji: hanya kartu Belum dikenal / Sedang dipelajari.
      const order: CardCategory[] = ["unknown", "learning", "known"];
      let cards = [...chapterCards];
      if (mode === "uji") {
        cards = cards.filter((c) => categories[c.id] !== "known");
      }
      let ids = cards.map((c) => c.id);
      if (randomize) ids = shuffle(ids);
      if (mode !== "standar") {
        ids = ids.sort(
          (a, b) =>
            order.indexOf(categories[a] ?? "unknown") -
            order.indexOf(categories[b] ?? "unknown")
        );
      }
      setDeck(ids);
      setIndex(0);
      setFlipped(false);
    },
    // categories sengaja tidak jadi dependency: deck tidak diacak ulang tiap jawaban
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapterCards, mode]
  );

  // Urutan kartu diacak tiap sesi (saat BAB/mode berganti)
  React.useEffect(() => {
    rebuildDeck(true);
  }, [rebuildDeck]);

  const currentId = deck[index];
  const currentCard = chapterCards.find((c) => c.id === currentId);
  const tracked = mode !== "standar";

  const counts = React.useMemo(() => {
    const c = { unknown: 0, learning: 0, known: 0 };
    for (const card of chapterCards) c[categories[card.id] ?? "unknown"]++;
    return c;
  }, [chapterCards, categories]);

  const goto = React.useCallback(
    (dir: 1 | -1) => {
      if (deck.length === 0) return;
      setIndex((i) => (i + dir + deck.length) % deck.length);
      setFlipped(false);
    },
    [deck.length]
  );

  const answer = React.useCallback(
    (knew: boolean) => {
      if (!currentId) return;
      setCategories((prev) => ({
        ...prev,
        [currentId]: nextCategory(prev[currentId] ?? "unknown", knew),
      }));
      goto(1);
    },
    [currentId, goto]
  );

  // Keyboard: Spasi = buka/tutup, ←/→ = navigasi, ↑ = tahu, ↓ = tidak tahu
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        goto(1);
      } else if (e.key === "ArrowLeft") {
        goto(-1);
      } else if (tracked && e.key === "ArrowUp") {
        e.preventDefault();
        answer(true);
      } else if (tracked && e.key === "ArrowDown") {
        e.preventDefault();
        answer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goto, answer, tracked]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-hand text-3xl leading-none font-bold tracking-tight">
            Flashcard
          </h1>
          <TitleSquiggle />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ChapterSelect />
          <div className="flex items-center gap-2">
            <span className="font-hand text-sm font-medium tracking-wide text-muted-foreground">
              Mode
            </span>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as FlashcardMode)}
            >
              <SelectTrigger
                className="min-w-28 bg-card"
                aria-label="Mode belajar"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="standar">Standar</SelectItem>
                <SelectItem value="belajar">Belajar</SelectItem>
                <SelectItem value="uji">Uji</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Badge kategori — chip sketsa dengan garis putus-putus, hanya mode Belajar/Uji */}
      {tracked && (
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat, i) => (
            <span
              key={cat}
              style={{ rotate: i % 2 === 0 ? "-0.6deg" : "0.6deg" }}
              className={cn(
                "flex items-center gap-1.5 border-2 border-dashed bg-white/2 px-3 py-1 text-sm",
                WOBBLY_CHIP,
                CATEGORY_META[cat].border
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  CATEGORY_META[cat].dot
                )}
              />
              <span className="font-hand font-bold tabular-nums">
                {counts[cat]}
              </span>
              <span className="text-muted-foreground">
                {CATEGORY_META[cat].label}
              </span>
            </span>
          ))}
        </div>
      )}

      {!currentCard ? (
        <div
          className={cn(
            "relative flex min-h-52 flex-col items-center justify-center gap-2.5 rotate-[0.4deg] border-2 border-dashed border-emerald-300/40 bg-emerald-400/8 px-6 py-14 text-center",
            WOBBLY_CARD_ALT
          )}
        >
          <DoodleSparkle className="absolute top-4 left-6 size-4 text-emerald-300/50" />
          <DoodleSparkle className="absolute right-6 bottom-5 size-3.5 text-emerald-300/40" />
          <span
            className={cn(
              "flex size-12 -rotate-3 items-center justify-center border-2 border-emerald-300/60 bg-emerald-400/15 text-emerald-300",
              WOBBLY_TILE
            )}
          >
            <PartyPopperIcon className="size-6" />
          </span>
          <p className="font-hand text-lg font-bold text-emerald-200">
            Semua kartu BAB ini sudah dikuasai!
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Ganti ke mode Standar / Belajar untuk mengulang dari awal.
          </p>
        </div>
      ) : (
        <>
          {/* Kartu flip — bergaya sketsa: bayangan diarsir bergeser, border tebal, sudut goyang */}
          <div className="group relative perspective-distant">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className={cn(
                "relative block h-64 w-full -rotate-[0.5deg] transform-3d cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-72",
                flipped && "rotate-y-180"
              )}
              aria-label={flipped ? "Tutup jawaban" : "Buka jawaban"}
            >
              {/* Sisi depan: pertanyaan */}
              <span
                className={cn(
                  "absolute inset-0 backface-hidden",
                  WOBBLY_CARD
                )}
              >
                {/* Bayangan offset diarsir, seperti pada modal upload */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 border border-primary/60",
                    WOBBLY_CARD,
                    HATCH_TILE
                  )}
                />
                <span
                  className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border-2 border-white/20 bg-[#1f1f24] px-6 sm:px-12",
                    WOBBLY_CARD
                  )}
                >
                  <DoodleSparkle className="pointer-events-none absolute top-5 right-6 size-5 text-iris-soft/50" />
                  <DoodleSparkle className="pointer-events-none absolute bottom-6 left-7 size-3.5 text-iris-soft/30" />
                  {/* Selotip washi menempel di tepi atas kartu */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -top-3 left-10 h-6 w-20 rotate-[-4deg] rounded-xs ring-1 ring-white/10",
                      TAPE_BG
                    )}
                  />
                  {tracked && currentId && (
                    <span
                      className={cn(
                        "absolute top-4 left-4 flex items-center gap-1.5 rotate-[-1.5deg] border-2 border-dashed bg-black/20 px-2.5 py-1 text-xs",
                        WOBBLY_CHIP,
                        CATEGORY_META[categories[currentId] ?? "unknown"]
                          .border,
                        CATEGORY_META[categories[currentId] ?? "unknown"]
                          .text
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          CATEGORY_META[categories[currentId] ?? "unknown"]
                            .dot
                        )}
                      />
                      {CATEGORY_META[categories[currentId] ?? "unknown"].label}
                    </span>
                  )}
                  <span className="relative text-center font-heading text-lg leading-relaxed font-semibold text-balance sm:text-xl">
                    {currentCard.question}
                  </span>
                  <span className="relative flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-block size-1 rounded-full bg-iris-soft/60" />
                    klik / tekan Spasi untuk buka jawaban
                  </span>
                </span>
              </span>

              {/* Sisi belakang: jawaban */}
              <span
                className={cn(
                  "absolute inset-0 rotate-y-180 backface-hidden",
                  WOBBLY_CARD_ALT
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 border border-white/25",
                    WOBBLY_CARD_ALT,
                    "[background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.14)_0_2px,transparent_2px_6px)_#2b273e]"
                  )}
                />
                <span
                  className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden border-2 border-iris-soft/50 px-6 text-primary-foreground sm:px-12",
                    WOBBLY_CARD_ALT,
                    HATCH_CTA_IRIS
                  )}
                >
                  <DoodleSparkle className="pointer-events-none absolute top-5 left-6 size-4 text-white/50" />
                  <DoodleSparkle className="pointer-events-none absolute right-7 bottom-6 size-3.5 text-white/40" />
                  <span
                    className={cn(
                      "relative flex items-center gap-1.5 rotate-[-1deg] border-2 border-white/40 bg-black/10 px-3 py-1 font-hand text-sm font-bold tracking-wide",
                      WOBBLY_CHIP
                    )}
                  >
                    <CheckIcon className="size-3.5" />
                    Jawaban
                  </span>
                  <span className="relative text-center text-sm leading-relaxed text-white/95 sm:text-base">
                    {currentCard.answer}
                  </span>
                </span>
              </span>
            </button>
          </div>

          {/* Tombol Tahu / Tidak tahu — hand-drawn CTA, bayangan offset keras */}
          {tracked && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => answer(false)}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 border-2 border-red-400/40 font-hand text-base font-bold text-red-300 shadow-[3px_3px_0_rgba(248,113,113,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_rgba(248,113,113,0.3)] active:translate-y-0.5 active:shadow-none",
                  WOBBLY_BTN,
                  HATCH_CTA_RED
                )}
              >
                <XIcon className="size-4" />
                Saya tidak tahu
              </button>
              <button
                type="button"
                onClick={() => answer(true)}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 border-2 border-emerald-200/40 font-hand text-base font-bold text-emerald-950 shadow-[3px_3px_0_rgba(52,211,153,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_rgba(52,211,153,0.35)] active:translate-y-0.5 active:shadow-none",
                  WOBBLY_BTN,
                  HATCH_CTA_EMERALD
                )}
              >
                <CheckIcon className="size-4" />
                Saya tahu
              </button>
            </div>
          )}

          {/* Navigasi */}
          <div className="mt-7 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-iris/15 hover:text-iris-soft"
              aria-label="Kartu sebelumnya"
              onClick={() => goto(-1)}
            >
              <ArrowLeftIcon />
            </Button>
            <span
              className={cn(
                "mx-1 flex items-center gap-2 border-2 border-white/15 bg-card px-4 py-1.5 font-hand text-base",
                WOBBLY_CHIP
              )}
            >
              <span className="font-bold text-iris-soft tabular-nums">
                {index + 1}
              </span>
              <span className="text-muted-foreground">/ {deck.length}</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-iris/15 hover:text-iris-soft"
              aria-label="Kartu berikutnya"
              onClick={() => goto(1)}
            >
              <ArrowRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-iris/15 hover:text-iris-soft"
              aria-label="Acak urutan kartu"
              title="Acak urutan"
              onClick={() => rebuildDeck(true)}
            >
              <ShuffleIcon />
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Shortcut: Spasi = buka/tutup · ← → = pindah kartu
            {tracked && " · ↑ = tahu · ↓ = tidak tahu"}
          </p>
        </>
      )}
    </div>
  );
}
