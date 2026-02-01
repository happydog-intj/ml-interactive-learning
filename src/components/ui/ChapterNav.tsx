'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

interface ChapterNavProps {
  prevChapter?: { href: string; title: string }
  nextChapter?: { href: string; title: string }
  currentChapter: number
  totalChapters: number
}

export function ChapterNav({ prevChapter, nextChapter, currentChapter, totalChapters }: ChapterNavProps) {
  return (
    <nav className="bg-gray-100 dark:bg-ml-bg-secondary border-b border-gray-300 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {prevChapter ? (
            <Link
              href={prevChapter.href}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
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
            <div className="text-gray-500 dark:text-gray-200 text-sm">
              第 {currentChapter} 章 / 共 {totalChapters} 章
            </div>
            <ThemeToggle />
          </div>

          {nextChapter ? (
            <Link
              href={nextChapter.href}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
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
