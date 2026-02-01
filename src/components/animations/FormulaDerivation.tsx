'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Math } from '@/components/ui/Math'

export function ROCFormulaDerivation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true })
    
    // 步骤1: TPR 定义
    tl.from('.formula-tpr', { opacity: 0, y: 20, duration: 0.5 })
    
    // 步骤2: FPR 定义
    tl.from('.formula-fpr', { opacity: 0, y: 20, duration: 0.5 }, '+=0.5')
    
    // 步骤3: 高亮关系
    tl.to('.highlight', { 
      backgroundColor: '#FFFF00', 
      duration: 0.3,
      stagger: 0.2 
    }, '+=0.5')

    tl.play()
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="space-y-6 p-6">
      <div className="formula-tpr">
        <Math>
          {`\\text{TPR} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}`}
        </Math>
        <p className="text-sm text-gray-400 mt-2">
          真正例率（灵敏度）= 正确识别的正例 / 所有正例
        </p>
      </div>

      <div className="formula-fpr">
        <Math>
          {`\\text{FPR} = \\frac{\\text{FP}}{\\text{FP} + \\text{TN}}`}
        </Math>
        <p className="text-sm text-gray-400 mt-2">
          假正例率 = 错误识别的负例 / 所有负例
        </p>
      </div>

      <div className="p-4 bg-ml-bg-secondary rounded">
        <p className="text-sm">
          <span className="highlight px-1">理想的分类器</span>应该使 
          <span className="highlight px-1">TPR 接近 1</span>，同时
          <span className="highlight px-1">FPR 接近 0</span>
        </p>
      </div>
    </div>
  )
}
