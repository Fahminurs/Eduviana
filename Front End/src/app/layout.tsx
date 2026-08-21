import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, Kalam } from "next/font/google";
import "./globals.css";
import { StudyProvider } from "@/components/providers";
import { AppShell } from "@/components/app-shell";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* Font tulisan tangan — dipakai elemen bergaya hand-drawn (modal upload) */
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Eduviana — Persiapan Sidang Skripsi",
  description:
    "Aplikasi latihan mandiri untuk persiapan sidang skripsi: ujian lisan dengan AI, rangkuman, glosarium, mind map, flashcard, dan quiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${plexSans.variable} ${kalam.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        <StudyProvider>
          <AppShell>{children}</AppShell>
        </StudyProvider>
      </body>
    </html>
  );
}
