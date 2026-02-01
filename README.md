# 机器学习交互式学习平台

<div align="center">

![ML Interactive Learning](https://img.shields.io/badge/ML-Interactive_Learning-00D9FF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**基于周志华《机器学习》教材的交互式学习平台**

通过动画和交互式可视化深入理解机器学习核心概念

[在线演示](#) | [快速开始](#-快速开始) | [功能特性](#-功能特性)

</div>

---

## ✨ 功能特性

### 📚 完整的课程体系

5个核心章节全部完成，包含20+交互式可视化

| 章节 | 标题 | 主要内容 | 交互演示 | 状态 |
|------|------|---------|---------|------|
| 📊 **第2章** | 模型评估与选择 | 混淆矩阵、ROC曲线、AUC、偏差方差 | ROC曲线演示、公式推导动画 | ✅ 完成 |
| 📈 **第3章** | 线性模型 | 线性回归、梯度下降、逻辑回归、正则化 | 线性回归、梯度下降、逻辑回归演示 | ✅ 完成 |
| 🌳 **第4章** | 决策树 | 信息增益、基尼指数、剪枝、连续值处理 | 决策树构建器、信息熵计算器 | ✅ 完成 |
| 🧠 **第5章** | 神经网络 | 神经元模型、前向传播、反向传播、深度学习 | 网络结构可视化、激活函数对比、BP算法演示 | ✅ 完成 |

### 🎨 现代化设计系统

**"Scientific Elegance with Kinetic Energy"**

- 🌈 **大胆配色**: 电光青 • 紫色 • 霓虹绿 • 渐变效果
- ✨ **精致动画**: 页面加载序列 • 3D卡片变换 • 悬停发光
- 🎯 **高对比度**: 15:1+对比度，深空背景+亮色文字
- 📐 **技术美感**: 网格图案 • 几何精确 • 锐利边框
- 🔤 **独特字体**: Sora（现代几何） + JetBrains Mono（技术精确）

## 🚀 技术栈

### 前端框架
- **Next.js 16** - React 服务端渲染框架
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 实用优先的 CSS 框架

### 可视化
- **D3.js 7** - 数据驱动的可视化
- **Three.js + React Three Fiber** - 3D 可视化（规划中）
- **Plotly.js** - 科学图表（规划中）

### 动画
- **GSAP 3** - 高性能动画库
- **Framer Motion** - React 动画库

### 数学渲染
- **KaTeX** - 快速数学公式渲染

## 📚 已完成章节

### ✅ 第2章：模型评估与选择
**内容亮点：**
- 交互式 ROC 曲线演示
  - 实时阈值调整
  - 混淆矩阵可视化
  - 完整评估指标（准确率、精确率、召回率、F1、AUC）
- 3Blue1Brown 风格公式推导动画
  - 混淆矩阵逐步构建
  - TPR/FPR 公式分步展示
  - 动态高亮相关元素
- 完整理论讲解
  - 评估指标基础
  - ROC 曲线与 AUC
  - 偏差-方差权衡
- 实践练习和思考题

### ✅ 第3章：线性模型
**内容亮点：**
- 线性回归交互式演示
  - 手动调整斜率和截距
  - 实时损失函数（MSE）计算
  - 梯度下降训练动画
  - 残差可视化
- 梯度下降可视化
  - 损失函数曲线
  - 优化轨迹追踪
  - 学习率对收敛的影响
  - 梯度方向展示
- 逻辑回归演示
  - 决策边界可视化
  - 概率热图
  - Sigmoid 函数
  - 实时准确率计算
- 正则化理论讲解
  - L1 vs L2 对比
  - 几何直观解释

## 🛠️ 核心功能

### ML 算法库 (`src/lib/ml-algorithms/`)
完整的机器学习算法实现，包括：

**评估指标** (`metrics.ts`):
- 分类：accuracy, precision, recall, F1 score
- 回归：MSE, RMSE, MAE, R² score
- ROC：AUC 计算，ROC 曲线生成
- 混淆矩阵工具

**数据处理** (`data-utils.ts`):
- 训练集/测试集划分
- 标准化（Z-score）
- 归一化（Min-Max）
- K 折交叉验证
- 距离度量（欧氏、曼哈顿）
- 矩阵运算

**模型实现** (`linear-regression.ts`):
- 线性回归（闭式解和梯度下降）
- 完整的 TypeScript 类型支持

### 通用图表组件 (`src/components/charts/`)
可复用的可视化组件：
- **ScatterPlot**: 散点图，支持分类着色
- **LineChart**: 折线图，平滑曲线插值
- **ConfusionMatrix**: 混淆矩阵，颜色编码

## 📖 开发指南

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本
```bash
npm run build
npm start
```

### 类型检查
```bash
npx tsc --noEmit
```

### 运行测试
```bash
npm test                # 运行全部测试
npm run test:watch      # 监听模式
npm run test:coverage   # 生成覆盖率报告
```

## 🎨 设计系统

完整设计文档：[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

### 配色方案 2.0

```css
/* 主色调 - 电光科技感 */
--ml-blue:   #00D9FF  /* 电光青 */
--ml-cyan:   #00FFF5  /* 亮青色 */
--ml-purple: #B84CFF  /* 生动紫 */
--ml-green:  #00FF88  /* 霓虹绿 */
--ml-yellow: #FFE600  /* 亮黄色 */
--ml-orange: #FF8A00  /* 橙色 */
--ml-red:    #FF3366  /* 红色 */

/* 背景 - 深空主题 */
--ml-bg-dark:      #0A0E14  /* 主背景 */
--ml-bg-secondary: #151B26  /* 次级表面 */
--ml-bg-card:      #1A2332  /* 卡片背景 */
--ml-border:       #2A3C52  /* 边框 */
```

### 字体系统

- **Sora**: 现代几何无衬线字体（标题+正文）
- **JetBrains Mono**: 等宽技术字体（代码+数据）
- **Noto Sans SC**: 中文回退字体

### 动画库

```css
gradient-shift: 8s ease infinite      /* 渐变漂移 */
float: 6s ease-in-out infinite        /* 浮动效果 */
pulse-glow: 2s ease-in-out infinite   /* 脉冲发光 */
slide-up: 0.6s ease-out               /* 上滑入场 */
slide-in: 0.5s ease-out               /* 侧滑入场 */
```

## 🎮 交互式可视化亮点

### 第2章：模型评估与选择
- 📊 **ROC曲线演示** - 实时阈值调整，观察TPR/FPR变化，混淆矩阵联动
- 🎬 **公式推导动画** - 3Blue1Brown风格，混淆矩阵→TPR/FPR公式逐步推导

### 第3章：线性模型
- 📈 **线性回归演示** - 手动调参or梯度下降训练，残差可视化
- 🔄 **梯度下降可视化（2D）** - 损失曲面，优化轨迹，学习率影响
- 🌐 **3D损失曲面** - 三种损失函数（二次/Rosenbrock/Beale），3D梯度下降路径
- 🎯 **逻辑回归演示** - 决策边界，概率热图，真实数据集支持
- 💻 **代码练习** - 实现梯度下降算法（Monaco编辑器）

### 第4章：决策树
- 🌳 **决策树构建器** - 3种划分标准对比，决策边界可视化，节点检查
- 📊 **信息熵计算器** - 实时计算熵值，可视化计算过程，饼图分布

### 第5章：神经网络
- 🧠 **神经网络结构** - 可调节层数节点数，前向传播动画
- 📉 **激活函数对比** - 4种函数（Sigmoid/ReLU/Tanh/Leaky ReLU）图形+导数
- 🔁 **反向传播演示** - 4阶段完整BP算法，梯度和权重实时显示
- 💻 **代码练习** - 实现Sigmoid激活函数及其导数

## 📋 开发路线图

### ✅ 已完成（2024）
- [x] 项目初始化和技术栈搭建
- [x] 设计系统2.0（Scientific Elegance风格）
- [x] **第2章**：模型评估与选择（完整）
- [x] **第3章**：线性模型（完整）
- [x] **第4章**：决策树（完整）
- [x] **第5章**：神经网络（完整）
- [x] ML算法库基础设施
- [x] 通用图表组件库
- [x] UI组件库（ChapterNav, ChapterHeader, InfoCard, DemoCard, Section）
- [x] 根布局优化和元数据
- [x] 完整的设计文档

### ✅ 新增完成（2026-02）
- [x] **3D可视化示例** - 3D损失曲面可视化（Three.js + React Three Fiber）
- [x] **真实数据集集成** - Iris、Wine、Digits数据集，支持逻辑回归演示
- [x] **Monaco代码编辑器** - 交互式代码练习环境，支持Python/JavaScript
- [x] **测试框架** - Jest + React Testing Library，33个测试用例全部通过

### 🔄 待实现
- [ ] 部署配置（Vercel/Netlify）

### 🎯 未来计划
- [ ] 第6章：支持向量机
- [ ] 第7章：贝叶斯分类器
- [ ] 第8章：集成学习
- [ ] 用户进度跟踪
- [ ] 代码练习评测系统
- [ ] 多语言支持（英文）
- [ ] 移动端App（React Native）

## 📁 项目结构

```
ml-interactive-learning/
├── src/
│   ├── app/                        # Next.js 16 App Router
│   │   ├── chapter/
│   │   │   ├── 2/page.tsx         # 第2章：模型评估与选择
│   │   │   ├── 3/page.tsx         # 第3章：线性模型
│   │   │   ├── 4/page.tsx         # 第4章：决策树
│   │   │   └── 5/page.tsx         # 第5章：神经网络
│   │   ├── globals.css            # 全局样式+动画
│   │   ├── layout.tsx             # 根布局+元数据
│   │   └── page.tsx               # 主页（章节卡片）
│   ├── components/
│   │   ├── ui/                    # UI组件库
│   │   │   ├── ChapterHeader.tsx # 章节标题组件
│   │   │   ├── ChapterNav.tsx    # 导航栏+进度条
│   │   │   ├── DemoCard.tsx      # 交互演示包装器
│   │   │   ├── InfoCard.tsx      # 理论卡片（4种变体）
│   │   │   └── Section.tsx       # 章节区块
│   │   ├── visualizations/       # 交互式可视化
│   │   │   ├── ROCCurveDemo.tsx
│   │   │   ├── LinearRegressionDemo.tsx
│   │   │   ├── GradientDescentViz.tsx
│   │   │   ├── LogisticRegressionDemo.tsx
│   │   │   ├── DecisionTreeViz.tsx
│   │   │   ├── EntropyCalculator.tsx
│   │   │   ├── NeuralNetworkViz.tsx
│   │   │   ├── ActivationFunctionViz.tsx
│   │   │   └── BackpropagationDemo.tsx
│   │   ├── animations/           # GSAP动画
│   │   │   └── FormulaDerivation.tsx
│   │   └── charts/              # D3图表组件
│   │       ├── ScatterPlot.tsx
│   │       ├── LineChart.tsx
│   │       └── ConfusionMatrix.tsx
│   └── lib/
│       └── ml-algorithms/        # ML算法实现
│           ├── linear-regression.ts
│           ├── metrics.ts
│           └── data-utils.ts
├── public/                       # 静态资源
├── DESIGN_SYSTEM.md             # 设计系统文档
├── package.json
├── tsconfig.json
├── tailwind.config.ts           # Tailwind 4配置
└── README.md
```

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- 《机器学习》by 周志华
- [3Blue1Brown](https://www.3blue1brown.com/) - 动画风格灵感来源
- [D3.js](https://d3js.org/) - 强大的可视化库
- [Next.js](https://nextjs.org/) - 优秀的 React 框架

---

**由 Claude Opus 4.5 协助开发** 🤖
