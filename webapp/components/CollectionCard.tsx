import React from "react"
import Router from "next/router"
import verify from "@/assets/verify.svg"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { CONTRACTS_MAP, ABI } from "@/const/Address"
import { ethers } from "ethers"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"

export default function CollectionCard(props: any) {
  let { nft } = props

  const toDetail = (id: string) => {
    Router.push(`/collection/${id}`)
  }

  const { contract: mkpContract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const { data: collectionMarketInfo } = useContractRead(
    mkpContract,
    "collectionMarketInfo",
    [nft.collection]
  )

  let { ceilingPrice, floorPrice } = collectionMarketInfo || {}
  return (
    <div className="nft_item csp" onClick={() => toDetail(nft.collection)}>
      <div className="image">
        <Image
          src={nft.profile ? nft.profile : defaultPng.src}
          defaultImage={defaultPng.src}
          alt=""
        />
      </div>

      <div className="content">
        <div className="contentTop break_ellipsis mb-5">
          <span className="title text-sm ">
            <span>{nft.name} </span>
            <img src={verify.src} alt="" />
          </span>
        </div>
        <div className="contentBottom flex">
          <div className="left w-1/2">
            <div className="floor">FLOOR</div>
            <div className="price">
              {floorPrice && !floorPrice.eq(0)
                ? `${ethers.utils.formatEther(floorPrice)} MXC`
                : "None"}
            </div>
          </div>
          <div className="right w-1/2">
            <div className="floor">CEILING</div>
            <div className="price">
              {ceilingPrice && !ceilingPrice.eq(0)
                ? `${ethers.utils.formatEther(ceilingPrice)} MXC`
                : "None"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
