import React, { useState } from "react"
import { IPFS_GATEWAY } from "@/const/Local"
import Router from "next/router"
import defaultCover from "@/assets/placeholder.png"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { ethers } from "ethers"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"

const CollectionCard = (props: any) => {
  const item = props.item || {}
  const collection_id = props.collection_id
  let cover = defaultCover.src
  if (item?.metadata?.image) {
    cover = `${IPFS_GATEWAY}${item.metadata?.image}`
  }
  const toPath = (link: string) => {
    Router.push(link)
  }

  const { contract: mkpContract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const { data: mkp_current_info } = useContractRead(
    mkpContract,
    "orderByAssetId",
    [collection_id, item.metadata.id]
  )

  const { data: mkp_latest_info } = useContractRead(
    mkpContract,
    "assertPrice",
    [collection_id, item.metadata.id]
  )

  return (
    <div
      className="collectioncard"
      style={{order: mkp_current_info && !mkp_current_info?.price.eq(0) ? '-1' : '1'}}
      onClick={() => toPath(`/collection/${collection_id}/${item.metadata.id}`)}
    >
      <div className="image">
        <Image src={cover} defaultImage={defaultPng.src} alt="" />
      </div>
      
      <div className="content">
        <div className="title">
          <span className="name text-xs">
            {item.metadata.name}
            {item.metadata.name.includes("#") ? "" : ` #${item?.metadata?.id}`}
          </span>
          {/* <div className="raritylevel">{"#" + item.rarityLevel}</div> */}
        </div>
        <div className="pricediv text-sm mt-1">
          {!mkp_current_info || mkp_current_info.price.eq(0) ? (
            "Not for sale"
          ) : (
            <>{ethers.utils.formatEther(mkp_current_info?.price)} MXC</>
          )}
        </div>
        <div className="lastsalepricediv">
          <span className="lastsaleprice">
            Last sale:{" "}
            {mkp_latest_info && !mkp_latest_info.price.eq(0)
              ? `${ethers.utils.formatEther(mkp_latest_info.price)} MXC`
              : "None"}{" "}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
