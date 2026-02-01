'use client'

import { SVMVisualization } from '@/components/visualizations/SVMVisualization'
import { KernelComparison } from '@/components/visualizations/KernelComparison'
import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter6() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/5', title: '神经网络' }}
        nextChapter={{ href: '/chapter/7', title: '贝叶斯分类器' }}
        currentChapter={6}
        totalChapters={16}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={6}
          title="支持向量机"
          subtitle="Support Vector Machine"
          icon="🎯"
          gradient="from-ml-cyan via-ml-blue to-ml-purple"
          objectives={[
            '理解间隔最大化的核心思想和几何意义',
            '掌握对偶问题和KKT条件在SVM中的应用',
            '理解核技巧如何将线性SVM扩展到非线性情况',
            '掌握软间隔SVM处理非线性可分数据的方法',
            '了解支持向量回归（SVR）的原理和应用'
          ]}
        />

        {/* 6.1 间隔与支持向量 */}
        <Section number="6.1" title="间隔与支持向量" gradient="from-ml-cyan to-ml-blue">
          <InfoCard title="为什么要最大化间隔？" icon="📏">
            <p className="mb-4">
              在线性可分的情况下，能够正确划分训练样本的超平面有无穷多个。
              <strong className="text-ml-yellow">支持向量机</strong>的核心思想是找到具有
              <strong className="text-ml-cyan">"最大间隔"</strong>的划分超平面。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center text-lg">超平面与间隔</h5>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">超平面方程：</p>
                  <div className="text-center text-xl font-mono text-ml-cyan">
                    w·x + b = 0
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">样本到超平面的距离：</p>
                  <div className="text-center text-xl font-mono text-ml-blue">
                    r = |w·x + b| / ||w||
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">间隔（margin）：</p>
                  <div className="text-center text-xl font-mono text-ml-purple">
                    γ = 2 / ||w||
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">✓ 为什么最大化间隔？</h5>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>更好的泛化能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>对噪声更鲁棒</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>VC维理论支持</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-cyan">
                <h5 className="font-semibold text-ml-cyan mb-2">🎯 支持向量</h5>
                <p className="text-sm">
                  距离超平面最近的训练样本点称为<strong className="text-ml-cyan">支持向量</strong>。
                  它们"支撑"着这个间隔，决定了最优分类超平面。
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="SVM优化目标" icon="⚡" variant="accent">
            <p className="mb-4">
              SVM的优化目标是找到使间隔最大化的w和b：
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">最大化：</p>
                  <div className="text-2xl font-mono text-ml-cyan">γ = 2 / ||w||</div>
                </div>

                <div className="text-ml-yellow">⇓ 等价于</div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">最小化：</p>
                  <div className="text-2xl font-mono text-ml-blue">½ ||w||²</div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">约束条件：</p>
                  <div className="text-xl font-mono text-ml-purple">
                    yᵢ(w·xᵢ + b) ≥ 1, ∀i
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-100">
              这是一个<strong className="text-ml-yellow">凸二次规划问题</strong>，
              存在全局最优解，可以通过现有的QP优化算法求解。
            </p>
          </InfoCard>

          <DemoCard
            title="SVM可视化演示"
            description="调整参数观察SVM如何寻找最大间隔超平面。黄色圆圈标记的是支持向量，绿色虚线表示间隔边界。"
            icon="🎮"
            gradient="from-ml-cyan to-ml-blue"
          >
            <SVMVisualization />
          </DemoCard>
        </Section>

        {/* 6.2 对偶问题 */}
        <Section number="6.2" title="对偶问题" gradient="from-ml-blue to-ml-purple">
          <InfoCard title="为什么要引入对偶问题？" icon="🔄">
            <p className="mb-4">
              通过拉格朗日乘子法，我们可以将原始问题转化为对偶问题，这样做有几个重要优势：
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h5 className="font-semibold text-ml-blue mb-2">更易求解</h5>
                <p className="text-xs text-gray-100">对偶问题往往更容易优化</p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🔑</div>
                <h5 className="font-semibold text-ml-cyan mb-2">引入核函数</h5>
                <p className="text-xs text-gray-100">为核技巧提供基础</p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📊</div>
                <h5 className="font-semibold text-ml-purple mb-2">稀疏解</h5>
                <p className="text-xs text-gray-100">大部分α为0</p>
              </div>
            </div>

            <div className="bg-ml-bg-dark p-6 rounded-lg">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">对偶问题</h5>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-100 mb-2">最大化：</p>
                  <div className="text-lg font-mono text-white text-center">
                    L(α) = Σαᵢ - ½ΣΣαᵢαⱼyᵢyⱼxᵢ·xⱼ
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">约束条件：</p>
                  <div className="text-lg font-mono text-white text-center space-y-2">
                    <div>Σαᵢyᵢ = 0</div>
                    <div>αᵢ ≥ 0, ∀i</div>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="KKT条件" icon="📐" variant="accent">
            <p className="mb-4">
              支持向量机的解需要满足<strong className="text-ml-yellow">KKT（Karush-Kuhn-Tucker）条件</strong>：
            </p>

            <div className="bg-ml-bg-dark p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl">①</span>
                <div className="flex-1">
                  <p className="font-mono text-white">αᵢ ≥ 0</p>
                  <p className="text-xs text-gray-100">对偶变量非负</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl">②</span>
                <div className="flex-1">
                  <p className="font-mono text-white">yᵢ(w·xᵢ + b) - 1 ≥ 0</p>
                  <p className="text-xs text-gray-100">原始约束满足</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl">③</span>
                <div className="flex-1">
                  <p className="font-mono text-white">αᵢ[yᵢ(w·xᵢ + b) - 1] = 0</p>
                  <p className="text-xs text-gray-100 text-ml-yellow">互补松弛条件（关键！）</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg">
              <p className="text-sm text-white">
                <strong className="text-ml-cyan">互补松弛条件</strong>表明：
                只有支持向量对应的αᵢ &gt; 0，其他样本的αᵢ = 0。
                这就是为什么SVM的解是<strong className="text-ml-yellow">稀疏的</strong>！
              </p>
            </div>
          </InfoCard>
        </Section>

        {/* 6.3 核函数 */}
        <Section number="6.3" title="核函数" gradient="from-ml-purple to-ml-cyan">
          <InfoCard title="核技巧（Kernel Trick）" icon="🎩">
            <p className="mb-4">
              现实任务中，样本空间往往不是线性可分的。
              <strong className="text-ml-cyan">核技巧</strong>的思想是：
              将样本映射到更高维的特征空间，使其在高维空间中线性可分。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-ml-purple mb-3">传统方法</h5>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span>①</span>
                      <span>显式计算映射 φ(x)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>②</span>
                      <span>在高维空间计算内积 φ(xᵢ)·φ(xⱼ)</span>
                    </p>
                    <p className="text-ml-red">❌ 问题：维度可能极高，甚至无穷维！</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-ml-green mb-3">核技巧</h5>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span>①</span>
                      <span>直接定义核函数 K(xᵢ, xⱼ)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>②</span>
                      <span>K(xᵢ, xⱼ) = φ(xᵢ)·φ(xⱼ)</span>
                    </p>
                    <p className="text-ml-green">✓ 无需显式计算φ(x)！</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-cyan">核函数定理</strong>：
                只要一个对称函数满足正定性，它就对应某个映射φ的内积。
                这意味着我们可以直接设计核函数，而无需知道具体的映射形式！
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="常用核函数对比"
            description="了解不同核函数的特点、适用场景和参数设置。RBF核是最常用的核函数，适合大多数情况。"
            icon="🔍"
            gradient="from-ml-purple to-ml-cyan"
          >
            <KernelComparison />
          </DemoCard>
        </Section>

        {/* 6.4 软间隔与正则化 */}
        <Section number="6.4" title="软间隔与正则化" gradient="from-ml-cyan to-ml-purple">
          <InfoCard title="软间隔SVM" icon="🛡️">
            <p className="mb-4">
              现实任务中，数据往往不是完全线性可分的，可能存在：
              <strong className="text-ml-red">噪声</strong>或
              <strong className="text-ml-red">离群点</strong>。
              <strong className="text-ml-cyan">软间隔</strong>允许某些样本不满足约束条件。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">软间隔优化目标</h5>

              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">最小化：</p>
                  <div className="text-xl font-mono text-white">
                    ½||w||² + C·Σξᵢ
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">约束条件：</p>
                  <div className="text-lg font-mono text-white space-y-2">
                    <div>yᵢ(w·xᵢ + b) ≥ 1 - ξᵢ</div>
                    <div>ξᵢ ≥ 0</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-ml-cyan font-bold mb-2">ξᵢ (松弛变量)</p>
                  <p className="text-sm text-gray-100">允许样本违反约束的程度</p>
                </div>
                <div className="text-center">
                  <p className="text-ml-purple font-bold mb-2">C (惩罚参数)</p>
                  <p className="text-sm text-gray-100">控制对误分类的惩罚强度</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-red">
                <h5 className="font-semibold text-ml-red mb-2">C → 0</h5>
                <p className="text-sm text-gray-100">
                  容忍更多误分类<br/>
                  间隔更大<br/>
                  可能欠拟合
                </p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h5 className="font-semibold text-ml-yellow mb-2">C 适中</h5>
                <p className="text-sm text-gray-100">
                  平衡间隔与误差<br/>
                  泛化能力好<br/>
                  通常最优
                </p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">C → ∞</h5>
                <p className="text-sm text-gray-100">
                  接近硬间隔<br/>
                  追求完美分类<br/>
                  可能过拟合
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="损失函数视角" icon="📉" variant="accent">
            <p className="mb-4">
              软间隔SVM可以从<strong className="text-ml-yellow">损失函数+正则化</strong>的角度理解：
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg">
              <div className="text-center text-xl font-mono text-white mb-4">
                min[Σℓ(yᵢ, f(xᵢ)) + λ||w||²]
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h5 className="font-semibold text-ml-cyan mb-3">Hinge损失</h5>
                  <div className="text-center font-mono text-lg text-white mb-2">
                    ℓ(y, f(x)) = max(0, 1-yf(x))
                  </div>
                  <p className="text-sm text-gray-100">
                    • yf(x) ≥ 1: 损失为0（正确且确信）<br/>
                    • yf(x) &lt; 1: 线性增长（惩罚违反间隔）
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-ml-purple mb-3">正则化项</h5>
                  <div className="text-center font-mono text-lg text-white mb-2">
                    λ||w||²
                  </div>
                  <p className="text-sm text-gray-100">
                    • 控制模型复杂度<br/>
                    • 防止过拟合<br/>
                    • λ = 1/(2C)
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 6.5 支持向量回归 */}
        <Section number="6.5" title="支持向量回归 (SVR)" gradient="from-ml-purple to-ml-blue">
          <InfoCard title="从分类到回归" icon="📈">
            <p className="mb-4">
              SVM不仅可以用于分类，还可以用于回归任务。
              <strong className="text-ml-cyan">支持向量回归（SVR）</strong>
              的思想是找一个函数，使得大部分样本点都落在以f(x)为中心、宽度为2ε的"管道"内。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">SVR优化目标</h5>

              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">最小化：</p>
                  <div className="text-xl font-mono text-white">
                    ½||w||² + C·Σ(ξᵢ + ξᵢ*)
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">约束条件：</p>
                  <div className="text-lg font-mono text-white space-y-2">
                    <div>f(xᵢ) - yᵢ ≤ ε + ξᵢ</div>
                    <div>yᵢ - f(xᵢ) ≤ ε + ξᵢ*</div>
                    <div>ξᵢ, ξᵢ* ≥ 0</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-cyan">
                <h5 className="font-semibold text-ml-cyan mb-2">ε-不敏感损失</h5>
                <p className="text-sm text-gray-100">
                  • |y - f(x)| ≤ ε: 损失为0<br/>
                  • |y - f(x)| &gt; ε: 线性惩罚
                </p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <h5 className="font-semibold text-ml-purple mb-2">参数说明</h5>
                <p className="text-sm text-gray-100">
                  • ε: 容忍误差（管道宽度）<br/>
                  • C: 惩罚参数<br/>
                  • ξ, ξ*: 松弛变量
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="SVR的优势" icon="⭐" variant="success">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-ml-green mb-3">✓ 优点</h5>
                <ul className="space-y-2 text-sm text-gray-100">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>对异常值鲁棒（ε-不敏感）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>稀疏解，预测高效</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>可通过核函数处理非线性</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>泛化能力强</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-ml-yellow mb-3">⚠️ 挑战</h5>
                <ul className="space-y-2 text-sm text-gray-100">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-yellow">•</span>
                    <span>参数（C, ε, 核参数）选择困难</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-yellow">•</span>
                    <span>大规模数据集训练慢</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-yellow">•</span>
                    <span>需要选择合适的核函数</span>
                  </li>
                </ul>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 本章小结 */}
        <div className="mt-16 mb-12">
          <InfoCard title="本章小结" icon="📝" variant="success">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>支持向量机通过最大化间隔寻找最优分类超平面，具有良好的泛化能力</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>对偶问题和KKT条件保证了SVM解的稀疏性，只有支持向量对应的α非零</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>核技巧允许在不显式计算高维映射的情况下，处理非线性可分问题</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>软间隔SVM通过引入松弛变量和惩罚参数C，可以处理噪声和不完全可分数据</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>SVR将SVM思想扩展到回归任务，使用ε-不敏感损失函数实现鲁棒回归</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>RBF核是最常用的核函数，适合大多数实际应用场景</span>
              </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
