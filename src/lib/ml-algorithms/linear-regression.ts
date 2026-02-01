/**
 * 线性回归实现
 */

import { Matrix, Vector, Regressor } from './types'
import { addBias, dot, transpose, matmul } from './data-utils'
import { mse, r2Score } from './metrics'

export class LinearRegression implements Regressor {
  private weights: Vector | null = null
  private bias: number = 0
  private fitIntercept: boolean

  constructor(fitIntercept: boolean = true) {
    this.fitIntercept = fitIntercept
  }

  /**
   * 使用正规方程求解 (闭式解)
   * w = (X^T X)^(-1) X^T y
   */
  fit(X: Matrix, y: Vector): void {
    if (X.length !== y.length) {
      throw new Error('X and y must have the same number of samples')
    }

    const n = X.length
    const nFeatures = X[0].length

    // 如果需要拟合截距，添加偏置列
    const XWithBias = this.fitIntercept ? addBias(X) : X

    // 使用正规方程: w = (X^T X)^(-1) X^T y
    const XT = transpose(XWithBias)
    const XTX = matmul(XT, XWithBias)

    // 计算 XTX 的逆矩阵（使用高斯消元法）
    const XTXInv = this.inverse(XTX)

    // XTy
    const XTy = XT.map(row => dot(row, y))

    // w = XTX^(-1) * XTy
    const weights = XTXInv.map(row => dot(row, XTy))

    if (this.fitIntercept) {
      this.bias = weights[0]
      this.weights = weights.slice(1)
    } else {
      this.weights = weights
      this.bias = 0
    }
  }

  /**
   * 使用梯度下降训练
   */
  fitGradientDescent(
    X: Matrix,
    y: Vector,
    learningRate: number = 0.01,
    iterations: number = 1000
  ): { losses: number[] } {
    if (X.length !== y.length) {
      throw new Error('X and y must have the same number of samples')
    }

    const n = X.length
    const nFeatures = X[0].length

    // 初始化权重
    this.weights = new Array(nFeatures).fill(0)
    this.bias = 0

    const losses: number[] = []

    for (let iter = 0; iter < iterations; iter++) {
      // 计算预测值
      const predictions = X.map(row => dot(row, this.weights!) + this.bias)

      // 计算梯度
      const errors = predictions.map((pred, i) => pred - y[i])

      const gradWeights = new Array(nFeatures).fill(0)
      for (let j = 0; j < nFeatures; j++) {
        for (let i = 0; i < n; i++) {
          gradWeights[j] += errors[i] * X[i][j]
        }
        gradWeights[j] /= n
      }

      const gradBias = errors.reduce((sum, e) => sum + e, 0) / n

      // 更新权重
      for (let j = 0; j < nFeatures; j++) {
        this.weights[j] -= learningRate * gradWeights[j]
      }
      if (this.fitIntercept) {
        this.bias -= learningRate * gradBias
      }

      // 记录损失
      const loss = mse(y, predictions)
      losses.push(loss)
    }

    return { losses }
  }

  /**
   * 预测
   */
  predict(X: Matrix): Vector {
    if (!this.weights) {
      throw new Error('Model has not been trained yet')
    }

    return X.map(row => {
      const prediction = dot(row, this.weights!) + this.bias
      return prediction
    })
  }

  /**
   * 计算 R² 分数
   */
  score(X: Matrix, y: Vector): number {
    const predictions = this.predict(X)
    return r2Score(y, predictions)
  }

  /**
   * 获取权重
   */
  getWeights(): { weights: Vector; bias: number } {
    if (!this.weights) {
      throw new Error('Model has not been trained yet')
    }
    return {
      weights: [...this.weights],
      bias: this.bias
    }
  }

  /**
   * 矩阵求逆（使用高斯-约旦消元法）
   */
  private inverse(matrix: Matrix): Matrix {
    const n = matrix.length

    // 创建增广矩阵 [A | I]
    const augmented: Matrix = matrix.map((row, i) =>
      [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]
    )

    // 高斯-约旦消元
    for (let i = 0; i < n; i++) {
      // 找主元
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k
        }
      }

      // 交换行
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

      // 主元归一化
      const pivot = augmented[i][i]
      if (Math.abs(pivot) < 1e-10) {
        throw new Error('Matrix is singular and cannot be inverted')
      }

      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot
      }

      // 消元
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i]
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j]
          }
        }
      }
    }

    // 提取逆矩阵
    return augmented.map(row => row.slice(n))
  }
}
