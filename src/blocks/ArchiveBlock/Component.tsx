'use client'

import type { ArchiveBlock as ArchiveBlockProps, Post } from '@/payload-types'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    className?: string
    posts?: Post[]
    populatedDocs?: Post[]
  }
> = (props) => {
  const { id, className, selectedDocs, posts, populatedDocs } = props

  // Use provided posts, or populatedDocs (from afterRead hook), or fall back to selectedDocs
  const displayPosts =
    posts ||
    populatedDocs ||
    (selectedDocs
      ?.map((post) => {
        if (typeof post.value === 'object') return post.value
        return null
      })
      .filter(Boolean) as Post[]) ||
    []

  return (
    <div className={className} id={`block-${id}`}>
      <CollectionArchive posts={displayPosts} />
    </div>
  )
}
