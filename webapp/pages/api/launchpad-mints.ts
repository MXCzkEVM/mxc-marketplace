import { NextApiRequest, NextApiResponse } from 'next'
import { Contract, Wallet } from 'ethers'
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
  let nonce = await wallet.getTransactionCount('pending')

  const addresses = new Array(+(body.quantity || 0))
    .fill(null)
    .map(() => Wallet.createRandom())
    .map(w => w.address)
  for (const recipients of chunks(addresses, 5)) {
    const promises = recipients.map((recipient) => {
      const promise = contract.gift(body.tokenUri, recipient, { nonce })
      nonce++
      return promise.then(trx => trx.wait())
    })
    await Promise.all(promises)
  }

  return res
    .status(200)
    .send({ code: 200 } as any)
}


function chunks<T>(arr: T[], size: number): T[][] {
  const chunked: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
      chunked.push(arr.slice(i, i + size));
  return chunked;
}
