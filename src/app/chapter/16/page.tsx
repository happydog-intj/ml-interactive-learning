import ChapterNav from '@/components/layout/ChapterNav'
import ChapterHeader from '@/components/layout/ChapterHeader'
import Section from '@/components/layout/Section'
import InfoCard from '@/components/ui/InfoCard'
import DemoCard from '@/components/ui/DemoCard'

export default function Chapter16() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={16} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapter={16}
          title="强化学习"
          subtitle="Reinforcement Learning"
          description="智能体通过与环境交互，学习最优策略以最大化累积奖励"
        />

        {/* Section 16.1: 任务与奖励 */}
        <Section
          id="task-and-reward"
          number="16.1"
          title="任务与奖励"
        >
          <InfoCard title="强化学习基本概念">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">强化学习（Reinforcement Learning, RL）</strong>
              研究智能体（agent）如何在环境（environment）中学习，通过试错来发现能获得最大奖励的行为策略。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">RL的核心要素</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">智能体（Agent）</strong>：
                  学习和决策的主体
                </li>
                <li>
                  <strong className="text-white">环境（Environment）</strong>：
                  智能体交互的对象
                </li>
                <li>
                  <strong className="text-white">状态（State）</strong> s ∈ S：
                  环境的当前情况
                </li>
                <li>
                  <strong className="text-white">动作（Action）</strong> a ∈ A：
                  智能体可以执行的操作
                </li>
                <li>
                  <strong className="text-white">奖励（Reward）</strong> r：
                  环境对智能体动作的即时反馈
                </li>
                <li>
                  <strong className="text-white">策略（Policy）</strong> π：
                  状态到动作的映射，π(a|s)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">交互循环</h4>
              <p className="text-gray-100 text-sm mb-3">
                RL的学习过程是一个连续的交互循环：
              </p>
              <div className="bg-ml-bg-dark rounded-lg p-3">
                <p className="text-white text-sm text-center font-mono">
                  s<sub>t</sub> → a<sub>t</sub> → r<sub>t+1</sub>, s<sub>t+1</sub> → a<sub>t+1</sub> → ...
                </p>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm mt-3">
                <li>智能体观察当前状态 s<sub>t</sub></li>
                <li>根据策略π选择动作 a<sub>t</sub></li>
                <li>环境转移到新状态 s<sub>t+1</sub>，给予奖励 r<sub>t+1</sub></li>
                <li>重复上述过程</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 RL vs 监督学习</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">无直接监督信号</strong>：
                  只有奖励反馈，没有正确答案标签
                </li>
                <li>
                  <strong className="text-white">延迟反馈</strong>：
                  当前动作的结果可能在很久之后才显现
                </li>
                <li>
                  <strong className="text-white">探索与利用</strong>：
                  需要在尝试新动作和使用已知好动作之间权衡
                </li>
                <li>
                  <strong className="text-white">序列决策</strong>：
                  当前决策影响未来状态和奖励
                </li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="累积奖励与回报">
            <p className="text-gray-100 leading-relaxed mb-4">
              RL的目标是最大化<strong className="text-white">累积奖励</strong>（return），
              而不仅仅是即时奖励。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">回报定义</h4>
              <p className="text-gray-100 text-sm mb-2">
                从时刻t开始的累积奖励（回报）：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  G<sub>t</sub> = r<sub>t+1</sub> + γr<sub>t+2</sub> + γ²r<sub>t+3</sub> + ... = Σ<sub>k=0</sub><sup>∞</sup> γᵏr<sub>t+k+1</sub>
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                γ ∈ [0, 1] 是折扣因子（discount factor），控制未来奖励的重要程度
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">折扣因子的作用</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">γ = 0</strong>：
                  只关心即时奖励（短视）
                </li>
                <li>
                  <strong className="text-white">γ → 1</strong>：
                  平等对待所有未来奖励（远见）
                </li>
                <li>
                  <strong className="text-white">0 &lt; γ &lt; 1</strong>：
                  近期奖励更重要，远期奖励逐渐衰减
                </li>
              </ul>
              <p className="text-gray-100 text-sm mt-3">
                折扣因子确保无限时间范围的回报有界，且符合"鸟在手胜于林中鸟"的直觉。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">任务类型</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-white font-bold text-sm mb-1">情节式任务（Episodic）</p>
                  <p className="text-gray-100 text-xs">
                    有明确的终止状态，如棋局、游戏关卡。每个情节独立。
                  </p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">持续式任务（Continuing）</p>
                  <p className="text-gray-100 text-xs">
                    没有自然终止点，持续运行，如机器人控制、股票交易。
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="GridWorld环境演示"
            description="在网格世界中展示智能体与环境交互、获取奖励的过程"
            status="开发中"
          />
        </Section>

        {/* Section 16.2: K-摇臂赌博机 */}
        <Section
          id="k-armed-bandit"
          number="16.2"
          title="K-摇臂赌博机"
        >
          <InfoCard title="多臂赌博机问题">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">K-摇臂赌博机（K-armed Bandit）</strong>
              是RL的简化版本，只有一个状态，用于理解探索与利用的权衡。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">问题设定</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>有K个摇臂（动作），每个摇臂的奖励服从未知分布</li>
                <li>每次选择一个摇臂，获得该摇臂的随机奖励</li>
                <li>目标：最大化T次拉动后的累积奖励</li>
              </ul>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-white">核心挑战</strong>：
                需要在探索（尝试未知摇臂以获取信息）和利用（选择当前最优摇臂）之间权衡。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">动作价值</h4>
              <p className="text-gray-100 text-sm mb-2">
                动作a的真实价值：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center">
                  q*(a) = 𝔼[r | a]
                </p>
              </div>
              <p className="text-gray-100 text-sm mb-2">
                动作a的估计价值（基于样本平均）：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  Q<sub>t</sub>(a) = (拉动a获得的奖励总和) / (拉动a的次数)
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="探索与利用策略">
            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">ε-贪心策略（ε-Greedy）</h4>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>以概率 1-ε 选择当前最优动作（利用）：a* = argmax<sub>a</sub> Q(a)</li>
                  <li>以概率 ε 随机选择一个动作（探索）</li>
                </ul>
                <p className="text-gray-100 text-sm mt-3">
                  简单有效，但探索效率较低（随机探索）
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">UCB（Upper Confidence Bound）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  选择具有最大上界置信区间的动作：
                </p>
                <div className="bg-gradient-to-r from-ml-purple/10 to-ml-blue/10 border border-ml-purple/30 rounded-lg p-3">
                  <p className="font-mono text-white text-sm text-center py-2">
                    a<sub>t</sub> = argmax<sub>a</sub> [Q<sub>t</sub>(a) + c√(ln t / N<sub>t</sub>(a))]
                  </p>
                </div>
                <p className="text-xs text-gray-100 mt-2">
                  N<sub>t</sub>(a): 动作a被选择的次数<br/>
                  c: 控制探索程度的参数
                </p>
                <p className="text-gray-100 text-sm mt-3">
                  UCB基于"乐观面对不确定性"原则，优先探索不确定的动作
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-blue font-bold mb-3">汤普森采样（Thompson Sampling）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  贝叶斯方法，为每个动作维护奖励分布的后验：
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm">
                  <li>为每个动作从其后验分布中采样一个期望奖励</li>
                  <li>选择采样值最大的动作</li>
                  <li>根据观测奖励更新后验分布</li>
                </ol>
                <p className="text-gray-100 text-sm mt-3">
                  自然地平衡探索与利用，理论性质优秀
                </p>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用场景</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">在线广告</strong>：选择展示哪个广告以最大化点击率</li>
                <li>• <strong className="text-white">临床试验</strong>：动态分配病人到不同治疗方案</li>
                <li>• <strong className="text-white">推荐系统</strong>：探索新内容vs推荐已知喜好</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="多臂赌博机策略对比"
            description="对比ε-贪心、UCB、汤普森采样的累积奖励曲线"
            status="开发中"
          />
        </Section>

        {/* Section 16.3: 有模型学习 */}
        <Section
          id="model-based-learning"
          number="16.3"
          title="有模型学习"
        >
          <InfoCard title="马尔可夫决策过程（MDP）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">马尔可夫决策过程（Markov Decision Process, MDP）</strong>
              是RL的数学框架，由五元组 (S, A, P, R, γ) 定义。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">MDP的组成</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">S</strong>：状态空间</li>
                <li><strong className="text-white">A</strong>：动作空间</li>
                <li><strong className="text-white">P</strong>：状态转移概率，P(s'|s, a)</li>
                <li><strong className="text-white">R</strong>：奖励函数，R(s, a, s')</li>
                <li><strong className="text-white">γ</strong>：折扣因子</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">马尔可夫性质</h4>
              <p className="text-gray-100 text-sm mb-2">
                未来状态只依赖于当前状态和动作，与历史无关：
              </p>
              <p className="font-mono text-white text-sm text-center py-2">
                P(s<sub>t+1</sub> | s<sub>t</sub>, a<sub>t</sub>, s<sub>t-1</sub>, a<sub>t-1</sub>, ...) = P(s<sub>t+1</sub> | s<sub>t</sub>, a<sub>t</sub>)
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">价值函数</h4>
              <div className="space-y-3 text-gray-100 text-sm">
                <div>
                  <p className="text-white font-bold mb-1">状态价值函数 V<sup>π</sup>(s)</p>
                  <p className="text-xs">从状态s开始，遵循策略π的期望回报</p>
                  <div className="bg-ml-bg-primary rounded-lg p-2 mt-1">
                    <p className="font-mono text-white text-xs text-center">
                      V<sup>π</sup>(s) = 𝔼<sub>π</sub>[G<sub>t</sub> | s<sub>t</sub> = s]
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">动作价值函数 Q<sup>π</sup>(s, a)</p>
                  <p className="text-xs">从状态s执行动作a后，遵循策略π的期望回报</p>
                  <div className="bg-ml-bg-primary rounded-lg p-2 mt-1">
                    <p className="font-mono text-white text-xs text-center">
                      Q<sup>π</sup>(s, a) = 𝔼<sub>π</sub>[G<sub>t</sub> | s<sub>t</sub> = s, a<sub>t</sub> = a]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="贝尔曼方程与动态规划">
            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">贝尔曼期望方程</h4>
              <p className="text-gray-100 text-sm mb-2">
                价值函数满足递归关系：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center py-2">
                  V<sup>π</sup>(s) = Σ<sub>a</sub> π(a|s) Σ<sub>s'</sub> P(s'|s,a) [R(s,a,s') + γV<sup>π</sup>(s')]
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">贝尔曼最优方程</h4>
              <p className="text-gray-100 text-sm mb-2">
                最优价值函数：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-xs text-center">
                  V*(s) = max<sub>a</sub> Σ<sub>s'</sub> P(s'|s,a) [R(s,a,s') + γV*(s')]
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                最优策略：π*(s) = argmax<sub>a</sub> Q*(s, a)
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">动态规划算法</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-white font-bold text-sm mb-1">策略迭代（Policy Iteration）</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-100 text-xs">
                    <li>策略评估：计算V<sup>π</sup></li>
                    <li>策略改进：π' = greedy(V<sup>π</sup>)</li>
                    <li>重复直到收敛</li>
                  </ol>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">价值迭代（Value Iteration）</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-100 text-xs">
                    <li>直接迭代贝尔曼最优方程</li>
                    <li>V<sub>k+1</sub>(s) = max<sub>a</sub> ...</li>
                    <li>收敛后提取最优策略</li>
                  </ol>
                </div>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-ml-red">限制</strong>：
                需要完整的环境模型（P和R），且状态空间不能太大
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="价值迭代可视化"
            description="在GridWorld上展示价值迭代算法的收敛过程"
            status="开发中"
          />
        </Section>

        {/* Section 16.4: 免模型学习 */}
        <Section
          id="model-free-learning"
          number="16.4"
          title="免模型学习"
        >
          <InfoCard title="蒙特卡洛方法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">蒙特卡洛（Monte Carlo, MC）方法</strong>
              通过完整的情节采样来估计价值函数，无需环境模型。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">MC策略评估</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>按策略π运行一个完整情节，记录轨迹</li>
                <li>对轨迹中每个状态s，计算从s开始的实际回报G</li>
                <li>更新V(s)为访问s时获得的回报的平均值</li>
                <li>重复1-3多个情节</li>
              </ol>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-white">优点</strong>：简单，无偏估计；
                <strong className="text-ml-red">缺点</strong>：需要等到情节结束，方差大
              </p>
            </div>
          </InfoCard>

          <InfoCard title="时序差分学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">时序差分（Temporal Difference, TD）学习</strong>
              结合MC和动态规划的思想，每一步都可以更新价值估计。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">TD(0)算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                观察到转移 s → r, s′ 后，更新：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  V(s) ← V(s) + α[r + γV(s′) - V(s)]
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                TD目标：r + γV(s′)<br/>
                TD误差：δ = r + γV(s′) - V(s)<br/>
                α：学习率
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">SARSA算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                On-policy TD控制算法，直接学习Q函数：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center">
                  Q(s,a) ← Q(s,a) + α[r + γQ(s′,a′) - Q(s,a)]
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                名称来源于更新使用的序列：(S<sub>t</sub>, A<sub>t</sub>, R<sub>t+1</sub>, S<sub>t+1</sub>, A<sub>t+1</sub>)
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">Q-Learning算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                Off-policy TD控制算法，直接学习最优Q函数：
              </p>
              <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center py-2">
                  Q(s,a) ← Q(s,a) + α[r + γ max<sub>a′</sub>Q(s′,a′) - Q(s,a)]
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-white">关键区别</strong>：
                Q-Learning使用max选择下一动作（贪心），而SARSA使用策略实际选择的动作
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ TD方法优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 可以在线学习（每步更新）</li>
                  <li>• 适用于持续任务</li>
                  <li>• 通常比MC收敛更快</li>
                </ul>
              </div>
              <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-yellow mb-2">⚠️ On-policy vs Off-policy</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• SARSA (on-policy): 更保守，考虑探索</li>
                  <li>• Q-Learning (off-policy): 更激进，直接学最优</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="SARSA vs Q-Learning"
            description="在悬崖行走环境中对比SARSA和Q-Learning的学习轨迹"
            status="开发中"
          />
        </Section>

        {/* Section 16.5: 值函数逼近 */}
        <Section
          id="value-function-approximation"
          number="16.5"
          title="值函数逼近"
        >
          <InfoCard title="函数逼近的必要性">
            <p className="text-gray-100 leading-relaxed mb-4">
              当状态空间或动作空间非常大（连续、高维）时，无法为每个状态-动作对维护单独的Q值。
              <strong className="text-white">值函数逼近</strong>使用参数化函数近似价值函数。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">函数逼近器</h4>
              <div className="space-y-2 text-gray-100 text-sm">
                <div className="bg-ml-bg-primary rounded-lg p-2">
                  <p className="text-white text-xs">V̂(s, w) ≈ V<sup>π</sup>(s)</p>
                  <p className="text-white text-xs">Q̂(s, a, w) ≈ Q<sup>π</sup>(s, a)</p>
                </div>
                <p>其中w是可学习的参数向量</p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">常用函数逼近器</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">线性函数</strong>：
                  V̂(s, w) = w<sup>T</sup>φ(s)，φ(s)是特征向量
                </li>
                <li>
                  <strong className="text-white">神经网络</strong>：
                  深度神经网络，自动学习特征表示（深度强化学习）
                </li>
                <li>
                  <strong className="text-white">核方法</strong>：
                  基于核函数的非线性逼近
                </li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="深度Q网络（DQN）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">DQN（Deep Q-Network）</strong>
              使用深度神经网络逼近Q函数，实现端到端的强化学习，是深度强化学习的里程碑。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">DQN的关键技术</h4>
              <ul className="space-y-3 text-gray-100 text-sm">
                <li>
                  <div>
                    <strong className="text-white">经验回放（Experience Replay）</strong>
                    <p className="text-xs mt-1">
                      将经验(s, a, r, s′)存入回放缓冲区，训练时随机采样batch，
                      打破样本相关性，提高数据效率
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong className="text-white">目标网络（Target Network）</strong>
                    <p className="text-xs mt-1">
                      使用独立的目标网络计算TD目标，定期从主网络复制参数，
                      稳定训练过程
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">DQN损失函数</h4>
              <div className="bg-gradient-to-r from-ml-purple/10 to-ml-blue/10 border border-ml-purple/30 rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center py-2">
                  L(w) = 𝔼[(r + γ max<sub>a′</sub>Q̂(s′,a′,w<sup>-</sup>) - Q̂(s,a,w))²]
                </p>
              </div>
              <p className="text-xs text-gray-100 text-center mt-2">
                w<sup>-</sup> 是目标网络的参数
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 DQN的成就</h4>
              <p className="text-gray-100 text-sm">
                DQN在多款Atari游戏上达到或超越人类水平，仅使用原始像素输入，
                展示了深度学习与强化学习结合的巨大潜力。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="策略梯度方法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">策略梯度（Policy Gradient）方法</strong>
              直接参数化策略 π(a|s, θ)，通过梯度上升优化策略参数。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">REINFORCE算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                目标：最大化期望回报 J(θ) = 𝔼<sub>π<sub>θ</sub></sub>[G]
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-xs text-center">
                  ∇<sub>θ</sub>J(θ) = 𝔼<sub>π<sub>θ</sub></sub>[G<sub>t</sub> ∇<sub>θ</sub> log π<sub>θ</sub>(a<sub>t</sub>|s<sub>t</sub>)]
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                参数更新：θ ← θ + α G<sub>t</sub> ∇<sub>θ</sub> log π<sub>θ</sub>(a<sub>t</sub>|s<sub>t</sub>)
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">Actor-Critic方法</h4>
              <p className="text-gray-100 text-sm mb-2">
                结合策略梯度和值函数逼近：
              </p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">Actor</strong>：策略网络，决定动作</li>
                <li>• <strong className="text-white">Critic</strong>：价值网络，评估状态/动作</li>
              </ul>
              <p className="text-gray-100 text-sm mt-3">
                用Critic的估计代替REINFORCE中的回报，降低方差。
                代表算法：A3C、DDPG、SAC、PPO等。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 策略梯度优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 适用于连续动作空间</li>
                  <li>• 可以学习随机策略</li>
                  <li>• 有更好的收敛性保证</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 策略梯度缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 通常样本效率较低</li>
                  <li>• 容易陷入局部最优</li>
                  <li>• 方差较大，训练不稳定</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="DQN训练过程"
            description="可视化DQN在CartPole环境中的学习曲线和Q值演化"
            status="开发中"
          />
        </Section>

        {/* Section 16.6: 模仿学习 */}
        <Section
          id="imitation-learning"
          number="16.6"
          title="模仿学习"
        >
          <InfoCard title="模仿学习概述">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">模仿学习（Imitation Learning）</strong>
              通过观察专家演示来学习策略，避免从零开始探索，加速学习过程。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">行为克隆（Behavioral Cloning）</h4>
              <p className="text-gray-100 text-sm mb-2">
                将模仿学习视为监督学习问题：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>收集专家轨迹数据 D = {'{(s₁, a₁*), (s₂, a₂*), ...}'}</li>
                <li>训练策略π<sub>θ</sub>使其最小化：</li>
              </ol>
              <div className="bg-ml-bg-primary rounded-lg p-3 mt-2">
                <p className="font-mono text-white text-sm text-center">
                  L(θ) = 𝔼<sub>(s,a*)∈D</sub> [loss(π<sub>θ</sub>(s), a*)]
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-ml-red">问题</strong>：
                协变量偏移（covariate shift），学习的策略在未见状态上可能表现很差
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">数据聚合（DAgger）</h4>
              <p className="text-gray-100 text-sm mb-2">
                迭代地收集数据和训练策略，减轻协变量偏移：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化策略π₁</li>
                <li>对于迭代i = 1, 2, ...：</li>
                <li className="ml-6">• 用当前策略πᵢ收集轨迹</li>
                <li className="ml-6">• 请专家为这些状态标注动作</li>
                <li className="ml-6">• 聚合所有数据：Dᵢ = Dᵢ₋₁ ∪ {'{新数据}'}</li>
                <li className="ml-6">• 在Dᵢ上训练新策略πᵢ₊₁</li>
              </ol>
              <p className="text-gray-100 text-sm mt-3">
                DAgger让策略在自己产生的状态分布上学习，提高泛化能力
              </p>
            </div>
          </InfoCard>

          <InfoCard title="逆强化学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">逆强化学习（Inverse Reinforcement Learning, IRL）</strong>
              从专家演示中推断奖励函数，然后用该奖励函数训练策略。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">IRL的动机</h4>
              <p className="text-gray-100 text-sm">
                在许多任务中，设计奖励函数很困难，但容易获得专家演示。
                IRL假设专家的行为是某个奖励函数下的最优策略，
                通过观察专家行为来反推奖励函数。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">最大熵IRL</h4>
              <p className="text-gray-100 text-sm mb-2">
                假设专家策略不完全确定，遵循最大熵原则：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center">
                  p(τ) ∝ exp(Σ<sub>t</sub> r(s<sub>t</sub>, a<sub>t</sub>))
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                通过最大似然估计学习奖励函数参数
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">自动驾驶</strong>：从人类驾驶行为学习驾驶策略</li>
                <li>• <strong className="text-white">机器人学习</strong>：从人类演示学习操作任务</li>
                <li>• <strong className="text-white">游戏AI</strong>：学习玩家偏好，生成有趣的对手</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="行为克隆vs DAgger"
            description="对比行为克隆和DAgger在导航任务中的性能差异"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
