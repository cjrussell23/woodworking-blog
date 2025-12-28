import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  className?: string
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, className } = props
  // Sort the posts by published date descending
  const sortedPosts = posts.slice().sort((a, b) => {
    const dateA = new Date(a.publishedAt || '').getTime()
    const dateB = new Date(b.publishedAt || '').getTime()
    return dateB - dateA
  })

  console.log('Sorted Posts:', sortedPosts)

  return (
    <div className={className}>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {sortedPosts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <Card
                  key={index}
                  className="h-full"
                  doc={result}
                  relationTo="posts"
                  showCategories
                />
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
