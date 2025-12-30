import config from '@payload-config'
import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const { mediaIds } = await req.json()

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json({ error: 'Invalid media IDs' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get media items to find their blob URLs
    const { docs: mediaItems } = await payload.find({
      collection: 'media',
      where: {
        id: { in: mediaIds },
      },
      limit: mediaIds.length,
    })

    const deletedMedia: string[] = []
    const deletedBlobs: string[] = []
    const errors: string[] = []

    for (const media of mediaItems) {
      try {
        // Delete from blob storage if URL exists
        if (media.url) {
          await del(media.url)
          deletedBlobs.push(media.filename || String(media.id))
        }

        // Delete from Payload
        await payload.delete({
          collection: 'media',
          id: media.id,
        })
        deletedMedia.push(String(media.id))
      } catch (error) {
        console.error(`Error deleting media ${media.id}:`, error)
        errors.push(`Failed to delete ${media.filename || media.id}`)
      }
    }

    return NextResponse.json({
      success: true,
      deletedMedia: deletedMedia.length,
      deletedBlobs: deletedBlobs.length,
      errors,
    })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
