import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://ml-learning.yourdomain.com'),
  title: {
    default: '机器学习交互式学习平台 - ML Interactive Learning',
    template: '%s | ML Interactive Learning'
  },
  description: "基于《机器学习》（周志华）的交互式学习平台，通过可视化和动画深入理解机器学习核心概念",
  keywords: ['机器学习', '深度学习', '数据科学', '可视化', '交互式学习', '周志华', 'Machine Learning', 'ROC曲线', '决策树', '神经网络', 'SVM', '贝叶斯', '集成学习'],
  authors: [{ name: "ML Interactive Learning" }],
  creator: "ML Interactive Learning",
  publisher: "ML Interactive Learning",
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://ml-learning.yourdomain.com',
    siteName: 'ML Interactive Learning',
    title: '机器学习交互式学习平台',
    description: '通过交互式可视化深入理解机器学习核心概念',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '机器学习交互式学习平台 - 周志华教材配套'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '机器学习交互式学习平台',
    description: '通过交互式可视化深入理解机器学习核心概念',
    images: ['/og-image.png'],
    creator: '@MLInteractive'
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
  alternates: {
    canonical: 'https://ml-learning.yourdomain.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 结构化数据 - 教育组织
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "机器学习交互式学习平台",
    "alternateName": "ML Interactive Learning",
    "url": "https://ml-learning.yourdomain.com",
    "description": "基于《机器学习》（周志华）的交互式学习平台，通过可视化和动画深入理解机器学习核心概念",
    "founder": {
      "@type": "Organization",
      "name": "ML Interactive Learning Team"
    },
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "teaches",
      "educationalFramework": "Machine Learning",
      "targetDescription": "机器学习核心概念、算法和应用"
    },
    "learningResourceType": ["Interactive Tutorial", "Visualization", "Educational Platform", "Animation"],
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "机器学习学习者"
    },
    "educationalLevel": ["intermediate", "advanced"],
    "inLanguage": "zh-CN",
    "about": {
      "@type": "Thing",
      "name": "机器学习",
      "description": "基于周志华《机器学习》教材的16个核心章节"
    }
  }

  // 结构化数据 - 网站
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://ml-learning.yourdomain.com",
    "name": "机器学习交互式学习平台",
    "description": "通过可视化和动画深入理解机器学习",
    "inLanguage": "zh-CN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ml-learning.yourdomain.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <html lang="zh-CN">
      <head>
        {/* 结构化数据 - 教育组织 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        {/* 结构化数据 - 网站 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
