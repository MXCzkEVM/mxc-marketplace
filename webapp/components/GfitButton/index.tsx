import { useContract, useContractWrite } from "@thirdweb-dev/react"
import GfitModal, { GfitModalProps } from "../GfitModal"
import { useInjectHolder } from "@overlays/react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
export interface GfitButtonProps {
  address: string
  ipfs: string
}

function GfitButton(props: GfitButtonProps) {
  const { t } = useTranslation()
  const [holder, openGfitModal] = useInjectHolder<GfitModalProps, string>(GfitModal as any)
  async function gifts() {
    await openGfitModal({ contract: props.address, ipfs: props.ipfs })
  }

  return <>
    <button
      style={{ width: '150px' }}
      className={"tw-web3button css-1fii1tk "}
      onClick={gifts}
    >
      <span>Random Gifts</span>
    </button>
    {holder}
  </>
}

export default GfitButton