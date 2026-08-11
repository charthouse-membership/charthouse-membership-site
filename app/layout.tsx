import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const siteUrl = "https://charthousemembership.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "ChartHouse Membership",
    template: "%s | ChartHouse Membership",
  },

  description:
    "Flexible monthly access to six professional creative studios for music, podcasts, DJ practice, live content, photography and video.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ChartHouse Membership",
    description:
      "Your space. Your sound. Your content. Flexible monthly access to six professional creative studios.",
    url: siteUrl,
    siteName: "ChartHouse Membership",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ChartHouse Membership",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ChartHouse Membership",
    description:
      "Flexible monthly access to six professional creative studios.",
    images: ["/twitter-image.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
