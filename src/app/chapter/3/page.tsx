'use client'
import { LinearRegressionDemo } from '@/components/visualizations/LinearRegressionDemo'
import { GradientDescentViz } from '@/components/visualizations/GradientDescentViz'
import { LogisticRegressionDemo } from '@/components/visualizations/LogisticRegressionDemo'
import { LossSurface3D } from '@/components/visualizations/LossSurface3D'
import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter3() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/2', title: '模型评估与选择' }}
        nextChapter={{ href: '/chapter/4', title: '决策树' }}
        currentChapter={3}
        totalChapters={5}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={3}
          title="线性模型"
          subtitle="Linear Models"
          icon="📈"
          gradient="from-ml-green via-ml-cyan to-ml-blue"
          objectives={[
            '理解线性回归的数学原理和最小二乘法',
            '掌握梯度下降算法的工作机制和参数调优',
            '理解逻辑回归和Sigmoid函数在分类问题中的应用',
            '认识正则化（L1/L2）对模型复杂度的控制作用',
            '掌握损失函数的概念及其在模型训练中的核心地位'
          ]}
        />

        {/* 3.1 线性回归 */}
        <Section number="3.1" title="线性回归 (Linear Regression)" gradient="from-ml-green to-ml-cyan">
          <InfoCard title="什么是线性回归？" icon="📊">
            <p className="mb-4">
              线性回归试图学习一个线性函数来拟合数据，是最简单但也最常用的回归模型。
              给定数据集 D，线性回归试图学到一个函数来映射输入和输出的关系：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-2xl text-ml-cyan font-mono">
                f(x) = wx + b
              </p>
            </div>
            <p>
              其中 <strong className="text-ml-yellow">w</strong> 是权重（斜率），
              <strong className="text-ml-yellow">b</strong> 是偏置（截距）。
              我们的目标是找到最优的 w 和 b，使得预测值 f(x) 尽可能接近真实值 y。
            </p>
          </InfoCard>

          <InfoCard title="均方误差损失 (MSE Loss)" icon="📐" variant="accent">
            <p className="mb-4">
              我们使用均方误差（Mean Squared Error）来衡量模型的好坏：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded-lg text-center my-4">
              <p className="text-xl text-ml-blue font-mono">
                L(w, b) = (1/n) Σ (yᵢ - f(xᵢ))²
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-green">
                <h5 className="font-semibold text-ml-green mb-2">✓ 为什么用平方？</h5>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>确保误差总是正数</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>惩罚大的误差更严重</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ml-green">•</span>
                    <span>数学性质良好，易于求导</span>
                  </li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg border-l-4 border-ml-yellow">
                <h5 className="font-semibold text-ml-yellow mb-2">⚡ 最小二乘法</h5>
                <p className="text-sm">
                  通过令损失函数的导数为0，可以直接求出解析解（闭式解）。
                </p>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="交互式演示"
            description="手动调整参数观察拟合效果，或点击 '梯度下降训练' 观看算法自动寻找最优解。红色线段表示预测误差（残差），损失函数就是所有残差平方的平均值。"
            icon="🎮"
            gradient="from-ml-green to-ml-cyan"
          >
            <LinearRegressionDemo />
          </DemoCard>
        </Section>

        {/* 3.2 梯度下降 */}
        <Section number="3.2" title="梯度下降 (Gradient Descent)" gradient="from-ml-cyan to-ml-blue">
          <InfoCard title="优化的艺术" icon="🎯">
            <p className="mb-4">
              梯度下降是机器学习中最重要的优化算法。它的核心思想非常直观：
              <strong className="text-ml-blue">沿着函数下降最快的方向（负梯度方向）移动</strong>，
              逐步逼近最优解。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center text-lg">更新规则</h5>
              <div className="text-center text-xl font-mono mb-4">
                θ ← θ - α · ∂L/∂θ
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-ml-blue font-bold mb-1">θ (theta)</p>
                  <p>待优化的参数</p>
                </div>
                <div className="text-center">
                  <p className="text-ml-yellow font-bold mb-1">α (alpha)</p>
                  <p>学习率（步长）</p>
                </div>
                <div className="text-center">
                  <p className="text-ml-red font-bold mb-1">∂L/∂θ</p>
                  <p>损失函数的梯度</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="梯度下降的优势" icon="✓" variant="success">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-ml-green">•</span>
                  <span>适用于高维问题</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green">•</span>
                  <span>不需要矩阵求逆</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green">•</span>
                  <span>可处理大规模数据</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-green">•</span>
                  <span>容易并行化</span>
                </li>
              </ul>
            </InfoCard>

            <InfoCard title="学习率的选择" icon="⚠️" variant="warning">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-ml-yellow">•</span>
                  <span><strong className="text-ml-yellow">太小</strong>：收敛缓慢</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-yellow">•</span>
                  <span><strong className="text-ml-yellow">太大</strong>：可能震荡或发散</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-yellow">•</span>
                  <span><strong className="text-ml-yellow">建议</strong>：从小开始逐步调整</span>
                </li>
              </ul>
            </InfoCard>
          </div>

          <DemoCard
            title="梯度下降可视化（2D）"
            description="调整学习率和初始位置，观察优化过程。红色虚线表示当前的梯度方向（损失函数的切线），紫色路径显示参数的更新轨迹。"
            icon="🎮"
            gradient="from-ml-cyan to-ml-blue"
          >
            <GradientDescentViz />
          </DemoCard>

          <DemoCard
            title="3D损失曲面可视化"
            description="探索不同损失函数的三维形状，观察梯度下降在3D空间中的优化轨迹。拖拽旋转视角，体验从简单凸优化到复杂地形的挑战。"
            icon="🌐"
            gradient="from-ml-blue via-ml-purple to-ml-cyan"
          >
            <LossSurface3D />
          </DemoCard>
        </Section>

        {/* 3.3 逻辑回归 */}
        <Section number="3.3" title="逻辑回归 (Logistic Regression)" gradient="from-ml-blue to-ml-purple">
          <InfoCard title="从回归到分类" icon="🔄">
            <p className="mb-4">
              尽管名字里有 "回归"，但逻辑回归实际上是一个<strong className="text-ml-yellow">分类算法</strong>。
              它通过 Sigmoid 函数将线性模型的输出映射到 (0, 1) 区间，表示样本属于正类的概率。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h5 className="font-semibold text-ml-yellow mb-4 text-center text-lg">Sigmoid 函数</h5>
              <div className="text-center text-2xl font-mono mb-4">
                σ(z) = 1 / (1 + e⁻ᶻ)
              </div>
              <p className="text-center text-sm mb-4">
                其中 z = w₁·x₁ + w₂·x₂ + ... + b（线性组合）
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-ml-bg-secondary p-3 rounded-lg text-center">
                  <p className="text-ml-green font-bold">z → +∞</p>
                  <p className="text-sm">σ(z) → 1</p>
                </div>
                <div className="bg-ml-bg-secondary p-3 rounded-lg text-center">
                  <p className="text-ml-blue font-bold">z = 0</p>
                  <p className="text-sm">σ(z) = 0.5</p>
                </div>
                <div className="bg-ml-bg-secondary p-3 rounded-lg text-center">
                  <p className="text-ml-red font-bold">z → -∞</p>
                  <p className="text-sm">σ(z) → 0</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="决策边界" icon="✂️" variant="accent">
            <p>
              当 σ(z) = 0.5 时，即 z = 0，这就是决策边界。
              对于二维特征空间，决策边界是一条直线：<span className="text-ml-cyan font-mono">w₁·x₁ + w₂·x₂ + b = 0</span>。
              这条线将空间划分为两个区域，分别对应两个类别。
            </p>
          </InfoCard>

          <DemoCard
            title="交互式演示"
            description="调整权重和偏置参数，观察决策边界如何移动。背景颜色表示分类概率：蓝色表示倾向于正类，红色表示倾向于负类。白色虚线是 P=0.5 的决策边界。"
            icon="🎮"
            gradient="from-ml-blue to-ml-purple"
          >
            <LogisticRegressionDemo />
          </DemoCard>
        </Section>

        {/* 3.4 正则化 */}
        <Section number="3.4" title="正则化 (Regularization)" gradient="from-ml-purple to-ml-blue">
          <InfoCard title="防止过拟合的利器" icon="🛡️">
            <p className="mb-4">
              正则化通过在损失函数中添加惩罚项来限制模型复杂度，防止过拟合。
              两种最常用的正则化方法是 L1 和 L2 正则化。
            </p>
          </InfoCard>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="L2 正则化（Ridge）" icon="🔵" variant="default">
              <div className="text-center my-3 text-lg font-mono">
                L = L₀ + λ·Σwᵢ²
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-ml-cyan">✓</span>
                  <span>惩罚权重的平方和</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-cyan">✓</span>
                  <span>倾向于产生小但非零的权重</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-cyan">✓</span>
                  <span>适合特征之间相关性高的情况</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-cyan">✓</span>
                  <span>解析解存在（可直接求解）</span>
                </li>
              </ul>
            </InfoCard>

            <InfoCard title="L1 正则化（Lasso）" icon="🟣" variant="accent">
              <div className="text-center my-3 text-lg font-mono">
                L = L₀ + λ·Σ|wᵢ|
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-ml-purple">✓</span>
                  <span>惩罚权重的绝对值和</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-purple">✓</span>
                  <span>倾向于产生稀疏解（很多权重为0）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-purple">✓</span>
                  <span>可用于特征选择</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ml-purple">✓</span>
                  <span>更具解释性</span>
                </li>
              </ul>
            </InfoCard>
          </div>

          <InfoCard title="正则化系数 λ (lambda)" icon="⚖️" variant="warning">
            <p className="mb-3">
              <strong className="text-ml-yellow">λ</strong> 控制正则化的强度：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">•</span>
                <span><strong className="text-ml-yellow">λ = 0</strong>：无正则化，可能过拟合</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">•</span>
                <span><strong className="text-ml-yellow">λ 太大</strong>：欠拟合，模型过于简单</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ml-yellow">•</span>
                <span><strong className="text-ml-yellow">λ 适中</strong>：在偏差和方差之间取得平衡</span>
              </li>
            </ul>
          </InfoCard>

          <InfoCard title="L1 vs L2：几何直观" icon="📐" variant="accent">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <h5 className="font-semibold text-ml-cyan mb-2">L2: 圆形约束</h5>
                <p className="text-sm">
                  在参数空间中，L2 正则化的约束区域是一个圆（或高维的球）。
                  损失函数等高线与圆的切点通常不在坐标轴上，所以权重不会变成 0。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-lg">
                <h5 className="font-semibold text-ml-purple mb-2">L1: 菱形约束</h5>
                <p className="text-sm">
                  L1 正则化的约束区域是菱形（或高维的超菱形）。
                  等高线更容易在菱形的顶点（坐标轴）处相交，导致某些权重精确为 0。
                </p>
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
                <span>线性回归通过最小化均方误差学习线性函数，可用解析解或梯度下降求解</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>梯度下降是核心的优化算法，沿负梯度方向迭代更新参数</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>学习率是关键超参数，需要仔细调整以平衡收敛速度和稳定性</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>逻辑回归使用 Sigmoid 函数将线性输出映射为概率，用于二分类问题</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>正则化（L1/L2）通过惩罚项控制模型复杂度，防止过拟合</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-ml-green">✓</span>
                <span>L1 倾向于稀疏解（特征选择），L2 倾向于权重衰减</span>
              </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}
