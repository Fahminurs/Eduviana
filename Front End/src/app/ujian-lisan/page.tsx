"use client";

import * as React from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  FileTextIcon,
  MicIcon,
  MicOffIcon,
  PauseIcon,
  PlayIcon,
  SquareIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, shortenFileName } from "@/lib/utils";
import {
  chapterLabel,
  documents,
  liveEvaluation,
  liveScript,
  oralSessions,
} from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";
import { useStudy } from "@/components/providers";
import { VoiceOrb } from "@/components/voice-orb";

type Phase = "idle" | "live" | "done";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Skor kesiapan sederhana: rasio kekuatan vs total poin rapor. */
function sessionScore(strengths: string[], weaknesses: string[]) {
  const total = strengths.length + weaknesses.length;
  if (total === 0) return 0;
  return Math.round((strengths.length / total) * 100);
}

function scoreColorClass(value: number) {
  if (value >= 80) return "text-emerald-300";
  if (value >= 50) return "text-amber-300";
  return "text-red-300";
}

/** Ring skor melingkar untuk kartu riwayat sesi. */
function ScoreRing({ value, size = 44 }: { value: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  const colorClass = scoreColorClass(value);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-white/8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "fill-none stroke-current transition-all duration-700",
            colorClass
          )}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums",
          colorClass
        )}
      >
        {value}%
      </span>
    </div>
  );
}

/** Ungkap teks huruf demi huruf — efek "streaming" ala AI sedang bicara. */
function useTypewriter(text: string, enabled: boolean, speedMs = 18) {
  const [display, setDisplay] = React.useState(enabled ? "" : text);

  React.useEffect(() => {
    if (!enabled) {
      setDisplay(text);
      return;
    }
    setDisplay("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speedMs);
    return () => clearInterval(interval);
  }, [text, enabled, speedMs]);

  return display;
}

function SpeakerLine({
  speaker,
  text,
  streaming = false,
}: {
  speaker: "penguji" | "anda";
  text: string;
  streaming?: boolean;
}) {
  const displayText = useTypewriter(text, streaming);
  const isTyping = streaming && displayText.length < text.length;

  return (
    <div className="text-sm leading-relaxed">
      <span
        className={cn(
          "mr-2 text-xs font-semibold tracking-wider uppercase",
          speaker === "penguji" ? "text-iris-soft" : "text-muted-foreground"
        )}
      >
        {speaker === "penguji" ? "Penguji" : "Anda"}
      </span>
      <span className={speaker === "anda" ? "text-muted-foreground" : ""}>
        {displayText}
        {isTyping && (
          <span className="ml-0.5 inline-block h-3.5 w-0.5 -translate-y-0.5 animate-pulse bg-current align-middle" />
        )}
      </span>
    </div>
  );
}

function RaporCard({
  sessionNumber,
  subtitle,
  rapor,
  strengths,
  weaknesses,
}: {
  sessionNumber: number;
  subtitle: string;
  rapor: [string, string];
  strengths: string[];
  weaknesses: string[];
}) {
  return (
    <div className="rounded-xl border-l-2 border-primary bg-primary/8 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-iris-soft ring-1 ring-primary/30">
          {sessionNumber}
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-iris-soft">
            Rapor Sesi {sessionNumber}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">
        {rapor.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
            Kekuatan
          </p>
          <ul className="space-y-1.5">
            {strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm text-muted-foreground">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-emerald-300" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase">
            Masih Lemah
          </p>
          <ul className="space-y-1.5">
            {weaknesses.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Topik yang masih lemah akan sengaja diangkat lagi di sesi berikutnya
        sampai benar-benar dikuasai.
      </p>
    </div>
  );
}

export default function UjianLisanPage() {
  const { activeDocId, concreteChapter } = useStudy();
  const activeDoc = documents.find((d) => d.id === activeDocId);
  const chapterScript = liveScript[concreteChapter];
  const chapterEvaluation = liveEvaluation[concreteChapter];
  const chapterSessions = oralSessions.filter(
    (s) => s.chapter === concreteChapter
  );

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [durationMin, setDurationMin] = React.useState("20");
  const [elapsed, setElapsed] = React.useState(0);
  const [visibleLines, setVisibleLines] = React.useState(1);
  const [openSession, setOpenSession] = React.useState<number | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  // Ganti BAB di tengah sesi bikin bingung (skrip & rapor beda konteks) —
  // begitu BAB berpindah, sesi yang sedang jalan/selesai dikembalikan ke idle
  React.useEffect(() => {
    setPhase("idle");
  }, [concreteChapter]);

  React.useEffect(() => {
    if (phase !== "live" || isPaused) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [phase, isPaused]);

  React.useEffect(() => {
    if (phase !== "live" || isPaused) return;
    if (visibleLines >= chapterScript.length) return;
    const reveal = setTimeout(() => setVisibleLines((n) => n + 1), 3500);
    return () => clearTimeout(reveal);
  }, [phase, isPaused, visibleLines, chapterScript]);

  const startSession = () => {
    setElapsed(0);
    setVisibleLines(1);
    setIsMuted(false);
    setIsPaused(false);
    setPhase("live");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2.5 font-heading text-2xl font-bold tracking-tight">
            <MicIcon className="size-6 shrink-0 text-iris-soft" />
            Latihan Sidang Lisan
          </h1>
          <ChapterSelect />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          AI berperan sebagai dosen penguji berdasarkan dokumen:
        </p>
        {activeDoc &&
          (() => {
            const { short, ext, truncated } = shortenFileName(activeDoc.name);
            return (
              <span
                title={activeDoc.name}
                className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 py-1.5 pr-3 pl-2.5"
              >
                <FileTextIcon className="size-3.5 shrink-0 text-iris-soft" />
                <span className="flex min-w-0 items-baseline text-xs font-medium text-iris-soft">
                  <span className="truncate">
                    {short}
                    {truncated && "..."}
                  </span>
                  <span className="shrink-0 opacity-70">{ext}</span>
                </span>
              </span>
            );
          })()}
      </header>

      {/* Kontrol sesi */}
      {phase === "idle" && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Durasi sesi:</span>
            <Select value={durationMin} onValueChange={setDurationMin}>
              <SelectTrigger className="min-w-28" aria-label="Durasi sesi">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="10">10 menit</SelectItem>
                <SelectItem value="20">20 menit</SelectItem>
                <SelectItem value="30">30 menit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="ml-auto" onClick={startSession}>
            <PlayIcon data-icon="inline-start" />
            Mulai Sesi
          </Button>
        </div>
      )}

      {/* Sesi berlangsung */}
      {phase === "live" && (
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex flex-col items-center gap-1 border-b border-white/6 px-5 py-6">
            <VoiceOrb active={!isPaused && !isMuted} className="size-48" />
            <p className="text-xs text-muted-foreground">
              {isPaused
                ? "sesi dijeda — lanjutkan kalau sudah siap"
                : isMuted
                  ? "mic dimatikan — nyalakan lagi untuk lanjut bicara"
                  : "mic aktif — bicara seperti di ruang sidang..."}
            </p>
          </div>
          <div className="space-y-4 px-5 py-5">
            {(() => {
              // Skrip selalu berselang-seling penguji/anda per pasangan.
              const pairIndex = Math.floor((visibleLines - 1) / 2);
              const pengujiLine = chapterScript[pairIndex * 2];
              const andaLine =
                visibleLines > pairIndex * 2 + 1
                  ? chapterScript[pairIndex * 2 + 1]
                  : undefined;

              return (
                pengujiLine && (
                  // Key = pairIndex: seluruh pasangan cuma remount (swipe)
                  // begitu pindah ke pasangan berikutnya — bukan tiap kali
                  // salah satu baris berubah sendiri.
                  <div
                    key={pairIndex}
                    className="space-y-4 duration-500 animate-in fade-in slide-in-from-left-8 ease-out"
                  >
                    <SpeakerLine
                      speaker="penguji"
                      text={pengujiLine.text}
                      streaming
                    />
                    {andaLine && (
                      <div className="duration-300 animate-in fade-in">
                        <SpeakerLine
                          speaker="anda"
                          text={andaLine.text}
                          streaming
                        />
                      </div>
                    )}
                  </div>
                )
              );
            })()}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-white/6 px-5 py-4">
            <span className="font-mono text-sm text-iris-soft tabular-nums">
              ⏱ {formatTime(elapsed)} / {durationMin}:00
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label={isMuted ? "Nyalakan mic" : "Matikan mic"}
                aria-pressed={isMuted}
                onClick={() => setIsMuted((m) => !m)}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={isPaused ? "Lanjutkan sesi" : "Jeda sesi"}
                aria-pressed={isPaused}
                onClick={() => setIsPaused((p) => !p)}
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
              </Button>
              <Button variant="destructive" onClick={() => setPhase("done")}>
                <SquareIcon data-icon="inline-start" />
                Akhiri Sesi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rapor sesi barusan */}
      {phase === "done" && (
        <div className="space-y-4">
          <RaporCard
            sessionNumber={chapterSessions.length + 1}
            subtitle={`Barusan · ${formatTime(elapsed)} · ${chapterLabel(concreteChapter)}`}
            rapor={chapterEvaluation.rapor}
            strengths={chapterEvaluation.strengths}
            weaknesses={chapterEvaluation.weaknesses}
          />
          <Button variant="outline" onClick={() => setPhase("idle")}>
            Siapkan Sesi Baru
          </Button>
        </div>
      )}

      {/* Riwayat sesi — timeline vertikal, disembunyikan selama tanya-jawab
          berlangsung supaya fokus tidak pecah ke sesi-sesi lama */}
      {phase !== "live" && (
      <section className="mt-10">
        <h2 className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Riwayat Sesi Sebelumnya · {chapterLabel(concreteChapter)}
        </h2>
        {chapterSessions.length === 0 ? (
          <div className="rounded-xl bg-card px-6 py-10 text-center ring-1 ring-foreground/10">
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat sesi untuk {chapterLabel(concreteChapter)}.
              Mulai sesi pertamamu di atas.
            </p>
          </div>
        ) : (
        <div className="relative ml-[19px] space-y-3 border-l border-white/10 pl-5">
          {/* Riwayat baru 1 sesi: langsung tampil terbuka tanpa tombol
              Lihat — toggle collapse/expand baru relevan begitu ada 2+ sesi
              untuk dibandingkan/disembunyikan. */}
          {(() => {
            const onlyOneSession = chapterSessions.length === 1;
            return chapterSessions.map((session, idx) => {
            const isOpen = onlyOneSession || openSession === session.id;
            const score = sessionScore(session.strengths, session.weaknesses);
            const prev = chapterSessions[idx + 1];
            const delta = prev
              ? score - sessionScore(prev.strengths, prev.weaknesses)
              : 0;
            return (
              <div key={session.id} className="relative">
                <span className="absolute top-6 -left-[27px] size-2.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(110,86,207,0.5)]" />
                <div className="rounded-xl bg-card ring-1 ring-foreground/10">
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-4 py-4 sm:px-5">
                    <ScoreRing value={score} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        Sesi {session.id}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          · {session.dateLabel} · {session.durationLabel}
                        </span>
                        {delta !== 0 && (
                          <span
                            className={cn(
                              "ml-2 inline-flex items-center gap-0.5 text-xs font-semibold",
                              delta > 0 ? "text-emerald-300" : "text-red-300"
                            )}
                          >
                            {delta > 0 ? (
                              <TrendingUpIcon className="size-3" />
                            ) : (
                              <TrendingDownIcon className="size-3" />
                            )}
                            {Math.abs(delta)}%
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {session.rapor[0]}
                      </p>
                    </div>
                    {!onlyOneSession && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setOpenSession(isOpen ? null : session.id)
                        }
                      >
                        Lihat
                        <ChevronDownIcon
                          data-icon="inline-end"
                          className={cn(
                            "transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </Button>
                    )}
                  </div>
                  {isOpen && (
                    <div className="space-y-4 border-t border-white/6 px-4 py-4 sm:px-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-1.5 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
                            Kekuatan
                          </p>
                          <ul className="space-y-1.5">
                            {session.strengths.map((s) => (
                              <li
                                key={s}
                                className="flex gap-2 text-sm text-muted-foreground"
                              >
                                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-emerald-300" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                            Masih Lemah
                          </p>
                          <ul className="space-y-1.5">
                            {session.weaknesses.map((w) => (
                              <li
                                key={w}
                                className="flex gap-2 text-sm text-muted-foreground"
                              >
                                <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Cuplikan Transkrip
                        </p>
                        <div className="space-y-3 rounded-lg bg-black/20 p-3.5">
                          {session.transcriptPreview.map((line, i) => (
                            <SpeakerLine
                              key={i}
                              speaker={line.speaker}
                              text={line.text}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          });
          })()}
        </div>
        )}
      </section>
      )}
    </div>
  );
}
