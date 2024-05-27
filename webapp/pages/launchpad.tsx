// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState } from "react"
import Container from "@/components/Container/Container"
import CollectionCard from "@/components/CollectionCard"
import { CHAIN_ID } from "@/const/Network"
import { getCollectList } from "@/util/getNFT"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import ApiClient from "@/util/request"
const api = new ApiClient("/")
import { Toaster } from "react-hot-toast"
import { useTranslation } from "react-i18next"

export default function Overview() {
  const [collections, setCollections] = useState<any>([])
  const [isLoading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let collectionsAll: any = await api.post("/api/get-collections-launchpad", {
        chainId: CHAIN_ID,
      })
      let collections = collectionsAll?.collections || []
      collections = await getCollectList(collections)
      setCollections(collections)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="collections_page">
      <Toaster></Toaster>
      <Container maxWidth="lg">
        <div className="feature mb-10">
          <h1>DePIN Launchpad</h1>
          <p>{t('Discover the next 100x with UXUY')}</p>
          <div className="nfts_feature">
            {collections && !isLoading
              ? collections.map((nft: any, index: number) => (
                  <CollectionCard launchpad nft={nft} key={index} />
                ))
              : isLoading && <SkeletonList />}
          </div>
        </div>
      </Container>
    </div>
  )
}
