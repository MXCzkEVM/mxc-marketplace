import {
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
} from "@thirdweb-dev/react"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import Container from "@/components/Container/Container"
import Skeleton from "@/components/Skeleton/Skeleton"
import NFTCard from "@/components/NFTCard"
import Router from "next/router"
import styles from "@/styles/Profile.module.css"
import { randomColor } from "@/util/randomColor"
import { CHAIN_ID } from "@/const/Network"
import { zeroAddress } from "@/const/Local"
import UserNFTS from "@/components/UserNFTs"
import { getCollectList } from "@/util/getNFT"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

// import CollectionCard from "@/components/collection/CollectionCard"

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
]

export default function ProfilePage() {
  const router = useRouter()
  const [tab, setTab] = useState<
    "nfts" | "mycollections" | "mynfts" | "auctions"
  >("mycollections")
  const [userCollections, setUserCollections] = useState<any>([])
  const [collections, setCollections] = useState<any>([])
  const [isLoading, setLoading] = useState(false)

  const address = router.query.address || zeroAddress

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let myCollections: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
        creator: address,
      })
      let userCollections = myCollections?.collections || []
      userCollections = await getCollectList(userCollections)
      setUserCollections(userCollections)

      setLoading(false)

      let collectionsAll: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
      })
      let collections = collectionsAll?.collections || []
      collections = await getCollectList(collections)
      setCollections(collections)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address])

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

        {/* tab */}
        <div className={styles.tabs}>
          <h3
            className={`${styles.tab} 
            ${tab === "mycollections" ? styles.activeTab : ""}`}
            onClick={() => setTab("mycollections")}
          >
            Collections
          </h3>

          <h3
            className={`${styles.tab} 
            ${tab === "mynfts" ? styles.activeTab : ""}`}
            onClick={() => setTab("mynfts")}
          >
            NFTS
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
          <div>
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
                <UserNFTS
                  {...collection}
                  key={index}
                  user={router.query.address}
                />
              ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
