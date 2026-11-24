import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const body = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-wght-normal.woff2", style: "normal", weight: "200 900" },
    { path: "./fonts/source-serif-4-latin-wght-italic.woff2", style: "italic", weight: "200 900" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});
const head = localFont({
  src: "./fonts/archivo-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-head",
  display: "swap",
});
const label = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-label",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.shortName} · ${site.course}`, template: `%s · ${site.shortName}` },
  description: site.description,
  authors: [{ name: site.author }],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: site.shortName,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = { themeColor: "#f5f0e6", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${head.variable} ${label.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-card focus:p-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
