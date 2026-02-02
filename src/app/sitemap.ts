import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ml-interactive-learning.vercel.app'
  
  // 章节列表
  const chapters = [
    { id: 2, title: '模型评估与选择', lastmod: '2026-02-01' },
    { id: 3, title: '线性模型', lastmod: '2026-02-01' },
    { id: 4, title: '决策树', lastmod: '2026-02-01' },
    { id: 5, title: '神经网络', lastmod: '2026-02-01' },
    { id: 6, title: '支持向量机', lastmod: '2026-02-01' },
    { id: 7, title: '贝叶斯分类器', lastmod: '2026-02-01' },
    { id: 8, title: '集成学习', lastmod: '2026-02-01' },
    { id: 9, title: '聚类', lastmod: '2026-02-01' },
    { id: 10, title: '降维与度量学习', lastmod: '2026-02-01' },
    { id: 11, title: '特征选择与稀疏学习', lastmod: '2026-02-01' },
    { id: 12, title: '计算学习理论', lastmod: '2026-02-01' },
    { id: 13, title: '半监督学习', lastmod: '2026-02-01' },
    { id: 14, title: '概率图模型', lastmod: '2026-02-01' },
    { id: 15, title: '规则学习', lastmod: '2026-02-01' },
    { id: 16, title: '强化学习', lastmod: '2026-02-01' },
  ]

  return [
    // 首页 - 最高优先级
    {
      url: baseUrl,
      lastModified: new Date('2026-02-02'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // 章节页面
    ...chapters.map((chapter) => ({
      url: `${baseUrl}/chapter/${chapter.id}`,
      lastModified: new Date(chapter.lastmod),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // 关于页面（如果有）
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ]
}
