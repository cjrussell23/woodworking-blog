'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { ImageMedia } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  showDescription?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    showDescription = true,
  } = props

  const { slug, categories, meta, title, publishedAt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card flex flex-col hover:border-accent not-prose',
        className,
      )}
      ref={card.ref}
    >
      <Link href={href} ref={link.ref} className="no-underline">
        <div className="relative w-full aspect-video bg-black">
          {!metaImage && (
            <div className="flex items-center justify-center h-full text-gray-400">No image</div>
          )}
          {metaImage && typeof metaImage !== 'string' && (
            <ImageMedia resource={metaImage} size="33vw" fill imgClassName="object-cover" />
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-3">
        {publishedAt && (
          <div className="text-xs text-muted-foreground">
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        {titleToUse && <h3 className="text-lg font-semibold line-clamp-2 m-0">{titleToUse}</h3>}

        {description && showDescription && (
          <p className="text-sm text-muted-foreground line-clamp-3 m-0">{sanitizedDescription}</p>
        )}

        {showCategories && hasCategories && (
          <div className="mt-auto pt-2">
            <div className="flex flex-wrap gap-1">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const categoryHref = `/categories/${category.slug}`
                  return (
                    <Link
                      key={index}
                      href={categoryHref}
                      className="no-underline border text-xs rounded-full bg-secondary border-border w-fit px-[6px] py-[2px] hover:bg-accent hover:text-white transition-colors"
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
    </article>
  )
}
