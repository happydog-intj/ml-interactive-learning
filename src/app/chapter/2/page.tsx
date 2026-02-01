import { ROCCurveDemo } from '@/components/visualizations/ROCCurveDemo'

export default function Chapter2() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">第2章 - 模型评估与选择</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2.1 ROC 曲线</h2>
          <p className="text-gray-300 mb-6">
            ROC（Receiver Operating Characteristic）曲线是评估二分类模型性能的重要工具。
            通过调整分类阈值，观察真正例率（TPR）和假正例率（FPR）的变化。
          </p>
          <ROCCurveDemo />
        </section>
      </div>
    </div>
  )
}
