import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { VCDimensionDemo } from '@/components/visualizations/VCDimensionDemo'

export default function Chapter12() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={12} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapterNumber={12}
          title="计算学习理论"
          subtitle="Computational Learning Theory"
          icon="🎓"
          gradient="from-ml-blue via-ml-purple to-ml-pink"
          objectives={[
            '理解PAC学习框架的基本概念',
            '掌握VC维的定义和意义',
            '了解样本复杂度和计算复杂度',
            '理解泛化误差界和模型复杂度的关系'
          ]}
        />

        {/* Section 12.1: 基础知识 */}
        <Section
          number="12.1"
          title="基础知识"
        >
          <InfoCard title="什么是计算学习理论">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">计算学习理论（Computational Learning Theory）</strong>
              研究机器学习的理论基础，试图回答以下关键问题：
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-100 mb-4">
              <li>在什么条件下学习是可能的？</li>
              <li>需要多少训练样本才能学到好的模型？</li>
              <li>学习算法的计算复杂度是多少？</li>
              <li>如何刻画学习任务的难度？</li>
            </ul>

            <p className="text-gray-100 leading-relaxed">
              计算学习理论为机器学习提供了严格的数学框架，帮助我们理解学习算法的本质和局限性。
            </p>
          </InfoCard>

          <InfoCard title="PAC学习框架">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">PAC（Probably Approximately Correct）学习</strong>
              是Valiant于1984年提出的经典学习框架。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">PAC可学习定义</h4>
              <p className="text-gray-100 text-sm mb-3">
                对于任意 ε &gt; 0（误差）和 δ &gt; 0（置信度），存在学习算法 𝓛 和多项式函数 poly(·,·,·,·)，
                使得对于任意分布 𝒟 和目标概念 c，当样本数量满足：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  m ≥ poly(1/ε, 1/δ, size(c), size(x))
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                算法 𝓛 能够以至少 1-δ 的概率学习到假设 h，使得误差 error(h) ≤ ε
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 理解PAC</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">Probably</strong>（概率上）：
                  以高概率（1-δ）成功
                </li>
                <li>
                  <strong className="text-white">Approximately</strong>（近似地）：
                  误差不超过ε
                </li>
                <li>
                  <strong className="text-white">Correct</strong>（正确）：
                  学到的假设近似正确
                </li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="PAC学习可视化"
            description="交互式调整ε和δ，观察所需样本数量的变化"
            status="开发中"
          />
        </Section>

        {/* Section 12.2: PAC学习 */}
        <Section
          number="12.2"
          title="PAC学习"
        >
          <InfoCard title="样本复杂度">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">样本复杂度（Sample Complexity）</strong>
              是指学习算法达到预定精度所需的最少样本数量，是PAC学习理论的核心概念。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">有限假设空间的样本复杂度</h4>
              <p className="text-gray-100 text-sm mb-2">
                对于有限假设空间 |ℋ| &lt; ∞，要保证以1-δ的概率找到误差不超过ε的假设，样本数量需满足：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  m ≥ (1/ε) · (ln|ℋ| + ln(1/δ))
                </p>
              </div>
            </div>

            <p className="text-gray-100 text-sm mb-4">
              这个界告诉我们：假设空间越大，需要的样本越多；要求的精度越高（ε越小）或置信度越高（δ越小），需要的样本也越多。
            </p>
          </InfoCard>

          <InfoCard title="不可知PAC学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              标准PAC学习假设目标概念c存在于假设空间ℋ中（<strong className="text-white">可实现假设</strong>）。
              <strong className="text-white">不可知PAC学习（Agnostic PAC Learning）</strong>
              放宽了这一假设，允许ℋ中不存在完美的假设。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">不可知PAC可学习定义</h4>
              <p className="text-gray-100 text-sm mb-2">
                算法输出的假设h满足：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  error(h) ≤ min<sub>h'∈ℋ</sub> error(h') + ε
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                即学到的假设h的误差与假设空间中最优假设的误差相差不超过ε
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              不可知PAC学习更贴近实际情况，因为真实世界中目标概念往往不在我们的假设空间中。
            </p>
          </InfoCard>

          <DemoCard
            title="可实现vs不可知学习"
            description="对比可实现和不可知PAC学习场景下的学习过程"
            status="开发中"
          />
        </Section>

        {/* Section 12.3: 有限假设空间 */}
        <Section
          number="12.3"
          title="有限假设空间"
        >
          <InfoCard title="一致性学习算法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">一致性（Consistent）学习算法</strong>
              输出的假设在训练集上零错误，即能完美拟合训练数据。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Hoeffding不等式</h4>
              <p className="text-gray-100 text-sm mb-2">
                对于任意假设h，其训练误差和泛化误差的差异满足：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center py-2">
                  P(|error(h) - êrror(h)| &gt; ε) ≤ 2exp(-2mε²)
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                其中 êrror(h) 是训练误差，error(h) 是泛化误差，m 是样本数量
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">Union Bound</h4>
              <p className="text-gray-100 text-sm mb-2">
                对假设空间ℋ中所有假设应用Hoeffding不等式，利用Union Bound：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  P(∃h∈ℋ: |error(h) - êrror(h)| &gt; ε) ≤ 2|ℋ|exp(-2mε²)
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                令右侧 ≤ δ，解出样本数量 m ≥ (1/2ε²)(ln|ℋ| + ln(2/δ))
              </p>
            </div>
          </InfoCard>

          <InfoCard title="版本空间">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">版本空间（Version Space）</strong>
              是假设空间ℋ中所有与训练集一致的假设的集合。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-cyan font-bold mb-3">候选消除算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                候选消除（Candidate Elimination）算法维护版本空间，通过训练样本逐步缩小版本空间：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化：版本空间 = 整个假设空间ℋ</li>
                <li>对于每个训练样本(x, y)：</li>
                <li className="ml-6">• 从版本空间中移除所有与(x, y)不一致的假设</li>
                <li>重复直到处理完所有训练样本</li>
                <li>最终版本空间中的任意假设都是一致的</li>
              </ol>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              当版本空间只剩一个假设时，学习任务完成。实际中版本空间可能包含多个假设，需要选择策略（如投票）。
            </p>
          </InfoCard>

          <DemoCard
            title="版本空间收敛过程"
            description="可视化训练样本如何逐步缩小版本空间"
            status="开发中"
          />
        </Section>

        {/* Section 12.4: VC维 */}
        <Section
          number="12.4"
          title="VC维"
        >
          <InfoCard title="VC维定义">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">VC维（Vapnik-Chervonenkis Dimension）</strong>
              是衡量假设空间复杂度的重要指标，适用于无限假设空间。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">打散（Shatter）</h4>
              <p className="text-gray-100 text-sm mb-2">
                如果假设空间ℋ能够实现数据集D上所有可能的标记（2<sup>m</sup>种），则称ℋ能够<strong className="text-white">打散</strong>D。
              </p>
              <p className="text-gray-100 text-sm">
                <strong className="text-white">VC维</strong>是ℋ能打散的最大数据集大小：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3 mt-2">
                <p className="text-white text-sm text-center">
                  VC(ℋ) = max{'{m: ℋ能打散某个大小为m的数据集}'}
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">经典例子：线性分类器的VC维</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>• <strong className="text-white">二维平面上的线性分类器</strong>：VC维 = 3
                  <p className="text-xs ml-4 mt-1">可以打散任意3个点（不共线），但无法打散某些4个点的配置（如XOR）</p>
                </li>
                <li>• <strong className="text-white">d维空间的线性分类器</strong>：VC维 = d + 1
                  <p className="text-xs ml-4 mt-1">可以打散d+1个一般位置的点</p>
                </li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 VC维的意义</h4>
              <p className="text-gray-100 text-sm">
                VC维越大，假设空间的表达能力越强，但也越容易过拟合。
                VC维为学习算法的泛化能力提供了理论保证。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="VC维与样本复杂度">
            <p className="text-gray-100 leading-relaxed mb-4">
              VC维将样本复杂度的分析扩展到无限假设空间。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">基于VC维的样本复杂度界</h4>
              <p className="text-gray-100 text-sm mb-2">
                对于VC维为d的假设空间，要以1-δ的概率保证误差不超过ε，样本数量需满足：
              </p>
              <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  m = O((d/ε) · log(1/ε) + (1/ε) · log(1/δ))
                </p>
              </div>
            </div>

            <p className="text-gray-100 text-sm mb-4">
              这个界说明：模型越复杂（d越大），需要的样本越多才能保证泛化性能。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">结构风险最小化（SRM）</h4>
              <p className="text-gray-100 text-sm">
                SRM原则：在训练误差和模型复杂度之间权衡，选择使<strong className="text-white">结构风险</strong>最小的模型：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mt-2">
                <p className="font-mono text-white text-sm text-center">
                  Structural Risk = Training Error + Complexity Penalty
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                这与正则化、奥卡姆剃刀原则的思想一致。
              </p>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎯 VC维交互演示</h3>
            <p className="text-gray-300 mb-6">
              通过放置点和调整标签，理解线性分类器的VC维（能打散3点，不能打散4点）
            </p>
            <VCDimensionDemo />
          </div>
        </Section>

        {/* Section 12.5: Rademacher复杂度 */}
        <Section
          number="12.5"
          title="Rademacher复杂度"
        >
          <InfoCard title="Rademacher复杂度">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">Rademacher复杂度</strong>是另一种衡量假设空间复杂度的方法，
              相比VC维更加精细，能考虑数据分布的影响。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">经验Rademacher复杂度</h4>
              <p className="text-gray-100 text-sm mb-2">
                给定样本集 S = {'{x₁, ..., xₘ}'}，假设空间ℋ的经验Rademacher复杂度定义为：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  R̂ₛ(ℋ) = 𝔼<sub>σ</sub>[sup<sub>h∈ℋ</sub> (1/m) Σᵢ σᵢh(xᵢ)]
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                其中 σᵢ 是独立的Rademacher随机变量（以0.5概率取+1或-1）
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 直观理解</h4>
              <p className="text-gray-100 text-sm">
                Rademacher复杂度衡量假设空间ℋ拟合<strong className="text-white">随机噪声</strong>的能力。
                如果ℋ能很好地拟合随机标记，说明它很容易过拟合，复杂度高。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">基于Rademacher复杂度的泛化界</h4>
              <p className="text-gray-100 text-sm mb-2">
                以至少1-δ的概率，对所有h∈ℋ：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  error(h) ≤ êrror(h) + 2Rₘ(ℋ) + sqrt(ln(1/δ) / 2m)
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                其中 Rₘ(ℋ) 是假设空间的Rademacher复杂度
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              Rademacher复杂度与VC维相比：更加数据依赖，能更紧地刻画泛化能力，但计算更复杂。
            </p>
          </InfoCard>

          <DemoCard
            title="Rademacher复杂度演示"
            description="可视化不同假设空间拟合随机噪声的能力"
            status="开发中"
          />
        </Section>

        {/* Section 12.6: 稳定性 */}
        <Section
          number="12.6"
          title="稳定性"
        >
          <InfoCard title="算法稳定性">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">稳定性（Stability）</strong>从算法角度分析泛化能力，
              衡量训练集的微小变化对学习结果的影响。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">均匀稳定性</h4>
              <p className="text-gray-100 text-sm mb-2">
                学习算法𝓛具有<strong className="text-white">β-均匀稳定性</strong>，如果对于任意两个只差一个样本的训练集S和S'：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  sup<sub>z</sub> |ℓ(𝓛<sub>S</sub>, z) - ℓ(𝓛<sub>S'</sub>, z)| ≤ β
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                其中 ℓ(h, z) 是假设h在样本z上的损失
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">稳定性与泛化</h4>
              <p className="text-gray-100 text-sm mb-2">
                如果算法𝓛是β-均匀稳定的，则以至少1-δ的概率：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  error(𝓛<sub>S</sub>) ≤ êrror(𝓛<sub>S</sub>) + 2β + (4mβ + 1)sqrt(ln(1/δ) / 2m)
                </p>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 提高稳定性的方法</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">正则化</strong>：L2正则化可以提高算法稳定性</li>
                <li>• <strong className="text-white">集成学习</strong>：Bagging等方法通过平均降低方差，提高稳定性</li>
                <li>• <strong className="text-white">Early Stopping</strong>：限制训练迭代次数</li>
              </ul>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              <strong className="text-white">稳定性视角的优势</strong>：
              直接分析算法本身，不依赖假设空间结构；能够解释为什么正则化、集成学习等技术能提高泛化能力。
            </p>
          </InfoCard>

          <DemoCard
            title="算法稳定性对比"
            description="对比有无正则化的算法在训练集扰动下的输出变化"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
