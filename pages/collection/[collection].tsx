import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import { useNFTs, useContract, useContractRead } from "@thirdweb-dev/react"
import Container from "@/components/Container/Container"
import BannerComponent from "@/components/collection/Banner"
import CollectionCard from "@/components/collection/CollectionCard"
import { CONTRACTS_MAP, ABI } from "@/const/Network"
import { getCollectInfo, getNFTList } from "@/util/getNFT"
import { zeroAddress } from "viem"

export default function CollectPage() {
  const [collectionDta, setCollectionDta] = useState(null)
  const [nfts, setNFTS] = useState<any>([])

  const router = useRouter()
  const collectionId: any = router.query.collection || zeroAddress

  const { contract: factoryContract } = useContract(
    CONTRACTS_MAP.COLLECTION_FACTORY,
    ABI.collectionFactory
  )

  const { data: collectionInfo } = useContractRead(
    factoryContract,
    "fetchCollection",
    [collectionId]
  )
  const { contract: nftContract } = useContract(collectionId, ABI.collection)
  const { data: nftLis } = useNFTs(nftContract)
  console.log()

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionId || !collectionInfo || !collectionInfo.ipfs) {
        return
      }

      let nwData = await getCollectInfo(collectionInfo)
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
