import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audi Motor - Dealer Mobil Keluarga Terpercaya",
  description: "Spesialis mobil keluarga bekas berkualitas premium. Kami menjamin setiap unit yang Anda bawa pulang adalah yang terbaik untuk keluarga Anda.",
  keywords: ["mobil bekas", "dealer mobil", "mobil keluarga", "mobil premium", "Toyota", "Honda", "Mitsubishi", "Hyundai"],
  openGraph: {
    title: "Audi Motor - Dealer Mobil Keluarga Terpercaya",
    description: "Spesialis mobil keluarga bekas berkualitas premium.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
