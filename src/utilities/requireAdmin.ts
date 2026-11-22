import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'

/**
 * The media manager's API routes live outside Payload's REST API, so Payload's
 * collection access control doesn't cover them. Each route calls this first and
 * returns `unauthorized` when no admin is logged in.
 */
export async function requireAdmin(
  headers: Headers,
): Promise<{ payload: Payload; unauthorized: NextResponse | null }> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return {
      payload,
      unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { payload, unauthorized: null }
}
