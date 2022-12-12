import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas/schema'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'forebyggingsplan-pia',
  projectId: '2u7e6oll',
  dataset: 'development',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
