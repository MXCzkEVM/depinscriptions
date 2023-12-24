import { defineConfig } from '@genapi/cli'
import source from './genapi.json'

export default defineConfig({
  input: { json: source },
  pipeline: 'swag-fetch-ts',
  baseURL: '"http://localhost:4000"',
  output: {
    main: 'src/api/index.ts',
    type: 'src/api/index.type.ts',
  },
})
