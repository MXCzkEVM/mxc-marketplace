// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState } from "react"
import Container from "../components/Container/Container"
import { AiOutlineSearch } from "react-icons/ai"
import HexagonLogo from "../components/HexagonLogo"

export default function Hexagons() {
  const arr = Array.from({ length: 24 }, (_, i) => i)

  useEffect(() => {
    const fetchData = async () => {}
    fetchData()
  }, [])

  const getColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="hexagons_page">
      <Container maxWidth="lg">
        <div className="searchbar">
          <AiOutlineSearch color="#fff" size="20px" />
          <input placeholder="Search" type="text" />
        </div>
        <div className="nfts_hexagons">
          {arr.map((item, index) => {
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
      </Container>
    </div>
  )
}
