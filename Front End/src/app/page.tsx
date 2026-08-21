"use client";

import * as React from "react";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters, chapterProgress, SIDANG_DATE } from "@/lib/data";
import {
  DoodleDotDivider,
  DoodleSparkle,
  PushpinDoodle,
  TAPE_BG,
  TitleSquiggle,
  WOBBLY_CARD,
  WOBBLY_TILE,
  WOBBLY_ZONE,
} from "@/components/hand-drawn";

/**
 * Tiap satuan waktu (Hari/Jam/Menit/Detik) dapat warna & rotasi sendiri —
 * kesan "papan tempel" catatan warna-warni, bukan sekadar 4 kotak kembar
 * seperti kartu H-18 di atas. WOBBLY_ZONE dipakai (bukan WOBBLY_TILE) supaya
 * bentuk wobble-nya juga beda dari kotak lain di halaman ini.
 */
const COUNTDOWN_UNITS = [
  {
    key: "days" as const,
    label: "Hari",
    rotate: "-rotate-3 hover:rotate-0",
    text: "text-iris-soft",
    border: "border-iris-soft/60",
    glow: "shadow-[0_0_20px_rgba(110,86,207,0.4)]",
    hatch:
      "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.45)_0_2px,transparent_2px_6px)_#2b273e]",
  },
  {
    key: "hours" as const,
    label: "Jam",
    rotate: "rotate-2 hover:rotate-0",
    text: "text-sky-200",
    border: "border-sky-300/60",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    hatch:
      "[background:repeating-linear-gradient(-45deg,rgba(56,189,248,0.4)_0_2px,transparent_2px_6px)_#132b33]",
  },
  {
    key: "minutes" as const,
    label: "Menit",
    rotate: "-rotate-2 hover:rotate-0",
    text: "text-amber-200",
    border: "border-amber-300/60",
    glow: "shadow-[0_0_20px_rgba(252,211,77,0.35)]",
    hatch:
      "[background:repeating-linear-gradient(-45deg,rgba(252,211,77,0.4)_0_2px,transparent_2px_6px)_#332a15]",
  },
  {
    key: "seconds" as const,
    label: "Detik",
    rotate: "rotate-3 hover:rotate-0",
    text: "text-rose-200",
    border: "border-rose-300/60",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.4)]",
    hatch:
      "[background:repeating-linear-gradient(-45deg,rgba(251,113,133,0.4)_0_2px,transparent_2px_6px)_#33141b]",
  },
];

/* Latar "papan gabus" berwarna-warni — meminjam warna keempat satuan waktu
   supaya kartu ini punya identitas sendiri, bukan hatch satu-warna seperti
   kartu H-18 di atas. */
const CORKBOARD_HATCH =
  "[background:repeating-linear-gradient(45deg,rgba(110,86,207,0.32)_0_3px,rgba(56,189,248,0.28)_3px_6px,rgba(252,211,77,0.28)_6px_9px,rgba(251,113,133,0.28)_9px_12px,transparent_12px_16px)_#1b1a22]";

function daysUntil(target: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target.getTime() - startOfToday.getTime()) / 86_400_000);
}

/**
 * Hitung mundur hidup Hari:Jam:Menit:Detik — angka baru dihitung SETELAH
 * mount (state awal null) supaya server & client render sama dulu, baru
 * "menyala" begitu jam mulai jalan di browser (hindari mismatch hidrasi).
 */
function useLiveCountdown(target: Date) {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diffMs = now ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    ready: now !== null,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function LiveCountdown({ target }: { target: Date }) {
  const { ready, days, hours, minutes, seconds } = useLiveCountdown(target);
  const values: Record<(typeof COUNTDOWN_UNITS)[number]["key"], number> = {
    days,
    hours,
    minutes,
    seconds,
  };

  return (
    <div className="flex items-end justify-center gap-1.5 sm:gap-3">
      {COUNTDOWN_UNITS.map((u, i) => (
        <React.Fragment key={u.key}>
          <div
            className={cn(
              "relative flex flex-col items-center gap-1.5 transition-transform duration-200",
              u.rotate
            )}
          >
            <PushpinDoodle
              className={cn(
                "absolute -top-2.5 left-1/2 size-3.5 -translate-x-1/2",
                u.text
              )}
            />
            <span
              className={cn(
                "flex h-14 w-12 items-center justify-center border-2 font-mono text-xl leading-none font-bold tabular-nums sm:h-20 sm:w-16 sm:text-3xl",
                WOBBLY_ZONE,
                u.border,
                u.text,
                u.hatch,
                u.glow,
                ready && "animate-[glow-pulse_2.4s_ease-in-out_infinite]"
              )}
            >
              {ready ? String(values[u.key]).padStart(2, "0") : "--"}
            </span>
            <span className="font-hand text-[10px] font-bold tracking-wide text-muted-foreground uppercase sm:text-[11px]">
              {u.label}
            </span>
          </div>
          {i < COUNTDOWN_UNITS.length - 1 && (
            <DoodleDotDivider className="mb-5 size-4 text-muted-foreground/40 sm:size-5" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  const daysLeft = daysUntil(SIDANG_DATE);
  const dateLabel = SIDANG_DATE.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const masteredCount = chapters.filter(
    (c) => chapterProgress[c.id].status === "kuasai"
  ).length;

  // Ukuran teks countdown menyusut mengikuti jumlah digit supaya "H-18"
  // (atau angka 3 digit) tidak pernah pecah baris di dalam kotak persegi
  const countdownLabel = daysLeft > 0 ? `H-${daysLeft}` : "H!";
  const countdownTextSize =
    countdownLabel.length >= 5
      ? "text-3xl"
      : countdownLabel.length >= 4
        ? "text-4xl"
        : "text-6xl";

  const urgency =
    daysLeft <= 7 ? "rose" : daysLeft <= 14 ? "amber" : "iris";
  const urgencyGlow = {
    rose: "shadow-[0_0_34px_rgba(251,113,133,0.45)] border-rose-300/60 text-rose-200",
    amber:
      "shadow-[0_0_34px_rgba(252,211,77,0.4)] border-amber-300/60 text-amber-200",
    iris: "shadow-[0_0_34px_rgba(110,86,207,0.45)] border-iris-soft/60 text-iris-soft",
  }[urgency];
  const urgencyHatch = {
    rose: "[background:repeating-linear-gradient(-45deg,rgba(251,113,133,0.4)_0_2px,transparent_2px_6px)_#33141b]",
    amber:
      "[background:repeating-linear-gradient(-45deg,rgba(252,211,77,0.4)_0_2px,transparent_2px_6px)_#332a15]",
    iris: "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.5)_0_2px,transparent_2px_6px)_#2b273e]",
  }[urgency];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      {/* ===== Kartu countdown besar — makin dekat hari-H, makin "menyala" ===== */}
      <header className="relative mb-8 rotate-[-0.3deg]">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 border",
            WOBBLY_CARD,
            urgencyHatch
          )}
        />
        <div
          className={cn(
            "relative flex flex-col items-center gap-3 border-2 border-white/15 bg-[#1c1c21] px-6 py-8 text-center",
            WOBBLY_CARD
          )}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -top-3 left-10 h-6 w-24 -rotate-6 rounded-xs ring-1 ring-white/10",
              TAPE_BG
            )}
          />
          <DoodleSparkle className="absolute top-5 right-8 size-5 text-iris-soft/50" />
          <DoodleSparkle className="absolute bottom-6 left-8 size-3.5 text-iris-soft/30" />

          <span className="font-hand text-lg font-bold text-muted-foreground">
            Menuju Sidang Skripsi
          </span>

          <span
            className={cn(
              "flex size-32 items-center justify-center border-4 font-hand leading-none font-bold whitespace-nowrap animate-[glow-pulse_2.4s_ease-in-out_infinite]",
              countdownTextSize,
              WOBBLY_TILE,
              urgencyGlow,
              urgencyHatch
            )}
          >
            {countdownLabel}
          </span>

          <h1 className="font-hand text-2xl font-bold text-foreground">
            {dateLabel}
            <TitleSquiggle className="mx-auto w-40" />
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {masteredCount} dari {chapters.length} BAB sudah kamu kuasai.
            Yuk lanjutkan biar makin siap!
          </p>
        </div>
      </header>

      {/* ===== Hitung mundur hidup — "papan tempel" warna-warni, beda gaya
          dari kartu H-18 di atas ===== */}
      <section className="relative rotate-[0.3deg]">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 border border-white/10",
            WOBBLY_CARD,
            CORKBOARD_HATCH
          )}
        />
        <div
          className={cn(
            "relative flex flex-col items-center gap-6 overflow-hidden border-2 border-white/15 bg-[#1c1c21] px-6 py-8 text-center",
            WOBBLY_CARD
          )}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -top-3 right-10 h-6 w-24 rotate-6 rounded-xs ring-1 ring-white/10",
              TAPE_BG
            )}
          />
          <DoodleSparkle className="absolute top-6 left-8 size-5 text-iris-soft/50" />
          <DoodleSparkle className="absolute right-10 bottom-8 size-3.5 text-iris-soft/30" />

          <span className="flex items-center gap-1.5 font-hand text-lg font-bold text-muted-foreground">
            <SparklesIcon className="size-4.5 text-iris-soft" />
            Waktu Terus Berjalan
          </span>

          <LiveCountdown target={SIDANG_DATE} />

          <p className="max-w-sm text-sm text-muted-foreground">
            Tiap detik berharga. Manfaatkan waktu yang tersisa buat makin
            siap sidang!
          </p>
        </div>
      </section>
    </div>
  );
}
