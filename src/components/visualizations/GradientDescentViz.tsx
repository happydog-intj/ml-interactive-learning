'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Point {
  x: number
  y: number
}

export function GradientDescentViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [currentX, setCurrentX] = useState(8)
  const [learningRate, setLearningRate] = useState(0.1)
  const [path, setPath] = useState<Point[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [iteration, setIteration] = useState(0)

  // 损失函数: f(x) = (x-2)^2 + 1
  const lossFunction = (x: number) => Math.pow(x - 2, 2) + 1

  // 梯度: f'(x) = 2(x-2)
  const gradient = (x: number) => 2 * (x - 2)

  // 运行梯度下降
  const runGradientDescent = async () => {
    setIsAnimating(true)
    setPath([])
    setIteration(0)

    let x = currentX
    const newPath: Point[] = [{ x, y: lossFunction(x) }]
    let iter = 0

    for (let i = 0; i < 50; i++) {
      const grad = gradient(x)
      x = x - learningRate * grad

      const loss = lossFunction(x)
      newPath.push({ x, y: loss })

      setCurrentX(x)
      setPath([...newPath])
      setIteration(++iter)

      await new Promise(resolve => setTimeout(resolve, 200))

      // 如果梯度很小，停止
      if (Math.abs(grad) < 0.01) break
    }

    setIsAnimating(false)
  }

  // 绘制图表
  useEffect(() => {
    if (!svgRef.current) return

    const width = 700
    const height = 400
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
      .domain([-2, 10])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, 70])
      .range([innerHeight, 0])

    // 网格
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
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
      .attr('font-size', '14px')
      .text('参数 x')

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
      .attr('font-size', '14px')
      .text('损失 L(x)')

    // 绘制损失函数曲线
    const curveData: Point[] = []
    for (let x = -2; x <= 10; x += 0.1) {
      curveData.push({ x, y: lossFunction(x) })
    }

    const line = d3.line<Point>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis)

    g.append('path')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', '#58C4DD')
      .attr('stroke-width', 3)
      .attr('d', line)

    // 绘制最优点
    g.append('circle')
      .attr('cx', xScale(2))
      .attr('cy', yScale(1))
      .attr('r', 6)
      .attr('fill', '#10B981')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    g.append('text')
      .attr('x', xScale(2))
      .attr('y', yScale(1) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#10B981')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('最优点 (2, 1)')

    // 绘制当前点
    const currentY = lossFunction(currentX)
    g.append('circle')
      .attr('cx', xScale(currentX))
      .attr('cy', yScale(currentY))
      .attr('r', 8)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    // 绘制梯度方向（切线）
    const grad = gradient(currentX)
    const dx = 1
    const y1 = currentY - grad * dx
    const y2 = currentY + grad * dx

    g.append('line')
      .attr('x1', xScale(currentX - dx))
      .attr('y1', yScale(y1))
      .attr('x2', xScale(currentX + dx))
      .attr('y2', yScale(y2))
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    // 绘制梯度箭头
    if (Math.abs(grad) > 0.1) {
      const arrowLength = Math.min(Math.abs(grad) * 0.5, 2)
      const arrowX = grad > 0 ? currentX - arrowLength : currentX + arrowLength

      g.append('line')
        .attr('x1', xScale(currentX))
        .attr('y1', yScale(currentY))
        .attr('x2', xScale(arrowX))
        .attr('y2', yScale(currentY))
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrow)')

      // 定义箭头标记
      svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 5)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#EF4444')
    }

    // 绘制下降路径
    if (path.length > 1) {
      const pathLine = d3.line<Point>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))

      g.append('path')
        .datum(path)
        .attr('fill', 'none')
        .attr('stroke', '#A855F7')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '3,3')
        .attr('d', pathLine)

      // 绘制路径点
      g.selectAll('.path-point')
        .data(path)
        .enter()
        .append('circle')
        .attr('class', 'path-point')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
        .attr('fill', '#A855F7')
        .attr('opacity', 0.6)
    }

  }, [currentX, path, learningRate])

  const currentLoss = lossFunction(currentX)
  const currentGrad = gradient(currentX)

  return (
    <div className="bg-gray-50 dark:bg-ml-bg-secondary p-6 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主图表 */}
        <div className="lg:col-span-3">
          <div className="flex justify-center bg-gray-100 dark:bg-ml-bg-dark rounded-lg p-4">
            <svg ref={svgRef} />
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-4">
          {/* 当前状态 */}
          <div className="bg-gray-100 dark:bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-ml-blue">当前状态</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-white">迭代次数:</span>
                <span className="text-white font-bold">{iteration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-white">参数 x:</span>
                <span className="text-yellow-400 font-bold">{currentX.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-white">损失 L(x):</span>
                <span className="text-ml-blue font-bold">{currentLoss.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-white">梯度 ∂L/∂x:</span>
                <span className="text-red-400 font-bold">{currentGrad.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* 学习率 */}
          <div className="bg-gray-100 dark:bg-ml-bg-dark p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">
              学习率 α: <span className="text-ml-blue">{learningRate.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full accent-ml-blue"
            />
            <p className="text-xs text-white mt-2">
              更新规则: x ← x - α·∂L/∂x
            </p>
          </div>

          {/* 初始位置 */}
          <div className="bg-gray-100 dark:bg-ml-bg-dark p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">
              初始位置: <span className="text-yellow-400">{currentX.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              value={currentX}
              onChange={(e) => {
                setCurrentX(Number(e.target.value))
                setPath([])
                setIteration(0)
              }}
              disabled={isAnimating}
              className="w-full accent-yellow-500"
            />
          </div>

          {/* 控制按钮 */}
          <button
            onClick={runGradientDescent}
            disabled={isAnimating}
            className="w-full px-4 py-3 bg-ml-blue hover:bg-ml-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isAnimating ? `迭代中... (${iteration})` : '▶ 开始优化'}
          </button>

          <button
            onClick={() => {
              setPath([])
              setIteration(0)
            }}
            disabled={isAnimating}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            清除路径
          </button>
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-6 grid md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-100 dark:bg-ml-bg-dark p-3 rounded">
          <span className="text-ml-blue font-bold">━ 蓝色曲线</span>
          <p className="text-white mt-1">损失函数 L(x) = (x-2)² + 1</p>
        </div>
        <div className="bg-gray-100 dark:bg-ml-bg-dark p-3 rounded">
          <span className="text-yellow-500 font-bold">● 橙色圆点</span>
          <p className="text-white mt-1">当前参数位置</p>
        </div>
        <div className="bg-gray-100 dark:bg-ml-bg-dark p-3 rounded">
          <span className="text-red-400 font-bold">━ ━ 红色虚线</span>
          <p className="text-white mt-1">当前梯度方向（切线）</p>
        </div>
        <div className="bg-gray-100 dark:bg-ml-bg-dark p-3 rounded">
          <span className="text-purple-400 font-bold">· · · 紫色路径</span>
          <p className="text-white mt-1">优化轨迹</p>
        </div>
      </div>
    </div>
  )
}
