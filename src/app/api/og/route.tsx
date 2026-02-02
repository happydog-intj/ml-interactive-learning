import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || '机器学习交互式学习平台'
    const subtitle = searchParams.get('subtitle') || '基于周志华《机器学习》教材'

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
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 217, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(184, 76, 255, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)
            `,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {/* 顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #00d9ff 0%, #6366f1 50%, #b84cff 100%)',
            }}
          />

          {/* Logo 图标 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #00d9ff 0%, #6366f1 100%)',
              marginBottom: '40px',
              fontSize: '60px',
            }}
          >
            📊
          </div>

          {/* 主标题 */}
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #00d9ff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              maxWidth: '1000px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {/* 副标题 */}
          <div
            style={{
              display: 'flex',
              fontSize: '36px',
              color: '#00d9ff',
              marginTop: '30px',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </div>

          {/* 描述文字 */}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              color: '#888',
              marginTop: '40px',
              textAlign: 'center',
            }}
          >
            通过可视化和动画深入理解核心概念
          </div>

          {/* 统计数据 */}
          <div
            style={{
              display: 'flex',
              marginTop: '60px',
              gap: '60px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00d9ff' }}>16</div>
              <div style={{ fontSize: '20px', color: '#666', marginTop: '8px' }}>章节</div>
            </div>
            <div
              style={{
                width: '2px',
                height: '60px',
                background: 'linear-gradient(180deg, transparent 0%, #333 50%, transparent 100%)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff88' }}>80+</div>
              <div style={{ fontSize: '20px', color: '#666', marginTop: '8px' }}>核心概念</div>
            </div>
            <div
              style={{
                width: '2px',
                height: '60px',
                background: 'linear-gradient(180deg, transparent 0%, #333 50%, transparent 100%)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#b84cff' }}>∞</div>
              <div style={{ fontSize: '20px', color: '#666', marginTop: '8px' }}>学习可能</div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              fontSize: '20px',
              color: '#666',
              fontFamily: 'monospace',
            }}
          >
            ML Interactive Learning
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`Error generating OG image: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
