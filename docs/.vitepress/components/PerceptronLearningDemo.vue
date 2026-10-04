<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

type Vec3 = [number, number, number]
type Pt2 = [number, number]

interface Point {
  x1: number
  x2: number
  y: 1 | -1
}

interface StepRecord {
  t: number // 第几次检查
  epoch: number // 第几轮
  idx: number // 数据点下标
  score: number // y·wᵀx（用旧权重计算）
  updated: boolean
  wOld: Vec3
  wNew: Vec3
  k: number // 截至此步的累计更新次数
}

// 教材示例：真实分隔线 x₁ + x₂ = 3，按正负交替的顺序遍历
const EXAMPLE_POINTS: Point[] = [
  { x1: 2, x2: 3, y: 1 },
  { x1: 0, x2: 1, y: -1 },
  { x1: 4, x2: 1, y: 1 },
  { x1: 1, x2: 0, y: -1 },
  { x1: 3, x2: 4, y: 1 },
  { x1: -1, x2: 2, y: -1 },
]
const EXAMPLE_WSTAR: Vec3 = [-3, 1, 1]

const D = 6 // 数据平面坐标范围 [-D, D]
const uid = Math.random().toString(36).slice(2, 8) // 同页多实例时区分 clipPath id
const POS = '#10B981'
const NEG = '#EF4444'
const AMBER = '#d97706'
const PURPLE = '#8b5cf6'

const dataset = ref<'example' | 'random'>('example')
const points = ref<Point[]>([])
const wStarRaw = ref<Vec3>([...EXAMPLE_WSTAR])
const w = ref<Vec3>([0, 0, 0])
const shownW = ref<Vec3>([0, 0, 0]) // 动画中实际绘制的权重
const nextIdx = ref(0)
const epoch = ref(1)
const updatesThisEpoch = ref(0)
const converged = ref(false)
const records = ref<StepRecord[]>([])
const playing = ref(false)
const speed = ref(700) // 自动播放每步间隔（ms）
const showStar = ref(true)
const isDark = ref(false)

// --- 向量工具 ---
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: Vec3) => Math.sqrt(dot(a, a))
const aug = (p: Point): Vec3 => [1, p.x1, p.x2] // x₀ = 1，偏置并入权重
const addScaled = (a: Vec3, s: number, b: Vec3): Vec3 => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2]]

function fmt(v: number): string {
  const r = Math.round(v)
  if (Math.abs(v - r) < 1e-9) return String(r === 0 ? 0 : r)
  return v.toFixed(2)
}
const paren = (v: number) => (v < 0 ? `(${fmt(v)})` : fmt(v))
const vecStr = (v: Vec3) => `(${v.map(fmt).join(', ')})`

// --- 派生量 ---
const wStar = computed<Vec3>(() => {
  const n = norm(wStarRaw.value)
  return wStarRaw.value.map(v => v / n) as Vec3
})
const R = computed(() => Math.max(...points.value.map(p => norm(aug(p)))))
const gamma = computed(() => Math.min(...points.value.map(p => p.y * dot(wStar.value, aug(p)))))
const bound = computed(() => (R.value * R.value) / (gamma.value * gamma.value))
const totalUpdates = computed(() => records.value.filter(r => r.updated).length)
const lastRecord = computed(() => records.value[records.value.length - 1] ?? null)
const misclassified = computed(() => points.value.map(p => p.y * dot(w.value, aug(p)) <= 0))
const errorCount = computed(() => misclassified.value.filter(Boolean).length)
const cosTheta = computed(() => {
  const n = norm(w.value)
  return n === 0 ? null : dot(w.value, wStar.value) / n
})
const curve = computed(() => {
  const arr = [{ k: 0, proj: 0, len: 0 }]
  for (const r of records.value) {
    if (r.updated) arr.push({ k: r.k, proj: dot(r.wNew, wStar.value), len: norm(r.wNew) })
  }
  return arr
})
const recentRecords = computed(() => records.value.slice(-60).reverse())

// --- 数据集 ---
const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))

function makeRandom(): { pts: Point[]; ws: Vec3 } {
  for (let tries = 0; tries < 200; tries++) {
    const th = Math.random() * Math.PI * 2
    const ws: Vec3 = [Math.random() * 3 - 1.5, Math.cos(th), Math.sin(th)]
    const pts: Point[] = []
    let guard = 0
    while (pts.length < 14 && guard++ < 3000) {
      const x1 = randInt(-5, 5)
      const x2 = randInt(-5, 5)
      const m = ws[0] + ws[1] * x1 + ws[2] * x2 // 到真实分隔线的有符号距离
      if (Math.abs(m) < 0.8) continue
      if (pts.some(p => p.x1 === x1 && p.x2 === x2)) continue
      pts.push({ x1, x2, y: m > 0 ? 1 : -1 })
    }
    const pos = pts.filter(p => p.y === 1).length
    if (pos >= 4 && pos <= 10) return { pts: d3.shuffle(pts), ws }
  }
  return { pts: [...EXAMPLE_POINTS], ws: [...EXAMPLE_WSTAR] }
}

function loadDataset() {
  if (dataset.value === 'example') {
    points.value = EXAMPLE_POINTS.map(p => ({ ...p }))
    wStarRaw.value = [...EXAMPLE_WSTAR]
  } else {
    const { pts, ws } = makeRandom()
    points.value = pts
    wStarRaw.value = ws
  }
  reset()
}
// --- 感知器算法（步骤1：w = 0；步骤2：逐点检查并更新；步骤3：整轮无更新则终止）---
function reset() {
  stop()
  w.value = [0, 0, 0]
  nextIdx.value = 0
  epoch.value = 1
  updatesThisEpoch.value = 0
  converged.value = false
  records.value = []
}

function step(): boolean {
  if (converged.value || points.value.length === 0) return false
  const i = nextIdx.value
  const p = points.value[i]
  const x = aug(p)
  const wOld = [...w.value] as Vec3
  const score = p.y * dot(wOld, x)
  const updated = score <= 0
  const wNew = updated ? addScaled(wOld, p.y, x) : wOld
  if (updated) updatesThisEpoch.value++
  w.value = wNew
  records.value.push({
    t: records.value.length + 1,
    epoch: epoch.value,
    idx: i,
    score,
    updated,
    wOld,
    wNew,
    k: totalUpdates.value + (updated ? 1 : 0),
  })
  if (i === points.value.length - 1) {
    if (updatesThisEpoch.value === 0) {
      converged.value = true
      stop()
    } else {
      epoch.value++
      updatesThisEpoch.value = 0
    }
    nextIdx.value = 0
  } else {
    nextIdx.value = i + 1
  }
  return updated
}
const MAX_CHECKS = 20000

function stepToUpdate() {
  stop()
  for (let n = 0; n < MAX_CHECKS && !converged.value; n++) {
    if (step()) break
  }
}

function runEpoch() {
  stop()
  const e = epoch.value
  for (let n = 0; n < MAX_CHECKS && !converged.value && epoch.value === e; n++) step()
}

function runAll() {
  stop()
  for (let n = 0; n < MAX_CHECKS && !converged.value; n++) step()
}

let timer: ReturnType<typeof setTimeout> | null = null
function tickPlay() {
  if (!playing.value) return
  step()
  if (converged.value) {
    playing.value = false
    return
  }
  timer = setTimeout(tickPlay, speed.value)
}
function togglePlay() {
  if (playing.value) return stop()
  if (converged.value) return
  playing.value = true
  tickPlay()
}
function stop() {
  playing.value = false
  if (timer) clearTimeout(timer)
  timer = null
}

// --- 权重变化补间动画 ---
let raf = 0
watch(w, nw => {
  cancelAnimationFrame(raf)
  const from = [...shownW.value] as Vec3
  const dur = Math.min(380, speed.value * 0.6)
  const t0 = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / dur)
    const e = d3.easeCubicOut(t)
    shownW.value = from.map((v, i) => v + (nw[i] - v) * e) as Vec3
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})
// --- 几何工具 ---
// 保留 f(p) ≥ 0 的部分（Sutherland–Hodgman 单边裁剪）
function clipHalfPlane(poly: Pt2[], f: (p: Pt2) => number): Pt2[] {
  const out: Pt2[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const fa = f(a)
    const fb = f(b)
    if (fa >= 0) out.push(a)
    if (fa >= 0 !== fb >= 0) {
      const t = fa / (fa - fb)
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
    }
  }
  return out
}

// 直线 w₀ + w₁x₁ + w₂x₂ = 0 在 [-D, D]² 内的线段
function boundarySegment(wv: Vec3): [Pt2, Pt2] | null {
  const [w0, w1, w2] = wv
  const pts: Pt2[] = []
  const eps = 1e-9
  if (Math.abs(w2) > eps) {
    for (const x of [-D, D]) {
      const y = -(w0 + w1 * x) / w2
      if (y >= -D - eps && y <= D + eps) pts.push([x, y])
    }
  }
  if (Math.abs(w1) > eps) {
    for (const y of [-D, D]) {
      const x = -(w0 + w2 * y) / w1
      if (x >= -D - eps && x <= D + eps) pts.push([x, y])
    }
  }
  if (pts.length < 2) return null
  const a = pts[0]
  let b = pts[1]
  for (const p of pts) {
    if (Math.hypot(p[0] - a[0], p[1] - a[1]) > Math.hypot(b[0] - a[0], b[1] - a[1])) b = p
  }
  return Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6 ? null : [a, b]
}
// 像素坐标下画带箭头的线段
function arrow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x0: number, y0: number, x1: number, y1: number,
  color: string, width = 2.5, dash = '',
) {
  const len = Math.hypot(x1 - x0, y1 - y0)
  if (len < 2) return
  const ux = (x1 - x0) / len
  const uy = (y1 - y0) / len
  const head = Math.min(10, len * 0.45)
  g.append('line')
    .attr('x1', x0).attr('y1', y0)
    .attr('x2', x1 - ux * head * 0.8).attr('y2', y1 - uy * head * 0.8)
    .attr('stroke', color).attr('stroke-width', width).attr('stroke-dasharray', dash)
  g.append('path')
    .attr('d', `M${x1},${y1} L${x1 - ux * head - uy * head * 0.5},${y1 - uy * head + ux * head * 0.5} ` +
      `L${x1 - ux * head + uy * head * 0.5},${y1 - uy * head - ux * head * 0.5} Z`)
    .attr('fill', color)
}

function themeColors() {
  const dark = isDark.value
  const brand = typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-1').trim() || '#3b82f6'
    : '#3b82f6'
  return {
    dark,
    brand,
    text: dark ? '#e5e7eb' : '#374151',
    muted: dark ? '#9ca3af' : '#6b7280',
    grid: dark ? '#4b5563' : '#d1d5db',
    bg: dark ? '#1e1e2e' : '#ffffff',
    line: dark ? '#f9fafb' : '#111827',
  }
}

function styleAxis(sel: d3.Selection<SVGGElement, unknown, null, undefined>, c: ReturnType<typeof themeColors>) {
  sel.selectAll('text').attr('fill', c.muted).attr('font-size', '11px')
  sel.selectAll('line,path').attr('stroke', c.grid)
}
// --- 图 1：数据平面（决策边界 + 法向量 w）---
const planeSvg = ref<SVGSVGElement | null>(null)
const planeBox = ref<HTMLDivElement | null>(null)
const planeSize = ref(480)

function drawPlane() {
  if (!planeSvg.value) return
  const c = themeColors()
  const size = planeSize.value
  const m = { top: 16, right: 16, bottom: 40, left: 44 }
  const iw = size - m.left - m.right
  const ih = size - m.top - m.bottom
  const svg = d3.select(planeSvg.value)
  svg.selectAll('*').remove()
  svg.attr('width', size).attr('height', size).attr('viewBox', `0 0 ${size} ${size}`)
  svg.append('rect').attr('width', size).attr('height', size).attr('fill', c.bg).attr('rx', 8)
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)
  const xs = d3.scaleLinear().domain([-D, D]).range([0, iw])
  const ys = d3.scaleLinear().domain([-D, D]).range([ih, 0])
  const toPx = (p: Pt2) => `${xs(p[0])},${ys(p[1])}`
  const wv = shownW.value
  const zeroW = Math.abs(wv[0]) + Math.abs(wv[1]) + Math.abs(wv[2]) < 1e-6

  // 半平面着色：wᵀx > 0 判为 +1（绿），否则 −1（红）
  if (!zeroW) {
    const box: Pt2[] = [[-D, -D], [D, -D], [D, D], [-D, D]]
    const posPoly = clipHalfPlane(box, p => wv[0] + wv[1] * p[0] + wv[2] * p[1])
    const negPoly = clipHalfPlane(box, p => -(wv[0] + wv[1] * p[0] + wv[2] * p[1]))
    if (posPoly.length > 2) g.append('polygon').attr('points', posPoly.map(toPx).join(' ')).attr('fill', POS).attr('opacity', c.dark ? 0.14 : 0.1)
    if (negPoly.length > 2) g.append('polygon').attr('points', negPoly.map(toPx).join(' ')).attr('fill', NEG).attr('opacity', c.dark ? 0.14 : 0.1)
  }

  // 网格与坐标轴
  g.append('g').call(d3.axisLeft(ys).ticks(6).tickSize(-iw).tickFormat(() => ''))
    .call(s => s.select('.domain').remove())
    .selectAll('line').attr('stroke', c.grid).attr('opacity', 0.5)
  g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(xs).ticks(6).tickSize(-ih).tickFormat(() => ''))
    .call(s => s.select('.domain').remove())
    .selectAll('line').attr('stroke', c.grid).attr('opacity', 0.5)
  styleAxis(g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(xs).ticks(6)), c)
  styleAxis(g.append('g').call(d3.axisLeft(ys).ticks(6)), c)
  g.append('text').attr('x', iw / 2).attr('y', ih + 32).attr('text-anchor', 'middle')
    .attr('fill', c.text).attr('font-size', '12px').text('x₁')
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -32)
    .attr('text-anchor', 'middle').attr('fill', c.text).attr('font-size', '12px').text('x₂')
  const drawLine = (seg: [Pt2, Pt2] | null, color: string, width: number, dash: string, opacity = 1) => {
    if (!seg) return
    g.append('line')
      .attr('x1', xs(seg[0][0])).attr('y1', ys(seg[0][1]))
      .attr('x2', xs(seg[1][0])).attr('y2', ys(seg[1][1]))
      .attr('stroke', color).attr('stroke-width', width).attr('stroke-dasharray', dash).attr('opacity', opacity)
  }

  // 理想分隔超平面 w*
  if (showStar.value) drawLine(boundarySegment(wStarRaw.value), PURPLE, 2, '2,5', 0.9)

  // 上一步被更新前的边界（虚影）
  const last = lastRecord.value
  if (last?.updated) drawLine(boundarySegment(last.wOld), c.muted, 2, '6,4', 0.7)

  // 当前边界与法向量：w 的 (w₁, w₂) 分量垂直于边界，指向判为 +1 的一侧
  if (!zeroW) {
    const seg = boundarySegment(wv)
    drawLine(seg, c.line, 3, '')
    const nn = Math.hypot(wv[1], wv[2])
    if (seg && nn > 1e-9) {
      const mid: Pt2 = [(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2]
      const tip: Pt2 = [mid[0] + (wv[1] / nn) * 1.6, mid[1] + (wv[2] / nn) * 1.6]
      arrow(g, xs(mid[0]), ys(mid[1]), xs(tip[0]), ys(tip[1]), c.brand, 3)
      g.append('text').attr('x', xs(tip[0]) + 6).attr('y', ys(tip[1]) - 6)
        .attr('fill', c.brand).attr('font-size', '13px').attr('font-weight', 700).text('w')
    }
  } else {
    g.append('text').attr('x', iw / 2).attr('y', 18).attr('text-anchor', 'middle')
      .attr('fill', c.muted).attr('font-size', '12px')
      .text('w = 0：所有点 y·wᵀx = 0，尚无决策边界')
  }
  // 数据点：错分点（y·wᵀx ≤ 0）加琥珀色描边
  const r = Math.max(8, Math.min(11, size / 50))
  points.value.forEach((p, i) => {
    const cx = xs(p.x1)
    const cy = ys(p.x2)
    if (last && last.idx === i) {
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r + 7)
        .attr('fill', 'none').attr('stroke', c.brand).attr('stroke-width', 3)
    } else if (!converged.value && records.value.length > 0 && nextIdx.value === i) {
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r + 6)
        .attr('fill', 'none').attr('stroke', c.muted).attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3')
    }
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r)
      .attr('fill', p.y === 1 ? POS : NEG)
      .attr('stroke', misclassified.value[i] ? AMBER : c.bg)
      .attr('stroke-width', misclassified.value[i] ? 3 : 2)
    g.append('text').attr('x', cx).attr('y', cy + 4.5).attr('text-anchor', 'middle')
      .attr('fill', '#fff').attr('font-size', '13px').attr('font-weight', 700)
      .text(p.y === 1 ? '+' : '−')
    g.append('text').attr('x', cx + r + 3).attr('y', cy - r + 2)
      .attr('fill', c.text).attr('font-size', '11px').text(`x${toSub(i + 1)}`)
  })
}

function toSub(n: number): string {
  return String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join('')
}
// --- 图 2：权重空间（w₁, w₂ 分量）：w_new = w_old + y·x 的向量加法 ---
const weightSvg = ref<SVGSVGElement | null>(null)
const weightBox = ref<HTMLDivElement | null>(null)
const weightSize = ref(320)

function drawWeight() {
  if (!weightSvg.value) return
  const c = themeColors()
  const size = weightSize.value
  const m = { top: 14, right: 14, bottom: 34, left: 40 }
  const iw = size - m.left - m.right
  const ih = size - m.top - m.bottom
  const svg = d3.select(weightSvg.value)
  svg.selectAll('*').remove()
  svg.attr('width', size).attr('height', size).attr('viewBox', `0 0 ${size} ${size}`)
  svg.append('rect').attr('width', size).attr('height', size).attr('fill', c.bg).attr('rx', 8)
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)

  const traj: Pt2[] = [[0, 0], ...records.value.filter(r => r.updated).map(r => [r.wNew[1], r.wNew[2]] as Pt2)]
  const extent = Math.max(3, ...traj.map(p => Math.max(Math.abs(p[0]), Math.abs(p[1])))) * 1.2
  const xs = d3.scaleLinear().domain([-extent, extent]).range([0, iw])
  const ys = d3.scaleLinear().domain([-extent, extent]).range([ih, 0])

  styleAxis(g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(xs).ticks(5)), c)
  styleAxis(g.append('g').call(d3.axisLeft(ys).ticks(5)), c)
  g.append('line').attr('x1', xs(0)).attr('x2', xs(0)).attr('y1', 0).attr('y2', ih).attr('stroke', c.grid)
  g.append('line').attr('x1', 0).attr('x2', iw).attr('y1', ys(0)).attr('y2', ys(0)).attr('stroke', c.grid)
  g.append('text').attr('x', iw / 2).attr('y', ih + 28).attr('text-anchor', 'middle')
    .attr('fill', c.text).attr('font-size', '12px').text('w₁')
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -28)
    .attr('text-anchor', 'middle').attr('fill', c.text).attr('font-size', '12px').text('w₂')

  // w* 的方向（射线）
  if (showStar.value) {
    const sn = Math.hypot(wStarRaw.value[1], wStarRaw.value[2])
    const L = extent * 0.95
    arrow(g, xs(0), ys(0), xs((wStarRaw.value[1] / sn) * L), ys((wStarRaw.value[2] / sn) * L), PURPLE, 1.5, '2,5')
  }

  // 历史轨迹
  g.append('path').attr('d', d3.line()(traj.map(p => [xs(p[0]), ys(p[1])]))!)
    .attr('fill', 'none').attr('stroke', c.muted).attr('stroke-width', 1).attr('stroke-dasharray', '3,3')
  traj.forEach(p => g.append('circle').attr('cx', xs(p[0])).attr('cy', ys(p[1])).attr('r', 2.5).attr('fill', c.muted))
  // 最近一次检查：若发生更新，画 w_old → (+ y·x) → w_new 的三角形
  const last = lastRecord.value
  if (last?.updated) {
    const p = points.value[last.idx]
    const o: Pt2 = [last.wOld[1], last.wOld[2]]
    const n: Pt2 = [o[0] + p.y * p.x1, o[1] + p.y * p.x2]
    arrow(g, xs(0), ys(0), xs(o[0]), ys(o[1]), c.muted, 2, '5,3')
    arrow(g, xs(o[0]), ys(o[1]), xs(n[0]), ys(n[1]), AMBER, 2.5)
    g.append('text').attr('x', xs((o[0] + n[0]) / 2) + 6).attr('y', ys((o[1] + n[1]) / 2) - 6)
      .attr('fill', AMBER).attr('font-size', '12px').attr('font-weight', 700)
      .text(`${p.y === 1 ? '+' : '−'}x${toSub(last.idx + 1)}`)
  }
  const wv = shownW.value
  arrow(g, xs(0), ys(0), xs(wv[1]), ys(wv[2]), c.brand, 3)
  if (Math.hypot(wv[1], wv[2]) > 1e-6) {
    g.append('text').attr('x', xs(wv[1]) + 6).attr('y', ys(wv[2]) - 6)
      .attr('fill', c.brand).attr('font-size', '13px').attr('font-weight', 700).text('w')
  }
}
// --- 图 3：收敛性：w·w* 线性增长，‖w‖ 至多按 √k 增长 ---
const convSvg = ref<SVGSVGElement | null>(null)
const convBox = ref<HTMLDivElement | null>(null)
const convWidth = ref(320)

function drawConv() {
  if (!convSvg.value) return
  const c = themeColors()
  const width = convWidth.value
  const height = weightSize.value
  const m = { top: 14, right: 14, bottom: 34, left: 40 }
  const iw = width - m.left - m.right
  const ih = height - m.top - m.bottom
  const svg = d3.select(convSvg.value)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
  svg.append('rect').attr('width', width).attr('height', height).attr('fill', c.bg).attr('rx', 8)
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)

  const data = curve.value
  const kLast = data[data.length - 1].k
  const kMax = Math.max(4, kLast + 1)
  const yMax = Math.max(1, ...data.map(d => d.len), Math.sqrt(kLast) * R.value) * 1.08
  const xs = d3.scaleLinear().domain([0, kMax]).range([0, iw])
  const ys = d3.scaleLinear().domain([0, yMax]).range([ih, 0])
  const clipId = `conv-clip-${uid}`
  svg.append('defs').append('clipPath').attr('id', clipId)
    .append('rect').attr('width', iw).attr('height', ih)
  styleAxis(g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(xs).ticks(Math.min(kMax, 8))), c)
  styleAxis(g.append('g').call(d3.axisLeft(ys).ticks(5)), c)
  g.append('text').attr('x', iw / 2).attr('y', ih + 28).attr('text-anchor', 'middle')
    .attr('fill', c.text).attr('font-size', '12px').text('累计更新次数 k')

  const ks = d3.range(0, kMax + 0.001, kMax / 80)
  const line = d3.line<[number, number]>().x(d => xs(d[0])).y(d => ys(d[1]))
  const bounds = g.append('g').attr('clip-path', `url(#${clipId})`)
  bounds.append('path').attr('d', line(ks.map(k => [k, Math.sqrt(k) * R.value]))!)
    .attr('fill', 'none').attr('stroke', c.brand).attr('stroke-width', 1.5).attr('stroke-dasharray', '5,4').attr('opacity', 0.7)
  bounds.append('path').attr('d', line(ks.map(k => [k, k * gamma.value]))!)
    .attr('fill', 'none').attr('stroke', PURPLE).attr('stroke-width', 1.5).attr('stroke-dasharray', '5,4').attr('opacity', 0.7)

  const series: [keyof (typeof data)[number], string][] = [['len', c.brand], ['proj', PURPLE]]
  for (const [key, color] of series) {
    g.append('path').attr('d', line(data.map(d => [d.k, d[key]]))!)
      .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5)
    data.forEach(d => g.append('circle').attr('cx', xs(d.k)).attr('cy', ys(d[key])).attr('r', 3).attr('fill', color))
  }
}
// --- 生命周期 ---
let themeObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null

function checkDark() {
  isDark.value = document.documentElement.classList.contains('dark')
}

function measure() {
  if (planeBox.value) planeSize.value = Math.max(280, Math.min(planeBox.value.clientWidth, 520))
  if (weightBox.value) weightSize.value = Math.max(240, Math.min(weightBox.value.clientWidth, 380))
  if (convBox.value) convWidth.value = Math.max(240, Math.min(convBox.value.clientWidth, 520))
}

onMounted(() => {
  checkDark()
  themeObserver = new MutationObserver(checkDark)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  measure()
  resizeObserver = new ResizeObserver(measure)
  for (const el of [planeBox.value, weightBox.value, convBox.value]) if (el) resizeObserver.observe(el)
  loadDataset()
})

onUnmounted(() => {
  stop()
  cancelAnimationFrame(raf)
  themeObserver?.disconnect()
  resizeObserver?.disconnect()
})

watch(dataset, loadDataset)

function drawAll() {
  drawPlane()
  drawWeight()
  drawConv()
}
watch(
  [shownW, () => records.value.length, points, isDark, planeSize, weightSize, convWidth, showStar],
  drawAll,
  { flush: 'post' },
)
</script>
<template>
  <div class="perceptron-demo">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="seg" role="group" aria-label="数据集">
        <button :class="{ active: dataset === 'example' }" @click="dataset = 'example'">示例 6 点</button>
        <button :class="{ active: dataset === 'random' }" @click="dataset === 'random' ? loadDataset() : (dataset = 'random')">
          随机线性可分{{ dataset === 'random' ? ' 🔄' : '' }}
        </button>
      </div>
      <div class="actions">
        <button class="btn primary" :disabled="converged" @click="stop(); step()">单步检查</button>
        <button class="btn" :disabled="converged" @click="stepToUpdate">下一次更新</button>
        <button class="btn" :disabled="converged" @click="runEpoch">跑完本轮</button>
        <button class="btn" :disabled="converged" @click="togglePlay">{{ playing ? '⏸ 暂停' : '▶ 自动' }}</button>
        <button class="btn" :disabled="converged" @click="runAll">跑到收敛</button>
        <button class="btn ghost" @click="reset">重置 w = 0</button>
      </div>
      <div class="opts">
        <label class="speed">
          速度
          <input type="range" min="150" max="1500" step="50" :value="1650 - speed"
            @input="speed = 1650 - Number(($event.target as HTMLInputElement).value)" aria-label="自动播放速度" />
        </label>
        <label class="check"><input type="checkbox" v-model="showStar" /> 显示理想超平面 w*</label>
      </div>
    </div>

    <div class="main-grid">
      <div ref="planeBox" class="chart-col">
        <svg ref="planeSvg" class="chart-svg" role="img" aria-label="数据平面：数据点、当前决策边界与权重法向量"></svg>
      </div>

      <div class="side-col">
        <!-- 状态 -->
        <div class="card">
          <h4 class="card-title">训练状态</h4>
          <div class="stats">
            <div><span class="k">轮次</span><span class="v">{{ epoch }}</span></div>
            <div><span class="k">累计更新 M</span><span class="v">{{ totalUpdates }}</span></div>
            <div><span class="k">错分点</span><span class="v" :class="{ bad: errorCount > 0 }">{{ errorCount }} / {{ points.length }}</span></div>
            <div><span class="k">cos θ(w, w*)</span><span class="v">{{ cosTheta === null ? '—' : cosTheta.toFixed(3) }}</span></div>
          </div>
          <div class="wbox">w = (w₀, w₁, w₂) = <strong>{{ vecStr(w) }}</strong></div>
          <div v-if="converged" class="done">✅ 步骤3：第 {{ epoch }} 轮没有任何更新，算法终止。共更新 {{ totalUpdates }} 次。</div>
        </div>
        <!-- 本步推导 -->
        <div class="card">
          <h4 class="card-title">本步推导</h4>
          <div v-if="!lastRecord" class="deriv">
            <div class="line">步骤1：初始化 w = (0, 0, 0)</div>
            <div class="line muted">每个点增广为 x = (1, x₁, x₂)，偏置 w₀ 与 x₀ = 1 相乘。</div>
            <div class="line muted">点击「单步检查」开始步骤2：逐个检查 y·wᵀx。</div>
          </div>
          <div v-else class="deriv">
            <div class="line muted">
              第 {{ lastRecord.t }} 次检查 · 第 {{ lastRecord.epoch }} 轮 · 点 x{{ toSub(lastRecord.idx + 1) }}
            </div>
            <div class="line">
              x = {{ vecStr(aug(points[lastRecord.idx])) }}，y = {{ points[lastRecord.idx].y === 1 ? '+1' : '−1' }}
            </div>
            <div class="line">
              wᵀx = {{ fmt(lastRecord.wOld[0]) }}·1 + {{ paren(lastRecord.wOld[1]) }}·{{ paren(points[lastRecord.idx].x1) }}
              + {{ paren(lastRecord.wOld[2]) }}·{{ paren(points[lastRecord.idx].x2) }}
              = {{ fmt(dot(lastRecord.wOld, aug(points[lastRecord.idx]))) }}
            </div>
            <div class="line">
              y·wᵀx = {{ paren(points[lastRecord.idx].y) }}·{{ paren(dot(lastRecord.wOld, aug(points[lastRecord.idx]))) }}
              = <strong :class="lastRecord.updated ? 'bad' : 'good'">{{ fmt(lastRecord.score) }}</strong>
              {{ lastRecord.updated ? '≤ 0 → 分类错误，需要更新' : '> 0 → 分类正确，不更新' }}
            </div>
            <div v-if="lastRecord.updated" class="line update">
              w<sub>new</sub> = w<sub>old</sub> + y·x = {{ vecStr(lastRecord.wOld) }}
              + {{ paren(points[lastRecord.idx].y) }}·{{ vecStr(aug(points[lastRecord.idx])) }}
              = <strong>{{ vecStr(lastRecord.wNew) }}</strong>
            </div>
            <div v-if="lastRecord.updated" class="line muted">
              更新后该点得分 y·w<sub>new</sub>ᵀx = {{ fmt(lastRecord.score) }} + ‖x‖² =
              {{ fmt(points[lastRecord.idx].y * dot(lastRecord.wNew, aug(points[lastRecord.idx]))) }}，
              被推向正确一侧（但不保证一步就到位，也可能让其他点出错）。
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub-grid">
      <div class="card">
        <h4 class="card-title">权重空间：w<sub>new</sub> = w<sub>old</sub> + y·x</h4>
        <div ref="weightBox" class="chart-col">
          <svg ref="weightSvg" class="chart-svg" role="img" aria-label="权重空间中 w 的更新轨迹"></svg>
        </div>
        <p class="note">
          只画 (w₁, w₂) 分量。灰色虚线箭头为 w<sub>old</sub>，琥珀色为本次加上的 ±x，蓝色为 w<sub>new</sub>；
          点状轨迹是每次更新后 w 的位置，紫色射线为 w* 的方向。
        </p>
      </div>
      <div class="card">
        <h4 class="card-title">为什么一定会停：收敛性</h4>
        <div ref="convBox" class="chart-col">
          <svg ref="convSvg" class="chart-svg" role="img" aria-label="w 与 w* 的点积和 w 的长度随更新次数的变化"></svg>
        </div>
        <div class="conv-legend">
          <span><svg class="sw" viewBox="0 0 22 6"><line x1="0" y1="3" x2="22" y2="3" :stroke="PURPLE" stroke-width="3" /></svg>w·w*（‖w*‖ = 1）</span>
          <span><svg class="sw" viewBox="0 0 22 6"><line x1="0" y1="3" x2="22" y2="3" :stroke="PURPLE" stroke-width="2" stroke-dasharray="5,4" /></svg>下界 kγ</span>
          <span><svg class="sw brand" viewBox="0 0 22 6"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="3" /></svg>‖w‖</span>
          <span><svg class="sw brand" viewBox="0 0 22 6"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="2" stroke-dasharray="5,4" /></svg>上界 √k·R</span>
        </div>
        <div class="ineq">
          <div>每次更新：w·w* 至少增加 γ = {{ gamma.toFixed(3) }}，‖w‖² 至多增加 R² = {{ (R * R).toFixed(2) }}</div>
          <div>⇒ M·γ ≤ w·w* ≤ ‖w‖ ≤ √M·R ⇒ <strong>M ≤ R²/γ² ≈ {{ bound.toFixed(1) }}</strong></div>
          <div class="muted">当前 M = {{ totalUpdates }}，cos θ = w·w*/‖w‖ = {{ cosTheta === null ? '—' : cosTheta.toFixed(3) }}（≤ 1）</div>
        </div>
      </div>
    </div>

    <!-- 迭代日志 -->
    <div class="card log-card">
      <h4 class="card-title">迭代记录 <span class="muted small">（最近 60 次检查）</span></h4>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>轮</th><th>点</th><th>y</th><th>y·wᵀx</th><th>操作</th><th>w（检查后）</th></tr>
          </thead>
          <tbody>
            <tr v-if="records.length === 0"><td colspan="7" class="muted">尚未开始</td></tr>
            <tr v-for="r in recentRecords" :key="r.t" :class="{ upd: r.updated }">
              <td>{{ r.t }}</td>
              <td>{{ r.epoch }}</td>
              <td>x{{ toSub(r.idx + 1) }} ({{ fmt(points[r.idx].x1) }}, {{ fmt(points[r.idx].x2) }})</td>
              <td>{{ points[r.idx].y === 1 ? '+1' : '−1' }}</td>
              <td>{{ fmt(r.score) }}</td>
              <td>{{ r.updated ? `更新 w ${points[r.idx].y === 1 ? '+' : '−'}= x` : '—' }}</td>
              <td class="mono">{{ vecStr(r.wNew) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="legend">
      <span><i class="dot" :style="{ background: POS }"></i>正类 y = +1</span>
      <span><i class="dot" :style="{ background: NEG }"></i>负类 y = −1</span>
      <span><i class="dot ring"></i>琥珀描边：当前 w 下错分（y·wᵀx ≤ 0）</span>
      <span><i class="bar solid"></i>当前边界 wᵀx = 0</span>
      <span><i class="bar dashed"></i>更新前的边界</span>
      <span><i class="bar dotted"></i>理想超平面 w*</span>
    </div>
  </div>
</template>

<style scoped>
.perceptron-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  margin: 16px 0;
}

/* Toolbar */
.toolbar { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.seg { display: inline-flex; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; align-self: flex-start; }
.seg button {
  padding: 6px 14px; font-size: 13px; background: var(--vp-c-bg); color: var(--vp-c-text-2); cursor: pointer;
}
.seg button + button { border-left: 1px solid var(--vp-c-divider); }
.seg button.active { background: var(--vp-c-brand-1); color: #fff; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn {
  padding: 7px 14px; font-size: 13px; font-weight: 500; border-radius: 8px; cursor: pointer;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); transition: all 0.2s;
}
.btn:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn.primary { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.btn.ghost { background: transparent; }
.btn:focus-visible, .seg button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.opts { display: flex; flex-wrap: wrap; gap: 18px; font-size: 13px; color: var(--vp-c-text-2); align-items: center; }
.speed { display: flex; align-items: center; gap: 8px; }
.speed input { accent-color: var(--vp-c-brand-1); width: 120px; }
.check { display: flex; align-items: center; gap: 6px; cursor: pointer; }

/* Layout */
.main-grid, .sub-grid { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
@media (min-width: 860px) {
  .main-grid { grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); }
  .sub-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
}
.sub-grid { margin-top: 16px; }
.chart-col { display: flex; justify-content: center; min-width: 0; overflow-x: auto; }
.chart-svg { border-radius: 8px; max-width: 100%; height: auto; }
.side-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
/* Cards */
.card { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 14px 16px; min-width: 0; }
.card-title { font-size: 15px; font-weight: 600; margin: 0 0 10px 0; color: var(--vp-c-brand-1); }
.muted { color: var(--vp-c-text-2); }
.small { font-size: 12px; font-weight: 400; }
.bad { color: #EF4444; }
.good { color: #10B981; }

.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.stats > div { display: flex; flex-direction: column; }
.stats .k { font-size: 12px; color: var(--vp-c-text-2); }
.stats .v { font-size: 20px; font-weight: 700; color: var(--vp-c-text-1); font-variant-numeric: tabular-nums; }
.stats .v.bad { color: #EF4444; }
.wbox {
  margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--vp-c-divider);
  font-family: "JetBrains Mono", "Fira Code", monospace; font-size: 13px; word-break: break-all;
}
.done { margin-top: 10px; font-size: 13px; color: #10B981; line-height: 1.6; }

.deriv { display: flex; flex-direction: column; gap: 6px; }
.deriv .line {
  font-family: "JetBrains Mono", "Fira Code", monospace; font-size: 12.5px; line-height: 1.6;
  color: var(--vp-c-text-1); word-break: break-word;
}
.deriv .line.muted { color: var(--vp-c-text-2); font-family: inherit; }
.deriv .line.update {
  padding: 8px 10px; border-radius: 6px; background: rgba(217, 119, 6, 0.1); border-left: 3px solid #d97706;
}

.note { font-size: 12px; color: var(--vp-c-text-2); line-height: 1.6; margin: 8px 0 0; }
.conv-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12px; color: var(--vp-c-text-2); margin-top: 8px; }
.conv-legend span { display: inline-flex; align-items: center; gap: 6px; }
.sw { width: 22px; height: 6px; flex-shrink: 0; }
.sw.brand { color: var(--vp-c-brand-1); }
.ineq {
  margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--vp-c-divider);
  font-size: 12.5px; line-height: 1.8; color: var(--vp-c-text-1);
}
/* Log */
.log-card { margin-top: 16px; }
.table-wrap { max-height: 260px; overflow: auto; }
table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 0; display: table; }
th, td { padding: 5px 8px; border: none; border-bottom: 1px solid var(--vp-c-divider); text-align: left; white-space: nowrap; }
th { position: sticky; top: 0; background: var(--vp-c-bg); color: var(--vp-c-text-2); font-weight: 600; }
tr { background: transparent !important; }
tr.upd td { background: rgba(217, 119, 6, 0.08); }
.mono { font-family: "JetBrains Mono", "Fira Code", monospace; }

/* Legend */
.legend {
  display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 14px; font-size: 12px; color: var(--vp-c-text-2);
}
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }
.dot.ring { background: transparent; border: 3px solid #d97706; }
.bar { display: inline-block; width: 22px; height: 0; }
.bar.solid { border-top: 3px solid var(--vp-c-text-1); }
.bar.dashed { border-top: 2px dashed var(--vp-c-text-2); }
.bar.dotted { border-top: 2px dotted #8b5cf6; }
</style>
