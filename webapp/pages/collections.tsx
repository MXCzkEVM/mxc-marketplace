// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState } from "react"
import Container from "@/components/Container/Container"
import CollectionCard from "@/components/CollectionCard"
import HexagonLogo from "@/components/HexagonLogo"
import Router from "next/router"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { CHAIN_ID } from "@/const/Network"
import { getCollectList } from "@/util/getNFT"
import Skeleton from "@/components/Skeleton/Skeleton"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function Overview() {
  const [collections, setCollections] = useState<any>([])
  const [isLoading, setLoading] = useState(false)

  const namesArr = Array.from({ length: 5 }, (_, i) => i)
  const hexagonArr = Array.from({ length: 5 }, (_, i) => i)

  const getColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let collectionsAll: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
      })
      let collections = collectionsAll?.collections || []
      collections = await getCollectList(collections)
      setCollections(collections)

      setLoading(false)
    }
    fetchData()
  }, [])

  const toPath = (link: string) => {
    Router.push(link)
  }

  return (
    <div className="collections_page">
      <Container maxWidth="lg">
        <div className="feature mb-10">
          <h1>Featured NFTs</h1>
          <p>Discover the most outstanding NFTs in all topics of life.</p>
          <div className="nfts_feature">
            {collections && !isLoading ? (
              (collections as any).map((nft: any, index: number) => (
                <CollectionCard nft={nft} key={index} />
              ))
            ) : (
              <Skeleton width="17.5%" height="250px" />
            )}
          </div>
        </div>

        {/* <div className="hexgon mb-10">
          <div className="flex justify-between items-center">
            <h1 className="title">Hexagon</h1>
            <div className="more csp pr-10" onClick={() => toPath("/hexagons")}>
              View More
            </div>
          </div>
          <div className="nfts_hexagons">
            {hexagonArr.map((item, index) => {
              return (
                <div className="nft_item" key={index}>
                  <div className="nft_image flex flex-col items-center justify-center">
                    <HexagonLogo fill={getColor()} />
                  </div>
                  <div className="token_id">#ffffffff2</div>
                  <div className="token_name">MXC</div>
                </div>
              )
            })}
          </div>
        </div> */}

        {/* <div className="names">
          <div className="flex justify-between items-center">
            <h1 className="title">MXC domains</h1>
            <div className="more csp pr-10" onClick={() => toPath("/domains")}>
              View More
            </div>
          </div>
          <div className="nfts_domains">
            {namesArr.map((item, index) => {
              return (
                <div className="nft_item" key={index}>
                  <div
                    className="nft_image flex flex-col items-center justify-center"
                    style={{ backgroundImage: `url(./logo_dark.svg)` }}
                  >
                    <div className="name text-xl">Techcode.MXC</div>
                    <div className="monospace font-thin">techcode.mxc</div>
                  </div>
                  <div className="token_id">Techcode.MXC</div>
                  <div className="token_name">MXC</div>
                  <div className="ENSTags">
                    <div className="badge">Name</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div> */}
      </Container>
    </div>
  )
}
