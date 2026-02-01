'use client'

import { useState, useEffect } from 'react'

interface DataPoint {
  x: number
  y: number
  label: 0 | 1  // 0: red, 1: blue
}

interface Tree {
  id: number
  prediction: 0 | 1 | null
  confidence: number
  usedFeatures: boolean[]  // which features were sampled
}

export function RandomForestDemo() {
  const [numTrees, setNumTrees] = useState(5)
  const [data, setData] = useState<DataPoint[]>([])
  const [trees, setTrees] = useState<Tree[]>([])
  const [testPoint, setTestPoint] = useState({ x: 0.5, y: 0.5 })
  const [finalPrediction, setFinalPrediction] = useState<{ class: 0 | 1, votes: number[] } | null>(null)
  const [hoveredTree, setHoveredTree] = useState<number | null>(null)

  // Initialize dataset
  const initializeData = () => {
    const points: DataPoint[] = []

    // Generate data in two regions
    // Red class (0): bottom-left region
    for (let i = 0; i < 30; i++) {
      points.push({
        x: Math.random() * 0.4 + 0.1,
        y: Math.random() * 0.4 + 0.1,
        label: 0
      })
    }

    // Blue class (1): top-right region
    for (let i = 0; i < 30; i++) {
      points.push({
        x: Math.random() * 0.4 + 0.5,
        y: Math.random() * 0.4 + 0.5,
        label: 1
      })
    }

    // Add some noise points
    for (let i = 0; i < 10; i++) {
      points.push({
        x: Math.random(),
        y: Math.random(),
        label: Math.random() > 0.5 ? 1 : 0
      })
    }

    setData(points)
    setTrees([])
    setFinalPrediction(null)
  }

  // Simulate a decision tree prediction
  const predictWithTree = (point: { x: number, y: number }, treeId: number): { prediction: 0 | 1, confidence: number } => {
    // Simulate random feature selection (feature bagging)
    const useX = Math.random() > 0.3  // 70% chance to use x
    const useY = Math.random() > 0.3  // 70% chance to use y

    // Simple decision boundary with randomness (simulating bootstrap sampling effect)
    const threshold = 0.5 + (Math.random() - 0.5) * 0.2  // Random threshold around 0.5

    let prediction: 0 | 1
    if (useX && useY) {
      // Use both features
      prediction = (point.x + point.y) / 2 > threshold ? 1 : 0
    } else if (useX) {
      // Use only x
      prediction = point.x > threshold ? 1 : 0
    } else if (useY) {
      // Use only y
      prediction = point.y > threshold ? 1 : 0
    } else {
      // Random guess if no features (shouldn't happen often)
      prediction = Math.random() > 0.5 ? 1 : 0
    }

    // Calculate confidence based on distance from boundary
    const distance = Math.abs((point.x + point.y) / 2 - threshold)
    const confidence = Math.min(0.5 + distance * 2, 0.95)

    return { prediction, confidence }
  }

  // Train forest (simulate)
  const trainForest = () => {
    const newTrees: Tree[] = []

    for (let i = 0; i < numTrees; i++) {
      const { prediction, confidence } = predictWithTree(testPoint, i)
      const useX = Math.random() > 0.3
      const useY = Math.random() > 0.3

      newTrees.push({
        id: i,
        prediction,
        confidence,
        usedFeatures: [useX, useY]
      })
    }

    setTrees(newTrees)

    // Majority voting
    const votes = [0, 0]
    newTrees.forEach(tree => {
      if (tree.prediction !== null) {
        votes[tree.prediction]++
      }
    })

    const predictedClass = votes[1] > votes[0] ? 1 : 0
    setFinalPrediction({ class: predictedClass, votes })
  }

  // Initialize on mount
  useEffect(() => {
    initializeData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Main visualization area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Data space */}
        <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-ml-cyan mb-4">特征空间</h3>
          <div className="relative aspect-square bg-ml-bg-dark rounded-lg border border-ml-border overflow-hidden">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Background */}
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1f2e" strokeWidth="1"/>
                </pattern>
              </defs>

              {/* Data points */}
              {data.map((point, idx) => (
                <circle
                  key={idx}
                  cx={`${point.x * 100}%`}
                  cy={`${(1 - point.y) * 100}%`}
                  r="4"
                  fill={point.label === 0 ? '#FF3366' : '#00D9FF'}
                  stroke="#fff"
                  strokeWidth="1"
                  opacity="0.8"
                />
              ))}

              {/* Test point */}
              <circle
                cx={`${testPoint.x * 100}%`}
                cy={`${(1 - testPoint.y) * 100}%`}
                r="8"
                fill={finalPrediction ? (finalPrediction.class === 0 ? '#FF3366' : '#00D9FF') : '#FFD700'}
                stroke="#fff"
                strokeWidth="2"
              />

              {/* Crosshair for test point */}
              <line
                x1={`${testPoint.x * 100}%`}
                y1="0"
                x2={`${testPoint.x * 100}%`}
                y2="100%"
                stroke="#FFD700"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.3"
              />
              <line
                x1="0"
                y1={`${(1 - testPoint.y) * 100}%`}
                x2="100%"
                y2={`${(1 - testPoint.y) * 100}%`}
                stroke="#FFD700"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-red border border-white"></div>
              <span className="text-gray-100">类别 0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-cyan border border-white"></div>
              <span className="text-gray-100">类别 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-ml-yellow border-2 border-white"></div>
              <span className="text-gray-100">测试点</span>
            </div>
          </div>
        </div>

        {/* Ensemble prediction */}
        <div className="bg-ml-bg-card border-2 border-ml-purple/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-ml-purple mb-4">集成预测</h3>

          {trees.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-center p-8">
              <div>
                <div className="text-4xl mb-4">🌲</div>
                <p>点击"训练森林"开始预测</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Individual trees */}
              <div className="grid grid-cols-5 gap-2">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      hoveredTree === tree.id
                        ? 'border-ml-yellow bg-ml-yellow/10 scale-105'
                        : 'border-ml-border bg-ml-bg-dark hover:border-ml-border/50'
                    }`}
                    onMouseEnter={() => setHoveredTree(tree.id)}
                    onMouseLeave={() => setHoveredTree(null)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🌲</div>
                      <div className="text-xs text-gray-400 mb-2">树 {tree.id + 1}</div>
                      <div className={`text-sm font-bold ${
                        tree.prediction === 0 ? 'text-ml-red' : 'text-ml-cyan'
                      }`}>
                        {tree.prediction === 0 ? '类 0' : '类 1'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {(tree.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    {/* Feature indicators */}
                    <div className="absolute top-1 right-1 flex gap-0.5">
                      {tree.usedFeatures[0] && (
                        <div className="w-2 h-2 rounded-full bg-ml-green" title="使用特征 X"></div>
                      )}
                      {tree.usedFeatures[1] && (
                        <div className="w-2 h-2 rounded-full bg-ml-blue" title="使用特征 Y"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Voting result */}
              {finalPrediction && (
                <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-purple/10 border border-ml-cyan/30 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-ml-cyan mb-3">投票结果</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">类别 0</span>
                        <span className="text-ml-red font-bold">{finalPrediction.votes[0]} 票</span>
                      </div>
                      <div className="h-6 bg-ml-bg-dark rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-ml-red transition-all duration-500"
                          style={{ width: `${(finalPrediction.votes[0] / numTrees) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">类别 1</span>
                        <span className="text-ml-cyan font-bold">{finalPrediction.votes[1]} 票</span>
                      </div>
                      <div className="h-6 bg-ml-bg-dark rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-ml-cyan transition-all duration-500"
                          style={{ width: `${(finalPrediction.votes[1] / numTrees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ml-border text-center">
                    <div className="text-sm text-gray-100 mb-1">最终预测</div>
                    <div className={`text-3xl font-bold ${
                      finalPrediction.class === 0 ? 'text-ml-red' : 'text-ml-cyan'
                    }`}>
                      类别 {finalPrediction.class}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Number of trees */}
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-3">
            树的数量: {numTrees}
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numTrees}
            onChange={(e) => {
              setNumTrees(Number(e.target.value))
              setTrees([])
              setFinalPrediction(null)
            }}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-purple"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3</span>
            <span>10</span>
          </div>
        </div>

        {/* Test point X */}
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-3">
            测试点 X: {testPoint.x.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={testPoint.x}
            onChange={(e) => {
              setTestPoint({ ...testPoint, x: Number(e.target.value) })
              setTrees([])
              setFinalPrediction(null)
            }}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-green"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>1</span>
          </div>
        </div>

        {/* Test point Y */}
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-3">
            测试点 Y: {testPoint.y.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={testPoint.y}
            onChange={(e) => {
              setTestPoint({ ...testPoint, y: Number(e.target.value) })
              setTrees([])
              setFinalPrediction(null)
            }}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-blue"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>1</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={initializeData}
          className="px-4 py-2 bg-ml-bg-card border border-ml-border text-white rounded-lg hover:border-ml-cyan transition-colors"
        >
          🔄 重置数据
        </button>

        <button
          onClick={trainForest}
          className="px-6 py-2 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors"
        >
          🌲 训练森林
        </button>
      </div>

      {/* Feature indicators legend */}
      {hoveredTree !== null && trees[hoveredTree] && (
        <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
          <h4 className="text-sm font-bold text-ml-yellow mb-2">树 {hoveredTree + 1} 的特征使用</h4>
          <div className="flex gap-4 text-sm text-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-green"></div>
              <span>{trees[hoveredTree].usedFeatures[0] ? '✓ 使用特征 X' : '✗ 未使用 X'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-blue"></div>
              <span>{trees[hoveredTree].usedFeatures[1] ? '✓ 使用特征 Y' : '✗ 未使用 Y'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm explanation */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">💡 随机森林原理</h3>
        <div className="space-y-4 text-sm text-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-cyan font-bold mb-2">样本随机（Bagging）</h4>
              <p>每棵树使用<strong className="text-white">自助采样</strong>（Bootstrap）从训练集中有放回地抽取样本，约63.2%的样本会被选中</p>
            </div>
            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-2">特征随机</h4>
              <p>每次分裂时，从所有特征中<strong className="text-white">随机选择k个特征</strong>，通常k = log₂d，增强树的多样性</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ml-green/10 to-ml-blue/10 border border-ml-green/30 rounded-lg p-4">
            <h4 className="text-ml-green font-bold mb-2">投票机制</h4>
            <p>
              <strong className="text-white">分类任务</strong>：多数投票（Majority Voting）<br/>
              <strong className="text-white">回归任务</strong>：平均预测值（Averaging）
            </p>
          </div>

          <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
            <h4 className="text-ml-yellow font-bold mb-2">为什么随机森林有效？</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">降低方差</strong>：多个弱学习器的平均降低了过拟合风险</li>
              <li><strong className="text-white">增强鲁棒性</strong>：单棵树的错误可被其他树纠正</li>
              <li><strong className="text-white">特征重要性</strong>：可以评估每个特征的贡献度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
