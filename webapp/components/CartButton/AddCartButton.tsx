import { CartItem } from "@/store";
import { useMemo } from "react";
import useCartStore from "@/store";
import IconCartMinus from "./IconCartMinus";
import IconCartPlus from "./IconCartPlus";

export interface AddCartButtonProps {
  item: CartItem
}

export function AddCartButton(props: AddCartButtonProps) {
  const cartStore = useCartStore()
  const isAdded = useMemo(() => {
     return cartStore.carts.some(c => c.address === props.item.address && c.asset === props.item.asset)
  }, [props.item, cartStore])

  function onPlusCart() {
    cartStore.push(props.item)
  }
  function onMinusCart() {
    cartStore.remove(props.item.address, props.item.asset)
  }
  return <button onClick={isAdded ? onMinusCart : onPlusCart}>
    {isAdded ? <IconCartMinus /> : <IconCartPlus />}
  </button>
}