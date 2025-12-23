'use client'

import type { StaticImageData } from 'next/image'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ImageBlock as ImageBlockProps } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { ImageMedia } from '../../components/Media'

type Props = ImageBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const ImageBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    displayInline,
    position = 'left',
    width,
    height,
  } = props

  const [isFullScreen, setIsFullScreen] = useState(false)

  let caption
  if (media && typeof media === 'object') caption = media.caption

  // Store original dimensions for fullscreen display
  let originalWidth: number | undefined
  let originalHeight: number | undefined
  let src: string | StaticImageData = staticImage || ''

  if (!staticImage && media && typeof media === 'object') {
    const { height: fullHeight, url, width: fullWidth } = media
    originalWidth = fullWidth!
    originalHeight = fullHeight!
    const cacheTag = media.updatedAt
    src = getMediaUrl(url, cacheTag)
  }

  // Handle ESC key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isFullScreen])

  const enableFullscreen = !displayInline // Only enable fullscreen for non-inline images
  const canShowFullscreen = enableFullscreen && Boolean(src)

  return (
    <>
      <div
        className={cn(
          '',
          {
            container: enableGutter,
            'float-left mr-4 mb-2': displayInline && position === 'left',
            'float-right ml-4 mb-2': displayInline && position === 'right',
          },
          className,
        )}
        style={
          displayInline && (width || height)
            ? {
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined,
                maxWidth: '100%',
              }
            : undefined
        }
      >
        {(media || staticImage) && (
          <ImageMedia
            imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
            pictureClassName={canShowFullscreen ? 'cursor-pointer' : undefined}
            resource={media}
            src={staticImage}
            customWidth={width}
            customHeight={height}
            onClick={canShowFullscreen ? () => setIsFullScreen(true) : undefined}
          />
        )}
        {caption && (
          <div
            className={cn(
              'mt-6',
              {
                container: !disableInnerContainer,
              },
              captionClassName,
            )}
          >
            <RichText data={caption} enableGutter={false} />
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen &&
        canShowFullscreen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
            onClick={() => setIsFullScreen(false)}
            style={{ margin: 0, padding: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[10000]"
              onClick={() => setIsFullScreen(false)}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="fixed inset-0 w-screen h-screen flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <NextImage
                alt={(media && typeof media === 'object' && media.alt) || ''}
                src={src}
                width={originalWidth || width || 1920}
                height={originalHeight || height || 1080}
                className="w-full h-full object-contain"
                quality={100}
                priority
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
