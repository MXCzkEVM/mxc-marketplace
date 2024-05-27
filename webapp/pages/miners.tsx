import { useContract, useNFTs, useTotalCount } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import Container from "@/components/Container/Container"
import MinerCard from "@/components/MinerCard"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import { useEffect, useState } from "react"
import { Pagination } from "antd"
import { getThirdWebNFTList } from "@/util/getNFT"

export default function MinerPage() {
  const { contract: nftContract } = useContract(CONTRACTS_MAP['MEP1004'], ABI.mep1004)
  const [page, setPage] = useState(1)
  const [nfts, setNFTS] = useState<any>([])

  const { data: nftLis, isLoading } = useNFTs(nftContract, {
    count: 100,
    start: (page - 1) * 100,
  })
  const { data: nftCounter } = useTotalCount(nftContract)
  let nftCounterNumber = nftCounter ? parseInt(nftCounter?.toString()) : 0

  const onChange = (getPage: number) => {
    if (getPage == page) {
      return
    }
    setPage(getPage)
  }

  useEffect(() => setNFTS(getThirdWebNFTList(nftLis)), [nftLis])

  return (
    <div className="collection_detail">
      <Container maxWidth="lg">
        <div className="feature mb-10">
          <h1>MEP1004 Equipment List</h1>
        </div>
        {isLoading && <SkeletonList />}
        <div className="nfts_feature">
          {nfts?.map((item:any) => <MinerCard item={item} key={item.metadata.id} />)}
        </div>
        {!isLoading && (
            <div className="pagination flex_c">
              <Pagination
                pageSize={20}
                current={page}
                onChange={onChange}
                total={nftCounterNumber}
                showSizeChanger={false}
              />
            </div>
          )}
      </Container>
    </div>

  )
}