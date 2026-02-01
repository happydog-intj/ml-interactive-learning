'use client'
import { DecisionTreeViz } from '@/components/visualizations/DecisionTreeViz'
import { EntropyCalculator } from '@/components/visualizations/EntropyCalculator'
import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter4() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/3', title: '线性模型' }}
        nextChapter={{ href: '/chapter/5', title: '神经网络' }}
        currentChapter={4}
        totalChapters={5}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={4}
          title="决策树"
          subtitle="Decision Trees"
          icon="🌳"
          gradient="from-ml-purple via-ml-blue to-ml-cyan"
          objectives={[
            '理解决策树的基本原理和递归构建过程',
            '掌握信息增益、信息增益率、基尼指数等划分标准',
            '理解剪枝技术如何防止过拟合',
            '学会处理连续属性和缺失值',
            '认识决策树的优缺点及适用场景'
          ]}
        />

        {/* 4.1 基本流程 */}
        <Section number="4.1" title="基本流程" gradient="from-ml-purple to-ml-blue">
          <InfoCard title="什么是决策树？" icon="🌳">
            <p className="mb-4">
              决策树是一种基于树结构的分类与回归方法。它通过一系列的判断规则，
              将样本从根节点逐步划分到叶节点，每个叶节点对应一个类别或数值。
            </p>
            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-lg">决策树的组成</h5>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-ml-bg-secondary p-4 rounded-lg border-l-4 border-ml-purple">
                  <div className="text-2xl mb-2">🔴</div>
                  <h6 className="font-bold text-ml-purple mb-2">根节点</h6>
                  <p className="text-sm text-gray-100">包含所有训练样本，树的起点</p>
                </div>
                <div className="bg-ml-bg-secondary p-4 rounded-lg border-l-4 border-ml-blue">
                  <div className="text-2xl mb-2">🔵</div>
                  <h6 className="font-bold text-ml-blue mb-2">内部节点</h6>
                  <p className="text-sm text-gray-100">对应一个属性测试，将样本分流</p>
                </div>
                <div className="bg-ml-bg-secondary p-4 rounded-lg border-l-4 border-ml-green">
                  <div className="text-2xl mb-2">🟢</div>
                  <h6 className="font-bold text-ml-green mb-2">叶节点</h6>
                  <p className="text-sm text-gray-100">表示决策结果（类别标签）</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="递归构建过程" icon="🔄" variant="accent">
            <p className="mb-4 text-white">
              决策树的构建是一个<strong className="text-ml-yellow">自顶向下</strong>的递归过程，
              基于<strong className="text-ml-yellow">分而治之</strong>策略：
            </p>
            <div className="space-y-3">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <h6 className="font-semibold text-ml-purple mb-1">选择最优划分属性</h6>
                    <p className="text-sm text-gray-100">
                      从当前节点的属性集合中，选择最能降低不确定性的属性
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-blue">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <h6 className="font-semibold text-ml-blue mb-1">生成分支</h6>
                    <p className="text-sm text-gray-100">
                      根据选定属性的取值，将样本集划分到对应的子节点
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-cyan">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <h6 className="font-semibold text-ml-cyan mb-1">递归处理子节点</h6>
                    <p className="text-sm text-gray-100">
                      对每个非空子集，递归执行上述步骤，直至满足停止条件
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="停止条件" icon="🛑" variant="warning">
            <p className="mb-3 text-white">
              当满足以下任一条件时，停止分裂并将当前节点标记为叶节点：
            </p>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">✓</span>
                <span>当前节点的所有样本属于同一类别</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">✓</span>
                <span>属性集为空，或所有样本在所有属性上取值相同</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">✓</span>
                <span>当前节点包含的样本数少于预设阈值</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">✓</span>
                <span>树的深度达到预设的最大值</span>
              </li>
            </ul>
          </InfoCard>
        </Section>

        {/* 4.2 划分选择 */}
        <Section number="4.2" title="划分选择" gradient="from-ml-blue to-ml-cyan">
          <InfoCard title="如何选择最优划分属性？" icon="🎯">
            <p className="mb-4 text-white">
              决策树学习的关键是如何选择最优划分属性。我们希望选择的属性能够
              <strong className="text-ml-cyan">最大程度地降低数据的不纯度</strong>，
              使得划分后的子节点尽可能"纯"（即包含单一类别的样本）。
            </p>
            <p className="text-sm italic text-ml-yellow bg-ml-bg-dark p-4 rounded">
              不同的决策树算法使用不同的划分标准：ID3 使用信息增益，C4.5 使用信息增益率，CART 使用基尼指数。
            </p>
          </InfoCard>

          <InfoCard title="信息熵 (Entropy)" icon="📊" variant="accent">
            <p className="mb-4 text-white">
              信息熵是度量样本集合纯度的常用指标。假设样本集合 D 中第 k 类样本所占比例为 p<sub>k</sub>，
              则 D 的信息熵定义为：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-2xl text-ml-cyan font-mono">
                Ent(D) = -Σ p<sub>k</sub> log<sub>2</sub> p<sub>k</sub>
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <p className="text-ml-green font-bold mb-1">Ent(D) = 0</p>
                <p className="text-sm text-gray-100">完全纯，所有样本同类</p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <p className="text-ml-yellow font-bold mb-1">Ent(D) = 1</p>
                <p className="text-sm text-gray-100">最不纯，类别均匀分布</p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg text-center">
                <p className="text-ml-blue font-bold mb-1">Ent(D) &uarr;</p>
                <p className="text-sm text-gray-100">混乱度越高</p>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="信息熵计算器"
            description="调整不同类别的样本数量，观察信息熵如何变化。熵值越小，数据集越纯；熵值越大，数据集越混乱。"
            icon="🎮"
            gradient="from-ml-blue to-ml-cyan"
          >
            <EntropyCalculator />
          </DemoCard>

          <InfoCard title="信息增益 (Information Gain) - ID3" icon="📈">
            <p className="mb-4 text-white">
              信息增益表示使用属性 a 进行划分所获得的"纯度提升"。
              信息增益越大，说明使用属性 a 划分后纯度提升越大。
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-xl text-ml-purple font-mono mb-2">
                Gain(D, a) = Ent(D) - Σ (|D<sup>v</sup>|/|D|) × Ent(D<sup>v</sup>)
              </p>
              <p className="text-sm text-gray-100 mt-3">
                D<sup>v</sup> 表示属性 a 取值为 v 的样本子集
              </p>
            </div>
            <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-red mt-4">
              <h6 className="font-semibold text-ml-red mb-2">⚠️ 信息增益的偏好</h6>
              <p className="text-sm text-white">
                信息增益倾向于选择取值数目较多的属性（如"编号"属性），
                这可能导致过拟合。C4.5 算法通过信息增益率来缓解这个问题。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="信息增益率 (Gain Ratio) - C4.5" icon="📊" variant="accent">
            <p className="mb-4 text-white">
              信息增益率通过引入"固有值"来对信息增益进行归一化，缓解信息增益对取值数目多的属性的偏好：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-xl text-ml-blue font-mono mb-3">
                Gain_ratio(D, a) = Gain(D, a) / IV(a)
              </p>
              <p className="text-lg text-ml-cyan font-mono">
                IV(a) = -Σ (|D<sup>v</sup>|/|D|) × log<sub>2</sub>(|D<sup>v</sup>|/|D|)
              </p>
              <p className="text-sm text-gray-100 mt-3">
                IV(a) 称为属性 a 的固有值，属性取值数目越多，IV(a) 通常越大
              </p>
            </div>
            <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
              <h6 className="font-semibold text-ml-yellow mb-2">💡 C4.5 的启发式策略</h6>
              <p className="text-sm text-white">
                先从候选属性中找出信息增益高于平均水平的属性，
                再从中选择信息增益率最高的。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="基尼指数 (Gini Index) - CART" icon="🎲">
            <p className="mb-4 text-white">
              基尼指数反映了从数据集 D 中随机抽取两个样本，其类别标记不一致的概率。
              基尼指数越小，数据集的纯度越高。
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-2xl text-ml-green font-mono mb-3">
                Gini(D) = 1 - Σ p<sub>k</sub>²
              </p>
              <p className="text-lg text-ml-cyan font-mono mt-4">
                Gini_index(D, a) = Σ (|D<sup>v</sup>|/|D|) × Gini(D<sup>v</sup>)
              </p>
              <p className="text-sm text-gray-100 mt-3">
                选择使得 Gini_index 最小的属性作为最优划分属性
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h6 className="font-semibold text-ml-green mb-2">✓ 优势</h6>
                <ul className="text-sm space-y-1 text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>计算简单，不需要对数运算</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>CART 算法的默认指标</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>适合二叉树结构</span>
                  </li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <h6 className="font-semibold text-ml-purple mb-2">📌 特点</h6>
                <ul className="text-sm space-y-1 text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>偏向选择特征值较多的特征</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>对不平衡数据集敏感</span>
                  </li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="决策树构建可视化"
            description="选择划分标准（信息增益、信息增益率、基尼指数），观察决策树的构建过程。点击节点查看详细信息和计算过程。"
            icon="🎮"
            gradient="from-ml-purple to-ml-cyan"
          >
            <DecisionTreeViz />
          </DemoCard>
        </Section>

        {/* 4.3 剪枝处理 */}
        <Section number="4.3" title="剪枝处理" gradient="from-ml-cyan to-ml-green">
          <InfoCard title="为什么需要剪枝？" icon="✂️">
            <p className="mb-4 text-white">
              决策树在训练时为了尽可能正确分类训练样本，会不断分裂生长。
              这可能导致<strong className="text-ml-red">过拟合</strong>：
              树的分支过多过细，把训练集自身的特点当作了所有数据的一般性质。
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-red">
              <h6 className="font-semibold text-ml-red mb-2">过拟合的表现</h6>
              <ul className="text-sm space-y-1 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-ml-red">•</span>
                  <span>训练误差很低，但测试误差很高</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red">•</span>
                  <span>树的深度过大，叶节点数量过多</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red">•</span>
                  <span>对训练数据的噪声过度敏感</span>
                </li>
              </ul>
            </div>
            <p className="text-white mt-4">
              剪枝是决策树学习算法对付过拟合的主要手段，通过主动去掉部分分支来降低过拟合风险。
            </p>
          </InfoCard>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="预剪枝 (Pre-Pruning)" icon="🛑" variant="default">
              <p className="mb-3 text-white">
                在决策树生成过程中，<strong className="text-ml-blue">提前停止树的生长</strong>。
                在每个节点划分前，先评估划分是否能提升泛化性能。
              </p>
              <div className="bg-ml-bg-dark p-4 rounded-lg my-3">
                <h6 className="font-semibold text-ml-cyan mb-2">策略</h6>
                <ul className="text-sm space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-cyan">•</span>
                    <span>限制树的最大深度</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-cyan">•</span>
                    <span>限制节点的最小样本数</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-cyan">•</span>
                    <span>限制信息增益的最小阈值</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-cyan">•</span>
                    <span>使用验证集评估划分效果</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="bg-ml-green/10 border-l-4 border-ml-green p-3 rounded">
                  <p className="text-sm text-white"><strong className="text-ml-green">✓ 优点：</strong>计算开销小，生成过程直接停止</p>
                </div>
                <div className="bg-ml-red/10 border-l-4 border-ml-red p-3 rounded">
                  <p className="text-sm text-white"><strong className="text-ml-red">✗ 缺点：</strong>可能过早停止，欠拟合风险</p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="后剪枝 (Post-Pruning)" icon="✂️" variant="accent">
              <p className="mb-3 text-white">
                先生成完整的决策树，然后<strong className="text-ml-purple">自底向上</strong>地检查非叶节点，
                若将该节点替换为叶节点能提升泛化性能，则进行剪枝。
              </p>
              <div className="bg-ml-bg-dark p-4 rounded-lg my-3">
                <h6 className="font-semibold text-ml-purple mb-2">过程</h6>
                <ol className="text-sm space-y-2 text-white list-decimal list-inside">
                  <li>生成完整决策树</li>
                  <li>从叶节点向上考察每个非叶节点</li>
                  <li>若剪枝后验证集性能提升，则剪枝</li>
                  <li>重复直到无法继续剪枝</li>
                </ol>
              </div>
              <div className="space-y-2">
                <div className="bg-ml-green/10 border-l-4 border-ml-green p-3 rounded">
                  <p className="text-sm text-white"><strong className="text-ml-green">✓ 优点：</strong>保留更多有用分支，泛化性能更好</p>
                </div>
                <div className="bg-ml-red/10 border-l-4 border-ml-red p-3 rounded">
                  <p className="text-sm text-white"><strong className="text-ml-red">✗ 缺点：</strong>训练时间更长，需要额外验证集</p>
                </div>
              </div>
            </InfoCard>
          </div>

          <InfoCard title="剪枝对比" icon="⚖️" variant="warning">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-3 text-ml-yellow">特性</th>
                    <th className="text-left p-3 text-ml-blue">预剪枝</th>
                    <th className="text-left p-3 text-ml-purple">后剪枝</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  <tr className="border-b border-gray-700">
                    <td className="p-3 font-semibold">时机</td>
                    <td className="p-3">生成过程中</td>
                    <td className="p-3">生成完成后</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-3 font-semibold">计算开销</td>
                    <td className="p-3">小</td>
                    <td className="p-3">大</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-3 font-semibold">过拟合风险</td>
                    <td className="p-3">低</td>
                    <td className="p-3">更低</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-3 font-semibold">欠拟合风险</td>
                    <td className="p-3">较高</td>
                    <td className="p-3">低</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">泛化性能</td>
                    <td className="p-3">较好</td>
                    <td className="p-3">更好</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoCard>
        </Section>

        {/* 4.4 连续与缺失值 */}
        <Section number="4.4" title="连续值与缺失值" gradient="from-ml-green to-ml-purple">
          <InfoCard title="处理连续值属性" icon="📏">
            <p className="mb-4 text-white">
              前面讨论的都是<strong className="text-ml-yellow">离散属性</strong>。
              但实际任务中常会遇到<strong className="text-ml-yellow">连续属性</strong>（如身高、体重、温度）。
              最常用的方法是<strong className="text-ml-cyan">二分法（Binary Split）</strong>。
            </p>
            <div className="bg-ml-bg-dark p-5 rounded-lg my-4">
              <h6 className="font-semibold text-ml-cyan mb-3 text-center">连续属性离散化</h6>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">1️⃣</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ml-blue mb-1">排序</p>
                    <p className="text-sm text-gray-100">
                      将连续属性的所有取值按从小到大排序：a<sup>1</sup>, a<sup>2</sup>, ..., a<sup>n</sup>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">2️⃣</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ml-purple mb-1">候选划分点</p>
                    <p className="text-sm text-gray-100">
                      考虑相邻两个值的中点：t<sub>i</sub> = (a<sup>i</sup> + a<sup>i+1</sup>) / 2
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">3️⃣</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ml-green mb-1">选择最优划分点</p>
                    <p className="text-sm text-gray-100">
                      将样本分为 ≤ t 和 &gt; t 两部分，计算信息增益，选择最优的 t
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
              <h6 className="font-semibold text-ml-yellow mb-2">💡 关键特性</h6>
              <p className="text-sm text-white">
                与离散属性不同，连续属性在生成子树时可以继续使用（多次划分）。
                例如，可以先判断"年龄 &lt;= 30"，在某个分支下再判断"年龄 &lt;= 25"。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="处理缺失值" icon="❓" variant="accent">
            <p className="mb-4 text-white">
              现实任务中常会遇到<strong className="text-ml-red">属性值缺失</strong>的情况。
              这给决策树学习带来两个问题：
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-red">
                <h6 className="font-semibold text-ml-red mb-2">问题1：属性选择</h6>
                <p className="text-sm text-white">
                  如何在某属性值缺失的情况下，进行划分属性的选择？
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h6 className="font-semibold text-ml-yellow mb-2">问题2：样本划分</h6>
                <p className="text-sm text-white">
                  给定划分属性后，若某样本在该属性上的值缺失，如何对该样本进行划分？
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark p-5 rounded-lg">
              <h6 className="font-semibold text-ml-purple mb-4 text-center">解决方案</h6>

              <div className="space-y-4">
                <div>
                  <h6 className="font-semibold text-ml-blue mb-2">方法1：样本权重</h6>
                  <p className="text-sm text-white mb-2">
                    为每个样本赋予权重 w，初始时 w = 1。在属性选择时，只考虑该属性上无缺失值的样本，
                    根据这些样本的权重比例来调整信息增益的计算。
                  </p>
                  <div className="bg-ml-bg-secondary p-3 rounded text-center">
                    <p className="text-sm text-ml-cyan font-mono">
                      ρ = Σ(无缺失样本权重) / Σ(全部样本权重)
                    </p>
                  </div>
                </div>

                <div>
                  <h6 className="font-semibold text-ml-cyan mb-2">方法2：同时划入多个分支</h6>
                  <p className="text-sm text-white mb-2">
                    若某样本在划分属性上的值缺失，则将该样本<strong className="text-ml-yellow">同时划入所有子节点</strong>，
                    但权重按子节点样本比例分配。
                  </p>
                  <div className="bg-ml-bg-secondary p-3 rounded">
                    <p className="text-sm text-white">
                      例如：某节点有 60% 样本进入左子树，40% 进入右子树。
                      缺失值样本以 0.6 的权重进入左子树，0.4 的权重进入右子树。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="其他缺失值处理方法" icon="🔧">
            <div className="space-y-3">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-blue">
                <h6 className="font-semibold text-ml-blue mb-2">删除法</h6>
                <p className="text-sm text-white">
                  直接删除包含缺失值的样本。简单但可能损失大量信息，仅适用于缺失比例很小的情况。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <h6 className="font-semibold text-ml-purple mb-2">填充法</h6>
                <p className="text-sm text-white mb-2">用某个值填充缺失值：</p>
                <ul className="text-sm space-y-1 text-white ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>均值/众数：用该属性的平均值或最常见值填充</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>同类均值：用相同类别样本的均值填充</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-purple">•</span>
                    <span>模型预测：用其他算法预测缺失值</span>
                  </li>
                </ul>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 4.5 决策树的优缺点 */}
        <Section number="4.5" title="优缺点与应用" gradient="from-ml-purple to-ml-cyan">
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="优点" icon="✓" variant="success">
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-ml-green text-xl">✓</span>
                  <div>
                    <strong className="text-ml-green">可解释性强</strong>
                    <p className="text-sm text-gray-100">决策过程直观，可以转换为规则</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green text-xl">✓</span>
                  <div>
                    <strong className="text-ml-green">处理能力强</strong>
                    <p className="text-sm text-gray-100">可处理连续值、类别型、缺失值</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green text-xl">✓</span>
                  <div>
                    <strong className="text-ml-green">无需归一化</strong>
                    <p className="text-sm text-gray-100">对数据缩放不敏感</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green text-xl">✓</span>
                  <div>
                    <strong className="text-ml-green">训练快速</strong>
                    <p className="text-sm text-gray-100">适合大规模数据集</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green text-xl">✓</span>
                  <div>
                    <strong className="text-ml-green">特征选择</strong>
                    <p className="text-sm text-gray-100">自动进行特征筛选</p>
                  </div>
                </li>
              </ul>
            </InfoCard>

            <InfoCard title="缺点" icon="✗" variant="default">
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-ml-red text-xl">✗</span>
                  <div>
                    <strong className="text-ml-red">容易过拟合</strong>
                    <p className="text-sm text-gray-100">需要剪枝来控制复杂度</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red text-xl">✗</span>
                  <div>
                    <strong className="text-ml-red">不稳定</strong>
                    <p className="text-sm text-gray-100">数据微小变化可能导致树结构大变</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red text-xl">✗</span>
                  <div>
                    <strong className="text-ml-red">贪心策略</strong>
                    <p className="text-sm text-gray-100">局部最优，无法保证全局最优</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red text-xl">✗</span>
                  <div>
                    <strong className="text-ml-red">类别不平衡</strong>
                    <p className="text-sm text-gray-100">倾向于多数类</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-red text-xl">✗</span>
                  <div>
                    <strong className="text-ml-red">轴对齐限制</strong>
                    <p className="text-sm text-gray-100">只能沿特征轴划分，难以处理斜向边界</p>
                  </div>
                </li>
              </ul>
            </InfoCard>
          </div>

          <InfoCard title="实际应用场景" icon="🎯" variant="accent">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">🏥</div>
                <h6 className="font-semibold text-ml-cyan mb-2">医疗诊断</h6>
                <p className="text-sm text-white">
                  根据症状、检查结果等制定诊断规则，医生可以理解决策依据
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">💳</div>
                <h6 className="font-semibold text-ml-blue mb-2">信用评估</h6>
                <p className="text-sm text-white">
                  根据个人信息、财务状况评估信用风险，结果可解释
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">📧</div>
                <h6 className="font-semibold text-ml-purple mb-2">垃圾邮件过滤</h6>
                <p className="text-sm text-white">
                  根据邮件特征快速判断是否为垃圾邮件
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">🎮</div>
                <h6 className="font-semibold text-ml-green mb-2">游戏AI</h6>
                <p className="text-sm text-white">
                  NPC决策树，根据玩家行为做出不同反应
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">🛒</div>
                <h6 className="font-semibold text-ml-yellow mb-2">推荐系统</h6>
                <p className="text-sm text-white">
                  根据用户画像和行为推荐商品
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <div className="text-2xl mb-2">🔍</div>
                <h6 className="font-semibold text-ml-red mb-2">欺诈检测</h6>
                <p className="text-sm text-white">
                  识别异常交易模式，防范金融欺诈
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="改进与扩展" icon="🚀">
            <p className="mb-4 text-white">
              为了克服单棵决策树的缺点，研究者提出了多种改进方法：
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h6 className="font-semibold text-ml-green mb-2">随机森林 (Random Forest)</h6>
                <p className="text-sm text-white">
                  集成多棵决策树，通过"投票"提高稳定性和准确率。
                  是最流行的集成学习方法之一。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-blue">
                <h6 className="font-semibold text-ml-blue mb-2">梯度提升树 (GBDT)</h6>
                <p className="text-sm text-white">
                  通过逐步拟合残差来提升性能。XGBoost、LightGBM 等是其高效实现。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-purple">
                <h6 className="font-semibold text-ml-purple mb-2">多变量决策树</h6>
                <p className="text-sm text-white">
                  每个内部节点使用多个属性的线性组合进行测试，可以处理斜向边界。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h6 className="font-semibold text-ml-yellow mb-2">增量学习</h6>
                <p className="text-sm text-white">
                  支持在线学习，新数据到来时无需重新训练整棵树。
                </p>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* 本章小结 */}
        <div className="mt-16 mb-12">
          <InfoCard title="本章小结" icon="📝" variant="success">
            <div className="space-y-3 text-white">
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>决策树通过递归划分构建树结构，每个内部节点对应属性测试，叶节点对应决策结果</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>信息增益（ID3）、信息增益率（C4.5）、基尼指数（CART）是三种主流的划分标准</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>信息熵衡量样本集合的纯度，熵越小表示纯度越高</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>剪枝是对抗过拟合的主要手段，分为预剪枝和后剪枝两种策略</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>连续值通过二分法离散化，缺失值通过样本权重和多分支划入处理</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>决策树具有可解释性强、训练快速等优点，但容易过拟合、对数据敏感</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>集成方法（如随机森林、GBDT）通过组合多棵树显著提升性能</span>
              </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
