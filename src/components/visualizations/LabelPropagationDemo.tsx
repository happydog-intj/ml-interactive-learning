'use client'

import { useState, useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  label: number | null  // null = unlabeled
  originalLabel: number | null
  probability: number[]  // probability distribution over labels
  isLabeled: boolean
}

interface Edge {
  from: number
  to: number
  weight: number
}

export function LabelPropagationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [iteration, setIteration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [converged, setConverged] = useState(false)
  const [alpha, setAlpha] = useState(0.8)  // Label spreading parameter

  const WIDTH = 600
  const HEIGHT = 400
  const NUM_NODES = 40
  const K_NEIGHBORS = 5

  // Generate data
  const generateData = () => {
    const newNodes: Node[] = []

    // Generate two clusters
    for (let i = 0; i < NUM_NODES; i++) {
      let x, y
      const cluster = i < NUM_NODES / 2 ? 0 : 1

      if (cluster === 0) {
        // Cluster 0: bottom-left
        x = 100 + Math.random() * 200
        y = 250 + Math.random() * 100
      } else {
        // Cluster 1: top-right
        x = 300 + Math.random() * 200
        y = 50 + Math.random() * 150
      }

      // Only label a few nodes (10%)
      const isLabeled = Math.random() < 0.1

      newNodes.push({
        x,
        y,
        label: isLabeled ? cluster : null,
        originalLabel: cluster,
        probability: isLabeled ? (cluster === 0 ? [1, 0] : [0, 1]) : [0.5, 0.5],
        isLabeled
      })
    }

    setNodes(newNodes)

    // Build k-NN graph
    const newEdges: Edge[] = []
    newNodes.forEach((node, i) => {
      // Find k nearest neighbors
      const distances = newNodes.map((other, j) => ({
        index: j,
        dist: Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2)
      }))
      .filter(d => d.index !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, K_NEIGHBORS)

      distances.forEach(({ index, dist }) => {
        // Gaussian similarity
        const sigma = 50
        const weight = Math.exp(-(dist ** 2) / (2 * sigma ** 2))
        newEdges.push({ from: i, to: index, weight })
      })
    })

    setEdges(newEdges)
    setIteration(0)
    setConverged(false)
  }

  // One iteration of label propagation
  const propagateLabels = () => {
    if (converged) return

    const newNodes = [...nodes]
    let hasChanged = false

    newNodes.forEach((node, i) => {
      if (node.isLabeled) return  // Skip labeled nodes

      // Get neighbors
      const neighbors = edges
        .filter(e => e.from === i)
        .map(e => ({ node: nodes[e.to], weight: e.weight }))

      if (neighbors.length === 0) return

      // Weighted average of neighbor labels
      const newProb = [0, 0]
      let totalWeight = 0

      neighbors.forEach(({ node: neighbor, weight }) => {
        newProb[0] += weight * neighbor.probability[0]
        newProb[1] += weight * neighbor.probability[1]
        totalWeight += weight
      })

      if (totalWeight > 0) {
        newProb[0] /= totalWeight
        newProb[1] /= totalWeight

        // Label spreading: mix with initial labels
        if (alpha < 1) {
          newProb[0] = alpha * newProb[0] + (1 - alpha) * 0.5
          newProb[1] = alpha * newProb[1] + (1 - alpha) * 0.5
        }

        // Check for change
        if (Math.abs(newProb[0] - node.probability[0]) > 0.01) {
          hasChanged = true
        }

        node.probability = newProb
        node.label = newProb[0] > newProb[1] ? 0 : 1
      }
    })

    setNodes(newNodes)
    setIteration(i => i + 1)

    if (!hasChanged) {
      setConverged(true)
      setIsRunning(false)
    }
  }

  // Auto-run effect
  useEffect(() => {
    if (isRunning && !converged) {
      const timer = setTimeout(propagateLabels, 300)
      return () => clearTimeout(timer)
    }
  }, [isRunning, converged, iteration])

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.fillStyle = '#0a0e1a'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Draw edges
    ctx.strokeStyle = '#1a1f2e'
    ctx.lineWidth = 1
    edges.forEach(edge => {
      const from = nodes[edge.from]
      const to = nodes[edge.to]

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.globalAlpha = edge.weight * 0.3
      ctx.stroke()
      ctx.globalAlpha = 1
    })

    // Draw nodes
    nodes.forEach(node => {
      // Color based on probability
      const prob0 = node.probability[0]
      const prob1 = node.probability[1]

      let color
      if (prob0 > prob1) {
        const intensity = prob0
        color = `rgba(255, 51, 102, ${intensity})`  // Red
      } else {
        const intensity = prob1
        color = `rgba(0, 217, 255, ${intensity})`  // Cyan
      }

      ctx.beginPath()
      ctx.arc(node.x, node.y, node.isLabeled ? 8 : 5, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      if (node.isLabeled) {
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

  }, [nodes, edges])

  // Initialize on mount
  useEffect(() => {
    generateData()
  }, [])

  // Calculate accuracy
  const accuracy = nodes.length > 0
    ? (nodes.filter(n => n.label === n.originalLabel).length / nodes.length * 100).toFixed(1)
    : '0'

  const numLabeled = nodes.filter(n => n.isLabeled).length

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">迭代次数</div>
          <div className="text-3xl font-bold text-ml-cyan">{iteration}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">标记样本</div>
          <div className="text-3xl font-bold text-ml-yellow">{numLabeled}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">未标记样本</div>
          <div className="text-3xl font-bold text-ml-purple">{NUM_NODES - numLabeled}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">准确率</div>
          <div className="text-3xl font-bold text-ml-green">{accuracy}%</div>
        </div>
      </div>

      {/* Alpha parameter */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
        <label className="block text-sm font-bold text-white mb-3">
          平滑参数 α: {alpha.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={alpha}
          onChange={(e) => {
            setAlpha(Number(e.target.value))
            generateData()
          }}
          className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-cyan"
          disabled={isRunning}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>标签传播 (α=1)</span>
          <span>标签扩散 (α&lt;1)</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateData}
          className="px-4 py-2 bg-ml-bg-card border border-ml-border text-white rounded-lg hover:border-ml-cyan transition-colors"
          disabled={isRunning}
        >
          🔄 重新生成数据
        </button>

        <button
          onClick={propagateLabels}
          className="px-4 py-2 bg-ml-cyan text-ml-bg-dark font-bold rounded-lg hover:bg-ml-cyan/80 transition-colors disabled:opacity-50"
          disabled={isRunning || converged}
        >
          ▶️ 单步传播
        </button>

        <button
          onClick={() => setIsRunning(true)}
          className="px-6 py-2 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors disabled:opacity-50"
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
      <div className="bg-gradient-to-r from-ml-red/10 to-ml-cyan/10 border border-ml-border rounded-xl p-4">
        <h4 className="text-sm font-bold text-white mb-3">图例说明</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-ml-red border-2 border-ml-yellow"></div>
            <span>标记样本（类别0）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-ml-cyan border-2 border-ml-yellow"></div>
            <span>标记样本（类别1）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 border border-white"></div>
            <span>未标记样本</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          颜色深浅表示预测置信度，连线表示k近邻关系
        </p>
      </div>

      {/* Algorithm explanation */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-yellow mb-3">💡 标签传播算法</h4>

        <div className="space-y-3 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-3">
            <h5 className="text-white font-bold mb-2">Label Propagation (α=1)</h5>
            <p className="text-xs">
              每个未标记样本的标签由其邻居标签的加权平均决定，标记样本的标签保持不变。
            </p>
            <div className="font-mono text-xs mt-2 text-center">
              y<sub>i</sub><sup>(t+1)</sup> = Σ<sub>j</sub> w<sub>ij</sub>y<sub>j</sub><sup>(t)</sup> / Σ<sub>j</sub> w<sub>ij</sub>
            </div>
          </div>

          <div className="bg-ml-bg-dark rounded-lg p-3">
            <h5 className="text-white font-bold mb-2">Label Spreading (α&lt;1)</h5>
            <p className="text-xs">
              允许标记样本的标签也参与更新（软钳制），增强算法鲁棒性。
            </p>
            <div className="font-mono text-xs mt-2 text-center">
              Y<sup>(t+1)</sup> = αSY<sup>(t)</sup> + (1-α)Y<sup>(0)</sup>
            </div>
          </div>

          <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-3">
            <h5 className="text-ml-cyan font-bold mb-2">核心思想</h5>
            <ul className="space-y-1 text-xs">
              <li>• <strong className="text-white">平滑假设</strong>：相近的样本倾向于有相同标签</li>
              <li>• <strong className="text-white">聚类假设</strong>：同一簇内的样本属于同一类</li>
              <li>• <strong className="text-white">流形假设</strong>：数据分布在低维流形上</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
