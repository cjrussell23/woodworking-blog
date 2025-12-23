import clsx from 'clsx'
import React from 'react'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs } = props

  return (
    <div className={clsx('flex flex-wrap gap-4 justify-center', className)}>
      {docs?.map((doc, index) => {
        if (typeof doc === 'string') return null

        return (
          <Card
            key={index}
            doc={doc}
            className="w-40 lg:w-60"
            showDescription={false}
            relationTo="posts"
            showCategories
          />
        )
      })}
    </div>
  )
}
