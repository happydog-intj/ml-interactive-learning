'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Math } from '@/components/ui/Math'

export function ROCFormulaDerivation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      paused: true,
      onUpdate: function() {
        // 根据时间轴进度更新步骤
        const progress = this.progress()
        if (progress < 0.15) setCurrentStep(0)
        else if (progress < 0.35) setCurrentStep(1)
        else if (progress < 0.55) setCurrentStep(2)
        else if (progress < 0.75) setCurrentStep(3)
        else setCurrentStep(4)
      }
    })

    // 步骤0: 标题出现
    tl.from('.derivation-title', {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.out'
    })

    // 步骤1: 混淆矩阵可视化出现
    tl.from('.confusion-visual', {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, '+=0.3')

    // 混淆矩阵的四个格子依次出现
    tl.from('.cell-tp', {
      opacity: 0,
      x: -30,
      y: -30,
      duration: 0.4
    }, '-=0.4')

    tl.from('.cell-fp', {
      opacity: 0,
      x: 30,
      y: -30,
      duration: 0.4
    }, '-=0.2')

    tl.from('.cell-fn', {
      opacity: 0,
      x: -30,
      y: 30,
      duration: 0.4
    }, '-=0.2')

    tl.from('.cell-tn', {
      opacity: 0,
      x: 30,
      y: 30,
      duration: 0.4
    }, '-=0.2')

    // 步骤2: TPR 公式分步构建
    tl.from('.tpr-label', {
      opacity: 0,
      x: -20,
      duration: 0.5
    }, '+=0.5')

    tl.from('.tpr-equals', {
      opacity: 0,
      scale: 0,
      duration: 0.3
    }, '+=0.2')

    tl.from('.tpr-numerator', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.out'
    }, '+=0.2')

    tl.from('.tpr-fraction-line', {
      scaleX: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '+=0.1')

    tl.from('.tpr-denominator', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')

    // 高亮显示TPR相关的单元格
    tl.to(['.cell-tp', '.cell-fn'], {
      borderColor: '#58C4DD',
      borderWidth: '3px',
      duration: 0.4
    }, '+=0.3')

    tl.to('.tpr-explanation', {
      opacity: 1,
      y: 0,
      duration: 0.5
    }, '-=0.2')

    // 步骤3: FPR 公式分步构建
    tl.from('.fpr-label', {
      opacity: 0,
      x: -20,
      duration: 0.5
    }, '+=0.8')

    tl.from('.fpr-equals', {
      opacity: 0,
      scale: 0,
      duration: 0.3
    }, '+=0.2')

    tl.from('.fpr-numerator', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.out'
    }, '+=0.2')

    tl.from('.fpr-fraction-line', {
      scaleX: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '+=0.1')

    tl.from('.fpr-denominator', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')

    // 取消TPR高亮，高亮FPR相关单元格
    tl.to(['.cell-tp', '.cell-fn'], {
      borderColor: '#374151',
      borderWidth: '2px',
      duration: 0.3
    }, '+=0.2')

    tl.to(['.cell-fp', '.cell-tn'], {
      borderColor: '#F59E0B',
      borderWidth: '3px',
      duration: 0.4
    }, '-=0.2')

    tl.to('.fpr-explanation', {
      opacity: 1,
      y: 0,
      duration: 0.5
    }, '-=0.2')

    // 步骤4: 关键洞察
    tl.from('.key-insight', {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'back.out(1.2)'
    }, '+=0.8')

    // 重置所有高亮
    tl.to(['.cell-tp', '.cell-fp', '.cell-fn', '.cell-tn'], {
      borderColor: '#374151',
      borderWidth: '2px',
      duration: 0.4
    }, '-=0.4')

    timelineRef.current = tl
  }, { scope: containerRef })

  const handlePlay = () => {
    if (timelineRef.current) {
      setIsAnimating(true)
      timelineRef.current.restart()
      timelineRef.current.eventCallback('onComplete', () => {
        setIsAnimating(false)
      })
    }
  }

  const handleReset = () => {
    if (timelineRef.current) {
      timelineRef.current.restart()
      timelineRef.current.pause()
      setCurrentStep(0)
      setIsAnimating(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-8 p-6 bg-ml-bg-secondary rounded-lg">
      {/* 标题 */}
      <div className="derivation-title text-center">
        <h2 className="text-2xl font-bold text-ml-blue">ROC 曲线核心指标推导</h2>
        <p className="text-gray-200 mt-2">理解 TPR 和 FPR 的数学定义</p>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePlay}
          disabled={isAnimating}
          className="px-6 py-2 bg-ml-blue hover:bg-ml-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {isAnimating ? '播放中...' : '开始演示'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          重置
        </button>
      </div>

      {/* 进度指示器 */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentStep >= step ? 'bg-ml-blue' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* 混淆矩阵可视化 */}
      <div className="confusion-visual">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-100">混淆矩阵 (Confusion Matrix)</h3>
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="cell-tp bg-green-900/20 border-2 border-gray-700 rounded-lg p-6 text-center transition-all">
              <div className="text-3xl font-bold text-green-400 mb-2">TP</div>
              <div className="text-sm text-gray-200">真正例</div>
              <div className="text-xs text-gray-500 mt-1">True Positive</div>
            </div>
            <div className="cell-fp bg-red-900/20 border-2 border-gray-700 rounded-lg p-6 text-center transition-all">
              <div className="text-3xl font-bold text-red-400 mb-2">FP</div>
              <div className="text-sm text-gray-200">假正例</div>
              <div className="text-xs text-gray-500 mt-1">False Positive</div>
            </div>
            <div className="cell-fn bg-red-900/20 border-2 border-gray-700 rounded-lg p-6 text-center transition-all">
              <div className="text-3xl font-bold text-red-400 mb-2">FN</div>
              <div className="text-sm text-gray-200">假负例</div>
              <div className="text-xs text-gray-500 mt-1">False Negative</div>
            </div>
            <div className="cell-tn bg-green-900/20 border-2 border-gray-700 rounded-lg p-6 text-center transition-all">
              <div className="text-3xl font-bold text-green-400 mb-2">TN</div>
              <div className="text-sm text-gray-200">真负例</div>
              <div className="text-xs text-gray-500 mt-1">True Negative</div>
            </div>
          </div>
        </div>
      </div>

      {/* TPR 公式推导 */}
      <div className="bg-ml-bg-dark p-6 rounded-lg">
        <div className="flex items-center justify-center gap-4 text-3xl mb-4">
          <span className="tpr-label text-ml-blue font-bold">TPR</span>
          <span className="tpr-equals text-white">=</span>
          <div className="flex flex-col items-center">
            <div className="tpr-numerator text-green-400 font-bold mb-1">TP</div>
            <div className="tpr-fraction-line w-24 h-0.5 bg-white"></div>
            <div className="tpr-denominator text-gray-100 mt-1">
              <span className="text-green-400">TP</span> + <span className="text-red-400">FN</span>
            </div>
          </div>
        </div>
        <div className="tpr-explanation opacity-0 translate-y-4">
          <p className="text-center text-gray-200 text-sm">
            真正例率（True Positive Rate）= 正确识别的正例 / 全部正例
          </p>
          <p className="text-center text-ml-blue text-sm mt-2">
            又称为<strong>召回率（Recall）</strong>或<strong>灵敏度（Sensitivity）</strong>
          </p>
        </div>
      </div>

      {/* FPR 公式推导 */}
      <div className="bg-ml-bg-dark p-6 rounded-lg">
        <div className="flex items-center justify-center gap-4 text-3xl mb-4">
          <span className="fpr-label text-yellow-500 font-bold">FPR</span>
          <span className="fpr-equals text-white">=</span>
          <div className="flex flex-col items-center">
            <div className="fpr-numerator text-red-400 font-bold mb-1">FP</div>
            <div className="fpr-fraction-line w-24 h-0.5 bg-white"></div>
            <div className="fpr-denominator text-gray-100 mt-1">
              <span className="text-red-400">FP</span> + <span className="text-green-400">TN</span>
            </div>
          </div>
        </div>
        <div className="fpr-explanation opacity-0 translate-y-4">
          <p className="text-center text-gray-200 text-sm">
            假正例率（False Positive Rate）= 错误识别的负例 / 全部负例
          </p>
          <p className="text-center text-yellow-500 text-sm mt-2">
            又称为<strong>误报率</strong>
          </p>
        </div>
      </div>

      {/* 关键洞察 */}
      <div className="key-insight bg-gradient-to-r from-ml-blue/20 to-purple-600/20 border-2 border-ml-blue/50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-ml-blue mb-3 text-center">🎯 关键洞察</h3>
        <div className="space-y-3 text-gray-100">
          <p className="flex items-start gap-2">
            <span className="text-green-400 font-bold flex-shrink-0">✓</span>
            <span><strong className="text-white">理想分类器</strong>：TPR → 1（尽可能捕获所有正例）</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-400 font-bold flex-shrink-0">✓</span>
            <span><strong className="text-white">理想分类器</strong>：FPR → 0（尽可能避免误报）</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-400 font-bold flex-shrink-0">→</span>
            <span>ROC 曲线绘制了不同阈值下 <strong className="text-ml-blue">(FPR, TPR)</strong> 的变化轨迹</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold flex-shrink-0">⚖</span>
            <span>调整阈值是在 <strong className="text-yellow-400">召回率</strong> 和 <strong className="text-red-400">误报率</strong> 之间做权衡</span>
          </p>
        </div>
      </div>
    </div>
  )
}
