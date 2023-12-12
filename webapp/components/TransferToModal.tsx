import { useOverlay, PropsWidthOverlays } from '@overlays/react'
import { Web3Button, useAddress, useContract, useContractWrite } from '@thirdweb-dev/react'
import { Modal } from 'antd'
import { useState } from 'react'
import Erc721ABI from '@/const/abi_common/erc721.json'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ABI } from '@/const/Address'
import IconLoading from './CartButton/IconLoading'

export interface TransferToModalProps {
  address: string, id: string
}

function TransferToModal(props: PropsWidthOverlays<TransferToModalProps>) {
  const { resolve, visible, reject } = useOverlay({
    duration: 1000,
    props
  })
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const [toAddress, setToAddress] = useState('')

  const { contract } = useContract(props.address, ABI.collection)

  async function transferNft() {
    setLoading(true)
    try {
      if (!ethers.utils.isAddress(toAddress)) {
        toast.warn(t("Please type a correct address"))
        return
      }
      await contract?.erc721.transfer(toAddress, props.id)
      resolve()
    } catch (error) {
      setLoading(false)
    }
  }

  return <Modal open={visible} onCancel={() => reject()} footer={false}>
    <div className='mb-6'>Transfer Confirm</div>
    <div className='flex'>
      <input value={toAddress} placeholder='To Address' onChange={(e) => setToAddress(e.target.value)} className='flex-1 p-3' />
    </div>
    <button
      style={{ width: '100%', marginTop: '24px' }}
      className="tw-web3button css-1fii1tk"
      onClick={transferNft}
    >
      {
        !loading
          ? <>{t('Transfer')}</>
          : <IconLoading />
      }
    </button>

  </Modal>
}

export default TransferToModal