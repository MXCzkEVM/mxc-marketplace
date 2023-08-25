// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState, useRef } from "react"
import Container from "../components/Container/Container"
import { AiOutlineSearch } from "react-icons/ai"
import { getMnsDomain, searchMnsDomain } from "@/graphql/mns"
import mnsClient from "@/util/apolloClient"
import { FaArrowDown, FaSpinner } from "react-icons/fa"
import Router from "next/router"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import MoreBtn from "@/components/Button/more"

export default function Domains() {
  // const arr = Array.from({ length: 24 }, (_, i) => i)
  const [page, setPage] = useState(1)
  const [currentMns, setCurrentMns] = useState<any[]>([])
  const [hasNext, setHasNext] = useState(true)
  const [loadmore, setLoadMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 30
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await mnsClient.query({
        query: getMnsDomain(pageSize, page),
      })
      const domains = result?.data?.domains || []
      setHasNext(domains.length == pageSize)
      setCurrentMns(domains)
      setLoading(false)
    }
    fetchData()
  }, [])

  const loadMoreData = async () => {
    setLoadMore(true)

    let newData: any[]
    if (searchTerm.length) {
      const result = await mnsClient.query({
        query: getMnsDomain(pageSize, page + 1),
      })
      newData = result?.data?.domains || []
    } else {
      const result = await mnsClient.query({
        query: getMnsDomain(pageSize, page + 1),
      })
      newData = result?.data?.domains || []
      setHasNext(newData.length == pageSize)
    }

    setCurrentMns((prevData) => {
      return [...prevData, ...newData]
    })
    setPage((prevPage) => prevPage + 1)

    setLoadMore(false)
  }

  const executeSearch = async () => {
    if (!searchTerm) {
      const result = await mnsClient.query({
        query: getMnsDomain(pageSize, page),
      })
      const domains = result?.data?.domains || []
      setHasNext(domains.length == pageSize)
      setCurrentMns(domains)
      setPage(1)
      return
    }

    const result = await mnsClient.query({
      query: searchMnsDomain(pageSize, page, searchTerm),
    })
    const domains = result?.data?.domains || []
    setHasNext(domains.length == pageSize)
    setCurrentMns(domains)
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
    <div className="domains_page">
      <Container maxWidth="lg">
        <div className="searchbar">
          <AiOutlineSearch onClick={executeSearch} color="#fff" size="20px" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            placeholder="Search by domain"
            className="mr-2"
          />
        </div>
        <div className="nfts_domains">
          {currentMns.length && !isLoading
            ? currentMns.map((item: any, index: number) => {
                return (
                  <div
                    className="nft_item"
                    key={index}
                    onClick={() => Router.push(`/domain/${item.name}`)}
                  >
                    <div
                      className="nft_image flex flex-col items-center justify-center"
                      style={{ backgroundImage: `url(/logo_dark.svg)` }}
                    >
                      <div className="name text-xl break_ellipsis">
                        {item.name.toUpperCase()}
                      </div>
                      <div className="monospace font-thin break_ellipsis">
                        {item.name.toLowerCase()}
                      </div>
                    </div>
                    <div className="token_id">{item.name.toUpperCase()}</div>
                    <div className="token_name">MXC</div>
                    <div className="ENSTags">
                      <div className="badge">Name</div>
                    </div>
                  </div>
                )
              })
            : isLoading && <SkeletonList />}
        </div>
        {hasNext && !isLoading && currentMns.length && (
          <MoreBtn loadmore={loadmore} loadMoreData={loadMoreData} />
        )}
      </Container>
    </div>
  )
}
