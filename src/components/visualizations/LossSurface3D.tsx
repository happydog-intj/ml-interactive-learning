'use client'

import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface Point3D {
  x: number
  y: number
  z: number
}

interface LossSurface3DProps {
  className?: string
}

// Loss function: f(w1, w2) = w1^2 + w2^2 (simple quadratic bowl)
const lossFunction = (w1: number, w2: number) => {
  return w1 * w1 + w2 * w2
}

// Loss function 2: Rosenbrock function (banana valley)
const rosenbrockFunction = (w1: number, w2: number) => {
  const a = 1
  const b = 5
  return Math.pow(a - w1, 2) + b * Math.pow(w2 - w1 * w1, 2)
}

// Loss function 3: Beale function (complex landscape)
const bealeFunction = (w1: number, w2: number) => {
  const term1 = Math.pow(1.5 - w1 + w1 * w2, 2)
  const term2 = Math.pow(2.25 - w1 + w1 * w2 * w2, 2)
  const term3 = Math.pow(2.625 - w1 + w1 * w2 * w2 * w2, 2)
  return (term1 + term2 + term3) / 50
}

function Surface({
  lossType,
  showGradientPath,
  gradientPath
}: {
  lossType: 'quadratic' | 'rosenbrock' | 'beale'
  showGradientPath: boolean
  gradientPath: Point3D[]
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate surface geometry
  const geometry = useMemo(() => {
    const resolution = 50
    const size = 4
    const geometry = new THREE.PlaneGeometry(size * 2, size * 2, resolution, resolution)

    const positions = geometry.attributes.position.array as Float32Array
    const colors = new Float32Array((positions.length / 3) * 3)

    let minZ = Infinity
    let maxZ = -Infinity

    // First pass: calculate z values and find min/max
    const zValues: number[] = []
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]

      let z: number
      if (lossType === 'quadratic') {
        z = lossFunction(x, y)
      } else if (lossType === 'rosenbrock') {
        z = rosenbrockFunction(x, y) * 0.1
      } else {
        z = bealeFunction(x, y)
      }

      zValues.push(z)
      minZ = Math.min(minZ, z)
      maxZ = Math.max(maxZ, z)
    }

    // Second pass: set positions and colors
    for (let i = 0; i < positions.length; i += 3) {
      const zIndex = i / 3
      const z = zValues[zIndex]
      positions[i + 2] = z

      // Color based on height (gradient from blue to red)
      const t = (z - minZ) / (maxZ - minZ)
      colors[i] = t // R
      colors[i + 1] = 0.3 * (1 - t) + 0.7 * t // G
      colors[i + 2] = 1 - t // B
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.computeVertexNormals()

    return geometry
  }, [lossType])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial
        vertexColors
        side={THREE.DoubleSide}
        shininess={30}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function GradientPath({ points }: { points: Point3D[] }) {
  const pathRef = useRef<THREE.Line>(null)

  const geometry = useMemo(() => {
    if (points.length < 2) return null

    const positions = new Float32Array(points.length * 3)
    points.forEach((p, i) => {
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [points])

  if (!geometry) return null

  return (
    <>
      <line ref={pathRef} geometry={geometry}>
        <lineBasicMaterial color="#00D9FF" linewidth={3} />
      </line>

      {/* Points along path */}
      {points.map((point, idx) => (
        <mesh key={idx} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={idx === 0 ? "#00FF88" : idx === points.length - 1 ? "#FF3366" : "#00D9FF"}
            emissive={idx === 0 ? "#00FF88" : idx === points.length - 1 ? "#FF3366" : "#00D9FF"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  )
}

function Scene({
  lossType,
  showGradientPath,
  gradientPath
}: {
  lossType: 'quadratic' | 'rosenbrock' | 'beale'
  showGradientPath: boolean
  gradientPath: Point3D[]
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      <Surface
        lossType={lossType}
        showGradientPath={showGradientPath}
        gradientPath={gradientPath}
      />

      {showGradientPath && gradientPath.length > 0 && (
        <GradientPath points={gradientPath} />
      )}

      <Grid
        args={[20, 20]}
        position={[0, 0, -0.01]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#2A3C52"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#00D9FF"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />
    </>
  )
}

export function LossSurface3D({ className = '' }: LossSurface3DProps) {
  const [lossType, setLossType] = useState<'quadratic' | 'rosenbrock' | 'beale'>('quadratic')
  const [showGradientPath, setShowGradientPath] = useState(false)
  const [learningRate, setLearningRate] = useState(0.1)
  const [isTraining, setIsTraining] = useState(false)
  const [gradientPath, setGradientPath] = useState<Point3D[]>([])

  const lossConfigs = {
    quadratic: {
      name: '二次函数 (Quadratic)',
      description: '最简单的凸优化问题，全局最优解在原点',
      formula: 'L(w₁, w₂) = w₁² + w₂²',
      gradient: '∇L = [2w₁, 2w₂]',
      startPoint: { x: 3, y: 3 }
    },
    rosenbrock: {
      name: 'Rosenbrock函数 (香蕉谷)',
      description: '经典优化测试函数，具有狭窄的抛物线形山谷',
      formula: 'L(w₁, w₂) = (1-w₁)² + 5(w₂-w₁²)²',
      gradient: '∇L = [-2(1-w₁)-20w₁(w₂-w₁²), 10(w₂-w₁²)]',
      startPoint: { x: -2, y: 2 }
    },
    beale: {
      name: 'Beale函数 (复杂地形)',
      description: '多个局部极值点，优化难度较大',
      formula: 'L(w₁, w₂) = (1.5-w₁+w₁w₂)² + (2.25-w₁+w₁w₂²)² + (2.625-w₁+w₁w₂³)²',
      gradient: '复杂梯度 (数值计算)',
      startPoint: { x: -3, y: 2 }
    }
  }

  const config = lossConfigs[lossType]

  // Compute gradient numerically
  const computeGradient = (w1: number, w2: number) => {
    const h = 0.0001
    let f: (x: number, y: number) => number

    if (lossType === 'quadratic') {
      f = lossFunction
    } else if (lossType === 'rosenbrock') {
      f = (x, y) => rosenbrockFunction(x, y) * 0.1
    } else {
      f = bealeFunction
    }

    const dw1 = (f(w1 + h, w2) - f(w1 - h, w2)) / (2 * h)
    const dw2 = (f(w1, w2 + h) - f(w1, w2 - h)) / (2 * h)

    return { dw1, dw2 }
  }

  // Run gradient descent
  const runGradientDescent = () => {
    setIsTraining(true)

    const startPoint = config.startPoint
    let w1 = startPoint.x
    let w2 = startPoint.y

    const path: Point3D[] = []
    const maxIterations = 100
    const threshold = 0.001

    let f: (x: number, y: number) => number
    if (lossType === 'quadratic') {
      f = lossFunction
    } else if (lossType === 'rosenbrock') {
      f = (x, y) => rosenbrockFunction(x, y) * 0.1
    } else {
      f = bealeFunction
    }

    path.push({ x: w1, y: w2, z: f(w1, w2) })

    for (let i = 0; i < maxIterations; i++) {
      const { dw1, dw2 } = computeGradient(w1, w2)

      // Gradient descent step
      w1 = w1 - learningRate * dw1
      w2 = w2 - learningRate * dw2

      // Clamp to reasonable bounds
      w1 = Math.max(-4, Math.min(4, w1))
      w2 = Math.max(-4, Math.min(4, w2))

      const loss = f(w1, w2)
      path.push({ x: w1, y: w2, z: loss })

      // Check convergence
      if (Math.sqrt(dw1 * dw1 + dw2 * dw2) < threshold) {
        break
      }
    }

    setGradientPath(path)
    setShowGradientPath(true)
    setIsTraining(false)
  }

  const resetVisualization = () => {
    setGradientPath([])
    setShowGradientPath(false)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border space-y-6">
        {/* Loss Function Selection */}
        <div>
          <label className="block text-sm font-semibold text-ml-cyan mb-3">
            选择损失函数
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(lossConfigs) as Array<keyof typeof lossConfigs>).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setLossType(key)
                  resetVisualization()
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                  lossType === key
                    ? 'border-ml-cyan bg-ml-cyan/10'
                    : 'border-ml-border bg-ml-bg-card hover:border-ml-border/50'
                }`}
              >
                <div className="font-bold text-white mb-1">{lossConfigs[key].name}</div>
                <div className="text-xs text-gray-100">{lossConfigs[key].description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ml-purple">
              学习率 (Learning Rate)
            </label>
            <span className="text-xl font-bold text-white bg-ml-purple/20 px-3 py-1 rounded-lg">
              {learningRate.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            disabled={isTraining}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={runGradientDescent}
            disabled={isTraining}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
              isTraining
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-ml-purple to-ml-blue hover:from-ml-blue hover:to-ml-cyan shadow-lg hover:shadow-[0_0_30px_rgba(138,92,246,0.5)]'
            }`}
          >
            {isTraining ? '训练中...' : '运行梯度下降'}
          </button>

          <button
            onClick={resetVisualization}
            className="px-6 py-3 rounded-xl font-bold text-white bg-ml-bg-dark border border-ml-border hover:border-ml-cyan transition-all duration-300"
          >
            重置
          </button>

          {gradientPath.length > 0 && (
            <div className="flex items-center gap-3 bg-ml-bg-dark rounded-xl px-6 py-3">
              <span className="text-white font-semibold">迭代次数:</span>
              <span className="text-2xl font-bold text-ml-cyan">{gradientPath.length - 1}</span>
            </div>
          )}
        </div>
      </div>

      {/* Function Info */}
      <div className="bg-gradient-to-br from-ml-cyan/10 to-ml-blue/10 border border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-ml-cyan mb-3">{config.name}</h3>
        <p className="text-gray-100 mb-4">{config.description}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <div className="text-sm text-gray-100 mb-2">损失函数公式:</div>
            <div className="text-white font-mono text-sm">{config.formula}</div>
          </div>
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <div className="text-sm text-gray-100 mb-2">梯度:</div>
            <div className="text-white font-mono text-sm">{config.gradient}</div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="bg-ml-bg-secondary rounded-xl border border-ml-border overflow-hidden">
        <div className="h-[600px]">
          <Canvas shadows>
            <Scene
              lossType={lossType}
              showGradientPath={showGradientPath}
              gradientPath={gradientPath}
            />
          </Canvas>
        </div>

        <div className="p-4 border-t border-ml-border bg-ml-bg-dark/50">
          <div className="flex items-center gap-6 text-sm text-gray-100 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-green"></div>
              <span>起点</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-cyan"></div>
              <span>优化路径</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ml-red"></div>
              <span>终点</span>
            </div>
            <div className="ml-auto text-xs text-gray-100">
              💡 拖拽旋转 · 滚轮缩放 · 右键平移
            </div>
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎓</span>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-ml-blue mb-2">3D损失曲面可视化</h4>
            <ul className="space-y-2 text-gray-100 text-sm">
              <li>• <strong className="text-white">曲面颜色</strong>：蓝色表示低损失，红色表示高损失</li>
              <li>• <strong className="text-white">梯度下降路径</strong>：绿色起点沿着最陡下降方向移动到红色终点</li>
              <li>• <strong className="text-white">学习率影响</strong>：学习率过大会导致震荡，过小会收敛缓慢</li>
              <li>• <strong className="text-white">不同地形</strong>：体验从简单凸优化到复杂地形的优化难度差异</li>
              <li>• <strong className="text-white">交互探索</strong>：旋转视角观察损失函数的三维形状</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
