"use client";

import * as React from "react";
import {
  CheckIcon,
  FolderIcon,
  Loader2Icon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JOURNAL_FOLDER_PATH = "D:\\Skripsi\\Dokumen\\Jurnal";

interface JournalEntry {
  id: string;
  name: string;
  ok: boolean;
  note?: string;
}

const INDEXED_JOURNALS: JournalEntry[] = [
  { id: "j1", name: "deteksi-plat-yolo-2023.pdf", ok: true },
  { id: "j2", name: "sensor-tof-parkir-2022.pdf", ok: true },
  { id: "j3", name: "paddleocr-akurasi-plat-2024.pdf", ok: true },
  { id: "j4", name: "arsitektur-esp32-iot-parkir-2021.pdf", ok: true },
  { id: "j5", name: "review-sistem-parkir-cerdas-2023.pdf", ok: true },
];

/* Dummy "file baru" yang dianggap muncul di folder tiap kali Sync
   diklik — mensimulasikan penambahan incremental, bukan re-index semua. */
const NEW_JOURNAL_POOL: JournalEntry[] = [
  { id: "j-new-1", name: "komunikasi-uart-mikrokontroler-2021.pdf", ok: true },
  { id: "j-new-2", name: "multiplekser-i2c-tca9548a-2020.pdf", ok: true },
  { id: "j-new-3", name: "scan-halaman-rusak.pdf", ok: false, note: "Gagal dibaca" },
];

type SyncPhase = "idle" | "syncing" | "done";

/** Tombol kecil pemicu Sheet sync jurnal — ditaruh di header sidebar
 * History File, terpisah dari tombol toggle collapse/expand. */
export function JournalSyncTrigger() {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState<SyncPhase>("idle");
  const [journals, setJournals] = React.useState(INDEXED_JOURNALS);
  const [lastSynced, setLastSynced] = React.useState("2 jam lalu");
  const [newFound, setNewFound] = React.useState<JournalEntry[]>([]);
  const poolIndexRef = React.useRef(0);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  function runSync() {
    setPhase("syncing");
    setNewFound([]);
    timerRef.current = window.setTimeout(() => {
      const next = NEW_JOURNAL_POOL[poolIndexRef.current % NEW_JOURNAL_POOL.length];
      poolIndexRef.current += 1;
      setNewFound([next]);
      if (next.ok) {
        setJournals((prev) => [...prev, next]);
      }
      setLastSynced("baru saja");
      setPhase("done");
    }, 1400);
  }

  const indexedCount = journals.filter((j) => j.ok).length;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Sync jurnal referensi"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <RefreshCwIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Sync jurnal referensi</TooltipContent>
      </Tooltip>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Jurnal Referensi</SheetTitle>
            <SheetDescription>
              Sumber sitasi buat Rangkuman, Quiz, Ujian Lisan, dan menu
              lainnya.
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            <div className="flex items-center gap-2 rounded-lg bg-card p-3 text-xs text-muted-foreground ring-1 ring-foreground/10">
              <FolderIcon className="size-3.5 shrink-0 text-iris-soft" />
              <span className="min-w-0 flex-1 truncate">
                {JOURNAL_FOLDER_PATH}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {indexedCount} jurnal terindeks
              </span>
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  phase === "syncing"
                    ? "bg-primary/12 text-iris-soft"
                    : "bg-emerald-400/10 text-emerald-300"
                )}
              >
                {phase === "syncing" ? (
                  <Loader2Icon className="size-3 animate-spin" />
                ) : (
                  <CheckIcon className="size-3" />
                )}
                {phase === "syncing"
                  ? "Memindai folder..."
                  : `Sinkron ${lastSynced}`}
              </span>
            </div>

            <Button onClick={runSync} disabled={phase === "syncing"}>
              <RefreshCwIcon
                data-icon="inline-start"
                className={cn(phase === "syncing" && "animate-spin")}
              />
              Sync Jurnal
            </Button>

            {phase === "done" && newFound.length > 0 && (
              <div className="rounded-lg bg-card p-3 ring-1 ring-foreground/10 duration-200 animate-in fade-in slide-in-from-top-1">
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Hasil sync barusan
                </p>
                <ul className="flex flex-col gap-1.5">
                  {newFound.map((j) => (
                    <li
                      key={j.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                        j.ok
                          ? "bg-emerald-400/8 text-emerald-200"
                          : "bg-red-400/8 text-red-200"
                      )}
                    >
                      {j.ok ? (
                        <CheckIcon className="size-3.5 shrink-0" />
                      ) : (
                        <XIcon className="size-3.5 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1 truncate">
                        {j.name}
                        {j.note ? ` — ${j.note}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="min-h-0">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Semua jurnal terindeks
              </p>
              <ul className="flex flex-col gap-1.5">
                {journals.map((j) => (
                  <li
                    key={j.id}
                    className="flex items-center gap-2 rounded-md bg-white/4 px-2 py-1.5 text-xs text-muted-foreground"
                  >
                    <CheckIcon className="size-3.5 shrink-0 text-emerald-300" />
                    <span className="min-w-0 flex-1 truncate">{j.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
