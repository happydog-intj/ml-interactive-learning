'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const chapters = [
  {
    id: 2,
    title: '模型评估与选择',
    status: '已完成',
    statusColor: 'bg-green-600/20 text-green-400',
    borderColor: 'border-green-500'
  },
  {
    id: 3,
    title: '线性模型',
    status: '已完成',
    statusColor: 'bg-green-600/20 text-green-400',
    borderColor: 'border-ml-blue'
  },
  {
    id: 4,
    title: '决策树',
    status: '计划中',
    statusColor: 'bg-purple-600/20 text-purple-400',
    borderColor: 'border-purple-500'
  },
  {
    id: 5,
    title: '神经网络',
    status: '计划中',
    statusColor: 'bg-red-600/20 text-red-400',
    borderColor: 'border-red-500'
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-ml-bg-dark text-gray-900 dark:text-white transition-colors">
      {/* 主题切换按钮 */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-center">
          机器学习
          <span className="text-ml-blue"> 交互式</span>
          教学
        </h1>

        <p className="text-xl text-center text-gray-700 dark:text-white mb-12">
          基于周志华《机器学习》教材，用动画和交互理解每一个概念
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chapters.map(chapter => (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`}
              className={`bg-gray-100 dark:bg-ml-bg-secondary p-6 rounded-lg hover:scale-105 transition-all duration-200 hover:shadow-xl border-2 ${chapter.borderColor}`}
            >
              <h2 className="text-2xl font-bold mb-2">第{chapter.id}章</h2>
              <h3 className="text-lg mb-3 text-gray-800 dark:text-white">{chapter.title}</h3>
              <span className={`text-sm px-3 py-1 rounded-full ${chapter.statusColor} font-medium`}>
                {chapter.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
