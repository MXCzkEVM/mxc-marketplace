import { useMemo, useState } from "react";
import { Badge, Drawer } from 'antd'
import IconCart from './IconCart'
import CartItem from "./CartItem";
import { useCartStore, CartItem as CartItemType } from "@/store";
import { useTranslation } from "react-i18next";
import { BigNumber, ethers } from "ethers";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { zeroAddress } from "@/const/Local";
import { toast } from "react-toastify"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import IconLoading from "./IconLoading";

export default function CartButton() {
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const { t } = useTranslation()
  const cartStore = useCartStore()
  const cartLength = useMemo(() => cartStore.carts.length, [cartStore])
  const address = useAddress() || zeroAddress

  const [loading, setLoading] = useState(false)

  const { contract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const totalPrice = useMemo(() => {
    let amount = BigInt(0)
    for (const cart of cartStore.carts) {
      amount += BigInt(cart.price)
    }
    return ethers.utils.formatEther(amount)
  }, [cartStore])

  async function buyMarkOrder(nft: CartItemType) {
    if (nft.owner == address) {
      const errorText = 'You cannot buy your self nft'
      toast.warn(t(errorText))
      throw new Error(errorText)
    }

    await contract?.call('executeOrder', [nft.address, nft.asset], {
      value: nft.price,
      gasLimit: 300000
    })

    cartStore.remove(nft.address, nft.asset)
  }
  async function buyAllTokens() {
    setLoading(true)
    try {
      await Promise.all(cartStore.carts.map(buyMarkOrder))
      toast.success(t("Purchase success"))
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(t("Purchase failed"))
      setLoading(false)
    }
  }


  return <>
    <div className="mt-[5px] cursor-pointer" onClick={() => setShowCartDrawer(true)}>
      <Badge offset={[-5, 5]} count={cartLength}>
        <IconCart className="text-[38px] text-white" />
      </Badge>
    </div>

    <Drawer title={t('Your Cart')} open={showCartDrawer} onClose={() => setShowCartDrawer(false)} >
      {
        cartStore.carts.length
          ? <>
            <div className="flex justify-between text-black mb-6">
              <div>{t('ItemCount', { count: cartStore.carts.length })}</div>
              <button onClick={() => cartStore.clear()}>{t('Clear all')}</button>
            </div>

            <div className="flex gap-3 flex-col">
              {cartStore.carts.map((item, index) => <CartItem item={item} key={index} />)}
            </div>

            <div className="flex justify-between text-black mt-6">
              <div>{t('Total Price')}</div>
              <div>{totalPrice} MXC</div>
            </div>
          </>
          : <>
            <div className="py-11 text-black text-center">
              {t('Add a project to get started')}
            </div>
          </>
      }

      <button
        style={{ width: '100%', marginTop: '24px' }}
        disabled={!cartStore.carts.length}
        className="tw-web3button css-1fii1tk"
        onClick={buyAllTokens}
      >
        {
          !loading
            ? <>{t('Complete Purchase')}</>
            : <IconLoading />
        }
      </button>
    </Drawer>
  </>
}