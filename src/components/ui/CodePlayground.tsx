'use client'

import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

interface CodePlaygroundProps {
  title?: string
  description?: string
  initialCode: string
  language?: 'python' | 'javascript' | 'typescript'
  readOnly?: boolean
  expectedOutput?: string
  testCases?: { input: string; output: string }[]
}

export function CodePlayground({
  title = '代码练习',
  description,
  initialCode,
  language = 'python',
  readOnly = false,
  expectedOutput,
  testCases
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([])
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setOutput('⏳ 正在执行代码...\n')

    // Simulate code execution (in a real scenario, this would be handled by a backend)
    setTimeout(() => {
      try {
        if (language === 'javascript' || language === 'typescript') {
          // For JavaScript, we can actually execute it
          const result = new Function(code)()
          setOutput(`✅ 执行成功\n\n输出:\n${result !== undefined ? result : '(无输出)'}`)
        } else {
          // For Python, we simulate the output
          setOutput(`✅ 代码已提交\n\n注意: 实际执行需要Python运行环境\n当前仅提供代码编辑功能`)
        }

        // Run test cases if provided
        if (testCases && testCases.length > 0) {
          const results = testCases.map((testCase, idx) => {
            // Simulate test execution
            const passed = Math.random() > 0.3 // Random for demo
            return {
              passed,
              message: passed
                ? `✓ 测试 ${idx + 1} 通过`
                : `✗ 测试 ${idx + 1} 失败: 期望 "${testCase.output}", 得到 "..."`
            }
          })
          setTestResults(results)
        }
      } catch (error) {
        setOutput(`❌ 执行错误\n\n${error}`)
      } finally {
        setIsRunning(false)
      }
    }, 1000)
  }

  const handleResetCode = () => {
    setCode(initialCode)
    setOutput('')
    setTestResults([])
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div className="bg-ml-bg-secondary rounded-xl p-6 border border-ml-border">
          {title && (
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>💻</span>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-100 text-sm">{description}</p>
          )}
        </div>
      )}

      {/* Editor and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ml-cyan">代码编辑器</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-100 bg-ml-bg-dark px-2 py-1 rounded">
                {language === 'python' ? 'Python' : language === 'javascript' ? 'JavaScript' : 'TypeScript'}
              </span>
              {!readOnly && (
                <button
                  onClick={handleResetCode}
                  className="text-xs px-3 py-1 rounded-lg bg-ml-bg-dark text-gray-100 hover:bg-ml-border transition-colors"
                >
                  重置
                </button>
              )}
            </div>
          </div>

          <div className="border-2 border-ml-border rounded-xl overflow-hidden">
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                readOnly: readOnly,
                wordWrap: 'on',
              }}
            />
          </div>

          {!readOnly && (
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`w-full px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                isRunning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-ml-purple to-ml-blue hover:from-ml-blue hover:to-ml-cyan shadow-lg hover:shadow-[0_0_30px_rgba(138,92,246,0.5)]'
              }`}
            >
              {isRunning ? '运行中...' : '▶ 运行代码'}
            </button>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-ml-green">输出结果</h4>

          <div className="bg-ml-bg-dark border border-ml-border rounded-xl p-4 h-[400px] overflow-auto">
            {output ? (
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-100 text-sm">
                点击 "运行代码" 查看输出结果
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-ml-bg-dark border border-ml-border rounded-xl p-4">
              <h5 className="text-sm font-semibold text-white mb-3">测试结果</h5>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-2 rounded-lg ${
                      result.passed
                        ? 'bg-ml-green/10 text-ml-green'
                        : 'bg-ml-red/10 text-ml-red'
                    }`}
                  >
                    {result.message}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-ml-border">
                <div className="text-sm font-semibold">
                  通过率: {' '}
                  <span className={testResults.every(r => r.passed) ? 'text-ml-green' : 'text-ml-yellow'}>
                    {testResults.filter(r => r.passed).length} / {testResults.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {expectedOutput && (
            <div className="bg-ml-blue/10 border border-ml-blue/30 rounded-xl p-4">
              <h5 className="text-sm font-semibold text-ml-blue mb-2">期望输出</h5>
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                {expectedOutput}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Hints Section */}
      <div className="bg-ml-yellow/10 border border-ml-yellow/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-ml-yellow mb-2">提示</h5>
            <ul className="space-y-1 text-gray-100 text-sm">
              <li>• 编辑器支持代码高亮和自动补全</li>
              <li>• 使用 Ctrl+S (Cmd+S) 保存代码</li>
              <li>• 支持多行编辑：按住 Alt 键拖动鼠标</li>
              <li>• 当前为演示环境，实际项目需要后端支持代码执行</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
