import React from "react"
import { useOwnedNFTs, useContract } from "@thirdweb-dev/react"
import { ABI } from "@/const/Address"
import { zeroAddress } from "@/const/Local"

import NFTCard from "@/components/collection/MyNFTCard"

export default function CollectionNFTS(props: any) {
  const address = props.user || zeroAddress
  const { contract: collectionContract } = useContract(
    props.collection,
    ABI.collection
  )
  const { data: nftList } = useOwnedNFTs(collectionContract, address)

  return (
    <>
      {nftList &&
        nftList.map((item: any, index: number) => {
          return (
            <NFTCard
              key={index}
              item={item}
              collection_id={props.collection}
              collection_data={...props}
            />
          )
        })}
    </>
  )
}
