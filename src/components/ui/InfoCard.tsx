'use client'

import { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  variant?: 'default' | 'accent' | 'warning' | 'success'
  icon?: string
  children: ReactNode
}

const variantStyles = {
  default: {
    gradient: 'from-ml-blue to-ml-cyan',
    borderColor: 'border-ml-blue/30',
    bgColor: 'bg-ml-blue/5'
  },
  accent: {
    gradient: 'from-ml-purple to-ml-blue',
    borderColor: 'border-ml-purple/30',
    bgColor: 'bg-ml-purple/5'
  },
  warning: {
    gradient: 'from-ml-yellow to-ml-orange',
    borderColor: 'border-ml-yellow/30',
    bgColor: 'bg-ml-yellow/5'
  },
  success: {
    gradient: 'from-ml-green to-ml-cyan',
    borderColor: 'border-ml-green/30',
    bgColor: 'bg-ml-green/5'
  }
}

export function InfoCard({
  title,
  variant = 'default',
  icon,
  children
}: InfoCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`relative bg-ml-bg-card border ${styles.borderColor} rounded-xl p-6 group hover:border-opacity-100 transition-all duration-300 overflow-hidden`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </span>
          )}
          <h4 className={`text-xl font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
            {title}
          </h4>
        </div>

        {/* Content */}
        <div className="text-gray-100 leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}
