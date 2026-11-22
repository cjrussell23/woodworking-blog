import { requireAdmin } from '@/utilities/requireAdmin'
import { del, list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { payload, unauthorized } = await requireAdmin(req.headers)
    if (unauthorized) return unauthorized

    // Get all blobs from Vercel Blob storage
    const { blobs } = await list()

    // Get all media documents
    const { docs: mediaItems } = await payload.find({
      collection: 'media',
      limit: 10000,
      depth: 0,
    })

    // Create a set of filenames that exist in media collection
    const mediaFilenames = new Set(mediaItems.map((m) => m.filename))

    // Find orphaned blobs (blobs without corresponding media items)
    const orphanedBlobs = blobs.filter((blob) => !mediaFilenames.has(blob.pathname))

    // Delete orphaned blobs
    let deletedCount = 0
    const errors: string[] = []

    for (const blob of orphanedBlobs) {
      try {
        await del(blob.url)
        deletedCount++
      } catch (error) {
        console.error(`Failed to delete blob ${blob.pathname}:`, error)
        errors.push(blob.pathname)
      }
    }

    return NextResponse.json({
      deletedCount,
      totalOrphaned: orphanedBlobs.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error deleting orphaned blobs:', error)
    return NextResponse.json({ error: 'Failed to delete orphaned blobs' }, { status: 500 })
  }
}
