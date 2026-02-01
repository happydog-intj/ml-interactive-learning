'use client'

import { useState } from 'react'

interface Example {
  天气: string
  温度: string
  湿度: string
  风力: string
  打球: string
}

interface Rule {
  conditions: { feature: string, value: string }[]
  conclusion: string
  coverage: number
  accuracy: number
}

const data: Example[] = [
  { 天气: '晴', 温度: '高', 湿度: '高', 风力: '弱', 打球: '否' },
  { 天气: '晴', 温度: '高', 湿度: '高', 风力: '强', 打球: '否' },
  { 天气: '阴', 温度: '高', 湿度: '高', 风力: '弱', 打球: '是' },
  { 天气: '雨', 温度: '适中', 湿度: '高', 风力: '弱', 打球: '是' },
  { 天气: '雨', 温度: '低', 湿度: '正常', 风力: '弱', 打球: '是' },
  { 天气: '雨', 温度: '低', 湿度: '正常', 风力: '强', 打球: '否' },
  { 天气: '阴', 温度: '低', 湿度: '正常', 风力: '强', 打球: '是' },
  { 天气: '晴', 温度: '适中', 湿度: '高', 风力: '弱', 打球: '否' },
  { 天气: '晴', 温度: '低', 湿度: '正常', 风力: '弱', 打球: '是' },
  { 天气: '雨', 温度: '适中', 湿度: '正常', 风力: '弱', 打球: '是' },
  { 天气: '晴', 温度: '适中', 湿度: '正常', 风力: '强', 打球: '是' },
  { 天气: '阴', 温度: '适中', 湿度: '高', 风力: '强', 打球: '是' },
  { 天气: '阴', 温度: '高', 湿度: '正常', 风力: '弱', 打球: '是' },
  { 天气: '雨', 温度: '适中', 湿度: '高', 风力: '强', 打球: '否' },
]

export function RuleLearningDemo() {
  const [rules, setRules] = useState<Rule[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedExample, setSelectedExample] = useState<number | null>(null)

  // Simple rule learning (greedy)
  const learnRules = () => {
    const newRules: Rule[] = []

    // Rule 1: 如果湿度=正常，则打球=是
    const rule1Examples = data.filter(d => d.湿度 === '正常')
    const rule1Correct = rule1Examples.filter(d => d.打球 === '是').length

    newRules.push({
      conditions: [{ feature: '湿度', value: '正常' }],
      conclusion: '是',
      coverage: rule1Examples.length,
      accuracy: (rule1Correct / rule1Examples.length) * 100
    })

    // Rule 2: 如果天气=阴，则打球=是
    const rule2Examples = data.filter(d => d.天气 === '阴')
    const rule2Correct = rule2Examples.filter(d => d.打球 === '是').length

    newRules.push({
      conditions: [{ feature: '天气', value: '阴' }],
      conclusion: '是',
      coverage: rule2Examples.length,
      accuracy: (rule2Correct / rule2Examples.length) * 100
    })

    // Rule 3: 如果天气=雨 且 风力=强，则打球=否
    const rule3Examples = data.filter(d => d.天气 === '雨' && d.风力 === '强')
    const rule3Correct = rule3Examples.filter(d => d.打球 === '否').length

    newRules.push({
      conditions: [
        { feature: '天气', value: '雨' },
        { feature: '风力', value: '强' }
      ],
      conclusion: '否',
      coverage: rule3Examples.length,
      accuracy: (rule3Correct / rule3Examples.length) * 100
    })

    // Default rule
    newRules.push({
      conditions: [],
      conclusion: '是',
      coverage: data.length,
      accuracy: (data.filter(d => d.打球 === '是').length / data.length) * 100
    })

    setRules(newRules)
  }

  // Check which rule applies to an example
  const getApplicableRule = (example: Example): Rule | null => {
    for (const rule of rules) {
      if (rule.conditions.length === 0) continue  // Skip default rule

      const matches = rule.conditions.every(cond => {
        const key = cond.feature as keyof Example
        return example[key] === cond.value
      })

      if (matches) return rule
    }

    // Return default rule
    return rules[rules.length - 1] || null
  }

  // Render rule as text
  const renderRule = (rule: Rule, index: number) => {
    if (rule.conditions.length === 0) {
      return (
        <div
          key={index}
          className="bg-ml-bg-dark border border-ml-yellow/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-ml-yellow text-2xl">🏁</span>
            <span className="text-sm font-bold text-ml-yellow">默认规则</span>
          </div>
          <div className="font-mono text-sm text-gray-100">
            <span className="text-ml-purple">THEN</span>{' '}
            <span className="text-ml-green">打球 = {rule.conclusion}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-ml-border flex justify-between text-xs">
            <span className="text-gray-400">覆盖率: {rule.coverage} 个样本</span>
            <span className="text-ml-cyan">准确率: {rule.accuracy.toFixed(1)}%</span>
          </div>
        </div>
      )
    }

    return (
      <div
        key={index}
        className="bg-ml-bg-dark border border-ml-cyan/30 rounded-lg p-4 hover:border-ml-cyan transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-ml-cyan text-2xl">📏</span>
          <span className="text-sm font-bold text-white">规则 {index + 1}</span>
        </div>
        <div className="font-mono text-sm text-gray-100">
          <span className="text-ml-yellow">IF</span>{' '}
          {rule.conditions.map((cond, i) => (
            <span key={i}>
              {i > 0 && <span className="text-ml-purple"> AND </span>}
              <span className="text-ml-cyan">{cond.feature}</span>
              <span> = </span>
              <span className="text-white font-bold">{cond.value}</span>
            </span>
          ))}
          <br />
          <span className="text-ml-purple">THEN</span>{' '}
          <span className={rule.conclusion === '是' ? 'text-ml-green' : 'text-ml-red'}>
            打球 = {rule.conclusion}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-ml-border flex justify-between text-xs">
          <span className="text-gray-400">覆盖: {rule.coverage} 样本</span>
          <span className="text-ml-cyan">准确率: {rule.accuracy.toFixed(1)}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control */}
      <div className="flex gap-3">
        <button
          onClick={learnRules}
          className="px-6 py-3 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors"
        >
          🧠 学习规则
        </button>
      </div>

      {/* Learned Rules */}
      {rules.length > 0 && (
        <div className="bg-ml-bg-card border-2 border-ml-purple/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-ml-purple mb-4">学到的规则</h3>
          <div className="space-y-3">
            {rules.map((rule, idx) => renderRule(rule, idx))}
          </div>
        </div>
      )}

      {/* Data Table with rule application */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">训练数据 (点击查看应用的规则)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ml-border">
                <th className="text-left py-2 px-3 text-gray-400 font-bold">#</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">天气</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">温度</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">湿度</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">风力</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">打球</th>
                {rules.length > 0 && (
                  <th className="text-left py-2 px-3 text-gray-400 font-bold">预测</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((example, idx) => {
                const rule = rules.length > 0 ? getApplicableRule(example) : null
                const prediction = rule?.conclusion || '?'
                const correct = prediction === example.打球

                return (
                  <tr
                    key={idx}
                    className={`border-b border-ml-border/50 cursor-pointer transition-colors ${
                      selectedExample === idx
                        ? 'bg-ml-cyan/10'
                        : 'hover:bg-ml-bg-dark'
                    }`}
                    onClick={() => setSelectedExample(selectedExample === idx ? null : idx)}
                  >
                    <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                    <td className="py-2 px-3 text-gray-100">{example.天气}</td>
                    <td className="py-2 px-3 text-gray-100">{example.温度}</td>
                    <td className="py-2 px-3 text-gray-100">{example.湿度}</td>
                    <td className="py-2 px-3 text-gray-100">{example.风力}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          example.打球 === '是'
                            ? 'bg-ml-green/20 text-ml-green'
                            : 'bg-ml-red/20 text-ml-red'
                        }`}
                      >
                        {example.打球}
                      </span>
                    </td>
                    {rules.length > 0 && (
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            correct
                              ? 'bg-ml-green/20 text-ml-green'
                              : 'bg-ml-red/20 text-ml-red'
                          }`}
                        >
                          {prediction} {correct ? '✓' : '✗'}
                        </span>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Show applied rule for selected example */}
        {selectedExample !== null && rules.length > 0 && (
          <div className="mt-4 p-4 bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg">
            <div className="text-sm font-bold text-ml-cyan mb-2">
              应用于样本 {selectedExample + 1} 的规则：
            </div>
            {(() => {
              const example = data[selectedExample]
              const rule = getApplicableRule(example)

              if (!rule) return <p className="text-sm text-gray-100">无匹配规则</p>

              if (rule.conditions.length === 0) {
                return (
                  <div className="font-mono text-sm text-gray-100">
                    <span className="text-ml-yellow">默认规则</span>
                  </div>
                )
              }

              return (
                <div className="font-mono text-sm text-gray-100">
                  <span className="text-ml-yellow">IF</span>{' '}
                  {rule.conditions.map((cond, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-ml-purple"> AND </span>}
                      <span className="text-ml-cyan">{cond.feature}</span>
                      <span> = </span>
                      <span className="text-white font-bold">{cond.value}</span>
                    </span>
                  ))}
                  <br />
                  <span className="text-ml-purple">THEN</span>{' '}
                  <span
                    className={
                      rule.conclusion === '是' ? 'text-ml-green' : 'text-ml-red'
                    }
                  >
                    打球 = {rule.conclusion}
                  </span>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Algorithm explanation */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-yellow mb-3">💡 序贯覆盖算法</h4>

        <div className="space-y-3 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-3">
            <h5 className="text-ml-cyan font-bold mb-2">算法流程</h5>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>初始化：规则集R = ∅，训练集D' = D</li>
              <li>While D'不为空：</li>
              <li className="ml-6">• 学习一条规则r，尽可能准确覆盖D'中的样本</li>
              <li className="ml-6">• 将r加入规则集：R = R ∪ {'{r}'}</li>
              <li className="ml-6">• 从D'中移除被r覆盖的样本</li>
              <li>返回规则集R</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-ml-bg-dark rounded-lg p-3">
              <h5 className="text-ml-green font-bold mb-2">✓ 规则评价</h5>
              <ul className="text-xs space-y-1">
                <li>• <strong>覆盖率</strong>：规则覆盖的样本数</li>
                <li>• <strong>准确率</strong>：规则预测正确的比例</li>
                <li>• <strong>置信度</strong>：满足条件时结论正确的概率</li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-3">
              <h5 className="text-ml-purple font-bold mb-2">🎯 规则学习优势</h5>
              <ul className="text-xs space-y-1">
                <li>• 可解释性强，易于理解</li>
                <li>• 可以手动修改和调整</li>
                <li>• 知识显式化</li>
              </ul>
            </div>
          </div>

          <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-3">
            <h5 className="text-ml-cyan font-bold mb-2">📊 规则顺序</h5>
            <p className="text-xs">
              规则按优先级排列，从上到下匹配。最后的默认规则处理所有未被其他规则覆盖的情况。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
