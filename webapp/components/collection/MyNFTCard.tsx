import React, { useState } from "react"
import { IPFS_GATEWAY } from "@/const/Local"
import Router from "next/router"
import defaultCover from "@/assets/placeholder.png"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { BigNumber, ethers } from "ethers"

const MyNFTCard = (props: any) => {
  const item = props.item || {}
  const collection_data = props.collection_data || {}
  const collection_id = props.collection_id
  let cover = defaultCover.src
  if (item?.metadata?.image) {
    cover = `${IPFS_GATEWAY}${item.metadata.image}`
  }
  const toPath = (link: string) => {
    Router.push(link)
  }

  const { contract: mkpContract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const { data: mkp_info } = useContractRead(mkpContract, "orderByAssetId", [
    collection_id,
    item.metadata.id,
  ])

  return (
    <div
      className="collectioncard"
      onClick={() => toPath(`/collection/${collection_id}/${item.metadata.id}`)}
    >
      <div className="image">
        <img src={cover} alt="" />
      </div>

      <div className="content">
        <div className="collection flexbox">
          <div className="collection_img">
            <img className="w-full h-full" style={{objectFit: 'cover'}} src={collection_data.cover} alt="" />
          </div>
          <div className="title text-xs">{collection_data.name}</div>
        </div>
        <div className="title">
          <span className="name text-xl">
            {item.metadata.name} #{item?.metadata?.id}
          </span>
        </div>
        <div className="pricediv text-sm mt-1">
          {!mkp_info || mkp_info.price.eq(0) ? (
            "Not for sale"
          ) : (
            <>{ethers.utils.formatEther(mkp_info?.price)} MXC</>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyNFTCard
