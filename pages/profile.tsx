import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import React, { useState, useEffect } from "react"
import Container from "@/components/Container/Container"
import Skeleton from "@/components/Skeleton/Skeleton"
import NFTCard from "@/components/NFTCard"
import Router from "next/router"
import styles from "@/styles/Profile.module.css"
import randomColor from "@/util/randomColor"
import { CONTRACTS_MAP, ABI } from "@/const/Network"
import { zeroAddress } from "viem"
import MyNFTS from "@/components/MyNFTs"
import { getCollectList } from "@/util/getNFT"

// import CollectionCard from "@/components/collection/CollectionCard"

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
]

export default function ProfilePage() {
  const [tab, setTab] = useState<
    "nfts" | "mycollections" | "mynfts" | "auctions"
  >("mycollections")

  const [userCollections, setUserCollections] = useState<any>([])

  const address = useAddress() || zeroAddress
  const { contract: collectionFactoryContract } = useContract(
    CONTRACTS_MAP.COLLECTION_FACTORY,
    ABI.collectionFactory
  )
  const { data: myCollections, isLoading } = useContractRead(
    collectionFactoryContract,
    "fetchUserCollections",
    [address]
  )

  const { data: collections } = useContractRead(
    collectionFactoryContract,
    "fetchCollections"
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!myCollections) {
        setUserCollections([])
        return
      }
      let collections = await getCollectList(myCollections)
      setUserCollections(collections)
    }
    if (address) {
      fetchData()
    }
  }, [address, myCollections])

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
            {address ? (
              address.toString().substring(0, 4) +
              "..." +
              address.toString().substring(38, 42)
            ) : (
              <Skeleton width="320" />
            )}
          </h1>
        </div>

        {/* tab */}
        <div className={styles.tabs}>
          <h3
            className={`${styles.tab} 
          ${tab === "mycollections" ? styles.activeTab : ""}`}
            onClick={() => setTab("mycollections")}
          >
            My Collections
          </h3>

          <h3
            className={`${styles.tab} 
          ${tab === "mynfts" ? styles.activeTab : ""}`}
            onClick={() => setTab("mynfts")}
          >
            My NFTS
          </h3>
        </div>

        {/* mycollections */}
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
            <div className="btns mb-3">
              <button
                onClick={() => toPath("/collection/create")}
                className="create_btn mr-5"
              >
                Create a collection
              </button>
              <button
                onClick={() => toPath("/asset/create")}
                className="create_btn"
              >
                Create a item
              </button>
            </div>

            <div className="feature mb-10">
              <div className="nfts_collection">
                {isLoading ? (
                  <Skeleton width="17.8%" height="250px" />
                ) : (
                  (userCollections.length &&
                    (userCollections as any).map((nft: any, index: number) => (
                      <NFTCard nft={nft} key={index} />
                    ))) ||
                  ""
                )}
              </div>
            </div>
          </div>
        </div>

        {/* mynfts */}
        <div
          className={`${
            tab === "mynfts" ? styles.activeTabContent : styles.tabContent
          }`}
        >
          <div className="cardsection">
            {collections &&
              collections.map((collection: any, index: string) => (
                <MyNFTS {...collection} key={index} />
              ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
