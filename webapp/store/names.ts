
import { defineStore } from '../util/valtio'

export const useNamesStore = defineStore({
  persist: 'names',
  state: () => ({
    names: {} as Record<string, string>
  }),
  actions: (state) => ({
    setName(address: string, name: string) {
      state.names[address.toLocaleUpperCase()] = name
    },
    getName(address: string) {
      return state.names[address.toLocaleUpperCase()]
    }
  })
})
 