import {defineField, defineType, type FieldDefinition} from 'sanity'
import {list, longText, object, text} from './objects'

const sectionNames = [
  ['hero', 'Hero'],
  ['styles', 'Styles'],
  ['how', 'How it works'],
  ['ink', 'Ink'],
  ['graph', 'Graph and code'],
  ['plot', 'Plot'],
  ['publish', 'Publish'],
  ['ml', 'On-device ML'],
  ['pricing', 'Free and Pro'],
  ['who', 'Who it is for'],
  ['journal', 'Journal'],
  ['download', 'Download'],
] as const

const section = (name: (typeof sectionNames)[number][0], fields: FieldDefinition[]) =>
  defineField({
    name,
    title: sectionNames.find(([n]) => n === name)?.[1],
    type: 'object',
    group: name,
    fields,
    validation: (rule) => rule.required(),
  })

const heading = [text('eyebrow'), text('title')]
const intro = [...heading, longText('lede', 'Introduction')]

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    ...sectionNames.map(([name, title]) => ({name, title})),
    {name: 'seo', title: 'Search'},
  ],
  fields: [
    section('hero', [
      ...intro,
      text('downloadLabel', 'Download button'),
      text('appLabel', 'Browser button'),
      text('proLabel', 'Pro button'),
      longText('note'),
      list('sheetLabels', 'string', "Title block under the hero's plot"),
      text('exploreLabel', 'Explore link'),
    ]),
    section('styles', [
      text('eyebrow'),
      defineField({
        name: 'title',
        type: 'string',
        description: '{{styles}} is replaced by the number of built-in styles.',
        validation: (rule) => rule.required(),
      }),
      longText('lede', 'Introduction'),
      list('inputs', 'sheet', 'Example sheets'),
      object('countLabels', 'countLabels', 'Labels for the style counts'),
      longText('note'),
    ]),
    section('how', [...heading, list('stages', 'stage')]),
    section('ink', [
      ...intro,
      list('features', 'feature'),
      list('figures', 'figure'),
      longText('note'),
    ]),
    section('graph', [
      ...intro,
      object('figure', 'figure'),
      list('features', 'feature'),
      text('codeTitle'),
      longText('codeText'),
      object('codeSheet', 'sheet'),
    ]),
    section('plot', [
      ...intro,
      list('features', 'feature'),
      object('sheet', 'sheet'),
      text('filesCaption'),
    ]),
    section('publish', [
      ...intro,
      list('journey', 'journeyStep'),
      object('wide', 'figure', 'Wide picture'),
      list('cards', 'feature'),
      text('filesCaption'),
      object('cta', 'cta'),
    ]),
    section('ml', [
      ...intro,
      list('chain', 'figure'),
      list('features', 'feature'),
      object('cta', 'cta'),
    ]),
    section('pricing', [
      ...intro,
      list('rows', 'planRow'),
      object('price', 'planValues'),
      object('updates', 'planValues'),
      longText('buyLine'),
      longText('buyNote'),
      text('proButton'),
      text('freeButton'),
    ]),
    section('who', [...heading, list('people', 'person')]),
    section('journal', [...intro, text('soonLabel'), list('topics', 'feature')]),
    section('download', [
      text('title'),
      longText('lede', 'Introduction'),
      text('browserTitle'),
      text('appLabel', 'Browser button'),
    ]),
    defineField({
      name: 'seo',
      title: 'Search and sharing',
      type: 'seo',
      group: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})

export const homeObjects = [
  defineType({
    name: 'seo',
    title: 'Search and sharing',
    type: 'object',
    fields: [text('title'), longText('description')],
  }),
  defineType({
    name: 'countLabels',
    title: 'Labels for the style counts',
    type: 'object',
    fields: [text('photo'), text('generative'), text('scripted'), text('sources')],
  }),
  defineType({
    name: 'planValues',
    title: 'Free and Pro values',
    type: 'object',
    description: 'The Pro price stays £XX, and the update window XX, until they are decided.',
    fields: [text('label'), text('free'), text('pro')],
  }),
]
