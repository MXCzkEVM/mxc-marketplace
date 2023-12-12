import { useMemo } from 'react'
import {  useSnapshot } from 'valtio'
import { proxyWithPersistant } from '../util/valtio'
import { BigNumber, ethers } from 'ethers'
export interface CartItem {
  owner: string
  image: string
  address: string
  asset: number
  price: string
  meta: any
}

export const state = proxyWithPersistant('carts', {
  carts: [] as CartItem[],
  get amount() {
    const amount = BigNumber.from(0)
    for (const cart of this.carts) {
      amount.add(cart.price)
    }
    return ethers.utils.formatEther(amount)
  }
})

export const actions = {
  push(cart: CartItem) {
    state.carts.push(cart)
  },
  remove(address: string, asset: number) {
    const index = state.carts.findIndex(item => item.address === address && item.asset === asset)
    index !== -1 && state.carts.splice(index, 1)
  },
  clear() {
    state.carts = []
  }
}

function useCartStore() {
  const store = useSnapshot(state)
  return useMemo(() => ({...store, ...actions}), [store])
}

export default useCartStore