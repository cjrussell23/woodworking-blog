import { YouTubeEmbedBlock } from '@/blocks/YouTubeEmbed/Component'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { LayoutBlock as LayoutBlockProps } from '@/payload-types'

export const LayoutBlock: React.FC<LayoutBlockProps> = (props) => {
  const { columns, height, fullWidth } = props

  const colsSpanClasses = {
    equal: '12',
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const heightClasses = {
    auto: 'min-h-min',
    small: 'min-h-[300px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[700px]',
    xl: 'min-h-[900px]',
  }

  // Calculate number of columns from array length
  const numberOfColumns = columns?.length || 1

  // Calculate equal column span based on number of columns
  const getEqualColumnSpan = (numCols: number) => {
    const colsMap: { [key: number]: string } = {
      1: '12',
      2: '6',
      3: '4',
      4: '3',
    }
    return colsMap[numCols] || '12'
  }

  const equalColSpan = getEqualColumnSpan(numberOfColumns)

  return (
    <div
      className={cn('my-4', {
        // container: !fullWidth,
        'w-screen relative left-1/2 -translate-x-1/2': fullWidth,
      })}
    >
      <div
        className={cn('grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16', {
          'px-4 md:px-8': fullWidth,
        })}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, size, media, videoId, contentType } = col

            // Use equal sizing if 'equal' is selected, otherwise use specific size
            const columnSpan =
              size === 'equal' ? equalColSpan : colsSpanClasses[size!] || equalColSpan

            return (
              <div
                className={cn(
                  `col-span-4 lg:col-span-${columnSpan}`,
                  heightClasses[height!] || heightClasses.auto,
                  {
                    'md:col-span-2': size !== 'full' && numberOfColumns !== 1,
                  },
                )}
                key={col.id || index}
              >
                {contentType === 'media' && media && typeof media === 'object' && (
                  <Media imgClassName="border border-border rounded-[0.8rem]" resource={media} />
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
