'use client'

import { YouTubeEmbedBlock } from '@/blocks/YouTubeEmbed/Component'
import { ImageMedia, VideoMedia } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { LayoutBlock as LayoutBlockProps } from '@/payload-types'

export const LayoutBlock: React.FC<
  LayoutBlockProps & {
    isPage: boolean
  }
> = (props) => {
  const { columns, direction, justifyContent, alignItems, wrap, gap, isPage } = props
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null)

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8',
  }

  // Handle ESC key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImageIndex !== null) {
        setFullscreenImageIndex(null)
      }
    }

    if (fullscreenImageIndex !== null) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [fullscreenImageIndex])

  return (
    <div className={isPage ? 'container' : 'my-4'}>
      <div
        className={cn(
          'flex flex-col',
          {
            'md:flex-row': direction === 'row',
            'md:flex-col': direction === 'column',
            'flex-wrap': wrap,
            'flex-nowrap': !wrap,
            'justify-start': justifyContent === 'start',
            'justify-center': justifyContent === 'center',
            'justify-end': justifyContent === 'end',
            'justify-between': justifyContent === 'between',
            'justify-around': justifyContent === 'around',
            'justify-evenly': justifyContent === 'evenly',
            'items-start': alignItems === 'start',
            'items-center': alignItems === 'center',
            'items-end': alignItems === 'end',
            'items-stretch': alignItems === 'stretch',
          },
          gapClasses[gap || 'medium'],
        )}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, media, videoId, contentType, width, height } = col

            return (
              <div
                // size-fit collapses the YouTube embed (percentage-sized) to 0 width
                className={
                  contentType === 'youtubeVideo' ? 'w-full min-w-0 md:basis-1/2 md:grow' : 'size-fit'
                }
                key={col.id || index}
              >
                {contentType === 'media' && media && typeof media === 'object' && (
                  <>
                    {media.mimeType?.includes('video') ? (
                      <VideoMedia
                        videoClassName="border border-border rounded-md"
                        resource={media}
                        customWidth={width}
                        customHeight={height}
                      />
                    ) : (
                      <ImageMedia
                        imgClassName="border border-border rounded-md w-full"
                        className="cursor-pointer"
                        resource={media}
                        customWidth={width}
                        customHeight={height}
                        onClick={() => setFullscreenImageIndex(index)}
                      />
                    )}
                  </>
                )}
                {contentType === 'youtubeVideo' && videoId && (
                  <YouTubeEmbedBlock
                    blockType="youtubeEmbed"
                    videoId={videoId}
                    title={col.title}
                    aspectRatio={col.aspectRatio}
                    autoplay={col.autoplay}
                    controls={col.controls}
                    loop={col.loop}
                    mute={col.mute}
                    modestBranding={col.modestBranding}
                    showRelatedVideos={col.showRelatedVideos}
                    startTime={col.startTime}
                    endTime={col.endTime}
                  />
                )}
                {contentType === 'richText' && richText && (
                  <RichText data={richText} enableGutter={false} />
                )}

                {/* Fullscreen Modal */}
                {fullscreenImageIndex !== null &&
                  columns &&
                  columns[fullscreenImageIndex] &&
                  typeof window !== 'undefined' &&
                  (() => {
                    const col = columns[fullscreenImageIndex]
                    const { media } = col

                    if (!media || typeof media !== 'object' || media.mimeType?.includes('video')) {
                      return null
                    }

                    const { height: originalHeight, url, width: originalWidth, alt } = media
                    const cacheTag = media.updatedAt
                    const src = getMediaUrl(url, cacheTag)

                    return createPortal(
                      <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
                        onClick={() => setFullscreenImageIndex(null)}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <button
                          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[10000]"
                          onClick={() => setFullscreenImageIndex(null)}
                          aria-label="Close fullscreen"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <div
                          className="fixed inset-0 w-screen h-screen flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <NextImage
                            alt={alt || ''}
                            src={src}
                            width={originalWidth || 1920}
                            height={originalHeight || 1080}
                            className="w-full h-full object-contain"
                            quality={100}
                            priority
                          />
                        </div>
                      </div>,
                      document.body,
                    )
                  })()}
              </div>
            )
          })}
      </div>
    </div>
  )
}
