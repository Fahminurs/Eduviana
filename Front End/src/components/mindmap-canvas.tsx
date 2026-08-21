"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleIcon,
  ExpandIcon,
  FoldVerticalIcon,
  MaximizeIcon,
  MinimizeIcon,
  SearchIcon,
  UnfoldVerticalIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MindMapNode } from "@/lib/data";
import { ChapterSelect } from "@/components/chapter-select";

/* ===== Status penguasaan per node daun: belum / ragu / paham =====
   Disimpan di localStorage per id pohon (root.id) supaya tidak tabrakan
   antar bab. Dipilih lewat popover kecil yang muncul di samping kartu
   saat kartu daun diklik — bukan indikator permanen di kartu. */

type Mastery = "none" | "unsure" | "known";

const MASTERY_OPTIONS: { value: Mastery; label: string }[] = [
  { value: "none", label: "Belum" },
  { value: "unsure", label: "Ragu" },
  { value: "known", label: "Paham" },
];

const MASTERY_RING: Record<Mastery, string> = {
  none: "ring-white/15",
  unsure: "ring-amber-400/70",
  known: "ring-emerald-400/70",
};

function masteryStorageKey(rootId: string) {
  return `eduviana:mastery:${rootId}`;
}

function readMastery(rootId: string): Record<string, Mastery> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(masteryStorageKey(rootId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* ===== Tipe node kustom ===== */

type TopicNodeData = {
  label: string;
  depth: number;
  hasChildren: boolean;
  collapsed: boolean;
  onToggle: (id: string) => void;
  /* Status pencarian: hasil di-highlight (aktif = hasil yang sedang dituju) */
  highlighted: boolean;
  active: boolean;
  dimmed: boolean;
  /* Status penguasaan — hanya bermakna untuk node daun (tanpa anak) */
  mastery: Mastery;
  popoverOpen: boolean;
  onOpenPopover: (id: string | null) => void;
  onSetMastery: (id: string, value: Mastery) => void;
};

type TopicNode = Node<TopicNodeData, "topic">;

function nodeWidth(label: string, depth: number, hasChildren: boolean) {
  const base = label.length * 6.4 + 40 + (hasChildren ? 24 : 0);
  return Math.round(Math.min(depth === 0 ? 230 : 250, Math.max(130, base)));
}

function nodeHeight(depth: number) {
  return depth === 0 ? 52 : 40;
}

function MasteryPopover({
  mastery,
  onSelect,
  onClose,
}: {
  mastery: Mastery;
  onSelect: (value: Mastery) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const onDocClick = () => onClose();
    // Ditunda satu tick supaya klik yang membuka popover tidak langsung
    // dianggap "klik di luar" dan menutupnya lagi
    const t = setTimeout(() => document.addEventListener("click", onDocClick), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", onDocClick);
    };
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-1/2 left-full z-20 ml-2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-[#1c1c20] p-1 whitespace-nowrap shadow-lg ring-1 ring-white/10 duration-150 animate-in fade-in zoom-in-95"
    >
      {MASTERY_OPTIONS.map((opt) => {
        const isSelected = mastery === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              isSelected
                ? opt.value === "known"
                  ? "bg-emerald-400/20 text-emerald-300"
                  : opt.value === "unsure"
                    ? "bg-amber-400/20 text-amber-300"
                    : "bg-white/12 text-foreground"
                : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
            )}
          >
            {isSelected ? (
              <CheckIcon className="size-3" />
            ) : (
              <CircleIcon className="size-3" />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function TopicNodeComponent({ id, data }: NodeProps<TopicNode>) {
  const {
    label,
    depth,
    hasChildren,
    collapsed,
    onToggle,
    highlighted,
    active,
    dimmed,
    mastery,
    popoverOpen,
    onOpenPopover,
    onSetMastery,
  } = data;

  function handleClick() {
    if (hasChildren) {
      onToggle(id);
    } else {
      onOpenPopover(popoverOpen ? null : id);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex items-center gap-2 rounded-lg px-3 text-left leading-tight transition-opacity duration-200 select-none",
        depth === 0 &&
          "min-h-13 bg-primary py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_0_24px_rgba(110,86,207,0.35)]",
        depth === 1 &&
          "min-h-10 bg-[#232327] py-1.5 text-xs font-medium text-foreground ring-1 ring-primary/45",
        depth >= 2 &&
          "min-h-10 bg-[#1e1e22] py-1.5 text-xs text-foreground/85 ring-1 ring-white/12",
        !hasChildren && depth > 0 && "cursor-pointer",
        !hasChildren && mastery !== "none" && `ring-2 ${MASTERY_RING[mastery]}`,
        highlighted && "ring-2 ring-iris-soft/60",
        active &&
          "ring-2 ring-iris-soft shadow-[0_0_0_4px_rgba(186,167,255,0.2)]",
        dimmed && "opacity-35"
      )}
      style={{ width: nodeWidth(label, depth, hasChildren) }}
    >
      <Handle type="target" position={Position.Left} />
      <span className="min-w-0 flex-1">{label}</span>
      {hasChildren && (
        <button
          type="button"
          aria-label={collapsed ? "Buka cabang" : "Tutup cabang"}
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          className={cn(
            "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
            depth === 0
              ? "bg-white/20 text-white hover:bg-white/35"
              : "bg-white/8 text-muted-foreground hover:bg-white/20 hover:text-foreground"
          )}
        >
          {collapsed ? (
            <ChevronRightIcon className="size-3" />
          ) : (
            <ChevronDownIcon className="size-3" />
          )}
        </button>
      )}
      <Handle type="source" position={Position.Right} />
      {popoverOpen && (
        <MasteryPopover
          mastery={mastery}
          onSelect={(value) => {
            onSetMastery(id, value);
            onOpenPopover(null);
          }}
          onClose={() => onOpenPopover(null)}
        />
      )}
    </div>
  );
}

const nodeTypes = { topic: TopicNodeComponent };

/* ===== Layout: pohon → nodes/edges React Flow via dagre (kiri → kanan) ===== */

function buildGraph(
  root: MindMapNode,
  collapsed: Set<string>,
  onToggle: (id: string) => void,
  query: string,
  activeMatchId: string | null,
  mastery: Record<string, Mastery>,
  openPopoverId: string | null,
  onOpenPopover: (id: string | null) => void,
  onSetMastery: (id: string, value: Mastery) => void
) {
  const q = query.trim().toLowerCase();
  const parents = new Map<string, string | null>();
  const matches: string[] = [];

  // Pass 1: susuri seluruh pohon hanya untuk mengumpulkan leluhur & hasil
  // pencarian (data ringan, bukan layout) — dibutuhkan sebelum tahu node
  // mana yang akhirnya terlihat.
  const walkMeta = (node: MindMapNode, parentId: string | null) => {
    parents.set(node.id, parentId);
    if (q && node.label.toLowerCase().includes(q)) matches.push(node.id);
    for (const child of node.children ?? []) walkMeta(child, node.id);
  };
  walkMeta(root, null);

  // Saat mencari: leluhur setiap hasil dipaksa terbuka supaya hasilnya
  // terlihat, tanpa mengubah pilihan collapse milik pengguna
  const effCollapsed = new Set(collapsed);
  const matchSet = new Set(matches);
  if (q) {
    for (const id of matches) {
      let p = parents.get(id) ?? null;
      while (p) {
        effCollapsed.delete(p);
        p = parents.get(p) ?? null;
      }
    }
  }

  // Pass 2: layout dihitung HANYA dari node yang benar-benar terlihat —
  // saat cabang ditutup, node lain otomatis merapat mengisi kekosongan
  // (bukan diam di posisi lama). fitView di komponen Canvas yang membuat
  // kamera auto zoom in/out mengikuti kerapatan ini.
  const g = new dagre.graphlib.Graph();
  // nodesep dilonggarkan (16→28): saat sebuah node punya banyak anak,
  // garis-garis edge melengkung ke anaknya bisa menyerempet node tetangga
  // di kolom yang sama — jarak lebih lega mencegah kesan "tertutup".
  g.setGraph({ rankdir: "LR", nodesep: 28, ranksep: 64 });
  g.setDefaultEdgeLabel(() => ({}));

  const registerVisible = (
    node: MindMapNode,
    depth: number,
    parentId: string | null
  ) => {
    g.setNode(node.id, {
      width: nodeWidth(node.label, depth, !!node.children?.length),
      height: nodeHeight(depth),
    });
    if (parentId) g.setEdge(parentId, node.id);
    if (node.children?.length && !effCollapsed.has(node.id)) {
      for (const child of node.children) registerVisible(child, depth + 1, node.id);
    } else if (node.children?.length && effCollapsed.has(node.id)) {
      // Node hantu (tidak dirender): memesan pita ruang kosong di rank
      // berikutnya untuk node yang collapsed — tanpa ini, anak-anak dari
      // cabang tetangga dipadatkan tepat di baris kotak yang tertutup
      // sehingga terlihat "menutupi" bab tersebut.
      const ghostId = `${node.id}__ghost`;
      g.setNode(ghostId, { width: 8, height: nodeHeight(depth + 1) });
      g.setEdge(node.id, ghostId);
    }
  };
  registerVisible(root, 0, null);
  dagre.layout(g);

  const nodes: TopicNode[] = [];
  const edges: Edge[] = [];

  const visit = (node: MindMapNode, depth: number, parentId: string | null) => {
    const hasChildren = !!node.children?.length;
    const pos = g.node(node.id);
    nodes.push({
      id: node.id,
      type: "topic",
      position: { x: pos.x - pos.width / 2, y: pos.y - pos.height / 2 },
      data: {
        label: node.label,
        depth,
        hasChildren,
        collapsed: effCollapsed.has(node.id),
        onToggle,
        highlighted: q ? matchSet.has(node.id) : false,
        active: q ? node.id === activeMatchId : false,
        dimmed: q ? matchSet.size > 0 && !matchSet.has(node.id) : false,
        mastery: mastery[node.id] ?? "none",
        popoverOpen: openPopoverId === node.id,
        onOpenPopover,
        onSetMastery,
      },
    });
    if (parentId) {
      edges.push({
        id: `${parentId}->${node.id}`,
        source: parentId,
        target: node.id,
        type: "default",
        style: { stroke: "#6e56cf", strokeWidth: 1.5, opacity: 0.55 },
      });
    }
    // Anak node yang tertutup disembunyikan dari render sampai diklik lagi
    if (hasChildren && !effCollapsed.has(node.id)) {
      for (const child of node.children!) visit(child, depth + 1, node.id);
    }
  };
  visit(root, 0, null);

  // Posisi tiap hasil (urutan pohon) untuk navigasi & auto-center kamera
  const matchPositions = matches.map((id) => {
    const pos = g.node(id);
    return { id, x: pos.x, y: pos.y };
  });

  return { nodes, edges, matches: q ? matchPositions : [] };
}

/* ===== Kanvas ===== */

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 1.8;

function ZoomControls({
  isFullscreen,
  onToggleFullscreen,
  ready,
}: {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  ready: boolean;
}) {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  // Skeleton jujur: bentuk sama, tapi kosong/pudar sampai fitView pertama
  // selesai — daripada sempat menampilkan "100%" yang belum tentu benar
  if (!ready) {
    return (
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-card ring-1 ring-foreground/10 sm:w-40" />
        <div className="h-8 w-32 animate-pulse rounded-lg bg-card ring-1 ring-foreground/10" />
      </div>
    );
  }

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-2 duration-200 animate-in fade-in">
      {/* Slider zoom + persentase */}
      <div className="flex h-8 items-center gap-2 rounded-lg bg-card px-3 ring-1 ring-foreground/10">
        <input
          type="range"
          aria-label="Atur level zoom"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(e) => zoomTo(Number(e.target.value), { duration: 0 })}
          className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/12 accent-primary sm:w-28"
        />
        <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div className="flex overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10">
        <button
          type="button"
          aria-label="Perbesar"
          onClick={() => zoomIn({ duration: 200 })}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ZoomInIcon className="size-4" />
        </button>
        <span className="w-px bg-white/8" />
        <button
          type="button"
          aria-label="Perkecil"
          onClick={() => zoomOut({ duration: 200 })}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ZoomOutIcon className="size-4" />
        </button>
        <span className="w-px bg-white/8" />
        <button
          type="button"
          aria-label="Sesuaikan tampilan (fit)"
          title="Sesuaikan tampilan"
          onClick={() => fitView({ padding: 0.15, duration: 300 })}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <MaximizeIcon className="size-4" />
        </button>
        <span className="w-px bg-white/8" />
        <button
          type="button"
          aria-label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
          title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
          onClick={onToggleFullscreen}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          {isFullscreen ? (
            <MinimizeIcon className="size-4" />
          ) : (
            <ExpandIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function Canvas({
  tree,
  isFullscreen,
  onToggleFullscreen,
}: {
  tree: MindMapNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const [query, setQuery] = React.useState("");
  const [matchIndex, setMatchIndex] = React.useState(0);
  const { fitView, setCenter } = useReactFlow();

  // Status penguasaan per node daun — dibaca langsung dari localStorage saat
  // inisialisasi (sama pola dengan chapterId) supaya tidak ada kedipan
  const [mastery, setMasteryState] = React.useState<Record<string, Mastery>>(
    () => readMastery(tree.id)
  );
  React.useEffect(() => {
    setMasteryState(readMastery(tree.id));
  }, [tree.id]);

  const onSetMastery = React.useCallback(
    (id: string, value: Mastery) => {
      setMasteryState((prev) => {
        const next = { ...prev, [id]: value };
        window.localStorage.setItem(
          masteryStorageKey(tree.id),
          JSON.stringify(next)
        );
        return next;
      });
    },
    [tree.id]
  );

  // Popover pemilih status — hanya satu yang terbuka dalam satu waktu
  const [openPopoverId, setOpenPopoverId] = React.useState<string | null>(
    null
  );

  const onToggle = React.useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Semua id node bercabang kecuali akar — untuk "tutup semua"
  const branchIds = React.useMemo(() => {
    const ids: string[] = [];
    const walk = (n: MindMapNode) => {
      if (n.children?.length) {
        ids.push(n.id);
        n.children.forEach(walk);
      }
    };
    (tree.children ?? []).forEach(walk);
    return ids;
  }, [tree]);

  // Dibump khusus oleh "buka/tutup semua" — aksi ini mengubah banyak kotak
  // sekaligus jadi tetap auto-fit; toggle SATU kotak (onToggle) tidak
  // menyentuh ini, sehingga zoom pilihan pengguna tidak berubah untuk itu.
  const [fitTrigger, setFitTrigger] = React.useState(0);

  const collapseAll = () => {
    setCollapsed(new Set(branchIds));
    setFitTrigger((n) => n + 1);
  };
  const expandAll = () => {
    setCollapsed(new Set());
    setFitTrigger((n) => n + 1);
  };

  // Status tombol dihitung dari kondisi nyata (bukan diingat dari klik
  // terakhir): menyala kalau SEMUA cabang memang sedang terbuka/tertutup,
  // termasuk saat itu tercapai lewat toggle satu-satu secara manual
  const allExpanded =
    branchIds.length > 0 && branchIds.every((id) => !collapsed.has(id));
  const allCollapsed =
    branchIds.length > 0 && branchIds.every((id) => collapsed.has(id));

  // Reset ke hasil pertama tiap kali kata kunci berubah
  React.useEffect(() => {
    setMatchIndex(0);
  }, [query]);

  // Pass 1: hitung daftar hasil pencarian (tanpa tahu siapa yang "aktif")
  const { matches: rawMatches } = React.useMemo(
    () =>
      buildGraph(
        tree,
        collapsed,
        onToggle,
        query,
        null,
        mastery,
        openPopoverId,
        setOpenPopoverId,
        onSetMastery
      ),
    [tree, collapsed, onToggle, query, mastery, openPopoverId, onSetMastery]
  );
  const safeIndex =
    rawMatches.length > 0
      ? ((matchIndex % rawMatches.length) + rawMatches.length) % rawMatches.length
      : 0;
  const activeMatch = rawMatches[safeIndex] ?? null;

  // Pass 2: render final dengan id hasil aktif untuk styling ring "active"
  const { nodes, edges, matches } = React.useMemo(
    () =>
      buildGraph(
        tree,
        collapsed,
        onToggle,
        query,
        activeMatch?.id ?? null,
        mastery,
        openPopoverId,
        setOpenPopoverId,
        onSetMastery
      ),
    [
      tree,
      collapsed,
      onToggle,
      query,
      activeMatch,
      mastery,
      openPopoverId,
      onSetMastery,
    ]
  );

  function goToMatch(dir: 1 | -1) {
    if (rawMatches.length === 0) return;
    setMatchIndex((i) => i + dir);
  }

  // Kamera melompat halus ke hasil yang sedang aktif
  React.useEffect(() => {
    if (!activeMatch) return;
    const t = setTimeout(
      () => setCenter(activeMatch.x, activeMatch.y, { zoom: 1, duration: 300 }),
      60
    );
    return () => clearTimeout(t);
  }, [activeMatch, setCenter]);

  // Toolbar zoom baru ditampilkan setelah fitView PERTAMA selesai — sebelum
  // itu useViewport() masih default (zoom 1 / 100%), yang kalau ditampilkan
  // terlihat seperti angka asli padahal belum. Sekali true, tetap true.
  const [ready, setReady] = React.useState(false);

  // Auto-fit saat ganti bab ATAU saat "buka/tutup semua" (fitTrigger) —
  // toggle satu kotak (klik panah individual) TIDAK memicu ini, jadi level
  // zoom pilihan pengguna dibiarkan apa adanya untuk kasus itu.
  React.useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.15, duration: 350 });
      setReady(true);
    }, 40);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree, fitTrigger, fitView]);

  return (
    <div className="relative h-full w-full">
      {/* Toolbar: (fullscreen) pilih bab + cari topik + buka/tutup semua cabang */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        {isFullscreen && <ChapterSelect allowAll />}
        <div className="flex h-8 items-center gap-1.5 rounded-lg bg-card px-2.5 ring-1 ring-foreground/10 focus-within:ring-primary/60">
          <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goToMatch(e.shiftKey ? -1 : 1);
              }
            }}
            placeholder="Cari topik…"
            aria-label="Cari topik di mind map"
            className="w-32 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground sm:w-40"
          />
          {query && rawMatches.length > 0 && (
            <span className="shrink-0 text-[10px] font-medium whitespace-nowrap text-muted-foreground">
              {safeIndex + 1}/{rawMatches.length}
            </span>
          )}
          {query && rawMatches.length === 0 && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              0
            </span>
          )}
          {query && rawMatches.length > 1 && (
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                aria-label="Hasil sebelumnya"
                title="Hasil sebelumnya (Shift+Enter)"
                onClick={() => goToMatch(-1)}
                className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <ChevronUpIcon className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Hasil berikutnya"
                title="Hasil berikutnya (Enter)"
                onClick={() => goToMatch(1)}
                className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <ChevronDownIcon className="size-3.5" />
              </button>
            </div>
          )}
          {query && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setQuery("")}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10">
          <button
            type="button"
            aria-label="Buka semua cabang"
            title="Buka semua cabang"
            onClick={expandAll}
            className={cn(
              "flex size-8 items-center justify-center transition-all duration-150",
              allExpanded
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <UnfoldVerticalIcon className="size-4" />
          </button>
          <span className="w-px bg-white/8" />
          <button
            type="button"
            aria-label="Tutup semua cabang"
            title="Tutup semua cabang"
            onClick={collapseAll}
            className={cn(
              "flex size-8 items-center justify-center transition-all duration-150",
              allCollapsed
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <FoldVerticalIcon className="size-4" />
          </button>
        </div>
      </div>
      <ZoomControls
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        ready={ready}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={1.8}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.4}
          color="#3a3a42"
        />
      </ReactFlow>
      {/* Radial fade ke tepi supaya kanvas menyatu dengan tema gelap */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(24,24,27,0.9) 100%)",
        }}
      />
    </div>
  );
}

export function MindMapCanvas({ tree }: { tree: MindMapNode }) {
  // Tandai area main supaya doodle background dimatikan selama kanvas
  // tampil (selector :has() dibuang compiler CSS, jadi pakai atribut)
  React.useEffect(() => {
    const inset = document.querySelector('[data-slot="sidebar-inset"]');
    inset?.setAttribute("data-doodle", "off");
    return () => inset?.removeAttribute("data-doodle");
  }, []);

  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Fullscreen API sungguhan — benar-benar keluar dari chrome browser
  // (address bar/tab) dan taskbar OS, bukan cuma overlay CSS. Kalau browser
  // menolak (mis. di iframe tanpa izin), overlay CSS tetap jadi fallback.
  React.useEffect(() => {
    if (!isFullscreen || !overlayRef.current) return;
    const el = overlayRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    }
  }, [isFullscreen]);

  // Sinkron dua arah: tombol browser/OS untuk keluar fullscreen (mis. Esc
  // pada beberapa browser, atau tombol keluar fullscreen) ikut menutup mode
  React.useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Esc untuk keluar layar penuh (fallback kalau Fullscreen API tidak aktif)
  React.useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  // Keluar dari Fullscreen API saat mode dimatikan dari dalam aplikasi
  React.useEffect(() => {
    if (isFullscreen) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isFullscreen]);

  // Kunci scroll halaman + sembunyikan FAB upload (global, di luar portal)
  // saat layar penuh aktif
  React.useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-mindmap-fullscreen", "true");
    return () => {
      document.body.style.overflow = prev;
      document.body.removeAttribute("data-mindmap-fullscreen");
    };
  }, [isFullscreen]);

  const canvas = (
    <Canvas
      tree={tree}
      key={tree.id}
      isFullscreen={isFullscreen}
      onToggleFullscreen={() => setIsFullscreen((v) => !v)}
    />
  );

  return (
    <ReactFlowProvider>
      {isFullscreen && mounted
        ? createPortal(
            // Portal ke body: lepas dari sidebar, navbar, dan FAB upload —
            // hanya kanvas mind map yang tampil, memenuhi seluruh layar
            <div
              ref={overlayRef}
              className="fixed inset-0 z-50 bg-background"
            >
              {canvas}
            </div>,
            document.body
          )
        : canvas}
    </ReactFlowProvider>
  );
}
