import Link from 'next/link'
import { ROCCurveDemo } from '@/components/visualizations/ROCCurveDemo'
import { ROCFormulaDerivation } from '@/components/animations/FormulaDerivation'

export default function Chapter2() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      {/* 顶部导航栏 */}
      <nav className="bg-ml-bg-secondary border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-ml-blue hover:text-ml-blue/80 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">←</span>
              <span>返回主页</span>
            </Link>
            <div className="text-gray-200 text-sm">
              第 2 章 / 共 5 章
            </div>
            <Link
              href="/chapter/3"
              className="text-gray-200 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>下一章</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 章节标题 */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-ml-blue/20 text-ml-blue rounded-full text-sm font-semibold">
              第 2 章
            </span>
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-semibold">
              ✓ 已完成
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-ml-blue to-purple-400 bg-clip-text text-transparent">
            模型评估与选择
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            在机器学习中，如何评估模型性能、选择最优模型是至关重要的问题。
            本章将介绍评估指标、ROC曲线、交叉验证等核心概念。
          </p>
        </header>

        {/* 学习目标 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-ml-blue/10 to-purple-600/10 border-l-4 border-ml-blue p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-ml-blue">📚 学习目标</h2>
            <ul className="space-y-3 text-gray-100">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>理解分类任务中的核心评估指标：准确率、精确率、召回率、F1分数</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>掌握混淆矩阵的构成及其各元素的含义</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>理解 ROC 曲线和 AUC 指标的原理与应用</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>认识阈值调整对模型性能的影响</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>了解偏差-方差分解的权衡关系</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2.1 评估指标基础 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            2.1 评估指标基础
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <div className="bg-ml-bg-secondary p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 text-white">为什么需要评估指标？</h3>
              <p className="text-gray-100 leading-relaxed mb-4">
                在监督学习中，我们需要定量地评估模型的性能。不同的应用场景对模型有不同的要求：
              </p>
              <ul className="space-y-2 text-gray-100">
                <li><strong className="text-ml-yellow">医疗诊断</strong>：更关注召回率（不能漏诊）</li>
                <li><strong className="text-ml-yellow">垃圾邮件过滤</strong>：更关注精确率（不能误判正常邮件）</li>
                <li><strong className="text-ml-yellow">信用评估</strong>：需要平衡准确率和公平性</li>
              </ul>
            </div>

            <div className="bg-ml-bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">混淆矩阵 (Confusion Matrix)</h3>
              <p className="text-gray-100 leading-relaxed mb-4">
                混淆矩阵是理解分类器性能的基础工具，它展示了预测结果与真实标签的对应关系：
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto my-6">
                <div className="bg-green-900/20 border-2 border-green-500 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-green-400">TP</div>
                  <div className="text-sm text-gray-200 mt-1">真正例</div>
                  <div className="text-xs text-gray-500">正确预测为正</div>
                </div>
                <div className="bg-red-900/20 border-2 border-red-500 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-red-400">FP</div>
                  <div className="text-sm text-gray-200 mt-1">假正例</div>
                  <div className="text-xs text-gray-500">错误预测为正</div>
                </div>
                <div className="bg-red-900/20 border-2 border-red-500 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-red-400">FN</div>
                  <div className="text-sm text-gray-200 mt-1">假负例</div>
                  <div className="text-xs text-gray-500">错误预测为负</div>
                </div>
                <div className="bg-green-900/20 border-2 border-green-500 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-green-400">TN</div>
                  <div className="text-sm text-gray-200 mt-1">真负例</div>
                  <div className="text-xs text-gray-500">正确预测为负</div>
                </div>
              </div>
              <p className="text-gray-200 text-sm italic text-center">
                所有评估指标都基于混淆矩阵的这四个值计算得出
              </p>
            </div>
          </div>

          {/* 公式推导动画 */}
          <ROCFormulaDerivation />
        </section>

        {/* 2.2 ROC 曲线与 AUC */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            2.2 ROC 曲线与 AUC
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">什么是 ROC 曲线？</h3>
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-ml-blue">ROC (Receiver Operating Characteristic) 曲线</strong>
              是一种图形化工具，用于评估二分类模型在所有可能的分类阈值下的性能。
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-ml-yellow mb-2">横轴：假正例率 (FPR)</h4>
                <p className="text-sm text-gray-200">
                  表示所有负样本中，被错误分类为正的比例。理想情况下应该接近 0。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-ml-blue mb-2">纵轴：真正例率 (TPR)</h4>
                <p className="text-sm text-gray-200">
                  表示所有正样本中，被正确分类的比例。理想情况下应该接近 1。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">AUC 的含义</h3>
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-ml-blue">AUC (Area Under Curve)</strong>
              是 ROC 曲线下的面积，取值范围在 0 到 1 之间：
            </p>
            <ul className="space-y-3 text-gray-100">
              <li className="flex items-center gap-3">
                <span className="text-green-400 font-bold">AUC = 1.0</span>
                <span>完美分类器，所有样本都被正确分类</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-ml-blue font-bold">AUC = 0.9-1.0</span>
                <span>优秀的分类器</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">AUC = 0.7-0.9</span>
                <span>良好的分类器</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">AUC = 0.5</span>
                <span>随机猜测的性能基线</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gray-200 font-bold">AUC &lt; 0.5</span>
                <span>比随机猜测还差（可能标签反了）</span>
              </li>
            </ul>
          </div>

          {/* ROC 曲线交互式演示 */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-white">🎮 交互式演示</h3>
            <p className="text-gray-200 mb-4">
              拖动滑块调整分类阈值，观察 ROC 曲线上的操作点如何移动，以及各项指标如何变化。
            </p>
          </div>
          <ROCCurveDemo />
        </section>

        {/* 2.3 偏差与方差 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            2.3 偏差与方差
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 text-white">偏差-方差权衡</h3>
            <p className="text-gray-100 leading-relaxed mb-4">
              模型的泛化误差可以分解为三个部分：
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-red-500">
                <h4 className="font-bold text-red-400 mb-2">偏差 (Bias)</h4>
                <p className="text-sm text-gray-200">
                  模型预测的期望值与真实值之间的差距。高偏差导致<strong>欠拟合</strong>。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-400 mb-2">方差 (Variance)</h4>
                <p className="text-sm text-gray-200">
                  模型在不同训练集上预测结果的变化程度。高方差导致<strong>过拟合</strong>。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-gray-500">
                <h4 className="font-bold text-gray-200 mb-2">噪声 (Noise)</h4>
                <p className="text-sm text-gray-200">
                  数据本身的随机性，无法通过模型消除。
                </p>
              </div>
            </div>
            <p className="text-gray-200 text-sm italic bg-ml-bg-dark p-4 rounded">
              💡 关键洞察：降低偏差通常会增加方差，反之亦然。找到最佳平衡点是模型优化的核心目标。
            </p>
          </div>
        </section>

        {/* 2.4 实践练习 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            2.4 实践练习
          </h2>

          <div className="space-y-6">
            <div className="bg-ml-bg-secondary p-6 rounded-lg border-l-4 border-ml-yellow">
              <h3 className="text-lg font-semibold mb-3 text-ml-yellow">💪 练习1：理解阈值调整</h3>
              <p className="text-gray-100 mb-4">
                使用上方的 ROC 交互式演示：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 ml-4">
                <li>将阈值设为 0.2，观察混淆矩阵和评估指标</li>
                <li>将阈值设为 0.8，再次观察变化</li>
                <li>思考：什么情况下应该选择较低的阈值？什么情况下应该选择较高的阈值？</li>
              </ol>
            </div>

            <div className="bg-ml-bg-secondary p-6 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">💪 练习2：指标权衡</h3>
              <p className="text-gray-100 mb-4">
                考虑以下场景，选择最合适的优化目标：
              </p>
              <div className="space-y-3">
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景A：癌症筛查模型</p>
                  <p className="text-gray-200 text-sm">应该优化召回率（TPR），避免漏诊，宁可多一些假阳性。</p>
                </div>
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景B：垃圾邮件过滤</p>
                  <p className="text-gray-200 text-sm">应该优化精确率，避免将重要邮件标记为垃圾邮件。</p>
                </div>
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景C：欺诈检测</p>
                  <p className="text-gray-200 text-sm">需要平衡召回率和精确率，可以使用 F1 分数作为综合指标。</p>
                </div>
              </div>
            </div>

            <div className="bg-ml-bg-secondary p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-semibold mb-3 text-green-400">💪 练习3：解释 AUC</h3>
              <p className="text-gray-100 mb-3">
                思考题：为什么 AUC 是一个好的综合性能指标？
              </p>
              <details className="bg-ml-bg-dark p-4 rounded cursor-pointer">
                <summary className="text-ml-blue font-semibold">💡 点击查看答案</summary>
                <p className="text-gray-200 mt-3 text-sm leading-relaxed">
                  AUC 衡量了模型在所有可能的阈值下的平均性能，不依赖于特定阈值的选择。
                  它表示随机选择一个正样本和一个负样本，模型给正样本打分更高的概率。
                  AUC 对类别不平衡问题也相对鲁棒，是评估排序质量的好指标。
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 本章小结 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-ml-blue/20 to-purple-600/20 border-2 border-ml-blue/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-ml-blue">📝 本章小结</h2>
            <div className="space-y-3 text-gray-100">
              <p>✓ 混淆矩阵是理解分类性能的基础，包含 TP、FP、TN、FN 四个要素</p>
              <p>✓ 不同应用场景需要关注不同的指标：准确率、精确率、召回率、F1分数</p>
              <p>✓ ROC 曲线展示了模型在不同阈值下的性能权衡</p>
              <p>✓ AUC 提供了一个与阈值无关的综合性能度量</p>
              <p>✓ 偏差-方差权衡是模型选择和优化的核心考虑因素</p>
            </div>
          </div>
        </section>

        {/* 章节导航 */}
        <nav className="border-t-2 border-gray-700 pt-8">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl">←</span>
              <span>返回主页</span>
            </Link>
            <div className="text-center">
              <p className="text-gray-200 text-sm mb-1">下一章</p>
              <p className="text-white font-semibold">第3章：线性模型</p>
            </div>
            <Link
              href="/chapter/3"
              className="px-6 py-3 bg-ml-blue hover:bg-ml-blue/80 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>继续学习</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
