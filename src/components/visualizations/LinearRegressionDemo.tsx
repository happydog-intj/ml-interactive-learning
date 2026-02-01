'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  x: number
  y: number
}

export function LinearRegressionDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<DataPoint[]>([])
  const [slope, setSlope] = useState(2)
  const [intercept, setIntercept] = useState(1)
  const [showBestFit, setShowBestFit] = useState(false)
  const [isTraining, setIsTraining] = useState(false)

  // 生成初始数据
  useEffect(() => {
    const points: DataPoint[] = []
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 10
      const y = 2 * x + 1 + (Math.random() - 0.5) * 4
      points.push({ x, y })
    }
    setData(points)
  }, [])

  // 计算最佳拟合线（最小二乘法）
  const calculateBestFit = () => {
    if (data.length === 0) return { slope: 0, intercept: 0 }

    const n = data.length
    const sumX = data.reduce((sum, p) => sum + p.x, 0)
    const sumY = data.reduce((sum, p) => sum + p.y, 0)
    const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0)
    const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  // 计算损失（MSE）
  const calculateLoss = (m: number, b: number) => {
    if (data.length === 0) return 0
    const mse = data.reduce((sum, point) => {
      const predicted = m * point.x + b
      const error = point.y - predicted
      return sum + error * error
    }, 0) / data.length
    return mse
  }

  const currentLoss = calculateLoss(slope, intercept)
  const bestFit = calculateBestFit()
  const bestLoss = calculateLoss(bestFit.slope, bestFit.intercept)

  // 梯度下降训练
  const trainModel = async () => {
    setIsTraining(true)
    let currentSlope = slope
    let currentIntercept = intercept
    const learningRate = 0.01
    const iterations = 100

    for (let i = 0; i < iterations; i++) {
      // 计算梯度
      let gradSlope = 0
      let gradIntercept = 0

      for (const point of data) {
        const predicted = currentSlope * point.x + currentIntercept
        const error = predicted - point.y
        gradSlope += (2 / data.length) * error * point.x
        gradIntercept += (2 / data.length) * error
      }

      // 更新参数
      currentSlope -= learningRate * gradSlope
      currentIntercept -= learningRate * gradIntercept

      // 每10次迭代更新一次显示
      if (i % 5 === 0) {
        setSlope(currentSlope)
        setIntercept(currentIntercept)
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    setSlope(currentSlope)
    setIntercept(currentIntercept)
    setIsTraining(false)
  }

  // 绘制图表
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const width = 600
    const height = 500
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

    // 坐标轴比例
    const xExtent = d3.extent(data, d => d.x) as [number, number]
    const yExtent = d3.extent(data, d => d.y) as [number, number]

    const xScale = d3.scaleLinear()
      .domain([Math.min(0, xExtent[0] - 1), xExtent[1] + 1])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([Math.min(0, yExtent[0] - 1), yExtent[1] + 1])
      .range([innerHeight, 0])

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
      .text('x')

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
      .text('y')

    // 绘制最佳拟合线（如果显示）
    if (showBestFit) {
      const x0 = xScale.domain()[0]
      const x1 = xScale.domain()[1]
      const y0 = bestFit.slope * x0 + bestFit.intercept
      const y1 = bestFit.slope * x1 + bestFit.intercept

      g.append('line')
        .attr('x1', xScale(x0))
        .attr('y1', yScale(y0))
        .attr('x2', xScale(x1))
        .attr('y2', yScale(y1))
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.7)
    }

    // 绘制当前拟合线
    const x0 = xScale.domain()[0]
    const x1 = xScale.domain()[1]
    const y0 = slope * x0 + intercept
    const y1 = slope * x1 + intercept

    g.append('line')
      .attr('x1', xScale(x0))
      .attr('y1', yScale(y0))
      .attr('x2', xScale(x1))
      .attr('y2', yScale(y1))
      .attr('stroke', '#58C4DD')
      .attr('stroke-width', 3)

    // 绘制残差线
    data.forEach(point => {
      const predicted = slope * point.x + intercept
      g.append('line')
        .attr('x1', xScale(point.x))
        .attr('y1', yScale(point.y))
        .attr('x2', xScale(point.x))
        .attr('y2', yScale(predicted))
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
    })

    // 绘制数据点
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

  }, [data, slope, intercept, showBestFit, bestFit])

  return (
    <div className="bg-gray-50 dark:bg-ml-bg-secondary p-6 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主图表 */}
        <div className="lg:col-span-2">
          <div className="flex justify-center bg-gray-100 dark:bg-ml-bg-dark rounded-lg p-4">
            <svg ref={svgRef} />
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 参数调整 */}
          <div className="bg-gray-100 dark:bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-ml-blue">模型参数</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  斜率 (slope): <span className="text-ml-blue">{slope.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  disabled={isTraining}
                  className="w-full accent-ml-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  截距 (intercept): <span className="text-ml-blue">{intercept.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={intercept}
                  onChange={(e) => setIntercept(Number(e.target.value))}
                  disabled={isTraining}
                  className="w-full accent-ml-blue"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-white mb-2">当前模型:</p>
              <p className="text-white font-mono">
                y = <span className="text-ml-blue">{slope.toFixed(2)}</span>x + <span className="text-ml-blue">{intercept.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* 损失函数 */}
          <div className="bg-gray-100 dark:bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-ml-blue">损失函数 (MSE)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">当前损失:</span>
                <span className="text-2xl font-bold text-ml-blue">{currentLoss.toFixed(2)}</span>
              </div>
              {showBestFit && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">最优损失:</span>
                  <span className="text-green-400 font-bold">{bestLoss.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={trainModel}
              disabled={isTraining}
              className="w-full px-4 py-3 bg-ml-blue hover:bg-ml-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {isTraining ? '训练中...' : '🚀 梯度下降训练'}
            </button>

            <button
              onClick={() => setShowBestFit(!showBestFit)}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              {showBestFit ? '隐藏最优解' : '显示最优解'}
            </button>

            <button
              onClick={() => {
                setSlope(0)
                setIntercept(0)
              }}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              重置参数
            </button>
          </div>

          {/* 最优参数 */}
          {showBestFit && (
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-green-400 mb-2">最优参数</h4>
              <p className="text-sm text-white font-mono">
                y = <span className="text-green-400">{bestFit.slope.toFixed(2)}</span>x + <span className="text-green-400">{bestFit.intercept.toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-ml-bg-dark rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-yellow-500 font-bold">● 橙色圆点</span>
            <p className="text-white mt-1">训练数据点</p>
          </div>
          <div>
            <span className="text-ml-blue font-bold">━ 蓝色直线</span>
            <p className="text-white mt-1">当前拟合线</p>
          </div>
          <div>
            <span className="text-red-400 font-bold">| 红色线段</span>
            <p className="text-white mt-1">预测误差（残差）</p>
          </div>
        </div>
        <p className="text-white text-sm mt-4">
          💡 提示：手动调整斜率和截距，观察损失函数的变化。点击"梯度下降训练"观看算法自动寻找最优解的过程。
        </p>
      </div>
    </div>
  )
}
