import React from 'react'

export type BreakBlockProps = {
  blockType: 'break'
}

type Props = BreakBlockProps & {
  className?: string
}

export const BreakBlock: React.FC<Props> = ({ className }) => {
  return <div className={['clear-both', className].filter(Boolean).join(' ')} />
}
