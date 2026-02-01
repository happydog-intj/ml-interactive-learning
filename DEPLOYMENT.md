# 🚀 机器学习交互式学习平台 - 部署指南

## 快速部署到 Vercel

### 步骤 1: 推送到 GitHub

```bash
# 设置 GitHub 远程仓库
git remote add origin https://github.com/unknownnotingsnow/ml-interactive-learning.git

# 推送代码到 GitHub
git push -u origin main
```

如果遇到权限问题，需要先在 GitHub 创建仓库：
1. 访问 https://github.com/new
2. 仓库名: `ml-interactive-learning`
3. 设置为 Public（公开）或 Private（私有）
4. 不要勾选 "Initialize with README"（因为本地已有代码）
5. 点击 "Create repository"

### 步骤 2: 部署到 Vercel（推荐方式）

#### 方式 A：网页部署（最简单）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 或 "Log In"
   - 选择 "Continue with GitHub"

2. **导入项目**
   - 登录后点击 "Add New..." → "Project"
   - 在列表中找到 `unknownnotingsnow/ml-interactive-learning`
   - 点击 "Import"

3. **配置项目**
   - Project Name: `ml-interactive-learning`（或自定义）
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`
   - 保持其他默认设置

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟构建完成
   - 获得部署地址：`https://ml-interactive-learning.vercel.app`

#### 方式 B：命令行部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
```

### 步骤 3: 自动部署设置

部署完成后，每次推送到 GitHub 的 main 分支，Vercel 会自动重新部署：

```bash
# 后续更新只需要：
git add .
git commit -m "更新内容"
git push
```

## 📊 项目信息

- **框架**: Next.js 16.1.6 (App Router)
- **React 版本**: 19.2.3
- **TypeScript**: 5.x
- **样式**: Tailwind CSS 4
- **交互**: Framer Motion, GSAP
- **可视化**: D3.js, Plotly.js, Three.js

## 🔗 相关链接

- **GitHub**: https://github.com/unknownnotingsnow/ml-interactive-learning
- **Vercel 部署**: https://vercel.com/dashboard
- **项目文档**: 查看项目根目录的 README.md

## ⚡ 性能优化建议

Vercel 免费计划限制：
- ✅ 100GB 带宽/月
- ✅ 无限请求数
- ✅ 自动 HTTPS
- ✅ 全球 CDN

如需更高性能，可以升级到 Pro 计划（$20/月）。

## 🐛 故障排除

### 构建失败？
检查以下内容：
1. `package.json` 中的依赖版本是否正确
2. 所有必要文件是否已提交到 Git
3. 查看 Vercel 控制台的构建日志

### 运行时错误？
1. 检查浏览器控制台的错误信息
2. 查看 Vercel 的 Runtime Logs
3. 确保所有环境变量（如有）已在 Vercel 配置

## 📧 支持

遇到问题？
- 查看 Vercel 文档: https://vercel.com/docs
- Next.js 文档: https://nextjs.org/docs

---

部署愉快！🎉
