import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { addUser, verifyUser } from './auth/auth'

import { getData, setData } from './model/data'
import { IData, IUserCredentials } from './types'

const createRoutes = (app: FastifyInstance) => {
  app.post('/signin', async (req: FastifyRequest, res: FastifyReply) => {
    return await verifyUser(req.body as IUserCredentials)
  })

  app.post('/signup',  async (req: FastifyRequest, res: FastifyReply) => {
    return await addUser(req.body as IUserCredentials)
  })

  app.post('/setdata', async (req: FastifyRequest, res: FastifyReply) => {
    return await setData(req.body as IUserCredentials&IData)
  })
  
  app.post('/getdata',  async (req: FastifyRequest, res: FastifyReply) => {
    return await getData(req.body as IUserCredentials)
  })
}

export default createRoutes