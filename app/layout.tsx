import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProgressProvider } from "@/components/progress-provider";
import { themeScript } from "@/lib/theme";
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
  title: { default: "Zucol OpenLearning", template: "%s · Zucol OpenLearning" },
  description: "Interactive, hands-on learning tracks for the Zucol tech team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
