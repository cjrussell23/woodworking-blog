import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'equal',
    options: [
      {
        label: 'Equal',
        value: 'equal',
      },
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'contentType',
    type: 'select',
    defaultValue: 'richText',
    options: [
      {
        label: 'Rich Text',
        value: 'richText',
      },
      {
        label: 'YouTube Video',
        value: 'youtubeVideo',
      },
      {
        label: 'Media',
        value: 'media',
      },
    ],
    required: true,
  },
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'media',
    },
  },
  {
    name: 'videoId',
    type: 'text',
    label: 'YouTube Video ID',
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'youtubeVideo',
      description:
        'Enter the YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
    },
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'richText',
    },
  },
]

export const Layout: Block = {
  slug: 'layout',
  interfaceName: 'LayoutBlock',
  fields: [
    {
      name: 'height',
      type: 'select',
      defaultValue: 'auto',
      options: [
        {
          label: 'Auto',
          value: 'auto',
        },
        {
          label: 'Small (300px)',
          value: 'small',
        },
        {
          label: 'Medium (500px)',
          value: 'medium',
        },
        {
          label: 'Large (700px)',
          value: 'large',
        },
        {
          label: 'Extra Large (900px)',
          value: 'xl',
        },
      ],
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Full Width',
      defaultValue: false,
      admin: {
        description: 'Break out of the container to span the full viewport width',
      },
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
      minRows: 1,
      maxRows: 4,
    },
  ],
}
