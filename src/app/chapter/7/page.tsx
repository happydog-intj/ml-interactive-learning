'use client'

import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { NaiveBayesDemo } from '@/components/visualizations/NaiveBayesDemo'

export default function Chapter7() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/6', title: '支持向量机' }}
        nextChapter={{ href: '/chapter/8', title: '集成学习' }}
        currentChapter={7}
        totalChapters={16}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={7}
          title="贝叶斯分类器"
          subtitle="Bayesian Classifier"
          icon="🎲"
          gradient="from-ml-purple via-ml-blue to-ml-cyan"
          objectives={[
            '理解贝叶斯决策论的基本原理和最优性',
            '掌握极大似然估计和最大后验估计的区别',
            '理解朴素贝叶斯分类器的"朴素"假设及其影响',
            '掌握拉普拉斯修正处理零概率问题',
            '了解半朴素贝叶斯和贝叶斯网的基本思想'
          ]}
        />

        {/* 7.1 贝叶斯决策论 */}
        <Section number="7.1" title="贝叶斯决策论" gradient="from-ml-purple to-ml-blue">
          <InfoCard title="贝叶斯定理" icon="📐">
            <p className="mb-4">
              贝叶斯定理是贝叶斯学派的基石，描述了在获得新证据后如何更新我们的信念：
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">贝叶斯定理：</p>
                  <div className="text-2xl font-mono text-ml-cyan">
                    P(c|x) = P(x|c)·P(c) / P(x)
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                  <div className="bg-ml-bg-secondary p-3 rounded-lg">
                    <p className="text-ml-cyan font-bold mb-1">P(c|x)</p>
                    <p className="text-gray-100">后验概率</p>
                  </div>
                  <div className="bg-ml-bg-secondary p-3 rounded-lg">
                    <p className="text-ml-blue font-bold mb-1">P(x|c)</p>
                    <p className="text-gray-100">似然</p>
                  </div>
                  <div className="bg-ml-bg-secondary p-3 rounded-lg">
                    <p className="text-ml-purple font-bold mb-1">P(c)</p>
                    <p className="text-gray-100">先验概率</p>
                  </div>
                  <div className="bg-ml-bg-secondary p-3 rounded-lg">
                    <p className="text-ml-yellow font-bold mb-1">P(x)</p>
                    <p className="text-gray-100">证据因子</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-cyan">核心思想</strong>：
                后验概率 = (似然 × 先验) / 证据。通过观察数据x，更新对类别c的认知。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="贝叶斯判定准则" icon="⚖️" variant="accent">
            <p className="mb-4">
              为最小化总体风险，贝叶斯判定准则选择使后验概率最大的类别：
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">判定规则：</p>
                  <div className="text-2xl font-mono text-ml-blue">
                    h*(x) = argmax P(c|x)
                  </div>
                </div>

                <div className="text-ml-yellow">⇓ 等价于</div>

                <div>
                  <div className="text-2xl font-mono text-ml-purple">
                    h*(x) = argmax P(x|c)·P(c)
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">✓ 优势</h5>
                <ul className="text-sm space-y-1">
                  <li>• 理论最优（最小化期望风险）</li>
                  <li>• 融合先验知识</li>
                  <li>• 可解释性强</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h5 className="font-semibold text-ml-yellow mb-2">⚠️ 挑战</h5>
                <ul className="text-sm space-y-1">
                  <li>• 需要知道先验概率</li>
                  <li>• 需要估计类条件概率</li>
                  <li>• 计算复杂度可能很高</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="贝叶斯分类演示"
            description="可视化贝叶斯分类器的决策边界和后验概率分布（开发中）"
            icon="🎮"
            gradient="from-ml-purple to-ml-blue"
          >
            <div className="bg-ml-bg-dark rounded-xl p-12 border border-ml-border text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-xl text-gray-100 mb-2">交互式演示开发中</p>
              <p className="text-sm text-gray-100">敬请期待！</p>
            </div>
          </DemoCard>
        </Section>

        {/* 7.2 极大似然估计 */}
        <Section number="7.2" title="极大似然估计" gradient="from-ml-blue to-ml-cyan">
          <InfoCard title="参数估计" icon="📊">
            <p className="mb-4">
              极大似然估计（MLE）是频率学派估计参数的标准方法：
              <strong className="text-ml-cyan">选择使观测数据出现概率最大的参数</strong>。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">似然函数：</p>
                  <div className="text-xl font-mono text-white">
                    L(θ) = P(D|θ) = ∏P(x<sub>i</sub>|θ)
                  </div>
                </div>

                <div className="text-ml-yellow">⇓ 对数似然</div>

                <div>
                  <div className="text-xl font-mono text-ml-cyan">
                    ℓ(θ) = log L(θ) = Σlog P(x<sub>i</sub>|θ)
                  </div>
                </div>

                <div className="text-ml-yellow">⇓ 最大化</div>

                <div>
                  <div className="text-xl font-mono text-ml-blue">
                    θ̂<sub>MLE</sub> = argmax ℓ(θ)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-blue">为什么用对数</strong>：
                将连乘变为求和，便于计算和优化，且不改变最优解。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="MLE vs MAP" icon="🎯" variant="accent">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-blue/30">
                <h5 className="font-bold text-ml-blue mb-3 text-center">极大似然估计 (MLE)</h5>
                <div className="text-center font-mono text-lg text-white mb-4">
                  θ̂<sub>MLE</sub> = argmax P(D|θ)
                </div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-blue">•</span>
                    <span>频率学派观点</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-blue">•</span>
                    <span>不考虑先验知识</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-blue">•</span>
                    <span>数据充足时效果好</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-purple/30">
                <h5 className="font-bold text-ml-purple mb-3 text-center">最大后验估计 (MAP)</h5>
                <div className="text-center font-mono text-lg text-white mb-4">
                  θ̂<sub>MAP</sub> = argmax P(θ|D)
                </div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>贝叶斯学派观点</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>融合先验 P(θ)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>数据稀少时更稳健</span>
                  </li>
                </ul>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 7.3 朴素贝叶斯分类器 */}
        <Section number="7.3" title="朴素贝叶斯分类器" gradient="from-ml-cyan to-ml-green">
          <InfoCard title=""朴素"的假设" icon="🎭">
            <p className="mb-4">
              朴素贝叶斯分类器基于一个强假设：
              <strong className="text-ml-yellow">属性条件独立性假设</strong>。
              虽然这个假设在现实中往往不成立，但朴素贝叶斯在实践中表现出奇地好！
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">条件独立性假设</h5>

              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">完整的类条件概率：</p>
                  <div className="text-xl font-mono text-white">
                    P(x|c) = P(x₁,x₂,...,x<sub>d</sub>|c)
                  </div>
                  <p className="text-xs text-ml-red mt-2">参数数量随维度指数增长！</p>
                </div>

                <div className="text-ml-yellow text-2xl">⬇ 朴素假设</div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">简化后：</p>
                  <div className="text-xl font-mono text-ml-cyan">
                    P(x|c) = ∏P(x<sub>i</sub>|c)
                  </div>
                  <p className="text-xs text-ml-green mt-2">参数数量线性增长！</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-4">
                <h5 className="font-semibold text-ml-green mb-2">✓ 为什么有效？</h5>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 降低模型复杂度，避免过拟合</li>
                  <li>• 所需训练数据量大幅减少</li>
                  <li>• 训练和预测都非常快速</li>
                  <li>• 即使假设不完全成立，分类效果仍然不错</li>
                </ul>
              </div>

              <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
                <h5 className="font-semibold text-ml-yellow mb-2">⚠️ 局限性</h5>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 无法表达属性间的相关性</li>
                  <li>• 预测的概率值不够准确</li>
                  <li>• 特征高度相关时性能下降</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="拉普拉斯修正" icon="🔧" variant="accent">
            <p className="mb-4">
              当训练集中某个属性值在某个类别下从未出现时，会导致
              <strong className="text-ml-red">零概率问题</strong>：
              整个后验概率都会变成0！
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-ml-red mb-3 text-center">问题</h5>
                  <div className="text-center">
                    <p className="text-sm text-gray-100 mb-2">如果某个P(x<sub>i</sub>|c) = 0：</p>
                    <div className="text-xl font-mono text-ml-red">
                      P(c|x) = 0 × ... = 0
                    </div>
                    <p className="text-xs text-gray-100 mt-2">一个零值毁掉整个结果！</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-ml-green mb-3 text-center">解决方案</h5>
                  <div className="text-center">
                    <p className="text-sm text-gray-100 mb-2">拉普拉斯修正（加1平滑）：</p>
                    <div className="text-lg font-mono text-ml-green">
                      P̂(x<sub>i</sub>|c) = (N<sub>ic</sub> + 1) / (N<sub>c</sub> + N<sub>i</sub>)
                    </div>
                    <p className="text-xs text-gray-100 mt-2">确保所有概率都非零</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ml-cyan mb-2">朴素贝叶斯分类交互演示</h3>
              <p className="text-sm text-gray-100">
                经典的"打网球"问题：根据天气条件预测是否适合打网球，理解贝叶斯公式的计算过程
              </p>
            </div>
            <NaiveBayesDemo />
          </div>
        </Section>

        {/* 7.4 半朴素贝叶斯分类器 */}
        <Section number="7.4" title="半朴素贝叶斯分类器" gradient="from-ml-green to-ml-blue">
          <InfoCard title="放松独立性假设" icon="🔓">
            <p className="mb-4">
              半朴素贝叶斯分类器适当考虑一部分属性间的相互依赖信息，
              在<strong className="text-ml-cyan">模型复杂度</strong>和
              <strong className="text-ml-cyan">分类性能</strong>之间寻求平衡。
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <h5 className="font-semibold text-ml-purple mb-2">SPODE</h5>
                <p className="text-sm text-gray-100">
                  Super-Parent ODE<br/>
                  所有属性依赖于同一个超父属性
                </p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-cyan">
                <h5 className="font-semibold text-ml-cyan mb-2">TAN</h5>
                <p className="text-sm text-gray-100">
                  Tree Augmented Naive Bayes<br/>
                  属性间形成树状依赖结构
                </p>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">AODE</h5>
                <p className="text-sm text-gray-100">
                  Averaged ODE<br/>
                  集成多个SPODE模型
                </p>
              </div>
            </div>

            <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-cyan">核心思想</strong>：
                在朴素贝叶斯（完全独立）和贝叶斯网（任意依赖）之间找到平衡点。
              </p>
            </div>
          </InfoCard>
        </Section>

        {/* 7.5 贝叶斯网 */}
        <Section number="7.5" title="贝叶斯网" gradient="from-ml-blue to-ml-purple">
          <InfoCard title="概率图模型" icon="🕸️">
            <p className="mb-4">
              <strong className="text-ml-purple">贝叶斯网</strong>
              (Bayesian Network) 借助有向无环图(DAG)来刻画属性之间的依赖关系，
              并使用条件概率表(CPT)来描述属性的联合概率分布。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">贝叶斯网的组成</h5>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-semibold text-ml-blue mb-3">1. 结构（网络拓扑）</h6>
                  <ul className="text-sm space-y-2 text-gray-100">
                    <li>• 节点表示随机变量</li>
                    <li>• 有向边表示依赖关系</li>
                    <li>• 必须是有向无环图(DAG)</li>
                    <li>• 父节点影响子节点</li>
                  </ul>
                </div>

                <div>
                  <h6 className="font-semibold text-ml-purple mb-3">2. 参数（CPT）</h6>
                  <ul className="text-sm space-y-2 text-gray-100">
                    <li>• 每个节点有条件概率表</li>
                    <li>• P(X|Parents(X))</li>
                    <li>• 根节点只有先验概率</li>
                    <li>• 通过数据学习参数</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-ml-purple/10 border border-ml-purple/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-purple">联合概率分解</strong>：
                P(x₁,...,x<sub>n</sub>) = ∏P(x<sub>i</sub>|Parents(x<sub>i</sub>))
              </p>
            </div>
          </InfoCard>

          <InfoCard title="推断与学习" icon="🎓" variant="accent">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-5 rounded-xl">
                <h5 className="font-bold text-ml-cyan mb-3">推断问题</h5>
                <p className="text-sm text-gray-100 mb-3">
                  给定证据变量的观测值，计算查询变量的后验概率分布
                </p>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 精确推断：变量消除</li>
                  <li>• 近似推断：吉布斯采样</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-xl">
                <h5 className="font-bold text-ml-purple mb-3">学习问题</h5>
                <p className="text-sm text-gray-100 mb-3">
                  从数据中学习贝叶斯网的结构和参数
                </p>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 参数学习：MLE/MAP</li>
                  <li>• 结构学习：评分搜索</li>
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
                <span>贝叶斯定理提供了从先验概率和似然得到后验概率的原理性框架</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>贝叶斯判定准则在理论上是最优的，最小化期望风险</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>朴素贝叶斯通过属性条件独立性假设大幅简化计算，虽然假设强但实际效果好</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>拉普拉斯修正是处理零概率问题的标准方法，确保所有概率非零</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>半朴素贝叶斯和贝叶斯网在模型复杂度和性能之间寻求更好的平衡</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>贝叶斯方法特别适合小样本场景和需要融合先验知识的情况</span>
              </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
