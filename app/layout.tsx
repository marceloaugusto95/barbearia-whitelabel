import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — agendamento online`,
  description: content.hero.text,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      style={
        {
          "--accent": brand.colors.accent,
          "--accent-hover": brand.colors.accentHover,
          "--accent-soft": brand.colors.accentSoft,
        } as React.CSSProperties
      }
    >
      <body>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
