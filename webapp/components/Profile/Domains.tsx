import type { NextPage } from "next"
import React, { useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import { zeroAddress } from "@/const/Local"
import { getMnsDomainWithAddress } from "@/graphql/mns"
import mnsClient from "@/util/apolloClient"
import { FaArrowDown, FaSpinner } from "react-icons/fa"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import { useTranslation } from "react-i18next"

const ProfileHexagons: NextPage = () => {
  const [page, setPage] = useState(1)
  const [currentMns, setCurrentMns] = useState<any[]>([])
  const [hasNext, setHasNext] = useState(true)
  const [loadmore, setLoadMore] = useState(false)
  const pageSize = 30
  const router = useRouter()
  const address = router.query.address || zeroAddress
  const [isLoading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleArray = (result: any) => {
    let domains = result?.data?.domains || []
    domains = domains.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        owner: item.wrappedDomain.owner.id,
      }
    })
    return domains
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await mnsClient.query({
        query: getMnsDomainWithAddress(pageSize, page, address),
      })
      const domains = handleArray(result)
      setHasNext(domains.length == pageSize)
      setCurrentMns(domains)
      setLoading(false)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address])

  const loadMoreData = async () => {
    setLoadMore(true)

    const result = await mnsClient.query({
      query: getMnsDomainWithAddress(pageSize, page, address),
    })
    const newData = handleArray(result)
    setHasNext(newData.length == pageSize)

    setCurrentMns((prevData) => {
      return [...prevData, ...newData]
    })
    setPage((prevPage) => prevPage + 1)

    setLoadMore(false)
  }

  return (
    <div className="pb-5">
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
                <span>{t("More")}</span>
                <FaArrowDown />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileHexagons
