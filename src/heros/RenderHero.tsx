import React from 'react'

import { ImageMedia } from '@/components/Media'
import type { Category, Page } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { getTextColorClass } from './utils'

type RenderHeroProps = Page['hero'] & {
  publishedAt?: string | null
  categories?: (number | Category)[] | null
}

export const RenderHero: React.FC<RenderHeroProps> = ({
  media,
  title,
  subtitle,
  textColor,
  blur,
  overlay,
  publishedAt,
  categories,
}) => {
  const isPost = publishedAt !== undefined
  const postCategories = categories?.filter((cat): cat is Category => typeof cat === 'object')
  return (
    <div
      className={cn(
        'relative -mt-[65px] flex items-start justify-start',
        textColor === 'default' ? 'text-white' : getTextColorClass(textColor),
      )}
    >
      <div className="container z-10 py-8 mt-[55px] relative flex items-center justify-center">
        <div className={`max-w-[36.5rem]  ${!isPost && 'md:text-center w-full'}`}>
          {isPost && publishedAt && (
            <time
              className="block mb-3 text-sm md:text-base opacity-90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
              dateTime={publishedAt}
            >
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
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

          {isPost && postCategories && postCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {postCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/posts/category/${category.slug}`}
                  className="border text-xs rounded-full text-foreground bg-secondary border-border w-fit px-[6px] py-[2px] hover:bg-accent hover:text-white transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="h-64 select-none">
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
