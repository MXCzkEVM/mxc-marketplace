import { zeroAddress } from "@/const/Local"
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import MinerCard from "./MinerCard"
import SkeletonList from "./Skeleton/SkeletonList"

export default function UserMinedNFTs(props: any) {
  const address = props.user || zeroAddress
  const { contract: nftContract } = useContract(CONTRACTS_MAP['MEP1004'], ABI.mep1004)
  const { data: nftList, isLoading } = useOwnedNFTs(nftContract, address)

  return (
    !isLoading ? <>
      {nftList &&
        nftList.map((item: any, index: number) => {
          return (
            <MinerCard
              key={index}
              item={item}
            />
          )
        })}
    </> : <SkeletonList />
  )
}