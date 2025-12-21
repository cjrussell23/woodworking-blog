import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { getTextColorClass } from '../utils'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      textColor?: string
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, textColor }) => {
  return (
    <div className={cn('container mt-16', getTextColorClass(textColor))}>
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
