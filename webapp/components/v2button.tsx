import IconLoading from "@/components/CartButton/IconLoading"
import { ABI } from "@/const/Address"
import { useContract, useContractWrite } from "@thirdweb-dev/react"
import { Contract, providers } from "ethers"
import Router from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"


export interface ButtonForV3Props {
  address: string
  xsd?: any
  resolveIpfs?: Function
  onSuccess?: Function
}
export function ButtonForV3(props: ButtonForV3Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  async function create() {
    try {
      setLoading(true)
      const provider = new providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner()
      const contract = new Contract(props.address, ABI.collection, singer)
      const data = await contract.populateTransaction.mint(
        `ipfs://${await props.resolveIpfs?.()}`,
        props.xsd
      )
      const transaction = await singer.sendTransaction(data)
      await transaction.wait()
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