import type { Block } from 'payload'

export const YouTubeEmbed: Block = {
  slug: 'youtubeEmbed',
  interfaceName: 'YouTubeEmbedBlock',
  fields: [
    {
      name: 'videoId',
      type: 'text',
      label: 'YouTube Video ID',
      required: true,
      admin: {
        description:
          'Enter the YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Video Title',
      admin: {
        description: 'Optional title for accessibility',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16:9',
      options: [
        {
          label: '16:9 (Widescreen)',
          value: '16:9',
        },
        {
          label: '4:3 (Standard)',
          value: '4:3',
        },
        {
          label: '1:1 (Square)',
          value: '1:1',
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
      admin: {
        description: 'Video will play automatically when loaded (muted)',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      label: 'Show Controls',
      defaultValue: true,
      admin: {
        description: 'Show player controls',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop Video',
      defaultValue: false,
      admin: {
        description: 'Video will restart when it ends',
      },
    },
    {
      name: 'mute',
      type: 'checkbox',
      label: 'Mute',
      defaultValue: false,
      admin: {
        description: 'Mute the video audio',
      },
    },
    {
      name: 'modestBranding',
      type: 'checkbox',
      label: 'Modest Branding',
      defaultValue: true,
      admin: {
        description: 'Minimize YouTube branding',
      },
    },
    {
      name: 'showRelatedVideos',
      type: 'checkbox',
      label: 'Show Related Videos',
      defaultValue: false,
      admin: {
        description: 'Show related videos at the end',
      },
    },
    {
      name: 'startTime',
      type: 'number',
      label: 'Start Time (seconds)',
      admin: {
        description: 'Start playback at specific time',
      },
    },
    {
      name: 'endTime',
      type: 'number',
      label: 'End Time (seconds)',
      admin: {
        description: 'End playback at specific time',
      },
    },
  ],
}
