import Link from 'next/link'
import React from 'react'
import { formatDateTime } from 'src/utilities/formatDateTime'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

import { formatAuthors } from '@/utilities/formatAuthors'

// Map heroImagePosition to CSS object-position values
const objectPositionMap: Record<string, string> = {
  top: 'object-top',
  'top-right': 'object-top-right',
  'top-left': 'object-top-left',
  center: 'object-center',
  'center-right': 'object-right',
  'center-left': 'object-left',
  bottom: 'object-bottom',
  'bottom-right': 'object-bottom-right',
  'bottom-left': 'object-bottom-left',
}

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title, heroImagePosition } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-row gap-4 md:gap-16 flex-wrap">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
            {categories && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories?.map((category, index) => {
                    if (typeof category === 'object' && category !== null) {
                      const categoryHref = `/categories/${category.slug}`
                      return (
                        <Link
                          key={index}
                          href={categoryHref}
                          className="border text-xs rounded-full text-black dark:text-white bg-secondary border-border w-fit px-3 py-[1px] inline-block mr-2 mb-2 hover:bg-accent hover:text-white transition-colors"
                        >
                          {category.title}
                        </Link>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[60vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media
            fill
            priority
            imgClassName={`-z-10 object-cover ${objectPositionMap[heroImagePosition || 'center']}`}
            resource={heroImage}
          />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
