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
    <nav className="sticky top-0 z-50 bg-ml-bg-dark/80 backdrop-blur-xl border-b border-ml-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Chapter */}
          {prevChapter ? (
            <Link
              href={prevChapter.href}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-ml-bg-card border border-ml-border hover:border-ml-cyan transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)]"
            >
              <svg className="w-5 h-5 text-ml-cyan transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-white font-medium">上一章</span>
            </Link>
          ) : (
            <div className="w-24"></div>
          )}

          {/* Center - Progress & Home */}
          <div className="flex items-center gap-6">
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-100 font-mono">
                第 {currentChapter} / {totalChapters} 章
              </span>
              <div className="w-32 h-2 bg-ml-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ml-cyan via-ml-blue to-ml-purple rounded-full transition-all duration-500"
                  style={{ width: `${(currentChapter / totalChapters) * 100}%` }}
                />
              </div>
            </div>

            {/* Home button */}
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-ml-border bg-ml-bg-card hover:bg-gradient-to-r hover:from-ml-blue/10 hover:to-ml-cyan/10 hover:border-ml-blue transition-all duration-300 group"
            >
              <span className="text-ml-cyan group-hover:text-white font-medium transition-colors">
                返回主页
              </span>
            </Link>
          </div>

          {/* Next Chapter */}
          {nextChapter ? (
            <Link
              href={nextChapter.href}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-ml-blue to-ml-cyan hover:from-ml-cyan hover:to-ml-blue transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
            >
              <span className="text-ml-bg-dark font-bold">下一章</span>
              <svg className="w-5 h-5 text-ml-bg-dark transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="w-24"></div>
          )}
        </div>
      </div>
    </nav>
  )
}
