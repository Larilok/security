import { verifyUser } from '../auth/auth'
import { IData, IUserCredentials } from '../types'
import { getUserData, setUserData } from '../db/queries'
import { encrypt, decrypt } from '../secure/cipher'

export const setData = async (userCredentialsAndData: IUserCredentials & IData) => {
  const user = await verifyUser(userCredentialsAndData)
  const encryptedData = encrypt(user.id, userCredentialsAndData.value)

  return setUserData(user.id, { field: userCredentialsAndData.field, ...encryptedData })
}

export const getData = async (userCredentials: IUserCredentials): Promise<IData[]> => {
  const user = await verifyUser(userCredentials)
  const encryptedData = await getUserData(user.id)
  const data:any = []
  encryptedData.forEach(record => {
    let obj: any = {}
    obj[record.field] = decrypt(user.id, record)
    data.push (obj)
  })
  return data
}
