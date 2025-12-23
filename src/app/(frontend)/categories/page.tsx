import type { Metadata } from 'next/types'

import { ImageMedia } from '@/components/Media'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: 'title',
  })

  return (
    <div className="pt-12 pb-24">
      <PageClient />
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Categories</h1>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.docs.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="block border border-border rounded-lg hover:border-primary transition-colors overflow-hidden group aspect-square relative"
            >
              {category.image && typeof category.image !== 'string' && (
                <ImageMedia
                  resource={category.image}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 flex items-end">
                <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm px-4 py-3 w-full">
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Categories',
    description: 'Browse posts by category',
  }
}
