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
  doc?: CardPostData
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
    <Link href={href} ref={link.ref}>
      <article
        className={cn(
          'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer flex flex-col hover:border-accent',
          className,
        )}
        ref={card.ref}
      >
        <div className="relative w-full aspect-video bg-black">
          {!metaImage && (
            <div className="flex items-center justify-center h-full text-gray-400">No image</div>
          )}
          {metaImage && typeof metaImage !== 'string' && (
            <ImageMedia resource={metaImage} size="33vw" fill imgClassName="object-cover" />
          )}
        </div>
        <div className="p-2 flex flex-col flex-1">
          <div className="text-xs">
            {publishedAt && <p>{new Date(publishedAt).toLocaleDateString()}</p>}
          </div>

          {titleToUse && <h3 className="text-lg font-semibold">{titleToUse}</h3>}
          {description && showDescription && (
            <div className="text-sm">{description && <p>{sanitizedDescription}</p>}</div>
          )}

          {showCategories && hasCategories && (
            <div className="text-sm mt-auto pt-4">
              {showCategories && hasCategories && (
                <div className="flex flex-wrap gap-1">
                  {categories?.map((category, index) => {
                    if (typeof category === 'object') {
                      const categoryHref = `/categories/${category.slug}`
                      return (
                        <Link
                          key={index}
                          href={categoryHref}
                          className="border text-xs rounded-full bg-secondary border-border w-fit px-[6px] py-[2px] hover:bg-accent hover:text-white transition-colors"
                        >
                          {category.title}
                        </Link>
                      )
                    }

                    return null
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
