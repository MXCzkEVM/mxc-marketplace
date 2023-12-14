import { CartItem } from "@/store";
import { useMemo } from "react";
import { useCartStore } from "@/store";
import IconCartMinus from "./IconCartMinus";
import IconCartPlus from "./IconCartPlus";
import { toast } from "react-toastify"
import { ToastOptions } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export interface AddCartButtonProps {
  item: CartItem
}

export function AddCartButton(props: AddCartButtonProps) {
  const { t } = useTranslation()
  const cartStore = useCartStore()
  const isAdded = useMemo(() => {
     return cartStore.carts.some(c => c.address === props.item.address && c.asset === props.item.asset)
  }, [props.item, cartStore])
  const options: ToastOptions = {
    position: 'bottom-right',
  }

  function onPlusCart() {
    cartStore.push(props.item)
    toast.success(t('Added to shopping cart'), options)
  }
  function onMinusCart() {
    cartStore.remove(props.item.address, props.item.asset)
    toast.success(t('Removed from shopping cart'), options)
  }
  return <button className="tw-web3button css-1fii1tk"  onClick={isAdded ? onMinusCart : onPlusCart}>
    {isAdded ? <IconCartMinus className="text-[18px]" /> : <IconCartPlus className="text-[18px]" />}
  </button>
}