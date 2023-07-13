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
import NFTCard from "@/components/collection/MyNFTCard"

export default function CollectionNFTS(props: any) {
  const address = useAddress()
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
