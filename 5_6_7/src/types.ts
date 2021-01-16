export interface IUserCredentials {
  login: string,
  password: string
}

export interface IUserReturn {
  id: number,
  login: string,
  password: string,
  salt: string
}

export interface IUserInsert {
  login: string,
  password: string,
  salt: string
}
