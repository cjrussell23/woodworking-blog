import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'textColor',
      type: 'select',
      defaultValue: 'default',
      label: 'Text Color',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
        {
          label: 'Accent',
          value: 'accent',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },

    // Blur options
    {
      name: 'blur',
      type: 'group',
      label: 'Blur',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Blur',
          defaultValue: false,
        },
        {
          name: 'strength',
          type: 'number',
          label: 'Blur Strength (px)',
          min: 0,
          max: 40,
          defaultValue: 2,
        },
      ],
    },

    // Overlay options
    {
      name: 'overlay',
      type: 'group',
      label: 'Overlay',
      fields: [
        {
          name: 'color',
          type: 'text',
          label: 'Overlay Color (CSS)',
          defaultValue: 'black',
        },
        {
          name: 'opacity',
          type: 'number',
          label: 'Overlay Opacity (0-1)',
          min: 0,
          max: 1,
          admin: {
            step: 0.01,
          },
          defaultValue: 0.4,
        },
      ],
    },
    {
      name: 'height',
      type: 'select',
      label: 'Image Height',
      defaultValue: 'medium',
      options: [
        {
          label: 'X-Small',
          value: 'xsmall',
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
        {
          label: 'X-Large',
          value: 'xlarge',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
