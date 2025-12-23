'use client'
import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getObjectPositionClass, getTextColorClass } from '../utils'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  title,
  subtitle,
  textColor,
  imagePosition,
}) => {
  return (
    <div
      className={cn(
        'relative -mt-[10.4rem] flex items-center justify-center',
        textColor === 'default' ? 'text-white' : getTextColorClass(textColor),
      )}
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {title && <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>}
          {subtitle && <p className="text-lg md:text-xl opacity-90 mb-6">{subtitle}</p>}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName={cn('-z-10 object-cover', getObjectPositionClass(imagePosition))}
            priority
            resource={media}
          />
        )}
      </div>
    </div>
  )
}
