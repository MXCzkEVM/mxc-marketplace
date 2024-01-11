import { zeroAddress } from "@/const/Local"
import { useContract, useNFTs, useTotalCount } from "@thirdweb-dev/react"
import { useState } from "react"
import { ABI } from "@/const/Address"
import Container from "@/components/Container/Container"

export default function MinerPage() {
  const [page, setPage] = useState(1)
  const [nfts, setNFTS] = useState<any>([])

  const { contract: nftContract } = useContract(zeroAddress, ABI.collection)
  const { data: nftCounter } = useTotalCount(nftContract)
  const { data: nftLis, isLoading } = useNFTs(nftContract, {
    count: 30,
    start: (page - 1) * 30,
  })

  function onPageChange(n: number) {
    n !== page && setPage(n)
  }
  return (
    <div className="miner_list">
      <Container maxWidth="lg">
        -
      </Container>
    </div>
  )
}