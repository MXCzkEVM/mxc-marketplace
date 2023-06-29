import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { useNFTs, useContract, useContractRead } from "@thirdweb-dev/react"
import Container from "@/components/Container/Container"
import BannerComponent from "@/components/collection/Banner"
import CollectionCard from "@/components/collection/CollectionCard"
import { CHAIN_ID, ABI } from "@/const/Network"
import { getCollectInfo, getNFTList } from "@/util/getNFT"
import { zeroAddress } from "viem"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function CollectPage() {
  const [collectionDta, setCollectionDta] = useState(null)
  const [nfts, setNFTS] = useState<any>([])

  const router = useRouter()
  const collectionId: any = router.query.collection || zeroAddress

  const { contract: nftContract } = useContract(collectionId, ABI.collection)
  const { data: nftLis } = useNFTs(nftContract)

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionId) {
        return
      }

      let collectionsItem: any = await api.post("/api/get-collection", {
        chainId: CHAIN_ID,
        collection_id: collectionId,
      })
      let collection = collectionsItem?.collection || {}
      let nwData = await getCollectInfo(collection)
      setCollectionDta(nwData)
      let nftList = await getNFTList(nftLis)
      setNFTS(nftList)
    }
    fetchData()
  }, [collectionId, nftLis])

  return (
    <Container maxWidth="lg">
      <div className="w-full">
        {collectionDta && <BannerComponent collectionDta={collectionDta} />}
        {collectionDta && (
          <div className="cardsection">
            {nfts &&
              nfts.map((item: any, index: number) => {
                return (
                  <CollectionCard
                    key={index}
                    item={item}
                    collection_id={collectionId}
                  />
                )
              })}
          </div>
        )}
      </div>
    </Container>
  )
}
