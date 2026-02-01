/**
 * 基础类型定义
 */

export type Matrix = number[][]
export type Vector = number[]

export interface DataPoint {
  features: Vector
  label: number
}

export interface Dataset {
  X: Matrix  // 特征矩阵
  y: Vector  // 标签向量
}

export interface TrainResult {
  loss: number
  accuracy?: number
  predictions?: Vector
}

/**
 * 基础模型接口
 */
export interface BaseModel {
  fit(X: Matrix, y: Vector): void
  predict(X: Matrix): Vector
  score(X: Matrix, y: Vector): number
}

/**
 * 分类器接口
 */
export interface Classifier extends BaseModel {
  predictProba?(X: Matrix): Matrix  // 预测概率
  classes?: number[]  // 类别列表
}

/**
 * 回归器接口
 */
export interface Regressor extends BaseModel {
  // 回归器特有的方法可以在这里添加
}

/**
 * 评估指标
 */
export interface Metrics {
  accuracy(yTrue: Vector, yPred: Vector): number
  precision(yTrue: Vector, yPred: Vector, positive?: number): number
  recall(yTrue: Vector, yPred: Vector, positive?: number): number
  f1Score(yTrue: Vector, yPred: Vector, positive?: number): number
  mse(yTrue: Vector, yPred: Vector): number
  mae(yTrue: Vector, yPred: Vector): number
  r2Score(yTrue: Vector, yPred: Vector): number
}

/**
 * 数据处理选项
 */
export interface PreprocessOptions {
  normalize?: boolean
  standardize?: boolean
  handleMissing?: 'mean' | 'median' | 'remove'
}

/**
 * 训练选项
 */
export interface TrainOptions {
  epochs?: number
  learningRate?: number
  batchSize?: number
  verbose?: boolean
  validationSplit?: number
  earlyStop?: boolean
  patience?: number
}
