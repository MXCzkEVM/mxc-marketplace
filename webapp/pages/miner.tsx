import { zeroAddress } from "@/const/Local"
import { useContract, useNFTs, useTotalCount } from "@thirdweb-dev/react"
import { useState } from "react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import Container from "@/components/Container/Container"
import MinerCard from "@/components/MinerCard"
import { Pagination } from "antd"
import SkeletonList from "@/components/Skeleton/SkeletonList"

export default function MinerPage() {
  const [page, setPage] = useState(1)
  const [nfts, setNFTS] = useState<any>([])

  const { contract: nftContract } = useContract(CONTRACTS_MAP['MEP1004'], ABI.mep1004)
  const { data: nftCounter } = useTotalCount(nftContract)
  let nftCounterNumber = nftCounter ? parseInt(nftCounter?.toString()) : 0
  const { data: nftLis, isLoading } = useNFTs(nftContract, {
    count: 20,
    start: (page - 1) * 20,
  })

  function onPageChange(n: number) {
    n !== page && setPage(n)
  }
  return (
    <div className="collection_detail">
      <Container maxWidth="lg">
        <div className="feature mb-10">
          <h1>MEP1004 Equipment List</h1>
        </div>
        {isLoading && <SkeletonList />}
        <div className="nfts_feature">
          {nftLis?.map(item => <MinerCard item={item} key={item.metadata.id} />)}
        </div>
        {!isLoading && (
          <div className="pagination flex_c">
            <Pagination
              pageSize={20}
              current={page}
              onChange={onPageChange}
              total={nftCounterNumber}
              showSizeChanger={false}
            />
          </div>
        )}
      </Container>
    </div>

  )
}