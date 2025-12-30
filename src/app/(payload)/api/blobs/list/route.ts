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

    return NextResponse.json({
      blobs: blobs,
      media: mediaItems,
    })
  } catch (error) {
    console.error('Error listing blobs:', error)
    return NextResponse.json({ error: 'Failed to list blobs' }, { status: 500 })
  }
}
