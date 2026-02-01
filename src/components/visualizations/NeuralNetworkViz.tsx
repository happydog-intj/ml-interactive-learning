'use client'

import { useState } from 'react'

export function NeuralNetworkViz() {
  const [inputNodes, setInputNodes] = useState(3)
  const [hiddenLayers, setHiddenLayers] = useState(2)
  const [nodesPerLayer, setNodesPerLayer] = useState(4)
  const [outputNodes, setOutputNodes] = useState(2)
  const [animateForward, setAnimateForward] = useState(false)

  // Calculate positions for neurons
  const calculateNodePosition = (layerIndex: number, nodeIndex: number, totalNodes: number, totalLayers: number) => {
    const layerWidth = 800 / (totalLayers + 1)
    const x = layerWidth * (layerIndex + 1)

    const nodeHeight = 400 / (totalNodes + 1)
    const y = nodeHeight * (nodeIndex + 1) + 50

    return { x, y }
  }

  // Build network structure
  const buildNetwork = () => {
    const layers = [
      { name: 'Input', nodes: inputNodes, color: 'from-ml-cyan to-ml-blue' },
      ...Array(hiddenLayers).fill(0).map((_, i) => ({
        name: `Hidden ${i + 1}`,
        nodes: nodesPerLayer,
        color: 'from-ml-purple to-ml-blue'
      })),
      { name: 'Output', nodes: outputNodes, color: 'from-ml-orange to-ml-red' }
    ]
    return layers
  }

  const network = buildNetwork()
  const totalLayers = network.length

  const triggerAnimation = () => {
    setAnimateForward(true)
    setTimeout(() => setAnimateForward(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-ml-bg-secondary rounded-xl p-6 border border-ml-border">
        {/* Input Nodes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-cyan">输入层节点</label>
            <span className="text-2xl font-bold text-white bg-ml-cyan/20 px-3 py-1 rounded-lg">
              {inputNodes}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={inputNodes}
            onChange={(e) => setInputNodes(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-cyan"
          />
        </div>

        {/* Hidden Layers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-purple">隐藏层数</label>
            <span className="text-2xl font-bold text-white bg-ml-purple/20 px-3 py-1 rounded-lg">
              {hiddenLayers}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            value={hiddenLayers}
            onChange={(e) => setHiddenLayers(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Nodes per Hidden Layer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-blue">隐藏层节点</label>
            <span className="text-2xl font-bold text-white bg-ml-blue/20 px-3 py-1 rounded-lg">
              {nodesPerLayer}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            value={nodesPerLayer}
            onChange={(e) => setNodesPerLayer(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-blue"
          />
        </div>

        {/* Output Nodes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-orange">输出层节点</label>
            <span className="text-2xl font-bold text-white bg-ml-orange/20 px-3 py-1 rounded-lg">
              {outputNodes}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={outputNodes}
            onChange={(e) => setOutputNodes(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-orange"
          />
        </div>
      </div>

      {/* Animate Button */}
      <div className="flex justify-center">
        <button
          onClick={triggerAnimation}
          className="px-8 py-3 bg-gradient-to-r from-ml-purple to-ml-blue rounded-xl font-bold text-white hover:from-ml-blue hover:to-ml-cyan transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(138,92,246,0.5)] transform hover:scale-105"
        >
          播放前向传播动画
        </button>
      </div>

      {/* Network Visualization */}
      <div className="bg-ml-bg-secondary rounded-xl p-8 border border-ml-border overflow-x-auto">
        <svg viewBox="0 0 900 600" className="w-full h-auto">
          <defs>
            {/* Gradients for neurons */}
            <linearGradient id="inputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(0, 217, 255)" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" />
            </linearGradient>
            <linearGradient id="hiddenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" />
            </linearGradient>
            <linearGradient id="outputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 146, 60)" />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" />
            </linearGradient>
          </defs>

          {/* Draw connections */}
          {network.map((layer, layerIdx) => {
            if (layerIdx === network.length - 1) return null
            const nextLayer = network[layerIdx + 1]

            return Array(layer.nodes).fill(0).map((_, nodeIdx) => {
              const fromPos = calculateNodePosition(layerIdx, nodeIdx, layer.nodes, totalLayers)

              return Array(nextLayer.nodes).fill(0).map((_, nextNodeIdx) => {
                const toPos = calculateNodePosition(layerIdx + 1, nextNodeIdx, nextLayer.nodes, totalLayers)

                return (
                  <line
                    key={`conn-${layerIdx}-${nodeIdx}-${nextNodeIdx}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth="1.5"
                    className={animateForward ? 'animate-pulse' : ''}
                  />
                )
              })
            })
          })}

          {/* Draw neurons */}
          {network.map((layer, layerIdx) => {
            const gradientId = layerIdx === 0 ? 'inputGrad' :
                             layerIdx === network.length - 1 ? 'outputGrad' :
                             'hiddenGrad'

            return Array(layer.nodes).fill(0).map((_, nodeIdx) => {
              const pos = calculateNodePosition(layerIdx, nodeIdx, layer.nodes, totalLayers)

              return (
                <g key={`node-${layerIdx}-${nodeIdx}`}>
                  {/* Glow effect when animating */}
                  {animateForward && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="20"
                      fill={`url(#${gradientId})`}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Main neuron circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={`url(#${gradientId})`}
                    stroke="white"
                    strokeWidth="2"
                    className={`transition-all duration-300 ${animateForward ? 'animate-pulse' : ''}`}
                  />
                </g>
              )
            })
          })}

          {/* Layer labels */}
          {network.map((layer, layerIdx) => {
            const pos = calculateNodePosition(layerIdx, 0, layer.nodes, totalLayers)
            return (
              <text
                key={`label-${layerIdx}`}
                x={pos.x}
                y={30}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="font-mono"
              >
                {layer.name}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-ml-bg-card border border-ml-cyan/30 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-100 mb-1">总层数</div>
          <div className="text-3xl font-bold text-ml-cyan">{totalLayers}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-purple/30 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-100 mb-1">总节点数</div>
          <div className="text-3xl font-bold text-ml-purple">
            {network.reduce((sum, layer) => sum + layer.nodes, 0)}
          </div>
        </div>
        <div className="bg-ml-bg-card border border-ml-blue/30 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-100 mb-1">总连接数</div>
          <div className="text-3xl font-bold text-ml-blue">
            {network.reduce((sum, layer, idx) => {
              if (idx === network.length - 1) return sum
              return sum + layer.nodes * network[idx + 1].nodes
            }, 0)}
          </div>
        </div>
        <div className="bg-ml-bg-card border border-ml-orange/30 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-100 mb-1">参数数量</div>
          <div className="text-3xl font-bold text-ml-orange">
            {network.reduce((sum, layer, idx) => {
              if (idx === network.length - 1) return sum
              // weights + biases
              return sum + (layer.nodes * network[idx + 1].nodes) + network[idx + 1].nodes
            }, 0)}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-ml-blue mb-2">网络结构说明</h4>
            <ul className="space-y-2 text-gray-100 text-sm">
              <li>• <strong className="text-white">输入层</strong>：接收原始特征数据（如图像像素、文本词向量等）</li>
              <li>• <strong className="text-white">隐藏层</strong>：提取和转换特征，层数越多表示网络越"深"</li>
              <li>• <strong className="text-white">输出层</strong>：产生最终预测结果（分类概率或回归值）</li>
              <li>• <strong className="text-white">连接权重</strong>：每条连接都有一个可学习的权重参数</li>
              <li>• <strong className="text-white">前向传播</strong>：信号从输入层经过隐藏层传递到输出层的过程</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
