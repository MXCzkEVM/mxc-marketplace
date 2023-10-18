import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import {
  useNFTs,
  useContract,
  useContractRead,
  useTotalCount,
} from "@thirdweb-dev/react"
import Container from "@/components/Container/Container"
import BannerComponent from "@/components/collection/Banner"
import CollectionCard from "@/components/collection/CollectionCard"
import { CHAIN_ID } from "@/const/Network"
import { ABI } from "@/const/Address"
import { Pagination } from "antd"
import SkeletonList from "@/components/Skeleton/SkeletonList"

import { zeroAddress } from "@/const/Local"
import { getCollectInfo, getThirdWebNFTList } from "@/util/getNFT"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function CollectPage() {
  const [collectionDta, setCollectionDta] = useState(null)
  const [page, setPage] = useState(1)
  const [nfts, setNFTS] = useState<any>([])
  const [collectionAddress, setCollectionAddress] = useState(zeroAddress)

  const router = useRouter()
  const collectionId: any = router.query.collection || zeroAddress

  const { contract: nftContract } = useContract(
    collectionAddress,
    ABI.collection
  )

  const { data: nftCounter } = useTotalCount(nftContract)
  let nftCounterNumber = nftCounter ? parseInt(nftCounter?.toString()) : 0

  const { data: nftLis, isLoading } = useNFTs(nftContract, {
    count: 20,
    start: (page - 1) * 20,
  })

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

  const onChange = (getPage: number) => {
    if (getPage == page) {
      return
    }
    setPage(getPage)
  }

  return (
    <div className="collection_detail">
      <Container maxWidth="lg">
        <div className="w-full">
          {isLoading && <SkeletonList />}
          {!isLoading && collectionDta && (
            <BannerComponent
              nfts={nftCounterNumber}
              collectionDta={collectionDta}
            />
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
          {!isLoading && (
            <div className="pagination flex_c">
              <Pagination
                pageSize={20}
                current={page}
                onChange={onChange}
                total={nftCounterNumber}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
