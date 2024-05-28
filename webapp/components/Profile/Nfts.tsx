import type { NextPage } from "next"
import { useRouter } from "next/router"
import { zeroAddress } from "@/const/Local"
import React, { useState, useEffect } from "react"
import { CHAIN_ID } from "@/const/Network"
import ApiClient from "@/util/request"
import { getCollectList } from "@/util/getNFT"
import UserNFTS from "@/components/UserNFTs"
import SkeletonList from "@/components/Skeleton/SkeletonList"

const api = new ApiClient("/")

const ProfileNFTs: NextPage = (props:any) => {
  const router = useRouter()
  const [collections, setCollections] = useState<any>([])
  const address = router.query.address || zeroAddress
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let collectionsAll: any = [
        ...props.launchpad
          ? (
            await api.post("/api/get-collections-launchpad", {
              chainId: CHAIN_ID,
            }).then((d: any) => d.collections)
          )
          : (
            await api.post("/api/get-collections", {
              chainId: CHAIN_ID,
            }).then((d: any) => d.collections)
          )
        ,

      ].filter(Boolean)
      let collections = collectionsAll || []
      collections = await getCollectList(collections)
      setCollections(collections)
      setLoading(false)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address])
  return (
    <div className="cardsection">
      {collections.length && !isLoading
        ? collections.map((collection: any, index: string) => (
          <UserNFTS {...collection} key={index} user={router.query.address} />
        ))
        : isLoading && <SkeletonList />}
    </div>
  )
}

export default ProfileNFTs
