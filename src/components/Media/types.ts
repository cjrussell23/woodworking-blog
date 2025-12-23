import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

// Base props shared by both image and video media
export interface BaseMediaProps {
  alt?: string
  className?: string
  htmlElement?: ElementType | null
  onClick?: () => void
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  customWidth?: number | null // custom width in pixels
  customHeight?: number | null // custom height in pixels
}

// Image-specific props
export interface ImageMediaProps extends BaseMediaProps {
  fill?: boolean
  pictureClassName?: string
  imgClassName?: string
  onLoad?: () => void
  loading?: 'lazy' | 'eager'
  priority?: boolean
  size?: string
  src?: StaticImageData // for static media
}

// Video-specific props
export interface VideoMediaProps extends BaseMediaProps {
  videoClassName?: string
}
