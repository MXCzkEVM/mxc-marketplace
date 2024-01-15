/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react"

import {
  useContractWrite,
  useContract,
  useContractRead,
  useAddress,
  Web3Button,
  getContractFromAbi
} from "@thirdweb-dev/react"

import { useRouter } from "next/router"
import { Toaster } from "react-hot-toast"
import { ABI, CONTRACTS_MAP } from "@/const/Address"

import { zeroAddress } from "@/const/Local"

import Container from "@/components/Container/Container"
import { randomColor } from "@/util/randomColor"
import Link from "next/link"

import { BigNumber, ethers } from "ethers"
import Skeleton from "@/components/Skeleton/Skeleton"
import PriceInput from "@/components/PriceInput"
import { toast } from "react-toastify"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"
import { getNFTDetail } from "@/util/getNFT"
const [randomColor1, randomColor2] = [randomColor(), randomColor()]
import { useTranslation } from "react-i18next"
import { useName } from '@/hooks'
import { AddCartButton } from "@/components/CartButton/AddCartButton"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import TransferButton from "@/components/TransferButton"
import axios from "axios"
dayjs.extend(relativeTime)

const collection = CONTRACTS_MAP.MEP1004

export default function TokenPage() {
  const [nft, SetNFT] = useState<any>({ metadata: {}, owner: null })
  const [nftPrice, setNftPrice] = useState<BigNumber>(BigNumber.from(0))
  const [inputPrice, setInputPrice] = useState<any>("")
  const [detail, setDetail] = useState<any>()
  const router = useRouter()
  const address = useAddress() || zeroAddress
  const ownerName = useName(nft.owner)

  const { t } = useTranslation()

  const { tokenId = "0" } = router.query as {
    tokenId: string
    collection: string
  }

  // get nft info
  const { contract: nftContract } = useContract(collection, ABI.mep1004)
  const { data: isApproved } = useContractRead(nftContract, "getApproved", [
    tokenId,
  ])

  const { data: isApprovedForAll } = useContractRead(
    nftContract,
    "isApprovedForAll",
    [address || zeroAddress, CONTRACTS_MAP.MARKETPLACE]
  )

  const { mutateAsync: setApprovalForAll } = useContractWrite(
    nftContract,
    "setApprovalForAll",
  )

  // get market info
  const { contract: mkpContract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const { data: mkp_info, isLoading: mkpLoading } = useContractRead(
    mkpContract,
    "orderByAssetId",
    [collection, tokenId]
  )
  const { mutateAsync: createOrder } = useContractWrite(
    mkpContract,
    "createOrder"
  )
  const { mutateAsync: cancelOrder } = useContractWrite(
    mkpContract,
    "cancelOrder"
  )
  const { mutateAsync: executeOrderByErc721 } = useContractWrite(
    mkpContract, "executeOrderByErc721"
  )

  useEffect(() => {
    if (collection == zeroAddress)
      return
    const fetchData = async () => {
      let id = tokenId as string
      let nft = await getNFTDetail(collection, id)
      SetNFT(nft)
    }
    fetchData()
  }, [tokenId, mkp_info])

  useEffect(() => {
    if (!mkp_info)
      return
    setNftPrice(mkp_info.price)
  }, [mkp_info])

  const approveForSale = async () => {
    if (nft.owner !== address) {
      toast.warn(t("You are not the nft owner"))
      return
    }

    let txResult
    try {
      txResult = await setApprovalForAll({
        args: [CONTRACTS_MAP.MARKETPLACE, true],
      })
      toast.success(t("Approve successfully Now you can List for sale"))
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t("Approve for sale failed"))
    }

    return txResult
  }

  const listForSale = async () => {
    if (!nftPrice.eq(0)) {
      toast.warn(t("This NFT not for sale"))
      return
    }
    if (nft.owner !== address) {
      toast.warn(t("You are not the nft owner"))
      return
    }
    if (!inputPrice || parseFloat(inputPrice) == 0) {
      toast.warn(t("Please input your nft price"))
      return
    }

    let date = new Date()
    date.setMonth(date.getMonth() + 6)
    let expiresAt = Math.floor(date.getTime() / 1000)

    let txResult
    try {
      // Simple one-liner for buying the NFT
      txResult = await createOrder({
        args: [
          collection,
          tokenId,
          ethers.utils.parseEther(inputPrice),
          expiresAt,
        ],
      })
      toast.success(t("List for sale successfully"))
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t("List for sale failed"))
    }

    return txResult
  }

  const cancelMakeOrder = async () => {
    if (nft.owner !== address) {
      toast.warn(t("You are not the nft owner"))
      return
    }
    let txResult
    try {
      // Simple one-liner for buying the NFT
      txResult = await cancelOrder({
        args: [collection, tokenId],
      })
      toast.success(t("Cancel list for sale successfully"))
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t("Cancel list for sale failed"))
    }

    return txResult
  }

  const buyMakeOrder = async () => {
    if (nft.owner == address) {
      toast.warn(t("You cannot buy your self nft"))
      return
    }
    let txResult
    try {
      // Simple one-liner for buying the NFT
      txResult = await executeOrderByErc721({
        args: [collection, tokenId],
        overrides: {
          value: nftPrice,
          gasLimit: 300000, // override default gas limit
        },
      })
      setInputPrice("")
      toast.success(t("Purchase success"))
    } catch (error) {
      console.log(error)
      toast.error(t("Purchase failed"))
    }

    return txResult
  }

  const isApprovedCond =
    isApproved === zeroAddress &&
    isApproved !== CONTRACTS_MAP.MARKETPLACE &&
    isApprovedForAll
    
  const isNFTOwner = nft.owner === address

  useEffect(() => {
    requestDetail()
  }, [tokenId])

  async function requestDetail() {
    if (!tokenId|| Number(tokenId) === 0)
      return
    const {data} = await axios('/mep2542/getMEP1004TokenDetail', {
      baseURL: process.env.NEXT_PUBLIC_MINING_API,
      params: { tokenId }
    })
    setDetail(data.mep1004TokenDetail)
  }

  function renderApprove() {
    return (
      <>
        <Web3Button
          contractAddress={collection}
          contractAbi={ABI.collection}
          action={async () => await approveForSale()}
          className="list_btn"
        >
          {t("Approve item for marketplace")}
        </Web3Button>
      </>
    )
  }
  function renderListNft() {
    return (
      <div className="sell_info">
        <PriceInput
          className="input"
          placeholder="NFT Price"
          decimals={8}
          value={"" + inputPrice}
          onChange={(val: any) => setInputPrice(val)}
        />

        <Web3Button
          isDisabled={!isApproved}
          contractAddress={CONTRACTS_MAP.MARKETPLACE}
          contractAbi={ABI.marketplace}
          action={async () => await listForSale()}
          className="list_btn"
          style={{ width: '100%' }}
        >
          {t("List for sale")}
        </Web3Button>
      </div>
    )
  }
  function renderButtons() {
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <TransferButton
          onSuccess={(owner) => SetNFT({ ...nft, owner })}
          address={collection}
          id={tokenId}
        />
      </div>
    )
  }
  function renderCancel() {
    return (
      <div className="sell_info mb-6">
        <h4 className="formSectionTitle">{t("Cancel Order")} </h4>
        <Web3Button
          contractAddress={CONTRACTS_MAP.MARKETPLACE}
          contractAbi={ABI.marketplace}
          action={async () => await cancelMakeOrder()}
          className="list_btn"
        >
          {t("Cancel list for sale")}
        </Web3Button>
      </div>
    )
  }
  function renderExcute() {
    return (
      <div className="sell_info mb-6">
        <h4 className="formSectionTitle">{t("Excute Order")} </h4>
        <div className="flex gap-3 items-center">
          <Web3Button
            contractAddress={CONTRACTS_MAP.MARKETPLACE}
            contractAbi={ABI.marketplace}
            action={async () => await buyMakeOrder()}
            className="flex-1"
          >
            {t("Buy at asking price")}
          </Web3Button>
          <AddCartButton
            item={{
              address: collection,
              asset: Number(tokenId),
              image: nft.image,
              meta: nft.metadata,
              owner: nft.owner,
              price: nftPrice.toString()
            }}
          />
        </div>
      </div>
    )
  }
  function renderPrices() {
    return (
      <div className="pricingContainer">
        <div className="pricingInfo">
          <p className="mb-1">{t("Price")}</p>
          <div className="pricingValue">
            {mkpLoading ? (
              <Skeleton width="120" height="24" />
            ) : (
              <>
                {!nftPrice.eq(0) ? (
                  <>
                    {ethers.utils.formatEther(nftPrice)}
                    {"  MXC"}
                  </>
                ) : (
                  t("Not for sale")
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="nft_detail">
      <Toaster position="bottom-center" reverseOrder={false} />
      {nft.owner ? (
        <Container maxWidth="lg">
          <div className="container">
            <div className="metadataContainer">
              <div className="token_image">
                <Image style={{height: '265px'}} src="https://matchx.io/cdn/shop/products/matchx_gateway_001.jpg?crop=center&height=675&v=1676546606&width=450" defaultImage={defaultPng.src} alt="" />
              </div>
              {nft.metadata.description && <>
                <h3 className="descriptionTitle">{t("Description")}</h3>
                <p className="description">{nft.metadata.description}</p>
              </>}
              <h3 className="descriptionTitle">{t("Fuel Tank Address")}</h3>
              <p className="description">{detail?.erc6551Addr}</p>
              <h3 className="descriptionTitle">{t("Fuel Tank Size")}</h3>
              <p className="description">{detail?.erc6551Addr}</p>
            </div>
            <div className="listingContainer">
              <div className="title">
                MEP1004M2PRO
                <div className="flex gap-3">
                  <span>Token ID #{nft.metadata.id}</span>
                </div>
              </div>

              <div className="owner">
                <Link
                  href={`/profile/${nft.owner}`}
                  className="nftOwnerContainer"
                >
                  <div
                    className="nftOwnerImage"
                    style={{
                      background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                    }}
                  />
                  <div className="nftOwnerInfo">
                    <p className="label">{t("Current Owner")}</p>
                    <p className="nftOwnerAddress">
                      {ownerName}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="flex gap-6">
                {renderPrices()}
              </div>

              {/* 自己的nft 并且还没授权给市场 */}
              {isNFTOwner && !isApprovedCond && renderApprove()}
              {isNFTOwner && nftPrice.eq(0) && isApprovedCond && renderListNft()}
              {isNFTOwner && !nftPrice.eq(0) && isApprovedCond && renderCancel()}
              {isNFTOwner && nftPrice.eq(0) && renderButtons()}
              {address !== zeroAddress && !isNFTOwner && !nftPrice.eq(0) && renderExcute()}
            </div>
          </div>
        </Container>
      ) : null}
    </div>
  )
}
