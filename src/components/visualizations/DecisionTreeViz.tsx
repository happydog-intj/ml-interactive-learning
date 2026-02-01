'use client'
import React, { useState, useMemo } from 'react'

// 数据点类型
interface DataPoint {
  x: number
  y: number
  label: 0 | 1
}

// 树节点类型
interface TreeNode {
  id: number
  feature: 'x' | 'y' | null
  threshold: number | null
  label: 0 | 1 | null
  samples: DataPoint[]
  entropy: number
  left?: TreeNode
  right?: TreeNode
  depth: number
}

// 划分标准类型
type SplitCriterion = 'entropy' | 'gini' | 'gain_ratio'

export function DecisionTreeViz() {
  // 预设数据集
  const [dataset] = useState<DataPoint[]>([
    // 类别 0 (蓝色) - 左下角
    { x: 2, y: 3, label: 0 },
    { x: 3, y: 2, label: 0 },
    { x: 2, y: 2, label: 0 },
    { x: 3, y: 3, label: 0 },
    { x: 1, y: 2, label: 0 },
    { x: 2, y: 1, label: 0 },
    { x: 1, y: 3, label: 0 },
    { x: 3, y: 1, label: 0 },
    // 类别 1 (红色) - 右上角
    { x: 7, y: 7, label: 1 },
    { x: 8, y: 8, label: 1 },
    { x: 7, y: 8, label: 1 },
    { x: 8, y: 7, label: 1 },
    { x: 6, y: 7, label: 1 },
    { x: 7, y: 6, label: 1 },
    { x: 9, y: 8, label: 1 },
    { x: 8, y: 9, label: 1 }
  ])

  const [criterion, setCriterion] = useState<SplitCriterion>('entropy')
  const [maxDepth, setMaxDepth] = useState(2)
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)

  // 计算信息熵
  const calculateEntropy = (samples: DataPoint[]): number => {
    if (samples.length === 0) return 0
    const p1 = samples.filter(s => s.label === 1).length / samples.length
    const p0 = 1 - p1
    if (p1 === 0 || p0 === 0) return 0
    return -p1 * Math.log2(p1) - p0 * Math.log2(p0)
  }

  // 计算基尼指数
  const calculateGini = (samples: DataPoint[]): number => {
    if (samples.length === 0) return 0
    const p1 = samples.filter(s => s.label === 1).length / samples.length
    const p0 = 1 - p1
    return 1 - (p1 * p1 + p0 * p0)
  }

  // 计算信息增益
  const calculateGain = (
    samples: DataPoint[],
    leftSamples: DataPoint[],
    rightSamples: DataPoint[]
  ): number => {
    const parentEntropy = calculateEntropy(samples)
    const leftWeight = leftSamples.length / samples.length
    const rightWeight = rightSamples.length / samples.length
    const childrenEntropy =
      leftWeight * calculateEntropy(leftSamples) +
      rightWeight * calculateEntropy(rightSamples)
    return parentEntropy - childrenEntropy
  }

  // 计算固有值 (Intrinsic Value)
  const calculateIV = (samples: DataPoint[], leftSamples: DataPoint[], rightSamples: DataPoint[]): number => {
    if (samples.length === 0) return 1
    const leftRatio = leftSamples.length / samples.length
    const rightRatio = rightSamples.length / samples.length
    let iv = 0
    if (leftRatio > 0) iv -= leftRatio * Math.log2(leftRatio)
    if (rightRatio > 0) iv -= rightRatio * Math.log2(rightRatio)
    return iv === 0 ? 1 : iv
  }

  // 找到最优划分
  const findBestSplit = (samples: DataPoint[], depth: number) => {
    if (samples.length === 0 || depth >= maxDepth) return null

    // 检查是否已经纯净
    const labels = samples.map(s => s.label)
    if (labels.every(l => l === labels[0])) return null

    let bestFeature: 'x' | 'y' | null = null
    let bestThreshold: number | null = null
    let bestScore = -Infinity

    // 尝试每个特征
    for (const feature of ['x', 'y'] as const) {
      const values = [...new Set(samples.map(s => s[feature]))].sort((a, b) => a - b)

      // 尝试每个可能的划分点
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2
        const leftSamples = samples.filter(s => s[feature] <= threshold)
        const rightSamples = samples.filter(s => s[feature] > threshold)

        if (leftSamples.length === 0 || rightSamples.length === 0) continue

        let score: number
        if (criterion === 'entropy') {
          score = calculateGain(samples, leftSamples, rightSamples)
        } else if (criterion === 'gini') {
          const leftWeight = leftSamples.length / samples.length
          const rightWeight = rightSamples.length / samples.length
          const parentGini = calculateGini(samples)
          const childrenGini =
            leftWeight * calculateGini(leftSamples) +
            rightWeight * calculateGini(rightSamples)
          score = parentGini - childrenGini
        } else {
          // gain_ratio
          const gain = calculateGain(samples, leftSamples, rightSamples)
          const iv = calculateIV(samples, leftSamples, rightSamples)
          score = gain / iv
        }

        if (score > bestScore) {
          bestScore = score
          bestFeature = feature
          bestThreshold = threshold
        }
      }
    }

    return bestFeature && bestThreshold !== null
      ? { feature: bestFeature, threshold: bestThreshold, score: bestScore }
      : null
  }

  // 构建决策树
  const buildTree = (samples: DataPoint[], depth: number, id: number): TreeNode => {
    const entropy = calculateEntropy(samples)
    const majorityLabel = samples.filter(s => s.label === 1).length >= samples.length / 2 ? 1 : 0

    const split = findBestSplit(samples, depth)

    if (!split) {
      return {
        id,
        feature: null,
        threshold: null,
        label: majorityLabel,
        samples,
        entropy,
        depth
      }
    }

    const leftSamples = samples.filter(s => s[split.feature] <= split.threshold)
    const rightSamples = samples.filter(s => s[split.feature] > split.threshold)

    return {
      id,
      feature: split.feature,
      threshold: split.threshold,
      label: null,
      samples,
      entropy,
      depth,
      left: buildTree(leftSamples, depth + 1, id * 2),
      right: buildTree(rightSamples, depth + 1, id * 2 + 1)
    }
  }

  const tree = useMemo(() => buildTree(dataset, 0, 1), [dataset, criterion, maxDepth])

  // 渲染树节点
  const renderNode = (node: TreeNode, x: number, y: number, width: number): React.ReactElement => {
    const isLeaf = !node.left && !node.right
    const isSelected = selectedNode?.id === node.id

    const nodeColor = isLeaf
      ? node.label === 1
        ? '#ef4444'
        : '#3b82f6'
      : '#8b5cf6'

    return (
      <g key={node.id}>
        {/* 连接线 */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={x - width / 2}
            y2={y + 80}
            stroke="#4b5563"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={x + width / 2}
            y2={y + 80}
            stroke="#4b5563"
            strokeWidth="2"
          />
        )}

        {/* 节点 */}
        <g
          onClick={() => setSelectedNode(node)}
          className="cursor-pointer"
        >
          <circle
            cx={x}
            cy={y}
            r="30"
            fill={nodeColor}
            opacity={isSelected ? 1 : 0.8}
            stroke={isSelected ? '#fbbf24' : 'none'}
            strokeWidth={isSelected ? 3 : 0}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-bold pointer-events-none"
          >
            {isLeaf ? `C${node.label}` : node.feature?.toUpperCase()}
          </text>
          {!isLeaf && (
            <text
              x={x}
              y={y + 12}
              textAnchor="middle"
              className="fill-white text-[10px] pointer-events-none"
            >
              ≤{node.threshold?.toFixed(1)}
            </text>
          )}
        </g>

        {/* 递归渲染子节点 */}
        {node.left && renderNode(node.left, x - width / 2, y + 80, width / 2)}
        {node.right && renderNode(node.right, x + width / 2, y + 80, width / 2)}
      </g>
    )
  }

  // 获取决策边界
  const getDecisionBoundaries = (node: TreeNode): { feature: 'x' | 'y'; threshold: number }[] => {
    const boundaries: { feature: 'x' | 'y'; threshold: number }[] = []

    const traverse = (n: TreeNode) => {
      if (n.feature && n.threshold !== null) {
        boundaries.push({ feature: n.feature, threshold: n.threshold })
      }
      if (n.left) traverse(n.left)
      if (n.right) traverse(n.right)
    }

    traverse(node)
    return boundaries
  }

  const boundaries = getDecisionBoundaries(tree)

  // 获取标准名称
  const getCriterionName = () => {
    switch (criterion) {
      case 'entropy': return '信息增益 (Information Gain)'
      case 'gini': return '基尼指数 (Gini Index)'
      case 'gain_ratio': return '信息增益率 (Gain Ratio)'
    }
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-ml-bg-dark p-4 rounded-lg border border-gray-700">
          <label className="block text-sm font-semibold text-white mb-2">
            划分标准
          </label>
          <select
            value={criterion}
            onChange={(e) => setCriterion(e.target.value as SplitCriterion)}
            className="w-full bg-ml-bg-secondary text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="entropy">信息增益 (ID3)</option>
            <option value="gain_ratio">信息增益率 (C4.5)</option>
            <option value="gini">基尼指数 (CART)</option>
          </select>
          <div className="mt-2 text-xs text-gray-400">
            当前使用: {getCriterionName()}
          </div>
        </div>

        <div className="bg-ml-bg-dark p-4 rounded-lg border border-gray-700">
          <label className="block text-sm font-semibold text-white mb-2">
            最大深度: {maxDepth}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={maxDepth}
            onChange={(e) => setMaxDepth(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      </div>

      {/* 主可视化区域 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 数据空间 */}
        <div className="bg-ml-bg-dark p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-3">特征空间与决策边界</h4>
          <svg width="100%" height="350" viewBox="0 0 350 350" className="bg-ml-bg-secondary rounded">
            {/* 坐标轴 */}
            <line x1="30" y1="320" x2="320" y2="320" stroke="#4b5563" strokeWidth="2" />
            <line x1="30" y1="30" x2="30" y2="320" stroke="#4b5563" strokeWidth="2" />

            {/* 坐标轴标签 */}
            <text x="175" y="345" textAnchor="middle" className="fill-gray-400 text-xs">
              特征 X
            </text>
            <text x="15" y="175" textAnchor="middle" className="fill-gray-400 text-xs" transform="rotate(-90 15 175)">
              特征 Y
            </text>

            {/* 决策边界 */}
            {boundaries.map((b, idx) => {
              const scale = 29
              const offset = 30
              if (b.feature === 'x') {
                const x = b.threshold * scale + offset
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1={30}
                    x2={x}
                    y2={320}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )
              } else {
                const y = 320 - (b.threshold * scale - offset)
                return (
                  <line
                    key={idx}
                    x1={30}
                    y1={y}
                    x2={320}
                    y2={y}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )
              }
            })}

            {/* 数据点 */}
            {dataset.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x * 29 + 30}
                cy={320 - (point.y * 29 - 30)}
                r="6"
                fill={point.label === 1 ? '#ef4444' : '#3b82f6'}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* 图例 */}
            <g transform="translate(240, 50)">
              <circle cx="0" cy="0" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
              <text x="12" y="4" className="fill-white text-xs">类别 0</text>
              <circle cx="0" cy="20" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
              <text x="12" y="24" className="fill-white text-xs">类别 1</text>
            </g>
          </svg>
        </div>

        {/* 决策树 */}
        <div className="bg-ml-bg-dark p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-3">决策树结构</h4>
          <svg width="100%" height="350" viewBox="0 0 350 350">
            {renderNode(tree, 175, 40, 140)}

            {/* 图例 */}
            <g transform="translate(20, 300)">
              <circle cx="8" cy="8" r="8" fill="#8b5cf6" opacity="0.8" />
              <text x="20" y="12" className="fill-white text-xs">内部节点</text>
              <circle cx="90" cy="8" r="8" fill="#3b82f6" opacity="0.8" />
              <text x="102" y="12" className="fill-white text-xs">叶节点(0)</text>
              <circle cx="180" cy="8" r="8" fill="#ef4444" opacity="0.8" />
              <text x="192" y="12" className="fill-white text-xs">叶节点(1)</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 节点详情 */}
      {selectedNode && (
        <div className="bg-gradient-to-br from-ml-purple/20 via-ml-blue/20 to-ml-cyan/20 p-6 rounded-xl border border-ml-blue/30">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">
              节点详情 {selectedNode.feature ? `(${selectedNode.feature.toUpperCase()} ≤ ${selectedNode.threshold?.toFixed(2)})` : '(叶节点)'}
            </h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-ml-bg-dark p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">样本数量</div>
              <div className="text-2xl font-bold text-white">{selectedNode.samples.length}</div>
            </div>
            <div className="bg-ml-bg-dark p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">信息熵</div>
              <div className="text-2xl font-bold text-ml-cyan">{selectedNode.entropy.toFixed(3)}</div>
            </div>
            <div className="bg-ml-bg-dark p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">深度</div>
              <div className="text-2xl font-bold text-ml-purple">{selectedNode.depth}</div>
            </div>
          </div>

          <div className="mt-4 bg-ml-bg-dark p-4 rounded-lg">
            <div className="text-sm font-semibold text-white mb-2">类别分布</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-white">
                  类别 0: {selectedNode.samples.filter(s => s.label === 0).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-white">
                  类别 1: {selectedNode.samples.filter(s => s.label === 1).length}
                </span>
              </div>
            </div>
          </div>

          {!selectedNode.feature && selectedNode.label !== null && (
            <div className="mt-4 bg-ml-green/20 border border-ml-green/50 p-3 rounded-lg">
              <div className="text-sm text-white">
                <strong className="text-ml-green">预测类别:</strong> {selectedNode.label}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 提示 */}
      <div className="bg-ml-purple/10 border border-ml-purple/30 p-4 rounded-lg">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1 text-sm text-gray-100">
            <p className="font-semibold text-white mb-2">使用说明：</p>
            <ul className="space-y-1">
              <li>• 左图显示特征空间，黄色虚线是决策边界</li>
              <li>• 右图显示决策树结构，点击节点查看详细信息</li>
              <li>• 尝试不同的划分标准和深度，观察树结构的变化</li>
              <li>• 信息增益率对取值多的属性惩罚更强，可缓解过拟合</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
