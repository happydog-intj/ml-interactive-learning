import {
  trainTestSplit,
  standardize,
  normalize,
  euclideanDistance,
  manhattanDistance,
} from '../data-utils'

describe('Data Utilities', () => {
  describe('trainTestSplit', () => {
    it('should split data according to test size', () => {
      const X = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]
      const y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const testSize = 0.3

      const { XTrain, XTest, yTrain, yTest } = trainTestSplit(X, y, testSize)

      expect(XTest.length).toBe(3) // 30% of 10
      expect(XTrain.length).toBe(7) // 70% of 10
      expect(yTest.length).toBe(3)
      expect(yTrain.length).toBe(7)
    })

    it('should maintain data integrity', () => {
      const X = [[1, 2], [3, 4], [5, 6]]
      const y = [1, 2, 3]
      const testSize = 0.33

      const { XTrain, XTest, yTrain, yTest } = trainTestSplit(X, y, testSize)

      // Check that all original data points exist in either train or test
      const allX = [...XTrain, ...XTest]
      const allY = [...yTrain, ...yTest]

      expect(allX.length).toBe(X.length)
      expect(allY.length).toBe(y.length)
    })
  })

  describe('standardize', () => {
    it('should standardize data to mean=0 and std=1', () => {
      const data = [[1], [2], [3], [4], [5]]
      const { XScaled, mean, std } = standardize(data)

      // Calculate mean and std of standardized data
      const means = XScaled.reduce((sum, x) => sum + x[0], 0) / XScaled.length
      expect(means).toBeCloseTo(0, 10)

      // Standard deviation should be 1
      const variance = XScaled.reduce((sum, x) => sum + Math.pow(x[0] - means, 2), 0) / XScaled.length
      const stdDev = Math.sqrt(variance)
      expect(stdDev).toBeCloseTo(1, 1)

      // Mean and std should be returned
      expect(mean.length).toBe(1)
      expect(std.length).toBe(1)
    })

    it('should handle multi-dimensional data', () => {
      const data = [
        [1, 10],
        [2, 20],
        [3, 30],
      ]
      const { XScaled } = standardize(data)

      expect(XScaled.length).toBe(3)
      expect(XScaled[0].length).toBe(2)
    })
  })

  describe('normalize', () => {
    it('should normalize data to range [0, 1]', () => {
      const data = [[1], [2], [3], [4], [5]]
      const { XScaled } = normalize(data)

      // All values should be between 0 and 1
      XScaled.forEach(row => {
        row.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0)
          expect(val).toBeLessThanOrEqual(1)
        })
      })

      // Min should be 0, max should be 1
      const allValues = XScaled.flat()
      expect(Math.min(...allValues)).toBe(0)
      expect(Math.max(...allValues)).toBe(1)
    })

    it('should handle multi-dimensional data', () => {
      const data = [
        [1, 100],
        [2, 200],
        [3, 300],
      ]
      const { XScaled } = normalize(data)

      XScaled.forEach(row => {
        row.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0)
          expect(val).toBeLessThanOrEqual(1)
        })
      })
    })
  })

  describe('euclideanDistance', () => {
    it('should calculate Euclidean distance correctly', () => {
      const p1 = [0, 0]
      const p2 = [3, 4]
      const distance = euclideanDistance(p1, p2)
      expect(distance).toBe(5) // 3-4-5 triangle
    })

    it('should return 0 for identical points', () => {
      const p1 = [1, 2, 3]
      const p2 = [1, 2, 3]
      const distance = euclideanDistance(p1, p2)
      expect(distance).toBe(0)
    })

    it('should work with higher dimensions', () => {
      const p1 = [1, 2, 3, 4]
      const p2 = [5, 6, 7, 8]
      const distance = euclideanDistance(p1, p2)
      // sqrt((5-1)^2 + (6-2)^2 + (7-3)^2 + (8-4)^2) = sqrt(64) = 8
      expect(distance).toBe(8)
    })
  })

  describe('manhattanDistance', () => {
    it('should calculate Manhattan distance correctly', () => {
      const p1 = [0, 0]
      const p2 = [3, 4]
      const distance = manhattanDistance(p1, p2)
      expect(distance).toBe(7) // |3-0| + |4-0| = 7
    })

    it('should return 0 for identical points', () => {
      const p1 = [1, 2, 3]
      const p2 = [1, 2, 3]
      const distance = manhattanDistance(p1, p2)
      expect(distance).toBe(0)
    })

    it('should handle negative coordinates', () => {
      const p1 = [-1, -2]
      const p2 = [1, 2]
      const distance = manhattanDistance(p1, p2)
      // |1 - (-1)| + |2 - (-2)| = 2 + 4 = 6
      expect(distance).toBe(6)
    })
  })
})
