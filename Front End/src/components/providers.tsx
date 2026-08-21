"use client";

import * as React from "react";
import {
  INITIAL_ACTIVE_DOC,
  type ChapterId,
} from "@/lib/data";

/** BAB terpilih dipakai bersama semua tab; "all" hanya berlaku di Glosarium. */
export type ChapterSelection = ChapterId | "all";

const CHAPTER_STORAGE_KEY = "eduviana:chapterId";
/** Belum pernah memilih bab apa pun → mulai dari BAB 1 */
const FIRST_TIME_CHAPTER: ChapterId = "bab1";
const VALID_CHAPTER_IDS: ChapterSelection[] = ["bab1", "bab2", "bab3", "bab4", "all"];

function readStoredChapter(): ChapterSelection {
  if (typeof window === "undefined") return FIRST_TIME_CHAPTER;
  const stored = window.localStorage.getItem(CHAPTER_STORAGE_KEY);
  if (stored && (VALID_CHAPTER_IDS as string[]).includes(stored)) {
    return stored as ChapterSelection;
  }
  return FIRST_TIME_CHAPTER;
}

interface StudyContextValue {
  chapterId: ChapterSelection;
  setChapterId: (id: ChapterSelection) => void;
  /** BAB konkret (fallback ke default saat "Semua BAB" terpilih). */
  concreteChapter: ChapterId;
  activeDocId: string;
  setActiveDocId: (id: string) => void;
}

const StudyContext = React.createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  // Dibaca langsung saat inisialisasi (bukan lewat useEffect) supaya bab
  // tersimpan tampil sejak render pertama, tanpa jeda/kedipan ke BAB 1 dulu.
  // Ini komponen client murni dengan data dummy (tanpa SSR data-fetching
  // sungguhan) sehingga selisih server/client di render pertama aman —
  // preferensi UI seperti ini adalah kasus wajar untuk pola lazy-init.
  const [chapterId, setChapterIdState] = React.useState<ChapterSelection>(
    readStoredChapter
  );

  const setChapterId = React.useCallback((id: ChapterSelection) => {
    setChapterIdState(id);
    window.localStorage.setItem(CHAPTER_STORAGE_KEY, id);
  }, []);

  const [activeDocId, setActiveDocId] = React.useState(INITIAL_ACTIVE_DOC);

  const value = React.useMemo<StudyContextValue>(
    () => ({
      chapterId,
      setChapterId,
      concreteChapter: chapterId === "all" ? FIRST_TIME_CHAPTER : chapterId,
      activeDocId,
      setActiveDocId,
    }),
    [chapterId, setChapterId, activeDocId]
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = React.useContext(StudyContext);
  if (!ctx) throw new Error("useStudy harus dipakai di dalam StudyProvider");
  return ctx;
}
