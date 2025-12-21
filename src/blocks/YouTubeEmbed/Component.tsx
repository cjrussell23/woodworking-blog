import React from 'react'

export type YouTubeEmbedBlockProps = {
  videoId: string
  title?: string | null
  aspectRatio?: '16:9' | '4:3' | '1:1' | null
  blockType: 'youtubeEmbed'
}

type Props = YouTubeEmbedBlockProps & {
  className?: string
}

const aspectRatioStyles = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
}

export const YouTubeEmbedBlock: React.FC<Props> = ({
  className,
  videoId,
  title = 'YouTube video player',
  aspectRatio = '16:9',
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`
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
