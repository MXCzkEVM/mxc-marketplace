import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { useNFTs, useContract, useContractRead } from "@thirdweb-dev/react"
import Container from "@/components/Container/Container"
import BannerComponent from "@/components/collection/Banner"
import CollectionCard from "@/components/collection/CollectionCard"
import { CHAIN_ID } from "@/const/Network"
import { ABI } from "@/const/Address"

import { zeroAddress } from "@/const/Local"
import { getCollectInfo, getThirdWebNFTList } from "@/util/getNFT"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function CollectPage() {
  const [collectionDta, setCollectionDta] = useState(null)
  const [nfts, setNFTS] = useState<any>([])
  const [collectionAddress, setCollectionAddress] = useState(zeroAddress)

  const router = useRouter()
  const collectionId: any = router.query.collection || zeroAddress

  const { contract: nftContract } = useContract(
    collectionAddress,
    ABI.collection
  )
  const { data: nftLis } = useNFTs(nftContract)

  useEffect(() => {
    const fetchData = async () => {
      if (collectionId == zeroAddress) {
        return
      }

      if (collectionId.toLowerCase().includes("mxc")) {
        let mapResult: any = await api.post("/api/get-collection-map", {
          chainId: CHAIN_ID,
          domain: collectionId,
        })
        if (mapResult.collection) {
          setCollectionAddress(mapResult.collection)
        }
        return
      }
      setCollectionAddress(collectionId)
    }
    fetchData()
  }, [collectionId])

  //
  useEffect(() => {
    const fetchData = async () => {
      if (collectionAddress == zeroAddress) {
        return
      }
      let collectionsItem: any = await api.post("/api/get-collection", {
        chainId: CHAIN_ID,
        collection_id: collectionAddress,
      })
      let collection = collectionsItem?.collection || {}
      let nwData = await getCollectInfo(collection)
      setCollectionDta(nwData)
      let nftList = await getThirdWebNFTList(nftLis)
      setNFTS(nftList)
    }
    fetchData()
  }, [collectionAddress, nftLis])

  return (
    <Container maxWidth="lg">
      <div className="w-full">
        {collectionDta && (
          <BannerComponent nfts={nfts?.length} collectionDta={collectionDta} />
        )}
        {collectionDta && (
          <div className="cardsection">
            {nfts &&
              nfts.map((item: any, index: number) => {
                return (
                  <CollectionCard
                    key={index}
                    item={item}
                    collection_id={collectionAddress}
                  />
                )
              })}
          </div>
        )}
      </div>
    </Container>
  )
}
