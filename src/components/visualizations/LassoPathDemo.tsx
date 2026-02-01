'use client'

import { useState, useEffect } from 'react'

interface CoefPath {
  lambda: number
  coefficients: number[]
}

export function LassoPathDemo() {
  const [numFeatures] = useState(10)
  const [paths, setPaths] = useState<CoefPath[]>([])
  const [selectedLambda, setSelectedLambda] = useState(0.5)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  // Generate LASSO path (simplified simulation)
  const generateLassoPath = () => {
    const newPaths: CoefPath[] = []
    const lambdas = []

    // Generate lambda values (log scale)
    for (let i = 0; i <= 50; i++) {
      lambdas.push(Math.exp(-i / 5))
    }

    // True coefficients (sparse)
    const trueCoef = [5, -3, 0, 4, 0, 0, -2, 0, 0, 1.5]

    lambdas.forEach(lambda => {
      const coef = trueCoef.map((true_val, idx) => {
        // Soft thresholding: simulate LASSO shrinkage
        const shrinkage = lambda * 2
        if (Math.abs(true_val) <= shrinkage) {
          return 0
        } else {
          return true_val > 0
            ? true_val - shrinkage
            : true_val + shrinkage
        }
      })

      newPaths.push({ lambda, coefficients: coef })
    })

    setPaths(newPaths)
  }

  useEffect(() => {
    generateLassoPath()
  }, [])

  // Get current coefficients
  const getCurrentCoefficients = () => {
    if (paths.length === 0) return []

    // Find closest lambda
    const closest = paths.reduce((prev, curr) =>
      Math.abs(curr.lambda - selectedLambda) < Math.abs(prev.lambda - selectedLambda)
        ? curr
        : prev
    )

    return closest.coefficients
  }

  const currentCoef = getCurrentCoefficients()
  const numNonZero = currentCoef.filter(c => Math.abs(c) > 0.01).length

  // Colors for features
  const COLORS = [
    '#00D9FF', '#00FF88', '#B84CFF', '#FF8A00', '#FF3366',
    '#FFD700', '#00FFFF', '#FF1493', '#32CD32', '#FFA500'
  ]

  return (
    <div className="space-y-6">
      {/* LASSO Path Visualization */}
      <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-cyan mb-4">LASSO正则化路径</h3>

        <div className="relative">
          {/* SVG for path visualization */}
          <svg width="100%" height="300" className="bg-ml-bg-dark rounded-lg">
            <defs>
              {COLORS.map((color, idx) => (
                <linearGradient key={idx} id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
              ))}
            </defs>

            {/* Grid lines */}
            <line x1="50" y1="150" x2="550" y2="150" stroke="#1a1f2e" strokeWidth="1" />
            <line x1="50" y1="50" x2="550" y2="50" stroke="#1a1f2e" strokeWidth="0.5" />
            <line x1="50" y1="100" x2="550" y2="100" stroke="#1a1f2e" strokeWidth="0.5" />
            <line x1="50" y1="200" x2="550" y2="200" stroke="#1a1f2e" strokeWidth="0.5" />
            <line x1="50" y1="250" x2="550" y2="250" stroke="#1a1f2e" strokeWidth="0.5" />

            {/* Draw coefficient paths */}
            {Array.from({ length: numFeatures }).map((_, featureIdx) => {
              const points = paths.map((path, pathIdx) => {
                const x = 50 + (pathIdx / (paths.length - 1)) * 500
                const y = 150 - path.coefficients[featureIdx] * 15  // Scale for visualization
                return { x, y, lambda: path.lambda }
              })

              const pathD = points.map((p, i) =>
                `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
              ).join(' ')

              return (
                <g key={featureIdx}>
                  <path
                    d={pathD}
                    stroke={COLORS[featureIdx]}
                    strokeWidth={hoveredFeature === featureIdx ? 3 : 2}
                    fill="none"
                    opacity={hoveredFeature === null || hoveredFeature === featureIdx ? 1 : 0.2}
                    onMouseEnter={() => setHoveredFeature(featureIdx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="cursor-pointer transition-all"
                  />
                </g>
              )
            })}

            {/* Current lambda indicator */}
            {(() => {
              const x = 50 + ((1 - selectedLambda) * 500)
              return (
                <>
                  <line
                    x1={x}
                    y1="50"
                    x2={x}
                    y2="250"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text x={x} y="40" fill="#FFD700" fontSize="12" textAnchor="middle">
                    λ={selectedLambda.toFixed(2)}
                  </text>
                </>
              )
            })()}

            {/* Axes labels */}
            <text x="300" y="290" fill="#gray" fontSize="14" textAnchor="middle">
              λ (正则化强度)
            </text>
            <text x="30" y="155" fill="#gray" fontSize="14" textAnchor="middle">
              0
            </text>
            <text x="20" y="55" fill="#gray" fontSize="12" textAnchor="middle">
              +
            </text>
            <text x="20" y="255" fill="#gray" fontSize="12" textAnchor="middle">
              −
            </text>
            <text x="50" y="280" fill="#gray" fontSize="12" textAnchor="middle">
              大
            </text>
            <text x="550" y="280" fill="#gray" fontSize="12" textAnchor="middle">
              小
            </text>
          </svg>
        </div>
      </div>

      {/* Lambda slider */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
        <label className="block text-sm font-bold text-white mb-3">
          正则化参数 λ: {selectedLambda.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selectedLambda}
          onChange={(e) => setSelectedLambda(Number(e.target.value))}
          className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-yellow"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>无正则化 (λ=0)</span>
          <span>强正则化 (λ=1)</span>
        </div>
      </div>

      {/* Current coefficients */}
      <div className="bg-gradient-to-r from-ml-purple/10 to-ml-cyan/10 border border-ml-purple/30 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-ml-purple">当前系数值</h3>
          <div className="text-sm text-gray-100">
            非零系数: <span className="text-ml-green font-bold text-xl">{numNonZero}</span> / {numFeatures}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {currentCoef.map((coef, idx) => {
            const isZero = Math.abs(coef) < 0.01

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-all cursor-pointer ${
                  hoveredFeature === idx
                    ? 'bg-ml-bg-dark ring-2 ring-ml-yellow scale-105'
                    : 'bg-ml-bg-dark'
                } ${isZero ? 'opacity-50' : ''}`}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  特征 {idx + 1}
                </div>
                <div
                  className="text-lg font-bold font-mono"
                  style={{ color: isZero ? '#666' : COLORS[idx] }}
                >
                  {coef.toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature importance chart */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">系数大小（特征重要性）</h3>

        <div className="space-y-2">
          {currentCoef
            .map((coef, idx) => ({ idx, coef: Math.abs(coef) }))
            .sort((a, b) => b.coef - a.coef)
            .map(({ idx, coef }) => {
              const maxCoef = Math.max(...currentCoef.map(Math.abs), 0.1)
              const percentage = (coef / maxCoef) * 100

              return (
                <div
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx] }}
                      />
                      特征 {idx + 1}
                    </span>
                    <span className="text-gray-100 font-mono">
                      {currentCoef[idx].toFixed(2)}
                    </span>
                  </div>
                  <div className="h-6 bg-ml-bg-dark rounded-lg overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[idx],
                        opacity: hoveredFeature === idx ? 1 : 0.7
                      }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Algorithm explanation */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-yellow mb-3">💡 LASSO稀疏性原理</h4>

        <div className="space-y-3 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-3">
            <h5 className="text-ml-cyan font-bold mb-2">LASSO目标函数</h5>
            <div className="font-mono text-white text-center py-2 text-sm">
              min ||y - Xw||² + λ||w||₁
            </div>
            <p className="text-xs mt-2">
              L1范数惩罚：||w||₁ = Σ|wᵢ|，促使权重稀疏化
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-ml-bg-dark rounded-lg p-3">
              <h5 className="text-ml-green font-bold mb-2">✓ 为什么产生稀疏性？</h5>
              <ul className="text-xs space-y-1">
                <li>• L1范数在原点不可导</li>
                <li>• 梯度下降容易将权重压缩到0</li>
                <li>• λ越大，零系数越多</li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-3">
              <h5 className="text-ml-purple font-bold mb-2">⚙️ 应用场景</h5>
              <ul className="text-xs space-y-1">
                <li>• 高维数据特征选择</li>
                <li>• 去除不相关特征</li>
                <li>• 提高模型可解释性</li>
              </ul>
            </div>
          </div>

          <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-3">
            <h5 className="text-ml-cyan font-bold mb-2">📊 正则化路径</h5>
            <p className="text-xs">
              随着λ从0增加到∞，特征系数依次变为0，形成完整的LASSO路径。
              通过交叉验证选择最优λ，在模型复杂度和拟合误差间取得平衡。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
