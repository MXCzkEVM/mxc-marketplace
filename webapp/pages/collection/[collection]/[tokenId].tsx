import React, { useState, useEffect } from "react"

import {
  useContractWrite,
  useContract,
  useContractRead,
  useAddress,
  Web3Button,
} from "@thirdweb-dev/react"

import { useRouter } from "next/router"
import { Toaster } from "react-hot-toast"
import { CHAIN_ID } from "@/const/Network"
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
import { searchNftOrders } from '@/graphql/nft'
import { getNFTDetail, getCollectInfo } from "@/util/getNFT"
const [randomColor1, randomColor2] = [randomColor(), randomColor()]
import ApiClient from "@/util/request"
import { useTranslation } from "react-i18next"
import { nftClient } from "@/util/apolloClient"
import { Table } from 'antd'
import { ColumnsType } from "antd/es/table"
import { useCollectionAddress, useName, useNames } from '@/hooks'
import { AddCartButton } from "@/components/CartButton/AddCartButton"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import TransferButton from "@/components/TransferButton"
dayjs.extend(relativeTime)

const api = new ApiClient("/")
const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER

export default function TokenPage() {
  const [collectionDta, setCollectionDta] = useState<any>({})
  const [orderInfos, setOrderInfos
  ] = useState<any>([])
  const [nft, SetNFT] = useState<any>({ metadata: {}, owner: null })
  const [nftPrice, setNftPrice] = useState<BigNumber>(BigNumber.from(0))
  const [inputPrice, setInputPrice] = useState<any>("")
  const router = useRouter()
  const address = useAddress() || zeroAddress
  const ownerName = useName(nft.owner)
  const [tableAddress, setTableAddress] = useState<string[]>([])
  const names = useNames(tableAddress)

  const { t } = useTranslation()

  const { collection: addrOrUrl = zeroAddress, tokenId = "0" } = router.query as {
    tokenId: string
    collection: string
  }

  const collection = useCollectionAddress(addrOrUrl)

  // get nft info
  const { contract: nftContract } = useContract(collection, ABI.collection)
  const { data: isApproved } = useContractRead(nftContract, "getApproved", [
    tokenId,
  ])

  const { data: isApprovedForAll } = useContractRead(
    nftContract,
    "isApprovedForAll",
    [address || zeroAddress, CONTRACTS_MAP.MARKETPLACE]
  )
  const { data: stakedBalance } = useContractRead(
    nftContract,
    "stakedBalanceOf",
    [tokenId]
  )

  const { mutateAsync: setApprovalForAll } = useContractWrite(
    nftContract,
    "setApprovalForAll"
  )
  const { mutateAsync: burn } = useContractWrite(nftContract, "burn")

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
  const { mutateAsync: executeOrder } = useContractWrite(
    mkpContract,
    "executeOrder"
  )

  useEffect(() => {
    if (collection == zeroAddress) {
      return
    }
    const fetchData = async () => {
      let collectionsItem: any = await api.post("/api/get-collection", {
        chainId: CHAIN_ID,
        collection_id: collection,
      })
      let collectionDta = collectionsItem?.collection || {}
      let nwData = await getCollectInfo(collectionDta)
      setCollectionDta(nwData)

      let id = tokenId as string
      let nft = await getNFTDetail(collection, id)
      SetNFT(nft)
    }
    fetchData()
  }, [tokenId, collection, mkp_info])

  useEffect(() => {
    if (!mkp_info) {
      return
    }
    let { expiresAt, price, seller } = mkp_info
    setNftPrice(price)
  }, [mkp_info])

  const clickAttr = async (item: any) => {
    // if (item.trait_type == "Location Proofs") {
    //   const contract = new ethers.Contract(
    //     MEP1004ContractAddr,
    //     mep1004abi,
    //     provider
    //   )
    //   let { MEP1002TokenId } = await contract.latestLocationProofs(tokenId)
    //   let hexId = MEP1002TokenId._hex.replace("0x", "")
    //   window.open(
    //     `https://wannsee-explorer.mxc.com/mapper?hexid=${hexId}`,
    //     "_blank"
    //   )
    // }
  }

  const getAttrCss = (item: any) => {
    if (item.trait_type == "Location Proofs") {
      return "csp"
    }
    return ""
  }

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
      txResult = await executeOrder({
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

  const requestNftOrders = async () => {
    if (collection === zeroAddress)
      return
    const result = await nftClient.query({
      query: searchNftOrders(collection, tokenId),
    })
    const orderInfos = [...result.data.marketplaceOrderInfos]
    orderInfos.sort((a: any, b: any) => b.blockTimestamp - a.blockTimestamp)
    setOrderInfos(orderInfos)
    setTableAddress([
      ...orderInfos.map((o: any) => o.buyer),
      ...orderInfos.map((o: any) => o.seller)
    ])
  }


  useEffect(() => {
    requestNftOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, nftPrice])

  const columns: ColumnsType<any> = [
    {
      title: t('Event'),
      dataIndex: 'event',
      key: 'event',
      render(value) {
        const texts: Record<string, any> = {
          created: t('Sold'),
          cancelled: t('Cancelled'),
          successful: t('Transfer')
        }
        return texts[value]
      },
    },
    {
      title: t('Price'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render(value, row) {
        return value || row.priceInWei
          ? `${ethers.utils.formatEther(value || row.priceInWei)} MXC`
          : '-'
      },
    },
    {
      title: t('From'),
      dataIndex: 'seller',
      key: 'seller',
      render(value) {
        if (!value) return '-'
        return <Link target="_blank" href={`${explorerUrl}/address/${value}`}>
          {names[value.toLocaleUpperCase()]}
        </Link>
      },
    },
    {
      title: t('To'),
      dataIndex: 'buyer',
      key: 'buyer',
      render(value) {
        if (!value) return '-'
        return <Link target="_blank" href={`${explorerUrl}/address/${value}`}>
          {names[value.toLocaleUpperCase()]}
        </Link>
      },
    },
    {
      title: t('Hash'),
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render(value) {
        if (!value) return '-'
        return <Link target="_blank" href={`${explorerUrl}/tx/${value}`}>
          {value.slice(0, 4)}...
          {value.slice(-4)}
        </Link>
      },
    },
    {
      title: t('Date'),
      dataIndex: 'blockTimestamp',
      key: 'blockTimestamp',
      render(value) {
        return dayjs(value * 1000).fromNow()
      },
    },
  ];

  let attributes = nft?.metadata?.attributes || []
  attributes = attributes.filter((item: any) => item.trait_type !== 'Social Handle')

  const isApprovedCond =
    isApproved !== zeroAddress &&
    isApproved !== CONTRACTS_MAP.MARKETPLACE &&
    isApprovedForAll
  const isNFTOwner = nft.owner === address

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
        <Web3Button
          isDisabled={!isApproved}
          contractAddress={collection}
          contractAbi={ABI.collection}
          action={() => burn({ args: [tokenId] })}
          style={{ flex: '1' }}
          onSuccess={() => {
            toast.success(t("Burn successful"))
            SetNFT({ ...nft, owner: zeroAddress })
          }}
        >
          {t("Burn")}
        </Web3Button>
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
  function renderStaked() {
    return (
      <div className="pricingContainer">
        <div className="pricingInfo">
          <p className="mb-1">{t("Staked")}</p>
          <div className="pricingValue">
            {ethers.utils.formatEther(stakedBalance || 0)} XSD
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
                <Image src={nft.image} defaultImage={defaultPng.src} alt="" />
              </div>
              {nft.metadata.description && <>
                <h3 className="descriptionTitle">{t("Description")}</h3>
                <p className="description">{nft.metadata.description}</p>
              </>}

              {!!attributes?.length && <>
                <h3 className="descriptionTitle">{t("Traits")}</h3>
                <div className="traitsContainer">
                  {attributes.map((item: any, index: number) => (
                    <div
                      onClick={() => clickAttr(item)}
                      className={`traitContainer ${getAttrCss(item)}`}
                      key={index}
                    >
                      <p className="traitName text-xs">{item.trait_type}</p>
                      {item.trait_type !== 'Twitter'
                        ? <p className="traitValue text-sm">{item.value?.toString() || ""}</p>
                        : <Link className="traitValue text-sm" href={`https://twitter.com/${item.value}`}>{item.value || ""}</Link>
                      }
                    </div>
                  ))}
                </div>
              </>}

            </div>

            <div className="listingContainer">
              {collectionDta && (
                <div className="flexbox mb-3">
                  <div className="collectionImg">
                    <Image
                      src={collectionDta.cover}
                      defaultImage={defaultPng.src}
                      alt=""
                    />
                  </div>

                  <div className="collectionName text-base">
                    {collectionDta.name}
                  </div>
                </div>
              )}
              <div className="title">
                {nft.metadata.name}
                <div className="flex gap-3">
                  <span>Token ID #{nft.metadata.id}</span>
                  {nft.owner === zeroAddress && <div style={{ color: '#f27575' }}>{t('Fused')}</div>}
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
                {stakedBalance && !stakedBalance?.eq(0) && renderStaked()}
              </div>

              {/* 自己的nft 并且还没授权给市场 */}
              {isNFTOwner && !isApprovedCond && renderApprove()}
              {isNFTOwner && nftPrice.eq(0) && isApprovedCond && renderListNft()}
              {isNFTOwner && !nftPrice.eq(0) && isApprovedCond && renderCancel()}
              {isNFTOwner && nftPrice.eq(0) && renderButtons()}
              {address !== zeroAddress && !isNFTOwner && !nftPrice.eq(0) && renderExcute()}
              {
                !!orderInfos.length && <>
                  <h4 className="formSectionTitle mb-3">
                    {t('Order Events')}
                  </h4>
                  <Table scroll={{ x: 850 }} pagination={false} dataSource={orderInfos} columns={columns} />
                </>
              }
            </div>
          </div>
        </Container>
      ) : null}
    </div>
  )
}
