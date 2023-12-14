/* eslint-disable react-hooks/rules-of-hooks */
import { proxy, subscribe, useSnapshot } from 'valtio'
import { INTERNAL_Snapshot as Snapshot } from 'valtio/vanilla'
import { useMemo } from 'react'
export interface PersistantOptions {
  storage?: Storage
}

export function proxyWithPersistant<T extends object>(
  key: string,
  initialObject?: T,
  options: PersistantOptions = {}
): T {
  const storage = options.storage || (
    typeof localStorage !== 'undefined' ? localStorage : undefined
  )

  const state = proxy(parse(storage?.getItem(key)) || initialObject)

  subscribe(state, () => {
    storage?.setItem(key, JSON.stringify(state))
  })

  return state
}

function parse(text: string | undefined | null) {
  try { return JSON.parse(text || '') } catch { }
}

export interface DefineStore<S, A> {
  state: () => S
  actions: (state: S) => A
  persist?: string
}

export type Store<S, A> = Snapshot<S> & A
export interface UseStore<S, A> {
  (): Store<S, A>
  $subscribe: (callback: (state: S) => void) => void
  $state: S
  $actions: A
} 

export function defineStore<S extends object, A extends object>(store: DefineStore<S, A>): UseStore<S, A> {
  const state = store.persist
    ? proxyWithPersistant(store.persist, store.state())
    : proxy(store.state())
  const actions = store.actions(state)
  const $subscribe = (callback: any) => {
    subscribe(state, () => callback(state))
  }
  function use() {
    const store = useSnapshot(state)
    return useMemo(() => ({...store, ...actions }), [store])
  }
  use.$subscribe = $subscribe
  use.$state = state
  use.$actions = actions
  return use
}