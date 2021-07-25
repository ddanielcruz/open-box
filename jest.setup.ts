import { config } from 'dotenv'
import { resolve } from 'path'

const path = resolve(__dirname, '.env.test')
config({ path })
