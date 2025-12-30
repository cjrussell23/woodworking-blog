import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Delete the blob
    await del(url)

    return NextResponse.json({ success: true, message: 'Blob deleted successfully' })
  } catch (error) {
    console.error('Error deleting blob:', error)
    return NextResponse.json({ error: 'Failed to delete blob' }, { status: 500 })
  }
}
