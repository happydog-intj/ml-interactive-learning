// Real machine learning datasets for demonstrations

export interface Dataset {
  name: string
  description: string
  features: string[]
  target: string
  data: number[][]
  labels: number[]
  numSamples: number
  numFeatures: number
  numClasses: number
}

/**
 * Iris Dataset (Fisher, 1936)
 * Classic dataset for classification
 * 150 samples, 4 features, 3 classes
 */
export const irisDataset: Dataset = {
  name: 'Iris',
  description: '鸢尾花数据集 - 经典分类问题',
  features: ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'],
  target: 'Species',
  numSamples: 150,
  numFeatures: 4,
  numClasses: 3,
  // Simplified subset: First 2 features, first 100 samples (2 classes for binary classification demos)
  data: [
    // Setosa (class 0) - 50 samples
    [5.1, 3.5], [4.9, 3.0], [4.7, 3.2], [4.6, 3.1], [5.0, 3.6],
    [5.4, 3.9], [4.6, 3.4], [5.0, 3.4], [4.4, 2.9], [4.9, 3.1],
    [5.4, 3.7], [4.8, 3.4], [4.8, 3.0], [4.3, 3.0], [5.8, 4.0],
    [5.7, 4.4], [5.4, 3.9], [5.1, 3.5], [5.7, 3.8], [5.1, 3.8],
    [5.4, 3.4], [5.1, 3.7], [4.6, 3.6], [5.1, 3.3], [4.8, 3.4],
    [5.0, 3.0], [5.0, 3.4], [5.2, 3.5], [5.2, 3.4], [4.7, 3.2],
    [4.8, 3.1], [5.4, 3.4], [5.2, 4.1], [5.5, 4.2], [4.9, 3.1],
    [5.0, 3.2], [5.5, 3.5], [4.9, 3.6], [4.4, 3.0], [5.1, 3.4],
    [5.0, 3.5], [4.5, 2.3], [4.4, 3.2], [5.0, 3.5], [5.1, 3.8],
    [4.8, 3.0], [5.1, 3.8], [4.6, 3.2], [5.3, 3.7], [5.0, 3.3],
    // Versicolor (class 1) - 50 samples
    [7.0, 3.2], [6.4, 3.2], [6.9, 3.1], [5.5, 2.3], [6.5, 2.8],
    [5.7, 2.8], [6.3, 3.3], [4.9, 2.4], [6.6, 2.9], [5.2, 2.7],
    [5.0, 2.0], [5.9, 3.0], [6.0, 2.2], [6.1, 2.9], [5.6, 2.9],
    [6.7, 3.1], [5.6, 3.0], [5.8, 2.7], [6.2, 2.2], [5.6, 2.5],
    [5.9, 3.2], [6.1, 2.8], [6.3, 2.5], [6.1, 2.8], [6.4, 2.9],
    [6.6, 3.0], [6.8, 2.8], [6.7, 3.0], [6.0, 2.9], [5.7, 2.6],
    [5.5, 2.4], [5.5, 2.4], [5.8, 2.7], [6.0, 2.7], [5.4, 3.0],
    [6.0, 3.4], [6.7, 3.1], [6.3, 2.3], [5.6, 3.0], [5.5, 2.5],
    [5.5, 2.6], [6.1, 3.0], [5.8, 2.6], [5.0, 2.3], [5.6, 2.7],
    [5.7, 3.0], [5.7, 2.9], [6.2, 2.9], [5.1, 2.5], [5.7, 2.8]
  ],
  labels: [
    // Setosa: 0
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // Versicolor: 1
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ]
}

/**
 * Wine Dataset (UCI ML Repository)
 * Wine chemical analysis for classification
 * 178 samples, 13 features, 3 classes
 */
export const wineDataset: Dataset = {
  name: 'Wine',
  description: '葡萄酒数据集 - 化学成分分析',
  features: ['Alcohol', 'Malic Acid', 'Ash', 'Alcalinity', 'Magnesium', 'Total Phenols',
             'Flavanoids', 'Nonflavanoid Phenols', 'Proanthocyanins', 'Color Intensity',
             'Hue', 'OD280/OD315', 'Proline'],
  target: 'Wine Class',
  numSamples: 178,
  numFeatures: 13,
  numClasses: 3,
  // Simplified: First 2 features (Alcohol and Malic Acid), subset of samples
  data: [
    // Class 0 - 30 samples
    [14.23, 2.43], [13.20, 2.14], [13.16, 2.67], [14.37, 2.50], [13.24, 2.87],
    [14.20, 2.45], [14.39, 2.74], [14.06, 2.05], [14.83, 2.57], [13.86, 3.50],
    [14.10, 2.16], [14.12, 2.91], [13.75, 3.40], [14.75, 2.48], [14.38, 3.59],
    [13.63, 3.17], [14.30, 2.72], [13.83, 3.36], [14.19, 3.22], [13.64, 3.03],
    [14.06, 2.15], [12.93, 3.80], [13.71, 3.65], [12.85, 3.27], [13.50, 3.12],
    [13.05, 3.86], [13.39, 3.54], [13.30, 3.12], [13.87, 3.50], [14.02, 3.40],
    // Class 1 - 30 samples
    [12.37, 1.63], [12.33, 1.61], [12.64, 1.36], [13.67, 1.25], [12.37, 1.17],
    [12.17, 1.45], [12.37, 1.21], [13.11, 1.01], [12.37, 1.13], [13.34, 1.10],
    [12.21, 1.19], [12.29, 1.61], [13.86, 1.51], [13.49, 1.66], [12.99, 1.67],
    [11.96, 1.09], [11.66, 1.88], [13.03, 1.51], [11.84, 2.89], [12.33, 0.99],
    [12.70, 1.55], [12.00, 1.51], [12.72, 1.81], [12.08, 1.39], [13.05, 1.77],
    [11.84, 0.89], [12.67, 0.98], [12.16, 1.61], [11.65, 1.67], [11.64, 2.06],
    // Class 2 - 30 samples
    [13.49, 3.59], [12.84, 2.96], [12.93, 2.81], [13.36, 2.56], [13.52, 3.17],
    [13.62, 4.95], [12.25, 3.88], [13.16, 3.57], [13.88, 5.04], [12.87, 4.61],
    [13.32, 3.24], [13.08, 3.90], [13.50, 3.12], [12.79, 2.67], [13.11, 1.90],
    [13.23, 3.30], [12.58, 1.29], [13.17, 2.59], [13.84, 4.12], [12.45, 3.03],
    [14.34, 1.68], [13.48, 1.67], [12.36, 3.83], [13.69, 3.26], [12.85, 3.27],
    [12.96, 3.45], [13.78, 2.76], [13.73, 4.36], [13.45, 3.70], [12.82, 3.37]
  ],
  labels: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
  ]
}

/**
 * Simple Digits Dataset (subset of MNIST)
 * Handwritten digits recognition
 * Simplified 8x8 pixel images
 */
export const digitsDataset: Dataset = {
  name: 'Digits',
  description: '手写数字数据集 (8×8像素)',
  features: Array.from({ length: 64 }, (_, i) => `Pixel_${i}`),
  target: 'Digit',
  numSamples: 100,
  numFeatures: 64,
  numClasses: 10,
  // For 2D visualization, we'll use PCA-reduced features
  // These are synthetic 2D projections for demonstration
  data: [
    // Digit 0 - 10 samples
    [-2.5, 1.2], [-2.3, 1.5], [-2.7, 1.0], [-2.4, 1.3], [-2.6, 1.1],
    [-2.2, 1.4], [-2.8, 1.2], [-2.5, 1.6], [-2.4, 1.1], [-2.6, 1.3],
    // Digit 1 - 10 samples
    [3.2, 2.5], [3.5, 2.3], [3.0, 2.7], [3.3, 2.4], [3.1, 2.6],
    [3.4, 2.2], [3.2, 2.8], [3.6, 2.5], [3.1, 2.4], [3.3, 2.6],
    // Digit 2 - 10 samples
    [1.5, -2.2], [1.3, -2.5], [1.7, -2.0], [1.4, -2.3], [1.6, -2.1],
    [1.2, -2.4], [1.8, -2.2], [1.5, -2.6], [1.4, -2.1], [1.6, -2.3],
    // Digit 3 - 10 samples
    [-1.2, -1.8], [-1.5, -1.6], [-1.0, -2.0], [-1.3, -1.7], [-1.1, -1.9],
    [-1.4, -1.5], [-1.2, -2.1], [-1.6, -1.8], [-1.1, -1.7], [-1.3, -1.9],
    // Digit 4 - 10 samples
    [0.5, 3.2], [0.3, 3.5], [0.7, 3.0], [0.4, 3.3], [0.6, 3.1],
    [0.2, 3.4], [0.8, 3.2], [0.5, 3.6], [0.4, 3.1], [0.6, 3.3],
    // Digit 5 - 10 samples
    [-3.5, -0.5], [-3.3, -0.3], [-3.7, -0.7], [-3.4, -0.4], [-3.6, -0.6],
    [-3.2, -0.2], [-3.8, -0.5], [-3.5, -0.8], [-3.4, -0.6], [-3.6, -0.4],
    // Digit 6 - 10 samples
    [2.5, -1.2], [2.3, -1.5], [2.7, -1.0], [2.4, -1.3], [2.6, -1.1],
    [2.2, -1.4], [2.8, -1.2], [2.5, -1.6], [2.4, -1.1], [2.6, -1.3],
    // Digit 7 - 10 samples
    [-0.8, 2.5], [-0.6, 2.3], [-1.0, 2.7], [-0.7, 2.4], [-0.9, 2.6],
    [-0.5, 2.2], [-1.1, 2.5], [-0.8, 2.8], [-0.7, 2.6], [-0.9, 2.4],
    // Digit 8 - 10 samples
    [0.2, -3.5], [0.4, -3.3], [0.0, -3.7], [0.3, -3.4], [0.1, -3.6],
    [0.5, -3.2], [-0.1, -3.5], [0.2, -3.8], [0.3, -3.6], [0.1, -3.4],
    // Digit 9 - 10 samples
    [4.2, -0.5], [4.0, -0.3], [4.4, -0.7], [4.1, -0.4], [4.3, -0.6],
    [3.9, -0.2], [4.5, -0.5], [4.2, -0.8], [4.1, -0.6], [4.3, -0.4]
  ],
  labels: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  ]
}

/**
 * Generate synthetic regression dataset
 */
export function generateRegressionData(
  numSamples: number,
  trueSlope: number,
  trueIntercept: number,
  noise: number = 5
): { x: number[], y: number[] } {
  const x: number[] = []
  const y: number[] = []

  for (let i = 0; i < numSamples; i++) {
    const xi = Math.random() * 10
    const yi = trueSlope * xi + trueIntercept + (Math.random() - 0.5) * noise
    x.push(xi)
    y.push(yi)
  }

  return { x, y }
}

/**
 * Generate synthetic classification dataset (2D)
 */
export function generateClassificationData(
  numSamples: number,
  numClasses: number = 2
): { data: number[][], labels: number[] } {
  const data: number[][] = []
  const labels: number[] = []

  const samplesPerClass = Math.floor(numSamples / numClasses)

  for (let c = 0; c < numClasses; c++) {
    const centerX = Math.cos((2 * Math.PI * c) / numClasses) * 3
    const centerY = Math.sin((2 * Math.PI * c) / numClasses) * 3

    for (let i = 0; i < samplesPerClass; i++) {
      const r = Math.random() * 1.5
      const theta = Math.random() * 2 * Math.PI
      const x = centerX + r * Math.cos(theta)
      const y = centerY + r * Math.sin(theta)

      data.push([x, y])
      labels.push(c)
    }
  }

  return { data, labels }
}

export const allDatasets = {
  iris: irisDataset,
  wine: wineDataset,
  digits: digitsDataset
}

export type DatasetName = keyof typeof allDatasets
