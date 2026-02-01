import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathProps {
  children: string
  inline?: boolean
}

export function Math({ children, inline = false }: MathProps) {
  const Component = inline ? InlineMath : BlockMath
  return <Component math={children} />
}
