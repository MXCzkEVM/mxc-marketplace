import { useContract, useContractWrite } from "@thirdweb-dev/react"
import TransferToModal, { TransferToModalProps } from "../TransferToModal"
import { useInjectHolder } from "@overlays/react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { useState } from "react"
export interface TransferButtonProps {
  address: string
  id: string
}

function TransferButton(props: TransferButtonProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  function transferNft() {
    setVisible(true)
  }

  return <>
    <button
      style={{ width: '100%', marginBottom: '24px' }}
      className="tw-web3button css-1fii1tk"
      onClick={transferNft}
    >
      {t("Transfer")}
    </button>
    <TransferToModal
      visible={visible}
      onReject={() => setVisible(false)}
      address={props.address}
      id={props.id}
      onResolve={() => toast.success(t(`Transfer successful`))}
    />
  </>
}

export default TransferButton