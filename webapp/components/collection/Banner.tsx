import React, { useState } from "react"
// import { Link } from "react-router-dom";
import Link from "next/link"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"
import defaultlongPng from "@/assets/placeholder_long.png"

const BannerComponent = (props: any) => {
  let dta = props.collectionDta
  const date = new Date(dta.timestamp)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  return (
    <div className="banner">
      <div className="coverPhoto">
        <Image
          src={dta.profile ? dta.profile : defaultlongPng.src}
          defaultImage={defaultlongPng.src}
          alt=""
        />
        <div className="profilePhoto">
          <div className="square">
            <div className="square-content">
              <Image
                src={dta.cover ? dta.cover : defaultPng.src}
                defaultImage={defaultPng.src}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="information">
        <div className="name">
          <div className="namesection">
            <span className="name">{dta.name}</span>
          </div>
        </div>
        <div className="article">
          <span className="by"></span>
          <span className="articlename"> By {dta.creator}</span>
        </div>
        <div className="statisticalDataTop">
          <div className="items">
            <span className="text">Items</span>
            <span>{props.nfts || 0}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="created">
            <span className="text">Created</span>
            <span>{formattedDate}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="earnings">
            <span className="text">Creator earnings</span>
            <span>{dta.royaltiesCutPerMillion / 100 + "%"}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="chain">
            <span className="text">Chain</span>
            <span>MXC</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="category">
            <span className="text"> Category</span>
            <span>{dta.category}</span>
          </div>
        </div>
        <div className="introduce">
          <div className={`introduceword`}>
            <p>
              {dta.description}
              {/* <Link href={""}>Wannsee </Link>
              <Link href={""}>Wiew drop details</Link> */}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerComponent
