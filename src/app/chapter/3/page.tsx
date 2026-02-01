import Link from 'next/link'
import { LinearRegressionDemo } from '@/components/visualizations/LinearRegressionDemo'
import { GradientDescentViz } from '@/components/visualizations/GradientDescentViz'
import { LogisticRegressionDemo } from '@/components/visualizations/LogisticRegressionDemo'

export default function Chapter3() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      {/* 顶部导航栏 */}
      <nav className="bg-ml-bg-secondary border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/chapter/2"
              className="text-white hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-xl">←</span>
              <span>上一章</span>
            </Link>
            <Link
              href="/"
              className="text-ml-blue hover:text-ml-blue/80 transition-colors"
            >
              返回主页
            </Link>
            <Link
              href="/chapter/4"
              className="text-white hover:text-white transition-colors flex items-center gap-2"
            >
              <span>下一章</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 章节标题 */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-ml-blue/20 text-ml-blue rounded-full text-sm font-semibold">
              第 3 章
            </span>
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-semibold">
              ✓ 已完成
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-ml-blue to-purple-400 bg-clip-text text-transparent">
            线性模型
          </h1>
          <p className="text-xl text-white leading-relaxed">
            线性模型是机器学习中最基础也最重要的模型之一。本章将介绍线性回归、逻辑回归，
            以及核心的优化算法——梯度下降。
          </p>
        </header>

        {/* 学习目标 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-ml-blue/10 to-purple-600/10 border-l-4 border-ml-blue p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-ml-blue">📚 学习目标</h2>
            <ul className="space-y-3 text-white">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>理解线性回归的数学原理和最小二乘法</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>掌握梯度下降算法的工作机制和参数调优</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>理解逻辑回归和Sigmoid函数在分类问题中的应用</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>认识正则化（L1/L2）对模型复杂度的控制作用</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>掌握损失函数的概念及其在模型训练中的核心地位</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3.1 线性回归 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            3.1 线性回归 (Linear Regression)
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">什么是线性回归？</h3>
            <p className="text-white leading-relaxed mb-4">
              线性回归试图学习一个线性函数来拟合数据，是最简单但也最常用的回归模型。
              给定数据集 D，线性回归试图学到一个函数来映射输入和输出的关系：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded text-center my-4">
              <p className="text-2xl text-ml-blue font-mono">
                f(x) = wx + b
              </p>
            </div>
            <p className="text-white leading-relaxed">
              其中 <strong className="text-ml-yellow">w</strong> 是权重（斜率），
              <strong className="text-ml-yellow">b</strong> 是偏置（截距）。
              我们的目标是找到最优的 w 和 b，使得预测值 f(x) 尽可能接近真实值 y。
            </p>
          </div>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">均方误差损失 (MSE Loss)</h3>
            <p className="text-white leading-relaxed mb-4">
              我们使用均方误差（Mean Squared Error）来衡量模型的好坏：
            </p>
            <div className="bg-ml-bg-dark p-4 rounded text-center my-4">
              <p className="text-xl text-ml-blue font-mono">
                L(w, b) = (1/n) Σ (yᵢ - f(xᵢ))²
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-green-400 mb-2">✓ 为什么用平方？</h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• 确保误差总是正数</li>
                  <li>• 惩罚大的误差更严重</li>
                  <li>• 数学性质良好，易于求导</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-yellow-400 mb-2">⚡ 最小二乘法</h4>
                <p className="text-sm text-white">
                  通过令损失函数的导数为0，可以直接求出解析解（闭式解）。
                </p>
              </div>
            </div>
          </div>

          {/* 线性回归交互演示 */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-white">🎮 交互式演示</h3>
            <p className="text-white mb-4">
              手动调整参数观察拟合效果，或点击"梯度下降训练"观看算法自动寻找最优解。
              红色线段表示预测误差（残差），损失函数就是所有残差平方的平均值。
            </p>
          </div>
          <LinearRegressionDemo />
        </section>

        {/* 3.2 梯度下降 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            3.2 梯度下降 (Gradient Descent)
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">优化的艺术</h3>
            <p className="text-white leading-relaxed mb-4">
              梯度下降是机器学习中最重要的优化算法。它的核心思想非常直观：
              <strong className="text-ml-blue">沿着函数下降最快的方向（负梯度方向）移动</strong>，
              逐步逼近最优解。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h4 className="font-semibold text-ml-yellow mb-4 text-center">更新规则</h4>
              <div className="text-center text-xl text-white font-mono mb-4">
                θ ← θ - α · ∂L/∂θ
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-ml-blue font-bold mb-1">θ (theta)</p>
                  <p className="text-white">待优化的参数</p>
                </div>
                <div className="text-center">
                  <p className="text-ml-yellow font-bold mb-1">α (alpha)</p>
                  <p className="text-white">学习率（步长）</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold mb-1">∂L/∂θ</p>
                  <p className="text-white">损失函数的梯度</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-green-500">
                <h4 className="font-bold text-green-400 mb-2">✓ 梯度下降的优势</h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• 适用于高维问题</li>
                  <li>• 不需要矩阵求逆</li>
                  <li>• 可处理大规模数据</li>
                  <li>• 容易并行化</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-400 mb-2">⚠️ 学习率的选择</h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• 太小：收敛缓慢</li>
                  <li>• 太大：可能震荡或发散</li>
                  <li>• 建议：从小开始逐步调整</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 梯度下降可视化 */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-white">🎮 梯度下降可视化</h3>
            <p className="text-white mb-4">
              调整学习率和初始位置，观察优化过程。红色虚线表示当前的梯度方向（损失函数的切线），
              紫色路径显示参数的更新轨迹。
            </p>
          </div>
          <GradientDescentViz />
        </section>

        {/* 3.3 逻辑回归 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            3.3 逻辑回归 (Logistic Regression)
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">从回归到分类</h3>
            <p className="text-white leading-relaxed mb-4">
              尽管名字里有"回归"，但逻辑回归实际上是一个<strong className="text-ml-yellow">分类算法</strong>。
              它通过 Sigmoid 函数将线性模型的输出映射到 (0, 1) 区间，表示样本属于正类的概率。
            </p>

            <div className="bg-ml-bg-dark p-6 rounded-lg my-6">
              <h4 className="font-semibold text-ml-yellow mb-4 text-center">Sigmoid 函数</h4>
              <div className="text-center text-2xl text-white font-mono mb-4">
                σ(z) = 1 / (1 + e⁻ᶻ)
              </div>
              <p className="text-center text-white text-sm mb-4">
                其中 z = w₁·x₁ + w₂·x₂ + ... + b（线性组合）
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-ml-bg-secondary p-3 rounded text-center">
                  <p className="text-green-400 font-bold">z → +∞</p>
                  <p className="text-white text-sm">σ(z) → 1</p>
                </div>
                <div className="bg-ml-bg-secondary p-3 rounded text-center">
                  <p className="text-ml-blue font-bold">z = 0</p>
                  <p className="text-white text-sm">σ(z) = 0.5</p>
                </div>
                <div className="bg-ml-bg-secondary p-3 rounded text-center">
                  <p className="text-red-400 font-bold">z → -∞</p>
                  <p className="text-white text-sm">σ(z) → 0</p>
                </div>
              </div>
            </div>

            <div className="bg-ml-bg-dark p-4 rounded">
              <h4 className="font-semibold text-white mb-3">决策边界</h4>
              <p className="text-white text-sm leading-relaxed">
                当 σ(z) = 0.5 时，即 z = 0，这就是决策边界。
                对于二维特征空间，决策边界是一条直线：<span className="text-ml-blue font-mono">w₁·x₁ + w₂·x₂ + b = 0</span>。
                这条线将空间划分为两个区域，分别对应两个类别。
              </p>
            </div>
          </div>

          {/* 逻辑回归演示 */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-white">🎮 交互式演示</h3>
            <p className="text-white mb-4">
              调整权重和偏置参数，观察决策边界如何移动。背景颜色表示分类概率：
              蓝色表示倾向于正类，红色表示倾向于负类。白色虚线是 P=0.5 的决策边界。
            </p>
          </div>
          <LogisticRegressionDemo />
        </section>

        {/* 3.4 正则化 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-ml-blue border-b-2 border-ml-blue/30 pb-2">
            3.4 正则化 (Regularization)
          </h2>

          <div className="bg-ml-bg-secondary p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 text-white">防止过拟合的利器</h3>
            <p className="text-white leading-relaxed mb-4">
              正则化通过在损失函数中添加惩罚项来限制模型复杂度，防止过拟合。
              两种最常用的正则化方法是 L1 和 L2 正则化。
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-ml-bg-dark p-5 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-400 mb-3 text-lg">L2 正则化（Ridge）</h4>
                <div className="text-center my-3 text-lg text-white font-mono">
                  L = L₀ + λ·Σwᵢ²
                </div>
                <ul className="text-sm text-white space-y-2">
                  <li>✓ 惩罚权重的平方和</li>
                  <li>✓ 倾向于产生小但非零的权重</li>
                  <li>✓ 适合特征之间相关性高的情况</li>
                  <li>✓ 解析解存在（可直接求解）</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-400 mb-3 text-lg">L1 正则化（Lasso）</h4>
                <div className="text-center my-3 text-lg text-white font-mono">
                  L = L₀ + λ·Σ|wᵢ|
                </div>
                <ul className="text-sm text-white space-y-2">
                  <li>✓ 惩罚权重的绝对值和</li>
                  <li>✓ 倾向于产生稀疏解（很多权重为0）</li>
                  <li>✓ 可用于特征选择</li>
                  <li>✓ 更具解释性</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 p-4 rounded-lg">
              <p className="text-sm text-white">
                <strong className="text-yellow-400">λ (lambda)</strong> 是正则化系数，控制正则化的强度：
              </p>
              <ul className="text-sm text-white mt-2 space-y-1 ml-4">
                <li>• λ = 0：无正则化，可能过拟合</li>
                <li>• λ 太大：欠拟合，模型过于简单</li>
                <li>• λ 适中：在偏差和方差之间取得平衡</li>
              </ul>
            </div>
          </div>

          <div className="bg-ml-bg-secondary p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">L1 vs L2：几何直观</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-blue-400 mb-2">L2: 圆形约束</h4>
                <p className="text-sm text-white">
                  在参数空间中，L2 正则化的约束区域是一个圆（或高维的球）。
                  损失函数等高线与圆的切点通常不在坐标轴上，所以权重不会变成 0。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded">
                <h4 className="font-semibold text-purple-400 mb-2">L1: 菱形约束</h4>
                <p className="text-sm text-white">
                  L1 正则化的约束区域是菱形（或高维的超菱形）。
                  等高线更容易在菱形的顶点（坐标轴）处相交，导致某些权重精确为 0。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 本章小结 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-ml-blue/20 to-purple-600/20 border-2 border-ml-blue/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-ml-blue">📝 本章小结</h2>
            <div className="space-y-3 text-white">
              <p>✓ 线性回归通过最小化均方误差学习线性函数，可用解析解或梯度下降求解</p>
              <p>✓ 梯度下降是核心的优化算法，沿负梯度方向迭代更新参数</p>
              <p>✓ 学习率是关键超参数，需要仔细调整以平衡收敛速度和稳定性</p>
              <p>✓ 逻辑回归使用 Sigmoid 函数将线性输出映射为概率，用于二分类问题</p>
              <p>✓ 正则化（L1/L2）通过惩罚项控制模型复杂度，防止过拟合</p>
              <p>✓ L1 倾向于稀疏解（特征选择），L2 倾向于权重衰减</p>
            </div>
          </div>
        </section>

        {/* 章节导航 */}
        <nav className="border-t-2 border-gray-700 pt-8">
          <div className="flex justify-between items-center">
            <Link
              href="/chapter/2"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl">←</span>
              <div>
                <p className="text-xs text-white">上一章</p>
                <p className="font-semibold">模型评估与选择</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-ml-bg-secondary hover:bg-gray-700 rounded-lg transition-colors"
            >
              返回主页
            </Link>
            <Link
              href="/chapter/4"
              className="px-6 py-3 bg-ml-blue hover:bg-ml-blue/80 rounded-lg transition-colors flex items-center gap-2"
            >
              <div className="text-right">
                <p className="text-xs text-white">下一章</p>
                <p className="font-semibold">决策树</p>
              </div>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
