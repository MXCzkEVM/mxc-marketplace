import React, { useState } from "react"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import verifyIcon from "@/assets/verify.svg"
import { RiMore2Fill, RiMarkPenLine, RiDeleteBin6Line } from "react-icons/ri"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"

export default function NFTCard(props: any) {
  let { nft } = props

  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const toDetail = (id: string) => {
    Router.push(`/collection/${id}`)
  }

  return (
    <div
      className="nft_item csp"
      onMouseEnter={() => setIsHovered(true)}
      onClick={() => {
        toDetail(nft.collection)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowMenu(false)
      }}
    >
      {isHovered && (
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
                <Link
                  href={`/collections/${nft.id}`}
                  className="block px-4 py-2 text-gray-800"
                >
                  Edit
                </Link>
              </li>
              <li className="flex items-center hover:bg-gray-100 pl-2">
                <RiDeleteBin6Line className=" text-red-500" />
                <button className="block w-full px-4 py-2 text-left text-red-500">
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

      <div className="content">
        <div className="cover mr-2">
          <Image src={nft.cover} defaultImage={defaultPng.src} alt="" />
        </div>
        <div className="name mt-2 text-xs">{nft.name}</div>
      </div>
    </div>
  )
}
