import { defineStore } from '../util/valtio'

export interface CartItem {
  owner: string
  image: string
  address: string
  asset: number
  price: string
  meta: any
}

export const useCartStore = defineStore({
  persist: 'carts',
  state: () => ({
    carts: [] as CartItem[],
  }),
  actions: (state) => ({
    push(cart: CartItem) {
      state.carts.push(cart)
    },
    remove(address: string, asset: number) {
      const index = state.carts.findIndex(i => i.address === address && i.asset === asset)
      index !== -1 && state.carts.splice(index, 1)
    },
    clear() {
      state.carts = []
    }
  }),
})

