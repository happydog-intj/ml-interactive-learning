'use client'

import { useState } from 'react'

interface Example {
  天气: string
  温度: string
  湿度: string
  风力: string
  打球: string
}

const trainingData: Example[] = [
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

export function NaiveBayesDemo() {
  const [testCase, setTestCase] = useState({
    天气: '晴',
    温度: '适中',
    湿度: '正常',
    风力: '弱'
  })

  const [showCalculation, setShowCalculation] = useState(false)

  // Calculate prior probabilities P(c)
  const calculatePrior = (label: string) => {
    const count = trainingData.filter(d => d.打球 === label).length
    return count / trainingData.length
  }

  // Calculate conditional probability P(x|c) with Laplace smoothing
  const calculateConditional = (feature: string, value: string, label: string) => {
    const labelData = trainingData.filter(d => d.打球 === label)
    const featureKey = feature as keyof Example
    const count = labelData.filter(d => d[featureKey] === value).length

    // Laplace smoothing
    const uniqueValues = new Set(trainingData.map(d => d[featureKey])).size
    return (count + 1) / (labelData.length + uniqueValues)
  }

  // Calculate P(c|x) ∝ P(c) * P(x1|c) * P(x2|c) * ...
  const predict = () => {
    const features = ['天气', '温度', '湿度', '风力'] as const
    const labels = ['是', '否']

    const probabilities: { [key: string]: number } = {}

    labels.forEach(label => {
      let prob = calculatePrior(label)

      features.forEach(feature => {
        const value = testCase[feature]
        prob *= calculateConditional(feature, value, label)
      })

      probabilities[label] = prob
    })

    // Normalize
    const total = probabilities['是'] + probabilities['否']
    return {
      是: probabilities['是'] / total,
      否: probabilities['否'] / total,
      raw: probabilities
    }
  }

  const result = predict()
  const prediction = result.是 > result.否 ? '是' : '否'

  return (
    <div className="space-y-6">
      {/* Test Case Input */}
      <div className="bg-ml-bg-card border-2 border-ml-purple/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-purple mb-4">测试样本</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 天气 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">天气</label>
            <select
              value={testCase.天气}
              onChange={(e) => setTestCase({ ...testCase, 天气: e.target.value })}
              className="w-full bg-ml-bg-dark border border-ml-border rounded-lg px-4 py-2 text-white"
            >
              <option value="晴">晴</option>
              <option value="阴">阴</option>
              <option value="雨">雨</option>
            </select>
          </div>

          {/* 温度 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">温度</label>
            <select
              value={testCase.温度}
              onChange={(e) => setTestCase({ ...testCase, 温度: e.target.value })}
              className="w-full bg-ml-bg-dark border border-ml-border rounded-lg px-4 py-2 text-white"
            >
              <option value="高">高</option>
              <option value="适中">适中</option>
              <option value="低">低</option>
            </select>
          </div>

          {/* 湿度 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">湿度</label>
            <select
              value={testCase.湿度}
              onChange={(e) => setTestCase({ ...testCase, 湿度: e.target.value })}
              className="w-full bg-ml-bg-dark border border-ml-border rounded-lg px-4 py-2 text-white"
            >
              <option value="高">高</option>
              <option value="正常">正常</option>
            </select>
          </div>

          {/* 风力 */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">风力</label>
            <select
              value={testCase.风力}
              onChange={(e) => setTestCase({ ...testCase, 风力: e.target.value })}
              className="w-full bg-ml-bg-dark border border-ml-border rounded-lg px-4 py-2 text-white"
            >
              <option value="强">强</option>
              <option value="弱">弱</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prediction Result */}
      <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border-2 border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-cyan mb-4">预测结果</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Probability bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-bold">打球 = 是</span>
                <span className="text-ml-green font-bold">{(result.是 * 100).toFixed(1)}%</span>
              </div>
              <div className="h-8 bg-ml-bg-dark rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ml-green to-ml-cyan transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${result.是 * 100}%` }}
                >
                  {result.是 > 0.3 && (
                    <span className="text-white text-xs font-bold">
                      {(result.是 * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-bold">打球 = 否</span>
                <span className="text-ml-red font-bold">{(result.否 * 100).toFixed(1)}%</span>
              </div>
              <div className="h-8 bg-ml-bg-dark rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ml-red to-ml-orange transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${result.否 * 100}%` }}
                >
                  {result.否 > 0.3 && (
                    <span className="text-white text-xs font-bold">
                      {(result.否 * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Final prediction */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-100 mb-2">最终预测</div>
              <div className={`text-6xl font-bold ${
                prediction === '是' ? 'text-ml-green' : 'text-ml-red'
              }`}>
                {prediction === '是' ? '✓' : '✗'}
              </div>
              <div className={`text-2xl font-bold mt-2 ${
                prediction === '是' ? 'text-ml-green' : 'text-ml-red'
              }`}>
                {prediction === '是' ? '适合打球' : '不适合打球'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show calculation button */}
      <button
        onClick={() => setShowCalculation(!showCalculation)}
        className="w-full px-4 py-3 bg-ml-purple/20 border border-ml-purple text-ml-purple font-bold rounded-lg hover:bg-ml-purple/30 transition-colors"
      >
        {showCalculation ? '隐藏计算过程 ▲' : '显示计算过程 ▼'}
      </button>

      {/* Detailed calculation */}
      {showCalculation && (
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">详细计算过程</h3>

          {/* Prior probabilities */}
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-sm font-bold text-ml-cyan mb-3">1. 先验概率 P(c)</h4>
            <div className="space-y-2 text-sm text-gray-100">
              <div className="flex justify-between">
                <span>P(打球=是) = {trainingData.filter(d => d.打球 === '是').length} / {trainingData.length}</span>
                <span className="text-ml-green font-mono">{calculatePrior('是').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(打球=否) = {trainingData.filter(d => d.打球 === '否').length} / {trainingData.length}</span>
                <span className="text-ml-red font-mono">{calculatePrior('否').toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Conditional probabilities for 是 */}
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-sm font-bold text-ml-green mb-3">2. 条件概率 P(x|打球=是)</h4>
            <div className="space-y-2 text-sm font-mono text-gray-100">
              <div className="flex justify-between">
                <span>P(天气={testCase.天气}|是)</span>
                <span className="text-ml-green">{calculateConditional('天气', testCase.天气, '是').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(温度={testCase.温度}|是)</span>
                <span className="text-ml-green">{calculateConditional('温度', testCase.温度, '是').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(湿度={testCase.湿度}|是)</span>
                <span className="text-ml-green">{calculateConditional('湿度', testCase.湿度, '是').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(风力={testCase.风力}|是)</span>
                <span className="text-ml-green">{calculateConditional('风力', testCase.风力, '是').toFixed(4)}</span>
              </div>
              <div className="border-t border-ml-border pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>P(是) × ∏P(xᵢ|是)</span>
                  <span className="text-ml-green">{result.raw.是.toExponential(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional probabilities for 否 */}
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-sm font-bold text-ml-red mb-3">3. 条件概率 P(x|打球=否)</h4>
            <div className="space-y-2 text-sm font-mono text-gray-100">
              <div className="flex justify-between">
                <span>P(天气={testCase.天气}|否)</span>
                <span className="text-ml-red">{calculateConditional('天气', testCase.天气, '否').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(温度={testCase.温度}|否)</span>
                <span className="text-ml-red">{calculateConditional('温度', testCase.温度, '否').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(湿度={testCase.湿度}|否)</span>
                <span className="text-ml-red">{calculateConditional('湿度', testCase.湿度, '否').toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>P(风力={testCase.风力}|否)</span>
                <span className="text-ml-red">{calculateConditional('风力', testCase.风力, '否').toFixed(4)}</span>
              </div>
              <div className="border-t border-ml-border pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>P(否) × ∏P(xᵢ|否)</span>
                  <span className="text-ml-red">{result.raw.否.toExponential(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final normalization */}
          <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-ml-cyan mb-3">4. 归一化得到后验概率</h4>
            <div className="space-y-2 text-sm text-gray-100">
              <div className="font-mono">
                P(是|x) = {result.raw.是.toExponential(4)} / ({result.raw.是.toExponential(4)} + {result.raw.否.toExponential(4)})
                <span className="text-ml-green ml-2">= {(result.是 * 100).toFixed(2)}%</span>
              </div>
              <div className="font-mono">
                P(否|x) = {result.raw.否.toExponential(4)} / ({result.raw.是.toExponential(4)} + {result.raw.否.toExponential(4)})
                <span className="text-ml-red ml-2">= {(result.否 * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training data display */}
      <div className="bg-ml-bg-card border border-ml-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">训练数据集 ({trainingData.length} 条)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ml-border">
                <th className="text-left py-2 px-3 text-gray-400 font-bold">天气</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">温度</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">湿度</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">风力</th>
                <th className="text-left py-2 px-3 text-gray-400 font-bold">打球</th>
              </tr>
            </thead>
            <tbody>
              {trainingData.map((example, idx) => (
                <tr key={idx} className="border-b border-ml-border/50 hover:bg-ml-bg-dark transition-colors">
                  <td className="py-2 px-3 text-gray-100">{example.天气}</td>
                  <td className="py-2 px-3 text-gray-100">{example.温度}</td>
                  <td className="py-2 px-3 text-gray-100">{example.湿度}</td>
                  <td className="py-2 px-3 text-gray-100">{example.风力}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      example.打球 === '是'
                        ? 'bg-ml-green/20 text-ml-green'
                        : 'bg-ml-red/20 text-ml-red'
                    }`}>
                      {example.打球}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm explanation */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <h4 className="text-sm font-bold text-ml-yellow mb-3">💡 朴素贝叶斯公式</h4>
        <div className="space-y-3 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-3 font-mono text-center">
            P(c|x) = P(c) × ∏ᵢ P(xᵢ|c) / P(x)
          </div>
          <ul className="space-y-2">
            <li><strong className="text-white">条件独立假设</strong>：假设特征之间相互独立</li>
            <li><strong className="text-white">拉普拉斯平滑</strong>：避免零概率问题，P(x|c) = (count + 1) / (total + N)</li>
            <li><strong className="text-white">归一化</strong>：使后验概率和为1</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
