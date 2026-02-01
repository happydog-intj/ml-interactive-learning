import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { KMeansVisualization } from '@/components/visualizations/KMeansVisualization'

export default function Chapter9() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={9} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapterNumber={9}
          title="聚类"
          subtitle="Clustering"
          icon="🎯"
          gradient="from-ml-cyan via-ml-blue to-ml-purple"
          objectives={[
            '理解聚类的基本概念和无监督学习的特点',
            '掌握K-means算法的原理和实现',
            '了解层次聚类和密度聚类的思想',
            '理解聚类性能评估指标'
          ]}
        />

        {/* Section 9.1: 聚类任务 */}
        <Section
          id="clustering-task"
          number="9.1"
          title="聚类任务"
        >
          <InfoCard title="什么是聚类">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">聚类（Clustering）</strong>是一种无监督学习任务，目标是将数据集中的样本划分为若干个组（簇），使得：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-100">
              <li><strong className="text-ml-cyan">簇内相似度高</strong>：同一簇内的样本尽可能相似</li>
              <li><strong className="text-ml-purple">簇间相似度低</strong>：不同簇之间的样本尽可能不同</li>
            </ul>
            <p className="text-gray-100 leading-relaxed mt-4">
              聚类与分类的区别：分类有已知的类别标签（监督学习），而聚类没有预先定义的类别（无监督学习），需要自动发现数据中的内在结构。
            </p>
          </InfoCard>

          <InfoCard title="聚类的性能度量">
            <p className="text-gray-100 leading-relaxed mb-4">
              聚类性能度量分为两类：
            </p>

            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-2">外部指标（External Index）</h4>
                <p className="text-gray-100 text-sm mb-2">将聚类结果与参考模型（真实标签）比较：</p>
                <ul className="list-disc list-inside space-y-1 text-gray-100 text-sm">
                  <li><strong>Jaccard系数（JC）</strong>：JC = a / (a + b + c)</li>
                  <li><strong>FM指数（FMI）</strong>：FMI = √(a/(a+b) · a/(a+c))</li>
                  <li><strong>Rand指数（RI）</strong>：RI = 2(a + d) / (m(m-1))</li>
                </ul>
                <p className="text-xs text-gray-100 mt-2">其中 a: 同簇同类, b: 同簇不同类, c: 不同簇同类, d: 不同簇不同类</p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-2">内部指标（Internal Index）</h4>
                <p className="text-gray-100 text-sm mb-2">不依赖外部参考，直接考察聚类结果：</p>
                <ul className="list-disc list-inside space-y-1 text-gray-100 text-sm">
                  <li><strong>DB指数</strong>（Davies-Bouldin Index）：簇内距离小、簇间距离大</li>
                  <li><strong>Dunn指数</strong>（DI）：簇间最小距离 / 簇内最大距离</li>
                  <li><strong>轮廓系数</strong>（Silhouette Coefficient）：[-1, 1]，越接近1越好</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="聚类性能度量演示"
            description="可视化不同聚类性能指标的计算过程"
            status="开发中"
          />
        </Section>

        {/* Section 9.2: 原型聚类 */}
        <Section
          id="prototype-clustering"
          number="9.2"
          title="原型聚类"
        >
          <InfoCard title="k均值算法（k-means）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">k均值算法</strong>是最常用的聚类算法，基于原型的划分方法：
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">算法步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100">
                <li>随机选择 k 个样本作为初始簇中心 μ₁, μ₂, ..., μₖ</li>
                <li>计算每个样本到各簇中心的距离，划分到最近的簇</li>
                <li>根据划分结果，重新计算每个簇的中心（簇内样本均值）</li>
                <li>重复步骤2-3，直到簇中心不再变化或达到最大迭代次数</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">目标函数（最小化平方误差）</h4>
              <p className="font-mono text-white text-center py-2">
                E = Σᵢ₌₁ᵏ Σₓ∈Cᵢ ||x - μᵢ||²
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-100">
                <strong className="text-ml-green">优点</strong>：简单高效、易于实现、适合大规模数据
              </p>
              <p className="text-sm text-gray-100">
                <strong className="text-ml-red">缺点</strong>：需要预先指定k、对初始中心敏感、只能发现凸形簇、对噪声敏感
              </p>
            </div>
          </InfoCard>

          <InfoCard title="学习向量量化（LVQ）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">LVQ（Learning Vector Quantization）</strong>是一种有监督的原型聚类方法，结合了聚类和分类：
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">LVQ算法流程</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>初始化一组原型向量 {'{p₁, p₂, ..., pq}'}</li>
                <li>随机选取样本 xⱼ，找到最近的原型向量 pᵢ*</li>
                <li>如果 xⱼ 和 pᵢ* 类别相同，将 pᵢ* 向 xⱼ 靠近：pᵢ* ← pᵢ* + η(xⱼ - pᵢ*)</li>
                <li>如果类别不同，将 pᵢ* 远离 xⱼ：pᵢ* ← pᵢ* - η(xⱼ - pᵢ*)</li>
                <li>重复2-4直到满足停止条件</li>
              </ol>
              <p className="text-xs text-gray-100 mt-3">其中 η ∈ (0,1) 是学习率</p>
            </div>

            <p className="text-sm text-gray-100">
              LVQ的关键：利用样本的类别标签信息来调整原型向量，使得同类原型更接近、异类原型更远离。
            </p>
          </InfoCard>

          <InfoCard title="高斯混合聚类（GMM）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">高斯混合模型（Gaussian Mixture Model, GMM）</strong>采用概率模型进行聚类：
            </p>

            <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-blue mb-2">混合模型定义</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                p(x) = Σᵢ₌₁ᵏ αᵢ·𝒩(x | μᵢ, Σᵢ)
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                其中 αᵢ 是混合系数（Σαᵢ = 1），𝒩 是高斯分布
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-cyan font-bold mb-2">EM算法求解GMM</h4>
              <p className="text-gray-100 text-sm mb-3">迭代执行两步：</p>
              <ul className="list-disc list-inside space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">E步</strong>：根据当前参数计算每个样本属于各簇的后验概率 γⱼᵢ</li>
                <li><strong className="text-white">M步</strong>：根据后验概率更新模型参数（μᵢ, Σᵢ, αᵢ）</li>
              </ul>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              GMM相比k-means的优势：能够捕捉簇的形状和大小（协方差矩阵），输出样本属于各簇的概率（软划分）。
            </p>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ml-cyan mb-2">k-means聚类交互演示</h3>
              <p className="text-sm text-gray-100">
                通过交互式可视化理解k-means算法的迭代过程，观察质心如何移动以及簇如何形成
              </p>
            </div>
            <KMeansVisualization />
          </div>
        </Section>

        {/* Section 9.3: 密度聚类 */}
        <Section
          id="density-clustering"
          number="9.3"
          title="密度聚类"
        >
          <InfoCard title="DBSCAN算法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">DBSCAN（Density-Based Spatial Clustering of Applications with Noise）</strong>
              基于密度的聚类方法，能发现任意形状的簇并识别噪声点。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">核心概念</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">ε-邻域</strong>：Nε(x) = {'{x′ ∈ D | dist(x, x′) ≤ ε}'}</li>
                <li><strong className="text-white">核心对象</strong>：若 |Nε(x)| ≥ MinPts，则x是核心对象</li>
                <li><strong className="text-white">密度直达</strong>：若x′在x的ε-邻域内且x是核心对象</li>
                <li><strong className="text-white">密度可达</strong>：存在样本序列使得密度直达传递</li>
                <li><strong className="text-white">密度相连</strong>：存在核心对象o使得x、x′均密度可达于o</li>
              </ul>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">DBSCAN算法步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>标记所有核心对象</li>
                <li>随机选取一个未访问的核心对象，生成新簇</li>
                <li>找到所有与该核心对象密度相连的样本，加入当前簇</li>
                <li>重复步骤2-3，直到所有核心对象都被访问</li>
                <li>将未被划入任何簇的样本标记为噪声点</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 能发现任意形状的簇</li>
                  <li>• 能识别噪声点</li>
                  <li>• 不需要预先指定簇数量</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 参数ε和MinPts难以确定</li>
                  <li>• 对不同密度的簇效果不佳</li>
                  <li>• 高维数据性能下降</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="DBSCAN聚类可视化"
            description="交互式调整ε和MinPts参数，观察聚类结果变化"
            status="开发中"
          />
        </Section>

        {/* Section 9.4: 层次聚类 */}
        <Section
          id="hierarchical-clustering"
          number="9.4"
          title="层次聚类"
        >
          <InfoCard title="层次聚类方法">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">层次聚类（Hierarchical Clustering）</strong>在不同层次上对数据集进行划分，
              形成树形的聚类结构（树状图/dendrogram）。
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">凝聚层次聚类（AGNES）</h4>
                <p className="text-gray-100 text-sm mb-2">自底向上的策略：</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm">
                  <li>初始：每个样本作为一个簇</li>
                  <li>找到距离最近的两个簇</li>
                  <li>合并这两个簇</li>
                  <li>重复2-3直到达到预设簇数</li>
                </ol>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">分裂层次聚类（DIANA）</h4>
                <p className="text-gray-100 text-sm mb-2">自顶向下的策略：</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-100 text-sm">
                  <li>初始：所有样本在一个簇</li>
                  <li>选择某个簇进行分裂</li>
                  <li>将该簇分为两个子簇</li>
                  <li>重复2-3直到达到预设簇数</li>
                </ol>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-yellow font-bold mb-3">簇间距离计算</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">最小距离</strong>（单链接）：dₘᵢₙ(Cᵢ, Cⱼ) = min{'{dist(x, x′) | x∈Cᵢ, x′∈Cⱼ}'}</li>
                <li><strong className="text-white">最大距离</strong>（全链接）：dₘₐₓ(Cᵢ, Cⱼ) = max{'{dist(x, x′) | x∈Cᵢ, x′∈Cⱼ}'}</li>
                <li><strong className="text-white">平均距离</strong>：dₐᵥ𝓰(Cᵢ, Cⱼ) = (1/|Cᵢ||Cⱼ|) Σₓ∈Cᵢ Σₓ′∈Cⱼ dist(x, x′)</li>
              </ul>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              <strong className="text-white">优势</strong>：不需要预先指定簇数量，可以通过树状图选择合适的层次。
              <strong className="text-white">劣势</strong>：计算复杂度高（O(n²)或O(n³)），不适合大规模数据。
            </p>
          </InfoCard>

          <DemoCard
            title="层次聚类树状图"
            description="可视化AGNES算法的聚类过程和树状图结构"
            status="开发中"
          />
        </Section>

        {/* Section 9.5: 谱聚类 */}
        <Section
          id="spectral-clustering"
          number="9.5"
          title="谱聚类"
        >
          <InfoCard title="谱聚类基本思想">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">谱聚类（Spectral Clustering）</strong>从图论角度进行聚类，
              将聚类问题转化为图的划分问题，利用图的谱（特征值和特征向量）进行聚类。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">核心步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li><strong>构建相似度图</strong>：计算样本间相似度，构建相似度矩阵 W</li>
                <li><strong>计算拉普拉斯矩阵</strong>：L = D - W（D是度矩阵）</li>
                <li><strong>特征分解</strong>：计算L的前k个最小特征值对应的特征向量</li>
                <li><strong>k-means聚类</strong>：对特征向量矩阵的行进行k-means聚类</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-blue mb-2">常用的拉普拉斯矩阵</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">未归一化</strong>：L = D - W</li>
                <li><strong className="text-white">对称归一化</strong>：Lₛᵧₘ = D⁻¹/²LD⁻¹/² = I - D⁻¹/²WD⁻¹/²</li>
                <li><strong className="text-white">随机游走归一化</strong>：Lᵣw = D⁻¹L = I - D⁻¹W</li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 为什么有效？</h4>
              <p className="text-gray-100 text-sm">
                谱聚类在降维后的特征空间中进行聚类，能够发现非凸形状的簇。
                拉普拉斯矩阵的特征向量保留了图的连通性信息，使得同簇样本在特征空间中更接近。
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-100">
                <strong className="text-ml-green">优点</strong>：能处理任意形状的簇、只需要相似度矩阵、对初始值不敏感
              </p>
              <p className="text-sm text-gray-100">
                <strong className="text-ml-red">缺点</strong>：计算复杂度高、需要预先指定簇数、相似度矩阵构建方式影响结果
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="谱聚类可视化"
            description="展示谱聚类如何处理非凸形状的簇（如双月形数据）"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
