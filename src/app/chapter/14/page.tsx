import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter14() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={14} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapterNumber={14}
          title="概率图模型"
          subtitle="Probabilistic Graphical Models"
          icon="🕸️"
          gradient="from-ml-purple via-ml-blue to-ml-cyan"
          objectives={[
            '理解概率图模型的基本概念和表示',
            '掌握隐马尔可夫模型的三个基本问题',
            '理解贝叶斯网络的结构和推断',
            '了解马尔可夫随机场和条件随机场'
          ]}
        />

        {/* Section 14.1: 隐马尔可夫模型 */}
        <Section
          number="14.1"
          title="隐马尔可夫模型"
        >
          <InfoCard title="HMM基本概念">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">隐马尔可夫模型（Hidden Markov Model, HMM）</strong>
              是一种用于建模序列数据的概率图模型，包含隐藏状态序列和观测序列。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">HMM的组成</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">状态集合</strong> S = {'{s₁, s₂, ..., sₙ}'}：
                  隐藏状态空间
                </li>
                <li>
                  <strong className="text-white">观测集合</strong> O = {'{o₁, o₂, ..., oₘ}'}：
                  可观测输出空间
                </li>
                <li>
                  <strong className="text-white">状态转移概率</strong> A = [aᵢⱼ]：
                  aᵢⱼ = P(sⱼ | sᵢ)，从状态i转移到状态j的概率
                </li>
                <li>
                  <strong className="text-white">观测概率</strong> B = [bⱼ(k)]：
                  bⱼ(k) = P(oₖ | sⱼ)，在状态j下观测到oₖ的概率
                </li>
                <li>
                  <strong className="text-white">初始状态概率</strong> π = [πᵢ]：
                  πᵢ = P(s₁ = sᵢ)，初始状态为sᵢ的概率
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">马尔可夫假设</h4>
              <p className="text-gray-100 text-sm">
                <strong className="text-white">一阶马尔可夫性</strong>：
                当前状态只依赖于前一时刻的状态，与更早的历史无关。
              </p>
              <p className="font-mono text-white text-sm text-center py-2 mt-2">
                P(qₜ | qₜ₋₁, qₜ₋₂, ..., q₁) = P(qₜ | qₜ₋₁)
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 典型应用</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">语音识别</strong>：观测是声学信号，隐藏状态是音素或词</li>
                <li>• <strong className="text-white">词性标注</strong>：观测是单词，隐藏状态是词性（名词、动词等）</li>
                <li>• <strong className="text-white">生物序列分析</strong>：基因序列分析、蛋白质结构预测</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="HMM的三个基本问题">
            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">1. 概率计算问题（Evaluation）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  给定模型λ=(A, B, π)和观测序列O，计算P(O|λ)
                </p>
                <p className="text-gray-100 text-sm">
                  <strong className="text-white">算法</strong>：前向算法（Forward Algorithm）或后向算法（Backward Algorithm）
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">2. 学习问题（Learning）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  给定观测序列O，学习模型参数λ=(A, B, π)使得P(O|λ)最大
                </p>
                <p className="text-gray-100 text-sm">
                  <strong className="text-white">算法</strong>：Baum-Welch算法（EM算法的特例）
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-blue font-bold mb-3">3. 解码问题（Decoding）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  给定模型λ和观测序列O，找到最可能的隐藏状态序列Q
                </p>
                <p className="text-gray-100 text-sm">
                  <strong className="text-white">算法</strong>：Viterbi算法（动态规划）
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Viterbi算法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">Viterbi算法</strong>用动态规划找到最可能的状态序列，是HMM解码的核心算法。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">算法步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li><strong>初始化</strong>：δ₁(i) = πᵢ · bᵢ(o₁)，ψ₁(i) = 0</li>
                <li><strong>递推</strong>：对t = 2, 3, ..., T：
                  <div className="ml-6 mt-2 space-y-1">
                    <p>δₜ(j) = maxᵢ [δₜ₋₁(i) · aᵢⱼ] · bⱼ(oₜ)</p>
                    <p>ψₜ(j) = argmaxᵢ [δₜ₋₁(i) · aᵢⱼ]</p>
                  </div>
                </li>
                <li><strong>终止</strong>：P* = maxᵢ δₜ(i)，q*ₜ = argmaxᵢ δₜ(i)</li>
                <li><strong>回溯</strong>：q*ₜ₋₁ = ψₜ(q*ₜ)，得到最优路径</li>
              </ol>
            </div>

            <p className="text-sm text-gray-100">
              时间复杂度：O(TN²)，其中T是序列长度，N是状态数量。
            </p>
          </InfoCard>

          <DemoCard
            title="Viterbi算法可视化"
            description="动态展示Viterbi算法在词性标注任务中的解码过程"
            status="开发中"
          />
        </Section>

        {/* Section 14.2: 马尔可夫随机场 */}
        <Section
          number="14.2"
          title="马尔可夫随机场"
        >
          <InfoCard title="概率图模型概述">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">概率图模型（Probabilistic Graphical Model, PGM）</strong>
              用图结构表示变量间的概率依赖关系，节点表示随机变量，边表示依赖关系。
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-2">有向图模型（贝叶斯网络）</h4>
                <p className="text-gray-100 text-sm">
                  用有向无环图（DAG）表示因果关系，边表示条件概率。
                  联合概率分解为条件概率的乘积。
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-2">无向图模型（马尔可夫随机场）</h4>
                <p className="text-gray-100 text-sm">
                  用无向图表示变量间的对称依赖关系，基于团（clique）定义联合概率。
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="马尔可夫随机场（MRF）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">马尔可夫随机场（Markov Random Field, MRF）</strong>
              是一种无向概率图模型，满足局部马尔可夫性质。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">成对马尔可夫性</h4>
              <p className="text-gray-100 text-sm">
                给定其他所有变量，两个不相邻的变量条件独立：
              </p>
              <p className="font-mono text-white text-sm text-center py-2 mt-2">
                u ⊥ v | X \ {'{u, v}'} （如果u和v不相邻）
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">局部马尔可夫性</h4>
              <p className="text-gray-100 text-sm">
                给定邻居变量，一个变量与其他变量条件独立：
              </p>
              <p className="font-mono text-white text-sm text-center py-2 mt-2">
                v ⊥ X \ {'{v} ∪ N(v)'} | N(v)
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                N(v)是v的邻居集合
              </p>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">基于势函数的联合概率</h4>
              <p className="text-gray-100 text-sm mb-2">
                联合概率由各个团（clique）上的势函数（potential function）定义：
              </p>
              <p className="font-mono text-white text-sm text-center py-2">
                P(X) = (1/Z) ∏<sub>C∈𝓒</sub> ψ<sub>C</sub>(X<sub>C</sub>)
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                Z是归一化因子（配分函数），ψ<sub>C</sub>是团C上的势函数
              </p>
            </div>
          </InfoCard>

          <InfoCard title="条件随机场（CRF）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">条件随机场（Conditional Random Field, CRF）</strong>
              是给定观测序列条件下的马尔可夫随机场，常用于序列标注任务。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">线性链CRF</h4>
              <p className="text-gray-100 text-sm mb-2">
                对于序列标注，条件概率定义为：
              </p>
              <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center py-2">
                  P(y|x) = (1/Z(x)) exp(Σₜ Σₖ λₖfₖ(yₜ₋₁, yₜ, x, t))
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                fₖ是特征函数，λₖ是对应权重，Z(x)是归一化因子
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 CRF vs HMM</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">HMM</strong>：
                  生成式模型，建模P(x, y) = P(y)P(x|y)，有严格的独立性假设
                </li>
                <li>
                  <strong className="text-white">CRF</strong>：
                  判别式模型，直接建模P(y|x)，可以使用任意特征，无需独立性假设
                </li>
              </ul>
              <p className="text-gray-100 text-sm mt-2">
                CRF通常比HMM在序列标注任务上表现更好，但训练更复杂。
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              <strong className="text-white">应用</strong>：
              词性标注、命名实体识别、中文分词、信息抽取等序列标注任务。
            </p>
          </InfoCard>

          <DemoCard
            title="CRF序列标注演示"
            description="展示CRF在命名实体识别任务中的标注过程"
            status="开发中"
          />
        </Section>

        {/* Section 14.3: 学习与推断 */}
        <Section
          number="14.3"
          title="学习与推断"
        >
          <InfoCard title="概率图模型的推断">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">推断（Inference）</strong>是概率图模型的核心任务，
              包括边际概率计算、最大后验估计（MAP）等。
            </p>

            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">精确推断</h4>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>
                    <strong className="text-white">变量消除</strong>（Variable Elimination）：
                    利用分配律，通过消除变量逐步计算边际概率
                  </li>
                  <li>
                    <strong className="text-white">信念传播</strong>（Belief Propagation）：
                    在树结构图上通过消息传递进行推断
                  </li>
                  <li>
                    <strong className="text-white">团树算法</strong>（Junction Tree）：
                    将图转换为树结构后进行精确推断
                  </li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">近似推断</h4>
                <p className="text-gray-100 text-sm mb-2">
                  当精确推断计算复杂度过高时（NP难），使用近似方法：
                </p>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>
                    <strong className="text-white">采样方法</strong>：
                    MCMC（马尔可夫链蒙特卡洛）、吉布斯采样
                  </li>
                  <li>
                    <strong className="text-white">变分推断</strong>：
                    用简单分布近似复杂分布，转化为优化问题
                  </li>
                  <li>
                    <strong className="text-white">循环信念传播</strong>：
                    在有环图上迭代运行信念传播直到收敛
                  </li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="参数学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              学习概率图模型的参数，使其能够很好地拟合训练数据。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">完全数据的参数学习</h4>
              <p className="text-gray-100 text-sm mb-2">
                当所有变量都可观测时，可以直接用<strong className="text-white">最大似然估计</strong>：
              </p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• 有向图：估计每个条件概率表（CPT）</li>
                <li>• 无向图：估计各团的势函数参数</li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">隐变量的参数学习</h4>
              <p className="text-gray-100 text-sm mb-2">
                当存在隐变量时，使用<strong className="text-white">EM算法</strong>：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li><strong>E步</strong>：根据当前参数计算隐变量的后验分布</li>
                <li><strong>M步</strong>：最大化期望对数似然，更新参数</li>
                <li>重复直到收敛</li>
              </ol>
              <p className="text-gray-100 text-sm mt-3">
                HMM的Baum-Welch算法和GMM的EM算法都是这一框架的实例。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="结构学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">结构学习</strong>是从数据中学习图的结构（变量间的依赖关系），
              比参数学习更具挑战性。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">基于评分的方法</h4>
              <p className="text-gray-100 text-sm mb-2">
                定义评分函数（如BIC、AIC），搜索使得评分最高的图结构：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  score(G) = log P(D|G) - (d/2) log m
                </p>
                <p className="text-xs text-gray-100 text-center mt-2">
                  第一项：数据拟合度，第二项：模型复杂度惩罚
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">基于约束的方法</h4>
              <p className="text-gray-100 text-sm">
                通过统计独立性测试发现变量间的条件独立关系，据此构建图结构。
                例如PC算法、IC算法等。
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4 bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-3">
              <strong className="text-ml-yellow">挑战</strong>：
              结构学习的搜索空间巨大（超指数级），且很多问题是NP难的。
              实际中常结合领域知识或使用启发式搜索。
            </p>
          </InfoCard>

          <DemoCard
            title="贝叶斯网络结构学习"
            description="从数据中学习变量间的依赖关系并构建贝叶斯网络"
            status="开发中"
          />
        </Section>

        {/* Section 14.4: 近似推断 */}
        <Section
          number="14.4"
          title="近似推断"
        >
          <InfoCard title="MCMC采样">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">马尔可夫链蒙特卡洛（MCMC）</strong>
              通过构造马尔可夫链来对目标分布进行采样，从而近似计算期望和边际概率。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Metropolis-Hastings算法</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化状态 x<sup>(0)</sup></li>
                <li>对t = 1, 2, ..., T：</li>
                <li className="ml-6">• 从提议分布q(x'|x<sup>(t-1)</sup>)采样候选状态x'</li>
                <li className="ml-6">• 计算接受率：α = min(1, [P(x')q(x<sup>(t-1)</sup>|x')] / [P(x<sup>(t-1)</sup>)q(x'|x<sup>(t-1)</sup>)])</li>
                <li className="ml-6">• 以概率α接受x'，否则保持x<sup>(t-1)</sup></li>
              </ol>
              <p className="text-gray-100 text-sm mt-3">
                经过足够多步骤后，样本的分布收敛到目标分布P(x)
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">吉布斯采样（Gibbs Sampling）</h4>
              <p className="text-gray-100 text-sm mb-2">
                MH算法的特例，每次只更新一个变量，条件概率作为提议分布：
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm">
                <li>随机初始化所有变量</li>
                <li>循环：对每个变量xᵢ，从条件分布P(xᵢ | x₋ᵢ)中采样更新</li>
                <li>重复直到收敛</li>
              </ol>
              <p className="text-gray-100 text-sm mt-3">
                吉布斯采样简单易实现，在高维问题中广泛应用。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="变分推断">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">变分推断（Variational Inference）</strong>
              将推断问题转化为优化问题，用简单分布q(x)近似复杂的后验分布p(x|D)。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">KL散度最小化</h4>
              <p className="text-gray-100 text-sm mb-2">
                目标是最小化q(x)和p(x|D)之间的KL散度：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  min KL(q||p) = min 𝔼<sub>q</sub>[log q(x)] - 𝔼<sub>q</sub>[log p(x, D)]
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">平均场近似</h4>
              <p className="text-gray-100 text-sm mb-2">
                假设q(x)可以分解为独立分布的乘积：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  q(x) = ∏ᵢ qᵢ(xᵢ)
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                通过坐标上升法迭代优化每个qᵢ，直到收敛。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 变分推断优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 确定性算法，可重复</li>
                  <li>• 收敛速度通常比MCMC快</li>
                  <li>• 易于分布式计算</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 变分推断缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 只能得到近似解</li>
                  <li>• 可能陷入局部最优</li>
                  <li>• 需要选择近似分布族</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="MCMC vs 变分推断"
            description="对比MCMC采样和变分推断在后验估计任务上的效果"
            status="开发中"
          />
        </Section>

        {/* Section 14.5: 话题模型 */}
        <Section
          number="14.5"
          title="话题模型"
        >
          <InfoCard title="隐狄利克雷分配（LDA）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">LDA（Latent Dirichlet Allocation）</strong>
              是一种话题模型，用于发现文档集合中的潜在主题。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">生成过程</h4>
              <p className="text-gray-100 text-sm mb-2">
                LDA假设每篇文档由多个话题混合而成，每个话题由词的分布定义：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>对每个话题k，从Dirichlet分布生成词分布 φₖ ~ Dir(β)</li>
                <li>对每篇文档d：
                  <ol className="list-alpha list-inside ml-4 mt-1 space-y-1">
                    <li>从Dirichlet分布生成话题分布 θ<sub>d</sub> ~ Dir(α)</li>
                    <li>对文档中的每个词位置n：
                      <ul className="ml-4 mt-1">
                        <li>• 从多项分布选择话题 z<sub>dn</sub> ~ Mult(θ<sub>d</sub>)</li>
                        <li>• 从该话题的词分布选择词 w<sub>dn</sub> ~ Mult(φ<sub>z<sub>dn</sub></sub>)</li>
                      </ul>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">超参数</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">α</strong>：文档-话题分布的Dirichlet先验，控制话题稀疏性</li>
                <li>• <strong className="text-white">β</strong>：话题-词分布的Dirichlet先验，控制词稀疏性</li>
                <li>• <strong className="text-white">K</strong>：话题数量（需要预先指定）</li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">LDA推断</h4>
              <p className="text-gray-100 text-sm mb-2">
                推断隐变量（话题分配z）和参数（θ, φ）：
              </p>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">吉布斯采样</strong>：
                  迭代采样每个词的话题分配，基于其他词的话题
                </li>
                <li>
                  <strong className="text-white">变分EM</strong>：
                  用变分推断近似后验分布，交替优化参数
                </li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">文档分类</strong>：基于话题分布对文档分类</li>
                <li>• <strong className="text-white">信息检索</strong>：基于话题相似度检索相关文档</li>
                <li>• <strong className="text-white">推荐系统</strong>：基于用户的话题偏好推荐</li>
                <li>• <strong className="text-white">文本摘要</strong>：提取代表性话题和词汇</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="LDA话题建模演示"
            description="在新闻文档集上运行LDA，可视化发现的话题和词分布"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
