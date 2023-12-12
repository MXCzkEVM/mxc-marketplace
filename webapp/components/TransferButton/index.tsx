import { useContract, useContractWrite } from "@thirdweb-dev/react"
import TransferToModal, { TransferToModalProps } from "../TransferToModal"
import { useInjectHolder } from "@overlays/react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
export interface TransferButtonProps {
  onSuccess?: (addr: string) => void
  type?: 'erc721' | 'erc1155'
  address: string
  id: string
}

function TransferButton(props: TransferButtonProps) {
  const { t } = useTranslation()
  const [holder, openTransferToModal] = useInjectHolder<TransferToModalProps, string>(TransferToModal as any)
  async function transferNft() {
    const address = await openTransferToModal(props)
    toast.success(t(`Transfer successful`))
    props.onSuccess?.(address)
  }

  return <>
    <button
      style={{ width: '100%', marginBottom: '24px' }}
      className="tw-web3button css-1fii1tk"
      onClick={transferNft}
    >
      {t("Transfer")}
    </button>
    {holder}
  </>
}

export default TransferButton