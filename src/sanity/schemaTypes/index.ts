import { type SchemaTypeDefinition } from 'sanity'
import { contentVersion } from './contentVersion'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [contentVersion],
}
