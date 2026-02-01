import {
  accuracy,
  precision,
  recall,
  f1Score,
  mse,
  mae,
  r2Score,
  rocCurve,
  aucScore,
} from '../metrics'

describe('Classification Metrics', () => {
  describe('accuracy', () => {
    it('should calculate accuracy correctly for perfect predictions', () => {
      const yTrue = [0, 1, 0, 1, 0]
      const yPred = [0, 1, 0, 1, 0]
      expect(accuracy(yTrue, yPred)).toBe(1.0)
    })

    it('should calculate accuracy correctly for completely wrong predictions', () => {
      const yTrue = [0, 0, 0, 0, 0]
      const yPred = [1, 1, 1, 1, 1]
      expect(accuracy(yTrue, yPred)).toBe(0.0)
    })

    it('should calculate accuracy correctly for partial predictions', () => {
      const yTrue = [0, 1, 0, 1, 0]
      const yPred = [0, 1, 1, 1, 0]
      expect(accuracy(yTrue, yPred)).toBe(0.8) // 4 out of 5 correct
    })

    it('should throw error for empty arrays', () => {
      expect(() => accuracy([], [])).toThrow('Invalid input')
    })
  })

  describe('precision', () => {
    it('should calculate precision correctly', () => {
      const yTrue = [0, 1, 1, 0, 1]
      const yPred = [0, 1, 0, 0, 1]
      // True Positives: 2, False Positives: 0
      // Precision = 2 / (2 + 0) = 1.0
      expect(precision(yTrue, yPred)).toBe(1.0)
    })

    it('should handle no positive predictions', () => {
      const yTrue = [0, 1, 1, 0, 1]
      const yPred = [0, 0, 0, 0, 0]
      expect(precision(yTrue, yPred)).toBe(0)
    })
  })

  describe('recall', () => {
    it('should calculate recall correctly', () => {
      const yTrue = [0, 1, 1, 0, 1]
      const yPred = [0, 1, 0, 0, 1]
      // True Positives: 2, False Negatives: 1
      // Recall = 2 / (2 + 1) = 0.667
      expect(recall(yTrue, yPred)).toBeCloseTo(0.667, 2)
    })

    it('should handle no actual positives', () => {
      const yTrue = [0, 0, 0, 0, 0]
      const yPred = [1, 1, 0, 0, 0]
      expect(recall(yTrue, yPred)).toBe(0)
    })
  })

  describe('f1Score', () => {
    it('should calculate F1 score correctly', () => {
      const yTrue = [0, 1, 1, 0, 1]
      const yPred = [0, 1, 0, 0, 1]
      const prec = precision(yTrue, yPred) // 1.0
      const rec = recall(yTrue, yPred) // 0.667
      const expectedF1 = (2 * prec * rec) / (prec + rec)
      expect(f1Score(yTrue, yPred)).toBeCloseTo(expectedF1, 2)
    })

    it('should return 0 when precision and recall are both 0', () => {
      const yTrue = [0, 1, 1, 0, 1]
      const yPred = [0, 0, 0, 0, 0]
      expect(f1Score(yTrue, yPred)).toBe(0)
    })
  })
})

describe('Regression Metrics', () => {
  describe('mse', () => {
    it('should calculate MSE correctly for perfect predictions', () => {
      const yTrue = [1, 2, 3, 4, 5]
      const yPred = [1, 2, 3, 4, 5]
      expect(mse(yTrue, yPred)).toBe(0)
    })

    it('should calculate MSE correctly for imperfect predictions', () => {
      const yTrue = [1, 2, 3]
      const yPred = [1.5, 2.5, 3.5]
      // MSE = ((0.5)^2 + (0.5)^2 + (0.5)^2) / 3 = 0.25
      expect(mse(yTrue, yPred)).toBeCloseTo(0.25, 2)
    })
  })

  describe('mae', () => {
    it('should calculate MAE correctly', () => {
      const yTrue = [1, 2, 3]
      const yPred = [1.5, 2.5, 3.5]
      // MAE = (0.5 + 0.5 + 0.5) / 3 = 0.5
      expect(mae(yTrue, yPred)).toBeCloseTo(0.5, 2)
    })

    it('should handle negative errors correctly', () => {
      const yTrue = [1, 2, 3]
      const yPred = [0.5, 1.5, 2.5]
      // MAE = (0.5 + 0.5 + 0.5) / 3 = 0.5
      expect(mae(yTrue, yPred)).toBeCloseTo(0.5, 2)
    })
  })

  describe('r2Score', () => {
    it('should return 1 for perfect predictions', () => {
      const yTrue = [1, 2, 3, 4, 5]
      const yPred = [1, 2, 3, 4, 5]
      expect(r2Score(yTrue, yPred)).toBe(1)
    })

    it('should calculate R² correctly', () => {
      const yTrue = [1, 2, 3, 4, 5]
      const yPred = [1.1, 2.1, 2.9, 4.1, 4.9]
      const r2 = r2Score(yTrue, yPred)
      expect(r2).toBeGreaterThan(0.95) // Should be close to 1
      expect(r2).toBeLessThanOrEqual(1)
    })
  })
})

describe('ROC and AUC', () => {
  describe('rocCurve', () => {
    it('should calculate ROC curve points', () => {
      const yTrue = [0, 0, 1, 1]
      const yProb = [0.1, 0.4, 0.35, 0.8]
      const { fpr, tpr, thresholds } = rocCurve(yTrue, yProb)

      expect(fpr.length).toBeGreaterThan(0)
      expect(tpr.length).toBeGreaterThan(0)
      expect(fpr.length).toBe(tpr.length)
      expect(thresholds.length).toBe(fpr.length)

      // Points should be valid
      expect(fpr[0]).toBeGreaterThanOrEqual(0)
      expect(tpr[0]).toBeGreaterThanOrEqual(0)
    })

    it('should have TPR and FPR between 0 and 1', () => {
      const yTrue = [0, 0, 1, 1, 0, 1]
      const yProb = [0.2, 0.3, 0.4, 0.6, 0.7, 0.9]
      const { fpr, tpr } = rocCurve(yTrue, yProb)

      fpr.forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(1)
      })

      tpr.forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('aucScore', () => {
    it('should return high AUC for good classifier', () => {
      const yTrue = [0, 0, 0, 1, 1, 1]
      const yProb = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]
      const auc = aucScore(yTrue, yProb)
      expect(auc).toBeGreaterThan(0.9) // Should be close to 1
      expect(auc).toBeLessThanOrEqual(1)
    })

    it('should return moderate AUC for mixed classifier', () => {
      const yTrue = [0, 1, 0, 1, 0, 1]
      const yProb = [0.4, 0.6, 0.3, 0.7, 0.5, 0.5]
      const auc = aucScore(yTrue, yProb)
      expect(auc).toBeGreaterThanOrEqual(0)
      expect(auc).toBeLessThanOrEqual(1)
    })

    it('should return value between 0 and 1', () => {
      const yTrue = [0, 0, 1, 1]
      const yProb = [0.1, 0.4, 0.35, 0.8]
      const auc = aucScore(yTrue, yProb)
      expect(auc).toBeGreaterThanOrEqual(0)
      expect(auc).toBeLessThanOrEqual(1)
    })
  })
})
