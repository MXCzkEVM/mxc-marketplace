import { NextApiRequest, NextApiResponse } from 'next'
import {Contract, Wallet} from 'ethers'
import { provider } from '../../const/Network'
import { ABI } from '../../const/Address'


interface Body {
  privateKey: string
  contract: string
  quantity: number
  tokenUri: string
}
// 
// ipfs://QmQtnusXTApqsLCXqJbBDLoqcjsne5NzKtyt293HTDbGtk
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const body: Body = req.body



  const wallet = new Wallet(body.privateKey, provider)
  
  const contract = new Contract(body.contract, ABI.collection, wallet)

  const addresses = new Array(+(body.quantity || 0))
    .map(() => Wallet.createRandom())
    .map(w => w.address)

  for (const recipient of addresses) {
    const tr = await contract.gift(body.tokenUri, recipient)
    await tr.wait()
  }

  return res
    .status(200)
    .send({ code: 200 } as any)
}

