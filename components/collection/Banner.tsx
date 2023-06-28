import React, { useState } from "react"
// import { Link } from "react-router-dom";
import Link from "next/link"
import Image from "@/components/Image"
import defaultPng from "@/assets/placeholder.png"

const BannerComponent = (props: any) => {
  let dta = props.collectionDta
  // const date = new Date(data.createDate)
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
  // const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="banner">
      <div className="coverPhoto">
        <Image src={dta.profile} defaultImage={defaultPng.src} alt="" />
      </div>
      <div className="profilePhoto">
        <Image src={dta.cover} defaultImage={defaultPng.src} alt="" />
      </div>
      <div className="information">
        <div className="name">
          <div className="namesection">
            <span className="name">{dta.name}</span>
          </div>
        </div>
        <div className="article">
          <span className="by"></span>
          <span className="articlename"> By {dta.owner}</span>
        </div>
        <div className="statisticalDataTop">
          <div className="items">
            <span className="text">Items</span>
            <span>-</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="created">
            <span className="text">Created</span>
            <span>-</span>
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
              <Link href={""}>Wannsee </Link>
              <Link href={""}>Wiew drop details</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerComponent
