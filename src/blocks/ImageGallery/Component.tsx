'use client'

import { ImageMedia } from '@/components/Media'
import RichText from '@/components/RichText'

import type { ImageGallery as ImageGalleryProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { useState } from 'react'

type Props = ImageGalleryProps & {
  className?: string
}

export const ImageGalleryBlock: React.FC<Props> = (props) => {
  const {
    images,
    displayMode = 'grid',
    gridColumns = '3',
    aspectRatio = 'auto',
    objectFit = 'cover',
    gap = 'medium',
    enableLightbox = true,
    className,
  } = props

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  const gapClasses = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
  }

  const gridColClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const gapClass = gap ? gapClasses[gap] : gapClasses.medium
  const aspectRatioClass = aspectRatio ? aspectRatioClasses[aspectRatio] : aspectRatioClasses.auto
  const objectFitClass = objectFit
    ? objectFitClasses[objectFit as 'cover' | 'contain']
    : objectFitClasses.cover
  const gridColClass = gridColumns
    ? gridColClasses[gridColumns as '2' | '3' | '4']
    : gridColClasses['3']

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleLightboxOpen = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index)
    }
  }

  const handleLightboxClose = () => {
    setLightboxIndex(null)
  }

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : (prev ?? 0) - 1))
  }

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => ((prev ?? 0) === images.length - 1 ? 0 : (prev ?? 0) + 1))
  }

  if (displayMode === 'carousel') {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((item, index) => {
              const image = typeof item === 'object' ? item : null
              return (
                <div key={index} className="w-full flex-shrink-0">
                  <div
                    className={cn(
                      'relative w-full overflow-hidden',
                      aspectRatioClass,
                      enableLightbox && 'cursor-pointer',
                    )}
                    onClick={() => handleLightboxOpen(index)}
                  >
                    {image && (
                      <ImageMedia
                        resource={image}
                        imgClassName={cn(
                          'border bg-foreground border-border rounded-lg',
                          objectFitClass,
                        )}
                      />
                    )}
                    {image?.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-sm p-2">
                        <RichText data={image.caption} enableGutter={false} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75',
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Grid Layout
  return (
    <>
      <div className={cn('grid', gridColClass, gapClass, className)}>
        {images.map((item, index) => {
          const image = typeof item === 'object' ? item : null
          return (
            <div key={index} className="border border-border">
              <div
                className={cn(
                  'relative overflow-hidden',
                  aspectRatioClass,
                  enableLightbox && 'cursor-pointer hover:opacity-90 transition-opacity',
                )}
                onClick={() => handleLightboxOpen(index)}
              >
                {image && (
                  <ImageMedia resource={image} imgClassName={cn('bg-foreground', objectFitClass)} />
                )}
                {image?.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
                    <RichText data={image.caption} enableGutter={false} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {enableLightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handleLightboxClose}
        >
          <button
            onClick={handleLightboxClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const item = images[lightboxIndex]
                const image = typeof item === 'object' ? item : null
                return (
                  <div className="relative">
                    {image && (
                      <ImageMedia
                        resource={image}
                        imgClassName={cn('max-w-full max-h-[90vh] bg-foreground', objectFitClass)}
                      />
                    )}
                    {image?.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center p-3">
                        <RichText data={image.caption} enableGutter={false} />
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLightboxPrev()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLightboxNext()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
                  {lightboxIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
