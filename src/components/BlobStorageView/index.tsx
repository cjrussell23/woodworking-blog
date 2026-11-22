import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { BlobStorageView as BlobStorageClient } from './Component.client'

// Payload's custom root views render without the admin chrome and without a
// login check, so this wrapper adds both.
export default function BlobStorageView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult

  if (!req.user) {
    redirect(`${req.payload.config.routes.admin}/login`)
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <h1>Blob Storage</h1>
        <BlobStorageClient />
      </Gutter>
    </DefaultTemplate>
  )
}
