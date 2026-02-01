import ChapterNav from '@/components/layout/ChapterNav'
import ChapterHeader from '@/components/layout/ChapterHeader'
import Section from '@/components/layout/Section'
import InfoCard from '@/components/ui/InfoCard'
import DemoCard from '@/components/ui/DemoCard'
import { LabelPropagationDemo } from '@/components/visualizations/LabelPropagationDemo'

export default function Chapter13() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={13} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapter={13}
          title="半监督学习"
          subtitle="Semi-Supervised Learning"
          description="利用少量标记样本和大量未标记样本进行学习"
        />

        {/* Section 13.1: 未标记样本 */}
        <Section
          id="unlabeled-data"
          number="13.1"
          title="未标记样本"
        >
          <InfoCard title="半监督学习的动机">
            <p className="text-gray-100 leading-relaxed mb-4">
              在许多实际应用中，获取标记数据成本高昂（需要人工标注），而未标记数据容易获取。
              <strong className="text-white">半监督学习（Semi-Supervised Learning）</strong>
              试图利用少量标记样本和大量未标记样本来提升学习性能。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">学习范式对比</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-bold text-sm mb-1">监督学习（Supervised）</p>
                  <p className="text-gray-100 text-sm">使用完全标记的数据 D<sub>l</sub> = {'{(x₁,y₁), ..., (xₘ,yₘ)}'}</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">半监督学习（Semi-Supervised）</p>
                  <p className="text-gray-100 text-sm">
                    同时使用少量标记数据 D<sub>l</sub> 和大量未标记数据 D<sub>u</sub> = {'{xₘ₊₁, ..., xₘ₊ᵤ}'}，通常 u ≫ m
                  </p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">无监督学习（Unsupervised）</p>
                  <p className="text-gray-100 text-sm">只有未标记数据，如聚类、降维</p>
                </div>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 为什么未标记数据有帮助？</h4>
              <p className="text-gray-100 text-sm mb-2">
                未标记数据能够揭示数据的<strong className="text-white">分布结构</strong>：
              </p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• 帮助发现数据的簇结构、流形结构</li>
                <li>• 提供关于决策边界位置的信息（应避开高密度区域）</li>
                <li>• 增强模型的泛化能力</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="半监督学习假设">
            <p className="text-gray-100 leading-relaxed mb-4">
              半监督学习需要对数据分布做一些假设，才能有效利用未标记数据：
            </p>

            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-2">1. 聚类假设（Cluster Assumption）</h4>
                <p className="text-gray-100 text-sm">
                  数据存在簇结构，同一簇内的样本倾向于属于同一类别。
                  决策边界应位于低密度区域，避免穿过簇。
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-2">2. 流形假设（Manifold Assumption）</h4>
                <p className="text-gray-100 text-sm">
                  高维数据分布在低维流形上，相近的样本（沿流形的测地线距离）倾向于有相同标记。
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-blue font-bold mb-2">3. 平滑假设（Smoothness Assumption）</h4>
                <p className="text-gray-100 text-sm">
                  如果两个样本在高密度区域中相近，则它们的标记应该相同或相似。
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-100 mt-4 bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
              <strong className="text-ml-red">警告</strong>：
              如果数据不满足这些假设，未标记数据可能降低性能！半监督学习不是万能的。
            </p>
          </InfoCard>

          <DemoCard
            title="半监督学习假设可视化"
            description="展示聚类假设、流形假设、平滑假设在不同数据分布上的效果"
            status="开发中"
          />
        </Section>

        {/* Section 13.2: 生成式方法 */}
        <Section
          id="generative-methods"
          number="13.2"
          title="生成式方法"
        >
          <InfoCard title="生成式半监督学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">生成式方法</strong>假设数据由某个概率模型生成，
              利用未标记数据来更准确地估计模型参数。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">基于混合模型的方法</h4>
              <p className="text-gray-100 text-sm mb-3">
                假设数据由混合模型生成（如高斯混合模型GMM），每个混合成分对应一个类别：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>用标记数据初始化模型参数（均值、协方差、混合系数）</li>
                <li><strong>E步</strong>：计算未标记样本属于各成分的后验概率</li>
                <li><strong>M步</strong>：利用所有样本（标记+未标记）更新参数</li>
                <li>重复2-3直到收敛</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">对数似然</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                ℒ = Σ<sub>(x,y)∈D<sub>l</sub></sub> log P(x, y | θ) + Σ<sub>x∈D<sub>u</sub></sub> log P(x | θ)
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                标记数据提供类别信息，未标记数据帮助估计数据分布
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              <strong className="text-ml-green">优点</strong>：有坚实的概率理论基础，EM算法保证收敛。
              <strong className="text-ml-red">缺点</strong>：依赖模型假设，如果模型不匹配真实分布，效果不佳。
            </p>
          </InfoCard>

          <DemoCard
            title="生成式半监督学习演示"
            description="用GMM进行半监督分类，观察未标记数据如何改善类别边界"
            status="开发中"
          />
        </Section>

        {/* Section 13.3: 半监督SVM */}
        <Section
          id="semi-supervised-svm"
          number="13.3"
          title="半监督SVM"
        >
          <InfoCard title="TSVM（Transductive SVM）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">直推式SVM（Transductive SVM, TSVM）</strong>
              也称为S3VM（Semi-Supervised SVM），试图找到一个决策边界，使其穿过低密度区域，
              同时对标记样本有较大间隔。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">TSVM优化目标</h4>
              <p className="text-gray-100 text-sm mb-2">
                同时优化标记样本的分类精度和未标记样本的置信度：
              </p>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3">
                <p className="font-mono text-white text-xs text-center py-2">
                  min ||w||² + C<sub>l</sub>Σ<sub>i∈D<sub>l</sub></sub>ξᵢ + C<sub>u</sub>Σ<sub>j∈D<sub>u</sub></sub>ξⱼ
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                s.t. yᵢ(w<sup>T</sup>xᵢ + b) ≥ 1 - ξᵢ （标记样本）<br/>
                |w<sup>T</sup>xⱼ + b| ≥ 1 - ξⱼ （未标记样本：远离决策边界）
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">TSVM算法流程</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>在标记数据上训练初始SVM</li>
                <li>用初始SVM预测未标记样本的标记（伪标记）</li>
                <li>选择置信度最低的未标记样本，尝试翻转其标记</li>
                <li>重新训练SVM，如果目标函数下降则接受翻转</li>
                <li>重复3-4直到收敛或达到最大迭代次数</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 低密度分离</h4>
              <p className="text-gray-100 text-sm">
                TSVM体现了<strong className="text-white">聚类假设</strong>：
                决策边界应位于低密度区域。通过要求未标记样本远离决策边界（|f(x)| ≥ 1），
                TSVM避免决策边界穿过数据密集区域。
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              TSVM是非凸优化问题，通常使用启发式算法求解，难以保证全局最优。
            </p>
          </InfoCard>

          <DemoCard
            title="TSVM决策边界演示"
            description="对比SVM和TSVM的决策边界，观察低密度分离效果"
            status="开发中"
          />
        </Section>

        {/* Section 13.4: 图半监督学习 */}
        <Section
          id="graph-ssl"
          number="13.4"
          title="图半监督学习"
        >
          <InfoCard title="基于图的半监督学习">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">图半监督学习</strong>将数据表示为图，节点是样本，边表示样本间的相似度。
              标记信息从标记节点沿着边传播到未标记节点。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">图的构建</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">k近邻图</strong>：
                  如果xⱼ是xᵢ的k个最近邻之一，连接边(i, j)
                </li>
                <li>
                  <strong className="text-white">ε近邻图</strong>：
                  如果 ||xᵢ - xⱼ|| &lt; ε，连接边(i, j)
                </li>
                <li>
                  <strong className="text-white">全连接图</strong>：
                  所有节点两两相连，边权重 wᵢⱼ = exp(-||xᵢ - xⱼ||²/2σ²)（高斯核）
                </li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard title="标签传播算法">
            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Label Propagation</h4>
              <p className="text-gray-100 text-sm mb-3">
                迭代地让每个未标记节点从邻居获取标记，直到收敛：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化：标记样本保持其真实标记，未标记样本随机初始化</li>
                <li>对每个未标记样本xᵢ，更新其标记为邻居标记的加权平均：</li>
              </ol>
              <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-3 mt-2">
                <p className="font-mono text-white text-sm text-center py-2">
                  yᵢ ← Σⱼ wᵢⱼyⱼ / Σⱼ wᵢⱼ
                </p>
              </div>
              <ol start={3} className="list-decimal list-inside space-y-2 text-gray-100 text-sm mt-2">
                <li>重复步骤2直到标记不再变化</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">Label Spreading</h4>
              <p className="text-gray-100 text-sm mb-2">
                Label Propagation的改进版本，允许标记样本的标记也参与更新（软钳制）：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3">
                <p className="font-mono text-white text-sm text-center">
                  Y<sup>(t+1)</sup> = αSY<sup>(t)</sup> + (1-α)Y<sup>(0)</sup>
                </p>
              </div>
              <p className="text-xs text-gray-100 mt-2">
                S是归一化的相似度矩阵，α∈(0,1)控制标记样本标记的保持程度，Y<sup>(0)</sup>是初始标记
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">基于图的正则化</h4>
              <p className="text-gray-100 text-sm mb-2">
                从能量最小化角度看图半监督学习，目标是最小化：
              </p>
              <div className="bg-ml-bg-primary rounded-lg p-3 mb-2">
                <p className="font-mono text-white text-xs text-center">
                  E = Σ<sub>(x,y)∈D<sub>l</sub></sub> ||f(x) - y||² + λΣᵢⱼ wᵢⱼ||f(xᵢ) - f(xⱼ)||²
                </p>
              </div>
              <p className="text-gray-100 text-sm">
                第一项：拟合标记数据；第二项：<strong className="text-white">平滑性正则化</strong>，相似样本的预测应相近。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 简单直观，易于实现</li>
                  <li>• 有封闭解（矩阵求逆）</li>
                  <li>• 能利用流形结构</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 计算复杂度高（O(n³)）</li>
                  <li>• 对图构建方式敏感</li>
                  <li>• 难以处理大规模数据</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ml-cyan mb-2">标签传播交互演示</h3>
              <p className="text-sm text-gray-100">
                在k近邻图上观察标签如何从少量标记节点传播到整个网络
              </p>
            </div>
            <LabelPropagationDemo />
          </div>
        </Section>

        {/* Section 13.5: 分歧方法 */}
        <Section
          id="disagreement-methods"
          number="13.5"
          title="分歧方法"
        >
          <InfoCard title="协同训练（Co-Training）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">协同训练</strong>假设特征可以分为两个充分且条件独立的视图（view），
              利用多视图之间的互补信息进行半监督学习。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Co-Training算法</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>将特征分为两个视图：x = (x<sup>(1)</sup>, x<sup>(2)</sup>)</li>
                <li>在每个视图上用标记数据训练一个分类器 h<sup>(1)</sup>, h<sup>(2)</sup></li>
                <li>用 h<sup>(1)</sup> 对未标记数据预测，选择最有信心的样本加入标记集</li>
                <li>用 h<sup>(2)</sup> 对未标记数据预测，选择最有信心的样本加入标记集</li>
                <li>重新训练两个分类器</li>
                <li>重复3-5直到满足停止条件</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 为什么有效？</h4>
              <p className="text-gray-100 text-sm">
                两个视图提供不同的"视角"看数据，一个分类器的高置信度预测可以作为另一个分类器的训练样本，
                从而利用未标记数据。关键假设：两个视图<strong className="text-white">充分</strong>（每个都足以分类）
                且<strong className="text-white">条件独立</strong>（给定类别，两个视图独立）。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">经典应用：网页分类</h4>
              <p className="text-gray-100 text-sm">
                网页分类是Co-Training的经典应用场景：
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-100 text-sm mt-2">
                <li>视图1：网页自身的文本内容</li>
                <li>视图2：指向该网页的超链接锚文本</li>
              </ul>
              <p className="text-gray-100 text-sm mt-2">
                这两个视图都包含关于网页类别的信息，且相对独立。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="自训练（Self-Training）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">自训练</strong>是一种简单的半监督学习方法，反复使用自己的预测来扩充训练集。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">Self-Training算法</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>在标记数据上训练初始分类器</li>
                <li>用分类器预测未标记数据</li>
                <li>选择置信度最高的k个预测，将其伪标记加入训练集</li>
                <li>重新训练分类器</li>
                <li>重复2-4直到未标记数据用完或达到停止条件</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 非常简单，易于实现</li>
                  <li>• 适用于任何分类器</li>
                  <li>• 无需特殊假设</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 错误会累积（一旦加入错误伪标记，难以纠正）</li>
                  <li>• 容易产生"确认偏误"</li>
                  <li>• 不保证性能提升</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-gray-100 mt-4 bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-3">
              <strong className="text-ml-yellow">提示</strong>：
              Co-Training比Self-Training更可靠，因为两个视图的"意见不一致"能够互相纠错。
            </p>
          </InfoCard>

          <DemoCard
            title="Co-Training vs Self-Training"
            description="对比协同训练和自训练在双月形数据上的表现"
            status="开发中"
          />
        </Section>

        {/* Section 13.6: 半监督聚类 */}
        <Section
          id="semi-supervised-clustering"
          number="13.6"
          title="半监督聚类"
        >
          <InfoCard title="约束聚类">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">半监督聚类</strong>利用少量监督信息（标记样本或成对约束）来改善聚类结果。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">成对约束</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li>
                  <strong className="text-white">Must-Link（ML）约束</strong>：
                  xᵢ 和 xⱼ 必须在同一个簇中
                </li>
                <li>
                  <strong className="text-white">Cannot-Link（CL）约束</strong>：
                  xᵢ 和 xⱼ 不能在同一个簇中
                </li>
              </ul>
              <p className="text-gray-100 text-sm mt-3">
                这些约束可以从标记样本自动生成：同类样本产生ML约束，异类样本产生CL约束。
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">约束k-means算法</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化k个簇中心</li>
                <li>对于每个样本xᵢ：</li>
                <li className="ml-6">• 找到最近的簇中心Cⱼ</li>
                <li className="ml-6">• 检查是否违反约束：</li>
                <li className="ml-12">- 如果违反CL约束，选择次近的不违反约束的簇</li>
                <li className="ml-12">- 如果违反ML约束，将相关样本也分配到同一簇</li>
                <li>更新簇中心</li>
                <li>重复2-3直到收敛</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">度量学习 + 聚类</h4>
              <p className="text-gray-100 text-sm mb-2">
                另一种策略是利用约束学习距离度量，然后用学到的度量进行聚类：
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm">
                <li>从约束中学习马氏距离矩阵M（ML对应的样本距离应小，CL对应的样本距离应大）</li>
                <li>用学到的度量 d<sub>M</sub>(x, x') = √((x-x')<sup>T</sup>M(x-x')) 进行k-means聚类</li>
              </ol>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用场景</h4>
              <p className="text-gray-100 text-sm">
                半监督聚类适用于：用户交互式聚类（用户提供少量标注反馈）、主动学习（选择最有价值的样本询问标签）、
                知识发现（利用领域知识改善聚类）。
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="约束聚类演示"
            description="交互式添加ML和CL约束，观察聚类结果的变化"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
