# OG 图片生成指南

## 规格要求
- **尺寸**: 1200 x 630 像素
- **格式**: PNG 或 JPG
- **大小**: < 8MB（推荐 < 300KB）
- **位置**: `/public/og-image.png`

## 设计建议

### 主要元素
1. **标题**: "机器学习交互式学习平台"
2. **副标题**: "基于周志华《机器学习》教材"
3. **视觉元素**: 
   - 渐变背景（蓝色系，呼应网站主题）
   - 数学公式或图表元素
   - 3D 可视化效果

### 配色方案（与网站一致）
```
背景: #1a1a1a (深色)
主色: #00d9ff (cyan)
辅色: #6366f1 (blue)
强调: #b84cff (purple)
```

## 快速生成方法

### 方法 1: 使用 Figma（推荐）
1. 创建 1200x630 画布
2. 添加渐变背景
3. 添加文字和图标
4. 导出为 PNG

### 方法 2: 使用 Canva
1. 模板: "Facebook Post" 或自定义 1200x630
2. 套用深色科技风格模板
3. 替换文字为中文
4. 下载为 PNG

### 方法 3: 使用代码生成（Next.js OG Image）

安装依赖:
```bash
npm install @vercel/og
```

创建 API 路由:
```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #00d9ff22 100%)',
        }}
      >
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 'bold', color: 'white' }}>
          机器学习交互式学习平台
        </div>
        <div style={{ display: 'flex', fontSize: 40, color: '#00d9ff', marginTop: 20 }}>
          基于周志华《机器学习》教材
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#888', marginTop: 40 }}>
          通过可视化和动画深入理解核心概念
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### 方法 4: 临时占位图
创建简单的占位图:
```bash
# 安装 ImageMagick
brew install imagemagick

# 生成占位图
convert -size 1200x630 -background '#1a1a1a' \
  -fill '#00d9ff' -font Arial-Bold -pointsize 60 \
  -gravity center label:'机器学习交互式学习平台\nML Interactive Learning' \
  public/og-image.png
```

## 验证工具

### 1. Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### 2. Twitter Card Validator
https://cards-dev.twitter.com/validator

### 3. LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

## 检查清单

- [ ] 尺寸正确 (1200x630)
- [ ] 文字清晰可读
- [ ] 图片大小 < 300KB
- [ ] 文件名: `og-image.png`
- [ ] 路径: `/public/og-image.png`
- [ ] 在多个社交平台测试

## 示例文案

### 版本 1（简洁）
```
机器学习交互式学习平台
通过可视化理解核心概念
```

### 版本 2（详细）
```
机器学习交互式学习平台
基于周志华《机器学习》教材
16章节 | 80+核心概念 | 可视化动画
```

### 版本 3（吸引力）
```
用动画学机器学习
ROC曲线 | 决策树 | 神经网络
交互式可视化教程
```
