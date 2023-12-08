import { useState } from "react";
import { Drawer } from 'antd'
import IconCart from './IconCart'
import CartItem from "./CartItem";
import useCartStore from "@/store";

export default function CartButton() {
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const cartStore = useCartStore()
  return <>
    <div className="mt-2 cursor-pointer" onClick={() => setShowCartDrawer(true)}>
      <IconCart className="text-[42px]" />
    </div>
    <Drawer title="Your Cart" open={showCartDrawer} onClose={() => setShowCartDrawer(false)}>
      {cartStore.carts.map((item, index) => <CartItem item={item} key={index} />)}
    </Drawer>
  </>
}