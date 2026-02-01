'use client'
import { ROCCurveDemo } from '@/components/visualizations/ROCCurveDemo'
import { ROCFormulaDerivation } from '@/components/animations/FormulaDerivation'
import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter2() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/', title: '主页' }}
        nextChapter={{ href: '/chapter/3', title: '线性模型' }}
        currentChapter={2}
        totalChapters={5}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={2}
          title="模型评估与选择"
          subtitle="Model Evaluation & Selection"
          icon="📊"
          gradient="from-ml-cyan via-ml-blue to-ml-purple"
          objectives={[
            '理解分类任务中的核心评估指标：准确率、精确率、召回率、F1分数',
            '掌握混淆矩阵的构成及其各元素的含义',
            '理解 ROC 曲线和 AUC 指标的原理与应用',
            '认识阈值调整对模型性能的影响',
            '了解偏差-方差分解的权衡关系'
          ]}
        />

        <Section number="2.1" title="评估指标基础" gradient="from-ml-cyan to-ml-blue">
          <InfoCard title="为什么需要评估指标？" icon="🎯">
            <p className="mb-4">
              在监督学习中，我们需要定量地评估模型的性能。不同的应用场景对模型有不同的要求：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow font-bold">•</span>
                <div><strong className="text-ml-yellow">医疗诊断</strong>：更关注召回率（不能漏诊）</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-cyan font-bold">•</span>
                <div><strong className="text-ml-cyan">垃圾邮件过滤</strong>：更关注精确率（不能误判正常邮件）</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-purple font-bold">•</span>
                <div><strong className="text-ml-purple">信用评估</strong>：需要平衡准确率和公平性</div>
              </li>
            </ul>
          </InfoCard>

          <InfoCard title="混淆矩阵 (Confusion Matrix)" icon="📐" variant="accent">
            <p className="mb-6">
              混淆矩阵是理解分类器性能的基础工具，它展示了预测结果与真实标签的对应关系：
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto my-6">
              <div className="bg-ml-green/10 border-2 border-ml-green p-5 rounded-xl text-center group hover:bg-ml-green/20 transition-colors">
                <div className="text-3xl font-bold text-ml-green mb-2">TP</div>
                <div className="text-sm text-white font-semibold mb-1">真正例</div>
                <div className="text-xs text-gray-100">正确预测为正</div>
              </div>
              <div className="bg-ml-red/10 border-2 border-ml-red p-5 rounded-xl text-center group hover:bg-ml-red/20 transition-colors">
                <div className="text-3xl font-bold text-ml-red mb-2">FP</div>
                <div className="text-sm text-white font-semibold mb-1">假正例</div>
                <div className="text-xs text-gray-100">错误预测为正</div>
              </div>
              <div className="bg-ml-red/10 border-2 border-ml-red p-5 rounded-xl text-center group hover:bg-ml-red/20 transition-colors">
                <div className="text-3xl font-bold text-ml-red mb-2">FN</div>
                <div className="text-sm text-white font-semibold mb-1">假负例</div>
                <div className="text-xs text-gray-100">错误预测为负</div>
              </div>
              <div className="bg-ml-green/10 border-2 border-ml-green p-5 rounded-xl text-center group hover:bg-ml-green/20 transition-colors">
                <div className="text-3xl font-bold text-ml-green mb-2">TN</div>
                <div className="text-sm text-white font-semibold mb-1">真负例</div>
                <div className="text-xs text-gray-100">正确预测为负</div>
              </div>
            </div>
            <p className="text-sm italic text-center mt-4 text-ml-cyan">
              💡 所有评估指标都基于混淆矩阵的这四个值计算得出
            </p>
          </InfoCard>

          <div className="mt-8">
            <ROCFormulaDerivation />
          </div>
        </Section>

        <Section number="2.2" title="ROC 曲线与 AUC" gradient="from-ml-blue to-ml-purple">
          <InfoCard title="什么是 ROC 曲线？" icon="📈">
            <p className="text-white leading-relaxed mb-4">
              <strong className="text-ml-blue">ROC (Receiver Operating Characteristic) 曲线</strong>
              是一种图形化工具，用于评估二分类模型在所有可能的分类阈值下的性能。
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-ml-yellow mb-2">横轴：假正例率 (FPR)</h4>
                <p className="text-sm text-white">
                  表示所有负样本中，被错误分类为正的比例。理想情况下应该接近 0。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-ml-blue mb-2">纵轴：真正例率 (TPR)</h4>
                <p className="text-sm text-white">
                  表示所有正样本中，被正确分类的比例。理想情况下应该接近 1。
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="AUC 的含义" icon="📊" variant="accent">
            <p className="text-white leading-relaxed mb-4">
              <strong className="text-ml-blue">AUC (Area Under Curve)</strong>
              是 ROC 曲线下的面积，取值范围在 0 到 1 之间：
            </p>
            <ul className="space-y-3 text-white">
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
                <span className="text-white font-bold">AUC &lt; 0.5</span>
                <span>比随机猜测还差（可能标签反了）</span>
              </li>
            </ul>
          </InfoCard>

          <DemoCard
            title="交互式演示"
            description="拖动滑块调整分类阈值，观察 ROC 曲线上的操作点如何移动，以及各项指标如何变化。"
            icon="🎮"
            gradient="from-ml-blue to-ml-purple"
          >
            <ROCCurveDemo />
          </DemoCard>
        </Section>

        <Section number="2.3" title="偏差与方差" gradient="from-ml-purple to-ml-green">
          <InfoCard title="偏差-方差权衡" icon="⚖️">
            <p className="text-white leading-relaxed mb-4">
              模型的泛化误差可以分解为三个部分：
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-red-500">
                <h4 className="font-bold text-red-400 mb-2">偏差 (Bias)</h4>
                <p className="text-sm text-white">
                  模型预测的期望值与真实值之间的差距。高偏差导致<strong>欠拟合</strong>。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-400 mb-2">方差 (Variance)</h4>
                <p className="text-sm text-white">
                  模型在不同训练集上预测结果的变化程度。高方差导致<strong>过拟合</strong>。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-gray-500">
                <h4 className="font-bold text-white mb-2">噪声 (Noise)</h4>
                <p className="text-sm text-white">
                  数据本身的随机性，无法通过模型消除。
                </p>
              </div>
            </div>
            <p className="text-white text-sm italic bg-ml-bg-dark p-4 rounded">
              💡 关键洞察：降低偏差通常会增加方差，反之亦然。找到最佳平衡点是模型优化的核心目标。
            </p>
          </InfoCard>
        </Section>

        <Section number="2.4" title="实践练习" gradient="from-ml-green to-ml-cyan">
          <InfoCard title="练习1：理解阈值调整" icon="💪" variant="accent">
              <p className="text-white mb-4">
                使用上方的 ROC 交互式演示：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-white ml-4">
                <li>将阈值设为 0.2，观察混淆矩阵和评估指标</li>
                <li>将阈值设为 0.8，再次观察变化</li>
                <li>思考：什么情况下应该选择较低的阈值？什么情况下应该选择较高的阈值？</li>
              </ol>
          </InfoCard>

          <InfoCard title="练习2：指标权衡" icon="💪" variant="accent">
              <p className="text-white mb-4">
                考虑以下场景，选择最合适的优化目标：
              </p>
              <div className="space-y-3">
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景A：癌症筛查模型</p>
                  <p className="text-white text-sm">应该优化召回率（TPR），避免漏诊，宁可多一些假阳性。</p>
                </div>
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景B：垃圾邮件过滤</p>
                  <p className="text-white text-sm">应该优化精确率，避免将重要邮件标记为垃圾邮件。</p>
                </div>
                <div className="bg-ml-bg-dark p-4 rounded">
                  <p className="text-white font-semibold mb-2">场景C：欺诈检测</p>
                  <p className="text-white text-sm">需要平衡召回率和精确率，可以使用 F1 分数作为综合指标。</p>
                </div>
              </div>
          </InfoCard>

          <InfoCard title="练习3：解释 AUC" icon="💪" variant="accent">
              <p className="text-white mb-3">
                思考题：为什么 AUC 是一个好的综合性能指标？
              </p>
              <details className="bg-ml-bg-dark p-4 rounded cursor-pointer">
                <summary className="text-ml-blue font-semibold">💡 点击查看答案</summary>
                <p className="text-white mt-3 text-sm leading-relaxed">
                  AUC 衡量了模型在所有可能的阈值下的平均性能，不依赖于特定阈值的选择。
                  它表示随机选择一个正样本和一个负样本，模型给正样本打分更高的概率。
                  AUC 对类别不平衡问题也相对鲁棒，是评估排序质量的好指标。
                </p>
              </details>
          </InfoCard>
        </Section>

        <InfoCard title="本章小结" icon="📝" variant="accent">
          <div className="space-y-3 text-white">
            <p>✓ 混淆矩阵是理解分类性能的基础，包含 TP、FP、TN、FN 四个要素</p>
            <p>✓ 不同应用场景需要关注不同的指标：准确率、精确率、召回率、F1分数</p>
            <p>✓ ROC 曲线展示了模型在不同阈值下的性能权衡</p>
            <p>✓ AUC 提供了一个与阈值无关的综合性能度量</p>
            <p>✓ 偏差-方差权衡是模型选择和优化的核心考虑因素</p>
          </div>
        </InfoCard>
      </div>
    </div>
  )
}
