import { FastifyInstance } from 'fastify'

import { signinHandler, signupHandler, setHandler, getHandler } from './handlers'

const createRoutes = (app: FastifyInstance) => {
  app.post('/signin', signinHandler)
  app.post('/signup', signupHandler)
  app.post('/setdata', setHandler)
  app.post('/getdata', getHandler)
}

export default createRoutes