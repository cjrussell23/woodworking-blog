import type { Metadata } from 'next'

import type { Config, Media, Page, Post } from '../payload-types'

import { getServerSideURL } from './getURL'
import { mergeOpenGraph } from './mergeOpenGraph'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    const cacheTag = 'updatedAt' in image && image.updatedAt ? image.updatedAt : ''
    url = `${serverUrl}${image.url}${cacheTag ? `?${encodeURIComponent(cacheTag)}` : ''}`
  }

  return url
}

const isPost = (doc: Partial<Page> | Partial<Post> | null): doc is Post => {
  return doc !== null && 'authors' in doc
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title || doc?.title || 'Untitled'
  const description = doc?.meta?.description || ''

  // Determine the correct URL path
  let path = '/'
  if (doc?.slug) {
    if (isPost(doc)) {
      path = `/posts/${doc.slug}`
    } else if (doc.slug === 'home') {
      path = '/'
    } else {
      path = `/${doc.slug}`
    }
  }

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url: path,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
