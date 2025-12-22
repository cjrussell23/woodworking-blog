import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { getTextColorClass } from '../utils'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      title?: never
      subtitle?: never
      textColor?: string
    }
  | (Omit<Page['hero'], 'title' | 'subtitle'> & {
      children?: never
      title?: Page['hero']['title']
      subtitle?: Page['hero']['subtitle']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  children,
  title,
  subtitle,
  textColor,
}) => {
  return (
    <div className={cn('container mt-16', getTextColorClass(textColor))}>
      <div className="max-w-[48rem]">
        {children || (
          <>
            {title && <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>}
            {subtitle && <p className="text-lg md:text-xl opacity-90">{subtitle}</p>}
          </>
        )}
      </div>
    </div>
  )
}
