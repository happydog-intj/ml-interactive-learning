#!/bin/bash

# 生成所有章节的 OG 图片
# 使用方法: ./scripts/generate-chapter-og.sh

echo "🎨 生成章节 OG 图片..."

chapters=(
  "2:Model Evaluation:Ch.2"
  "3:Linear Models:Ch.3"
  "4:Decision Trees:Ch.4"
  "5:Neural Networks:Ch.5"
  "6:Support Vector Machine:Ch.6"
  "7:Bayesian Classifier:Ch.7"
  "8:Ensemble Learning:Ch.8"
  "9:Clustering:Ch.9"
  "10:Dimensionality Reduction:Ch.10"
  "11:Feature Selection:Ch.11"
  "12:Learning Theory:Ch.12"
  "13:Semi-Supervised Learning:Ch.13"
  "14:Graphical Models:Ch.14"
  "15:Rule Learning:Ch.15"
  "16:Reinforcement Learning:Ch.16"
)

mkdir -p public/og/chapters

for chapter in "${chapters[@]}"; do
  IFS=':' read -r id title subtitle <<< "$chapter"
  
  # URL encode the parameters
  encoded_title=$(echo "$title" | sed 's/ /%20/g')
  encoded_subtitle=$(echo "$subtitle" | sed 's/ /%20/g')
  
  echo "  生成第 $id 章: $title → chapter-$id.png"
  
  curl -s "http://localhost:3000/api/og?title=${encoded_title}&subtitle=${encoded_subtitle}" \
    -o "public/og/chapters/chapter-$id.png"
  
  if [ -s "public/og/chapters/chapter-$id.png" ]; then
    echo "    ✓ 成功 ($(du -h public/og/chapters/chapter-$id.png | cut -f1))"
  else
    echo "    ✗ 失败"
  fi
  
  sleep 0.5
done

echo "✅ 完成！生成了 ${#chapters[@]} 张图片"
echo "📁 位置: public/og/chapters/"
