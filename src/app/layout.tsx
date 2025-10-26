import type { Metadata, Viewport } from "next";
import { Poppins, Orbitron } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";
import { ClientLayout } from "./client-layout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://kagevpn.com' : 'http://localhost:3000'),
  title: "Kage VPN Store - Premium VPN Accounts",
  description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content with ExpressVPN, NordVPN, Surfshark and more.",
  keywords: ["VPN", "ExpressVPN", "NordVPN", "Surfshark", "Premium VPN", "VPN Store", "Secure Internet"],
  authors: [{ name: "Kage VPN Store" }],
  creator: "Kage VPN Store",
  publisher: "Kage VPN Store",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kagevpn.com",
    siteName: "Kage VPN Store",
    title: "Kage VPN Store - Premium VPN Accounts",
    description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kage VPN Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kage VPN Store - Premium VPN Accounts",
    description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00FFF5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${orbitron.variable}`}>
      <body className="antialiased bg-primary-dark text-white font-poppins" suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
