'use client'

import { useState, useEffect } from 'react'

interface NetworkNode {
  id: string
  layer: number
  index: number
  value: number
  gradient: number
  activated: boolean
}

interface Connection {
  from: string
  to: string
  weight: number
  gradient: number
  active: boolean
}

export function BackpropagationDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'forward' | 'backward' | 'update'>('idle')
  const [step, setStep] = useState(0)
  const [learningRate, setLearningRate] = useState(0.1)

  // Simple 2-2-1 network
  const [nodes, setNodes] = useState<NetworkNode[]>([
    // Input layer
    { id: 'i0', layer: 0, index: 0, value: 0.8, gradient: 0, activated: false },
    { id: 'i1', layer: 0, index: 1, value: 0.6, gradient: 0, activated: false },
    // Hidden layer
    { id: 'h0', layer: 1, index: 0, value: 0, gradient: 0, activated: false },
    { id: 'h1', layer: 1, index: 1, value: 0, gradient: 0, activated: false },
    // Output layer
    { id: 'o0', layer: 2, index: 0, value: 0, gradient: 0, activated: false },
  ])

  const [connections, setConnections] = useState<Connection[]>([
    { from: 'i0', to: 'h0', weight: 0.5, gradient: 0, active: false },
    { from: 'i0', to: 'h1', weight: -0.3, gradient: 0, active: false },
    { from: 'i1', to: 'h0', weight: 0.4, gradient: 0, active: false },
    { from: 'i1', to: 'h1', weight: 0.6, gradient: 0, active: false },
    { from: 'h0', to: 'o0', weight: 0.7, gradient: 0, active: false },
    { from: 'h1', to: 'o0', weight: -0.2, gradient: 0, active: false },
  ])

  const targetValue = 0.9

  // Activation function (sigmoid)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
  const sigmoidDerivative = (x: number) => {
    const s = sigmoid(x)
    return s * (1 - s)
  }

  // Reset network
  const resetNetwork = () => {
    setIsPlaying(false)
    setPhase('idle')
    setStep(0)
    setNodes(nodes.map(n => ({ ...n, gradient: 0, activated: false, value: n.layer === 0 ? n.value : 0 })))
    setConnections(connections.map(c => ({ ...c, gradient: 0, active: false })))
  }

  // Forward propagation
  const forwardPass = () => {
    const newNodes = [...nodes]
    const newConnections = [...connections]

    // Calculate hidden layer
    newConnections.forEach(conn => {
      if (conn.to.startsWith('h')) {
        conn.active = true
      }
    })

    newNodes.forEach(node => {
      if (node.layer === 1) { // Hidden layer
        const incomingConns = newConnections.filter(c => c.to === node.id)
        const sum = incomingConns.reduce((acc, conn) => {
          const fromNode = newNodes.find(n => n.id === conn.from)!
          return acc + fromNode.value * conn.weight
        }, 0)
        node.value = sigmoid(sum)
        node.activated = true
      }
    })

    // Calculate output layer
    setTimeout(() => {
      newConnections.forEach(conn => {
        if (conn.to.startsWith('o')) {
          conn.active = true
        }
      })

      newNodes.forEach(node => {
        if (node.layer === 2) { // Output layer
          const incomingConns = newConnections.filter(c => c.to === node.id)
          const sum = incomingConns.reduce((acc, conn) => {
            const fromNode = newNodes.find(n => n.id === conn.from)!
            return acc + fromNode.value * conn.weight
          }, 0)
          node.value = sigmoid(sum)
          node.activated = true
        }
      })

      setNodes(newNodes)
      setConnections(newConnections)
    }, 500)
  }

  // Backward propagation
  const backwardPass = () => {
    const newNodes = [...nodes]
    const newConnections = [...connections]

    // Output layer gradient
    const outputNode = newNodes.find(n => n.layer === 2)!
    const error = outputNode.value - targetValue
    outputNode.gradient = error * sigmoidDerivative(outputNode.value)

    // Hidden to output connection gradients
    newConnections.forEach(conn => {
      if (conn.to === outputNode.id) {
        const fromNode = newNodes.find(n => n.id === conn.from)!
        conn.gradient = outputNode.gradient * fromNode.value
        conn.active = true
      }
    })

    setTimeout(() => {
      // Hidden layer gradients
      newNodes.forEach(node => {
        if (node.layer === 1) {
          const outgoingConns = newConnections.filter(c => c.from === node.id)
          const gradientSum = outgoingConns.reduce((acc, conn) => {
            const toNode = newNodes.find(n => n.id === conn.to)!
            return acc + toNode.gradient * conn.weight
          }, 0)
          node.gradient = gradientSum * sigmoidDerivative(node.value)
        }
      })

      // Input to hidden connection gradients
      newConnections.forEach(conn => {
        if (conn.to.startsWith('h')) {
          const fromNode = newNodes.find(n => n.id === conn.from)!
          const toNode = newNodes.find(n => n.id === conn.to)!
          conn.gradient = toNode.gradient * fromNode.value
          conn.active = true
        }
      })

      setNodes(newNodes)
      setConnections(newConnections)
    }, 500)
  }

  // Weight update
  const updateWeights = () => {
    const newConnections = connections.map(conn => ({
      ...conn,
      weight: conn.weight - learningRate * conn.gradient,
      active: true
    }))
    setConnections(newConnections)
  }

  // Animation control
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (phase === 'idle') {
        setPhase('forward')
        forwardPass()
      } else if (phase === 'forward') {
        setPhase('backward')
        backwardPass()
      } else if (phase === 'backward') {
        setPhase('update')
        updateWeights()
      } else if (phase === 'update') {
        setPhase('idle')
        setIsPlaying(false)
        setStep(step + 1)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [isPlaying, phase])

  const startAnimation = () => {
    resetNetwork()
    setIsPlaying(true)
  }

  // Node positioning
  const getNodePosition = (node: NetworkNode) => {
    const layerX = [150, 400, 650]
    const x = layerX[node.layer]

    const layerSizes = [2, 2, 1]
    const layerSize = layerSizes[node.layer]
    const spacing = 300 / (layerSize + 1)
    const y = spacing * (node.index + 1) + 50

    return { x, y }
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={startAnimation}
              disabled={isPlaying}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                isPlaying
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-ml-purple to-ml-blue hover:from-ml-blue hover:to-ml-cyan shadow-lg hover:shadow-[0_0_30px_rgba(138,92,246,0.5)]'
              }`}
            >
              {isPlaying ? '训练中...' : '开始训练'}
            </button>

            <button
              onClick={resetNetwork}
              className="px-6 py-3 rounded-xl font-bold text-white bg-ml-bg-dark border border-ml-border hover:border-ml-cyan transition-all duration-300"
            >
              重置
            </button>
          </div>

          <div className="flex items-center gap-3 bg-ml-bg-dark rounded-xl px-6 py-3">
            <span className="text-white font-semibold">迭代次数:</span>
            <span className="text-3xl font-bold text-ml-cyan">{step}</span>
          </div>
        </div>

        {/* Learning Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-purple">学习率 (Learning Rate)</label>
            <span className="text-xl font-bold text-white bg-ml-purple/20 px-3 py-1 rounded-lg">
              {learningRate.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-purple"
            disabled={isPlaying}
          />
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: 'idle', label: '准备', icon: '⏸️', color: 'gray' },
          { key: 'forward', label: '前向传播', icon: '➡️', color: 'blue' },
          { key: 'backward', label: '反向传播', icon: '⬅️', color: 'orange' },
          { key: 'update', label: '权重更新', icon: '🔄', color: 'green' }
        ].map((p) => (
          <div
            key={p.key}
            className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
              phase === p.key
                ? `border-ml-${p.color} bg-ml-${p.color}/20 scale-105`
                : 'border-ml-border bg-ml-bg-card'
            }`}
          >
            <div className="text-3xl mb-2">{p.icon}</div>
            <div className={`font-bold ${phase === p.key ? 'text-white' : 'text-gray-100'}`}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      {/* Network Visualization */}
      <div className="bg-ml-bg-secondary rounded-xl p-8 border border-ml-border">
        <svg viewBox="0 0 800 450" className="w-full h-auto">
          <defs>
            <linearGradient id="nodeGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" />
            </linearGradient>
            <linearGradient id="nodeGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" />
              <stop offset="100%" stopColor="rgb(139, 92, 246)" />
            </linearGradient>
            <linearGradient id="nodeGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 146, 60)" />
              <stop offset="100%" stopColor="rgb(249, 115, 22)" />
            </linearGradient>
          </defs>

          {/* Connections */}
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.from)!
            const toNode = nodes.find(n => n.id === conn.to)!
            const fromPos = getNodePosition(fromNode)
            const toPos = getNodePosition(toNode)

            const isForward = phase === 'forward' && conn.active
            const isBackward = phase === 'backward' && conn.active

            return (
              <g key={`${conn.from}-${conn.to}`}>
                {/* Connection line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={isBackward ? 'rgb(251, 146, 60)' : isForward ? 'rgb(99, 102, 241)' : 'rgba(100, 100, 100, 0.3)'}
                  strokeWidth={conn.active ? '3' : '2'}
                  className={conn.active ? 'animate-pulse' : ''}
                />

                {/* Weight label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 10}
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  w={conn.weight.toFixed(2)}
                </text>

                {/* Gradient label (during backprop) */}
                {phase === 'backward' && conn.gradient !== 0 && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2 + 15}
                    fill="rgb(251, 146, 60)"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    ∇={conn.gradient.toFixed(3)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = getNodePosition(node)
            const gradientId = node.layer === 0 ? 'nodeGradBlue' :
                             node.layer === 1 ? 'nodeGradPurple' :
                             'nodeGradOrange'

            return (
              <g key={node.id}>
                {/* Glow effect for activated nodes */}
                {node.activated && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    fill={`url(#${gradientId})`}
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={`url(#${gradientId})`}
                  stroke="white"
                  strokeWidth="2.5"
                />

                {/* Node value */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {node.value.toFixed(2)}
                </text>

                {/* Gradient (during backprop) */}
                {phase === 'backward' && node.gradient !== 0 && (
                  <text
                    x={pos.x}
                    y={pos.y + 35}
                    fill="rgb(251, 146, 60)"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    ∇={node.gradient.toFixed(3)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Layer labels */}
          <text x="150" y="30" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">输入层</text>
          <text x="400" y="30" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">隐藏层</text>
          <text x="650" y="30" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">输出层</text>
        </svg>
      </div>

      {/* Loss Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ml-bg-card border border-ml-blue/30 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-100 mb-2">目标值</div>
          <div className="text-4xl font-bold text-ml-blue">{targetValue.toFixed(2)}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-orange/30 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-100 mb-2">预测值</div>
          <div className="text-4xl font-bold text-ml-orange">
            {nodes.find(n => n.layer === 2)?.value.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="bg-ml-bg-card border border-ml-red/30 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-100 mb-2">损失 (MSE)</div>
          <div className="text-4xl font-bold text-ml-red">
            {(() => {
              const output = nodes.find(n => n.layer === 2)?.value || 0
              const loss = Math.pow(output - targetValue, 2) / 2
              return loss.toFixed(4)
            })()}
          </div>
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📚</span> 反向传播算法步骤
        </h4>
        <div className="space-y-3">
          <div className={`p-4 rounded-lg ${phase === 'forward' ? 'bg-ml-blue/20 border-2 border-ml-blue' : 'bg-ml-bg-secondary'}`}>
            <h5 className="font-bold text-ml-blue mb-2">1. 前向传播 (Forward Pass)</h5>
            <p className="text-sm text-gray-100">从输入层开始，逐层计算每个神经元的输出值，直到得到最终的预测结果。</p>
            <p className="text-xs text-gray-100 mt-2 font-mono">z = Σ(wᵢxᵢ) + b, a = σ(z)</p>
          </div>

          <div className={`p-4 rounded-lg ${phase === 'backward' ? 'bg-ml-orange/20 border-2 border-ml-orange' : 'bg-ml-bg-secondary'}`}>
            <h5 className="font-bold text-ml-orange mb-2">2. 计算损失 & 反向传播 (Backward Pass)</h5>
            <p className="text-sm text-gray-100">计算输出误差，然后利用链式法则反向计算每层的梯度。</p>
            <p className="text-xs text-gray-100 mt-2 font-mono">δₗ = (∂L/∂aₗ) · σ'(zₗ)</p>
          </div>

          <div className={`p-4 rounded-lg ${phase === 'update' ? 'bg-ml-green/20 border-2 border-ml-green' : 'bg-ml-bg-secondary'}`}>
            <h5 className="font-bold text-ml-green mb-2">3. 权重更新 (Weight Update)</h5>
            <p className="text-sm text-gray-100">使用梯度下降法更新所有权重和偏置。</p>
            <p className="text-xs text-gray-100 mt-2 font-mono">w ← w - η · (∂L/∂w)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
