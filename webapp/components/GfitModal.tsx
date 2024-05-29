import { useOverlay, PropsWidthOverlays } from '@overlays/react'
import { Web3Button, useAddress, useContract, useContractWrite } from '@thirdweb-dev/react'
import { Modal } from 'antd'
import { useState } from 'react'
import Erc721ABI from '@/const/abi_common/erc721.json'
import { Contract, Wallet, ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ABI } from '@/const/Address'
import IconLoading from './CartButton/IconLoading'
import { provider } from '@/const/Network'

export interface GfitModalProps {
  contract: string;
  ipfs: string;
}

function GfitModal(props: PropsWidthOverlays<GfitModalProps>) {
  const { resolve, visible, reject } = useOverlay({
    duration: 1000,
    props
  })
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const [privateKey, setPrivateKey] = useState('')
  const [quantity, setQuantity] = useState('')

  async function gifts() {
    setLoading(true)
    try {
      const wallet = new Wallet(privateKey, provider)
      const contract = new Contract(props.contract, ABI.collection, wallet)
      let nonce = await wallet.getTransactionCount()
      const addresses = new Array(+(quantity || 0))
        .fill(null)
        .map(() => Wallet.createRandom())
        .map(w => w.address)
      for (const recipients of chunks(addresses, 5)) {
        const promises = recipients.map((recipient) => {
          const promise = contract.gift(
            props.ipfs,
            recipient,
            { nonce }
          )
          nonce++
          return promise
        })
        await Promise.all(promises)
        setLoading(false)
      }

      resolve()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return <Modal open={visible} onCancel={() => reject()} footer={false}>
    <div className='mb-6'>Random Gfits</div>
    <div className='flex' style={{ marginBottom: '12px' }}>
      <input value={privateKey} placeholder='privateKey' onChange={(e) => setPrivateKey(e.target.value)} className='flex-1 p-3' />
    </div>
    <div className='flex' style={{ marginBottom: '12px' }}>
      <input type="number" value={quantity} placeholder='quantity' onChange={(e) => setQuantity(e.target.value)} className='flex-1 p-3' />
    </div>
    <button
      style={{ width: '100%', marginTop: '24px' }}
      className="tw-web3button css-1fii1tk"
      onClick={gifts}
    >
      {
        !loading
          ? <>{t('Gfits')}</>
          : <IconLoading />
      }
    </button>

  </Modal>
}


function chunks<T>(arr: T[], size: number): T[][] {
  const chunked: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    chunked.push(arr.slice(i, i + size));
  return chunked;
}


export default GfitModal