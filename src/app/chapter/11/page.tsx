import ChapterNav from '@/components/layout/ChapterNav'
import ChapterHeader from '@/components/layout/ChapterHeader'
import Section from '@/components/layout/Section'
import InfoCard from '@/components/ui/InfoCard'
import DemoCard from '@/components/ui/DemoCard'

export default function Chapter11() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={11} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapter={11}
          title="特征选择与稀疏学习"
          subtitle="Feature Selection and Sparse Learning"
          description="从众多特征中选择有用特征，或学习稀疏模型以提高泛化能力"
        />

        {/* Section 11.1: 子集搜索与评价 */}
        <Section
          id="subset-search"
          number="11.1"
          title="子集搜索与评价"
        >
          <InfoCard title="特征选择的必要性">
            <p className="text-gray-100 leading-relaxed mb-4">
              在实际应用中，数据往往包含大量特征，但并非所有特征都对学习任务有用。
              <strong className="text-white">特征选择（Feature Selection）</strong>的目标是从原始特征集中选择一个有效的特征子集。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">为什么需要特征选择</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>• <strong className="text-white">降低维度</strong>：减少特征数量，缓解维度灾难</li>
                <li>• <strong className="text-white">提高性能</strong>：去除无关和冗余特征，提高模型泛化能力</li>
                <li>• <strong className="text-white">增强可解释性</strong>：保留重要特征，模型更易理解</li>
                <li>• <strong className="text-white">降低计算开销</strong>：减少训练和预测时间</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="特征选择方法">
            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">子集搜索策略</h4>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>
                    <strong className="text-white">前向搜索</strong>（Forward Selection）：
                    从空集开始，逐步加入特征
                  </li>
                  <li>
                    <strong className="text-white">后向搜索</strong>（Backward Elimination）：
                    从全集开始，逐步删除特征
                  </li>
                  <li>
                    <strong className="text-white">双向搜索</strong>：
                    结合前向和后向搜索
                  </li>
                  <li>
                    <strong className="text-white">全局搜索</strong>：
                    枚举所有可能的子集（计算量大，通常不可行）
                  </li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">子集评价准则</h4>
                <p className="text-gray-100 text-sm mb-2">如何评价一个特征子集的好坏？</p>
                <ul className="space-y-2 text-gray-100 text-sm">
                  <li>
                    <strong className="text-white">信息增益</strong>：
                    特征能够提供多少关于类别的信息
                  </li>
                  <li>
                    <strong className="text-white">基尼指数</strong>：
                    衡量数据纯度，常用于决策树
                  </li>
                  <li>
                    <strong className="text-white">相关系数</strong>：
                    特征与标签的线性相关程度
                  </li>
                  <li>
                    <strong className="text-white">模型性能</strong>：
                    在验证集上的准确率、AUC等指标
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 特征子集搜索是NP难问题</h4>
              <p className="text-gray-100 text-sm">
                d个特征有2<sup>d</sup>个可能的子集，当d很大时无法穷举。
                实际中常用启发式搜索策略，虽然不保证最优，但能在合理时间内找到较好的解。
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="特征选择过程可视化"
            description="演示前向搜索、后向搜索在不同数据集上的特征选择过程"
            status="开发中"
          />
        </Section>

        {/* Section 11.2: 过滤式选择 */}
        <Section
          id="filter-selection"
          number="11.2"
          title="过滤式选择"
        >
          <InfoCard title="过滤式方法（Filter）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">过滤式方法</strong>先对数据集进行特征选择，然后再训练学习器。
              特征选择过程与后续学习器无关，通常基于统计量或信息论指标。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Relief算法</h4>
              <p className="text-gray-100 text-sm mb-3">
                Relief是一种著名的过滤式特征选择方法，为每个特征设计一个"相关统计量"，
                评估特征区分同类和异类样本的能力。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>随机选择样本x</li>
                <li>找到x的同类最近邻（near-hit）和异类最近邻（near-miss）</li>
                <li>如果特征在x和near-hit上差异小、在x和near-miss上差异大，则该特征重要</li>
                <li>更新特征权重统计量</li>
                <li>重复1-4多次，选择权重最大的k个特征</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">Relief-F（多分类扩展）</h4>
              <p className="font-mono text-white text-sm py-2">
                δⁱ = δⁱ - Σₓⱼ∈near-hit diff(xⁱ, xʲ)² + Σc≠y Σₓₖ∈near-miss(c) diff(xⁱ, xᵏ)²
              </p>
              <p className="text-xs text-gray-100 mt-2">
                其中 δⁱ 是第i个特征的统计量，diff是特征差异度量
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 计算效率高</li>
                  <li>• 与学习器无关，通用性强</li>
                  <li>• 易于理解和实现</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 忽略特征间的相互作用</li>
                  <li>• 独立评价每个特征</li>
                  <li>• 可能选出冗余特征</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="Relief算法演示"
            description="可视化Relief如何计算特征权重，区分重要和不重要特征"
            status="开发中"
          />
        </Section>

        {/* Section 11.3: 包裹式选择 */}
        <Section
          id="wrapper-selection"
          number="11.3"
          title="包裹式选择"
        >
          <InfoCard title="包裹式方法（Wrapper）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">包裹式方法</strong>直接把学习器的性能作为特征子集的评价准则。
              将特征选择和学习器训练结合在一起。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">LVW（Las Vegas Wrapper）</h4>
              <p className="text-gray-100 text-sm mb-3">
                LVW是一种典型的包裹式特征选择方法，采用随机策略进行子集搜索。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>随机产生一个特征子集</li>
                <li>在该子集上训练学习器，评估性能</li>
                <li>如果性能优于当前最优子集，则更新</li>
                <li>重复1-3直到达到停止条件（如最大迭代次数或时间限制）</li>
                <li>返回验证集上性能最好的特征子集</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">其他包裹式方法</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">递归特征消除</strong>（RFE）：
                  反复训练模型，每次删除权重最小的特征
                </li>
                <li>
                  <strong className="text-white">遗传算法</strong>：
                  用进化策略搜索特征子集空间
                </li>
                <li>
                  <strong className="text-white">序列前向/后向选择</strong>：
                  基于学习器性能逐步添加/删除特征
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 直接针对学习器优化</li>
                  <li>• 考虑特征间的交互</li>
                  <li>• 通常性能更好</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 计算开销大（需多次训练）</li>
                  <li>• 容易过拟合到验证集</li>
                  <li>• 与学习器强相关</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="包裹式vs过滤式对比"
            description="在相同数据集上对比过滤式和包裹式方法的特征选择结果"
            status="开发中"
          />
        </Section>

        {/* Section 11.4: 嵌入式选择与L1正则化 */}
        <Section
          id="embedded-selection"
          number="11.4"
          title="嵌入式选择与L1正则化"
        >
          <InfoCard title="嵌入式方法（Embedded）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">嵌入式方法</strong>将特征选择过程与学习器训练过程融为一体，
              在学习器训练过程中自动进行特征选择。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">基于L1正则化的特征选择</h4>
              <p className="text-gray-100 text-sm mb-3">
                L1正则化会产生<strong className="text-white">稀疏解</strong>，
                即许多特征的权重变为0，从而实现特征选择。
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
                <p className="font-mono text-white text-sm text-center py-2">
                  min Σᵢ L(yᵢ, f(xᵢ)) + λ||w||₁
                </p>
                <p className="text-xs text-gray-100 text-center mt-2">
                  L1范数：||w||₁ = Σⱼ |wⱼ|
                </p>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">LASSO回归</h4>
              <p className="text-gray-100 text-sm mb-2">
                LASSO（Least Absolute Shrinkage and Selection Operator）是L1正则化线性回归：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-sm text-center">
                  min ||y - Xw||² + λ||w||₁
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                当λ足够大时，部分wⱼ会被压缩到0，相应特征被自动剔除。
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 为什么L1产生稀疏性？</h4>
              <p className="text-gray-100 text-sm">
                L1正则项在原点不可导，梯度下降容易将权重压缩到0。
                而L2正则项（||w||²）是平滑的，只会让权重变小但不会变为0。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">其他嵌入式方法</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">决策树的特征选择</strong>：
                  在树生长过程中自动选择最优特征
                </li>
                <li>
                  <strong className="text-white">神经网络的剪枝</strong>：
                  训练后移除不重要的连接或神经元
                </li>
                <li>
                  <strong className="text-white">Elastic Net</strong>：
                  结合L1和L2正则化（α·||w||₁ + β·||w||²）
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 计算效率高于包裹式</li>
                  <li>• 考虑特征间的交互</li>
                  <li>• 与学习器结合紧密</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 依赖特定学习器</li>
                  <li>• 超参数λ需要调节</li>
                  <li>• 可能不如包裹式准确</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="L1正则化稀疏性演示"
            description="可视化L1和L2正则化对权重的影响，展示L1如何产生稀疏解"
            status="开发中"
          />
        </Section>

        {/* Section 11.5: 稀疏表示与字典学习 */}
        <Section
          id="sparse-representation"
          number="11.5"
          title="稀疏表示与字典学习"
        >
          <InfoCard title="稀疏表示">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">稀疏表示（Sparse Representation）</strong>
              试图用少量"基向量"的线性组合来表示样本，即表示系数中大部分为0。
            </p>

            <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-blue mb-2">稀疏表示问题</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                min ||α||₀  subject to  x = Dα
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                其中 D 是字典矩阵，α 是稀疏系数，||α||₀ 表示α中非零元素个数
              </p>
            </div>

            <p className="text-gray-100 text-sm mb-4">
              L0范数最小化是NP难问题，实践中通常用L1范数作为凸松弛：
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <p className="font-mono text-white text-sm text-center py-2">
                min ||α||₁  subject to  x = Dα  或  min ||x - Dα||² + λ||α||₁
              </p>
            </div>
          </InfoCard>

          <InfoCard title="字典学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">字典学习（Dictionary Learning）</strong>
              旨在为数据集学习一个合适的字典D，使得所有样本都能用该字典稀疏表示。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">字典学习目标</h4>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  min ||X - DA||²F + λΣᵢ ||αᵢ||₁
                </p>
                <p className="text-xs text-gray-100 text-center mt-2">
                  其中 X = [x₁, ..., xₘ]，A = [α₁, ..., αₘ]
                </p>
              </div>
              <p className="text-gray-100 text-sm mt-3">
                需要同时学习字典D和稀疏系数A，这是一个非凸优化问题。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">K-SVD算法</h4>
              <p className="text-gray-100 text-sm mb-2">
                K-SVD是经典的字典学习算法，采用交替优化策略：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li><strong>稀疏编码</strong>：固定字典D，求解稀疏系数A（用OMP、LASSO等方法）</li>
                <li><strong>字典更新</strong>：固定A，逐个更新字典中的原子（用SVD）</li>
                <li>重复1-2直到收敛</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用场景</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">图像去噪</strong>：学习干净图像的字典，稀疏表示去除噪声</li>
                <li>• <strong className="text-white">图像超分辨率</strong>：学习低分辨率-高分辨率图像对的字典</li>
                <li>• <strong className="text-white">人脸识别</strong>：用同类样本的字典稀疏表示测试样本</li>
                <li>• <strong className="text-white">压缩感知</strong>：从少量测量值重构稀疏信号</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="稀疏表示与字典学习演示"
            description="可视化字典学习过程和稀疏重构效果"
            status="开发中"
          />
        </Section>

        {/* Section 11.6: 压缩感知 */}
        <Section
          id="compressed-sensing"
          number="11.6"
          title="压缩感知"
        >
          <InfoCard title="压缩感知原理">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">压缩感知（Compressed Sensing）</strong>
              是一种信号采样理论，指出：如果信号在某个域是稀疏的，那么可以用远少于奈奎斯特采样定理要求的测量次数来恢复信号。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">核心思想</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">稀疏性</strong>：信号x在某个变换域（如小波、傅里叶）中是稀疏的</li>
                <li><strong className="text-white">测量</strong>：通过测量矩阵Φ进行随机投影，得到y = Φx（维度m &lt; n）</li>
                <li><strong className="text-white">重构</strong>：从欠定方程y = Φx恢复稀疏信号x</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">重构问题</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                min ||x||₀  subject to  y = Φx
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                实践中用L1松弛：min ||x||₁  subject to  y = Φx
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">RIP条件</h4>
              <p className="text-gray-100 text-sm">
                <strong className="text-white">限制等距性质</strong>（Restricted Isometry Property, RIP）
                保证了测量矩阵Φ能够保持稀疏信号的结构。
                满足RIP的测量矩阵（如高斯随机矩阵）可以以高概率准确重构稀疏信号。
              </p>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用领域</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">医学成像</strong>：MRI快速成像，减少扫描时间</li>
                <li>• <strong className="text-white">单像素相机</strong>：用少量随机测量重构图像</li>
                <li>• <strong className="text-white">无线通信</strong>：频谱感知、信道估计</li>
                <li>• <strong className="text-white">雷达成像</strong>：合成孔径雷达（SAR）成像</li>
              </ul>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              压缩感知打破了传统采样理论的限制，在信号本身稀疏或可稀疏表示时，
              能以少量测量实现高质量重构，具有重要的理论和应用价值。
            </p>
          </InfoCard>

          <DemoCard
            title="压缩感知信号重构"
            description="演示从少量随机测量中重构稀疏信号的过程"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
