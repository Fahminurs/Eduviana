"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  FileTextIcon,
  FolderClockIcon,
  LayersIcon,
  MicIcon,
  NetworkIcon,
  SparklesIcon,
} from "lucide-react";
import { cn, splitFileName } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UploadFab } from "@/components/upload-fab";
import { ActiveDocFloat } from "@/components/active-doc-float";
import { JournalSyncTrigger } from "@/components/journal-sync-sheet";
import { useStudy } from "@/components/providers";
import { documents } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/ujian-lisan", label: "Ujian Lisan", icon: MicIcon },
  { href: "/rangkuman", label: "Rangkuman", icon: FileTextIcon },
  { href: "/glosarium", label: "Glosarium", icon: BookOpenIcon },
  { href: "/mindmap", label: "Mind Map", icon: NetworkIcon },
  { href: "/flashcard", label: "Flashcard", icon: LayersIcon },
  { href: "/quiz", label: "Quiz", icon: ClipboardListIcon },
];

/**
 * Kotak besar: hover = accent penuh + geser halus 2px, active = gradasi
 * Iris dengan soft glow. Transisinya diatur class `nav-big` di globals.css.
 * Ikon dibiarkan size-4 (default varian) supaya pas di tengah kotak 32px
 * saat sidebar di-collapse ke mode ikon.
 */
const BIG_ITEM_CLASS =
  "nav-big min-h-10 rounded-xl px-1.5 py-1.5 pr-3 font-medium hover:translate-x-0.5 hover:bg-accent hover:text-accent-foreground active:scale-[0.98] active:bg-accent active:text-accent-foreground data-active:bg-linear-to-br data-active:from-[#7d66db] data-active:to-[#5c48bd] data-active:text-primary-foreground data-active:ring-[1.3px] data-active:ring-iris-soft/50 group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:hover:translate-x-0";

/**
 * Tile kecil pembungkus ikon menu — memberi kedalaman saat expanded,
 * melebur jadi ikon polos saat sidebar di-collapse ke mode ikon.
 */
const ICON_TILE_CLASS =
  "flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/[0.07] transition-colors duration-200 group-hover/menu-button:bg-white/10 group-data-[active=true]/menu-button:bg-white/15 group-data-[active=true]/menu-button:ring-white/20 group-data-[collapsible=icon]:size-auto group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:ring-0";

/** Grup History File — tampilan lama dipertahankan (mode expanded). */
function HistoryFileGroup() {
  const { setOpen } = useSidebar();
  const { activeDocId, setActiveDocId } = useStudy();
  const [docsOpen, setDocsOpen] = React.useState(true);
  const readyDocs = documents.filter((d) => d.status === "selesai");

  return (
    <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
      {/* Versi expanded */}
      <div className="group-data-[collapsible=icon]:hidden">
        {/* Header grup — konsisten dengan item menu (tile ikon + kotak besar).
            Baris ini toggle collapse/expand, tidak menavigasi ke halaman
            lain. Ikon sync jurnal ditaruh terpisah (bukan bagian tombol
            toggle) supaya bisa diklik sendiri tanpa ikut buka/tutup daftar. */}
        <div
          className={cn(
            "group flex w-full items-center rounded-xl pr-1 text-sm font-medium transition-colors",
            docsOpen
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-white/5"
          )}
        >
          <button
            type="button"
            aria-label={
              docsOpen ? "Tutup daftar dokumen" : "Buka daftar dokumen"
            }
            aria-expanded={docsOpen}
            onClick={() => setDocsOpen((o) => !o)}
            className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pl-1.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/7">
              <FolderClockIcon className="size-4" />
            </span>
            <span className="truncate">History File</span>
            <span
              className={cn(
                "ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                docsOpen
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 text-muted-foreground"
              )}
            >
              {readyDocs.length}
            </span>
          </button>
          <JournalSyncTrigger />
          <button
            type="button"
            aria-label={
              docsOpen ? "Tutup daftar dokumen" : "Buka daftar dokumen"
            }
            aria-expanded={docsOpen}
            onClick={() => setDocsOpen((o) => !o)}
            className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground group-hover:text-foreground"
          >
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-200",
                !docsOpen && "-rotate-90"
              )}
            />
          </button>
        </div>

        {/* Rail riwayat ala timeline: garis vertikal + titik per dokumen,
            kartu dokumen dengan meta & badge status */}
        {docsOpen && (
          <div className="relative mt-2 ml-[15px] border-l border-white/10 pl-3 duration-200 animate-in fade-in slide-in-from-top-1">
            <ul className="space-y-1.5">
              {readyDocs.map((doc) => {
                const isActive = doc.id === activeDocId;
                return (
                  <li key={doc.id} className="relative">
                    {/* Titik di rail, sejajar label tanggal — dokumen aktif menyala */}
                    <span
                      className={cn(
                        "absolute top-1.25 -left-4.25 size-2 rounded-full transition-colors duration-200",
                        isActive
                          ? "bg-primary shadow-[0_0_8px_2px_rgba(110,86,207,0.6)]"
                          : "bg-white/20"
                      )}
                    />
                    {/* Label tanggal di rail (timeline per tanggal upload) */}
                    <p
                      className={cn(
                        "mb-1 text-[10px] font-semibold tracking-wide",
                        isActive ? "text-iris-soft" : "text-muted-foreground"
                      )}
                    >
                      {doc.uploadedDate}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveDocId(doc.id)}
                      aria-current={isActive ? "true" : undefined}
                      title={doc.name}
                      className={cn(
                        "group/doc flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ring-1 transition-all duration-200",
                        isActive
                          ? "bg-primary/12 ring-primary/35"
                          : "ring-transparent hover:bg-white/5 hover:ring-white/10"
                      )}
                    >
                      <FileTextIcon
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive ? "text-iris-soft" : "text-muted-foreground"
                        )}
                      />
                      {(() => {
                        const { base, ext } = splitFileName(doc.name);
                        return (
                          <span
                            className={cn(
                              "flex min-w-0 flex-1 items-baseline text-[13px] font-medium",
                              isActive
                                ? "text-iris-soft"
                                : "text-sidebar-foreground"
                            )}
                          >
                            <span className="truncate">{base}</span>
                            {ext && (
                              <span className="shrink-0 opacity-60">
                                {ext}
                              </span>
                            )}
                          </span>
                        );
                      })()}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Versi collapsed (ikon saja): klik = buka sidebar penuh supaya
          daftar dokumennya langsung terlihat (bukan navigasi ke halaman) */}
      <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={docsOpen}
            tooltip="History File"
            onClick={() => setOpen(true)}
            className={BIG_ITEM_CLASS}
          >
            <span className={ICON_TILE_CLASS}>
              <FolderClockIcon />
            </span>
            <span>History File</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const { activeDocId } = useStudy();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between border-b border-sidebar-border px-4 py-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8571e0] to-primary text-primary-foreground shadow-[0_0_16px_rgba(110,86,207,0.45)] ring-1 ring-white/20">
            <SparklesIcon className="size-4.5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Eduviana
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Teman Belajarmu
            </span>
          </span>
        </Link>
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-3">
        <HistoryFileGroup />
        <SidebarSeparator className="my-1 h-px bg-transparent bg-linear-to-r from-transparent via-white/12 to-transparent" />
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <p className="mb-2 px-1.5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase group-data-[collapsible=icon]:hidden">
            Menu Belajar
          </p>
          <SidebarMenu className="gap-2.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href} className="isolate">
                  {/* Layer bawah "hatched shadow": kotak kembaran selebar tombol,
                      digeser turun 8px — hanya sisiran arsir bawahnya yang
                      terlihat. Ditaruh di li (bukan ::after tombol) karena
                      tombol punya overflow-hidden yang memotong arsiran. */}
                  {isActive && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-xl border border-primary/70 [background:repeating-linear-gradient(-45deg,rgba(110,86,207,0.55)_0_2px,transparent_2px_6px)_#212126] transition-transform duration-200 group-hover/menu-item:translate-x-2 group-data-[collapsible=icon]:hidden"
                    />
                  )}
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={BIG_ITEM_CLASS}
                  >
                    <Link href={item.href}>
                      <span className={ICON_TILE_CLASS}>
                        <item.icon />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/4 px-3 py-2.5 ring-1 ring-white/7">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-iris-soft">
            <FileTextIcon className="size-3.5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Dokumen aktif
            </span>
            <span className="truncate text-xs text-sidebar-foreground">
              {documents.find((d) => d.id === activeDocId)?.name}
            </span>
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Topbar mobile — sidebar jadi sheet di bawah breakpoint md */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur md:hidden">
            <SidebarTrigger className="text-foreground" />
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </span>
            <span className="font-heading text-base font-bold">Eduviana</span>
          </header>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          {/* FAB upload dokumen — desktop & mobile, di semua halaman */}
          <UploadFab />
        </SidebarInset>
        {/* Widget mengambang dokumen aktif — hanya muncul saat sidebar
            diciutkan, karena info dokumen aktif di footer sidebar jadi
            tersembunyi. Bisa diseret ke mana saja. */}
        <ActiveDocFloat />
      </SidebarProvider>
    </TooltipProvider>
  );
}
