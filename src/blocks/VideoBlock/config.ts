import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'video' },
      },
    },
    {
      name: 'displayInline',
      type: 'checkbox',
      label: 'Display Inline (allows text to wrap around video)',
      defaultValue: false,
      admin: {
        description: 'When enabled, the video will float and allow text to wrap around it.',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Position',
      defaultValue: 'left',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        condition: (_, siblingData) => {
          return siblingData.displayInline === true
        },
        description: 'Choose which side the video should appear on.',
      },
    },
    {
      name: 'width',
      type: 'number',
      label: 'Custom Width (in pixels)',
      admin: {
        description: 'Leave empty to use the original video width.',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'Custom Height (in pixels)',
      admin: {
        description: 'Leave empty to use the original video height.',
      },
    },
  ],
}
