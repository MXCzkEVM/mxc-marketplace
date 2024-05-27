import IconLoading from "@/components/CartButton/IconLoading"
import { ABI } from "@/const/Address"
import { provider } from "@/const/Network"
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react"
import { Contract, providers } from "ethers"
import Router from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {hexlifySignTransaction} from '@/util/ethers'

export interface ButtonForV3Props {
  address: string
  xsd?: any
  resolveIpfs?: Function
  onSuccess?: Function
}
export function ButtonForV3(props: ButtonForV3Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const address = useAddress()
  async function create() {
    try {
      setLoading(true)
      const singer = provider.getSigner(address)
      const contract = new Contract(props.address, ABI.collection, singer)
      const data = await contract.populateTransaction.mint(
        `ipfs://${await props.resolveIpfs?.()}`,
        props.xsd
      )
      const hexlifyTransaction = hexlifySignTransaction(await singer.populateTransaction(data))
      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [hexlifyTransaction]
      })
      await provider.waitForTransaction(hash)
      toast.success("NFT item create successfully!")
      Router.push(`/collection/${props.address}`)
      setLoading(false)

    } catch (error) {
      // console.error(error)
      console.log(error)
      setLoading(false)
      toast.error(t("NFT item create failed"))
    }
  }
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white tw-web3button css-1fii1tk"
      onClick={create}
      style={{width: '150px', height: '43px'}}
    >
      {
        !loading
          ? <>{t("Create item")}</>
          : <IconLoading />
      }
    </button>
  )
}