import { ROCCurveDemo } from '@/components/visualizations/ROCCurveDemo'
import { ROCFormulaDerivation } from '@/components/animations/FormulaDerivation'

export default function Chapter2() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">第2章 - 模型评估与选择</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-ml-blue">2.1 评估指标</h2>
          <ROCFormulaDerivation />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-ml-blue">2.2 ROC 曲线交互式演示</h2>
          <ROCCurveDemo />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-ml-blue">2.3 实践练习</h2>
          <div className="bg-ml-bg-secondary p-6 rounded-lg">
            <p className="text-gray-300">
              尝试调整阈值，观察 TPR 和 FPR 的变化，理解模型性能权衡。
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
