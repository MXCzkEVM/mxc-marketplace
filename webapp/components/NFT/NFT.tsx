import {
  ThirdwebNftMedia,
  useContract,
  useActiveListings,
  // useValidDirectListings,
  // useValidEnglishAuctions,
} from "@thirdweb-dev/react"
import { NFT } from "@thirdweb-dev/sdk"
import React from "react"
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses"
import Skeleton from "../Skeleton/Skeleton"
import styles from "./NFT.module.css"

type Props = {
  nft: NFT
}

export default function NFTComponent({ nft }: Props) {
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  )
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace)

  let nft_info: any = {}
  let nft_id = nft?.metadata?.id || null
  if (nft_id && listings?.length) {
    let listing = listings?.filter((item) => item.tokenId.toString() == nft_id)
    nft_info = listing[listing.length - 1] || {}
  }

  // const { contract: marketplace, isLoading: loadingContract } = useContract(
  //   MARKETPLACE_ADDRESS,
  //   "marketplace-v3"
  // )

  // // 1. Load if the NFT is for direct listing
  // const { data: directListing, isLoading: loadingDirect } =
  //   useValidDirectListings(marketplace, {
  //     tokenContract: NFT_COLLECTION_ADDRESS,
  //     tokenId: nft.metadata.id,
  //   })

  // // 2. Load if the NFT is for auction
  // const { data: auctionListing, isLoading: loadingAuction } =
  //   useValidEnglishAuctions(marketplace, {
  //     tokenContract: NFT_COLLECTION_ADDRESS,
  //     tokenId: nft.metadata.id,
  //   })

  return (
    <>
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />

      <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>

      {/* <div className={styles.priceContainer}>
        {loadingContract || loadingDirect || loadingAuction ? (
          <Skeleton width="100%" height="100%" />
        ) : directListing && directListing[0] ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>
                {`${directListing[0]?.currencyValuePerToken.displayValue}
          ${directListing[0]?.currencyValuePerToken.symbol}`}
              </p>
            </div>
          </div>
        ) : auctionListing && auctionListing[0] ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Minimum Bid</p>
              <p className={styles.nftPriceValue}>
                {`${auctionListing[0]?.minimumBidCurrencyValue.displayValue}
          ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>Not for sale</p>
            </div>
          </div>
        )}
      </div> */}

      <div className={styles.priceContainer}>
        {loadingListings ? (
          <Skeleton width="100%" height="100%" />
        ) : nft_info.buyoutCurrencyValuePerToken ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>
                {`${nft_info.buyoutCurrencyValuePerToken.displayValue}
          ${nft_info.buyoutCurrencyValuePerToken?.symbol}`}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>Not for sale</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
