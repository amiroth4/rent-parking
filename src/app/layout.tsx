import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { PwaProvider } from "@/components/pwa/pwa-register";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RentParking — Society Parking Sharing",
    template: "%s · RentParking",
  },
  description:
    "Share unused parking slots within your residential society. Set hourly & daily rates, book a neighbor's slot in seconds.",
  applicationName: "RentParking",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RentParking",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-dvh">
        <ToastProvider>
          {children}
          <PwaProvider />
        </ToastProvider>
      </body>
    </html>
  );
}
