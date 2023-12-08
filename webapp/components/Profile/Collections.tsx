import type { NextPage } from "next"
import Router, { useRouter } from "next/router"
import { useAddress } from "@thirdweb-dev/react"
import { zeroAddress } from "@/const/Local"
import React, { useState, useEffect } from "react"
import NFTCard from "@/components/NFTCard"
import { CHAIN_ID } from "@/const/Network"
import ApiClient from "@/util/request"
import { getCollectList } from "@/util/getNFT"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import { useTranslation } from "react-i18next"
import { signIn } from "next-auth/react"
import { toast } from "react-toastify"
import { Modal } from 'antd'
import IconX from './IconX'
import MoreButton from "../Button/more"
import IconQuestion from "./IconQuestion"
const api = new ApiClient("/")

const ProfileCollections: NextPage = () => {
  const router = useRouter()
  const address = router.query.address || zeroAddress
  const my_address = useAddress() || zeroAddress
  const isOwner = address !== zeroAddress && my_address == address
  const [isLoading, setLoading] = useState(false)
  const [userCollections, setUserCollections] = useState<any>([])
  const [showTwitterAuth, setShowTwitterAuth] = useState(true)
  const [update, setUpdate] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let Collections: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
        creator: address,
      })
      let userCollections = Collections?.collections || []
      userCollections = await getCollectList(userCollections)
      setUserCollections(userCollections)
      setLoading(false)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address, update])

  async function createAnItem() {
    // await signIn('twitter')
    setShowTwitterAuth(true)
    // Router.push("/asset/create")
  }

  return (
    <>
      <Modal open={showTwitterAuth} footer={false} onCancel={() => setShowTwitterAuth(false)}>
        <div className="flex items-center gap-2">
          <span>Enhance Trust in Your NFTs</span>
          <a className="cursor-pointer" href="https://doc.mxc.com/docs/Designs/XSD" target="_blank">
            <IconQuestion />
          </a>
        </div>
        <div className="mt-4 font-normal">To elevate the credibility of MXC NFTs and incorporate location proofs, we invite you to authenticate your Twitter ID during the NFT issuance. This step adds a layer of trust to your listings.</div>
        <div className="flex justify-end gap-3 mt-5">
          <button className="bg-[rgb(64,68,79)] text-sm w-20 py-2 px-3 rounded-md">Skip</button>
          <button className="bg-[#1D9BF0] text-sm mib-w-20 py-2 px-3 rounded-md flex items-center gap-1" onClick={() => signIn('twitter')}>
            <span>Authenticate</span>
            <IconX />
          </button>
        </div>
      </Modal>
      {isOwner ? (
        <div className="btns mb-3 flexbox">
          <button
            onClick={() => Router.push("/collection/create")}
            className="create_btn mr-2"
          >
            {t("Create a collection")}
          </button>
          <button
            onClick={createAnItem}
            className="create_btn"
          >
            {t("Create an item")}
          </button>
        </div>
      ) : null}

      <div className="feature mb-10">
        <div className="nfts_collection">
          {isLoading ? (
            <SkeletonList />
          ) : (
            (userCollections.length &&
              (userCollections as any).map((nft: any, index: number) => (
                <NFTCard
                  nft={nft}
                  key={index}
                  user={router.query.address}
                  setUpdate={setUpdate}
                  update={update}
                />
              ))) ||
            ""
          )}
        </div>
      </div>
    </>
  )
}

export default ProfileCollections
