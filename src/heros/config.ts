import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'mediumImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
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
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'center',
      label: 'Image Position',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description: 'Control which part of the image is visible when using object-cover',
      },
      options: [
        {
          label: 'Top Left',
          value: 'top-left',
        },
        {
          label: 'Top Center',
          value: 'top-center',
        },
        {
          label: 'Top Right',
          value: 'top-right',
        },
        {
          label: 'Center Left',
          value: 'center-left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Center Right',
          value: 'center-right',
        },
        {
          label: 'Bottom Left',
          value: 'bottom-left',
        },
        {
          label: 'Bottom Center',
          value: 'bottom-center',
        },
        {
          label: 'Bottom Right',
          value: 'bottom-right',
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
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => !['mediumImpact'].includes(type),
        },
      },
    }),

    // Blur options
    {
      name: 'blur',
      type: 'group',
      label: 'Blur',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
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
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
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
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
