import fastify from 'fastify'
import staticMiddleware from 'fastify-static'
import path from 'path'

import createRoutes from './router'

const app = fastify({ logger: true })

app.register(staticMiddleware, {
  root: path.join(__dirname, 'static')
})

createRoutes(app)

app.listen(8888)