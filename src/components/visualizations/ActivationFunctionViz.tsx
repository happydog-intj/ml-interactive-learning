'use client'

import { useState } from 'react'

type ActivationFunction = 'sigmoid' | 'relu' | 'tanh' | 'leakyRelu'

interface FunctionConfig {
  name: string
  displayName: string
  formula: string
  color: string
  gradient: string
  calculate: (x: number) => number
  description: string
  range: string
  pros: string[]
  cons: string[]
}

const activationFunctions: Record<ActivationFunction, FunctionConfig> = {
  sigmoid: {
    name: 'sigmoid',
    displayName: 'Sigmoid',
    formula: 'σ(x) = 1 / (1 + e⁻ˣ)',
    color: 'rgb(0, 217, 255)',
    gradient: 'from-ml-cyan to-ml-blue',
    calculate: (x: number) => 1 / (1 + Math.exp(-x)),
    description: '将输入压缩到 (0, 1) 区间，常用于二分类输出层',
    range: '(0, 1)',
    pros: ['输出范围有界，适合概率解释', '平滑可导，便于梯度计算'],
    cons: ['梯度消失问题严重（饱和区梯度接近0）', '输出非零中心，影响收敛速度', '计算代价较高（指数运算）']
  },
  relu: {
    name: 'relu',
    displayName: 'ReLU',
    formula: 'ReLU(x) = max(0, x)',
    color: 'rgb(168, 85, 247)',
    gradient: 'from-ml-purple to-ml-blue',
    calculate: (x: number) => Math.max(0, x),
    description: '最流行的激活函数，计算简单高效',
    range: '[0, +∞)',
    pros: ['计算简单，训练速度快', '缓解梯度消失问题', '稀疏激活（约50%神经元）'],
    cons: ['神经元"死亡"问题（负值梯度为0）', '输出非零中心', '在负半轴不可导']
  },
  tanh: {
    name: 'tanh',
    displayName: 'Tanh',
    formula: 'tanh(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)',
    color: 'rgb(251, 146, 60)',
    gradient: 'from-ml-orange to-ml-red',
    calculate: (x: number) => Math.tanh(x),
    description: '双曲正切函数，输出零中心，比 Sigmoid 收敛更快',
    range: '(-1, 1)',
    pros: ['输出零中心，收敛速度快', '输出范围有界', '比 Sigmoid 梯度更大'],
    cons: ['仍存在梯度消失问题', '计算代价较高', '饱和区梯度小']
  },
  leakyRelu: {
    name: 'leakyRelu',
    displayName: 'Leaky ReLU',
    formula: 'f(x) = max(0.01x, x)',
    color: 'rgb(34, 197, 94)',
    gradient: 'from-ml-green to-ml-cyan',
    calculate: (x: number) => x > 0 ? x : 0.01 * x,
    description: 'ReLU 的改进版本，避免神经元死亡',
    range: '(-∞, +∞)',
    pros: ['解决 ReLU 神经元死亡问题', '计算简单高效', '负值仍有小梯度'],
    cons: ['需要调整负半轴斜率超参数', '效果提升有限', '负值响应较弱']
  }
}

export function ActivationFunctionViz() {
  const [selectedFunctions, setSelectedFunctions] = useState<ActivationFunction[]>(['sigmoid', 'relu', 'tanh', 'leakyRelu'])
  const [highlightedFunction, setHighlightedFunction] = useState<ActivationFunction | null>(null)
  const [showDerivative, setShowDerivative] = useState(false)

  // Generate data points for plotting
  const xMin = -5
  const xMax = 5
  const numPoints = 200
  const xStep = (xMax - xMin) / numPoints

  const generatePoints = (func: FunctionConfig, derivative: boolean = false) => {
    const points: { x: number; y: number }[] = []

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * xStep

      let y: number
      if (derivative) {
        // Numerical derivative
        const h = 0.0001
        y = (func.calculate(x + h) - func.calculate(x - h)) / (2 * h)
      } else {
        y = func.calculate(x)
      }

      points.push({ x, y })
    }

    return points
  }

  // Convert to SVG coordinates
  const toSVGCoords = (x: number, y: number) => {
    const svgWidth = 700
    const svgHeight = 400
    const padding = 60

    const plotWidth = svgWidth - 2 * padding
    const plotHeight = svgHeight - 2 * padding

    const yMin = showDerivative ? -0.5 : -1.5
    const yMax = showDerivative ? 1.5 : 1.5

    const svgX = padding + ((x - xMin) / (xMax - xMin)) * plotWidth
    const svgY = svgHeight - padding - ((y - yMin) / (yMax - yMin)) * plotHeight

    return { x: svgX, y: svgY }
  }

  const toggleFunction = (func: ActivationFunction) => {
    if (selectedFunctions.includes(func)) {
      if (selectedFunctions.length > 1) {
        setSelectedFunctions(selectedFunctions.filter(f => f !== func))
      }
    } else {
      setSelectedFunctions([...selectedFunctions, func])
    }
  }

  const pointsToPath = (points: { x: number; y: number }[]) => {
    return points.map((p, i) => {
      const coords = toSVGCoords(p.x, p.y)
      return `${i === 0 ? 'M' : 'L'} ${coords.x} ${coords.y}`
    }).join(' ')
  }

  const displayedFunction = highlightedFunction || selectedFunctions[0]
  const config = activationFunctions[displayedFunction]

  return (
    <div className="space-y-8">
      {/* Function Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(activationFunctions) as ActivationFunction[]).map((funcKey) => {
          const func = activationFunctions[funcKey]
          const isSelected = selectedFunctions.includes(funcKey)
          const isHighlighted = highlightedFunction === funcKey

          return (
            <button
              key={funcKey}
              onClick={() => toggleFunction(funcKey)}
              onMouseEnter={() => setHighlightedFunction(funcKey)}
              onMouseLeave={() => setHighlightedFunction(null)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? `border-opacity-100 bg-gradient-to-br ${func.gradient} bg-opacity-10`
                  : 'border-ml-border bg-ml-bg-card border-opacity-50'
              } ${
                isHighlighted ? 'scale-105 shadow-lg' : 'scale-100'
              }`}
            >
              <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                {func.displayName}
              </div>
              <div className="text-xs font-mono text-gray-100">
                {func.formula}
              </div>
            </button>
          )
        })}
      </div>

      {/* Show Derivative Toggle */}
      <div className="flex items-center justify-center gap-4 bg-ml-bg-secondary rounded-xl p-4 border border-ml-border">
        <span className="text-white font-semibold">显示导数</span>
        <button
          onClick={() => setShowDerivative(!showDerivative)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            showDerivative ? 'bg-gradient-to-r from-ml-purple to-ml-blue' : 'bg-ml-bg-dark'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
              showDerivative ? 'transform translate-x-7' : ''
            }`}
          />
        </button>
      </div>

      {/* Graph */}
      <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border">
        <svg viewBox="0 0 700 400" className="w-full h-auto">
          <defs>
            {/* Gradients for each function */}
            {(Object.keys(activationFunctions) as ActivationFunction[]).map((funcKey) => {
              const func = activationFunctions[funcKey]
              return (
                <linearGradient key={`grad-${funcKey}`} id={`grad-${funcKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={func.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={func.color} stopOpacity="1" />
                </linearGradient>
              )
            })}
          </defs>

          {/* Grid lines */}
          <g opacity="0.1">
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => {
              const coords = toSVGCoords(x, 0)
              return (
                <line
                  key={`vline-${x}`}
                  x1={coords.x}
                  y1="20"
                  x2={coords.x}
                  y2="380"
                  stroke="white"
                  strokeWidth="1"
                />
              )
            })}
            {[-1, -0.5, 0, 0.5, 1].map((y) => {
              const coords = toSVGCoords(0, y)
              return (
                <line
                  key={`hline-${y}`}
                  x1="20"
                  y1={coords.y}
                  x2="680"
                  y2={coords.y}
                  stroke="white"
                  strokeWidth="1"
                />
              )
            })}
          </g>

          {/* Axes */}
          <line x1="60" y1="200" x2="640" y2="200" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="350" y1="40" x2="350" y2="360" stroke="white" strokeWidth="2" opacity="0.5" />

          {/* Axis labels */}
          <text x="660" y="205" fill="white" fontSize="12" fontWeight="bold">x</text>
          <text x="355" y="35" fill="white" fontSize="12" fontWeight="bold">y</text>

          {/* Function curves */}
          {selectedFunctions.map((funcKey) => {
            const func = activationFunctions[funcKey]
            const points = generatePoints(func, showDerivative)
            const path = pointsToPath(points)
            const isHighlighted = highlightedFunction === funcKey || highlightedFunction === null

            return (
              <g key={funcKey}>
                {/* Glow effect for highlighted function */}
                {isHighlighted && (
                  <path
                    d={path}
                    fill="none"
                    stroke={func.color}
                    strokeWidth="8"
                    opacity="0.2"
                    filter="blur(4px)"
                  />
                )}

                {/* Main curve */}
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#grad-${funcKey})`}
                  strokeWidth={isHighlighted ? '3' : '2'}
                  opacity={isHighlighted ? '1' : '0.3'}
                  className="transition-all duration-300"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Function Details */}
      <div className={`bg-gradient-to-br ${config.gradient} bg-opacity-10 border-2 border-opacity-30 rounded-xl p-6`}
           style={{ borderColor: config.color }}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: config.color }} />
          <h3 className="text-2xl font-bold text-white">{config.displayName}</h3>
          <span className="px-3 py-1 bg-ml-bg-dark rounded-lg text-sm font-mono text-white">
            {config.formula}
          </span>
        </div>

        <p className="text-gray-100 mb-4">{config.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>✅</span> 优点
            </h4>
            <ul className="space-y-1.5">
              {config.pros.map((pro, idx) => (
                <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                  <span className="text-ml-green mt-1">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>⚠️</span> 缺点
            </h4>
            <ul className="space-y-1.5">
              {config.cons.map((con, idx) => (
                <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                  <span className="text-ml-red mt-1">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white font-semibold">值域:</span>
            <span className="px-3 py-1 bg-ml-bg-dark rounded-lg font-mono text-white">{config.range}</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-ml-bg-secondary border-b border-ml-border">
                <th className="px-4 py-3 text-left text-white font-bold">函数</th>
                <th className="px-4 py-3 text-left text-white font-bold">值域</th>
                <th className="px-4 py-3 text-left text-white font-bold">零中心</th>
                <th className="px-4 py-3 text-left text-white font-bold">梯度消失</th>
                <th className="px-4 py-3 text-left text-white font-bold">计算速度</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(activationFunctions) as ActivationFunction[]).map((funcKey) => {
                const func = activationFunctions[funcKey]
                return (
                  <tr key={funcKey} className="border-b border-ml-border hover:bg-ml-bg-secondary transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: func.color }}>
                        {func.displayName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-100 font-mono text-sm">{func.range}</td>
                    <td className="px-4 py-3">
                      {func.name === 'tanh' ? (
                        <span className="text-ml-green">✓</span>
                      ) : (
                        <span className="text-ml-red">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {func.name === 'sigmoid' || func.name === 'tanh' ? (
                        <span className="text-ml-red">严重</span>
                      ) : func.name === 'relu' ? (
                        <span className="text-ml-yellow">较轻</span>
                      ) : (
                        <span className="text-ml-green">很轻</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {func.name === 'relu' || func.name === 'leakyRelu' ? (
                        <span className="text-ml-green">快</span>
                      ) : (
                        <span className="text-ml-yellow">较慢</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
