'use client'

import { ReactNode } from 'react'

interface DemoCardProps {
  title: string
  description: string
  icon?: string
  gradient?: string
  children: ReactNode
}

export function DemoCard({
  title,
  description,
  icon = '🎮',
  gradient = 'from-ml-blue to-ml-purple',
  children
}: DemoCardProps) {
  return (
    <div className="mb-12 group">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h3>
        </div>
        <p className="text-lg text-gray-100 leading-relaxed pl-16">
          {description}
        </p>
      </div>

      {/* Demo Container */}
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

        {/* Main content */}
        <div className="relative bg-ml-bg-card border border-ml-border rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 blur-2xl rounded-full`} />
          </div>
        </div>
      </div>
    </div>
  )
}
