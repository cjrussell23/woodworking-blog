'use client'

import { Media } from '@/payload-types'
import { useAuth } from '@payloadcms/ui'
import { ListBlobResultBlob } from '@vercel/blob'
import React, { useEffect, useState } from 'react'
import './styles.scss'

type SortColumn = 'pathname' | 'size' | 'uploadedAt' | 'usedBy'
type SortDirection = 'asc' | 'desc'

type Status = {
  status: 'idle' | 'loading' | 'error'
  message?: string
}

export const BlobStorageView: React.FC = () => {
  const [blobs, setBlobs] = useState<ListBlobResultBlob[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [status, setStatus] = useState<Status>({ status: 'idle' })
  const { user } = useAuth()

  useEffect(() => {
    fetchBlobs()
  }, [])

  const fetchBlobs = async () => {
    try {
      setStatus({ status: 'loading' })
      const response = await fetch('/api/blobs/list')
      if (!response.ok) {
        throw new Error('Failed to fetch blobs')
      }
      const data = await response.json()
      setBlobs(data.blobs)
      setMedia(data.media)
    } catch (err) {
      setStatus({ status: 'error', message: (err as Error).message })
    } finally {
      setStatus({ status: 'idle' })
    }
  }

  const deleteOrphanedBlobs = async () => {
    if (!confirm('Are you sure you want to delete all blobs without media items?')) {
      return
    }

    try {
      setStatus({ status: 'loading', message: 'Deleting orphaned blobs...' })
      const response = await fetch('/api/blobs/delete-orphaned', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to delete orphaned blobs')
      }

      const data = await response.json()
      setStatus({ status: 'idle', message: `Deleted ${data.deletedCount} orphaned blobs` })

      // Refresh the list
      await fetchBlobs()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ status: 'idle' })
      }, 3000)
    } catch (err) {
      setStatus({ status: 'error', message: (err as Error).message })
    }
  }

  const orphanedBlobsCount = blobs.filter(
    (blob) => !media.find((m) => m.filename === blob.pathname),
  ).length

  return (
    <div>
      {status.message && <div className={`status-message ${status.status}`}>{status.message}</div>}
      <div className="blob-actions">
        <button
          onClick={deleteOrphanedBlobs}
          disabled={status.status === 'loading' || orphanedBlobsCount === 0}
          className="delete-orphaned-button"
        >
          {status.status === 'loading'
            ? 'Processing...'
            : `Delete Orphaned Blobs (${orphanedBlobsCount})`}
        </button>
      </div>
      <div className="tables-container">
        <MediaTable blobs={blobs} media={media} />
        <BlobTable blobs={blobs} media={media} />
      </div>
    </div>
  )
}

function BlobTable({ blobs, media }: { blobs: ListBlobResultBlob[]; media: Media[] }) {
  const [sortBy, setSortBy] = useState<SortColumn>('uploadedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const sortedBlobs = [...blobs].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'pathname':
        comparison = a.pathname.localeCompare(b.pathname)
        break
      case 'size':
        comparison = a.size - b.size
        break
      case 'uploadedAt':
        const dateA = new Date(a.uploadedAt).getTime()
        const dateB = new Date(b.uploadedAt).getTime()
        comparison = dateA - dateB
        break
      case 'usedBy':
        const mediaA = media.find((m) => m.filename === a.pathname)
        const mediaB = media.find((m) => m.filename === b.pathname)
        comparison = (mediaA ? 1 : 0) - (mediaB ? 1 : 0)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="blob-storage-table">
      <h2>Blob Storage Items ({blobs.length})</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('pathname')} className="sortable">
              Pathname {sortBy === 'pathname' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('size')} className="sortable">
              Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('uploadedAt')} className="sortable">
              Uploaded At {sortBy === 'uploadedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('usedBy')} className="sortable">
              Media {sortBy === 'usedBy' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedBlobs.map((blob) => {
            const matchedMedia = media.find((m) => m.filename === blob.pathname)
            return (
              <tr key={blob.url}>
                <td>{blob.pathname}</td>
                <td>{formatBytes(blob.size)}</td>
                <td>{formatDate(blob.uploadedAt.toString())}</td>
                <td>{matchedMedia ? '✓' : '✗'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function MediaTable({ blobs, media }: { blobs: ListBlobResultBlob[]; media: Media[] }) {
  const [sortBy, setSortBy] = useState<SortColumn>('uploadedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const sortedMedia = [...media].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'pathname':
        comparison = (a.filename || '').localeCompare(b.filename || '')
        break
      case 'size':
        comparison = (a.filesize || 0) - (b.filesize || 0)
        break
      case 'uploadedAt':
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        comparison = dateA - dateB
        break
      case 'usedBy':
        const blobA = blobs.find((blob) => blob.pathname === a.filename)
        const blobB = blobs.find((blob) => blob.pathname === b.filename)
        comparison = (blobA ? 1 : 0) - (blobB ? 1 : 0)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="blob-storage-table">
      <h2>Media Items ({media.length})</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('pathname')} className="sortable">
              Filename {sortBy === 'pathname' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('size')} className="sortable">
              File Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('usedBy')} className="sortable">
              Blob {sortBy === 'usedBy' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMedia.map((item) => {
            const matchedBlob = blobs.find((blob) => blob.pathname === item.filename)
            return (
              <tr key={item.id}>
                <td>{item.filename || 'N/A'}</td>
                <td>{formatBytes(item.filesize)}</td>
                <td>{matchedBlob ? '✓' : '✗'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
