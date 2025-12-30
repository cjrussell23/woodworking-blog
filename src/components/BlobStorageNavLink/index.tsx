'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const BlobStorageNavLink: React.FC = () => {
  const pathname = usePathname()
  const { config } = useConfig()
  const isActive = pathname === '/admin/blob-storage'

  return (
    <Link
      href="/admin/blob-storage"
      className={`nav-link blob-storage-nav-link ${isActive ? 'active' : ''}`}
    >
      <span className="nav-link__label">Blob Storage</span>
    </Link>
  )
}

export default BlobStorageNavLink
