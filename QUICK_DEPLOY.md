# ⚡ 快速部署指南

## 🎯 三步完成部署

### Step 1: 创建 GitHub 仓库
```
访问: https://github.com/new
仓库名: ml-interactive-learning
类型: Public
不勾选任何初始化选项
```

### Step 2: 推送代码
```bash
git push -u origin main
```

### Step 3: 部署到 Vercel
```
1. 访问: https://vercel.com/new
2. 用 GitHub 账号登录
3. 选择 unknownnotingsnow/ml-interactive-learning
4. 点击 Deploy
5. 等待 2-3 分钟
```

## 🌐 预期结果

部署成功后你会得到：
- ✅ 一个公开访问的网址: `https://ml-interactive-learning-xxx.vercel.app`
- ✅ 自动 HTTPS 和 CDN 加速
- ✅ 每次 git push 自动重新部署

## 📝 后续更新流程

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push

# Vercel 会自动部署新版本（约 2-3 分钟）
```

## 🔗 重要链接

- GitHub: https://github.com/unknownnotingsnow/ml-interactive-learning
- Vercel Dashboard: https://vercel.com/dashboard
- 部署状态: 推送后在 Vercel 查看

---

遇到问题？查看完整文档: DEPLOYMENT.md
