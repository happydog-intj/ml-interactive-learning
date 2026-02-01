'use client'

import { NeuralNetworkViz } from '@/components/visualizations/NeuralNetworkViz'
import { ActivationFunctionViz } from '@/components/visualizations/ActivationFunctionViz'
import { BackpropagationDemo } from '@/components/visualizations/BackpropagationDemo'
import { ChapterNav } from '@/components/ui/ChapterNav'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Section } from '@/components/ui/Section'
import { InfoCard } from '@/components/ui/InfoCard'
import { DemoCard } from '@/components/ui/DemoCard'

export default function Chapter5() {
  return (
    <div className="min-h-screen bg-ml-bg-dark text-white">
      <ChapterNav
        prevChapter={{ href: '/chapter/4', title: '决策树' }}
        currentChapter={5}
        totalChapters={5}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ChapterHeader
          chapterNumber={5}
          title="神经网络"
          subtitle="Neural Networks"
          icon="🧠"
          gradient="from-ml-red via-ml-orange to-ml-yellow"
          objectives={[
            '理解人工神经元的基本模型和激活函数的作用',
            '掌握多层前馈神经网络的结构和前向传播过程',
            '深入理解反向传播算法的原理和梯度计算',
            '了解深度学习的核心概念和常见优化技术',
            '认识神经网络训练中的挑战（梯度消失、过拟合等）'
          ]}
        />

        <Section number="5.1" title="神经元模型" gradient="from-ml-red to-ml-orange">
          <InfoCard title="从生物神经元到人工神经元" icon="🔬">
            <p className="mb-4 text-white">
              人工神经网络的灵感来源于生物神经系统。生物神经元通过树突接收信号，
              在细胞体中整合处理，然后通过轴突传递给其他神经元。
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-red/30">
                <h4 className="font-bold text-ml-red mb-3">生物神经元</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>树突</strong>：接收来自其他神经元的信号</li>
                  <li>• <strong>细胞体</strong>：整合处理输入信号</li>
                  <li>• <strong>轴突</strong>：传递输出信号</li>
                  <li>• <strong>突触</strong>：神经元之间的连接</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-orange/30">
                <h4 className="font-bold text-ml-orange mb-3">人工神经元</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>输入</strong>：接收多个输入特征 x₁, x₂, ..., xₙ</li>
                  <li>• <strong>权重</strong>：每个输入对应一个权重 w₁, w₂, ..., wₙ</li>
                  <li>• <strong>求和</strong>：计算加权和 z = Σwᵢxᵢ + b</li>
                  <li>• <strong>激活</strong>：通过激活函数输出 a = f(z)</li>
                </ul>
              </div>
            </div>
            <div className="bg-ml-red/10 border border-ml-red/30 rounded-xl p-5">
              <h4 className="font-bold text-white mb-3">数学表达式</h4>
              <div className="font-mono text-lg text-white text-center space-y-2">
                <div>z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b = wᵀx + b</div>
                <div className="text-ml-red text-2xl">↓</div>
                <div>y = f(z)</div>
              </div>
              <p className="text-sm text-gray-100 mt-4">
                其中 <span className="text-ml-yellow font-bold">w</span> 是权重向量，
                <span className="text-ml-yellow font-bold">x</span> 是输入向量，
                <span className="text-ml-yellow font-bold">b</span> 是偏置项，
                <span className="text-ml-yellow font-bold">f</span> 是激活函数。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="感知机：最简单的神经网络" icon="⚡" variant="warning">
            <p className="mb-4 text-white">
              感知机（Perceptron）是最早的神经网络模型之一，由 Frank Rosenblatt 在 1957 年提出。
              它使用阶跃函数作为激活函数，可以解决线性可分问题。
            </p>
            <div className="bg-ml-bg-dark rounded-xl p-6 mb-4">
              <div className="text-center font-mono text-white">
                <div className="text-lg mb-3">感知机激活函数</div>
                <div className="text-2xl">
                  f(z) = {'{'}
                  <span className="inline-block mx-4">
                    <div>1, 如果 z ≥ 0</div>
                    <div>0, 如果 z &lt; 0</div>
                  </span>
                  {'}'}
                </div>
              </div>
            </div>
            <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
              <p className="text-sm text-white">
                <strong className="text-ml-yellow">局限性：</strong> 感知机只能解决线性可分问题，
                无法解决异或（XOR）等非线性问题。这一局限性直到多层神经网络和反向传播算法的出现才得以解决。
              </p>
            </div>
          </InfoCard>

          <InfoCard title="激活函数的作用" icon="📊" variant="accent">
            <p className="mb-4 text-white">
              激活函数是神经网络中的关键组件，它引入非线性变换，使得神经网络能够学习复杂的非线性关系。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-xl">
                <h4 className="font-bold text-ml-purple mb-2">为什么需要非线性？</h4>
                <p className="text-sm text-white">
                  如果没有激活函数（或使用线性激活函数），无论网络有多少层，
                  整个网络仍然等价于一个单层线性模型，无法学习复杂模式。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-xl">
                <h4 className="font-bold text-ml-blue mb-2">激活函数的特性</h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• <strong>非线性</strong>：能够拟合复杂函数</li>
                  <li>• <strong>可导性</strong>：支持梯度下降优化</li>
                  <li>• <strong>计算效率</strong>：影响训练速度</li>
                  <li>• <strong>梯度特性</strong>：影响训练稳定性</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="激活函数对比"
            description="比较常见激活函数的特性、优缺点和适用场景。拖动鼠标选择不同的激活函数，观察它们的图像和导数。"
            icon="📈"
            gradient="from-ml-red to-ml-orange"
          >
            <ActivationFunctionViz />
          </DemoCard>
        </Section>

        <Section number="5.2" title="多层前馈神经网络" gradient="from-ml-orange to-ml-yellow">
          <InfoCard title="网络结构" icon="🏗️">
            <p className="mb-4 text-white">
              多层前馈神经网络（Multilayer Feedforward Neural Network）也称为多层感知机（MLP），
              是最基础的深度学习模型。信息从输入层经过一层或多层隐藏层，最终到达输出层。
            </p>
            <div className="space-y-4">
              <div className="bg-ml-bg-dark p-5 rounded-xl border-l-4 border-ml-cyan">
                <h4 className="font-bold text-ml-cyan mb-2">输入层 (Input Layer)</h4>
                <p className="text-sm text-white">
                  接收原始特征数据。节点数等于特征维度。例如，28×28 的图像展平后有 784 个输入节点。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-5 rounded-xl border-l-4 border-ml-purple">
                <h4 className="font-bold text-ml-purple mb-2">隐藏层 (Hidden Layers)</h4>
                <p className="text-sm text-white">
                  提取和转换特征表示。每层通过非线性变换学习更抽象的特征。
                  层数越多（越"深"），理论上能学习的特征越复杂。
                </p>
              </div>
              <div className="bg-ml-bg-dark p-5 rounded-xl border-l-4 border-ml-orange">
                <h4 className="font-bold text-ml-orange mb-2">输出层 (Output Layer)</h4>
                <p className="text-sm text-white">
                  产生最终预测。分类任务通常使用 Softmax 激活，回归任务使用线性激活。
                  节点数等于类别数（分类）或输出维度（回归）。
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="前向传播过程" icon="➡️" variant="accent">
            <p className="mb-4 text-white">
              前向传播（Forward Propagation）是神经网络计算输出的过程。
              给定输入 x，逐层计算激活值，最终得到预测结果 ŷ。
            </p>
            <div className="bg-ml-bg-dark rounded-xl p-6 space-y-4">
              <div>
                <h4 className="font-bold text-ml-yellow mb-2">第 l 层的计算</h4>
                <div className="font-mono text-white space-y-2">
                  <div className="bg-ml-bg-secondary p-3 rounded">
                    <strong className="text-ml-cyan">线性变换：</strong>
                    <span className="ml-3">z⁽ˡ⁾ = W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾</span>
                  </div>
                  <div className="bg-ml-bg-secondary p-3 rounded">
                    <strong className="text-ml-purple">激活函数：</strong>
                    <span className="ml-3">a⁽ˡ⁾ = f(z⁽ˡ⁾)</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <div className="text-center p-3 bg-ml-bg-secondary rounded">
                  <div className="text-sm text-gray-100 mb-1">W⁽ˡ⁾</div>
                  <div className="text-xs text-white">权重矩阵</div>
                </div>
                <div className="text-center p-3 bg-ml-bg-secondary rounded">
                  <div className="text-sm text-gray-100 mb-1">b⁽ˡ⁾</div>
                  <div className="text-xs text-white">偏置向量</div>
                </div>
                <div className="text-center p-3 bg-ml-bg-secondary rounded">
                  <div className="text-sm text-gray-100 mb-1">a⁽ˡ⁾</div>
                  <div className="text-xs text-white">激活值</div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="万能逼近定理" icon="🌟" variant="success">
            <p className="mb-4 text-white">
              <strong className="text-ml-green">Universal Approximation Theorem：</strong>
              一个包含至少一个隐藏层的前馈神经网络，在激活函数满足一定条件下（如 Sigmoid），
              可以以任意精度逼近任何连续函数。
            </p>
            <div className="bg-ml-green/10 border border-ml-green/30 rounded-xl p-5">
              <h4 className="font-bold text-white mb-3">理论意义与实践考虑</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ml-green font-semibold mb-2">理论保证</p>
                  <ul className="text-white space-y-1">
                    <li>• 神经网络具有强大的表达能力</li>
                    <li>• 理论上可以学习任意复杂函数</li>
                    <li>• 为深度学习提供理论基础</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ml-yellow font-semibold mb-2">实践挑战</p>
                  <ul className="text-white space-y-1">
                    <li>• 需要足够的训练数据</li>
                    <li>• 可能需要大量神经元</li>
                    <li>• 训练算法未必能找到最优解</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="交互式神经网络结构"
            description="调整网络的层数和每层的节点数，观察网络结构的变化。查看总参数数量和连接数，理解网络复杂度。"
            icon="🎛️"
            gradient="from-ml-orange to-ml-yellow"
          >
            <NeuralNetworkViz />
          </DemoCard>
        </Section>

        <Section number="5.3" title="反向传播算法" gradient="from-ml-yellow via-ml-orange to-ml-red">
          <InfoCard title="反向传播：神经网络训练的核心" icon="🔄">
            <p className="mb-4 text-white">
              反向传播算法（Backpropagation, BP）是训练神经网络的标准方法，
              由 Rumelhart、Hinton 和 Williams 在 1986 年推广。
              它基于<strong className="text-ml-yellow">链式法则</strong>高效计算损失函数对所有参数的梯度。
            </p>
            <div className="bg-ml-bg-dark rounded-xl p-6 mb-4">
              <h4 className="font-bold text-ml-orange mb-3">核心思想</h4>
              <ol className="space-y-3 text-white">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-ml-red rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong>前向传播</strong>：计算网络输出和损失值
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-ml-orange rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong>反向传播</strong>：从输出层开始，利用链式法则反向计算每层的梯度
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-ml-yellow rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong>参数更新</strong>：使用梯度下降法更新权重和偏置
                  </div>
                </li>
              </ol>
            </div>
          </InfoCard>

          <InfoCard title="链式法则与梯度计算" icon="🔗" variant="accent">
            <p className="mb-4 text-white">
              链式法则是微积分中的基本定理，它是反向传播算法的数学基础。
            </p>
            <div className="bg-ml-bg-dark rounded-xl p-6 space-y-6">
              <div>
                <h4 className="font-bold text-ml-purple mb-3">链式法则</h4>
                <div className="font-mono text-white text-lg bg-ml-bg-secondary p-4 rounded text-center">
                  ∂L/∂w⁽ˡ⁾ = (∂L/∂z⁽ˡ⁾) · (∂z⁽ˡ⁾/∂w⁽ˡ⁾)
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ml-orange mb-3">输出层梯度</h4>
                <div className="font-mono text-white bg-ml-bg-secondary p-4 rounded space-y-2">
                  <div>δ⁽ᴸ⁾ = ∂L/∂z⁽ᴸ⁾ = (∂L/∂a⁽ᴸ⁾) ⊙ f'(z⁽ᴸ⁾)</div>
                  <p className="text-xs text-gray-100 mt-2">
                    ⊙ 表示逐元素乘法（Hadamard product）
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ml-red mb-3">隐藏层梯度（反向递推）</h4>
                <div className="font-mono text-white bg-ml-bg-secondary p-4 rounded">
                  δ⁽ˡ⁾ = [(W⁽ˡ⁺¹⁾)ᵀδ⁽ˡ⁺¹⁾] ⊙ f'(z⁽ˡ⁾)
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ml-yellow mb-3">权重和偏置的梯度</h4>
                <div className="font-mono text-white bg-ml-bg-secondary p-4 rounded space-y-2">
                  <div>∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾(a⁽ˡ⁻¹⁾)ᵀ</div>
                  <div>∂L/∂b⁽ˡ⁾ = δ⁽ˡ⁾</div>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="权重更新规则" icon="⚙️" variant="warning">
            <p className="mb-4 text-white">
              计算出梯度后，使用梯度下降法更新参数：
            </p>
            <div className="bg-ml-bg-dark rounded-xl p-6">
              <div className="font-mono text-xl text-white text-center mb-6 space-y-3">
                <div className="bg-ml-bg-secondary p-4 rounded">
                  W⁽ˡ⁾ ← W⁽ˡ⁾ - η · (∂L/∂W⁽ˡ⁾)
                </div>
                <div className="bg-ml-bg-secondary p-4 rounded">
                  b⁽ˡ⁾ ← b⁽ˡ⁾ - η · (∂L/∂b⁽ˡ⁾)
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-100">
                  其中 <span className="text-ml-yellow font-bold">η</span> 是学习率（learning rate），
                  控制每次更新的步长大小。
                </p>
              </div>
            </div>
          </InfoCard>

          <DemoCard
            title="反向传播算法演示"
            description="观看完整的前向传播、反向传播和权重更新过程。查看每个连接的权重和梯度变化。"
            icon="🎬"
            gradient="from-ml-yellow via-ml-orange to-ml-red"
          >
            <BackpropagationDemo />
          </DemoCard>
        </Section>

        <Section number="5.4" title="深度学习" gradient="from-ml-red via-ml-purple to-ml-blue">
          <InfoCard title="什么是深度学习？" icon="🌊">
            <p className="mb-4 text-white">
              深度学习（Deep Learning）是机器学习的一个分支，特指使用多层神经网络进行学习的方法。
              "深度"指的是网络的层数较多（通常 &gt; 2 层隐藏层）。
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-red/30">
                <h4 className="font-bold text-ml-red mb-3">深度网络的优势</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>层次化特征学习</strong>：从低层到高层自动学习特征表示</li>
                  <li>• <strong>端到端学习</strong>：无需手工设计特征工程</li>
                  <li>• <strong>表达能力强</strong>：能够学习极其复杂的函数映射</li>
                  <li>• <strong>泛化性能好</strong>：在大规模数据上表现优异</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-purple/30">
                <h4 className="font-bold text-ml-purple mb-3">典型应用领域</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>计算机视觉</strong>：图像分类、目标检测、语义分割</li>
                  <li>• <strong>自然语言处理</strong>：机器翻译、文本生成、问答系统</li>
                  <li>• <strong>语音识别</strong>：语音转文字、语音合成</li>
                  <li>• <strong>推荐系统</strong>：个性化推荐、用户画像</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="训练深度网络的挑战" icon="⚠️" variant="warning">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-ml-red text-lg mb-3 flex items-center gap-2">
                  <span>1.</span> 梯度消失与梯度爆炸
                </h4>
                <p className="text-white mb-3">
                  在深层网络中，梯度在反向传播过程中可能会变得极小（消失）或极大（爆炸），
                  导致网络难以训练。
                </p>
                <div className="bg-ml-bg-dark rounded-xl p-4">
                  <p className="text-sm text-white mb-2"><strong className="text-ml-yellow">原因：</strong></p>
                  <ul className="text-sm text-gray-100 space-y-1 mb-3">
                    <li>• Sigmoid/Tanh 等激活函数的饱和区梯度接近 0</li>
                    <li>• 权重初始化不当</li>
                    <li>• 网络层数过深</li>
                  </ul>
                  <p className="text-sm text-white mb-2"><strong className="text-ml-green">解决方案：</strong></p>
                  <ul className="text-sm text-gray-100 space-y-1">
                    <li>• 使用 ReLU 等激活函数</li>
                    <li>• 批归一化（Batch Normalization）</li>
                    <li>• 残差连接（Residual Connections）</li>
                    <li>• 合理的权重初始化（Xavier、He 初始化）</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ml-orange text-lg mb-3 flex items-center gap-2">
                  <span>2.</span> 过拟合问题
                </h4>
                <p className="text-white mb-3">
                  深度网络参数众多，容易在训练集上过拟合，泛化性能差。
                </p>
                <div className="bg-ml-bg-dark rounded-xl p-4">
                  <p className="text-sm text-white mb-2"><strong className="text-ml-green">正则化技术：</strong></p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-ml-bg-secondary p-3 rounded">
                      <p className="font-bold text-ml-cyan mb-1">Dropout</p>
                      <p className="text-xs text-gray-100">训练时随机丢弃部分神经元</p>
                    </div>
                    <div className="bg-ml-bg-secondary p-3 rounded">
                      <p className="font-bold text-ml-blue mb-1">L2 正则化</p>
                      <p className="text-xs text-gray-100">在损失函数中添加权重惩罚项</p>
                    </div>
                    <div className="bg-ml-bg-secondary p-3 rounded">
                      <p className="font-bold text-ml-purple mb-1">数据增强</p>
                      <p className="text-xs text-gray-100">通过变换扩充训练数据</p>
                    </div>
                    <div className="bg-ml-bg-secondary p-3 rounded">
                      <p className="font-bold text-ml-green mb-1">早停法</p>
                      <p className="text-xs text-gray-100">监控验证集性能，及时停止训练</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ml-yellow text-lg mb-3 flex items-center gap-2">
                  <span>3.</span> 计算资源需求
                </h4>
                <p className="text-white mb-3">
                  深度网络训练需要大量计算资源和时间。
                </p>
                <div className="bg-ml-bg-dark rounded-xl p-4">
                  <ul className="text-sm text-gray-100 space-y-2">
                    <li>• <strong className="text-white">GPU 加速</strong>：利用 GPU 并行计算能力</li>
                    <li>• <strong className="text-white">分布式训练</strong>：使用多机多卡训练大模型</li>
                    <li>• <strong className="text-white">混合精度训练</strong>：使用 FP16 减少显存占用</li>
                    <li>• <strong className="text-white">模型压缩</strong>：剪枝、量化、知识蒸馏</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="现代优化技术" icon="🚀" variant="accent">
            <p className="mb-4 text-white">
              除了基本的梯度下降，现代深度学习使用了许多优化技术来加速训练和提高性能。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-blue/30">
                <h4 className="font-bold text-ml-blue mb-3">优化算法</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>SGD with Momentum</strong>：累积历史梯度信息</li>
                  <li>• <strong>Adam</strong>：自适应学习率，最常用的优化器</li>
                  <li>• <strong>AdaGrad / RMSProp</strong>：调整每个参数的学习率</li>
                  <li>• <strong>学习率调度</strong>：动态调整学习率</li>
                </ul>
              </div>
              <div className="bg-ml-bg-dark p-5 rounded-xl border border-ml-cyan/30">
                <h4 className="font-bold text-ml-cyan mb-3">归一化技术</h4>
                <ul className="space-y-2 text-sm text-white">
                  <li>• <strong>Batch Normalization</strong>：归一化每层的输入</li>
                  <li>• <strong>Layer Normalization</strong>：适用于序列模型</li>
                  <li>• <strong>Group Normalization</strong>：介于 BN 和 LN 之间</li>
                  <li>• <strong>Instance Normalization</strong>：用于风格迁移</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="深度学习框架" icon="🛠️" variant="success">
            <p className="mb-4 text-white">
              现代深度学习框架极大地简化了神经网络的开发和训练过程。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-ml-bg-dark p-4 rounded-xl text-center border border-ml-orange/30 hover:border-ml-orange transition-colors">
                <div className="text-3xl mb-2">🔥</div>
                <div className="font-bold text-ml-orange">PyTorch</div>
                <div className="text-xs text-gray-100 mt-1">动态图，易于调试</div>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-xl text-center border border-ml-blue/30 hover:border-ml-blue transition-colors">
                <div className="text-3xl mb-2">🧮</div>
                <div className="font-bold text-ml-blue">TensorFlow</div>
                <div className="text-xs text-gray-100 mt-1">Google，生产部署</div>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-xl text-center border border-ml-red/30 hover:border-ml-red transition-colors">
                <div className="text-3xl mb-2">🌸</div>
                <div className="font-bold text-ml-red">Keras</div>
                <div className="text-xs text-gray-100 mt-1">高级 API，易用</div>
              </div>
              <div className="bg-ml-bg-dark p-4 rounded-xl text-center border border-ml-green/30 hover:border-ml-green transition-colors">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold text-ml-green">JAX</div>
                <div className="text-xs text-gray-100 mt-1">自动微分，高性能</div>
              </div>
            </div>
          </InfoCard>
        </Section>

        <Section number="5.5" title="实践指南" gradient="from-ml-blue via-ml-purple to-ml-cyan">
          <InfoCard title="构建神经网络的步骤" icon="📋" variant="accent">
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: '数据准备',
                  color: 'cyan',
                  items: ['收集和清洗数据', '划分训练集、验证集、测试集', '数据归一化和标准化', '数据增强（可选）']
                },
                {
                  step: '2',
                  title: '网络设计',
                  color: 'blue',
                  items: ['确定网络层数和每层神经元数量', '选择激活函数', '设计输出层（分类用 Softmax，回归用线性）', '考虑加入 Dropout、BN 等正则化层']
                },
                {
                  step: '3',
                  title: '训练配置',
                  color: 'purple',
                  items: ['选择损失函数（交叉熵、MSE 等）', '选择优化器（Adam、SGD 等）', '设置学习率和批次大小', '配置学习率调度策略']
                },
                {
                  step: '4',
                  title: '训练与调试',
                  color: 'orange',
                  items: ['监控训练和验证损失', '绘制学习曲线', '调整超参数', '使用早停法防止过拟合']
                },
                {
                  step: '5',
                  title: '评估与部署',
                  color: 'green',
                  items: ['在测试集上评估最终性能', '分析错误案例', '模型优化和压缩', '部署到生产环境']
                }
              ].map((phase, idx) => (
                <div key={idx} className={`bg-ml-bg-dark p-5 rounded-xl border-l-4 border-ml-${phase.color}`}>
                  <h4 className={`font-bold text-ml-${phase.color} mb-3 text-lg`}>
                    第 {phase.step} 步：{phase.title}
                  </h4>
                  <ul className="space-y-1.5 text-sm text-white">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`text-ml-${phase.color} mt-0.5`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="常见问题诊断" icon="🔍" variant="warning">
            <div className="space-y-4">
              <div className="bg-ml-bg-dark p-5 rounded-xl">
                <h4 className="font-bold text-ml-red mb-2">问题：训练损失不下降</h4>
                <p className="text-sm text-white mb-2">可能原因：</p>
                <ul className="text-sm text-gray-100 space-y-1 ml-4">
                  <li>• 学习率过大或过小</li>
                  <li>• 权重初始化不当</li>
                  <li>• 梯度消失或爆炸</li>
                  <li>• 数据未归一化</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-xl">
                <h4 className="font-bold text-ml-yellow mb-2">问题：训练集准确率高，测试集准确率低</h4>
                <p className="text-sm text-white mb-2">诊断：过拟合</p>
                <ul className="text-sm text-gray-100 space-y-1 ml-4">
                  <li>• 添加 Dropout 或 L2 正则化</li>
                  <li>• 使用数据增强</li>
                  <li>• 收集更多训练数据</li>
                  <li>• 简化模型（减少参数）</li>
                </ul>
              </div>

              <div className="bg-ml-bg-dark p-5 rounded-xl">
                <h4 className="font-bold text-ml-blue mb-2">问题：训练和测试准确率都很低</h4>
                <p className="text-sm text-white mb-2">诊断：欠拟合</p>
                <ul className="text-sm text-gray-100 space-y-1 ml-4">
                  <li>• 增加网络容量（更多层或神经元）</li>
                  <li>• 训练更多轮次</li>
                  <li>• 减少正则化强度</li>
                  <li>• 检查特征工程是否充分</li>
                </ul>
              </div>
            </div>
          </InfoCard>
        </Section>

        <InfoCard title="本章小结" icon="📝" variant="success">
          <div className="space-y-3 text-white">
            <p>✓ 人工神经元模拟生物神经元，通过加权求和和激活函数产生输出</p>
            <p>✓ 激活函数引入非线性，使神经网络能够学习复杂函数（Sigmoid、ReLU、Tanh 等）</p>
            <p>✓ 多层前馈神经网络由输入层、隐藏层和输出层组成，具有万能逼近能力</p>
            <p>✓ 反向传播算法基于链式法则，高效计算所有参数的梯度</p>
            <p>✓ 深度学习通过多层网络实现层次化特征学习，在许多任务上表现优异</p>
            <p>✓ 训练深度网络面临梯度消失/爆炸、过拟合等挑战，需要使用正则化和优化技术</p>
            <p>✓ 现代深度学习框架（PyTorch、TensorFlow 等）极大简化了神经网络的开发</p>
          </div>
        </InfoCard>

        <InfoCard title="扩展阅读" icon="📚" variant="accent">
          <div className="space-y-4 text-white">
            <div>
              <h4 className="font-bold text-ml-cyan mb-2">经典论文</h4>
              <ul className="space-y-2 text-sm">
                <li>• Rumelhart et al. (1986): "Learning representations by back-propagating errors"</li>
                <li>• LeCun et al. (1998): "Gradient-based learning applied to document recognition"</li>
                <li>• Hinton et al. (2012): "ImageNet Classification with Deep Convolutional Neural Networks"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ml-purple mb-2">推荐资源</h4>
              <ul className="space-y-2 text-sm">
                <li>• 课程：Andrew Ng 的深度学习专项课程（Coursera）</li>
                <li>• 书籍：《深度学习》（Goodfellow, Bengio, Courville）</li>
                <li>• 网站：distill.pub（可视化深度学习概念）</li>
              </ul>
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  )
}
