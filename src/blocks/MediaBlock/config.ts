import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'displayInline',
      type: 'checkbox',
      label: 'Display Inline (allows text to wrap around image)',
      defaultValue: false,
      admin: {
        description: 'When enabled, the image will float and allow text to wrap around it.',
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
        condition: (data) => data.displayInline === true,
        description: 'Choose which side the image should appear on.',
      },
    },
    {
      name: 'width',
      type: 'number',
      label: 'Custom Width (in pixels)',
      admin: {
        description: 'Leave empty to use the original image width.',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'Custom Height (in pixels)',
      admin: {
        description: 'Leave empty to use the original image height.',
      },
    },
  ],
}
