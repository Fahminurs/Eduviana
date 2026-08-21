"use client";

import { allChaptersMindMap, mindmaps } from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";
import { useStudy } from "@/components/providers";
import { MindMapCanvas } from "@/components/mindmap-canvas";

export default function MindMapPage() {
  const { chapterId, concreteChapter } = useStudy();
  const tree = chapterId === "all" ? allChaptersMindMap : mindmaps[concreteChapter];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 px-4 py-4 md:px-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Mind Map
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Klik node ber-ikon panah untuk membuka/menutup cabangnya · scroll
            untuk zoom · drag untuk geser
          </p>
        </div>
        <ChapterSelect allowAll />
      </header>
      <div className="min-h-[420px] flex-1">
        <MindMapCanvas tree={tree} />
      </div>
    </div>
  );
}
