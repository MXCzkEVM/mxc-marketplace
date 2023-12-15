/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { useEns } from '../context'
import { useNamesStore } from '../store'
import { useAddress } from '@thirdweb-dev/react'

const runs: Record<string, boolean> = {}

export function useName(addr: string | undefined, def?: boolean) {
  const ens = useEns()
  const names = useNamesStore()

  const address = addr?.toLocaleUpperCase()

  async function fetchNameByAddress(address?: string) {
    if (!address || !ens.ready || runs[address])
      return
    runs[address] = true
    if (address === '0x0000000000000000000000000000000000000000')
      return
    if (names.getName(address))
      return
    const res = await ens.getName(address)
    if (!res || !res.name || !res.match)
      return
    names.setName(address, res.name)
  }

  useEffect(() => {
    fetchNameByAddress(address)
  }, [ens.ready, address])

  return useMemo(() => {
    if (!address)
      return '...'
    if (def === false && !names.names[address.toLocaleUpperCase()])
        return undefined
    return names.names[address.toLocaleUpperCase()] || `${address.slice(0, 4)}...${address.slice(-4)}`
  }, [address, names.names])

}

export function useNames(address: string[]) {
  const { ready, getName } = useEns()
  const names = useNamesStore()
  
  async function fetchNameByAddress(address?: string) {
    address = address?.toLocaleUpperCase()
    if (!address || !ready || runs[address])
      return
    runs[address] = true
    if (address === '0x0000000000000000000000000000000000000000')
      return
    if (names.getName(address))
      return
    const res = await getName(address)
    if (!res || !res.name || !res.match)
      return
    names.setName(address, res.name)
  }

  useEffect(() => address.forEach(fetchNameByAddress), [ready, address])

  return useMemo(() => {
    return address.reduce((total, address) => {
      address = address?.toLocaleUpperCase()
      if (address)
        total[address] = (address && names.names[address]) || `${address.slice(0, 4)}...${address.slice(-4)}`
      else
        total[address] = '-'
      return total
    }, {} as Record<string, string>)
  }, [address, names])
}