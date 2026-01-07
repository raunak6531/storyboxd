import type { Metadata, Viewport } from "next"; // Add Viewport import
import { Inter, Playfair_Display, Space_Mono, Courier_Prime, Permanent_Marker, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "StoryBoxd",
  description: "Share your Letterboxd reviews as Instagram Stories",
  manifest: "/manifest.json", // Link to PWA manifest
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StoryBoxd",
  },
};

// New Viewport export for theme color
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming like a native app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} ${courierPrime.variable} ${permanentMarker.variable} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}