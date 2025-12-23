import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { VideoBlock as VideoBlockProps } from '@/payload-types'

import { VideoMedia } from '../../components/Media'

type Props = VideoBlockProps & {
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  videoClassName?: string
  disableInnerContainer?: boolean
}

export const VideoBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    videoClassName,
    video,
    disableInnerContainer,
    displayInline,
    position = 'left',
    width,
    height,
  } = props

  let caption
  if (video && typeof video === 'object') caption = video.caption

  return (
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
            }
          : undefined
      }
    >
      {video && (
        <VideoMedia
          videoClassName={cn('border border-border rounded-[0.8rem]', videoClassName)}
          resource={video}
          customWidth={width}
          customHeight={height}
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
  )
}
