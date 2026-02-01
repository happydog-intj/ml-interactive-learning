import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-ml-bg-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-center">
          机器学习
          <span className="text-ml-blue"> 交互式</span>
          教学
        </h1>
        
        <p className="text-xl text-center text-gray-300 mb-12">
          基于周志华《机器学习》教材，用动画和交互理解每一个概念
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 章节卡片 */}
          {[2, 3, 4, 5].map(chapter => (
            <Link 
              key={chapter}
              href={`/chapter/${chapter}`}
              className="bg-ml-bg-secondary p-6 rounded-lg hover:bg-ml-bg-secondary/80 transition"
            >
              <h2 className="text-2xl font-bold mb-2">第{chapter}章</h2>
              <p className="text-gray-400">即将推出</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
