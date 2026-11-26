import {defineArrayMember, defineField, defineType} from 'sanity'

/** The pictures `pnpm images` makes. They live in the code; content picks one and describes it. */
const PICTURES = [
  'certificate',
  'cmy',
  'edges-ml',
  'flow-3-pens',
  'graph',
  'hedcut',
  'ink-heat',
  'ink-plain',
  'ml-depth',
  'ml-lines',
  'ml-photo',
  'ml-subject',
  'mockup-portrait',
  'mockup-square',
  'mockup-wall',
  'noiserings',
  'piece-1',
  'proof-sheet',
  'relief',
  'ridgelines',
  'sketch',
  'spectrogram',
  'turtletree',
  'wovenlines',
]

export const text = (name: string, title?: string) =>
  defineField({name, title, type: 'string', validation: (rule) => rule.required()})

export const longText = (name: string, title?: string) =>
  defineField({name, title, type: 'text', rows: 3, validation: (rule) => rule.required()})

export const object = (name: string, type: string, title?: string) =>
  defineField({name, title, type, validation: (rule) => rule.required()})

export const list = (name: string, type: string, title?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({type})],
    validation: (rule) => rule.required().min(1),
  })

export const richText = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'Heading', value: 'h2'},
        ],
        lists: [{title: 'Bullet', value: 'bullet'}],
        marks: {
          decorators: [
            {title: 'Strong', value: 'strong'},
            {title: 'Code', value: 'code'},
          ],
          annotations: [
            defineField({
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({
                  name: 'href',
                  type: 'url',
                  validation: (rule) =>
                    rule.required().uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
                }),
              ],
            }),
          ],
        },
      }),
    ],
    validation: (rule) => rule.required().min(1),
  })

const picture = defineField({
  name: 'picture',
  type: 'string',
  description: "One of TerraGen's own pictures, made by `pnpm images`.",
  options: {list: PICTURES},
  validation: (rule) => rule.required(),
})

const alt = defineField({
  name: 'alt',
  title: 'Alternative text',
  type: 'text',
  rows: 2,
  description: 'What the picture shows, for people who cannot see it.',
  validation: (rule) => rule.required(),
})

const preview = (title: string, subtitle: string) => ({select: {title, subtitle}})

export const objects = [
  defineType({
    name: 'sheet',
    title: 'Plotted sheet',
    type: 'object',
    fields: [picture, alt, list('labels', 'string', 'Title block')],
    preview: preview('picture', 'alt'),
  }),
  defineType({
    name: 'figure',
    title: 'Captioned picture',
    type: 'object',
    fields: [picture, alt, text('caption')],
    preview: preview('caption', 'picture'),
  }),
  defineType({
    name: 'journeyStep',
    title: 'Publish step',
    type: 'object',
    fields: [picture, alt, text('lead', 'Bold lead-in'), longText('caption')],
    preview: preview('lead', 'caption'),
  }),
  defineType({
    name: 'person',
    type: 'object',
    fields: [picture, alt, text('title'), longText('description')],
    preview: preview('title', 'description'),
  }),
  defineType({
    name: 'feature',
    type: 'object',
    fields: [text('title'), longText('description')],
    preview: preview('title', 'description'),
  }),
  defineType({
    name: 'stage',
    type: 'object',
    fields: [
      text('title'),
      longText('description'),
      defineField({name: 'pro', title: 'Pro only', type: 'boolean', initialValue: false}),
    ],
    preview: preview('title', 'description'),
  }),
  defineType({
    name: 'cta',
    title: 'Call to action',
    type: 'object',
    fields: [text('line'), text('buttonLabel')],
  }),
  defineType({
    name: 'planRow',
    title: 'Comparison row',
    type: 'object',
    fields: [
      text('feature'),
      defineField({
        name: 'free',
        title: 'In Free',
        type: 'boolean',
        initialValue: false,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'pro',
        title: 'In Pro',
        type: 'boolean',
        initialValue: true,
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {select: {title: 'feature'}},
  }),
  defineType({
    name: 'navLink',
    title: 'Link',
    type: 'object',
    fields: [text('label'), text('href', 'Address')],
    preview: preview('label', 'href'),
  }),
]
