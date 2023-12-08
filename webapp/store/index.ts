import { useMemo } from 'react'
import { proxy, useSnapshot } from 'valtio'

export interface CartItem {
  owner: string
  image: string
  address: string
  asset: number
  meta: any
}

export const state = proxy({
  carts: [] as CartItem[],
})
export const actions = {
  push(cart: CartItem) {
    state.carts.push(cart)
  },
  remove(address: string, asset: number) {
    const index = state.carts.findIndex(item => item.address === address && item.asset === asset)
    index !== -1 && state.carts.splice(index, 1)
  }
}

function useCartStore() {
  const store = useSnapshot(state)
  return useMemo(() => ({...store, ...actions}), [store])
}
export default useCartStore