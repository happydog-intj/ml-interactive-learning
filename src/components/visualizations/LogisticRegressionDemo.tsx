'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  x1: number
  x2: number
  label: number
}

export function LogisticRegressionDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<DataPoint[]>([])
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(1)
  const [b, setB] = useState(0)

  // 生成二分类数据
  useEffect(() => {
    const points: DataPoint[] = []

    // 类别 0 (左下)
    for (let i = 0; i < 30; i++) {
      points.push({
        x1: Math.random() * 4 + 1,
        x2: Math.random() * 4 + 1,
        label: 0
      })
    }

    // 类别 1 (右上)
    for (let i = 0; i < 30; i++) {
      points.push({
        x1: Math.random() * 4 + 5,
        x2: Math.random() * 4 + 5,
        label: 1
      })
    }

    setData(points)
  }, [])

  // Sigmoid 函数
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

  // 预测函数
  const predict = (x1: number, x2: number) => {
    const z = w1 * x1 + w2 * x2 + b
    return sigmoid(z)
  }

  // 计算准确率
  const calculateAccuracy = () => {
    if (data.length === 0) return 0
    let correct = 0
    for (const point of data) {
      const prob = predict(point.x1, point.x2)
      const predicted = prob >= 0.5 ? 1 : 0
      if (predicted === point.label) correct++
    }
    return (correct / data.length) * 100
  }

  // 绘制图表
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const width = 600
    const height = 600
    const margin = { top: 20, right: 20, bottom: 50, left: 60 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 坐标轴
    const xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([innerHeight, 0])

    // 绘制决策边界背景（概率热图）
    const resolution = 50
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x1 = (i / resolution) * 10
        const x2 = (j / resolution) * 10
        const prob = predict(x1, x2)

        const color = d3.interpolateRdYlBu(1 - prob)

        g.append('rect')
          .attr('x', xScale(x1))
          .attr('y', yScale(x2 + 10/resolution))
          .attr('width', innerWidth / resolution)
          .attr('height', innerHeight / resolution)
          .attr('fill', color)
          .attr('opacity', 0.3)
      }
    }

    // 绘制决策边界线 (w1*x1 + w2*x2 + b = 0)
    if (Math.abs(w2) > 0.01) {
      const x1_start = 0
      const x1_end = 10
      const x2_start = -(w1 * x1_start + b) / w2
      const x2_end = -(w1 * x1_end + b) / w2

      g.append('line')
        .attr('x1', xScale(x1_start))
        .attr('y1', yScale(x2_start))
        .attr('x2', xScale(x1_end))
        .attr('y2', yScale(x2_end))
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5')
    }

    // 网格线
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#FFFFFF')

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('opacity', 0.1)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#FFFFFF')

    // X 轴
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('特征 x₁')

    // Y 轴
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('特征 x₂')

    // 绘制数据点
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x1))
      .attr('cy', d => yScale(d.x2))
      .attr('r', 6)
      .attr('fill', d => d.label === 1 ? '#10B981' : '#EF4444')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)

  }, [data, w1, w2, b])

  const accuracy = calculateAccuracy()

  return (
    <div className="bg-ml-bg-secondary p-6 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主图表 */}
        <div className="lg:col-span-2">
          <div className="flex justify-center bg-ml-bg-dark rounded-lg p-4">
            <svg ref={svgRef} />
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 模型参数 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-ml-blue">模型参数</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  权重 w₁: <span className="text-ml-blue">{w1.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={w1}
                  onChange={(e) => setW1(Number(e.target.value))}
                  className="w-full accent-ml-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  权重 w₂: <span className="text-ml-blue">{w2.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={w2}
                  onChange={(e) => setW2(Number(e.target.value))}
                  className="w-full accent-ml-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  偏置 b: <span className="text-ml-blue">{b.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full accent-ml-blue"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-200 mb-2">决策边界方程:</p>
              <p className="text-white font-mono text-sm break-words">
                {w1.toFixed(2)}·x₁ + {w2.toFixed(2)}·x₂ + {b.toFixed(2)} = 0
              </p>
            </div>
          </div>

          {/* 性能指标 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-ml-blue">分类性能</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {accuracy.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-200">准确率</p>
            </div>
          </div>

          {/* Sigmoid 函数说明 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 text-ml-yellow">Sigmoid 函数</h3>
            <p className="text-xs text-gray-200 mb-2 font-mono">
              σ(z) = 1 / (1 + e⁻ᶻ)
            </p>
            <p className="text-xs text-gray-200">
              其中 z = w₁·x₁ + w₂·x₂ + b
            </p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-200">
                输出范围: (0, 1)<br/>
                决策阈值: 0.5
              </p>
            </div>
          </div>

          {/* 重置按钮 */}
          <button
            onClick={() => {
              setW1(1)
              setW2(1)
              setB(0)
            }}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            重置参数
          </button>
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-6 p-4 bg-ml-bg-dark rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-green-400 font-bold">● 绿色圆点</span>
            <p className="text-gray-200 mt-1">正类样本 (label = 1)</p>
          </div>
          <div>
            <span className="text-red-400 font-bold">● 红色圆点</span>
            <p className="text-gray-200 mt-1">负类样本 (label = 0)</p>
          </div>
          <div>
            <span className="text-white font-bold">━ ━ 白色虚线</span>
            <p className="text-gray-200 mt-1">决策边界 (P = 0.5)</p>
          </div>
        </div>
        <p className="text-gray-200 text-sm mt-4">
          🎨 <strong>背景颜色</strong>表示分类概率：红色区域倾向于类别0，蓝色区域倾向于类别1。
          调整参数观察决策边界如何移动。
        </p>
      </div>
    </div>
  )
}
