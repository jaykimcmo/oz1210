import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'My Trip - 한국 관광지 정보 서비스',
    template: '%s | My Trip',
  },
  description: '전국 관광지 정보를 한눈에! 지역별, 타입별 검색과 지도로 찾는 나만의 여행 계획',
  keywords: ['관광지', '여행', '한국', '지도', '검색', '관광정보'],
  authors: [{ name: 'My Trip' }],
  creator: 'My Trip',
  publisher: 'My Trip',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'My Trip',
    title: 'My Trip - 한국 관광지 정보 서비스',
    description: '전국 관광지 정보를 한눈에! 지역별, 타입별 검색과 지도로 찾는 나만의 여행 계획',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Trip',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Trip - 한국 관광지 정보 서비스',
    description: '전국 관광지 정보를 한눈에!',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        cssLayerName: "clerk", // Tailwind 4 호환성
      }}
    >
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" richColors />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
