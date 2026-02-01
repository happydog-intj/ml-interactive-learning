/**
 * 机器学习评估指标
 */

import { Vector, Matrix } from './types'

/**
 * 计算混淆矩阵
 */
export function confusionMatrix(yTrue: Vector, yPred: Vector): {
  tp: number
  fp: number
  tn: number
  fn: number
} {
  let tp = 0, fp = 0, tn = 0, fn = 0

  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++
  }

  return { tp, fp, tn, fn }
}

/**
 * 准确率 (Accuracy)
 */
export function accuracy(yTrue: Vector, yPred: Vector): number {
  if (yTrue.length !== yPred.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  let correct = 0
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === yPred[i]) correct++
  }

  return correct / yTrue.length
}

/**
 * 精确率 (Precision)
 */
export function precision(yTrue: Vector, yPred: Vector, positive: number = 1): number {
  const cm = confusionMatrix(yTrue, yPred)
  const { tp, fp } = cm

  if (tp + fp === 0) return 0
  return tp / (tp + fp)
}

/**
 * 召回率 (Recall / TPR / Sensitivity)
 */
export function recall(yTrue: Vector, yPred: Vector, positive: number = 1): number {
  const cm = confusionMatrix(yTrue, yPred)
  const { tp, fn } = cm

  if (tp + fn === 0) return 0
  return tp / (tp + fn)
}

/**
 * F1 分数
 */
export function f1Score(yTrue: Vector, yPred: Vector, positive: number = 1): number {
  const p = precision(yTrue, yPred, positive)
  const r = recall(yTrue, yPred, positive)

  if (p + r === 0) return 0
  return 2 * (p * r) / (p + r)
}

/**
 * 均方误差 (Mean Squared Error)
 */
export function mse(yTrue: Vector, yPred: Vector): number {
  if (yTrue.length !== yPred.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  let sum = 0
  for (let i = 0; i < yTrue.length; i++) {
    const error = yTrue[i] - yPred[i]
    sum += error * error
  }

  return sum / yTrue.length
}

/**
 * 均方根误差 (Root Mean Squared Error)
 */
export function rmse(yTrue: Vector, yPred: Vector): number {
  return Math.sqrt(mse(yTrue, yPred))
}

/**
 * 平均绝对误差 (Mean Absolute Error)
 */
export function mae(yTrue: Vector, yPred: Vector): number {
  if (yTrue.length !== yPred.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  let sum = 0
  for (let i = 0; i < yTrue.length; i++) {
    sum += Math.abs(yTrue[i] - yPred[i])
  }

  return sum / yTrue.length
}

/**
 * R² 分数 (决定系数)
 */
export function r2Score(yTrue: Vector, yPred: Vector): number {
  if (yTrue.length !== yPred.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  // 计算均值
  const mean = yTrue.reduce((sum, val) => sum + val, 0) / yTrue.length

  // 总平方和 (Total Sum of Squares)
  let ssTot = 0
  for (let i = 0; i < yTrue.length; i++) {
    ssTot += Math.pow(yTrue[i] - mean, 2)
  }

  // 残差平方和 (Residual Sum of Squares)
  let ssRes = 0
  for (let i = 0; i < yTrue.length; i++) {
    ssRes += Math.pow(yTrue[i] - yPred[i], 2)
  }

  if (ssTot === 0) return 0
  return 1 - (ssRes / ssTot)
}

/**
 * AUC (Area Under Curve) - ROC 曲线下面积
 */
export function aucScore(yTrue: Vector, yScore: Vector): number {
  if (yTrue.length !== yScore.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  // 将数据打包并按分数降序排序
  const data = yTrue.map((label, i) => ({ label, score: yScore[i] }))
  data.sort((a, b) => b.score - a.score)

  // 计算 TPR 和 FPR
  const totalPositive = yTrue.filter(y => y === 1).length
  const totalNegative = yTrue.length - totalPositive

  if (totalPositive === 0 || totalNegative === 0) return 0

  let auc = 0
  let tp = 0
  let fp = 0

  for (let i = 0; i < data.length; i++) {
    if (data[i].label === 1) {
      tp++
    } else {
      fp++
      // 当遇到负样本时，累加 AUC
      auc += tp / totalPositive
    }
  }

  return auc / totalNegative
}

/**
 * 计算 ROC 曲线的点
 */
export function rocCurve(yTrue: Vector, yScore: Vector, numThresholds: number = 100): {
  fpr: Vector
  tpr: Vector
  thresholds: Vector
} {
  if (yTrue.length !== yScore.length || yTrue.length === 0) {
    throw new Error('Invalid input: arrays must have the same non-zero length')
  }

  const totalPositive = yTrue.filter(y => y === 1).length
  const totalNegative = yTrue.length - totalPositive

  const minScore = Math.min(...yScore)
  const maxScore = Math.max(...yScore)

  const thresholds: Vector = []
  const fpr: Vector = []
  const tpr: Vector = []

  for (let i = 0; i <= numThresholds; i++) {
    const threshold = minScore + (maxScore - minScore) * (i / numThresholds)
    thresholds.push(threshold)

    let tp = 0, fp = 0
    for (let j = 0; j < yTrue.length; j++) {
      if (yScore[j] >= threshold) {
        if (yTrue[j] === 1) tp++
        else fp++
      }
    }

    tpr.push(totalPositive > 0 ? tp / totalPositive : 0)
    fpr.push(totalNegative > 0 ? fp / totalNegative : 0)
  }

  return { fpr, tpr, thresholds }
}
