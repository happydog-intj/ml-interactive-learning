'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  x: number
  y: number
  label: 1 | -1
}

export function SVMVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [kernelType, setKernelType] = useState<'linear' | 'rbf'>('linear')
  const [C, setC] = useState(1.0) // Regularization parameter
  const [showMargin, setShowMargin] = useState(true)
  const [showSupportVectors, setShowSupportVectors] = useState(true)

  // Generate sample data
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    // Generate linearly separable data
    const points: DataPoint[] = []

    // Class -1 (bottom-left)
    for (let i = 0; i < 25; i++) {
      points.push({
        x: Math.random() * 3 + 1,
        y: Math.random() * 3 + 1,
        label: -1
      })
    }

    // Class 1 (top-right)
    for (let i = 0; i < 25; i++) {
      points.push({
        x: Math.random() * 3 + 5,
        y: Math.random() * 3 + 5,
        label: 1
      })
    }

    setData(points)
  }, [])

  // Simple linear SVM simulation
  const computeLinearSVM = () => {
    // Find approximate decision boundary
    const class1 = data.filter(d => d.label === 1)
    const class2 = data.filter(d => d.label === -1)

    const mean1 = {
      x: class1.reduce((sum, d) => sum + d.x, 0) / class1.length,
      y: class1.reduce((sum, d) => sum + d.y, 0) / class1.length
    }

    const mean2 = {
      x: class2.reduce((sum, d) => sum + d.x, 0) / class2.length,
      y: class2.reduce((sum, d) => sum + d.y, 0) / class2.length
    }

    // Midpoint
    const midpoint = {
      x: (mean1.x + mean2.x) / 2,
      y: (mean1.y + mean2.y) / 2
    }

    // Slope perpendicular to line connecting means
    const dx = mean1.x - mean2.x
    const dy = mean1.y - mean2.y
    const slope = -dx / dy

    return { midpoint, slope }
  }

  // Find support vectors (closest points to boundary)
  const findSupportVectors = () => {
    const { midpoint, slope } = computeLinearSVM()

    // Calculate distance from each point to the line
    const distances = data.map(point => {
      // Distance from point to line: y = slope * (x - midpoint.x) + midpoint.y
      const b = midpoint.y - slope * midpoint.x
      const dist = Math.abs(slope * point.x - point.y + b) / Math.sqrt(slope * slope + 1)
      return { point, dist }
    })

    // Sort and find closest points from each class
    const class1Sorted = distances.filter(d => d.point.label === 1).sort((a, b) => a.dist - b.dist)
    const class2Sorted = distances.filter(d => d.point.label === -1).sort((a, b) => a.dist - b.dist)

    return [
      ...class1Sorted.slice(0, 2).map(d => d.point),
      ...class2Sorted.slice(0, 2).map(d => d.point)
    ]
  }

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const width = 700
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

    const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0])

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.selectAll('.domain, .tick line').attr('stroke', '#FFFFFF')

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('Feature x₁')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('Feature x₂')

    // Compute SVM
    const { midpoint, slope } = computeLinearSVM()
    const supportVectors = findSupportVectors()

    // Draw decision boundary
    const x1 = 0
    const x2 = 10
    const y1 = slope * (x1 - midpoint.x) + midpoint.y
    const y2 = slope * (x2 - midpoint.x) + midpoint.y

    g.append('line')
      .attr('x1', xScale(x1))
      .attr('y1', yScale(y1))
      .attr('x2', xScale(x2))
      .attr('y2', yScale(y2))
      .attr('stroke', '#00D9FF')
      .attr('stroke-width', 3)

    // Draw margins
    if (showMargin) {
      const margin_dist = 0.8 // Visual margin width

      // Upper margin
      const y1_upper = y1 + margin_dist
      const y2_upper = y2 + margin_dist

      g.append('line')
        .attr('x1', xScale(x1))
        .attr('y1', yScale(y1_upper))
        .attr('x2', xScale(x2))
        .attr('y2', yScale(y2_upper))
        .attr('stroke', '#00FF88')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.6)

      // Lower margin
      const y1_lower = y1 - margin_dist
      const y2_lower = y2 - margin_dist

      g.append('line')
        .attr('x1', xScale(x1))
        .attr('y1', yScale(y1_lower))
        .attr('x2', xScale(x2))
        .attr('y2', yScale(y2_lower))
        .attr('stroke', '#00FF88')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.6)

      // Margin region
      const marginPath = `
        M ${xScale(x1)} ${yScale(y1_upper)}
        L ${xScale(x2)} ${yScale(y2_upper)}
        L ${xScale(x2)} ${yScale(y2_lower)}
        L ${xScale(x1)} ${yScale(y1_lower)}
        Z
      `

      g.append('path')
        .attr('d', marginPath)
        .attr('fill', '#00FF88')
        .attr('opacity', 0.1)
    }

    // Draw data points
    g.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => d.label === 1 ? '#00D9FF' : '#FF3366')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)

    // Highlight support vectors
    if (showSupportVectors) {
      g.selectAll('.support-vector')
        .data(supportVectors)
        .enter()
        .append('circle')
        .attr('class', 'support-vector')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 10)
        .attr('fill', 'none')
        .attr('stroke', '#FFE600')
        .attr('stroke-width', 3)
    }

  }, [data, C, showMargin, showSupportVectors, kernelType])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border space-y-6">
        {/* Kernel Type */}
        <div>
          <label className="block text-sm font-semibold text-ml-cyan mb-3">
            核函数类型
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setKernelType('linear')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                kernelType === 'linear'
                  ? 'border-ml-cyan bg-ml-cyan/10'
                  : 'border-ml-border bg-ml-bg-card hover:border-ml-border/50'
              }`}
            >
              <div className="font-bold text-white">线性核</div>
              <div className="text-xs text-gray-100 mt-1">K(x,z) = x·z</div>
            </button>
            <button
              onClick={() => setKernelType('rbf')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                kernelType === 'rbf'
                  ? 'border-ml-cyan bg-ml-cyan/10'
                  : 'border-ml-border bg-ml-bg-card hover:border-ml-border/50'
              }`}
            >
              <div className="font-bold text-white">RBF核（高斯核）</div>
              <div className="text-xs text-gray-100 mt-1">K(x,z) = exp(-γ||x-z||²)</div>
            </button>
          </div>
        </div>

        {/* Regularization Parameter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-purple">
              正则化参数 C
            </label>
            <span className="text-xl font-bold text-white bg-ml-purple/20 px-3 py-1 rounded-lg">
              {C.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={C}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-purple"
          />
          <div className="text-xs text-gray-100">
            C越大，对误分类的惩罚越重（硬间隔）；C越小，容忍更多误分类（软间隔）
          </div>
        </div>

        {/* Display Options */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMargin}
              onChange={(e) => setShowMargin(e.target.checked)}
              className="w-4 h-4 accent-ml-green"
            />
            <span className="text-white text-sm">显示间隔</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSupportVectors}
              onChange={(e) => setShowSupportVectors(e.target.checked)}
              className="w-4 h-4 accent-ml-yellow"
            />
            <span className="text-white text-sm">高亮支持向量</span>
          </label>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border">
        <div className="flex justify-center">
          <svg ref={svgRef} />
        </div>
      </div>

      {/* Legend */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-ml-cyan"></div>
            <span className="text-white">正类 (+1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-ml-red"></div>
            <span className="text-white">负类 (-1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-ml-cyan"></div>
            <span className="text-white">决策边界</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-ml-yellow bg-transparent"></div>
            <span className="text-white">支持向量</span>
          </div>
        </div>
      </div>
    </div>
  )
}
