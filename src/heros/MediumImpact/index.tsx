import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getTextColorClass } from '../utils'

export const MediumImpactHero: React.FC<Page['hero']> = ({ media, title, subtitle, textColor }) => {
  return (
    <div
      className={cn(
        'relative -mt-[10.4rem] flex items-center justify-center',
        textColor === 'default' ? 'text-white' : getTextColorClass(textColor),
      )}
    >
      <div className="container z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl opacity-90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="min-h-[40vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
