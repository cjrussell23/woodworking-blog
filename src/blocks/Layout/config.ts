import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const columnFields: Field[] = [
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
    name: 'width',
    type: 'number',
    label: 'Custom Width (in pixels)',
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'media',
      description: 'Leave empty to use the original image width.',
    },
  },
  {
    name: 'height',
    type: 'number',
    label: 'Custom Height (in pixels)',
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'media',
      description: 'Leave empty to use the original image height.',
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
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Full Width',
      defaultValue: false,
      admin: {
        description: 'Break out of the container to span the full viewport width',
      },
    },
    {
      name: 'direction',
      type: 'select',
      defaultValue: 'row',
      options: [
        {
          label: 'Row (Horizontal)',
          value: 'row',
        },
        {
          label: 'Column (Vertical)',
          value: 'column',
        },
      ],
      admin: {
        description: 'Direction of the flex container',
      },
    },
    {
      name: 'justifyContent',
      type: 'select',
      defaultValue: 'start',
      options: [
        {
          label: 'Start',
          value: 'start',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'End',
          value: 'end',
        },
        {
          label: 'Space Between',
          value: 'between',
        },
        {
          label: 'Space Around',
          value: 'around',
        },
        {
          label: 'Space Evenly',
          value: 'evenly',
        },
      ],
      admin: {
        description: 'Horizontal alignment of items',
      },
    },
    {
      name: 'alignItems',
      type: 'select',
      defaultValue: 'stretch',
      options: [
        {
          label: 'Start',
          value: 'start',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'End',
          value: 'end',
        },
        {
          label: 'Stretch',
          value: 'stretch',
        },
      ],
      admin: {
        description: 'Vertical alignment of items',
      },
    },
    {
      name: 'wrap',
      type: 'checkbox',
      label: 'Wrap Items',
      defaultValue: true,
      admin: {
        description: 'Allow items to wrap to the next line',
      },
    },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
      admin: {
        description: 'Spacing between items',
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
