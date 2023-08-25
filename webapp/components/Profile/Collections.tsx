import type { NextPage } from "next"
import Router, { useRouter } from "next/router"
import { useAddress } from "@thirdweb-dev/react"
import { zeroAddress } from "@/const/Local"
import React, { useState, useEffect } from "react"
import NFTCard from "@/components/NFTCard"
import { CHAIN_ID } from "@/const/Network"
import ApiClient from "@/util/request"
import { getCollectList } from "@/util/getNFT"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import { useTranslation } from "react-i18next"

const api = new ApiClient("/")

const ProfileCollections: NextPage = () => {
  const router = useRouter()
  const address = router.query.address || zeroAddress
  const my_address = useAddress() || zeroAddress
  const isOwner = address !== zeroAddress && my_address == address
  const [isLoading, setLoading] = useState(false)
  const [userCollections, setUserCollections] = useState<any>([])
  const [update, setUpdate] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let Collections: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
        creator: address,
      })
      let userCollections = Collections?.collections || []
      userCollections = await getCollectList(userCollections)
      setUserCollections(userCollections)
      setLoading(false)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address, update])

  return (
    <>
      {isOwner ? (
        <div className="btns mb-3 flexbox">
          <button
            onClick={() => Router.push("/collection/create")}
            className="create_btn mr-2"
          >
            {t("Create a collection")}
          </button>
          <button
            onClick={() => Router.push("/asset/create")}
            className="create_btn"
          >
            {t("Create an item")}
          </button>
        </div>
      ) : null}

      <div className="feature mb-10">
        <div className="nfts_collection">
          {isLoading ? (
            <SkeletonList />
          ) : (
            (userCollections.length &&
              (userCollections as any).map((nft: any, index: number) => (
                <NFTCard
                  nft={nft}
                  key={index}
                  user={router.query.address}
                  setUpdate={setUpdate}
                  update={update}
                />
              ))) ||
            ""
          )}
        </div>
      </div>
    </>
  )
}

export default ProfileCollections
