import { ABI } from "@/const/Address"
import { Web3Button, useContract, useContractWrite } from "@thirdweb-dev/react"
import Router from "next/router"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export interface ButtonForV2Props {
  address: string
  resolveIpfs?: Function
  onSuccess?: Function
}
export function ButtonForV2(props: ButtonForV2Props) {
  const { t } = useTranslation()
  const { contract } = useContract(props.address, ABI.collectionv2)
  const { mutateAsync: mintNFT } = useContractWrite(contract, "mint")
  async function create() {
    try {
      const ipfs = await props.resolveIpfs?.()
      if (ipfs) {
        const result = await mintNFT({ args: [`ipfs://${ipfs}`] })
        toast.success("NFT item create successfully!")
        Router.push(`/collection/${props.address}`)
        return result
      }
    } catch (error) {
       // console.error(error)
       console.log(error)
       toast.error(t("NFT item create failed"))
    }
  }
  return (
    <Web3Button
      contractAddress={props.address}
      contractAbi={ABI.collectionv2}
      action={async () => await create()}
      className="px-4 py-2 bg-blue-600 text-white"
      onSuccess={() => props.onSuccess?.()}
    >
      {t("Create item")}
    </Web3Button>
  )
}