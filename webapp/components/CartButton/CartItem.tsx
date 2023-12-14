/* eslint-disable @next/next/no-img-element */
import { useCartStore, CartItem as _CartItem } from '@/store'
import { Tag } from 'antd'
import IconRemove from './IconRemove'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
interface CartItemProps {
  item: _CartItem
}

function CartItem(props: CartItemProps) {
  const cartStore = useCartStore()
  const { t } = useTranslation()
  function onMinusCart() {
    cartStore.remove(props.item.address, props.item.asset)
    toast.success(t('Removed from shopping cart'), { position: 'bottom-right' })
  }

  return <div className='flex text-black text-sm'>
    <a className='w-[72px] h-[72px] mr-4 overflow-hidden rounded-md' href={`/collection/${props.item.address}/${props.item.asset}`}>
      <img className='w-full h-full' src={props.item.image} alt="" />
    </a>
    <div className='flex flex-col flex-1 h-[72px]'>
      <h4 className='text-sm'>Token ID #{props.item.asset}</h4>
      <p className='text-sm font-medium truncate ...'>{props.item.meta.description}</p>
    </div>
    <div className='h-[72px] flex flex-col items-end text-sm font-medium'>
      <span className='mb-8'>{ethers.utils.formatEther(props.item.price)} MXC</span>
      <button onClick={onMinusCart}>
        <IconRemove />
      </button>
    </div>
  </div>
}

export default CartItem