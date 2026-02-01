'use client'

import { ReactNode } from 'react'

interface SectionProps {
  number: string
  title: string
  gradient?: string
  children: ReactNode
}

export function Section({
  number,
  title,
  gradient = 'from-ml-blue to-ml-cyan',
  children
}: SectionProps) {
  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="relative mb-8 pb-4">
        <div className="flex items-center gap-4">
          {/* Section number badge */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-mono font-bold text-ml-bg-dark text-lg shadow-lg`}>
            {number}
          </div>

          {/* Title with gradient underline */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-2">
              {title}
            </h2>
            <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full w-24`} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </section>
  )
}
