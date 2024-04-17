// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState, useRef } from "react"
import Container from "../components/Container/Container"
import { AiOutlineSearch } from "react-icons/ai"
import HexagonLogo from "../components/HexagonLogo"
// import { CHAIN_ID } from "@/const/Network"
// import { ABI } from "@/const/Address"
// import { useNFTs, useContract, useContractRead } from "@thirdweb-dev/react"
import { getHexagon } from "@/const/StorgeUtils"
import { getColorFromH3Id } from "@/util/randomColor"
import { FaArrowDown, FaSpinner } from "react-icons/fa"
import Router, { useRouter } from "next/router"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import { useTranslation } from "react-i18next"
import MoreBtn from "@/components/Button/more"
import { nftClient } from "@/util/apolloClient"
import { searchNftAssets } from "@/graphql/nft"
import { CONTRACTS_MAP } from "@/const/Address"
import { formatEther, hexlify } from "ethers/lib/utils"
import { arange } from '@hairy/utils'
export default function Hexagons() {
  const hexsgonsRef = useRef<any[]>([])
  const searchRef = useRef<any[]>([])
  const [currenthexsgons, setCurrentHexsgons] = useState<any[]>([])
  const [loadmore, setLoadMore] = useState(false)
  const [targetLen, setTargetLen] = useState(0)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 30
  const [isLoading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let currHexs =await getPageData(1)
      setCurrentHexsgons(currHexs)
      setLoading(false)
    }

    fetchData()
  }, [])

  const loadMoreData = async () => {
    setLoadMore(true)

    let newData: any[] = await getPageData(page + 1)

    setCurrentHexsgons((prevData) => {
      return [...prevData, ...newData]
    })
    setPage((prevPage) => prevPage + 1)

    setLoadMore(false)
  }

  const getPageData = async (page: number = 1, search?: string) => {
    const { data } = await nftClient.query({
      query: searchNftAssets(30, page, CONTRACTS_MAP.MEP1002, search)
    })
    const _hexagons = data.nftAssets.map((nft: any) => ({
      ...nft,
      tokenId: hexlify(BigInt(nft.tokenId)),
      owner: nft.seller
    }))
    const hexagons: any[] = []
    _hexagons.forEach((hex:any) => {
      if (!hexagons.some(h => h.tokenId === hex.tokenId))
        hexagons.push(hex)
    });
    return hexagons
  }

  const executeSearch = async () => {
    if (!searchTerm) {
      let currHexs = await getPageData(1)
      setTargetLen(hexsgonsRef.current.length)
      setCurrentHexsgons(currHexs)
      setPage(1)
      return
    }
    let currHexs = await getPageData(1, searchTerm)
    setCurrentHexsgons(currHexs)
    setPage(1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch()
    }
  }

  return (
    <div className="hexagons_page">
      <Container maxWidth="lg">
        <div className="searchbar">
          <AiOutlineSearch onClick={executeSearch} color="#fff" size="20px" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            placeholder="Search by hexaon Id"
            className="mr-2"
          />
        </div>
        <div className="nfts_hexagons">
          {currenthexsgons && !isLoading
            ? currenthexsgons.map((item, index) => {
              return (
                <div
                  className="nft_item"
                  key={item.tokenId}
                  onClick={() => Router.push(`/hexagon/${item.tokenId}`)}
                >
                  <div className="nft_image flex flex-col items-center justify-center">
                    <HexagonLogo fill={getColorFromH3Id(item.tokenId)} />
                  </div>
                  <div className="token_id">{item.tokenId}</div>
                  {item.price === '0' 
                  ?  <div className="token_name">Not for sale</div>
                  : <div className="token_name">{formatEther(item.price)} MXC</div>}
                 
                </div>
              )
            })
            : isLoading && <SkeletonList />}
        </div>

        {!isLoading && currenthexsgons.length >= 30 && <MoreBtn loadmore={loadmore} loadMoreData={loadMoreData} /> }
      </Container>
    </div>
  )
}
