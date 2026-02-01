# 机器学习交互式学习平台

基于《机器学习》（周志华）的交互式学习平台，通过可视化和动画深入理解机器学习核心概念。

## 🎯 项目特色

- **3Blue1Brown 风格动画**：精心设计的 GSAP 动画展示数学公式推导过程
- **交互式可视化**：使用 D3.js 实现的实时交互演示，可调整参数观察效果
- **完整的理论内容**：从基础概念到数学推导，循序渐进的学习路径
- **实战练习**：每章配备思考题和实践练习
- **响应式设计**：适配各种屏幕尺寸，优雅的暗色主题

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

## 🎨 设计系统

### 颜色方案
- **ml-blue**: `#58C4DD` - 主题色
- **ml-yellow**: 警告和强调
- **ml-red**: 错误和负类
- **ml-green**: 成功和正类
- **ml-purple**: 特殊高亮

### 字体
- 内容：Inter, Noto Sans SC
- 代码：Fira Code, Monaco

## 📋 开发路线图

### ✅ 已完成
- [x] 项目初始化和技术栈搭建
- [x] 设计系统和颜色方案
- [x] 第2章：模型评估与选择（完整）
- [x] 第3章：线性模型（完整）
- [x] ML 算法库基础设施
- [x] 通用图表组件库
- [x] 根布局优化和元数据

### 🔄 待实现
- [ ] 第4章：决策树
- [ ] 第5章：神经网络
- [ ] 3D 可视化示例（损失曲面）
- [ ] 真实数据集集成（Iris, Wine, Digits）
- [ ] Monaco 代码编辑器集成
- [ ] 测试框架建立
- [ ] 性能优化
- [ ] 部署配置

### 🎯 未来计划
- [ ] 第6章：支持向量机
- [ ] 第8章：集成学习
- [ ] 用户进度跟踪
- [ ] 代码练习评测
- [ ] 多语言支持

## 📁 项目结构

```
ml-interactive-learning/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── chapter/
│   │   │   ├── 2/             # 第2章
│   │   │   └── 3/             # 第3章
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页
│   ├── components/
│   │   ├── animations/        # 动画组件
│   │   ├── charts/           # 通用图表
│   │   ├── ui/               # UI 组件
│   │   └── visualizations/   # 专用可视化
│   └── lib/
│       └── ml-algorithms/    # ML 算法库
├── public/                    # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.ts
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
