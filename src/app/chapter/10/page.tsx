import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'
import { PCAVisualization } from '@/components/visualizations/PCAVisualization'

export default function Chapter10() {
  return (
    <div className="min-h-screen bg-ml-bg-primary">
      <ChapterNav currentChapter={10} totalChapters={16} />

      <main className="container mx-auto px-6 py-12">
        <ChapterHeader
          chapter={10}
          title="降维与度量学习"
          subtitle="Dimensionality Reduction and Metric Learning"
          description="在高维数据中提取低维表示，并学习合适的距离度量"
        />

        {/* Section 10.1: k近邻学习 */}
        <Section
          id="knn"
          number="10.1"
          title="k近邻学习"
        >
          <InfoCard title="k近邻算法（k-NN）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">k近邻（k-Nearest Neighbor, k-NN）</strong>是一种基本的分类与回归方法，
              基于"物以类聚"的直观想法：给定测试样本，找到训练集中与其最接近的k个样本，通过这k个"邻居"的信息进行预测。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">算法流程</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>计算测试样本与训练集中所有样本的距离</li>
                <li>选出距离最小的k个训练样本</li>
                <li><strong>分类任务</strong>：投票法，选择k个样本中出现最多的类别</li>
                <li><strong>回归任务</strong>：平均法，取k个样本标记的平均值</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 简单直观，易于理解和实现</li>
                  <li>• 无需训练过程（懒惰学习）</li>
                  <li>• 适合多分类问题</li>
                  <li>• 对异常值不敏感</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 预测开销大（需计算所有距离）</li>
                  <li>• 对高维数据效果差（维度灾难）</li>
                  <li>• 对样本不平衡敏感</li>
                  <li>• k值和距离度量的选择很关键</li>
                </ul>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">🔑 关键参数</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">k值</strong>：k太小容易过拟合（受噪声影响），k太大容易欠拟合（决策边界过于平滑）</li>
                <li><strong className="text-white">距离度量</strong>：欧氏距离、曼哈顿距离、闵可夫斯基距离、马氏距离等</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="k-NN分类可视化"
            description="交互式调整k值和距离度量，观察决策边界变化"
            status="开发中"
          />
        </Section>

        {/* Section 10.2: 低维嵌入 */}
        <Section
          id="low-dim-embedding"
          number="10.2"
          title="低维嵌入"
        >
          <InfoCard title="为什么需要降维">
            <p className="text-gray-100 leading-relaxed mb-4">
              高维数据在机器学习中面临诸多挑战，这被称为<strong className="text-ml-red">"维度灾难"（Curse of Dimensionality）</strong>：
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-100 mb-4">
              <li>计算复杂度随维度指数增长</li>
              <li>高维空间中数据变得稀疏，距离度量失效</li>
              <li>容易过拟合，需要更多样本</li>
              <li>可视化困难</li>
            </ul>

            <p className="text-gray-100 leading-relaxed">
              <strong className="text-white">降维（Dimensionality Reduction）</strong>通过某种数学变换，
              将高维数据投影到低维空间，同时尽可能保留数据的内在结构和重要信息。
            </p>
          </InfoCard>

          <InfoCard title="多维缩放（MDS）">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">多维缩放（Multi-Dimensional Scaling, MDS）</strong>
              要求降维后样本间的距离尽可能保持不变。
            </p>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">目标函数</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                min Σᵢ₌₁ⁿ Σⱼ₌₁ⁿ (||zᵢ - zⱼ|| - dᵢⱼ)²
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                其中 dᵢⱼ 是原空间中样本i和j的距离，||zᵢ - zⱼ|| 是降维后的距离
              </p>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-purple font-bold mb-3">经典MDS算法步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>计算原始空间中样本间的距离矩阵 D</li>
                <li>构造内积矩阵 B = -½ HDH<sup>T</sup>（H是中心化矩阵）</li>
                <li>对B进行特征值分解：B = VΛV<sup>T</sup></li>
                <li>取前d'个最大特征值对应的特征向量，得到降维结果</li>
              </ol>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              MDS通过保持距离关系来降维，适合数据可视化和探索性分析。
            </p>
          </InfoCard>

          <DemoCard
            title="MDS降维可视化"
            description="将高维数据用MDS降到2维，观察样本分布"
            status="开发中"
          />
        </Section>

        {/* Section 10.3: 主成分分析 */}
        <Section
          id="pca"
          number="10.3"
          title="主成分分析"
        >
          <InfoCard title="PCA基本思想">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">主成分分析（Principal Component Analysis, PCA）</strong>
              是最常用的降维方法，通过线性变换将数据投影到方差最大的方向上。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">两种理解角度</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-bold text-sm mb-1">1. 最大化投影方差</p>
                  <p className="text-gray-100 text-sm">
                    找到投影方向，使得数据在该方向上的投影方差最大，保留最多的信息量
                  </p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">2. 最小化重构误差</p>
                  <p className="text-gray-100 text-sm">
                    找到投影方向，使得原始数据与降维重构数据之间的平方误差最小
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">PCA算法步骤</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>对数据进行中心化：xᵢ ← xᵢ - μ（μ是样本均值）</li>
                <li>计算样本协方差矩阵：C = (1/m) XX<sup>T</sup></li>
                <li>对协方差矩阵进行特征值分解：C = VΛV<sup>T</sup></li>
                <li>取前d'个最大特征值对应的特征向量构成投影矩阵W</li>
                <li>对样本进行投影：z = W<sup>T</sup>x</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">如何选择主成分数量d'</h4>
              <p className="text-gray-100 text-sm mb-2">常用方法：</p>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">方差贡献率</strong>：选择累积方差贡献率达到85%-95%的主成分</li>
                <li>• <strong className="text-white">交叉验证</strong>：通过下游任务性能选择最优维度</li>
                <li>• <strong className="text-white">碎石图</strong>（Scree Plot）：观察特征值曲线的"拐点"</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-green/10 border border-ml-green/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-green mb-2">✓ 优点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 完全无参数，易于实现</li>
                  <li>• 各主成分正交，消除相关性</li>
                  <li>• 有明确的数学解释</li>
                  <li>• 可用于数据压缩和去噪</li>
                </ul>
              </div>
              <div className="bg-ml-red/10 border border-ml-red/30 rounded-lg p-3">
                <p className="text-sm font-bold text-ml-red mb-2">✗ 缺点</p>
                <ul className="text-xs text-gray-100 space-y-1">
                  <li>• 只能进行线性变换</li>
                  <li>• 对异常值敏感</li>
                  <li>• 主成分可解释性差</li>
                  <li>• 假设方差大=信息量大</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <div className="bg-ml-bg-card border-2 border-ml-cyan/30 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ml-cyan mb-2">PCA降维交互演示</h3>
              <p className="text-sm text-gray-100">
                3D可视化PCA主成分分析，旋转视角观察数据分布和主成分方向
              </p>
            </div>
            <PCAVisualization />
          </div>
        </Section>

        {/* Section 10.4: 核化线性降维 */}
        <Section
          id="kernel-pca"
          number="10.4"
          title="核化线性降维"
        >
          <InfoCard title="核主成分分析（KPCA）">
            <p className="text-gray-100 leading-relaxed mb-4">
              传统PCA只能进行线性降维。<strong className="text-white">核主成分分析（Kernel PCA, KPCA）</strong>
              通过核技巧将数据映射到高维特征空间，再在该空间中进行PCA，从而实现非线性降维。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">KPCA核心思想</h4>
              <div className="space-y-2 text-gray-100 text-sm">
                <p>1. <strong className="text-white">映射</strong>：通过映射φ将样本从原始空间映射到高维空间</p>
                <p>2. <strong className="text-white">核技巧</strong>：不显式计算φ(x)，而是通过核函数 κ(xᵢ, xⱼ) = φ(xᵢ)<sup>T</sup>φ(xⱼ)</p>
                <p>3. <strong className="text-white">特征分解</strong>：对核矩阵K进行特征值分解</p>
                <p>4. <strong className="text-white">投影</strong>：利用特征向量进行降维</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-ml-blue/10 to-ml-purple/10 border border-ml-blue/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-blue mb-2">常用核函数</h4>
              <ul className="space-y-2 text-gray-100 text-sm">
                <li><strong className="text-white">线性核</strong>：κ(x, z) = x<sup>T</sup>z（退化为标准PCA）</li>
                <li><strong className="text-white">多项式核</strong>：κ(x, z) = (x<sup>T</sup>z + c)<sup>d</sup></li>
                <li><strong className="text-white">高斯核</strong>（RBF）：κ(x, z) = exp(-||x-z||²/2σ²)</li>
              </ul>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 KPCA vs PCA</h4>
              <p className="text-gray-100 text-sm">
                KPCA能够捕捉数据的非线性结构，适合处理非线性分布的数据。
                但计算复杂度更高（需要计算和存储核矩阵），且新样本投影需要保留训练数据。
              </p>
            </div>
          </InfoCard>

          <DemoCard
            title="KPCA与PCA对比"
            description="在非线性数据（如瑞士卷）上对比KPCA和PCA的降维效果"
            status="开发中"
          />
        </Section>

        {/* Section 10.5: 流形学习 */}
        <Section
          id="manifold-learning"
          number="10.5"
          title="流形学习"
        >
          <InfoCard title="流形学习基本概念">
            <p className="text-gray-100 leading-relaxed mb-4">
              <strong className="text-white">流形（Manifold）</strong>是局部具有欧氏空间性质的几何体。
              <strong className="text-white">流形学习（Manifold Learning）</strong>假设高维数据实际上分布在低维流形上，
              目标是找到这个低维流形结构。
            </p>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-cyan font-bold mb-3">等度量映射（Isomap）</h4>
              <p className="text-gray-100 text-sm mb-2">
                Isomap认为低维流形嵌入在高维空间中，样本间的<strong className="text-white">测地线距离</strong>
                （沿流形表面的距离）才能真实反映相似度。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>构建k近邻图，计算邻域内样本的欧氏距离</li>
                <li>用最短路径算法（如Dijkstra）计算任意两点的测地线距离</li>
                <li>对测地线距离矩阵应用MDS进行降维</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4 mb-4">
              <h4 className="text-ml-purple font-bold mb-3">局部线性嵌入（LLE）</h4>
              <p className="text-gray-100 text-sm mb-2">
                LLE假设每个样本可以由其近邻样本线性表示，降维时保持这种局部线性关系。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-100 text-sm">
                <li>找到每个样本的k个近邻</li>
                <li>计算重构权重W，使得 xᵢ ≈ Σⱼ wᵢⱼxⱼ（邻域内线性重构）</li>
                <li>保持权重W不变，在低维空间中求解坐标Z，使得 zᵢ ≈ Σⱼ wᵢⱼzⱼ</li>
              </ol>
            </div>

            <div className="bg-ml-bg-dark rounded-lg p-4">
              <h4 className="text-ml-blue font-bold mb-3">t-SNE</h4>
              <p className="text-gray-100 text-sm mb-2">
                <strong className="text-white">t-分布随机邻域嵌入（t-SNE）</strong>
                专门用于数据可视化，能够在二维或三维空间中很好地展示高维数据的簇结构。
              </p>
              <p className="text-gray-100 text-sm">
                核心思想：在高维空间中用高斯分布建模样本相似度，在低维空间中用t分布建模，
                通过KL散度优化，使得高维和低维的概率分布尽可能接近。
              </p>
            </div>

            <p className="text-sm text-gray-100 mt-4">
              <strong className="text-ml-yellow">注意</strong>：流形学习方法通常计算复杂度高，不适合大规模数据；
              且很多方法（如LLE、Isomap）难以处理新样本（out-of-sample）。
            </p>
          </InfoCard>

          <DemoCard
            title="流形学习方法对比"
            description="在瑞士卷、S曲线等流形数据上对比Isomap、LLE、t-SNE效果"
            status="开发中"
          />
        </Section>

        {/* Section 10.6: 度量学习 */}
        <Section
          id="metric-learning"
          number="10.6"
          title="度量学习"
        >
          <InfoCard title="度量学习的动机">
            <p className="text-gray-100 leading-relaxed mb-4">
              在许多机器学习任务中，距离度量至关重要（如k-NN、聚类）。
              <strong className="text-white">度量学习（Metric Learning）</strong>
              旨在学习一个合适的距离度量，使得同类样本距离近、异类样本距离远。
            </p>

            <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-ml-cyan mb-2">马氏距离</h4>
              <p className="font-mono text-white text-sm text-center py-2">
                dist²ₘ(xᵢ, xⱼ) = (xᵢ - xⱼ)<sup>T</sup>M(xᵢ - xⱼ)
              </p>
              <p className="text-xs text-gray-100 text-center mt-2">
                其中 M 是半正定矩阵。当M = I（单位矩阵）时退化为欧氏距离。
              </p>
            </div>

            <p className="text-gray-100 text-sm mb-4">
              度量学习的目标就是学习合适的矩阵M，使得距离度量符合任务需求。
            </p>
          </InfoCard>

          <InfoCard title="典型度量学习方法">
            <div className="space-y-4">
              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-cyan font-bold mb-3">近邻成分分析（NCA）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  通过优化k-NN分类器的留一法准确率来学习线性变换矩阵。
                  使用随机近邻的概率模型，最大化正确分类的概率。
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-purple font-bold mb-3">大间隔最近邻（LMNN）</h4>
                <p className="text-gray-100 text-sm mb-2">
                  目标：使每个样本的k个同类近邻尽可能接近，同时异类样本保持足够距离（间隔）。
                </p>
                <p className="text-gray-100 text-sm">
                  同时优化两个目标：1）拉近目标近邻（target neighbors）；2）推开不同类的入侵者（imposters）。
                </p>
              </div>

              <div className="bg-ml-bg-dark rounded-lg p-4">
                <h4 className="text-ml-blue font-bold mb-3">深度度量学习</h4>
                <p className="text-gray-100 text-sm mb-2">
                  使用深度神经网络学习嵌入空间（embedding space），常用的损失函数包括：
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-100 text-sm">
                  <li><strong className="text-white">对比损失</strong>（Contrastive Loss）：成对样本</li>
                  <li><strong className="text-white">三元组损失</strong>（Triplet Loss）：锚点、正样本、负样本</li>
                  <li><strong className="text-white">N-pair Loss</strong>：同时考虑多个负样本</li>
                </ul>
              </div>
            </div>

            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-bold text-ml-yellow mb-2">💡 应用场景</h4>
              <ul className="space-y-1 text-gray-100 text-sm">
                <li>• <strong className="text-white">人脸识别</strong>：学习人脸特征空间，使同一人的不同照片距离近</li>
                <li>• <strong className="text-white">图像检索</strong>：学习语义相似度度量</li>
                <li>• <strong className="text-white">推荐系统</strong>：学习用户和物品的嵌入表示</li>
                <li>• <strong className="text-white">零样本学习</strong>：通过度量学习泛化到未见过的类别</li>
              </ul>
            </div>
          </InfoCard>

          <DemoCard
            title="度量学习可视化"
            description="展示度量学习如何改变特征空间，使得同类样本聚集、异类样本分离"
            status="开发中"
          />
        </Section>
      </main>
    </div>
  )
}
