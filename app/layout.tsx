import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"; // Updated fonts
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "KKN REKOGNISI UIN RADEN FATAH 84A- KELOMPOK 401",
  description: "Peningkatan Kemandirian Melalui Digitalisasi dan Pendidikan Karakter Islami",
  icons: {
    icon: "/logo.png",
  },
  verification: {
    google: "duLCtbbMorjEClcOh8ObvAxQmJakTp8hD8DwjS3NW3E",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jakartaSans.variable} font-sans bg-background text-foreground antialiased selection:bg-blue-500/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
