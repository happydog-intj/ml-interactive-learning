import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { RuleLearningDemo } from '@/components/visualizations/RuleLearningDemo'

export default function Chapter15() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={15} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapter={15}
          title="规则学习"
          subtitle="Rule Learning"
          description="从数据中提取可解释的if-then规则，实现符号化知识表示"
        />

        {/* Section 15.1: 基本概念 */}
        <Section
          id="basic-concepts"
          number="15.1"
          title="基本概念"
        >
          <InfoCard title="规则学习概述">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">规则学习（Rule Learning）</strong>
              从数据中提取形如"IF condition THEN conclusion"的规则，是一种符号化的知识表示方法。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">规则的形式</h4>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center">
                  IF (条件1 AND 条件2 AND ...) THEN (结论)
                </p>
              </div>
              <p className="text-gray-100 text-sm mb-2">例如：</p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="text-white text-sm">
                  IF (天气=晴 AND 温度=高 AND 湿度=正常) THEN (适合打网球=是)
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">规则的评价指标</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">支持度（Support）</strong>：
                  规则覆盖的样本数量或比例
                </li>
                <li>
                  <strong className="text-white">置信度（Confidence）</strong>：
                  在满足条件的样本中，结论正确的比例
                </li>
                <li>
                  <strong className="text-white">覆盖率（Coverage）</strong>：
                  规则能够分类的样本比例
                </li>
                <li>
                  <strong className="text-white">准确率（Accuracy）</strong>：
                  规则预测正确的样本比例
                </li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 为什么使用规则学习？</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">可解释性强</strong>：规则直观易懂，便于人类理解和验证</li>
                <li>• <strong className="text-white">知识提取</strong>：将隐含在数据中的模式显式化</li>
                <li>• <strong className="text-white">易于修改</strong>：可以根据领域知识手动调整规则</li>
                <li>• <strong className="text-white">推理透明</strong>：决策过程可追溯</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="规则学习方法分类">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">序贯覆盖（Sequential Covering）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  逐条学习规则，每次学习一条规则后，移除被该规则覆盖的样本，
                  然后在剩余样本上学习下一条规则。
                </p>
                <p className="text-gray-100 text-sm">
                  代表算法：CN2、RIPPER、FOIL
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">从决策树提取规则</h4>
                <p className="text-gray-100 text-sm mb-2">
                  先学习决策树，然后将每条从根到叶的路径转换为一条规则。
                </p>
                <p className="text-gray-100 text-sm">
                  优点：可以利用成熟的决策树算法
                </p>
              </div>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📏 序贯覆盖规则学习</h3>
            <p className="text-gray-300 mb-6">
              演示如何从数据中学习IF-THEN规则，观察规则的覆盖率和准确率
            </p>
            <RuleLearningDemo />
          </div>
        </Section>

        {/* Section 15.2: 序贯覆盖 */}
        <Section
          id="sequential-covering"
          number="15.2"
          title="序贯覆盖"
        >
          <InfoCard title="序贯覆盖算法框架">
            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">算法流程</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化：规则集R = ∅，训练集D′ = D</li>
                <li>While D′不为空：</li>
                <li className="ml-6">• 学习一条新规则r，使其尽可能准确地覆盖D′中的样本</li>
                <li className="ml-6">• 将r加入规则集：R = R ∪ {'{r}'}</li>
                <li className="ml-6">• 从D′中移除被r覆盖的样本</li>
                <li>返回规则集R</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">学习单条规则</h4>
              <p className="text-gray-100 text-sm mb-2">
                采用贪心策略，从最一般的规则开始，逐步添加条件（特化）：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化：r = "IF True THEN class"（覆盖所有样本）</li>
                <li>While 规则准确率不够高：</li>
                <li className="ml-6">• 枚举所有可能的新条件</li>
                <li className="ml-6">• 选择使得规则质量提升最大的条件加入r</li>
                <li>返回规则r</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">规则质量度量</h4>
              <p className="text-gray-100 text-sm mb-2">常用的规则质量度量包括：</p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">信息增益</strong>：规则能带来多少信息量</li>
                <li>• <strong className="text-white">Laplace准确率</strong>：(n<sub>c</sub> + 1) / (n + k)，避免小样本问题</li>
                <li>• <strong className="text-white">FOIL Gain</strong>：考虑正例覆盖和负例排除的综合指标</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="RIPPER算法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">RIPPER（Repeated Incremental Pruning to Produce Error Reduction）</strong>
              是一种高效的序贯覆盖规则学习算法。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">RIPPER的关键特性</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">增量规则生长</strong>：
                  贪心地添加条件，直到规则不再覆盖负例
                </li>
                <li>
                  <strong className="text-white">规则剪枝</strong>：
                  基于验证集删除不必要的条件，防止过拟合
                </li>
                <li>
                  <strong className="text-white">规则优化</strong>：
                  在全部规则学习完成后，尝试替换或修订规则以提升性能
                </li>
                <li>
                  <strong className="text-white">多类处理</strong>：
                  按类别频率排序，依次为每个类学习规则
                </li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">MDL原则</h4>
              <p className="text-gray-100 text-sm mb-2">
                RIPPER使用<strong className="text-white">最小描述长度（MDL）原则</strong>作为停止准则：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center">
                  DL(规则集) + DL(异常|规则集)
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                当增加新规则导致总描述长度增加时停止，防止过拟合。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 高效，适合大规模数据</li>
                  <li>• 剪枝机制有效防止过拟合</li>
                  <li>• 生成的规则简洁</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 贪心搜索，可能错过最优规则</li>
                  <li>• 规则间可能有冲突</li>
                  <li>• 对噪声数据敏感</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="RIPPER算法演示"
            description="逐步展示RIPPER学习规则的过程（生长、剪枝、优化）"
            status="开发中"
          />
        </Section>

        {/* Section 15.3: 剪枝优化 */}
        <Section
          id="pruning-optimization"
          number="15.3"
          title="剪枝优化"
        >
          <InfoCard title="规则剪枝">
            <p className="text-gray-100 leading-relaxed mb-4">
              学到的规则可能过于复杂，在训练集上表现很好但泛化能力差。
              <strong className="text-white">规则剪枝</strong>通过删除不必要的条件来简化规则，提高泛化能力。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">简化剪枝（Reduced Error Pruning）</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>将数据分为生长集和剪枝集</li>
                <li>在生长集上学习规则（可能过拟合）</li>
                <li>对每个规则，尝试删除每个条件</li>
                <li>如果删除条件后在剪枝集上性能提升或不变，则删除</li>
                <li>重复3-4直到无法改进</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">规则后剪枝策略</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">删除条件</strong>：
                  移除某个条件，使规则更一般化
                </li>
                <li>
                  <strong className="text-white">删除规则</strong>：
                  移除整条规则，如果其对性能贡献不大
                </li>
                <li>
                  <strong className="text-white">规则合并</strong>：
                  将相似的规则合并为一条更一般的规则
                </li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="规则集优化">
            <p className="text-gray-100 leading-relaxed mb-4">
              除了剪枝单条规则，还可以对整个规则集进行优化。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">规则排序</h4>
              <p className="text-gray-100 text-sm mb-2">
                规则应用顺序会影响预测结果。常用排序策略：
              </p>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">按准确率排序</strong>：
                  准确率高的规则优先
                </li>
                <li>
                  <strong className="text-white">按覆盖度排序</strong>：
                  覆盖样本多的规则优先
                </li>
                <li>
                  <strong className="text-white">按类别排序</strong>：
                  按类别重要性或频率排序
                </li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">冲突解决</h4>
              <p className="text-gray-100 text-sm mb-2">
                当多条规则同时适用于一个样本时，如何选择：
              </p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">第一匹配</strong>：使用第一条匹配的规则</li>
                <li>• <strong className="text-white">最高置信度</strong>：使用置信度最高的规则</li>
                <li>• <strong className="text-white">投票</strong>：所有匹配规则投票决定</li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 默认规则</h4>
              <p className="text-gray-100 text-sm">
                通常需要一条<strong className="text-white">默认规则</strong>来处理不被任何规则覆盖的样本，
                如"IF True THEN 最常见类"。默认规则应放在最后。
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="规则剪枝过程"
            description="可视化规则剪枝如何提升泛化性能"
            status="开发中"
          />
        </Section>

        {/* Section 15.4: 一阶规则学习 */}
        <Section
          id="first-order-rule-learning"
          number="15.4"
          title="一阶规则学习"
        >
          <InfoCard title="归纳逻辑程序设计（ILP）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">归纳逻辑程序设计（Inductive Logic Programming, ILP）</strong>
              从样例中学习逻辑程序（一阶规则），能够表示复杂的关系和结构。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">命题规则 vs 一阶规则</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-bold text-sm mb-1">命题规则（Propositional Rules）</p>
                  <div className="bg-ml-bg-primary rounded-lg p-2">
                    <p className="text-white text-xs">
                      IF (天气=晴 AND 温度=高) THEN (打网球=是)
                    </p>
                  </div>
                  <p className="text-gray-100 text-xs mt-1">只能表示属性值的组合</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">一阶规则（First-Order Rules）</p>
                  <div className="bg-ml-bg-primary rounded-lg p-2">
                    <p className="text-white text-xs">
                      parent(X,Y) :- father(X,Y).<br/>
                      grandparent(X,Z) :- parent(X,Y), parent(Y,Z).
                    </p>
                  </div>
                  <p className="text-gray-100 text-xs mt-1">可以表示对象间的关系、使用变量和量词</p>
                </div>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">ILP的输入</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">背景知识（Background Knowledge）</strong> B：
                  已知的事实和规则
                </li>
                <li>
                  <strong className="text-white">正例（Positive Examples）</strong> E<sup>+</sup>：
                  目标关系的正样本
                </li>
                <li>
                  <strong className="text-white">负例（Negative Examples）</strong> E<sup>-</sup>：
                  目标关系的负样本
                </li>
              </ul>
              <p className="text-gray-100 text-sm mt-3">
                <strong className="text-white">目标</strong>：
                学习假设H，使得 B ∧ H ⊨ E<sup>+</sup> 且 B ∧ H ⊭ E<sup>-</sup>
              </p>
            </div>
          </InfoCard>

          <InfoCard title="FOIL算法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">FOIL（First-Order Inductive Learner）</strong>
              是经典的ILP算法，采用序贯覆盖策略学习一阶规则。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">FOIL Gain</h4>
              <p className="text-gray-100 text-sm mb-2">
                FOIL使用信息增益的变体来评估添加新文字（literal）的效果：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center py-2">
                  Gain = t · (log₂(p₁/(p₁+n₁)) - log₂(p₀/(p₀+n₀)))
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                t: 添加文字后仍满足的正例数<br/>
                p₀, n₀: 添加前的正例数和负例数<br/>
                p₁, n₁: 添加后的正例数和负例数
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">FOIL算法流程</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化规则：只有头部，没有体部（覆盖所有样本）</li>
                <li>While 规则覆盖负例：</li>
                <li className="ml-6">• 枚举所有可能的文字（谓词、变量组合）</li>
                <li className="ml-6">• 选择FOIL Gain最大的文字加入规则体</li>
                <li>将学到的规则加入规则集</li>
                <li>移除被覆盖的正例</li>
                <li>重复1-4直到所有正例被覆盖</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 ILP的应用</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">分子生物学</strong>：药物活性预测、蛋白质结构分析</li>
                <li>• <strong className="text-white">知识发现</strong>：从关系数据库中提取规则</li>
                <li>• <strong className="text-white">自然语言处理</strong>：学习语法规则</li>
                <li>• <strong className="text-white">机器人</strong>：学习动作规划规则</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="ILP家族关系学习"
            description="从家族关系事实中学习grandparent、uncle等关系的规则"
            status="开发中"
          />
        </Section>

        {/* Section 15.5: 规则集学习 */}
        <Section
          id="rule-set-learning"
          number="15.5"
          title="规则集学习"
        >
          <InfoCard title="从决策树提取规则">
            <p className="text-gray-100 leading-relaxed mb-4">
              决策树的每条从根到叶的路径可以转换为一条规则，这提供了另一种规则学习途径。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">C4.5rules</h4>
              <p className="text-gray-100 text-sm mb-2">
                C4.5rules算法从C4.5决策树提取规则：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>用C4.5算法学习决策树</li>
                <li>对每个叶节点，从根到叶的路径形成一条规则</li>
                <li>对每条规则进行剪枝（删除不重要的条件）</li>
                <li>对规则集进行优化（删除、合并规则）</li>
                <li>按规则性能排序</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 利用成熟的决策树算法</li>
                  <li>• 规则可以重叠（不同于树的互斥划分）</li>
                  <li>• 规则更简洁、更易理解</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 规则数量可能很多</li>
                  <li>• 需要处理规则冲突</li>
                  <li>• 可能丢失决策树的层次结构信息</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="规则集 vs 决策树 vs 决策列表">
            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">三种表示形式</h4>
              <div className="space-y-3 text-gray-100 text-sm">
                <div>
                  <p className="font-bold text-white mb-1">决策树（Decision Tree）</p>
                  <p>层次结构，路径互斥，每个样本只匹配一条路径</p>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">决策列表（Decision List）</p>
                  <p>规则有序排列，使用第一条匹配的规则（if-then-else链）</p>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">规则集（Rule Set）</p>
                  <p>规则无序或按质量排序，可能多条规则匹配，需要冲突解决策略</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">选择建议</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">决策树</strong>：
                  适合需要快速分类、不要求高度可解释性的场景
                </li>
                <li>
                  <strong className="text-white">规则集</strong>：
                  适合需要高可解释性、允许规则重叠的场景
                </li>
                <li>
                  <strong className="text-white">决策列表</strong>：
                  适合规则有自然优先级、需要确定性预测的场景
                </li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="规则学习的挑战">
            <div className="space-y-3">
              <div className="bg-ml-bg-dark rounded-lg p-3">
                <p className="text-white font-bold text-sm mb-1">搜索空间巨大</p>
                <p className="text-gray-100 text-xs">
                  可能的规则数量随特征和取值数指数增长，需要高效的搜索策略
                </p>
              </div>
              <div className="bg-ml-bg-dark rounded-lg p-3">
                <p className="text-white font-bold text-sm mb-1">规则质量评估</p>
                <p className="text-gray-100 text-xs">
                  如何平衡简洁性和准确性，避免过拟合
                </p>
              </div>
              <div className="bg-ml-bg-dark rounded-lg p-3">
                <p className="text-white font-bold text-sm mb-1">规则冲突和冗余</p>
                <p className="text-gray-100 text-xs">
                  多条规则可能相互矛盾或重复，需要后处理优化
                </p>
              </div>
              <div className="bg-ml-bg-dark rounded-lg p-3">
                <p className="text-white font-bold text-sm mb-1">类别不平衡</p>
                <p className="text-gray-100 text-xs">
                  少数类样本可能被多数类规则覆盖，难以学习
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-100 mt-4 bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-3">
              <strong className="text-ml-yellow">未来方向</strong>：
              结合神经网络的表示学习和规则学习的可解释性，
              发展<strong className="text-white">神经符号学习</strong>（Neuro-Symbolic Learning），
              在保持性能的同时提供可解释性。
            </p>
          </InfoCard>

          <DemoCard
            title="决策树转规则集"
            description="演示如何从决策树提取规则，并进行剪枝优化"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
