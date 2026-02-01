#!/bin/bash

# 🚀 机器学习交互式学习平台 - 自动化部署脚本
# 使用方法: ./deploy.sh [commit-message]

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 机器学习交互式学习平台 - 自动部署"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 获取提交信息
COMMIT_MSG="${1:-Update: $(date +'%Y-%m-%d %H:%M:%S')}"

# Step 1: Git 状态检查
echo "📋 Step 1: 检查 Git 状态..."
git status --short

if [[ -n $(git status --porcelain) ]]; then
    echo ""
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
    echo "✅ 提交完成"
else
    echo "✅ 工作区干净，无需提交"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: 推送到 GitHub
echo "📤 Step 2: 推送到 GitHub..."
git push origin main
echo "✅ 推送成功"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: 部署到 Vercel
echo "🚀 Step 3: 部署到 Vercel..."
echo ""

if command -v vercel &> /dev/null; then
    echo "使用 Vercel CLI 部署..."
    vercel --prod
else
    echo "⚠️  Vercel CLI 未安装"
    echo ""
    echo "请选择以下方式之一："
    echo ""
    echo "方式 1: 安装 Vercel CLI 并部署"
    echo "  npm install -g vercel"
    echo "  vercel login"
    echo "  vercel --prod"
    echo ""
    echo "方式 2: 网页部署（推荐）"
    echo "  访问: https://vercel.com/dashboard"
    echo "  Vercel 会自动检测到你的 Git push 并开始部署"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 部署流程完成！"
echo ""
echo "📊 项目信息："
echo "  GitHub: https://github.com/uknownothingsnow/ml-interactive-learning"
echo "  Vercel: https://vercel.com/dashboard"
echo ""
echo "🎉 部署愉快！"
echo ""
