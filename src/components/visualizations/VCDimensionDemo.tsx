'use client'

import { useState } from 'react'

interface Point {
  x: number
  y: number
  label: 0 | 1
}

export function VCDimensionDemo() {
  const [numPoints, setNumPoints] = useState(3)
  const [points, setPoints] = useState<Point[]>([
    { x: 150, y: 200, label: 0 },
    { x: 300, y: 100, label: 0 },
    { x: 450, y: 200, label: 0 }
  ])
  const [canShatter, setCanShatter] = useState(true)

  // Check if linear classifier can shatter the points
  const checkShatter = (pts: Point[]) => {
    if (pts.length > 3) {
      setCanShatter(false)
      return
    }

    // For 3 or fewer points, check specific configurations
    if (pts.length === 3) {
      // Check if points are collinear
      const [p1, p2, p3] = pts
      const area = Math.abs(
        (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)
      )

      if (area < 10) {
        // Collinear points - XOR pattern not achievable
        const xorLabels = pts.filter(p => p.label === 1).length
        setCanShatter(xorLabels === 0 || xorLabels === 3)
      } else {
        // Non-collinear - can shatter
        setCanShatter(true)
      }
    } else {
      setCanShatter(true)
    }
  }

  // Toggle point label
  const togglePointLabel = (index: number) => {
    const newPoints = [...points]
    newPoints[index].label = newPoints[index].label === 0 ? 1 : 0
    setPoints(newPoints)
    checkShatter(newPoints)
  }

  // Reset to default configuration
  const resetPoints = () => {
    const defaultPoints: Point[] = []
    if (numPoints === 2) {
      defaultPoints.push({ x: 200, y: 200, label: 0 })
      defaultPoints.push({ x: 400, y: 200, label: 0 })
    } else if (numPoints === 3) {
      defaultPoints.push({ x: 150, y: 250, label: 0 })
      defaultPoints.push({ x: 300, y: 100, label: 0 })
      defaultPoints.push({ x: 450, y: 250, label: 0 })
    } else {
      // 4 points in XOR configuration
      defaultPoints.push({ x: 200, y: 150, label: 0 })
      defaultPoints.push({ x: 400, y: 150, label: 1 })
      defaultPoints.push({ x: 200, y: 250, label: 1 })
      defaultPoints.push({ x: 400, y: 250, label: 0 })
    }
    setPoints(defaultPoints)
    checkShatter(defaultPoints)
  }

  // Count possible labelings
  const totalLabelings = Math.pow(2, numPoints)
  const achievedLabelings = canShatter ? totalLabelings : totalLabelings - 1

  return (
    <div className="space-y-6">
      {/* Interactive Canvas */}
      <div className="bg-ml-bg-card border-2 border-ml-purple/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-purple mb-4">二维线性分类器的VC维</h3>

        <svg width="600" height="400" className="bg-ml-bg-dark rounded-lg">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1f2e" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#grid)" />

          {/* Draw points */}
          {points.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={point.x}
                cy={point.y}
                r="20"
                fill={point.label === 0 ? '#FF3366' : '#00D9FF'}
                stroke="#FFD700"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:r-25"
                onClick={() => togglePointLabel(idx)}
              />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dy=".3em"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
                pointerEvents="none"
              >
                {point.label}
              </text>
            </g>
          ))}

          {/* Try to draw separating line (if possible) */}
          {canShatter && numPoints <= 3 && (
            <line
              x1="50"
              y1="350"
              x2="550"
              y2="50"
              stroke="#00FF88"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          )}

          {/* Instruction text */}
          <text x="300" y="30" textAnchor="middle" fill="#gray" fontSize="14">
            点击圆圈切换标签
          </text>
        </svg>
      </div>

      {/* Number of points selector */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
        <label className="block text-sm font-bold text-white mb-3">
          点的数量: {numPoints}
        </label>
        <input
          type="range"
          min="2"
          max="4"
          value={numPoints}
          onChange={(e) => {
            const newNum = Number(e.target.value)
            setNumPoints(newNum)
            resetPoints()
          }}
          className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-purple"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>2</span>
          <span>3 (VC维)</span>
          <span>4</span>
        </div>
      </div>

      {/* Shatter status */}
      <div className={`rounded-xl p-6 border-2 ${
        canShatter
          ? 'bg-ml-green/10 border-ml-green'
          : 'bg-ml-red/10 border-ml-red'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">
            {canShatter ? '✓' : '✗'}
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${
              canShatter ? 'text-ml-green' : 'text-ml-red'
            }`}>
              {canShatter ? '可以打散！' : '无法打散'}
            </h3>
            <p className="text-sm text-gray-100">
              {canShatter
                ? '线性分类器可以实现所有可能的标记组合'
                : '存在某些标记组合无法被线性分类器分开'
              }
            </p>
          </div>
        </div>

        <div className="bg-ml-bg-dark rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">可能的标记</div>
              <div className="text-2xl font-bold text-white">{totalLabelings}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">可实现的标记</div>
              <div className={`text-2xl font-bold ${
                canShatter ? 'text-ml-green' : 'text-ml-red'
              }`}>
                {achievedLabelings}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VC dimension explanation */}
      <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-purple/10 border border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-cyan mb-4">💡 VC维定义</h3>

        <div className="space-y-4 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-ml-yellow font-bold mb-2">什么是"打散"？</h4>
            <p className="mb-2">
              如果假设空间ℋ能够实现数据集上所有可能的标记（2<sup>m</sup>种），
              则称ℋ能够<strong className="text-white">打散（Shatter）</strong>该数据集。
            </p>
            <p className="text-xs">
              例如：3个点有8种可能的标记组合，如果都能被线性分类器正确分类，则可打散。
            </p>
          </div>

          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-ml-purple font-bold mb-2">VC维是什么？</h4>
            <p className="mb-2">
              <strong className="text-white">VC维（Vapnik-Chervonenkis Dimension）</strong>
              是假设空间能打散的最大数据集大小。
            </p>
            <div className="font-mono text-center text-white py-2">
              VC(ℋ) = max{'{m: ℋ能打散某个大小为m的数据集}'}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
              <h5 className="text-ml-green font-bold mb-2">✓ 二维线性分类器</h5>
              <ul className="text-xs space-y-1">
                <li>• VC维 = 3</li>
                <li>• 可以打散任意3个点（非共线）</li>
                <li>• 无法打散某些4个点配置（如XOR）</li>
              </ul>
            </div>

            <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-3">
              <h5 className="text-ml-cyan font-bold mb-2">📐 一般规律</h5>
              <ul className="text-xs space-y-1">
                <li>• d维空间线性分类器：VC维 = d + 1</li>
                <li>• VC维越大，表达能力越强</li>
                <li>• 但也越容易过拟合</li>
              </ul>
            </div>
          </div>

          <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-3">
            <h5 className="text-ml-yellow font-bold mb-2">🎯 VC维的意义</h5>
            <p className="text-xs">
              VC维提供了学习算法泛化能力的理论保证。样本复杂度与VC维成正比：
              模型越复杂（VC维越大），需要的训练样本越多才能保证泛化性能。
            </p>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetPoints}
        className="w-full px-4 py-2 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors"
      >
        🔄 重置点配置
      </button>
    </div>
  )
}
