'use client'

import { useState, useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  cluster: number
}

interface Centroid {
  x: number
  y: number
}

const COLORS = ['#00D9FF', '#00FF88', '#B84CFF', '#FF8A00', '#FF3366', '#FFD700']

export function KMeansVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [k, setK] = useState(3)
  const [points, setPoints] = useState<Point[]>([])
  const [centroids, setCentroids] = useState<Centroid[]>([])
  const [iteration, setIteration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [converged, setConverged] = useState(false)
  const [inertia, setInertia] = useState(0)

  const WIDTH = 600
  const HEIGHT = 400
  const PADDING = 40

  // Initialize random points
  const initializePoints = () => {
    const newPoints: Point[] = []
    const numPoints = 100

    // Generate points in 3 natural clusters
    for (let i = 0; i < numPoints; i++) {
      let x, y
      const cluster = i % 3

      if (cluster === 0) {
        x = 150 + Math.random() * 100
        y = 150 + Math.random() * 100
      } else if (cluster === 1) {
        x = 350 + Math.random() * 100
        y = 150 + Math.random() * 100
      } else {
        x = 250 + Math.random() * 100
        y = 250 + Math.random() * 100
      }

      newPoints.push({
        x: Math.max(PADDING, Math.min(WIDTH - PADDING, x)),
        y: Math.max(PADDING, Math.min(HEIGHT - PADDING, y)),
        cluster: -1
      })
    }

    setPoints(newPoints)
    setCentroids([])
    setIteration(0)
    setConverged(false)
    setIsRunning(false)
    setInertia(0)
  }

  // Initialize centroids randomly
  const initializeCentroids = () => {
    if (points.length === 0) return

    const newCentroids: Centroid[] = []
    const usedIndices = new Set<number>()

    // K-means++ initialization
    // First centroid is random
    const firstIdx = Math.floor(Math.random() * points.length)
    newCentroids.push({ x: points[firstIdx].x, y: points[firstIdx].y })
    usedIndices.add(firstIdx)

    // Subsequent centroids chosen with probability proportional to distance squared
    for (let i = 1; i < k; i++) {
      const distances = points.map(p => {
        const minDist = Math.min(...newCentroids.map(c =>
          Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2)
        ))
        return minDist ** 2
      })

      const totalDist = distances.reduce((a, b) => a + b, 0)
      let random = Math.random() * totalDist

      for (let j = 0; j < points.length; j++) {
        if (usedIndices.has(j)) continue
        random -= distances[j]
        if (random <= 0) {
          newCentroids.push({ x: points[j].x, y: points[j].y })
          usedIndices.add(j)
          break
        }
      }
    }

    setCentroids(newCentroids)
    setIteration(0)
    setConverged(false)
  }

  // Calculate distance between two points
  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
  }

  // Assign points to nearest centroid
  const assignClusters = () => {
    const newPoints = points.map(point => {
      let minDist = Infinity
      let closestCluster = 0

      centroids.forEach((centroid, idx) => {
        const dist = distance(point, centroid)
        if (dist < minDist) {
          minDist = dist
          closestCluster = idx
        }
      })

      return { ...point, cluster: closestCluster }
    })

    setPoints(newPoints)
  }

  // Update centroids to cluster means
  const updateCentroids = () => {
    const newCentroids: Centroid[] = []

    for (let i = 0; i < k; i++) {
      const clusterPoints = points.filter(p => p.cluster === i)

      if (clusterPoints.length === 0) {
        // Keep old centroid if no points assigned
        newCentroids.push(centroids[i])
      } else {
        const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0)
        const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0)
        newCentroids.push({
          x: sumX / clusterPoints.length,
          y: sumY / clusterPoints.length
        })
      }
    }

    // Check convergence
    const moved = centroids.some((old, idx) =>
      distance(old, newCentroids[idx]) > 0.1
    )

    setCentroids(newCentroids)
    setConverged(!moved)

    // Calculate inertia (sum of squared distances to nearest centroid)
    const newInertia = points.reduce((sum, point) => {
      const centroid = newCentroids[point.cluster]
      if (!centroid) return sum
      return sum + distance(point, centroid) ** 2
    }, 0)
    setInertia(newInertia)

    return !moved
  }

  // Single iteration step
  const step = () => {
    if (centroids.length === 0) {
      initializeCentroids()
      return
    }

    if (!converged) {
      assignClusters()
      setTimeout(() => {
        const hasConverged = updateCentroids()
        setIteration(i => i + 1)
        if (hasConverged) {
          setIsRunning(false)
        }
      }, 300)
    }
  }

  // Run until convergence
  const runToConvergence = () => {
    if (centroids.length === 0) {
      initializeCentroids()
    }
    setIsRunning(true)
  }

  // Auto-run effect
  useEffect(() => {
    if (isRunning && !converged) {
      const timer = setTimeout(step, 600)
      return () => clearTimeout(timer)
    }
  }, [isRunning, converged, iteration])

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0a0e1a'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Draw grid
    ctx.strokeStyle = '#1a1f2e'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = PADDING + (i * (WIDTH - 2 * PADDING)) / 10
      const y = PADDING + (i * (HEIGHT - 2 * PADDING)) / 10

      ctx.beginPath()
      ctx.moveTo(x, PADDING)
      ctx.lineTo(x, HEIGHT - PADDING)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(PADDING, y)
      ctx.lineTo(WIDTH - PADDING, y)
      ctx.stroke()
    }

    // Draw points
    points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)

      if (point.cluster >= 0 && point.cluster < COLORS.length) {
        ctx.fillStyle = COLORS[point.cluster]
      } else {
        ctx.fillStyle = '#666'
      }

      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw centroids
    centroids.forEach((centroid, idx) => {
      // Draw lines from centroid to its points
      ctx.strokeStyle = COLORS[idx] + '20'
      ctx.lineWidth = 1
      points.filter(p => p.cluster === idx).forEach(point => {
        ctx.beginPath()
        ctx.moveTo(centroid.x, centroid.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
      })

      // Draw centroid
      ctx.beginPath()
      ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI)
      ctx.fillStyle = COLORS[idx]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw X mark
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centroid.x - 4, centroid.y - 4)
      ctx.lineTo(centroid.x + 4, centroid.y + 4)
      ctx.moveTo(centroid.x + 4, centroid.y - 4)
      ctx.lineTo(centroid.x - 4, centroid.y + 4)
      ctx.stroke()
    })
  }, [points, centroids])

  // Initialize on mount
  useEffect(() => {
    initializePoints()
  }, [])

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-ml-bg-card border-2 border-ml-border rounded-xl p-6">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* K Parameter */}
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-3">
            簇数量 (K): {k}
          </label>
          <input
            type="range"
            min="2"
            max="6"
            value={k}
            onChange={(e) => {
              setK(Number(e.target.value))
              setCentroids([])
              setIteration(0)
              setConverged(false)
            }}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-cyan"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2</span>
            <span>6</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">迭代次数</div>
              <div className="text-2xl font-bold text-ml-cyan">{iteration}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">簇内平方和</div>
              <div className="text-2xl font-bold text-ml-purple">
                {inertia > 0 ? Math.round(inertia) : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={initializePoints}
          className="px-4 py-2 bg-ml-bg-card border border-ml-border text-white rounded-lg hover:border-ml-cyan transition-colors"
          disabled={isRunning}
        >
          🔄 重置数据
        </button>

        <button
          onClick={initializeCentroids}
          className="px-4 py-2 bg-ml-bg-card border border-ml-border text-white rounded-lg hover:border-ml-purple transition-colors"
          disabled={isRunning || points.length === 0}
        >
          🎯 初始化质心
        </button>

        <button
          onClick={step}
          className="px-4 py-2 bg-ml-cyan text-ml-bg-dark font-bold rounded-lg hover:bg-ml-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRunning || converged || centroids.length === 0}
        >
          ▶️ 单步执行
        </button>

        <button
          onClick={runToConvergence}
          className="px-4 py-2 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRunning || converged}
        >
          ⚡ 运行至收敛
        </button>

        {converged && (
          <div className="px-4 py-2 bg-ml-green/10 border border-ml-green/30 text-ml-green rounded-lg font-bold">
            ✓ 已收敛
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-cyan mb-3">图例说明</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ml-cyan border border-white"></div>
            <span>数据点（按簇着色）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-ml-purple border-2 border-white flex items-center justify-center text-white text-xs">✕</div>
            <span>质心（簇中心）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-ml-cyan/20"></div>
            <span>点到质心的距离</span>
          </div>
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-yellow mb-3">💡 K-means算法步骤</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-100">
          <li><strong className="text-white">初始化</strong>：随机选择K个点作为初始质心（使用K-means++改进初始化）</li>
          <li><strong className="text-white">分配</strong>：将每个点分配到最近的质心，形成K个簇</li>
          <li><strong className="text-white">更新</strong>：计算每个簇的均值，更新质心位置</li>
          <li><strong className="text-white">重复</strong>：重复步骤2-3直到质心不再移动（收敛）</li>
        </ol>
      </div>
    </div>
  )
}
