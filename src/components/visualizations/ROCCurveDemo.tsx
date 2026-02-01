'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  score: number
  label: number
}

export function ROCCurveDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [threshold, setThreshold] = useState(0.5)
  const [data, setData] = useState<DataPoint[]>([])
  const [rocPoints, setRocPoints] = useState<Array<[number, number]>>([])
  const [auc, setAuc] = useState(0)

  // 生成模拟数据
  useEffect(() => {
    const generateData = () => {
      const points: DataPoint[] = []
      // 正类（label=1）：分数偏高
      for (let i = 0; i < 100; i++) {
        points.push({
          score: Math.random() * 0.5 + 0.5,
          label: 1
        })
      }
      // 负类（label=0）：分数偏低
      for (let i = 0; i < 100; i++) {
        points.push({
          score: Math.random() * 0.5,
          label: 0
        })
      }
      return points.sort((a, b) => b.score - a.score)
    }
    setData(generateData())
  }, [])

  // 计算 ROC 曲线点
  useEffect(() => {
    if (data.length === 0) return

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100)
    const points: Array<[number, number]> = []
    
    const totalPositive = data.filter(d => d.label === 1).length
    const totalNegative = data.filter(d => d.label === 0).length

    thresholds.forEach(thresh => {
      const tp = data.filter(d => d.score >= thresh && d.label === 1).length
      const fp = data.filter(d => d.score >= thresh && d.label === 0).length
      
      const tpr = tp / totalPositive
      const fpr = fp / totalNegative
      
      points.push([fpr, tpr])
    })

    setRocPoints(points)

    // 计算 AUC（梯形法则）
    let aucValue = 0
    for (let i = 1; i < points.length; i++) {
      const width = points[i][0] - points[i - 1][0]
      const height = (points[i][1] + points[i - 1][1]) / 2
      aucValue += width * height
    }
    setAuc(aucValue)
  }, [data])

  // 绘制 ROC 曲线
  useEffect(() => {
    if (!svgRef.current || rocPoints.length === 0) return

    const width = 600
    const height = 600
    const margin = { top: 40, right: 40, bottom: 60, left: 60 }

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
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0])

    // X 轴
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('假正例率 (FPR)')

    // Y 轴
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', '#FFFFFF')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .text('真正例率 (TPR)')

    // 对角线（随机猜测）
    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight)
      .attr('x2', innerWidth)
      .attr('y2', 0)
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke-width', 1)

    // ROC 曲线
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    const path = g.append('path')
      .datum(rocPoints)
      .attr('fill', 'none')
      .attr('stroke', '#58C4DD')
      .attr('stroke-width', 3)
      .attr('d', line)

    // 动画效果
    const totalLength = path.node()?.getTotalLength() || 0
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0)

    // AUC 区域填充
    const area = d3.area<[number, number]>()
      .x(d => xScale(d[0]))
      .y0(innerHeight)
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(rocPoints)
      .attr('fill', '#58C4DD')
      .attr('opacity', 0.2)
      .attr('d', area)

    // AUC 文本
    g.append('text')
      .attr('x', innerWidth - 80)
      .attr('y', 30)
      .attr('fill', '#58C4DD')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text(`AUC = ${auc.toFixed(3)}`)

  }, [rocPoints, auc])

  return (
    <div className="bg-ml-bg-secondary p-6 rounded-lg">
      {/* 控制面板 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          分类阈值: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.00</span>
          <span>1.00</span>
        </div>
      </div>

      {/* ROC 曲线图 */}
      <div className="flex justify-center">
        <svg ref={svgRef} className="bg-ml-bg-dark rounded" />
      </div>

      {/* 说明文字 */}
      <div className="mt-6 text-sm text-gray-300">
        <p className="mb-2">
          <strong className="text-ml-blue">AUC (Area Under Curve)</strong>: 
          曲线下方面积，值越接近1，模型性能越好
        </p>
        <p>
          <strong className="text-ml-yellow">虚线</strong>: 
          表示随机猜测的性能（AUC = 0.5）
        </p>
      </div>
    </div>
  )
}
