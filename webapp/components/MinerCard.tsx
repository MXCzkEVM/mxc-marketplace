import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { ethers } from "ethers"
import Router from "next/router"

interface MinerCardProps {
  item: any
}
function MinerCard(props: MinerCardProps) {

  const { contract: mkpContract } = useContract(
    CONTRACTS_MAP.MARKETPLACE,
    ABI.marketplace
  )
  const { data: mkp_current_info } = useContractRead(
    mkpContract, "orderByAssetId",
    [CONTRACTS_MAP.MEP1004, props.item.metadata.id]
  )
  const { data: mkp_latest_info } = useContractRead(
    mkpContract, "assertPrice",
    [CONTRACTS_MAP.MEP1004, props.item.metadata.id]
  )

  return (
    <div className="nft_item csp" onClick={() => Router.push(`/miner/${props.item.metadata.id}`)}>
      <div className="image">
        <Image src="https://wannsee-mining.matchx.io/_next/image?url=%2Fassets%2Fm2pro-200.webp&w=256&q=75" defaultImage={defaultPng.src} alt="" />
      </div>
      <div className="content" style={{ background: 'rgb(18, 18, 18, 0.1)', padding: '15px' }}>
        <div className="flex justify-between">
          <span>MEP1004M2PRO</span>
          <span>#{props.item.metadata.id}</span>
        </div>
        <div>
          <div className="flex text-sm mt-1">
            {!mkp_current_info || mkp_current_info.price.eq(0) ? (
              "Not for sale"
            ) : (
              <>{ethers.utils.formatEther(mkp_current_info?.price)} MXC</>
            )}
          </div>
          <div className="lastsalepricediv">
            <span className="lastsaleprice">
              Last sale:{" "}
              {mkp_latest_info && !mkp_latest_info.price.eq(0)
                ? `${ethers.utils.formatEther(mkp_latest_info.price)} MXC`
                : "-"}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinerCard