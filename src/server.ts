import { api } from './api'

const port = process.env.PORT || 3333

api.listen(port, () => console.log(`Started server on port ${port}`))

process.on('SIGTERM', () => process.exit())
