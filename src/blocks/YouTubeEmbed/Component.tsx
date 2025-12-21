import React from 'react'

export type YouTubeEmbedBlockProps = {
  videoId: string
  title?: string | null
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '4:5' | null
  autoplay?: boolean | null
  controls?: boolean | null
  loop?: boolean | null
  mute?: boolean | null
  modestBranding?: boolean | null
  showRelatedVideos?: boolean | null
  startTime?: number | null
  endTime?: number | null
  blockType: 'youtubeEmbed'
}

type Props = YouTubeEmbedBlockProps & {
  className?: string
}

const aspectRatioStyles = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
  '4:5': 'aspect-[4/5]',
}

export const YouTubeEmbedBlock: React.FC<Props> = ({
  className,
  videoId,
  title = 'YouTube video player',
  aspectRatio = '16:9',
  autoplay = false,
  controls = true,
  loop = false,
  mute = false,
  modestBranding = true,
  showRelatedVideos = false,
  startTime,
  endTime,
}) => {
  // Build YouTube embed URL with parameters
  const params = new URLSearchParams()

  if (autoplay) params.append('autoplay', '1')
  if (!controls) params.append('controls', '0')
  if (loop) {
    params.append('loop', '1')
    params.append('playlist', videoId) // Required for loop to work
  }
  if (mute) params.append('mute', '1')
  if (modestBranding) params.append('modestbranding', '1')
  if (!showRelatedVideos) params.append('rel', '0')
  if (startTime !== null && startTime !== undefined) params.append('start', String(startTime))
  if (endTime !== null && endTime !== undefined) params.append('end', String(endTime))

  const queryString = params.toString()
  const embedUrl = `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
  const aspectRatioClass = aspectRatioStyles[aspectRatio || '16:9'] || aspectRatioStyles['16:9']

  return (
    <div className={[className, 'w-full'].filter(Boolean).join(' ')}>
      <div className={`relative w-full ${aspectRatioClass}`}>
        <iframe
          src={embedUrl}
          title={title || 'YouTube video player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}
