#!/bin/bash

# 生成所有章节的 OG 图片
# 使用方法: ./scripts/generate-chapter-og.sh

echo "🎨 生成章节 OG 图片..."

chapters=(
  "2:模型评估与选择:Model Evaluation"
  "3:线性模型:Linear Models"
  "4:决策树:Decision Trees"
  "5:神经网络:Neural Networks"
  "6:支持向量机:Support Vector Machine"
  "7:贝叶斯分类器:Bayesian Classifier"
  "8:集成学习:Ensemble Learning"
  "9:聚类:Clustering"
  "10:降维与度量学习:Dimensionality Reduction"
  "11:特征选择与稀疏学习:Feature Selection"
  "12:计算学习理论:Learning Theory"
  "13:半监督学习:Semi-Supervised Learning"
  "14:概率图模型:Graphical Models"
  "15:规则学习:Rule Learning"
  "16:强化学习:Reinforcement Learning"
)

mkdir -p public/og/chapters

for chapter in "${chapters[@]}"; do
  IFS=':' read -r id title subtitle <<< "$chapter"
  
  echo "  生成第 $id 章: $title"
  
  curl -s "http://localhost:3000/api/og?title=$title&subtitle=$subtitle" \
    -o "public/og/chapters/chapter-$id.png"
  
  sleep 0.5
done

echo "✅ 完成！生成了 ${#chapters[@]} 张图片"
echo "📁 位置: public/og/chapters/"
