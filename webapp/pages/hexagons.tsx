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

export default function Hexagons() {
  const hexsgonsRef = useRef<any[]>([])
  const searchRef = useRef<any[]>([])
  const [currenthexsgons, setCurrentHexsgons] = useState<any[]>([])
  const [loadmore, setLoadMore] = useState(false)
  const [targetLen, setTargetLen] = useState(0)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 30

  useEffect(() => {
    const fetchData = async () => {
      let hexs: any = await getHexagon()
      hexsgonsRef.current = hexs

      setTargetLen(hexs.length)
      let currHexs = getPageData(1)
      setCurrentHexsgons(currHexs)
    }
    fetchData()
  }, [])

  const loadMoreData = async () => {
    setLoadMore(true)

    let newData: any[]
    if (searchTerm.length) {
      newData = getSearchPageData(page + 1)
    } else {
      newData = getPageData(page + 1)
    }

    setCurrentHexsgons((prevData) => {
      return [...prevData, ...newData]
    })
    setPage((prevPage) => prevPage + 1)

    setLoadMore(false)
  }

  const getPageData = (page: number = 1) => {
    const start = (page - 1) * pageSize
    const pageItems = hexsgonsRef.current.slice(start, start + pageSize)
    return pageItems
  }

  const getSearchPageData = (page: number = 1) => {
    const start = (page - 1) * pageSize
    const pageItems = searchRef.current.slice(start, start + pageSize)
    return pageItems
  }

  const executeSearch = () => {
    if (!searchTerm) {
      let currHexs = getPageData(1)
      setTargetLen(hexsgonsRef.current.length)
      setCurrentHexsgons(currHexs)
      setPage(1)
      return
    }
    const filteredData = hexsgonsRef.current.filter((item) =>
      item.tokenId.includes(searchTerm)
    )
    searchRef.current = filteredData
    setTargetLen(filteredData.length)

    let currHexs = getSearchPageData(1)
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
          {currenthexsgons.map((item, index) => {
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
                <div className="token_name">MXC</div>
              </div>
            )
          })}
        </div>

        {currenthexsgons.length && currenthexsgons.length < targetLen ? (
          <div className="loadmore flex_c mt-3">
            <button
              disabled={loadmore}
              onClick={loadMoreData}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
            >
              {loadmore ? (
                <>
                  <FaSpinner className="animate-spin" /> <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>More</span>
                  <FaArrowDown />
                </>
              )}
            </button>
          </div>
        ) : null}
      </Container>
    </div>
  )
}
