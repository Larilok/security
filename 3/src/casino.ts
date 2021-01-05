
import axios from 'axios'

const HOST = 'http://95.217.177.249/casino'

function modulo(a:number, b:number) {
    return a - Math.floor(a/b)*b;
}
function ToUint32(x:number) {
    return modulo(x, Math.pow(2, 32));
} 
export function ToInt32(x:number) {
    const uint32 = ToUint32(x);
    if (uint32 >= Math.pow(2, 31)) {
        return uint32 - Math.pow(2, 32)
    } else {
        return uint32;
    }
}

export const createAcc = async (id:number): Promise<number> => {
  let response;
  try {
    response = await axios.get(`${HOST}/createacc?id=${id}`)
  } catch (e) {
    console.log(e)
  }

  console.log(response.data)
  
  return response.data.id 
}

export const bet = async (id:number, money:number, betOn:number, mode: string): Promise<any> => {
  console.log(`Make bet ${id} ${money} ${betOn}`)
  let response;
  try {
    response = await axios.get(`${HOST}/play${mode}?id=${id}&bet=${money}&number=${betOn}`)
  } catch (e) {
    console.log(e)
  }

  console.log(response.data)
  
  return response.data
}