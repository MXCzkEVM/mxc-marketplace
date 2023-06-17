// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState } from "react"
import Container from "../components/Container/Container"
import { AiOutlineSearch } from "react-icons/ai"

export default function Domains() {
  const arr = Array.from({ length: 24 }, (_, i) => i)

  useEffect(() => {
    const fetchData = async () => {}
    fetchData()
  }, [])

  return (
    <div className="domains_page">
      <Container maxWidth="lg">
        <div className="searchbar">
          <AiOutlineSearch color="#fff" size="20px" />
          <input placeholder="Search" type="text" />
        </div>
        <div className="nfts_domains">
          {arr.map((item, index) => {
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
      </Container>
    </div>
  )
}
