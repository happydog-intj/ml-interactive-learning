'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const chapters = [
  {
    id: 2,
    title: '模型评估与选择',
    subtitle: 'Model Evaluation',
    status: '已完成',
    icon: '📊',
    gradient: 'from-ml-cyan via-ml-blue to-ml-purple',
    glowColor: 'shadow-[0_0_30px_rgba(0,217,255,0.3)]',
    completionPercent: 100,
  },
  {
    id: 3,
    title: '线性模型',
    subtitle: 'Linear Models',
    status: '已完成',
    icon: '📈',
    gradient: 'from-ml-green via-ml-cyan to-ml-blue',
    glowColor: 'shadow-[0_0_30px_rgba(0,255,136,0.3)]',
    completionPercent: 100,
  },
  {
    id: 4,
    title: '决策树',
    subtitle: 'Decision Trees',
    status: '已完成',
    icon: '🌳',
    gradient: 'from-ml-purple via-ml-blue to-ml-cyan',
    glowColor: 'shadow-[0_0_30px_rgba(184,76,255,0.3)]',
    completionPercent: 100,
  },
  {
    id: 5,
    title: '神经网络',
    subtitle: 'Neural Networks',
    status: '计划中',
    icon: '🧠',
    gradient: 'from-ml-red via-ml-orange to-ml-yellow',
    glowColor: 'shadow-[0_0_30px_rgba(255,51,102,0.3)]',
    completionPercent: 0,
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-ml-bg-dark text-white overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-ml-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-ml-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className={`text-center max-w-5xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          {/* Main Title with dramatic gradient */}
          <div className="mb-8">
            <div className="inline-block mb-4 px-6 py-2 rounded-full border border-ml-blue/30 bg-ml-blue/5 backdrop-blur-sm">
              <span className="text-sm font-mono text-ml-cyan tracking-wider">INTERACTIVE LEARNING PLATFORM</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-display font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-ml-cyan to-ml-blue bg-clip-text text-transparent">
                机器学习
              </span>
              <br />
              <span className="bg-gradient-to-r from-ml-blue via-ml-purple to-ml-cyan bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                交互式教学
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed font-light">
            基于周志华《机器学习》教材
            <br />
            <span className="text-ml-cyan font-medium">用动画和交互理解每一个概念</span>
          </p>

          {/* Stats bar */}
          <div className="flex justify-center gap-8 mb-16 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-ml-cyan mb-1">5</div>
              <div className="text-sm text-gray-100 font-mono">章节</div>
            </div>
            <div className="w-px bg-ml-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-ml-green mb-1">20+</div>
              <div className="text-sm text-gray-100 font-mono">交互演示</div>
            </div>
            <div className="w-px bg-ml-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-ml-purple mb-1">∞</div>
              <div className="text-sm text-gray-100 font-mono">学习可能</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`}
              className={`group relative ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Background with gradient border */}
              <div className="relative h-full">
                {/* Glow effect on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${chapter.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm ${chapter.glowColor}`} />

                {/* Main card */}
                <div className="relative h-full bg-ml-bg-card border border-ml-border rounded-2xl p-6 transition-all duration-500 group-hover:translate-y-[-8px] group-hover:border-transparent overflow-hidden">
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${chapter.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Chapter Number with Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-500">
                          {chapter.icon}
                        </div>
                        <div className={`text-sm font-mono font-semibold bg-gradient-to-r ${chapter.gradient} bg-clip-text text-transparent`}>
                          CHAPTER {chapter.id}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        chapter.completionPercent === 100
                          ? 'bg-ml-green/10 text-ml-green border border-ml-green/30'
                          : 'bg-ml-purple/10 text-ml-purple border border-ml-purple/30'
                      }`}>
                        {chapter.status}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-ml-cyan transition-all duration-300">
                      {chapter.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-100 font-mono mb-4 opacity-70">
                      {chapter.subtitle}
                    </p>

                    {/* Progress Bar */}
                    {chapter.completionPercent > 0 && (
                      <div className="mt-4 pt-4 border-t border-ml-border/50">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-100 font-mono">完成进度</span>
                          <span className="text-ml-cyan font-bold">{chapter.completionPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-ml-bg-dark rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${chapter.gradient} transition-all duration-1000 rounded-full`}
                            style={{ width: `${chapter.completionPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-6 h-6 text-ml-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ml-cyan to-transparent opacity-30" />
    </main>
  )
}
