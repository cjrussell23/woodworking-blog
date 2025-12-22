import { YouTubeEmbedBlock } from '@/blocks/YouTubeEmbed/Component'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { LayoutBlock as LayoutBlockProps } from '@/payload-types'

export const LayoutBlock: React.FC<LayoutBlockProps> = (props) => {
  const { columns, fullWidth, direction, justifyContent, alignItems, wrap, gap } = props

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8',
  }

  return (
    <div
      className={cn('my-4', {
        'w-screen relative left-1/2 -translate-x-1/2': fullWidth,
      })}
    >
      <div
        className={cn(
          'flex',
          {
            'flex-row': direction === 'row',
            'flex-col': direction === 'column',
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
            'px-4 md:px-8': fullWidth,
          },
          gapClasses[gap || 'medium'],
        )}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, media, videoId, contentType, width, height } = col

            return (
              <div className="size-fit" key={col.id || index}>
                {contentType === 'media' && media && typeof media === 'object' && (
                  <Media
                    imgClassName="border border-border rounded-[0.8rem]"
                    resource={media}
                    customWidth={width}
                    customHeight={height}
                  />
                )}
                {contentType === 'youtubeVideo' && videoId && (
                  <YouTubeEmbedBlock videoId={videoId} blockType="youtubeEmbed" />
                )}
                {contentType === 'richText' && richText && (
                  <RichText data={richText} enableGutter={false} />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
