import {
  useContract,
  useOwnedNFTs,
  useValidDirectListings,
  // useValidEnglishAuctions,
} from "@thirdweb-dev/react"
import { useRouter } from "next/router"
import React, { useState } from "react"
import Container from "../../components/Container/Container"
import ListingWrapper from "../../components/ListingWrapper/ListingWrapper"
import NFTGrid from "../../components/NFT/NFTGrid"
import Skeleton from "../../components/Skeleton/Skeleton"
import Router from "next/router"

import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses"
import styles from "../../styles/Profile.module.css"
import randomColor from "../../util/randomColor"

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
]

export default function ProfilePage() {
  const router = useRouter()
  const [tab, setTab] = useState<
    "nfts" | "mycollections" | "listings" | "auctions"
  >("mycollections")

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS)

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  )

  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftCollection,
    router.query.address as string
  )

  const toPath = (link: string) => {
    Router.push(link)
  }

  return (
    <div className="profile_page">
      <Container maxWidth="lg">
        <div className={styles.profileHeader}>
          <div
            className={styles.coverImage}
            style={{
              background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
            }}
          />
          <div
            className={styles.profilePicture}
            style={{
              background: `linear-gradient(90deg, ${randomColor3}, ${randomColor4})`,
            }}
          />
          <h1 className={styles.profileName}>
            {router.query.address ? (
              router.query.address.toString().substring(0, 4) +
              "..." +
              router.query.address.toString().substring(38, 42)
            ) : (
              <Skeleton width="320" />
            )}
          </h1>
        </div>

        <div className={styles.tabs}>
          <h3
            className={`${styles.tab} 
          ${tab === "mycollections" ? styles.activeTab : ""}`}
            onClick={() => setTab("mycollections")}
          >
            My Collections
          </h3>
        </div>

        {/* <div
        className={`${
          tab === "nfts" ? styles.activeTabContent : styles.tabContent
        }`}
      >
        <NFTGrid
          data={ownedNfts}
          isLoading={loadingOwnedNfts}
          emptyText="Looks like you don't have any NFTs from this collection. Head to the buy page to buy some!"
        />
      </div> */}

        <div
          className={`${
            tab === "mycollections"
              ? styles.activeTabContent
              : styles.tabContent
          }`}
        >
          <div className="mb-5">
            Create, curate, and manage collections of unique NFTs to share and
            sell.
          </div>
          <div>
            <button
              onClick={() => toPath("/collection/create")}
              className="create_btn"
            >
              Create a collection
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}
