'use client'

export interface ConfusionMatrixProps {
  tp: number
  fp: number
  tn: number
  fn: number
  className?: string
}

export function ConfusionMatrix({ tp, fp, tn, fn, className = '' }: ConfusionMatrixProps) {
  const total = tp + fp + tn + fn

  return (
    <div className={`bg-ml-bg-secondary p-6 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-ml-blue text-center">混淆矩阵</h3>

      {/* 标签行 */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className=""></div>
        <div className="text-center text-sm text-gray-200 font-semibold">预测: 正例</div>
        <div className="text-center text-sm text-gray-200 font-semibold">预测: 负例</div>
      </div>

      {/* 第一行：真实正例 */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="flex items-center justify-end text-sm text-gray-200 font-semibold pr-2">
          真实: 正例
        </div>
        <div className="bg-green-900/30 border-2 border-green-500 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400">{tp}</div>
          <div className="text-xs text-gray-200 mt-1">真正例 (TP)</div>
          <div className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${((tp / total) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
        <div className="bg-red-900/30 border-2 border-red-500 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-400">{fn}</div>
          <div className="text-xs text-gray-200 mt-1">假负例 (FN)</div>
          <div className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${((fn / total) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* 第二行：真实负例 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-end text-sm text-gray-200 font-semibold pr-2">
          真实: 负例
        </div>
        <div className="bg-red-900/30 border-2 border-red-500 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-400">{fp}</div>
          <div className="text-xs text-gray-200 mt-1">假正例 (FP)</div>
          <div className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${((fp / total) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
        <div className="bg-green-900/30 border-2 border-green-500 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400">{tn}</div>
          <div className="text-xs text-gray-200 mt-1">真负例 (TN)</div>
          <div className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${((tn / total) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* 总计 */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-200">
          总样本数: <span className="text-white font-bold">{total}</span>
        </p>
      </div>
    </div>
  )
}
