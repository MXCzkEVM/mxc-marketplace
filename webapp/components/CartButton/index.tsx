import { useState } from "react";
import { Drawer } from 'antd'
import IconCart from './IconCart'
import CartItem from "./CartItem";

export default function CartButton() {
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  return <>
    <div className="mt-2 cursor-pointer" onClick={() => setShowCartDrawer(true)}>
      <IconCart className="text-[42px]" />
    </div>
    <Drawer title="Your Cart" open={showCartDrawer} onClose={() => setShowCartDrawer(false)}>
    </Drawer>
  </>
}