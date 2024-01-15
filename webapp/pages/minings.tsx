import { useContract, useNFTs } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import Container from "@/components/Container/Container"
import MinerCard from "@/components/MinerCard"
import SkeletonList from "@/components/Skeleton/SkeletonList"

export default function MinerPage() {
  const { contract: nftContract } = useContract(CONTRACTS_MAP['MEP1004'], ABI.mep1004)
  const { data: nftLis, isLoading } = useNFTs(nftContract, {
    count: 1000,
    start: 0,
  })

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
      </Container>
    </div>

  )
}