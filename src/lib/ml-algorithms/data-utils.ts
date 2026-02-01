/**
 * 数据处理工具函数
 */

import { Matrix, Vector, Dataset } from './types'

/**
 * 训练集/测试集划分
 */
export function trainTestSplit(
  X: Matrix,
  y: Vector,
  testSize: number = 0.2,
  shuffle: boolean = true,
  randomSeed?: number
): {
  XTrain: Matrix
  XTest: Matrix
  yTrain: Vector
  yTest: Vector
} {
  if (X.length !== y.length) {
    throw new Error('X and y must have the same number of samples')
  }

  const n = X.length
  const testSamples = Math.floor(n * testSize)
  const trainSamples = n - testSamples

  // 创建索引数组
  let indices = Array.from({ length: n }, (_, i) => i)

  // 如果需要打乱
  if (shuffle) {
    if (randomSeed !== undefined) {
      // 使用简单的伪随机数生成器
      let seed = randomSeed
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }
      indices = indices.sort(() => random() - 0.5)
    } else {
      indices = indices.sort(() => Math.random() - 0.5)
    }
  }

  const trainIndices = indices.slice(0, trainSamples)
  const testIndices = indices.slice(trainSamples)

  return {
    XTrain: trainIndices.map(i => X[i]),
    XTest: testIndices.map(i => X[i]),
    yTrain: trainIndices.map(i => y[i]),
    yTest: testIndices.map(i => y[i])
  }
}

/**
 * 标准化 (Z-score normalization)
 * (x - mean) / std
 */
export function standardize(X: Matrix): {
  XScaled: Matrix
  mean: Vector
  std: Vector
} {
  if (X.length === 0) {
    throw new Error('Input matrix cannot be empty')
  }

  const nSamples = X.length
  const nFeatures = X[0].length

  // 计算每个特征的均值
  const mean: Vector = new Array(nFeatures).fill(0)
  for (let j = 0; j < nFeatures; j++) {
    for (let i = 0; i < nSamples; i++) {
      mean[j] += X[i][j]
    }
    mean[j] /= nSamples
  }

  // 计算每个特征的标准差
  const std: Vector = new Array(nFeatures).fill(0)
  for (let j = 0; j < nFeatures; j++) {
    for (let i = 0; i < nSamples; i++) {
      std[j] += Math.pow(X[i][j] - mean[j], 2)
    }
    std[j] = Math.sqrt(std[j] / nSamples)
    // 避免除以零
    if (std[j] === 0) std[j] = 1
  }

  // 标准化
  const XScaled: Matrix = X.map(row =>
    row.map((val, j) => (val - mean[j]) / std[j])
  )

  return { XScaled, mean, std }
}

/**
 * 归一化 (Min-Max scaling)
 * (x - min) / (max - min)
 */
export function normalize(X: Matrix, featureRange: [number, number] = [0, 1]): {
  XScaled: Matrix
  min: Vector
  max: Vector
} {
  if (X.length === 0) {
    throw new Error('Input matrix cannot be empty')
  }

  const nSamples = X.length
  const nFeatures = X[0].length
  const [targetMin, targetMax] = featureRange

  // 找到每个特征的最小值和最大值
  const min: Vector = new Array(nFeatures).fill(Infinity)
  const max: Vector = new Array(nFeatures).fill(-Infinity)

  for (let j = 0; j < nFeatures; j++) {
    for (let i = 0; i < nSamples; i++) {
      if (X[i][j] < min[j]) min[j] = X[i][j]
      if (X[i][j] > max[j]) max[j] = X[i][j]
    }
  }

  // 归一化
  const XScaled: Matrix = X.map(row =>
    row.map((val, j) => {
      const range = max[j] - min[j]
      if (range === 0) return targetMin
      return targetMin + ((val - min[j]) / range) * (targetMax - targetMin)
    })
  )

  return { XScaled, min, max }
}

/**
 * 添加偏置项（在特征矩阵前添加全1列）
 */
export function addBias(X: Matrix): Matrix {
  return X.map(row => [1, ...row])
}

/**
 * 生成批次数据
 */
export function* batchGenerator(
  X: Matrix,
  y: Vector,
  batchSize: number
): Generator<{ X: Matrix; y: Vector }> {
  const n = X.length
  for (let i = 0; i < n; i += batchSize) {
    const end = Math.min(i + batchSize, n)
    yield {
      X: X.slice(i, end),
      y: y.slice(i, end)
    }
  }
}

/**
 * K折交叉验证的索引生成
 */
export function kFoldSplit(n: number, k: number): {
  trainIndices: number[]
  testIndices: number[]
}[] {
  if (k > n) {
    throw new Error('Number of folds cannot be greater than number of samples')
  }

  const foldSize = Math.floor(n / k)
  const indices = Array.from({ length: n }, (_, i) => i)
  const folds: { trainIndices: number[]; testIndices: number[] }[] = []

  for (let i = 0; i < k; i++) {
    const start = i * foldSize
    const end = i === k - 1 ? n : (i + 1) * foldSize

    const testIndices = indices.slice(start, end)
    const trainIndices = [...indices.slice(0, start), ...indices.slice(end)]

    folds.push({ trainIndices, testIndices })
  }

  return folds
}

/**
 * 计算欧氏距离
 */
export function euclideanDistance(a: Vector, b: Vector): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2)
  }

  return Math.sqrt(sum)
}

/**
 * 计算曼哈顿距离
 */
export function manhattanDistance(a: Vector, b: Vector): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i])
  }

  return sum
}

/**
 * 矩阵转置
 */
export function transpose(X: Matrix): Matrix {
  if (X.length === 0) return []
  const nRows = X.length
  const nCols = X[0].length

  const result: Matrix = Array.from({ length: nCols }, () => new Array(nRows))

  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      result[j][i] = X[i][j]
    }
  }

  return result
}

/**
 * 矩阵乘法
 */
export function matmul(A: Matrix, B: Matrix): Matrix {
  if (A.length === 0 || B.length === 0) {
    throw new Error('Input matrices cannot be empty')
  }

  const aRows = A.length
  const aCols = A[0].length
  const bRows = B.length
  const bCols = B[0].length

  if (aCols !== bRows) {
    throw new Error(`Cannot multiply matrices: ${aRows}x${aCols} and ${bRows}x${bCols}`)
  }

  const result: Matrix = Array.from({ length: aRows }, () => new Array(bCols).fill(0))

  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += A[i][k] * B[k][j]
      }
    }
  }

  return result
}

/**
 * 向量点积
 */
export function dot(a: Vector, b: Vector): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  return a.reduce((sum, val, i) => sum + val * b[i], 0)
}
