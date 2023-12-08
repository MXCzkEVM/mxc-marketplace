/* eslint-disable @next/next/no-img-element */
import { CartItem as _CartItem } from '@/store'

interface CartItemProps {
  item: _CartItem
}

function CartItem(props: CartItemProps) {
  return <div className='flex'>
    <a className='w-[72px] h-[72px] mr-4' href="">
      <img  className='w-full h-full' src={props.item.image} alt="" />
    </a>
    <div className='flex flex-col flex-1'>
      <div>3778</div>
      <div>BoredApeYachtClub - GLOBAL</div>
    </div>
    <div>400 ETH</div>
  </div>
}

export default CartItem