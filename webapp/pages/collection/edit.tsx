import CollectionDetail from "@/components/CollectionDetail"
import { useRouter } from "next/router"
import { zeroAddress } from "@/const/Local"
import React, { useState, useEffect, useRef } from "react"
import { CHAIN_ID, ABI } from "@/const/Network"
import { getCollectInfo } from "@/util/getNFT"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function CreatePage() {
  const [collectionDta, setCollectionDta] = useState(null)
  const router = useRouter()
  const { collection_id } = router.query || zeroAddress

  useEffect(() => {
    const fetchData = async () => {
      if (!collection_id) {
        return
      }

      let collectionsItem: any = await api.post("/api/get-collection", {
        chainId: CHAIN_ID,
        collection_id: collection_id,
      })
      let collection = collectionsItem?.collection || {}
      let nwData = await getCollectInfo(collection)
      setCollectionDta(nwData)
    }
    fetchData()
  }, [collection_id])

  return <CollectionDetail type={"edit"} collectionDta={collectionDta} />
}
