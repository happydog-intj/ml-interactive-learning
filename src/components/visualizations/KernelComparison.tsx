'use client'

import { useState } from 'react'

type KernelType = 'linear' | 'polynomial' | 'rbf' | 'sigmoid'

interface KernelInfo {
  name: string
  displayName: string
  formula: string
  description: string
  parameters: string
  advantages: string[]
  disadvantages: string[]
  useCase: string
}

const kernelInfo: Record<KernelType, KernelInfo> = {
  linear: {
    name: 'linear',
    displayName: '线性核',
    formula: 'K(x, z) = x · z',
    description: '最简单的核函数，对应线性SVM，适用于线性可分问题',
    parameters: '无参数',
    advantages: [
      '计算速度最快',
      '模型可解释性强',
      '适合高维稀疏数据（如文本）',
      '不容易过拟合'
    ],
    disadvantages: [
      '只能处理线性可分问题',
      '表达能力有限',
      '对非线性数据效果差'
    ],
    useCase: '文本分类、线性可分的二分类问题'
  },
  polynomial: {
    name: 'polynomial',
    displayName: '多项式核',
    formula: 'K(x, z) = (γ·x·z + r)^d',
    description: '可以处理非线性问题，相当于在高维空间中构造多项式特征',
    parameters: 'd: 多项式次数, γ: 系数, r: 常数项',
    advantages: [
      '可以捕捉特征间的交互作用',
      '适合特征维度不是很高的数据',
      '通过调整d可以控制复杂度'
    ],
    disadvantages: [
      '参数较多，调参困难',
      '高次多项式容易过拟合',
      '计算复杂度随d增长快'
    ],
    useCase: '图像识别、自然语言处理中的特征交互建模'
  },
  rbf: {
    name: 'rbf',
    displayName: 'RBF核（高斯核）',
    formula: 'K(x, z) = exp(-γ·||x-z||²)',
    description: '最常用的核函数，可以将数据映射到无穷维空间',
    parameters: 'γ: 核宽度参数，控制影响范围',
    advantages: [
      '可以处理任意非线性问题',
      '只有一个超参数γ',
      '适用于大多数情况',
      '决策边界平滑'
    ],
    disadvantages: [
      'γ选择很关键，需要仔细调参',
      'γ过大导致过拟合，过小导致欠拟合',
      '计算开销相对较大'
    ],
    useCase: '通用分类问题、模式识别、生物信息学'
  },
  sigmoid: {
    name: 'sigmoid',
    displayName: 'Sigmoid核',
    formula: 'K(x, z) = tanh(γ·x·z + r)',
    description: '源于神经网络，但在SVM中不总是正定的',
    parameters: 'γ: 斜率参数, r: 偏移参数',
    advantages: [
      '类似于神经网络的激活函数',
      '可以近似某些神经网络'
    ],
    disadvantages: [
      '不总是正定的，可能导致训练不收敛',
      '实际应用较少',
      '效果通常不如RBF核'
    ],
    useCase: '神经网络相关的研究、某些特定的信号处理任务'
  }
}

export function KernelComparison() {
  const [selectedKernel, setSelectedKernel] = useState<KernelType>('rbf')

  const current = kernelInfo[selectedKernel]

  return (
    <div className="space-y-6">
      {/* Kernel Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(kernelInfo) as KernelType[]).map((key) => {
          const kernel = kernelInfo[key]
          const isSelected = selectedKernel === key

          return (
            <button
              key={key}
              onClick={() => setSelectedKernel(key)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-ml-cyan bg-ml-cyan/10 scale-105'
                  : 'border-ml-border bg-ml-bg-card hover:border-ml-border/50'
              }`}
            >
              <div className="font-bold text-white mb-1">{kernel.displayName}</div>
              <div className="text-xs text-gray-100 font-mono">{kernel.formula}</div>
            </button>
          )
        })}
      </div>

      {/* Kernel Details */}
      <div className="bg-gradient-to-br from-ml-cyan/10 to-ml-blue/10 border-2 border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-ml-cyan mb-3">{current.displayName}</h3>

        <div className="space-y-4">
          {/* Formula */}
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <div className="text-sm text-gray-100 mb-2">核函数公式:</div>
            <div className="text-white font-mono text-lg">{current.formula}</div>
          </div>

          {/* Description */}
          <p className="text-gray-100">{current.description}</p>

          {/* Parameters */}
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <div className="text-sm font-bold text-ml-yellow mb-2">参数说明:</div>
            <div className="text-white text-sm">{current.parameters}</div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-green mb-3 flex items-center gap-2">
                <span>✅</span> 优点
              </h4>
              <ul className="space-y-2">
                {current.advantages.map((adv, idx) => (
                  <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                    <span className="text-ml-green mt-1">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-red mb-3 flex items-center gap-2">
                <span>⚠️</span> 缺点
              </h4>
              <ul className="space-y-2">
                {current.disadvantages.map((dis, idx) => (
                  <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                    <span className="text-ml-red mt-1">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Use Case */}
          <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-lg p-4">
            <div className="text-sm font-bold text-ml-blue mb-2">典型应用场景:</div>
            <div className="text-white text-sm">{current.useCase}</div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-ml-bg-secondary border-b border-ml-border">
                <th className="px-4 py-3 text-left text-white font-bold">核函数</th>
                <th className="px-4 py-3 text-left text-white font-bold">计算复杂度</th>
                <th className="px-4 py-3 text-left text-white font-bold">参数数量</th>
                <th className="px-4 py-3 text-left text-white font-bold">非线性能力</th>
                <th className="px-4 py-3 text-left text-white font-bold">推荐度</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ml-border hover:bg-ml-bg-secondary transition-colors">
                <td className="px-4 py-3 font-bold text-ml-cyan">线性核</td>
                <td className="px-4 py-3 text-ml-green">低</td>
                <td className="px-4 py-3 text-gray-100">0</td>
                <td className="px-4 py-3 text-ml-red">无</td>
                <td className="px-4 py-3 text-ml-yellow">⭐⭐⭐</td>
              </tr>
              <tr className="border-b border-ml-border hover:bg-ml-bg-secondary transition-colors">
                <td className="px-4 py-3 font-bold text-ml-purple">多项式核</td>
                <td className="px-4 py-3 text-ml-yellow">中</td>
                <td className="px-4 py-3 text-gray-100">3</td>
                <td className="px-4 py-3 text-ml-yellow">中等</td>
                <td className="px-4 py-3 text-ml-yellow">⭐⭐</td>
              </tr>
              <tr className="border-b border-ml-border hover:bg-ml-bg-secondary transition-colors">
                <td className="px-4 py-3 font-bold text-ml-blue">RBF核</td>
                <td className="px-4 py-3 text-ml-yellow">中</td>
                <td className="px-4 py-3 text-gray-100">1</td>
                <td className="px-4 py-3 text-ml-green">强</td>
                <td className="px-4 py-3 text-ml-green">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr className="hover:bg-ml-bg-secondary transition-colors">
                <td className="px-4 py-3 font-bold text-ml-orange">Sigmoid核</td>
                <td className="px-4 py-3 text-ml-yellow">中</td>
                <td className="px-4 py-3 text-gray-100">2</td>
                <td className="px-4 py-3 text-ml-yellow">中等</td>
                <td className="px-4 py-3 text-ml-red">⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-ml-yellow mb-2">核函数选择建议</h5>
            <ul className="space-y-1 text-gray-100 text-sm">
              <li>• <strong className="text-white">首选RBF核</strong>：适用于大多数情况，只需调整一个参数γ</li>
              <li>• <strong className="text-white">高维稀疏数据</strong>：使用线性核（如文本分类）</li>
              <li>• <strong className="text-white">小数据集</strong>：可以尝试多项式核</li>
              <li>• <strong className="text-white">先简单后复杂</strong>：从线性核开始，再尝试RBF核</li>
              <li>• <strong className="text-white">交叉验证</strong>：通过网格搜索找到最佳参数</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
