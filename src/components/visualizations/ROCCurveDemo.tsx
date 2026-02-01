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

  // 计算当前阈值下的混淆矩阵
  const [confusionMatrix, setConfusionMatrix] = useState({ tp: 0, fp: 0, tn: 0, fn: 0 })
  const [currentPoint, setCurrentPoint] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (data.length === 0) return

    const totalPositive = data.filter(d => d.label === 1).length
    const totalNegative = data.filter(d => d.label === 0).length

    const tp = data.filter(d => d.score >= threshold && d.label === 1).length
    const fp = data.filter(d => d.score >= threshold && d.label === 0).length
    const tn = data.filter(d => d.score < threshold && d.label === 0).length
    const fn = data.filter(d => d.score < threshold && d.label === 1).length

    setConfusionMatrix({ tp, fp, tn, fn })

    const tpr = tp / totalPositive
    const fpr = fp / totalNegative
    setCurrentPoint([fpr, tpr])
  }, [data, threshold])

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

    // 当前操作点（根据阈值）
    g.append('circle')
      .attr('cx', xScale(currentPoint[0]))
      .attr('cy', yScale(currentPoint[1]))
      .attr('r', 6)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)

    // 从操作点到坐标轴的辅助线
    g.append('line')
      .attr('x1', xScale(currentPoint[0]))
      .attr('y1', yScale(currentPoint[1]))
      .attr('x2', xScale(currentPoint[0]))
      .attr('y2', innerHeight)
      .attr('stroke', '#F59E0B')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1)
      .attr('opacity', 0.6)

    g.append('line')
      .attr('x1', xScale(currentPoint[0]))
      .attr('y1', yScale(currentPoint[1]))
      .attr('x2', 0)
      .attr('y2', yScale(currentPoint[1]))
      .attr('stroke', '#F59E0B')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1)
      .attr('opacity', 0.6)

    // AUC 文本
    g.append('text')
      .attr('x', innerWidth - 80)
      .attr('y', 30)
      .attr('fill', '#58C4DD')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text(`AUC = ${auc.toFixed(3)}`)

  }, [rocPoints, auc, threshold, currentPoint])

  // 计算评估指标
  const accuracy = data.length > 0
    ? (confusionMatrix.tp + confusionMatrix.tn) / data.length
    : 0
  const precision = (confusionMatrix.tp + confusionMatrix.fp) > 0
    ? confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fp)
    : 0
  const recall = (confusionMatrix.tp + confusionMatrix.fn) > 0
    ? confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fn)
    : 0
  const f1Score = (precision + recall) > 0
    ? 2 * (precision * recall) / (precision + recall)
    : 0

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
          className="w-full accent-ml-blue"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>0.00</span>
          <span>1.00</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROC 曲线图 */}
        <div className="lg:col-span-2">
          <div className="flex justify-center">
            <svg ref={svgRef} className="bg-ml-bg-dark rounded" />
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="space-y-4">
          {/* 混淆矩阵 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-ml-blue">混淆矩阵</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-green-900/30 border border-green-500 p-3 rounded">
                <div className="text-green-400 font-bold text-xl">{confusionMatrix.tp}</div>
                <div className="text-xs text-white">真正例 (TP)</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 p-3 rounded">
                <div className="text-red-400 font-bold text-xl">{confusionMatrix.fp}</div>
                <div className="text-xs text-white">假正例 (FP)</div>
              </div>
              <div className="bg-red-900/30 border border-red-500 p-3 rounded">
                <div className="text-red-400 font-bold text-xl">{confusionMatrix.fn}</div>
                <div className="text-xs text-white">假负例 (FN)</div>
              </div>
              <div className="bg-green-900/30 border border-green-500 p-3 rounded">
                <div className="text-green-400 font-bold text-xl">{confusionMatrix.tn}</div>
                <div className="text-xs text-white">真负例 (TN)</div>
              </div>
            </div>
          </div>

          {/* 评估指标 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-ml-blue">评估指标</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white">准确率 (Accuracy):</span>
                <span className="text-white font-bold">{(accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">精确率 (Precision):</span>
                <span className="text-white font-bold">{(precision * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">召回率 (Recall/TPR):</span>
                <span className="text-white font-bold">{(recall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">F1 分数:</span>
                <span className="text-white font-bold">{(f1Score * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-white">FPR:</span>
                <span className="text-white font-bold">{(currentPoint[0] * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* 当前操作点 */}
          <div className="bg-ml-bg-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-500">当前操作点</h3>
            <div className="text-sm space-y-1">
              <p className="text-white">
                TPR: <span className="text-white font-bold">{(currentPoint[1] * 100).toFixed(1)}%</span>
              </p>
              <p className="text-white">
                FPR: <span className="text-white font-bold">{(currentPoint[0] * 100).toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="mt-6 text-sm text-white space-y-2">
        <p>
          <strong className="text-ml-blue">AUC (Area Under Curve)</strong>:
          曲线下方面积，值越接近1，模型性能越好。当前 AUC = {auc.toFixed(3)}
        </p>
        <p>
          <strong className="text-ml-yellow">橙色圆点</strong>:
          表示当前阈值下的操作点，调整滑块可观察不同阈值对分类结果的影响
        </p>
        <p>
          <strong className="text-white">灰色虚线</strong>:
          表示随机猜测的性能基线（AUC = 0.5）
        </p>
      </div>
    </div>
  )
}
