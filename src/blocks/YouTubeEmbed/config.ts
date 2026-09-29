import type { Block, Condition, Field } from 'payload'

// Shared with the Layout block's YouTube columns
export const youtubeOptionFields = (condition?: Condition): Field[] => [
  {
    name: 'title',
    type: 'text',
    label: 'Video Title',
    admin: {
      condition,
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
      {
        label: '9:16 (Vertical/Portrait)',
        value: '9:16',
      },
      {
        label: '4:5 (Vertical)',
        value: '4:5',
      },
    ],
    admin: {
      condition,
    },
  },
  {
    name: 'autoplay',
    type: 'checkbox',
    label: 'Autoplay',
    defaultValue: false,
    admin: {
      condition,
      description: 'Video will play automatically when loaded (muted)',
    },
  },
  {
    name: 'controls',
    type: 'checkbox',
    label: 'Show Controls',
    defaultValue: true,
    admin: {
      condition,
      description: 'Show player controls',
    },
  },
  {
    name: 'loop',
    type: 'checkbox',
    label: 'Loop Video',
    defaultValue: false,
    admin: {
      condition,
      description: 'Video will restart when it ends',
    },
  },
  {
    name: 'mute',
    type: 'checkbox',
    label: 'Mute',
    defaultValue: false,
    admin: {
      condition,
      description: 'Mute the video audio',
    },
  },
  {
    name: 'modestBranding',
    type: 'checkbox',
    label: 'Modest Branding',
    defaultValue: true,
    admin: {
      condition,
      description: 'Minimize YouTube branding',
    },
  },
  {
    name: 'showRelatedVideos',
    type: 'checkbox',
    label: 'Show Related Videos',
    defaultValue: false,
    admin: {
      condition,
      description: 'Show related videos at the end',
    },
  },
  {
    name: 'startTime',
    type: 'number',
    label: 'Start Time (seconds)',
    admin: {
      condition,
      description: 'Start playback at specific time',
    },
  },
  {
    name: 'endTime',
    type: 'number',
    label: 'End Time (seconds)',
    admin: {
      condition,
      description: 'End playback at specific time',
    },
  },
]

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
    ...youtubeOptionFields(),
  ],
}
