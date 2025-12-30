import { checkMultipleMediaUsage } from '@/utilities/checkMediaUsage'
import config from '@payload-config'
import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const { blobs } = await list()
    const payload = await getPayload({ config })

    // Get all media documents
    const { docs: mediaItems } = await payload.find({
      collection: 'media',
      limit: 10000,
      depth: 0,
    })

    // Check usage for all media items
    const mediaIds = mediaItems.map((item) => item.id)
    const usageMap = await checkMultipleMediaUsage(payload, mediaIds)

    // Add usage information to media items
    const mediaWithUsage = mediaItems.map((item) => ({
      ...item,
      usage: usageMap.get(item.id) || { isUsed: false, usedIn: [] },
    }))

    return NextResponse.json({
      blobs: blobs,
      media: mediaWithUsage,
    })
  } catch (error) {
    console.error('Error listing blobs:', error)
    return NextResponse.json({ error: 'Failed to list blobs' }, { status: 500 })
  }
}
