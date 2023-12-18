import { useEffect, useState } from 'react'
import ApiClient from "../util/request"
import { CHAIN_ID } from "../const/Network"

const normal = '0x0000000000000000000000000000000000000000'
const urlRex = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
const api = new ApiClient("/")

export function useCollectionAddress(addrOrUrl = normal) {
  const [address, setAddress] = useState<string>(normal)

  async function watchCollectionChange() {
    if (addrOrUrl === normal) {
      setAddress(normal)
      return
    }
    if (addrOrUrl.startsWith('0x')) {
      setAddress(addrOrUrl)
      return
    }
    if (urlRex.test(addrOrUrl)) {
      const address = await fetchCollectionMap(addrOrUrl)
      setAddress(address)
    }
  }

  async function fetchCollectionMap(url: string) {
    const response: any = await api.post("/api/get-collection-map", {
      chainId: CHAIN_ID,
      domain: url,
    })
    return response.collection as string
  }

  useEffect(() => {
    watchCollectionChange()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addrOrUrl])
  return address
}