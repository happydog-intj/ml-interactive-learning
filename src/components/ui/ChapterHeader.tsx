'use client'

interface ChapterHeaderProps {
  chapterNumber: number
  title: string
  subtitle: string
  icon: string
  gradient: string
  objectives: string[]
}

export function ChapterHeader({
  chapterNumber,
  title,
  subtitle,
  icon,
  gradient,
  objectives
}: ChapterHeaderProps) {
  return (
    <header className="mb-16 relative">
      {/* Decorative background elements */}
      <div className={`absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-3xl`} />
      <div className={`absolute top-20 -right-10 w-48 h-48 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-3xl`} />

      <div className="relative">
        {/* Chapter badge and status */}
        <div className="flex items-center gap-3 mb-6 animate-slide-in">
          <div className="px-4 py-2 rounded-xl border border-ml-border bg-ml-bg-card backdrop-blur-sm">
            <span className={`text-sm font-mono font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              CHAPTER {chapterNumber}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-ml-green/10 border border-ml-green/30">
            <span className="text-sm font-semibold text-ml-green">✓ 已完成</span>
          </div>
        </div>

        {/* Main title with icon */}
        <div className="flex items-start gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-7xl transform hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className="flex-1">
            <h1 className={`text-6xl md:text-7xl font-display font-extrabold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}>
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 font-mono opacity-70">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Learning objectives */}
        <div
          className={`bg-gradient-to-br from-ml-bg-card to-ml-bg-secondary border border-ml-border rounded-2xl p-8 animate-slide-up relative overflow-hidden`}
          style={{ animationDelay: '0.2s' }}
        >
          {/* Decorative gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-1 h-8 bg-gradient-to-b ${gradient} rounded-full`} />
              <h2 className="text-2xl font-bold text-white">学习目标</h2>
              <div className="text-2xl">🎯</div>
            </div>

            <ul className="grid md:grid-cols-2 gap-4">
              {objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 group"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mt-0.5`}>
                    <svg className="w-4 h-4 text-ml-bg-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-100 leading-relaxed group-hover:text-white transition-colors">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
