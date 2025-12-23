import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGallery',
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      label: 'Images',
      required: true,
      hasMany: true,
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'grid',
      required: true,
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
    },
    {
      name: 'gridColumns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '3',
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.displayMode === 'grid',
        description: 'Number of columns in the grid layout.',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Image Aspect Ratio',
      defaultValue: 'auto',
      options: [
        {
          label: 'Auto (Original)',
          value: 'auto',
        },
        {
          label: 'Square (1:1)',
          value: 'square',
        },
        {
          label: 'Landscape (16:9)',
          value: 'landscape',
        },
        {
          label: 'Portrait (3:4)',
          value: 'portrait',
        },
      ],
    },
    {
      name: 'objectFit',
      type: 'select',
      label: 'Image Fit',
      defaultValue: 'cover',
      options: [
        {
          label: 'Cover (Fill & Crop)',
          value: 'cover',
        },
        {
          label: 'Contain (Fit Within)',
          value: 'contain',
        },
      ],
      admin: {
        description: 'How images should fit within their container.',
      },
    },
    {
      name: 'gap',
      type: 'select',
      label: 'Gap Between Images',
      defaultValue: 'medium',
      options: [
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
    },
    {
      name: 'enableLightbox',
      type: 'checkbox',
      label: 'Enable Lightbox',
      defaultValue: true,
      admin: {
        description: 'Allow users to click images to view them in full size.',
      },
    },
  ],
}
