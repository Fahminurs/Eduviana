"use client";

import * as React from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  FileTextIcon,
  RotateCcwIcon,
  SparklesIcon,
  TargetIcon,
  TriangleAlertIcon,
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
import { chapters, quizQuestions, type ChapterId } from "@/lib/data";
import { useStudy } from "@/components/providers";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ["A", "B", "C", "D"];
const QUESTION_COUNT_OPTIONS = ["5", "10", "15", "20"];

const STEPPER_FULL_LIMIT = 10;

/* Timeline nomor soal — titik aktif membesar & berdenyut (step-pulse),
   titik yang sudah dilewati tetap menyala redup, sisanya polos. Sampai
   10 soal, semua titik ditampilkan penuh; lebih dari itu (15/20) yang
   ditampilkan adalah blok 10 titik berurutan yang ikut geser mengikuti
   soal aktif, plus titik terakhir di ujung — sisanya dipangkas jadi "⋯"
   supaya tetap satu baris. */
function QuestionStepper({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const visible =
    total <= STEPPER_FULL_LIMIT
      ? Array.from({ length: total }, (_, i) => i)
      : (() => {
          const windowStart = Math.min(
            Math.max(current - Math.floor(STEPPER_FULL_LIMIT / 2), 0),
            total - STEPPER_FULL_LIMIT
          );
          const window = Array.from(
            { length: STEPPER_FULL_LIMIT },
            (_, i) => windowStart + i
          );
          return [...new Set([0, ...window, total - 1])].sort(
            (a, b) => a - b
          );
        })();

  return (
    <div className="mb-6 flex items-center justify-center gap-x-1">
      {visible.map((idx, pos) => {
        const isActive = idx === current;
        const isPast = idx < current;
        const prevIdx = visible[pos - 1];
        const isGap = pos > 0 && idx - prevIdx > 1;

        return (
          <React.Fragment key={idx}>
            {pos > 0 &&
              (isGap ? (
                <span className="w-4 shrink-0 text-center text-xs text-muted-foreground sm:w-5.5">
                  ⋯
                </span>
              ) : (
                <span
                  className={cn(
                    "h-px w-4 shrink-0 sm:w-5.5",
                    prevIdx < current ? "bg-primary/50" : "bg-white/10"
                  )}
                />
              ))}
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-all duration-300",
                isActive
                  ? "size-7.5 animate-[step-pulse_2.2s_ease-in-out_infinite] bg-primary text-primary-foreground"
                  : isPast
                    ? "size-6 bg-primary/25 text-iris-soft"
                    : "size-6 bg-white/8 text-muted-foreground"
              )}
            >
              {idx + 1}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* Header Quiz bergaya sketsa tangan — khusus halaman ini (bukan
   ChapterSelect bersama) supaya perubahan visualnya tidak ikut mengubah
   Rangkuman/Glosarium/Mind Map/Flashcard/Ujian Lisan yang memakainya. */
const HEADER_WOBBLY = "rounded-[16px_22px_14px_24px/22px_14px_24px_16px]";
const HEADER_HATCH =
  "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.05)_0_2px,transparent_2px_8px)_#1c1c21]";
const DD_WOBBLY = "rounded-[12px_8px_14px_10px/8px_12px_10px_14px]";
const DD_BASE =
  "h-auto gap-1.5 border-2 border-dashed bg-transparent px-3 py-1.5 text-sm font-medium";

export default function QuizPage() {
  const { concreteChapter, setChapterId } = useStudy();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chapterQuestions = React.useMemo(
    () => quizQuestions.filter((q) => q.chapter === concreteChapter),
    [concreteChapter]
  );

  const [questionCount, setQuestionCount] = React.useState("10");
  const [order, setOrder] = React.useState<string[]>(() =>
    chapterQuestions.map((q) => q.id)
  );
  const [current, setCurrent] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [finished, setFinished] = React.useState(false);

  // Soal & urutan diacak tiap sesi — dibatasi jumlah soal pilihan pengguna,
  // tapi tidak melebihi soal yang memang tersedia untuk BAB itu.
  const restart = React.useCallback(() => {
    const limit = Math.min(Number(questionCount), chapterQuestions.length);
    setOrder(shuffle(chapterQuestions.map((q) => q.id)).slice(0, limit));
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setFinished(false);
  }, [chapterQuestions, questionCount]);

  React.useEffect(() => {
    restart();
  }, [restart]);

  const question = quizQuestions.find((q) => q.id === order[current]);
  const total = order.length;
  const isLast = current === total - 1;

  const next = () => {
    if (selected === null || !question) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (isLast) setFinished(true);
    else setCurrent((c) => c + 1);
  };

  const score = order.reduce((acc, id) => {
    const q = quizQuestions.find((qq) => qq.id === id);
    return acc + (q && answers[id] === q.answerIndex ? 1 : 0);
  }, 0);
  const wrongIds = order.filter((id) => {
    const q = quizQuestions.find((qq) => qq.id === id);
    return q && answers[id] !== undefined && answers[id] !== q.answerIndex;
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <header
        className={cn(
          "mb-6 flex flex-wrap items-center gap-4 border-2 border-white/14 px-4.5 py-4",
          HEADER_WOBBLY,
          HEADER_HATCH
        )}
      >
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Quiz
        </h1>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {mounted ? (
            <Select
              value={concreteChapter}
              onValueChange={(v) => setChapterId(v as ChapterId)}
            >
              <SelectTrigger
                className={cn(DD_WOBBLY, DD_BASE, "border-iris-soft/45")}
                aria-label="Pilih BAB"
              >
                <span className="text-[10px] font-semibold tracking-wide text-iris-soft uppercase">
                  BAB
                </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {chapters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="h-9 w-36 animate-pulse rounded-lg bg-card ring-1 ring-foreground/10" />
          )}

          <Select value={questionCount} onValueChange={setQuestionCount}>
            <SelectTrigger
              className={cn(DD_WOBBLY, DD_BASE, "border-sky-300/45")}
              aria-label="Jumlah soal"
            >
              <span className="text-[10px] font-semibold tracking-wide text-sky-300 uppercase">
                Soal
              </span>
              {/* Tampilkan angkanya saja (bukan SelectValue) supaya tidak
                  jadi "Soal 20 soal" — label "Soal" sudah ada di kiri */}
              <span className="text-sm font-medium">{questionCount}</span>
            </SelectTrigger>
            {/* min-w-36 bawaan SelectContent kepanjangan buat opsi sependek
                ini — dipersempit biar lebar dropdown ikut lebar trigger-nya */}
            <SelectContent
              position="popper"
              className="min-w-(--radix-select-trigger-width)"
            >
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <SelectItem key={n} value={n}>
                  {n} soal
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!finished && total > 0 && (
            <span className="rounded-full border-2 border-emerald-300/40 px-3 py-1 text-xs font-bold text-emerald-300 tabular-nums">
              {current + 1} / {total}
            </span>
          )}
        </div>
      </header>

      {!finished && question && (
        <>
          <QuestionStepper total={total} current={current} />

          <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <p className="font-heading text-base leading-relaxed font-semibold sm:text-lg">
              {question.question}
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-primary/12 ring-1 ring-primary"
                      : "bg-card ring-1 ring-foreground/10 hover:bg-white/4"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/8 text-muted-foreground"
                    )}
                  >
                    {LETTERS[i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={next} disabled={selected === null}>
              {isLast ? "Lihat Hasil" : "Soal Berikutnya"}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </>
      )}

      {finished && (
        <div className="space-y-6">
          {/* Skor akhir */}
          <div className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-10 text-center ring-1 ring-foreground/10">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-iris-soft">
              <TargetIcon className="size-7" />
            </span>
            <p className="font-heading text-2xl font-bold">
              Skor Anda: {score} / {total}
            </p>
            {wrongIds.length > 0 ? (
              <p className="max-w-sm text-sm text-muted-foreground">
                {wrongIds.length} soal yang salah otomatis lebih sering muncul
                di sesi quiz berikutnya.
              </p>
            ) : (
              <p className="max-w-sm text-sm text-muted-foreground">
                Sempurna! Semua soal BAB ini terjawab benar.
              </p>
            )}
            <Button className="mt-2" onClick={restart}>
              <RotateCcwIcon data-icon="inline-start" />
              Ulangi Quiz
            </Button>
          </div>

          {/* Pembahasan tiap soal: alasan jawaban benar + rujukan dokumen */}
          {total > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Pembahasan Soal
              </h2>
              <ul className="space-y-3">
                {order.map((id) => {
                  const q = quizQuestions.find((qq) => qq.id === id)!;
                  const isCorrect = answers[id] === q.answerIndex;
                  return (
                    <li
                      key={id}
                      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
                    >
                      <p className="text-sm font-medium">{q.question}</p>
                      {isCorrect ? (
                        <p className="mt-2 flex gap-2 text-sm text-emerald-300">
                          <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
                          Jawaban Anda benar: {q.options[q.answerIndex]}
                        </p>
                      ) : (
                        <>
                          <p className="mt-2 flex gap-2 text-sm text-red-300">
                            <XIcon className="mt-0.5 size-3.5 shrink-0" />
                            Jawaban Anda: {q.options[answers[id]]}
                          </p>
                          <p className="mt-1 flex gap-2 text-sm text-emerald-300">
                            <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
                            Yang benar: {q.options[q.answerIndex]}
                          </p>
                        </>
                      )}

                      <div className="mt-3 space-y-2">
                        {/* Kutipan isi dokumen skripsi pengguna */}
                        <div className="rounded-lg bg-white/5 p-3">
                          <div className="flex items-center gap-1.5">
                            <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                              Dari dokumen kamu
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground italic">
                            &ldquo;{q.documentExcerpt}&rdquo;
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground/70">
                            {q.sourceRef}
                          </p>
                        </div>

                        {/* Verifikasi AI: konfirmasi, atau koreksi kalau dokumen keliru */}
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            q.aiFlag
                              ? "bg-amber-400/10 ring-1 ring-amber-400/30"
                              : "bg-primary/8"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {q.aiFlag ? (
                              <TriangleAlertIcon className="size-3.5 shrink-0 text-amber-300" />
                            ) : (
                              <SparklesIcon className="size-3.5 shrink-0 text-iris-soft" />
                            )}
                            <span
                              className={cn(
                                "text-[11px] font-semibold tracking-wide uppercase",
                                q.aiFlag ? "text-amber-300" : "text-iris-soft"
                              )}
                            >
                              {q.aiFlag
                                ? "Verifikasi AI — dokumen kamu keliru"
                                : "Verifikasi AI"}
                            </span>
                          </div>
                          {q.aiFlag ? (
                            <p className="mt-1.5 text-sm leading-relaxed">
                              <span className="font-medium text-amber-300">
                                Yang kamu tulis di dokumen kamu salah:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                &ldquo;{q.aiFlag.wrongText}&rdquo;
                              </span>{" "}
                              — seharusnya{" "}
                              <span className="font-medium text-emerald-300">
                                {q.aiFlag.correctText}
                              </span>
                              .
                            </p>
                          ) : (
                            <p className="mt-1.5 text-sm text-emerald-300/90">
                              Sesuai dengan dokumen kamu.
                            </p>
                          )}
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}

      {total === 0 && (
        <div className="rounded-xl bg-card px-6 py-14 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            Belum ada soal untuk BAB ini.
          </p>
        </div>
      )}
    </div>
  );
}
