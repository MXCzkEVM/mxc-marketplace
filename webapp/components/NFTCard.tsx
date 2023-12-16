import React, { useState } from "react"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import verifyIcon from "@/assets/verify.svg"
import { RiMore2Fill, RiMarkPenLine, RiDeleteBin6Line } from "react-icons/ri"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"
import { CHAIN_ID } from "@/const/Network"
import { useAddress } from "@thirdweb-dev/react"
import { toast } from "react-toastify"
import { zeroAddress } from "@/const/Local"
import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css
import { useTranslation } from "react-i18next"

import ApiClient from "@/util/request"
const api = new ApiClient("/")

export default function NFTCard(props: any) {
  let { nft, setUpdate, update } = props

  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const address = props.user || zeroAddress
  const my_address = useAddress()
  const isOwner = address !== zeroAddress && my_address == address
  const { t } = useTranslation()

  const submitDel = () => {
    const web3 = require("web3")
    confirmAlert({
      title: t("Confirm to delete this collection"),
      message: t("Are you sure to do this"),
      buttons: [
        {
          label: "Confilm",
          onClick: async () => {
            const signedMessage = await window.ethereum.request({
              method: "personal_sign",
              params: [web3.utils.utf8ToHex(nft.collection), address],
            })

            let res: any = await api.post("/api/del-collection", {
              chainId: CHAIN_ID,
              collection: nft.collection,
              signedMessage,
            })

            if (res.status) {
              toast.success(t("NFT Collection delete successfully"))
              setUpdate(!update)
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    })
  }

  return (
    <div
      className="nft_item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowMenu(false)
      }}
    >
      {isHovered && isOwner && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <RiMore2Fill
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="usn text-2xl cursor-pointer bg-white p-1 rounded-full shadow hover:shadow-lg"
          />
          {showMenu && (
            <ul className="absolute right-0 w-40 py-2 mt-6 bg-white border rounded-md shadow-xl">
              <li className="flex items-center hover:bg-gray-100 pl-2">
                <RiMarkPenLine />
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    Router.push(
                      `/collection/edit?collection_id=${nft.collection}`
                    )
                  }}
                  className="block px-4 py-2 text-gray-800"
                >
                  Edit
                </div>
              </li>
              <li className="flex items-center hover:bg-gray-100 pl-2">
                <RiDeleteBin6Line className=" text-red-500" />
                <button
                  onClick={submitDel}
                  className="block w-full px-4 py-2 text-left text-red-500"
                >
                  Delete
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      <div className="image">
        <Image src={nft.profile} defaultImage={defaultPng.src} alt="" />
      </div>

      <div
        className="content csp"
        onClick={() => {
          Router.push(`/collection/${nft.url || nft.collection}`)
        }}
      >
        <div className="cover mr-2">
          <Image src={nft.cover} defaultImage={defaultPng.src} alt="" />
        </div>
        <div className="name mt-2 text-xs">{nft.name}</div>
      </div>
    </div>
  )
}
