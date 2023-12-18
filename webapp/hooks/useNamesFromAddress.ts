/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useEns } from '../context'

export function useNamesFromAddress(address?: string) {
  const ens = useEns()
  const [names, setNames] = useState<string[]>([])

  async function fetchNamesByAddress(address?: string) {
    if (!address || !ens.ready)
      return
    const res = await ens.getNames({
      address: address,
      type: 'wrappedOwner',
      orderBy: 'name',
      orderDirection: 'desc',
    })

    if (!res || !res.length)
      return
    setNames(res.map(v => v.name))
  }
  useEffect(() => {
    fetchNamesByAddress(address)
  }, [ens.ready, address])

  return names
}