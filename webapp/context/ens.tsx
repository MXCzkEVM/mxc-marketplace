import {  } from '@wagmi/connectors'
import React, { createContext, useContext, useMemo, useRef, useState } from 'react'
import { CHAIN_ID, provider } from '../const/Network'

import { ENS } from '@ensdomains/ensjs'
import type { ContractName } from '@ensdomains/ensjs/contracts/types'

const opts: ConstructorParameters<typeof ENS>[0] = {}

if (process.env.NEXT_PUBLIC_PROVIDER && process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES) {
  const deploymentAddresses = JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!) as Record<
    ContractName | 'ENSRegistry',
    string
  >
  opts.getContractAddress = () => (contractName) => deploymentAddresses[contractName]
}

if (process.env.NEXT_PUBLIC_GRAPH_URI) {
  opts.graphURI = process.env.NEXT_PUBLIC_GRAPH_URI
}

const defaultValue: ENS = new ENS(opts)
defaultValue.staticNetwork = true

const EnsContext = createContext({ ...defaultValue, ready: false })

const EnsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false)
  const chainIdRef = useRef<number | string | null>(null)
  const chainSetPromise = useRef<Promise<any> | null>(null)

  const setChainPromise = () => {
    return defaultValue.setProvider(provider).then(() => {
      chainIdRef.current = provider.network.chainId
      chainSetPromise.current = null
      setReady(true)
    })
  }

  useMemo(() => {
    if (typeof window !== 'undefined' && !chainSetPromise.current) {
      chainSetPromise.current = setChainPromise()
    }
  }, [])

  const value = useMemo(
    () =>
      new Proxy(
        { ...defaultValue, ready },
        {
          // chain id safety check
          get(target, prop, reciever) {
            const targetFn = target[prop as keyof typeof target]
            // if on client + target is async function
            if (
              typeof window !== 'undefined' &&
              typeof targetFn === 'function' &&
              targetFn.constructor?.name === 'AsyncFunction'
            ) {
              // if reference chainId isn't up to date
              if (chainIdRef.current !== CHAIN_ID) {
                // if there is no ongoing chain set promise
                if (!chainSetPromise.current) {
                  // set ready to false before making changes
                  setReady(false)
                  // set chain set promise to new promise
                  chainSetPromise.current = setChainPromise()
                }
                // eslint-disable-next-line func-names
                return async function (this: any, ...args: any[]) {
                  // wait for existing chain set promise
                  await chainSetPromise.current
                  // return result of target function
                  return (targetFn as Function)(...args)
                }
              }
            }
            // pass through all other getters
            return Reflect.get(target, prop, reciever)
          },
        },
      ),
    [ready],
  )

  return <EnsContext.Provider value={value}>{children}</EnsContext.Provider>
}

function useEns() {
  return useContext(EnsContext)
}

export { useEns, EnsProvider }
