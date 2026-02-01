'use client'

import { useState, useEffect } from 'react'

const GRID_SIZE = 5
const ACTIONS = ['up', 'down', 'left', 'right'] as const
type Action = typeof ACTIONS[number]

interface Cell {
  reward: number
  isGoal: boolean
  isObstacle: boolean
}

interface QValues {
  up: number
  down: number
  left: number
  right: number
}

export function QLearningDemo() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [qTable, setQTable] = useState<QValues[][]>([])
  const [agentPos, setAgentPos] = useState({ x: 0, y: 0 })
  const [episode, setEpisode] = useState(0)
  const [step, setStep] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [alpha, setAlpha] = useState(0.1)  // Learning rate
  const [gamma, setGamma] = useState(0.9)  // Discount factor
  const [epsilon, setEpsilon] = useState(0.3)  // Exploration rate
  const [path, setPath] = useState<{x: number, y: number}[]>([])

  // Initialize grid
  const initializeGrid = () => {
    const newGrid: Cell[][] = []
    const newQTable: QValues[][] = []

    for (let i = 0; i < GRID_SIZE; i++) {
      const row: Cell[] = []
      const qRow: QValues[] = []
      for (let j = 0; j < GRID_SIZE; j++) {
        // Goal at bottom-right
        const isGoal = i === GRID_SIZE - 1 && j === GRID_SIZE - 1
        // Obstacles
        const isObstacle = (i === 1 && j === 2) || (i === 2 && j === 2) || (i === 3 && j === 1)

        row.push({
          reward: isGoal ? 100 : isObstacle ? -10 : -1,
          isGoal,
          isObstacle
        })

        qRow.push({
          up: 0,
          down: 0,
          left: 0,
          right: 0
        })
      }
      newGrid.push(row)
      newQTable.push(qRow)
    }

    setGrid(newGrid)
    setQTable(newQTable)
    setAgentPos({ x: 0, y: 0 })
    setEpisode(0)
    setStep(0)
    setTotalReward(0)
    setPath([{x: 0, y: 0}])
  }

  // Get next position
  const getNextPos = (pos: {x: number, y: number}, action: Action) => {
    let { x, y } = pos

    if (action === 'up') y = Math.max(0, y - 1)
    else if (action === 'down') y = Math.min(GRID_SIZE - 1, y + 1)
    else if (action === 'left') x = Math.max(0, x - 1)
    else if (action === 'right') x = Math.min(GRID_SIZE - 1, x + 1)

    return { x, y }
  }

  // Choose action (epsilon-greedy)
  const chooseAction = (pos: {x: number, y: number}, explore: boolean = true): Action => {
    if (explore && Math.random() < epsilon) {
      // Explore: random action
      return ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    } else {
      // Exploit: best action
      const qValues = qTable[pos.y][pos.x]
      let maxQ = -Infinity
      let bestAction: Action = 'up'

      ACTIONS.forEach(action => {
        if (qValues[action] > maxQ) {
          maxQ = qValues[action]
          bestAction = action
        }
      })

      return bestAction
    }
  }

  // Single step of Q-learning
  const qLearningStep = () => {
    if (grid.length === 0) return false

    const currentPos = agentPos
    const action = chooseAction(currentPos)
    const nextPos = getNextPos(currentPos, action)

    const reward = grid[nextPos.y][nextPos.x].reward
    const isTerminal = grid[nextPos.y][nextPos.x].isGoal

    // Q-learning update
    const currentQ = qTable[currentPos.y][currentPos.x][action]
    const maxNextQ = Math.max(...ACTIONS.map(a => qTable[nextPos.y][nextPos.x][a]))

    const newQ = currentQ + alpha * (reward + gamma * maxNextQ - currentQ)

    // Update Q-table
    const newQTable = qTable.map((row, i) =>
      row.map((cell, j) => {
        if (i === currentPos.y && j === currentPos.x) {
          return { ...cell, [action]: newQ }
        }
        return cell
      })
    )

    setQTable(newQTable)
    setAgentPos(nextPos)
    setStep(s => s + 1)
    setTotalReward(r => r + reward)
    setPath(p => [...p, nextPos])

    // Check if episode ended
    if (isTerminal || step > 50) {
      setEpisode(e => e + 1)
      setAgentPos({ x: 0, y: 0 })
      setStep(0)
      setPath([{x: 0, y: 0}])
      return false
    }

    return true
  }

  // Train multiple episodes
  const trainEpisodes = async (numEpisodes: number) => {
    setIsTraining(true)

    for (let e = 0; e < numEpisodes; e++) {
      setAgentPos({ x: 0, y: 0 })
      setStep(0)
      setPath([{x: 0, y: 0}])

      let currentPos = { x: 0, y: 0 }
      let episodeStep = 0

      while (episodeStep < 50) {
        const action = chooseAction(currentPos)
        const nextPos = getNextPos(currentPos, action)
        const reward = grid[nextPos.y][nextPos.x].reward
        const isTerminal = grid[nextPos.y][nextPos.x].isGoal

        const currentQ = qTable[currentPos.y][currentPos.x][action]
        const maxNextQ = Math.max(...ACTIONS.map(a => qTable[nextPos.y][nextPos.x][a]))
        const newQ = currentQ + alpha * (reward + gamma * maxNextQ - currentQ)

        qTable[currentPos.y][currentPos.x][action] = newQ

        currentPos = nextPos
        episodeStep++

        if (isTerminal) break
      }

      setEpisode(e + 1)

      // Small delay for visualization
      if (e % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    setIsTraining(false)
    // Show optimal path
    showOptimalPath()
  }

  // Show optimal path
  const showOptimalPath = () => {
    const optimalPath: {x: number, y: number}[] = [{x: 0, y: 0}]
    let currentPos = { x: 0, y: 0 }
    let steps = 0

    while (steps < 20 && !grid[currentPos.y][currentPos.x].isGoal) {
      const action = chooseAction(currentPos, false)  // No exploration
      currentPos = getNextPos(currentPos, action)
      optimalPath.push(currentPos)
      steps++
    }

    setPath(optimalPath)
    setAgentPos(currentPos)
  }

  useEffect(() => {
    initializeGrid()
  }, [])

  // Get cell color
  const getCellColor = (cell: Cell, x: number, y: number) => {
    if (cell.isGoal) return 'bg-ml-green'
    if (cell.isObstacle) return 'bg-ml-red/50'

    // Color by max Q value
    const maxQ = Math.max(...ACTIONS.map(a => qTable[y]?.[x]?.[a] || 0))
    if (maxQ > 0) {
      const intensity = Math.min(maxQ / 100, 1)
      return `bg-ml-cyan`
      // Could use opacity: `bg-ml-cyan opacity-${Math.floor(intensity * 100)}`
    }

    return 'bg-ml-bg-dark'
  }

  // Get arrow for best action
  const getBestActionArrow = (x: number, y: number) => {
    if (!qTable[y]?.[x]) return ''

    const qValues = qTable[y][x]
    const maxQ = Math.max(...ACTIONS.map(a => qValues[a]))

    if (maxQ <= 0) return ''

    const bestAction = ACTIONS.find(a => qValues[a] === maxQ)

    switch(bestAction) {
      case 'up': return '↑'
      case 'down': return '↓'
      case 'left': return '←'
      case 'right': return '→'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Grid World */}
      <div className="bg-ml-bg-card border-2 border-ml-purple/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-purple mb-4">网格世界</h3>

        <div className="flex justify-center">
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const isAgent = agentPos.x === x && agentPos.y === y
                const isOnPath = path.some(p => p.x === x && p.y === y)

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`w-20 h-20 border-2 border-ml-border rounded-lg flex items-center justify-center relative transition-all ${
                      getCellColor(cell, x, y)
                    } ${isOnPath ? 'ring-2 ring-ml-yellow' : ''}`}
                  >
                    {/* Grid coordinates */}
                    <span className="absolute top-1 left-1 text-xs text-gray-400">
                      {x},{y}
                    </span>

                    {/* Reward */}
                    {!cell.isGoal && !cell.isObstacle && (
                      <span className="absolute bottom-1 right-1 text-xs text-gray-400">
                        {cell.reward}
                      </span>
                    )}

                    {/* Goal */}
                    {cell.isGoal && (
                      <span className="text-4xl">🎯</span>
                    )}

                    {/* Obstacle */}
                    {cell.isObstacle && (
                      <span className="text-4xl">🚫</span>
                    )}

                    {/* Best action arrow */}
                    {!cell.isGoal && !cell.isObstacle && !isAgent && (
                      <span className="text-3xl text-ml-cyan opacity-50">
                        {getBestActionArrow(x, y)}
                      </span>
                    )}

                    {/* Agent */}
                    {isAgent && (
                      <span className="text-4xl animate-bounce">🤖</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">训练回合</div>
          <div className="text-3xl font-bold text-ml-cyan">{episode}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">当前步数</div>
          <div className="text-3xl font-bold text-ml-purple">{step}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">累积奖励</div>
          <div className="text-3xl font-bold text-ml-green">{totalReward.toFixed(0)}</div>
        </div>
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">路径长度</div>
          <div className="text-3xl font-bold text-ml-yellow">{path.length}</div>
        </div>
      </div>

      {/* Hyperparameters */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-2">
            学习率 α: {alpha.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-cyan"
            disabled={isTraining}
          />
        </div>

        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-2">
            折扣因子 γ: {gamma.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-purple"
            disabled={isTraining}
          />
        </div>

        <div className="bg-ml-bg-card border border-ml-border rounded-xl p-4">
          <label className="block text-sm font-bold text-white mb-2">
            探索率 ε: {epsilon.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={epsilon}
            onChange={(e) => setEpsilon(Number(e.target.value))}
            className="w-full h-2 bg-ml-bg-dark rounded-lg appearance-none cursor-pointer accent-ml-green"
            disabled={isTraining}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={initializeGrid}
          className="px-4 py-2 bg-ml-bg-card border border-ml-border text-white rounded-lg hover:border-ml-cyan transition-colors"
          disabled={isTraining}
        >
          🔄 重置
        </button>

        <button
          onClick={qLearningStep}
          className="px-4 py-2 bg-ml-cyan text-ml-bg-dark font-bold rounded-lg hover:bg-ml-cyan/80 transition-colors disabled:opacity-50"
          disabled={isTraining}
        >
          ▶️ 单步
        </button>

        <button
          onClick={() => trainEpisodes(100)}
          className="px-6 py-2 bg-ml-purple text-white font-bold rounded-lg hover:bg-ml-purple/80 transition-colors disabled:opacity-50"
          disabled={isTraining}
        >
          {isTraining ? '⏳ 训练中...' : '⚡ 训练100回合'}
        </button>

        <button
          onClick={showOptimalPath}
          className="px-4 py-2 bg-ml-green text-white font-bold rounded-lg hover:bg-ml-green/80 transition-colors disabled:opacity-50"
          disabled={isTraining}
        >
          🎯 显示最优路径
        </button>
      </div>

      {/* Algorithm explanation */}
      <div className="bg-gradient-to-r from-ml-cyan/10 to-ml-purple/10 border border-ml-cyan/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-ml-cyan mb-4">💡 Q-Learning算法</h3>

        <div className="space-y-4 text-sm text-gray-100">
          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-ml-yellow font-bold mb-2">Q值更新公式</h4>
            <div className="font-mono text-white text-center py-2 text-sm">
              Q(s,a) ← Q(s,a) + α[r + γ max<sub>a'</sub>Q(s',a') - Q(s,a)]
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              <li>• α: 学习率，控制新信息的权重</li>
              <li>• γ: 折扣因子，控制未来奖励的重要性</li>
              <li>• r: 即时奖励</li>
              <li>• max Q(s',a'): 下一状态的最大Q值</li>
            </ul>
          </div>

          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-ml-green font-bold mb-2">ε-贪心策略</h4>
            <ul className="space-y-1 text-xs">
              <li>• <strong>探索</strong>（ε概率）：随机选择动作，发现新策略</li>
              <li>• <strong>利用</strong>（1-ε概率）：选择Q值最大的动作</li>
              <li>• 平衡探索与利用是强化学习的核心问题</li>
            </ul>
          </div>

          <div className="bg-ml-bg-dark rounded-lg p-4">
            <h4 className="text-ml-purple font-bold mb-2">关键概念</h4>
            <ul className="space-y-1 text-xs">
              <li>• <strong>状态(State)</strong>: 智能体在网格中的位置</li>
              <li>• <strong>动作(Action)</strong>: 上下左右移动</li>
              <li>• <strong>奖励(Reward)</strong>: 到达目标+100，障碍-10，其他-1</li>
              <li>• <strong>Q表</strong>: 存储每个(状态,动作)对的价值</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
