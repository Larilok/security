import { FastifyReply, FastifyRequest } from 'fastify'

import { addUser, verifyUser } from './auth'
import { IUserCredentials } from './types';

export const signinHandler = async(req: FastifyRequest, res: FastifyReply) => {
  return await verifyUser(req.body as IUserCredentials)
}

export const signupHandler = async (req: FastifyRequest, res: FastifyReply) => {
  return await addUser(req.body as IUserCredentials)
}

export const setHandler = async (req: FastifyRequest, res: FastifyReply) => {
  return await addUser(req.body as IUserCredentials)
}

export const getHandler = async (req: FastifyRequest, res: FastifyReply) => {
  return await addUser(req.body as IUserCredentials)
}
