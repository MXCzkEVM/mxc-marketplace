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
  res: any,
) {
  const body: Body = req.body

  const wallet = new Wallet(body.privateKey, provider)
  const contract = new Contract(body.contract, ABI.collection, wallet)

  randomGifts(contract, body.tokenUri, body.quantity)

  return res
    .status(200)
    .send({
      code: 200,
      message: 'called'
    })
}

async function randomGifts(contract: Contract, tokenUri: string, quantity = 0) {
  let nonce = await contract.provider.getTransactionCount('pending')
  const addresses = randomAddresses(quantity)

  for (const recipients of chunks(addresses, 5)) {
    const promises = recipients.map(gift)
    await Promise.all(promises)
  }

  function gift(recipient: string) {
    const promise = contract.gift(
      tokenUri,
      recipient,
      { nonce }
    )
    nonce++
    return promise.then(t => t.wait())
  }
}

function randomAddresses(quantity = 0) {
  return new Array(+(quantity || 0))
    .fill(null)
    .map(() => Wallet.createRandom())
    .map(w => w.address)
}

function chunks<T>(arr: T[], size: number): T[][] {
  const chunked: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    chunked.push(arr.slice(i, i + size));
  return chunked;
}
