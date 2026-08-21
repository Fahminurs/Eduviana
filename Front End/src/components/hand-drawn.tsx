import { cn } from "@/lib/utils";

/**
 * Primitif gaya "hand-drawn" bersama — dipakai modal upload (upload-fab)
 * dan halaman dokumen (page.tsx) supaya konsisten: radius sudut goyang khas
 * sketsa, isian arsir spidol, selotip washi, dan coretan yang "digambar".
 */

/* Radius "goyang" khas sketsa: tiap sudut beda, seolah digambar tangan */
export const WOBBLY_CARD = "rounded-[22px_30px_24px_32px/30px_22px_32px_24px]";
export const WOBBLY_ZONE = "rounded-[26px_16px_30px_18px/18px_28px_16px_30px]";
export const WOBBLY_TILE = "rounded-[14px_18px_12px_20px/18px_12px_20px_14px]";
export const WOBBLY_BTN = "rounded-[14px_10px_16px_12px/10px_16px_12px_14px]";
export const WOBBLY_PILL = "rounded-[999px_12px_999px_12px/12px_999px_12px_999px]";

/* Selotip washi semi-transparan bergaris — dekorasi hand-drawn */
export const TAPE_BG =
  "[background:repeating-linear-gradient(-45deg,rgba(186,167,255,0.32)_0_5px,rgba(186,167,255,0.18)_5px_10px)]";

/* Isian arsir ungu — goresan diagonal ala spidol, pengganti fill solid
   supaya elemen ungu ikut terasa "digambar tangan" */
export const HATCH_TILE =
  "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.45)_0_2px,transparent_2px_5px)_#2b273e]";
export const HATCH_TILE_STRONG =
  "[background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.7)_0_2px,transparent_2px_5px)_#332a52]";
export const HATCH_CTA =
  "[background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.16)_0_2px,transparent_2px_6px),linear-gradient(to_bottom_right,#7d66db,#5c48bd)]";

/** Coretan bawah judul — "digambar" saat elemen muncul di layar. */
export function TitleSquiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 150 8"
      fill="none"
      className={cn("mt-1.5 block h-2 w-40 text-primary", className)}
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
export function DoodleSparkle({ className }: { className?: string }) {
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

/** Paku jarum (pushpin) ala kertas ditempel di papan — kepala bulat + jarum. */
export function PushpinDoodle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 20"
      fill="none"
      className={cn("pointer-events-none", className)}
    >
      <line
        x1="8"
        y1="9.5"
        x2="8"
        y2="19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="6" r="5.5" fill="currentColor" />
      <circle cx="6" cy="4" r="1.4" fill="white" fillOpacity="0.55" />
    </svg>
  );
}

/** Pemisah dua titik "digambar tangan" — pengganti tanda titik-dua kaku. */
export function DoodleDotDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 40"
      fill="currentColor"
      className={cn("pointer-events-none", className)}
    >
      <circle cx="4.5" cy="13" r="2.6" />
      <circle cx="5.5" cy="27" r="2.6" />
    </svg>
  );
}
