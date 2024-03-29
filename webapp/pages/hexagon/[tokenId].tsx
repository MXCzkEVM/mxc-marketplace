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
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { zeroAddress } from "@/const/Local"
import Container from "@/components/Container/Container"
import { randomColor, getColorFromH3Id } from "@/util/randomColor"
import Link from "next/link"
import { BigNumber, ethers } from "ethers"
import Skeleton from "@/components/Skeleton/Skeleton"
import PriceInput from "@/components/PriceInput"
import { toast } from "react-toastify"
import { getNFTDetail } from "@/util/getNFT"
import HexagonLogo from "@/components/HexagonLogo"
import ApiClient from "@/util/request"
import { useTranslation } from "react-i18next"
import TransferButton from "@/components/TransferButton"
import { useName } from "@/hooks"

const [randomColor1, randomColor2] = [randomColor(), randomColor()]

export default function TokenPage() {
  //   const [collectionDta, setCollectionDta] = useState<any>({})
  const [nft, SetNFT] = useState<any>({ metadata: {}, owner: null })
  const [nftPrice, setNftPrice] = useState<BigNumber>(BigNumber.from(0))
  const [inputPrice, setInputPrice] = useState<any>("")
  const router = useRouter()
  const address = useAddress() || zeroAddress
  const collection = CONTRACTS_MAP.MEP1002Name
  const { t } = useTranslation()
  const ownerName = useName(nft.owner)


  const { tokenId = "0" } = router.query as {
    tokenId: string
  }

  // get nft info
  const { contract: nftContract } = useContract(collection, ABI.mep1002Name)
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
    "setApprovalForAll"
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
  const { mutateAsync: executeOrderByHexagon } = useContractWrite(
    mkpContract, "executeOrderByHexagon"
  )

  useEffect(() => {
    if (tokenId == "0") {
      return
    }
    const fetchData = async () => {
      let nft = await getNFTDetail(collection, tokenId)
      SetNFT(nft)
    }
    fetchData()
  }, [tokenId, mkp_info])

  useEffect(() => {
    if (!mkp_info) {
      return
    }
    let { expiresAt, price, seller } = mkp_info
    setNftPrice(price)
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
          ethers.BigNumber.from(tokenId),
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
      txResult = await executeOrderByHexagon({
        args: [collection, ethers.BigNumber.from(tokenId)],
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

  return (
    <div className="nft_detail">
      <Toaster position="bottom-center" reverseOrder={false} />
      {nft.owner ? (
        <Container maxWidth="lg">
          <div className="container">
            <div className="metadataContainer">
              <div className="token_image">
                {/* <Image src={nft.image} defaultImage={defaultPng.src} alt="" /> */}
                <HexagonLogo fill={getColorFromH3Id(tokenId)} />
              </div>
              {/* <h3 className="descriptionTitle">Description</h3>
              <p className="description">{nft.metadata.description}</p>

              <h3 className="descriptionTitle">Traits</h3>
              <div className="traitsContainer">
              </div> */}
            </div>

            <div className="listingContainer">
              <div className="title">
                Hexagon Naming NFT
                <div> Token ID #{nft.metadata.id}</div>
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

              <div className="pricingContainer">
                <div className="pricingInfo">
                  <p>Price</p>
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

              {/* 自己的nft 并且还没授权给市场 */}
              {isApproved == zeroAddress &&
                isApproved !== CONTRACTS_MAP.MARKETPLACE &&
                !isApprovedForAll &&
                nft.owner == address ? (
                <>
                  <h4 className="formSectionTitle mb-2">Approve</h4>
                  <Web3Button
                    contractAddress={collection}
                    contractAbi={ABI.mep1002Name}
                    action={async () => await approveForSale()}
                    className="list_btn"
                  >
                    {t("Approve item for marketplace")}
                  </Web3Button>
                </>
              ) : null}

              {address !== zeroAddress &&
                nft.owner == address &&
                nftPrice.eq(0) ? (
                <div className="sell_info">
                  <h4 className="formSectionTitle">{t("Price")} </h4>

                  <PriceInput
                    className="input"
                    placeholder="NFT Price"
                    decimals={8}
                    value={"" + inputPrice}
                    onChange={(val: any) => setInputPrice(val)}
                  />

                  <Web3Button
                    isDisabled={
                      isApproved &&
                      isApproved !== CONTRACTS_MAP.MARKETPLACE &&
                      !isApprovedForAll
                    }
                    contractAddress={CONTRACTS_MAP.MARKETPLACE}
                    contractAbi={ABI.marketplace}
                    action={async () => await listForSale()}
                    className="list_btn"
                  >
                    List for sale
                  </Web3Button>
                  <TransferButton
                    className="list_btn"
                    onSuccess={(owner) => SetNFT({ ...nft, owner })}
                    address={collection}
                    id={tokenId}
                  />
                </div>
              ) : null}

              {address !== zeroAddress &&
                nft.owner == address &&
                !nftPrice.eq(0) ? (
                <div className="sell_info">
                  <h4 className="formSectionTitle">{t("Cancel Order")} </h4>
                  <Web3Button
                    contractAddress={CONTRACTS_MAP.MARKETPLACE}
                    contractAbi={ABI.marketplace}
                    action={async () => await cancelMakeOrder()}
                    className="list_btn"
                  >
                    Cancel list for sale
                  </Web3Button>
                </div>
              ) : null}

              {address !== zeroAddress &&
                nft.owner !== address &&
                !nftPrice.eq(0) ? (
                <div className="sell_info">
                  <h4 className="formSectionTitle">{t("Excute Order")} </h4>

                  <Web3Button
                    contractAddress={CONTRACTS_MAP.MARKETPLACE}
                    contractAbi={ABI.marketplace}
                    action={async () => await buyMakeOrder()}
                    className="list_btn"
                  >
                    {t("Buy at asking price")}
                  </Web3Button>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      ) : null}
    </div>
  )
}
