import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { defineAsyncComponent } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 使用异步组件避免 SSR 问题（D3 需要 DOM）
    // Chapter 2
    app.component(
      'ROCCurveDemo',
      defineAsyncComponent(() => import('../components/ROCCurveDemo.vue'))
    )
    app.component(
      'FormulaDerivation',
      defineAsyncComponent(() => import('../components/FormulaDerivation.vue'))
    )
    // Chapter 3
    app.component(
      'LinearRegressionDemo',
      defineAsyncComponent(() => import('../components/LinearRegressionDemo.vue'))
    )
    app.component(
      'GradientDescentViz',
      defineAsyncComponent(() => import('../components/GradientDescentViz.vue'))
    )
    app.component(
      'LogisticRegressionDemo',
      defineAsyncComponent(() => import('../components/LogisticRegressionDemo.vue'))
    )
    app.component(
      'LossContour2D',
      defineAsyncComponent(() => import('../components/LossContour2D.vue'))
    )
    app.component(
      'LossSurface3D',
      defineAsyncComponent(() => import('../components/LossSurface3D.vue'))
    )
    // Chapter 4
    app.component(
      'DecisionTreeViz',
      defineAsyncComponent(() => import('../components/DecisionTreeViz.vue'))
    )
    app.component(
      'EntropyCalculator',
      defineAsyncComponent(() => import('../components/EntropyCalculator.vue'))
    )
    // Chapter 5
    app.component(
      'PerceptronLearningDemo',
      defineAsyncComponent(() => import('../components/PerceptronLearningDemo.vue'))
    )
    app.component(
      'NeuralNetworkViz',
      defineAsyncComponent(() => import('../components/NeuralNetworkViz.vue'))
    )
    app.component(
      'ActivationFunctionViz',
      defineAsyncComponent(() => import('../components/ActivationFunctionViz.vue'))
    )
    app.component(
      'BackpropagationDemo',
      defineAsyncComponent(() => import('../components/BackpropagationDemo.vue'))
    )
    // Chapter 6
    app.component(
      'SVMVisualization',
      defineAsyncComponent(() => import('../components/SVMVisualization.vue'))
    )
    app.component(
      'KernelComparison',
      defineAsyncComponent(() => import('../components/KernelComparison.vue'))
    )
    // Chapter 7
    app.component(
      'NaiveBayesDemo',
      defineAsyncComponent(() => import('../components/NaiveBayesDemo.vue'))
    )
    // Chapter 8
    app.component(
      'RandomForestDemo',
      defineAsyncComponent(() => import('../components/RandomForestDemo.vue'))
    )
    // Chapter 9
    app.component(
      'KMeansVisualization',
      defineAsyncComponent(() => import('../components/KMeansVisualization.vue'))
    )
    // Chapter 10
    app.component(
      'PCAVisualization',
      defineAsyncComponent(() => import('../components/PCAVisualization.vue'))
    )
    // Chapter 11
    app.component(
      'LassoPathDemo',
      defineAsyncComponent(() => import('../components/LassoPathDemo.vue'))
    )
    // Chapter 12
    app.component(
      'VCDimensionDemo',
      defineAsyncComponent(() => import('../components/VCDimensionDemo.vue'))
    )
    // Chapter 13
    app.component(
      'LabelPropagationDemo',
      defineAsyncComponent(() => import('../components/LabelPropagationDemo.vue'))
    )
    // Chapter 15
    app.component(
      'RuleLearningDemo',
      defineAsyncComponent(() => import('../components/RuleLearningDemo.vue'))
    )
    // Chapter 16
    app.component(
      'QLearningDemo',
      defineAsyncComponent(() => import('../components/QLearningDemo.vue'))
    )
  },
} satisfies Theme
