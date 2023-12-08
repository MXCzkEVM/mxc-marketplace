import CartStore, { CartItem } from "@/store";
import IconCart from "./IconCart";
import { useMemo } from "react";
import useCartStore from "@/store";

export interface AddCartButtonProps {

}

export function AddCartButton(item: CartItem) {
  const cartStore = useCartStore()
  const isAdded = useMemo(() => {
    const { carts } = cartStore
     return carts.some(c => c.address === item.address && c.asset === item.asset)
  }, [item])

  function onAddCart() {

  }
  function onRemoveCart() {

  }
  return <>
    <IconCart />
  </>
}