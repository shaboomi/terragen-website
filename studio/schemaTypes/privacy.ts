import {defineType} from 'sanity'
import {longText, object, richText, text} from './objects'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy page',
  type: 'document',
  fields: [
    text('eyebrow'),
    text('title'),
    longText('lede', 'Introduction'),
    richText('body'),
    text('draftTitle', 'Closing heading'),
    longText('draftNote', 'Draft notice'),
    object('seo', 'seo', 'Search and sharing'),
  ],
  preview: {prepare: () => ({title: 'Privacy page'})},
})
