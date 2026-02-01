'use client'

import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { RandomForestDemo } from '@/components/visualizations/RandomForestDemo'

export default function Chapter8() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/7', title: '贝叶斯分类器' }}
        nextChapter={{ href: '/chapter/9', title: '聚类' }}
        currentChapter={8}
        totalChapters={16}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={8}
          title="集成学习"
          subtitle="Ensemble Learning"
          icon="🤝"
          gradient="from-ml-green via-ml-yellow to-ml-orange"
          objectives={[
            '理解"三个臭皮匠顶个诸葛亮"的集成学习思想',
            '掌握Boosting和Bagging两大集成策略的区别',
            '理解随机森林的随机性来源和优势',
            '掌握多种结合策略：平均法、投票法、学习法',
            '理解多样性对集成学习性能的重要影响'
          ]}
        />

        {/* 8.1 个体与集成 */}
        <Section number="8.1" title="个体与集成" gradient="from-ml-green to-ml-yellow">
          <InfoCard title="集成学习的动机" icon="💡">
            <p className="mb-4">
              <strong className="text-ml-green">集成学习</strong>
              (Ensemble Learning) 通过构建并结合多个学习器来完成学习任务。
              俗话说"三个臭皮匠顶个诸葛亮"，这正是集成学习的核心思想。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-ml-yellow mb-3">单个学习器</h5>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🧠</div>
                    <p className="text-sm text-gray-100">可能犯错</p>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-100">
                    <li>• 偏差或方差较大</li>
                    <li>• 泛化能力有限</li>
                    <li>• 容易过拟合或欠拟合</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-ml-green mb-3">集成学习器</h5>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🧠🧠🧠</div>
                    <p className="text-sm text-gray-100">少数服从多数</p>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-100">
                    <li>• 降低方差（Bagging）</li>
                    <li>• 降低偏差（Boosting）</li>
                    <li>• 更好的泛化性能</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-green">关键条件</strong>：
                个体学习器要"好而不同"——既要有一定的准确性，又要有多样性。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="集成学习的类型" icon="🎯" variant="accent">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-cyan/30">
                <h5 className="font-bold text-ml-cyan mb-3 text-center">同质集成</h5>
                <p className="text-sm text-gray-100 mb-3 text-center">
                  个体学习器属于同一类型
                </p>
                <div className="text-center text-lg font-mono text-ml-cyan mb-3">
                  基学习器 (Base Learner)
                </div>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 例：都是决策树</li>
                  <li>• 例：都是神经网络</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-purple/30">
                <h5 className="font-bold text-ml-purple mb-3 text-center">异质集成</h5>
                <p className="text-sm text-gray-100 mb-3 text-center">
                  个体学习器包含不同类型
                </p>
                <div className="text-center text-lg font-mono text-ml-purple mb-3">
                  组件学习器 (Component Learner)
                </div>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 例：决策树+SVM+神经网络</li>
                  <li>• 多样性更好</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="集成学习效果演示"
            description="可视化对比单个学习器和集成学习器的决策边界（开发中）"
            icon="🎮"
            gradient="from-ml-green to-ml-yellow"
          >
            <div className="bg-ml-bg-dark rounded-xl p-12 border border-ml-border text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-xl text-gray-100 mb-2">交互式演示开发中</p>
              <p className="text-sm text-gray-100">将展示集成如何降低误差</p>
            </div>
          </DemoCard>
        </Section>

        {/* 8.2 Boosting */}
        <Section number="8.2" title="Boosting" gradient="from-ml-yellow to-ml-orange">
          <InfoCard title="Boosting策略" icon="🚀">
            <p className="mb-4">
              <strong className="text-ml-orange">Boosting</strong>
              是一族可将弱学习器提升为强学习器的算法。
              其工作机制：<strong className="text-ml-yellow">先训练一个基学习器，再根据其表现调整训练样本分布，使后续学习器更关注之前分错的样本</strong>。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">Boosting工作流程</h5>

              <div className="space-y-4">
                {[
                  { step: '1', desc: '初始化：所有样本权重相同', icon: '⚖️' },
                  { step: '2', desc: '训练：根据当前权重训练学习器', icon: '🎓' },
                  { step: '3', desc: '评估：计算学习器的错误率', icon: '📊' },
                  { step: '4', desc: '更新：增加分错样本的权重', icon: '⬆️' },
                  { step: '5', desc: '重复步骤2-4，直到达到预设数量', icon: '🔄' },
                  { step: '6', desc: '组合：加权组合所有学习器', icon: '🤝' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-ml-bg-secondary p-3 rounded-lg">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <span className="font-bold text-ml-yellow">步骤 {item.step}:</span>
                      <span className="text-gray-100 ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ml-orange/10 border border-ml-orange/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-orange">核心思想</strong>：
                通过序列化训练，让后面的学习器专注于前面学习器的"短板"。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="AdaBoost算法" icon="⭐" variant="accent">
            <p className="mb-4">
              AdaBoost (Adaptive Boosting) 是最著名的Boosting算法之一。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-100 mb-2">学习器权重：</p>
                  <div className="text-center text-xl font-mono text-ml-yellow">
                    α<sub>t</sub> = ½ ln((1-ε<sub>t</sub>)/ε<sub>t</sub>)
                  </div>
                  <p className="text-xs text-center text-gray-100 mt-2">
                    错误率ε<sub>t</sub>越小，权重α<sub>t</sub>越大
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-100 mb-2">样本权重更新：</p>
                  <div className="text-center text-lg font-mono text-ml-cyan">
                    D<sub>t+1</sub>(i) = D<sub>t</sub>(i) × exp(-α<sub>t</sub>y<sub>i</sub>h<sub>t</sub>(x<sub>i</sub>)) / Z<sub>t</sub>
                  </div>
                  <p className="text-xs text-center text-gray-100 mt-2">
                    分类错误的样本权重增加，正确的减少
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">✓ 优势</h5>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 泛化性能强</li>
                  <li>• 不易过拟合</li>
                  <li>• 可用于各种基学习器</li>
                  <li>• 不需要知道弱学习器的性能下界</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h5 className="font-semibold text-ml-yellow mb-2">⚠️ 注意</h5>
                <ul className="text-sm space-y-1 text-gray-100">
                  <li>• 对噪声敏感</li>
                  <li>• 训练时间较长（串行）</li>
                  <li>• 基学习器不能太复杂</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="AdaBoost演示"
            description="可视化AdaBoost如何逐步调整样本权重和组合弱分类器（开发中）"
            icon="🎯"
            gradient="from-ml-yellow to-ml-orange"
          >
            <div className="bg-ml-bg-dark rounded-xl p-12 border border-ml-border text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-xl text-gray-100 mb-2">交互式演示开发中</p>
              <p className="text-sm text-gray-100">将展示样本权重的动态调整过程</p>
            </div>
          </DemoCard>
        </Section>

        {/* 8.3 Bagging与随机森林 */}
        <Section number="8.3" title="Bagging与随机森林" gradient="from-ml-orange to-ml-green">
          <InfoCard title="Bagging策略" icon="📦">
            <p className="mb-4">
              <strong className="text-ml-cyan">Bagging</strong>
              (Bootstrap AGGregatING) 基于自助采样法(Bootstrap Sampling)，
              通过<strong className="text-ml-green">并行训练多个学习器并进行结合</strong>来降低方差。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">Bagging工作流程</h5>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-semibold text-ml-cyan mb-3">1. 自助采样</h6>
                  <ul className="text-sm space-y-2 text-gray-100">
                    <li>• 从数据集D中有放回采样</li>
                    <li>• 每次采样m个样本</li>
                    <li>• 生成T个训练集</li>
                    <li>• 约36.8%样本未被采到（OOB）</li>
                  </ul>
                </div>

                <div>
                  <h6 className="font-semibold text-ml-green mb-3">2. 并行训练</h6>
                  <ul className="text-sm space-y-2 text-gray-100">
                    <li>• 在每个采样集上独立训练</li>
                    <li>• 训练T个基学习器</li>
                    <li>• 可并行化，训练快</li>
                    <li>• 学习器之间相互独立</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-ml-border">
                <h6 className="font-semibold text-ml-purple mb-3 text-center">3. 结合预测</h6>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-ml-bg-secondary p-3 rounded-lg text-center">
                    <p className="text-ml-blue font-bold mb-1">分类任务</p>
                    <p className="text-gray-100">简单投票法</p>
                  </div>
                  <div className="bg-ml-bg-secondary p-3 rounded-lg text-center">
                    <p className="text-ml-green font-bold mb-1">回归任务</p>
                    <p className="text-gray-100">简单平均法</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ml-cyan/10 border border-ml-cyan/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-cyan">为什么有效</strong>：
                通过训练集的扰动，个体学习器之间产生差异，降低整体方差。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="随机森林 (Random Forest)" icon="🌲" variant="success">
            <p className="mb-4">
              随机森林是Bagging的一个扩展变体，以决策树为基学习器，
              在Bagging的基础上进一步引入了<strong className="text-ml-green">随机属性选择</strong>。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">两层随机性</h5>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-ml-bg-secondary p-5 rounded-xl border-l-4 border-ml-cyan">
                  <h6 className="font-bold text-ml-cyan mb-3">样本随机</h6>
                  <p className="text-sm text-gray-100 mb-2">Bootstrap采样</p>
                  <ul className="text-sm space-y-1 text-gray-100">
                    <li>• 每棵树训练不同的样本子集</li>
                    <li>• 有放回采样</li>
                  </ul>
                </div>

                <div className="bg-ml-bg-secondary p-5 rounded-xl border-l-4 border-ml-green">
                  <h6 className="font-bold text-ml-green mb-3">特征随机</h6>
                  <p className="text-sm text-gray-100 mb-2">随机选择k个属性</p>
                  <ul className="text-sm space-y-1 text-gray-100">
                    <li>• 每次划分只考虑k个特征</li>
                    <li>• 推荐 k = log₂d</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h6 className="font-semibold text-ml-green mb-2">训练快速</h6>
                <p className="text-xs text-gray-100">可并行，决策树简单</p>
              </div>

              <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h6 className="font-semibold text-ml-blue mb-2">性能优秀</h6>
                <p className="text-xs text-gray-100">泛化能力强，准确度高</p>
              </div>

              <div className="bg-ml-purple/10 border border-ml-purple/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h6 className="font-semibold text-ml-purple mb-2">鲁棒性好</h6>
                <p className="text-xs text-gray-100">对噪声和过拟合抗性强</p>
              </div>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-green/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ml-green mb-2">随机森林交互演示</h3>
              <p className="text-sm text-gray-100">
                观察多棵决策树如何通过投票机制得到最终预测，理解特征随机和样本随机的作用
              </p>
            </div>
            <RandomForestDemo />
          </div>
        </Section>

        {/* 8.4 结合策略 */}
        <Section number="8.4" title="结合策略" gradient="from-ml-green to-ml-cyan">
          <InfoCard title="如何结合多个学习器？" icon="🤝">
            <p className="mb-4">
              学习器结合可能从三个方面带来好处：
              <strong className="text-ml-cyan">统计</strong>、
              <strong className="text-ml-cyan">计算</strong>、
              <strong className="text-ml-cyan">表示</strong>。
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-cyan">
                <h5 className="font-semibold text-ml-cyan mb-2">平均法</h5>
                <p className="text-sm text-gray-100 mb-3">用于回归任务</p>
                <ul className="text-xs space-y-1 text-gray-100">
                  <li>• 简单平均</li>
                  <li>• 加权平均</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-blue">
                <h5 className="font-semibold text-ml-blue mb-2">投票法</h5>
                <p className="text-sm text-gray-100 mb-3">用于分类任务</p>
                <ul className="text-xs space-y-1 text-gray-100">
                  <li>• 绝对多数投票</li>
                  <li>• 相对多数投票</li>
                  <li>• 加权投票</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">学习法</h5>
                <p className="text-sm text-gray-100 mb-3">Stacking</p>
                <ul className="text-xs space-y-1 text-gray-100">
                  <li>• 训练元学习器</li>
                  <li>• 学习如何组合</li>
                </ul>
              </div>
            </div>

            <div className="bg-ml-bg-dark p-6 rounded-lg">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">Stacking</h5>
              <div className="space-y-3 text-sm text-gray-100">
                <p>• <strong className="text-white">初级学习器</strong>：在原始数据集上训练多个不同的学习器</p>
                <p>• <strong className="text-white">次级学习器</strong>：将初级学习器的输出作为新特征，训练元学习器</p>
                <p>• <strong className="text-white">优势</strong>：理论上可以学习到最优的结合方式</p>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 8.5 多样性 */}
        <Section number="8.5" title="多样性" gradient="from-ml-cyan to-ml-purple">
          <InfoCard title="为什么需要多样性？" icon="🎨">
            <p className="mb-4">
              集成学习要取得好的性能，个体学习器应"好而不同"。
              <strong className="text-ml-purple">多样性</strong>
              (Diversity) 是集成学习成功的关键。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center">增强多样性的方法</h5>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: '数据样本扰动', items: ['Bootstrap采样', '不同样本权重', '不同样本子集'] },
                  { title: '输入属性扰动', items: ['随机子空间', '随机特征选择', '特征变换'] },
                  { title: '输出表示扰动', items: ['翻转输出', 'ECOC编码', '类别重标记'] },
                  { title: '算法参数扰动', items: ['不同参数设置', '不同随机初始化', '不同学习算法'] }
                ].map((method, idx) => (
                  <div key={idx} className="bg-ml-bg-secondary p-4 rounded-lg">
                    <h6 className="font-semibold text-ml-cyan mb-2">{method.title}</h6>
                    <ul className="text-sm space-y-1 text-gray-100">
                      {method.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ml-purple/10 border border-ml-purple/30 rounded-lg p-4">
              <p className="text-white text-sm">
                <strong className="text-ml-purple">权衡</strong>：
                多样性和准确性之间存在冲突。理想的集成应在两者间取得最佳平衡。
              </p>
            </div>
          </InfoCard>
        </Section>

        {/* 本章小结 */}
        <div className="mt-16 mb-12">
          <InfoCard title="本章小结" icon="📝" variant="success">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>集成学习通过构建并结合多个学习器，往往能获得比单一学习器更好的泛化性能</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>Boosting串行训练，关注难分样本，主要降低偏差；Bagging并行训练，降低方差</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>随机森林在Bagging基础上引入随机特征选择，是最成功的集成学习方法之一</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>结合策略包括平均法、投票法和学习法(Stacking)，应根据任务选择合适的策略</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>多样性是集成学习的关键，可通过数据、属性、输出、参数等多种方式增强</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>实践中随机森林和GBDT(梯度提升决策树)是最常用和效果最好的集成方法</span>
              </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
