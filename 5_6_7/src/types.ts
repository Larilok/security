export interface IUserCredentials {
  login: string,
  password: string
}

export interface IUser {
  id?: number
  login: string,
  password: string,
  version: number
}

export interface IData {
  id?: number,
  userId?: number,
  field: string,
  value: string
}

export interface IEncryptedData {
  field?: string
  value: string,
  nonce: string,
  authTag: string
}

export const encSchema = {
  field: 'a',
  value: 'a'
}
