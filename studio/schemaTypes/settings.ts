import {defineType} from 'sanity'
import {list, longText, richText, text} from './objects'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Header and footer',
  type: 'document',
  fields: [
    text('brandName'),
    list('headerLinks', 'navLink'),
    text('headerButton', 'Header download button'),
    longText('footerTagline'),
    list('footerLinks', 'navLink'),
    richText('footerSmallPrint', 'Footer small print'),
  ],
  preview: {prepare: () => ({title: 'Header and footer'})},
})
