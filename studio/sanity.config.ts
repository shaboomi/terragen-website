import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletons} from './schemaTypes'
import {structure} from './structure'

const isSingleton = (type: string) => singletons.some((s) => s.name === type)

export default defineConfig({
  name: 'default',
  title: 'terraGen',

  projectId: '7s3gavgn',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !isSingleton(t.schemaType)),
  },

  document: {
    // One of each: no duplicating, deleting or unpublishing them.
    actions: (actions, {schemaType}) =>
      isSingleton(schemaType)
        ? actions.filter(
            (a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action),
          )
        : actions,
  },
})
