import React from "react"
import Router from "next/router"
import verify from "@/assets/verify.svg"
import attention from "@/assets/attention.svg"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { CONTRACTS_MAP, ABI } from "@/const/Address"
import { ethers } from "ethers"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"
import { useTranslation } from "react-i18next"

export default function CollectionCard(props: any) {
  let { nft } = props

  const { t } = useTranslation()

  let isOfficalNft = false
  // offical collection
  ;[
    '0x4799640472292a886780E52EC5d7c1256399AE97',
    '0xc8583d516718237e7EF295bBc9E30Ed437b4dB5A',
    '0x7704870a55690599EB5ca47dA98076C3991469E5'
  ].forEach((col) => {
    if (col === nft.collection) isOfficalNft = true
  })

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
          <span className="title text-sm " style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nft.name} </span>
            <img
              src={isOfficalNft ? verify.src : attention.src}
              title={isOfficalNft ? t("Verified") : t("Caution")}
            />
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
