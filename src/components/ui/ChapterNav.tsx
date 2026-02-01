'use client'

import Link from 'next/link'

interface ChapterNavProps {
  prevChapter?: { href: string; title: string }
  nextChapter?: { href: string; title: string }
  currentChapter: number
  totalChapters: number
}

export function ChapterNav({ prevChapter, nextChapter, currentChapter, totalChapters }: ChapterNavProps) {
  return (
    <nav className="bg-ml-bg-secondary border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {prevChapter ? (
            <Link
              href={prevChapter.href}
              className="text-white hover:text-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">←</span>
              <span>上一章</span>
            </Link>
          ) : (
            <div className="w-20"></div>
          )}

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-ml-blue hover:text-ml-blue/80 transition-colors"
            >
              返回主页
            </Link>
            <div className="text-white text-sm">
              第 {currentChapter} 章 / 共 {totalChapters} 章
            </div>
          </div>

          {nextChapter ? (
            <Link
              href={nextChapter.href}
              className="text-white hover:text-gray-100 transition-colors flex items-center gap-2"
            >
              <span>下一章</span>
              <span className="text-xl">→</span>
            </Link>
          ) : (
            <div className="w-20"></div>
          )}
        </div>
      </div>
    </nav>
  )
}
