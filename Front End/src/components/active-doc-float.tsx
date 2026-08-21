"use client";

import * as React from "react";
import { FileTextIcon, GripVerticalIcon } from "lucide-react";
import { cn, shortenFileName } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useStudy } from "@/components/providers";
import { documents } from "@/lib/data";

const MARGIN = 12;

type Pos = { x: number; y: number };

/** Widget mengambang yang bisa diseret bebas, menampilkan dokumen yang
 *  sedang aktif dibuka. Hanya tampil saat sidebar diciutkan (info dokumen
 *  aktif di footer sidebar jadi tersembunyi di mode itu). Posisi awal
 *  selalu di pojok kanan atas (murni via CSS, tanpa perlu diukur) — begitu
 *  diseret, posisinya dikunci ke koordinat piksel dan tetap dalam batas
 *  layar. */
export function ActiveDocFloat() {
  const { state, isMobile, openMobile } = useSidebar();
  const { activeDocId } = useStudy();
  const readyDocs = documents.filter((d) => d.status === "selesai");
  const doc = readyDocs.find((d) => d.id === activeDocId);
  const order = doc ? readyDocs.findIndex((d) => d.id === doc.id) + 1 : 0;

  // Sidebar dianggap "tersembunyi" saat: desktop diciutkan ke ikon, atau
  // mobile sheet-nya tertutup — di kondisi lain footer sidebar sudah cukup.
  const sidebarHidden = isMobile ? !openMobile : state === "collapsed";
  const visible = sidebarHidden && !!doc;

  const barRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ offsetX: number; offsetY: number } | null>(
    null
  );
  // null = belum pernah diseret → posisi ikut default CSS (pojok kanan atas).
  const [pos, setPos] = React.useState<Pos | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const clamp = React.useCallback((x: number, y: number): Pos => {
    const el = barRef.current;
    const w = el?.offsetWidth ?? 280;
    const h = el?.offsetHeight ?? 44;
    const maxX = Math.max(MARGIN, window.innerWidth - w - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - h - MARGIN);
    return {
      x: Math.min(Math.max(x, MARGIN), maxX),
      y: Math.min(Math.max(y, MARGIN), maxY),
    };
  }, []);

  // Reclamp cuma relevan setelah posisinya pernah dikunci lewat drag.
  React.useEffect(() => {
    if (!pos) return;
    function onResize() {
      setPos((p) => (p ? clamp(p.x, p.y) : p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos, clamp]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    // Posisi baru dikunci ke koordinat piksel begitu benar-benar ada
    // gerakan — klik tanpa menggeser (misal cuma klik-lepas) tidak mengubah
    // posisi, jadi tetap di pojok kanan atas walau konten (nama file) beda
    // lebar saat dokumen aktif berganti.
    setDragging(true);
    setPos(
      clamp(e.clientX - dragRef.current.offsetX, e.clientY - dragRef.current.offsetY)
    );
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    barRef.current?.releasePointerCapture(e.pointerId);
  };

  if (!visible || !doc) return null;

  const { short, ext, truncated } = shortenFileName(doc.name);

  return (
    <div
      ref={barRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={pos ? { left: pos.x, top: pos.y, right: "auto" } : undefined}
      className={cn(
        "fixed top-3 right-3 z-50 flex max-w-[min(88vw,280px)] touch-none items-center gap-2 rounded-2xl bg-card/90 py-2 pr-3.5 pl-2.5 ring-1 ring-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow duration-150 select-none",
        dragging
          ? "cursor-grabbing shadow-[0_12px_36px_rgba(0,0,0,0.5)] ring-primary/30"
          : "cursor-grab"
      )}
    >
      <GripVerticalIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-iris-soft">
        <FileTextIcon className="size-3.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-tight">
        <span className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-iris-soft">
            Dokumen {order}
          </span>
          <span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground">
            {doc.uploadedTime}
          </span>
        </span>
        <span className="flex min-w-0 items-baseline text-xs font-medium text-foreground">
          <span className="truncate">
            {short}
            {truncated && "..."}
          </span>
          <span className="shrink-0 opacity-60">{ext}</span>
        </span>
      </span>
    </div>
  );
}
