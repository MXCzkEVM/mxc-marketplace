import IconLoading from "@/components/CartButton/IconLoading"
import { ABI } from "@/const/Address"
import { Contract, providers } from "ethers"
import Router from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

import { useTranslation } from "react-i18next"
import { parseEther } from 'ethers/lib/utils'
import { provider } from "@/const/Network"
import { useAddress, useBalance } from "@thirdweb-dev/react"
import { hexlifySignTransaction } from "@/util/ethers"

export interface ButtonForV3Props {
  address: string
  ipfs: string
  xsd?: any
  onSuccess?: Function
}
export function BurnMintButton(props: ButtonForV3Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const address = useAddress()
  const {data: balance} = useBalance()

  async function create() {
    if (!address) {
      toast.warn(t("Please connect the wallet"))
      return
    }
    if (balance?.value.lt(parseEther('2000'))) {
      toast.warn(t("Please deposit 2000 Moonchain L3"))
      return
    }
    try {
      setLoading(true)
      const singer = provider.getSigner(address)
      const contract = new Contract(props.address, ABI.collection, singer)
      const data = await contract.populateTransaction.burnMXCMint(props.ipfs)
      const burnMXC = await contract.getBurnMXC();
      const transaction = await singer.populateTransaction({
        ...data,
        value: burnMXC
      })

      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [hexlifySignTransaction(transaction)]
      })
      await provider.waitForTransaction(hash)
      toast.success("NFT item create successfully!")
      Router.reload()
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
      className="px-4 py-18 bg-blue-600 text-white tw-web3button css-1fii1tk"
      onClick={create}
      style={{width: '160px'}}
    >
      {
        !loading
          ? <>
            <p className="hidden md:inline">{t("Mint Launchpad")}</p>
            <p className="md:hidden">{t("Mint")}</p>
          </>
          : <IconLoading />
      }
    </button>
  )
}