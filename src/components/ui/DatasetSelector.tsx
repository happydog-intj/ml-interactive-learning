'use client'

import { Dataset, allDatasets, DatasetName } from '@/lib/datasets'

interface DatasetSelectorProps {
  selectedDataset: DatasetName
  onDatasetChange: (dataset: DatasetName) => void
  className?: string
}

export function DatasetSelector({
  selectedDataset,
  onDatasetChange,
  className = ''
}: DatasetSelectorProps) {
  const datasets = Object.entries(allDatasets) as [DatasetName, Dataset][]

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-ml-cyan">
        选择数据集
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {datasets.map(([key, dataset]) => (
          <button
            key={key}
            onClick={() => onDatasetChange(key)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
              selectedDataset === key
                ? 'border-ml-cyan bg-ml-cyan/10 scale-105'
                : 'border-ml-border bg-ml-bg-card hover:border-ml-border/50'
            }`}
          >
            <div className="font-bold text-white mb-1">{dataset.name}</div>
            <div className="text-xs text-gray-100 mb-2">{dataset.description}</div>
            <div className="flex items-center gap-3 text-xs text-gray-100">
              <span className="bg-ml-bg-dark px-2 py-1 rounded">
                {dataset.numSamples} 样本
              </span>
              <span className="bg-ml-bg-dark px-2 py-1 rounded">
                {dataset.numClasses} 类
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Dataset Info */}
      <div className="bg-ml-bg-dark rounded-lg p-4 border border-ml-border">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-100 mb-1">特征数量:</div>
            <div className="text-white font-bold">
              {allDatasets[selectedDataset].numFeatures}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-100 mb-1">目标变量:</div>
            <div className="text-white font-bold">
              {allDatasets[selectedDataset].target}
            </div>
          </div>
        </div>

        {allDatasets[selectedDataset].features.length <= 4 && (
          <div className="mt-3 pt-3 border-t border-ml-border">
            <div className="text-sm text-gray-100 mb-2">特征名称:</div>
            <div className="flex flex-wrap gap-2">
              {allDatasets[selectedDataset].features.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-ml-blue/20 text-ml-blue px-2 py-1 rounded font-mono"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
