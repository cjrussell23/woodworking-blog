'use client'

import { Media } from '@/payload-types'
import { ListBlobResultBlob } from '@vercel/blob'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import './styles.scss'

interface MediaUsageInfo {
  isUsed: boolean
  usedIn: {
    collection: string
    count: number
  }[]
}

interface MediaWithUsage extends Media {
  usage?: MediaUsageInfo
}

type SortColumn = 'pathname' | 'size' | 'uploadedAt' | 'usedBy' | 'inUse'
type SortDirection = 'asc' | 'desc'
type MediaId = string | number

type Status = {
  status: 'idle' | 'loading' | 'error'
  message?: string
}

export const BlobStorageView: React.FC = () => {
  const [blobs, setBlobs] = useState<ListBlobResultBlob[]>([])
  const [media, setMedia] = useState<MediaWithUsage[]>([])
  const [status, setStatus] = useState<Status>({ status: 'idle' })
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null)

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
        <MediaTable
          blobs={blobs}
          media={media}
          onRefresh={fetchBlobs}
          setStatus={setStatus}
          onViewImage={setLightboxImage}
        />
        <BlobTable blobs={blobs} media={media} onViewImage={setLightboxImage} />
      </div>
      {lightboxImage && (
        <Lightbox
          imageUrl={lightboxImage.url}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  )
}

function BlobTable({
  blobs,
  media,
  onViewImage,
}: {
  blobs: ListBlobResultBlob[]
  media: Media[]
  onViewImage: (image: { url: string; alt: string }) => void
}) {
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
            <th>View</th>
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
            const isImage = matchedMedia?.mimeType?.startsWith('image/')
            return (
              <tr key={blob.url}>
                <td className="view-column">
                  {isImage ? (
                    <button
                      onClick={() => onViewImage({ url: blob.url, alt: blob.pathname })}
                      className="view-button"
                      title="View image"
                    >
                      View
                    </button>
                  ) : (
                    <span className="no-view">—</span>
                  )}
                </td>
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

function MediaTable({
  blobs,
  media,
  onRefresh,
  setStatus,
  onViewImage,
}: {
  blobs: ListBlobResultBlob[]
  media: MediaWithUsage[]
  onRefresh: () => Promise<void>
  setStatus: React.Dispatch<React.SetStateAction<Status>>
  onViewImage: (image: { url: string; alt: string }) => void
}) {
  const [sortBy, setSortBy] = useState<SortColumn>('uploadedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedItems, setSelectedItems] = useState<Set<MediaId>>(new Set())

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(media.map((m) => m.id)))
    }
  }

  const toggleSelectItem = (id: MediaId) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const deleteSelectedMedia = async () => {
    if (selectedItems.size === 0) return

    const selectedArray = Array.from(selectedItems).map(String)
    const selectedMedia = media.filter((m) => selectedItems.has(m.id))
    const inUseItems = selectedMedia.filter((m) => m.usage?.isUsed)

    let confirmMessage = `Are you sure you want to delete ${selectedItems.size} media item${selectedItems.size > 1 ? 's' : ''}?`
    if (inUseItems.length > 0) {
      confirmMessage += `\n\nWarning: ${inUseItems.length} item${inUseItems.length > 1 ? 's are' : ' is'} currently in use on your site!`
    }

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setStatus({ status: 'loading', message: 'Deleting media...' })
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaIds: selectedArray }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete media')
      }

      const data = await response.json()
      let message = `Deleted ${data.deletedMedia} media item${data.deletedMedia > 1 ? 's' : ''}`
      if (data.errors.length > 0) {
        message += ` (${data.errors.length} error${data.errors.length > 1 ? 's' : ''})`
      }
      setStatus({ status: 'idle', message })

      // Clear selection and refresh
      setSelectedItems(new Set())
      await onRefresh()

      // Clear message after 3 seconds
      setTimeout(() => {
        setStatus({ status: 'idle' })
      }, 3000)
    } catch (err) {
      setStatus({ status: 'error', message: (err as Error).message })
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
      case 'inUse':
        comparison = (a.usage?.isUsed ? 1 : 0) - (b.usage?.isUsed ? 1 : 0)
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
      <div className="table-header">
        <h2>Media Items ({media.length})</h2>
        {selectedItems.size > 0 && (
          <button onClick={deleteSelectedMedia} className="delete-selected-button">
            Delete Selected ({selectedItems.size})
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                checked={selectedItems.size === media.length && media.length > 0}
                onChange={toggleSelectAll}
                title="Select all"
              />
            </th>
            <th>View</th>
            <th onClick={() => handleSort('pathname')} className="sortable">
              Filename {sortBy === 'pathname' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('size')} className="sortable">
              File Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('usedBy')} className="sortable">
              Blob {sortBy === 'usedBy' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('inUse')} className="sortable">
              In Use {sortBy === 'inUse' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMedia.map((item) => {
            const matchedBlob = blobs.find((blob) => blob.pathname === item.filename)
            const usageText = item.usage?.isUsed
              ? item.usage.usedIn.map((u) => `${u.collection} (${u.count})`).join(', ')
              : 'Not used'
            const isImage = item.mimeType?.startsWith('image/')
            const imageUrl = matchedBlob?.url || (item.url as string)
            return (
              <tr key={item.id} className={selectedItems.has(item.id) ? 'selected' : ''}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </td>
                <td className="view-column">
                  {isImage && imageUrl ? (
                    <button
                      onClick={() =>
                        onViewImage({ url: imageUrl, alt: item.alt || item.filename || '' })
                      }
                      className="view-button"
                      title="View image"
                    >
                      View
                    </button>
                  ) : (
                    <span className="no-view">—</span>
                  )}
                </td>
                <td>{item.filename || 'N/A'}</td>
                <td>{formatBytes(item.filesize)}</td>
                <td>{matchedBlob ? '✓' : '✗'}</td>
                <td title={usageText}>{item.usage?.isUsed ? '✓' : '✗'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Lightbox({
  imageUrl,
  alt,
  onClose,
}: {
  imageUrl: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} title="Close (Esc)">
          ✕
        </button>
        <Image
          src={imageUrl}
          alt={alt}
          className="lightbox-image"
          width={1920}
          height={1080}
          style={{ maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto' }}
          unoptimized
        />
        <div className="lightbox-caption">{alt}</div>
      </div>
    </div>
  )
}
