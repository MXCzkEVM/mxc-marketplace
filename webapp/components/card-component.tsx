import React from "react"
import Link from "next/link"
import Router from "next/router"

export default function Card(props: any) {
  let { nft } = props

  const toDetail = (id: string) => {
    Router.push(`/collection/${id}`)
  }

  return (
    <div className="nft_item csp" onClick={() => toDetail(nft._id)}>
      <div
        className="image"
        // style={{
        //   backgroundImage: `url(${nft.coverPhoto})`,
        // }}
      >
        <img src={nft.coverPhoto} alt="" />
      </div>

      <div className="content">
        <div className="contentTop break_ellipsis mb-5">
          <span className="title text-sm ">
            <span>{nft.title} </span>
            <img src={`./verify.svg`} alt="" />
          </span>
        </div>
        <div className="contentBottom flex">
          <div className="left w-1/2">
            <div className="floor">FLOOR</div>
            <div className="price">0.4 ETH</div>
          </div>
          <div className="right w-1/2">
            <div className="floor">CEILING</div>
            <div className="price">0.5 ETH</div>
          </div>
        </div>
      </div>
    </div>
  )
}
