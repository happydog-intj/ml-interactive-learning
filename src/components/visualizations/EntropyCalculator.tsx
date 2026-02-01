'use client'
import { useState, useMemo } from 'react'

interface ClassCount {
  name: string
  count: number
  color: string
}

export function EntropyCalculator() {
  const [classes, setClasses] = useState<ClassCount[]>([
    { name: '正类', count: 50, color: '#3b82f6' },
    { name: '负类', count: 50, color: '#ef4444' }
  ])

  // 计算信息熵
  const entropy = useMemo(() => {
    const total = classes.reduce((sum, c) => sum + c.count, 0)
    if (total === 0) return 0

    let ent = 0
    for (const c of classes) {
      if (c.count > 0) {
        const p = c.count / total
        ent -= p * Math.log2(p)
      }
    }
    return ent
  }, [classes])

  // 计算最大熵（用于归一化进度条）
  const maxEntropy = Math.log2(classes.length)

  // 更新类别计数
  const updateCount = (index: number, value: number) => {
    const newClasses = [...classes]
    newClasses[index].count = Math.max(0, Math.min(100, value))
    setClasses(newClasses)
  }

  // 添加类别
  const addClass = () => {
    if (classes.length >= 5) return
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
    setClasses([
      ...classes,
      {
        name: `类别 ${classes.length + 1}`,
        count: 20,
        color: colors[classes.length % colors.length]
      }
    ])
  }

  // 移除类别
  const removeClass = (index: number) => {
    if (classes.length <= 2) return
    setClasses(classes.filter((_, i) => i !== index))
  }

  const total = classes.reduce((sum, c) => sum + c.count, 0)

  // 获取熵的描述
  const getEntropyDescription = () => {
    if (entropy < 0.3) return { text: '极低 - 数据非常纯', color: 'text-ml-green' }
    if (entropy < 0.7) return { text: '较低 - 数据较纯', color: 'text-ml-cyan' }
    if (entropy < 1.2) return { text: '中等 - 数据混合', color: 'text-ml-yellow' }
    if (entropy < 1.8) return { text: '较高 - 数据很混乱', color: 'text-ml-red' }
    return { text: '极高 - 数据极度混乱', color: 'text-ml-red' }
  }

  const entropyDesc = getEntropyDescription()

  return (
    <div className="space-y-6">
      {/* 熵值显示 */}
      <div className="bg-gradient-to-br from-ml-purple/20 via-ml-blue/20 to-ml-cyan/20 p-6 rounded-xl border border-ml-blue/30">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-300 mb-2">当前信息熵</div>
          <div className="text-5xl font-bold text-white mb-2">
            {entropy.toFixed(3)}
          </div>
          <div className={`text-sm font-semibold ${entropyDesc.color}`}>
            {entropyDesc.text}
          </div>
        </div>

        {/* 熵值进度条 */}
        <div className="relative h-8 bg-ml-bg-dark rounded-lg overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-ml-green via-ml-yellow to-ml-red transition-all duration-300"
            style={{ width: `${(entropy / maxEntropy) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-semibold text-white">
            <span>0 (完全纯)</span>
            <span>{maxEntropy.toFixed(2)} (最混乱)</span>
          </div>
        </div>
      </div>

      {/* 公式显示 */}
      <div className="bg-ml-bg-dark p-4 rounded-lg border border-ml-blue/20">
        <div className="text-center mb-3">
          <div className="text-xl font-mono text-ml-cyan mb-2">
            Ent(D) = -Σ p<sub>k</sub> log<sub>2</sub> p<sub>k</sub>
          </div>
          <div className="text-sm text-gray-300">
            计算过程：
          </div>
        </div>
        <div className="space-y-1 text-sm font-mono">
          {classes.map((c, idx) => {
            const p = total > 0 ? c.count / total : 0
            const contribution = p > 0 ? -p * Math.log2(p) : 0
            return (
              <div key={idx} className="flex items-center justify-between text-gray-200">
                <span style={{ color: c.color }}>
                  p<sub>{idx + 1}</sub> = {c.count}/{total} = {p.toFixed(3)}
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-white">
                  -{p.toFixed(3)} × log<sub>2</sub>({p.toFixed(3)}) = {contribution.toFixed(3)}
                </span>
              </div>
            )
          })}
          <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-bold text-white">
            <span>总和 =</span>
            <span>{entropy.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* 类别控制 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">调整类别分布</h4>
          <div className="text-sm text-gray-300">
            总样本数: <span className="text-ml-cyan font-bold">{total}</span>
          </div>
        </div>

        {classes.map((c, idx) => (
          <div key={idx} className="bg-ml-bg-dark p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: c.color }}
                />
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    const newClasses = [...classes]
                    newClasses[idx].name = e.target.value
                    setClasses(newClasses)
                  }}
                  className="bg-ml-bg-secondary text-white px-2 py-1 rounded border border-gray-600 text-sm w-24"
                />
                <span className="text-sm text-gray-300">
                  样本数: <span className="text-white font-semibold">{c.count}</span>
                </span>
                <span className="text-sm text-gray-400">
                  ({total > 0 ? ((c.count / total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              {classes.length > 2 && (
                <button
                  onClick={() => removeClass(idx)}
                  className="text-ml-red hover:text-red-400 text-sm px-2 py-1 rounded hover:bg-ml-red/10 transition-colors"
                >
                  删除
                </button>
              )}
            </div>

            {/* 滑块 */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={c.count}
                onChange={(e) => updateCount(idx, parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${c.color} 0%, ${c.color} ${c.count}%, #374151 ${c.count}%, #374151 100%)`
                }}
              />
            </div>

            {/* 数值输入 */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateCount(idx, c.count - 5)}
                className="bg-ml-bg-secondary text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                -5
              </button>
              <input
                type="number"
                min="0"
                max="100"
                value={c.count}
                onChange={(e) => updateCount(idx, parseInt(e.target.value) || 0)}
                className="flex-1 bg-ml-bg-secondary text-white px-3 py-1 rounded text-center border border-gray-600"
              />
              <button
                onClick={() => updateCount(idx, c.count + 5)}
                className="bg-ml-bg-secondary text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                +5
              </button>
            </div>
          </div>
        ))}

        {/* 添加类别按钮 */}
        {classes.length < 5 && (
          <button
            onClick={addClass}
            className="w-full bg-ml-blue/20 hover:bg-ml-blue/30 text-ml-blue border border-ml-blue/50 py-2 rounded-lg transition-colors font-semibold"
          >
            + 添加类别
          </button>
        )}
      </div>

      {/* 可视化饼图 */}
      <div className="bg-ml-bg-dark p-6 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 text-center">类别分布</h4>
        <div className="flex justify-center">
          <svg width="280" height="280" viewBox="-140 -140 280 280">
            {total > 0 && (() => {
              let currentAngle = -Math.PI / 2
              return classes.map((c, idx) => {
                const percentage = c.count / total
                const angle = percentage * 2 * Math.PI
                const endAngle = currentAngle + angle

                const largeArc = angle > Math.PI ? 1 : 0

                const x1 = 120 * Math.cos(currentAngle)
                const y1 = 120 * Math.sin(currentAngle)
                const x2 = 120 * Math.cos(endAngle)
                const y2 = 120 * Math.sin(endAngle)

                const path = `M 0 0 L ${x1} ${y1} A 120 120 0 ${largeArc} 1 ${x2} ${y2} Z`

                // 标签位置
                const labelAngle = currentAngle + angle / 2
                const labelRadius = 80
                const labelX = labelRadius * Math.cos(labelAngle)
                const labelY = labelRadius * Math.sin(labelAngle)

                currentAngle = endAngle

                return (
                  <g key={idx}>
                    <path d={path} fill={c.color} opacity={0.8} />
                    {percentage > 0.05 && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-sm font-semibold"
                      >
                        {(percentage * 100).toFixed(0)}%
                      </text>
                    )}
                  </g>
                )
              })
            })()}
          </svg>
        </div>
      </div>

      {/* 提示 */}
      <div className="bg-ml-blue/10 border border-ml-blue/30 p-4 rounded-lg">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1 text-sm text-gray-100">
            <p className="font-semibold text-white mb-2">观察要点：</p>
            <ul className="space-y-1">
              <li>• 当所有样本属于一个类别时，熵为 0（完全纯）</li>
              <li>• 当各类别样本数量相等时，熵达到最大值（最混乱）</li>
              <li>• 信息熵衡量的是数据集的不确定性或混乱程度</li>
              <li>• 决策树的目标是通过划分降低熵，使子节点更"纯"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
