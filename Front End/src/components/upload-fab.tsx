"use client";

import * as React from "react";
import { CloudUploadIcon, FileTextIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DoodleSparkle,
  HATCH_CTA,
  HATCH_TILE,
  HATCH_TILE_STRONG,
  TAPE_BG,
  TitleSquiggle,
  WOBBLY_BTN,
  WOBBLY_CARD,
  WOBBLY_TILE,
  WOBBLY_ZONE,
} from "@/components/hand-drawn";

type UploadPhase = "pilih" | "mengunggah" | "selesai";

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * FAB upload dokumen — melayang di pojok kanan bawah (desktop & mobile),
 * membuka modal upload bergaya hand-drawn: radius sudut tak rata, border
 * tebal, offset shadow keras, selotip washi, coretan yang "digambar",
 * dan font tulisan tangan (Kalam) untuk label-label pendek.
 */
export function UploadFab() {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [phase, setPhase] = React.useState<UploadPhase>("pilih");
  const [progress, setProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    []
  );

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      // Reset setelah animasi tutup selesai agar isi tidak berkedip
      window.setTimeout(() => {
        setFile(null);
        setPhase("pilih");
        setProgress(0);
        setDragOver(false);
      }, 200);
    }
  }

  function startUpload() {
    if (!file) return;
    setPhase("mengunggah");
    setProgress(0);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 16 + 6, 100);
        if (next >= 100 && timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
          window.setTimeout(() => setPhase("selesai"), 350);
        }
        return next;
      });
    }, 160);
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Upload dokumen baru"
            data-slot="upload-fab-trigger"
            className="group fixed right-5 bottom-5 z-40 isolate flex outline-none md:right-7 md:bottom-7"
          >
            {/* Layer bawah "hatched shadow" — kembaran tombol digeser turun */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-2xl border border-primary/70 [background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.55)_0_2px,transparent_2px_6px)_#212126] transition-transform duration-200 group-hover:translate-y-1 group-active:translate-x-0.5 group-active:translate-y-0.5"
            />
            <span className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-linear-to-br from-[#7d66db] to-[#5c48bd] px-4 py-2.5 text-primary-foreground ring-[1.3px] ring-iris-soft/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:ring-iris-soft group-active:translate-x-0.5 group-active:translate-y-0.5">
              <CloudUploadIcon className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="text-[11px] leading-none font-semibold tracking-wide">
                Upload
              </span>
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">Upload dokumen</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "rotate-[-0.4deg] border-0 bg-transparent p-5 ring-0 shadow-none sm:max-w-md",
            WOBBLY_CARD
          )}
        >
          {/* Bayangan offset DIARSIR + kartu dasar sebagai layer -z-10.
              bg DialogContent dibuat transparan: kalau bg menempel di parent,
              layer arsiran (yang menimpa area kartu karena digeser 8px)
              malah tergambar DI ATAS background kartu. */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 border border-primary/60 [background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.5)_0_2px,transparent_2px_6px)_#212126]",
              WOBBLY_CARD
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 border-2 border-white/20 bg-[#1f1f24]",
              WOBBLY_CARD
            )}
          />
          {/* Selotip washi menempel di tepi atas kartu */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -top-3 left-9 h-6 w-20 rotate-[-5deg] rounded-xs ring-1 ring-white/10",
              TAPE_BG
            )}
          />

          <DialogHeader>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-11 shrink-0 -rotate-3 items-center justify-center border-2 border-iris-soft/50 text-iris-soft",
                  WOBBLY_TILE,
                  HATCH_TILE
                )}
              >
                <CloudUploadIcon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <DialogTitle className="font-hand text-2xl leading-none font-bold">
                  Upload Dokumen
                  <TitleSquiggle />
                </DialogTitle>
                <DialogDescription>
                  Tambahkan materi baru — AI mengubahnya jadi rangkuman, quiz,
                  flashcard, dan lainnya.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {phase === "pilih" && !file && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                setFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className={cn(
                "group/zone relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-6 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                WOBBLY_ZONE,
                dragOver
                  ? "rotate-[0.6deg] border-iris-soft bg-primary/10"
                  : "border-white/25 bg-white/2 hover:rotate-[0.4deg] hover:border-primary/70 hover:bg-primary/5"
              )}
            >
              {/* Doodle kilau di sudut zona */}
              <DoodleSparkle className="absolute top-3 right-4 size-5 text-iris-soft/60" />
              <DoodleSparkle className="absolute bottom-3.5 left-4 size-3.5 text-iris-soft/40" />

              <span
                className={cn(
                  "flex size-12 rotate-2 items-center justify-center border-2 text-iris-soft transition-colors",
                  WOBBLY_TILE,
                  dragOver
                    ? cn("border-iris-soft/70", HATCH_TILE_STRONG)
                    : cn("border-iris-soft/40", HATCH_TILE)
                )}
              >
                <CloudUploadIcon className="size-5" />
              </span>
              <span className="text-sm leading-tight font-medium">
                {dragOver
                  ? "Lepaskan file di sini!"
                  : "Tarik file ke sini, atau klik untuk pilih"}
              </span>
              <span className="text-xs text-muted-foreground">
                (.docx / .pdf)
              </span>
            </div>
          )}

          {file && phase !== "selesai" && (
            /* Zona berbentuk sama persis dengan dropzone awal — bentuk modal
               tidak berubah setelah file dipilih, kartu file tampil di dalamnya */
            <div
              className={cn(
                "flex min-h-52 min-w-0 flex-col items-center justify-center gap-4 border-2 border-dashed border-white/25 bg-white/2 px-5 py-6",
                WOBBLY_ZONE
              )}
            >
              <div
                className={cn(
                  "relative flex w-full min-w-0 rotate-[-0.5deg] items-center gap-3 border-2 border-white/20 bg-white/3 px-3 py-2.5",
                  WOBBLY_TILE
                )}
              >
                {/* Selotip mini "menempelkan" kartu file */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -top-2.5 left-1/2 h-4 w-12 -translate-x-1/2 rotate-3 ring-1 ring-white/10",
                    TAPE_BG
                  )}
                />
                <span
                  className={cn(
                    "flex size-9 shrink-0 -rotate-2 items-center justify-center border-2 border-iris-soft/40 text-iris-soft",
                    WOBBLY_BTN,
                    HATCH_TILE
                  )}
                >
                  <FileTextIcon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                  <span className="font-hand text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </span>
                {phase === "pilih" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Hapus file terpilih"
                    onClick={() => setFile(null)}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>

              {phase === "mengunggah" && (
                <div className="flex w-full flex-col gap-1.5">
                  {/* Progress sketsa: track border tebal + arsiran berjalan */}
                  <div className="h-3.5 w-full overflow-hidden rounded-[10px_14px_10px_14px/14px_10px_14px_10px] border-2 border-white/25 bg-white/5">
                    <div
                      className="h-full animate-[hatch-scroll_500ms_linear_infinite] [background:repeating-linear-gradient(-45deg,#7d66db_0_6px,#5c48bd_6px_12px)] transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-hand text-sm text-muted-foreground">
                    Mengunggah… {Math.round(progress)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {phase === "selesai" && (
            <div
              className={cn(
                "relative flex min-h-52 rotate-[0.4deg] flex-col items-center justify-center gap-2.5 border-2 border-emerald-300/35 bg-emerald-400/8 px-6 py-6 text-center duration-300 animate-in fade-in zoom-in-95",
                WOBBLY_ZONE
              )}
            >
              <DoodleSparkle className="absolute top-3 left-4 size-4 text-emerald-300/50" />
              <DoodleSparkle className="absolute right-4 bottom-4 size-3.5 text-emerald-300/40" />
              <span
                className={cn(
                  "flex size-12 -rotate-2 items-center justify-center border-2 border-emerald-300/60 bg-emerald-400/15 text-emerald-300",
                  WOBBLY_TILE
                )}
              >
                {/* Centang yang "digambar tangan" saat muncul */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <path
                    d="M4 12.5l5.2 5L20 6.5"
                    pathLength={100}
                    strokeDasharray={100}
                    strokeDashoffset={100}
                    className="animate-[sketch-draw_500ms_ease-out_150ms_forwards]"
                  />
                </svg>
              </span>
              <span className="font-hand text-xl font-bold text-emerald-200">
                Berhasil diupload!
              </span>
              <span className="text-xs text-balance text-muted-foreground">
                <span className="font-medium text-foreground">
                  {file?.name}
                </span>{" "}
                sedang diproses AI — pantau statusnya di History File.
              </span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />

          {phase === "pilih" && (
            <div className="flex justify-end gap-2.5 pt-1">
              <DialogClose asChild>
                <button
                  type="button"
                  className={cn(
                    "h-10 border-2 border-white/20 px-4 font-hand text-base font-bold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                    WOBBLY_BTN
                  )}
                >
                  Batal
                </button>
              </DialogClose>
              <button
                type="button"
                disabled={!file}
                onClick={startUpload}
                className={cn(
                  "flex h-10 items-center gap-2 px-5 font-hand text-base font-bold text-primary-foreground shadow-[3px_3px_0_rgba(186,167,255,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_rgba(186,167,255,0.35)] active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-50",
                  WOBBLY_BTN,
                  HATCH_CTA
                )}
              >
                <CloudUploadIcon className="size-4" />
                Upload
              </button>
            </div>
          )}
          {phase === "selesai" && (
            <div className="flex justify-end pt-1">
              <DialogClose asChild>
                <button
                  type="button"
                  className={cn(
                    "h-10 px-6 font-hand text-base font-bold text-primary-foreground shadow-[3px_3px_0_rgba(186,167,255,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none",
                    WOBBLY_BTN,
                    HATCH_CTA
                  )}
                >
                  Selesai
                </button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
