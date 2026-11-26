import type {StructureResolver} from 'sanity/structure'
import {singletons} from './schemaTypes'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website')
    .items(
      singletons.map((type) =>
        S.listItem()
          .id(type.name)
          .title(type.title ?? type.name)
          .child(S.document().schemaType(type.name).documentId(type.name)),
      ),
    )
