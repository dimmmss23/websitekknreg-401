import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ChatWidget from "@/components/ChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kknreguinrafa84a-401.web.id/"),
  title: "KKN REKOGNISI UIN RADEN FATAH 84A - KELOMPOK 401",
  description: "Peningkatan Kemandirian Melalui Digitalisasi dan Pendidikan Karakter Islami",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  // Menambahkan Site Name untuk OpenGraph
  openGraph: {
    siteName: "KKN Rekognisi UIN Raden Fatah 84A - KELOMPOK 401",
    type: "website",
    locale: "id_ID",
  },
  verification: {
    google: "kL-PDOr_UtX7qCF-H6TNusVLzOOT4RXiIf1zINRp9_8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Objek JSON-LD untuk membantu Google mendeteksi Nama Situs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KKN 401 UIN Raden Fatah",
    "url": "https://www.kknreguinrafa84a-401.web.id/",
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jakartaSans.variable} font-sans bg-background text-foreground antialiased selection:bg-blue-500/30`}>
        {/* Penempatan Skrip JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}