import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "机器学习交互式学习平台 - ML Interactive Learning",
  description: "基于《机器学习》（周志华）的交互式学习平台，通过可视化和动画深入理解机器学习核心概念",
  keywords: "机器学习, 深度学习, 数据科学, 可视化, 交互式学习, 周志华, Machine Learning",
  authors: [{ name: "ML Interactive Learning" }],
  openGraph: {
    title: "机器学习交互式学习平台",
    description: "通过交互式可视化深入理解机器学习",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
