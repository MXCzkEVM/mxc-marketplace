
import { providers } from 'ethers'

export function hexlifySignTransaction(transaction: providers.TransactionRequest): any {
  const hexlifyTransaction = providers.JsonRpcProvider.hexlifyTransaction(transaction, { from: true })
  if (typeof hexlifyTransaction.chainId !== 'undefined')
    hexlifyTransaction.chainId = Number(hexlifyTransaction.chainId) as any
  return hexlifyTransaction
}
