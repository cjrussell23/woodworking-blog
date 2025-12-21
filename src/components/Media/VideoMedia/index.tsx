'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, customWidth, customHeight } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { url, updatedAt } = resource

    const style: React.CSSProperties = {}
    if (customWidth) {
      style.width = `${customWidth}px`
    }
    if (customHeight) {
      style.height = `${customHeight}px`
    }

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
        style={Object.keys(style).length > 0 ? style : undefined}
      >
        <source src={getMediaUrl(url, updatedAt)} />
      </video>
    )
  }

  return null
}
