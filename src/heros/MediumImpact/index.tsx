import { ImageMedia } from '@/components/Media'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { getTextColorClass } from '../utils'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  media,
  title,
  subtitle,
  textColor,
  blur,
  overlay,
}) => {
  return (
    <div
      className={cn(
        'relative -mt-[10.4rem] flex items-center justify-center',
        textColor === 'default' ? 'text-white' : getTextColorClass(textColor),
      )}
    >
      <div className="container z-10 mt-[6rem] py-8 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-2xl opacity-90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="min-h-[40vh] select-none">
        {media && typeof media === 'object' && (
          <ImageMedia fill imgClassName={'-z-10'} priority resource={media} />
        )}
        {/* Blur overlay */}
        {blur?.enabled !== false && (
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{ backdropFilter: `blur(${blur?.strength}px)` }}
            aria-hidden="true"
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlay?.color ?? 'black', opacity: overlay?.opacity ?? 0 }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
