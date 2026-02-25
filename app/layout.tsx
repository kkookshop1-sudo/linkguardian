import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://linkguardian.net'),
  title: {
    default: "LinkGuardian | Your Links Never Sleep. 24/7 Monitoring.",
    template: "%s | LinkGuardian",
  },
  description: "Protect your creator revenue. 24/7 automated monitoring for your social media bio links. Get instant email alerts when your links (Instagram, TikTok, YouTube) break.",
  keywords: ["link monitoring", "bio link checker", "creator tools", "social media automation", "uptime monitoring", "broken link checker"],
  authors: [{ name: "LinkGuardian Team" }],
  creator: "LinkGuardian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkguardian.net",
    siteName: "LinkGuardian",
    title: "LinkGuardian | 24/7 Automated Link Monitoring",
    description: "Don't lose revenue to broken links. We check your social media bio links every hour and alert you instantly.",
    images: [
      {
        url: "/og-image.png", // We will need to create this placeholder or rely on default
        width: 1200,
        height: 630,
        alt: "LinkGuardian Dashboard",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkGuardian | Your Links Never Sleep",
    description: "Protect your creator revenue. 24/7 automated monitoring for your social media bio links.",
    images: ["/og-image.png"],
  },
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
