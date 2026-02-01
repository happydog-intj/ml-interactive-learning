'use client'

import { useState, useEffect, useRef } from 'react'

interface Point3D {
  x: number
  y: number
  z: number
}

export function PCAVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data3D, setData3D] = useState<Point3D[]>([])
  const [mean, setMean] = useState<Point3D>({ x: 0, y: 0, z: 0 })
  const [pc1, setPc1] = useState<Point3D>({ x: 1, y: 0, z: 0 })
  const [pc2, setPc2] = useState<Point3D>({ x: 0, y: 1, z: 0 })
  const [rotationX, setRotationX] = useState(0.3)
  const [rotationY, setRotationY] = useState(0.3)
  const [showPCs, setShowPCs] = useState(true)
  const [showProjections, setShowProjections] = useState(false)
  const [variance, setVariance] = useState<number[]>([0, 0, 0])

  const WIDTH = 600
  const HEIGHT = 400
  const SCALE = 80

  // Generate 3D data with variance mainly along one direction
  const generateData = () => {
    const points: Point3D[] = []
    const n = 50

    for (let i = 0; i < n; i++) {
      // Generate data along a diagonal direction with noise
      const t = (Math.random() - 0.5) * 4
      points.push({
        x: t + (Math.random() - 0.5) * 0.5,
        y: t * 0.7 + (Math.random() - 0.5) * 0.3,
        z: t * 0.4 + (Math.random() - 0.5) * 0.2
      })
    }

    setData3D(points)

    // Calculate mean
    const meanX = points.reduce((sum, p) => sum + p.x, 0) / n
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / n
    const meanZ = points.reduce((sum, p) => sum + p.z, 0) / n
    setMean({ x: meanX, y: meanY, z: meanZ })

    // Center the data
    const centered = points.map(p => ({
      x: p.x - meanX,
      y: p.y - meanY,
      z: p.z - meanZ
    }))

    // Calculate covariance matrix (simplified)
    let cxx = 0, cyy = 0, czz = 0, cxy = 0, cxz = 0, cyz = 0
    centered.forEach(p => {
      cxx += p.x * p.x
      cyy += p.y * p.y
      czz += p.z * p.z
      cxy += p.x * p.y
      cxz += p.x * p.z
      cyz += p.y * p.z
    })
    cxx /= n; cyy /= n; czz /= n; cxy /= n; cxz /= n; cyz /= n

    // Simplified: use the direction of maximum variance
    // In a real PCA, we'd do eigenvalue decomposition
    // Here we approximate for visualization
    const totalVar = cxx + cyy + czz

    // First PC: direction of maximum spread
    const len1 = Math.sqrt(cxx + cyy + czz)
    setPc1({
      x: Math.sqrt(cxx) / len1,
      y: Math.sqrt(cyy) / len1,
      z: Math.sqrt(czz) / len1
    })

    // Second PC: orthogonal to first
    setPc2({
      x: -Math.sqrt(cyy) / len1,
      y: Math.sqrt(cxx) / len1,
      z: 0
    })

    setVariance([
      cxx / totalVar * 100,
      cyy / totalVar * 100,
      czz / totalVar * 100
    ])
  }

  // 3D to 2D projection
  const project3D = (point: Point3D, offsetX = WIDTH / 2, offsetY = HEIGHT / 2) => {
    // Simple perspective projection with rotation
    const cosX = Math.cos(rotationX)
    const sinX = Math.sin(rotationX)
    const cosY = Math.cos(rotationY)
    const sinY = Math.sin(rotationY)

    // Rotate around Y axis
    let x = point.x * cosY - point.z * sinY
    let z = point.x * sinY + point.z * cosY
    let y = point.y

    // Rotate around X axis
    const y2 = y * cosX - z * sinX
    const z2 = y * sinX + z * cosX

    // Perspective projection
    const perspective = 1 - z2 / 10
    const screenX = x * SCALE * perspective + offsetX
    const screenY = -y2 * SCALE * perspective + offsetY

    return { x: screenX, y: screenY, z: z2 }
  }

  // Project point onto PC1 (2D for simplicity)
  const projectOntoPC1 = (point: Point3D) => {
    const centered = {
      x: point.x - mean.x,
      y: point.y - mean.y,
      z: point.z - mean.z
    }

    // Dot product with PC1
    const t = centered.x * pc1.x + centered.y * pc1.y + centered.z * pc1.z

    return {
      x: mean.x + t * pc1.x,
      y: mean.y + t * pc1.y,
      z: mean.z + t * pc1.z
    }
  }

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data3D.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.fillStyle = '#0a0e1a'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Draw axes
    const origin = project3D({ x: 0, y: 0, z: 0 })
    const xAxis = project3D({ x: 2, y: 0, z: 0 })
    const yAxis = project3D({ x: 0, y: 2, z: 0 })
    const zAxis = project3D({ x: 0, y: 0, z: 2 })

    ctx.strokeStyle = '#ff336633'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(xAxis.x, xAxis.y)
    ctx.stroke()

    ctx.strokeStyle = '#00ff8833'
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(yAxis.x, yAxis.y)
    ctx.stroke()

    ctx.strokeStyle = '#00d9ff33'
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(zAxis.x, zAxis.y)
    ctx.stroke()

    // Draw principal components
    if (showPCs) {
      const pc1Start = project3D({
        x: mean.x - pc1.x * 2,
        y: mean.y - pc1.y * 2,
        z: mean.z - pc1.z * 2
      })
      const pc1End = project3D({
        x: mean.x + pc1.x * 2,
        y: mean.y + pc1.y * 2,
        z: mean.z + pc1.z * 2
      })

      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(pc1Start.x, pc1Start.y)
      ctx.lineTo(pc1End.x, pc1End.y)
      ctx.stroke()

      // Arrow head for PC1
      const angle1 = Math.atan2(pc1End.y - pc1Start.y, pc1End.x - pc1Start.x)
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(pc1End.x, pc1End.y)
      ctx.lineTo(
        pc1End.x - 10 * Math.cos(angle1 - Math.PI / 6),
        pc1End.y - 10 * Math.sin(angle1 - Math.PI / 6)
      )
      ctx.lineTo(
        pc1End.x - 10 * Math.cos(angle1 + Math.PI / 6),
        pc1End.y - 10 * Math.sin(angle1 + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fill()

      // PC2
      const pc2Start = project3D({
        x: mean.x - pc2.x * 1.5,
        y: mean.y - pc2.y * 1.5,
        z: mean.z - pc2.z * 1.5
      })
      const pc2End = project3D({
        x: mean.x + pc2.x * 1.5,
        y: mean.y + pc2.y * 1.5,
        z: mean.z + pc2.z * 1.5
      })

      ctx.strokeStyle = '#B84CFF'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(pc2Start.x, pc2Start.y)
      ctx.lineTo(pc2End.x, pc2End.y)
      ctx.stroke()
    }

    // Sort points by z for proper occlusion
    const projectedPoints = data3D.map(p => ({
      original: p,
      projected: project3D(p),
      projOnPC1: showProjections ? projectOntoPC1(p) : null
    })).sort((a, b) => a.projected.z - b.projected.z)

    // Draw projections
    if (showProjections) {
      projectedPoints.forEach(({ original, projected, projOnPC1 }) => {
        if (!projOnPC1) return
        const projPoint = project3D(projOnPC1)

        ctx.strokeStyle = '#FFD70033'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(projected.x, projected.y)
        ctx.lineTo(projPoint.x, projPoint.y)
        ctx.stroke()
        ctx.setLineDash([])

        // Projected point
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(projPoint.x, projPoint.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw data points
    projectedPoints.forEach(({ projected }) => {
      const brightness = (projected.z + 5) / 10
      ctx.fillStyle = `rgba(0, 217, 255, ${brightness})`
      ctx.beginPath()
      ctx.arc(projected.x, projected.y, 4, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
    })

  }, [data3D, rotationX, rotationY, showPCs, showProjections, mean, pc1, pc2])

  useEffect(() => {
    generateData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="rounded-lg"
          />
        </div>

        {/* Rotation controls */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              水平旋转: {(rotationY * 180 / Math.PI).toFixed(0)}°
            </label>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.01"
              value={rotationY}
              onChange={(e) => setRotationY(Number(e.target.value))}
              className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-cyan"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              垂直旋转: {(rotationX * 180 / Math.PI).toFixed(0)}°
            </label>
            <input
              type="range"
              min={-Math.PI / 2}
              max={Math.PI / 2}
              step="0.01"
              value={rotationX}
              onChange={(e) => setRotationX(Number(e.target.value))}
              className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-purple"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <button
            onClick={generateData}
            className="w-full px-4 py-2 bg-ml-cyan text-ml-bg-dark font-bold rounded-lg hover:bg-ml-cyan/80 transition-colors"
          >
            🔄 重新生成数据
          </button>
        </div>

        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showPCs}
              onChange={(e) => setShowPCs(e.target.checked)}
              className="w-5 h-5 accent-ml-yellow"
            />
            <span className="text-white font-bold">显示主成分</span>
          </label>
        </div>

        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showProjections}
              onChange={(e) => setShowProjections(e.target.checked)}
              className="w-5 h-5 accent-ml-purple"
            />
            <span className="text-white font-bold">显示投影</span>
          </label>
        </div>
      </div>

      {/* Variance explained */}
      <div className="bg-gradient-to-r from-ml-yellow/10 to-ml-purple/10 border border-ml-yellow/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-yellow mb-4">方差解释比例</h3>

        <div className="space-y-3">
          {['X方向', 'Y方向', 'Z方向'].map((label, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">{label}</span>
                <span className="text-ml-cyan font-bold">{variance[idx].toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-ml-bg-dark rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ml-cyan to-ml-blue transition-all duration-500"
                  style={{ width: `${variance[idx]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-ml-border">
          <div className="flex justify-between text-sm">
            <span className="text-gray-100">第一主成分（PC1）解释：</span>
            <span className="text-ml-yellow font-bold">{variance[0].toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
        <h4 className="text-sm font-bold text-white mb-3">图例</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ml-cyan border border-white"></div>
            <span>原始数据点</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-ml-yellow"></div>
            <span>第一主成分（PC1）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-ml-purple"></div>
            <span>第二主成分（PC2）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ml-yellow"></div>
            <span>投影点</span>
          </div>
        </div>
      </div>

      {/* Algorithm explanation */}
      <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-cyan mb-3">💡 PCA原理</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-100">
          <li><strong className="text-white">中心化</strong>：将数据平移使均值为0</li>
          <li><strong className="text-white">计算协方差矩阵</strong>：衡量特征间的相关性</li>
          <li><strong className="text-white">特征值分解</strong>：找到方差最大的方向（主成分）</li>
          <li><strong className="text-white">选择主成分</strong>：保留前k个最大特征值对应的特征向量</li>
          <li><strong className="text-white">投影</strong>：将数据投影到主成分构成的子空间</li>
        </ol>
        <p className="text-sm text-gray-100 mt-3">
          <strong className="text-white">目标</strong>：在降低维度的同时最大化保留数据的方差（信息量）
        </p>
      </div>
    </div>
  )
}
