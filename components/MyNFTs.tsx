import React, { useState, useEffect } from "react"
import { getCollectInfo } from "@/util/getNFT"

import {
  useOwnedNFTs,
  useContract,
  useAddress,
  useNFTs,
  useContractRead,
} from "@thirdweb-dev/react"
import { CONTRACTS_MAP, ABI } from "@/const/Network"
import { zeroAddress } from "viem"
import NFTCard from "@/components/collection/MyNFTCard"

export default function CollectionNFTS(props: any) {
  const address = useAddress() || zeroAddress
  const [collectionDta, setCollectionDta] = useState(null)
  const { contract: collectionContract } = useContract(
    props.collection,
    ABI.collection
  )
  // const { data: nftLis } = useNFTs(collectionContract)
  const { data: nftList } = useOwnedNFTs(collectionContract, address)

  const { contract: factoryContract } = useContract(
    CONTRACTS_MAP.COLLECTION_FACTORY,
    ABI.collectionFactory
  )
  const { data: collectionInfo } = useContractRead(
    factoryContract,
    "fetchCollection",
    [props.collection]
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionInfo) {
        setCollectionDta(null)
        return
      }
      let nwData = await getCollectInfo(collectionInfo)
      setCollectionDta(nwData)
    }
    fetchData()
  }, [])

  return (
    <>
      {nftList &&
        nftList.map((item: any, index: number) => {
          return (
            <NFTCard
              key={index}
              item={item}
              collection_id={props.collection}
              collection_data={collectionDta}
            />
          )
        })}
    </>
  )
}
