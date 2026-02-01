'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface LineDataPoint {
  x: number
  y: number
}

export interface LineChartProps {
  data: LineDataPoint[]
  width?: number
  height?: number
  xLabel?: string
  yLabel?: string
  title?: string
  color?: string
  showGrid?: boolean
  showPoints?: boolean
}

export function LineChart({
  data,
  width = 600,
  height = 400,
  xLabel = 'x',
  yLabel = 'y',
  title,
  color = '#58C4DD',
  showGrid = true,
  showPoints = false
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const margin = { top: title ? 40 : 20, right: 20, bottom: 50, left: 60 }

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
      .domain(xExtent)
      .range([0, innerWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([innerHeight, 0])
      .nice()

    // 网格线
    if (showGrid) {
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
    }

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
      .text(xLabel)

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
      .text(yLabel)

    // 标题
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(title)
    }

    // 绘制折线
    const line = d3.line<LineDataPoint>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2.5)
      .attr('d', line)

    // 绘制数据点
    if (showPoints) {
      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5)
    }

  }, [data, width, height, xLabel, yLabel, title, color, showGrid, showPoints])

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} className="bg-gray-100 dark:bg-ml-bg-dark rounded" />
    </div>
  )
}
