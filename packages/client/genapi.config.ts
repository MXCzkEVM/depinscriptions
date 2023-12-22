import { defineConfig } from '@genapi/cli'
import source from './genapi.json'

export default defineConfig({
  input: { json: source as any },
  baseURL: '"http://localhost:4000/"',
  output: {
    main: 'src/api/index.ts',
    type: 'src/api/index.type.ts',
  },
})
