import React, { useState } from "react"
// import { Link } from "react-router-dom";
import Link from "next/link"

const BannerComponent = (props) => {
  let data = props.collectionData

  const floorPriceHandler = function () {
    let allLastSalePrice = []
    for (let i = 0; i < data.childItems.length; i++) {
      allLastSalePrice.push(data.childItems[i].lastSalePrice)
    }
    let floorPrice = allLastSalePrice[0]
    for (let i = 0; i < allLastSalePrice.length; i++) {
      if (allLastSalePrice[i] < floorPrice) {
        floorPrice = allLastSalePrice[i]
      } else {
        continue
      }
    }
    return floorPrice
  }

  const bestofferHandler = function () {
    let bestoffer = 0
    for (let i = 0; i < data.childItems.length; i++) {
      if (data.childItems[i].lastSalePrice > bestoffer) {
        bestoffer = data.childItems[i].lastSalePrice
      } else {
        continue
      }
    }
    return bestoffer
  }

  const totalHandler = function () {
    let total = 0
    for (let i = 0; i < data.childItems.length; i++) {
      total += data.childItems[i].lastSalePrice
    }
    return total
  }

  const listedHandler = function () {
    let listed = 0
    for (let i = 0; i < data.childItems.length; i++) {
      if (data.childItems[i].listed) {
        listed++
      } else {
        continue
      }
    }
    return listed / data.childItems.length
  }

  const date = new Date(data.createDate)
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

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  console.log(data)

  return (
    <banner className="banner">
      <div className="coverPhoto">
        <img
          src={`https://opensea-client.onrender.com${data.coverPhoto}`}
          alt=""
        />
      </div>
      <div className="profilePhoto">
        <img
          src={`https://opensea-client.onrender.com${data.profilePicture}`}
          alt=""
        />
      </div>
      <div className="information">
        <div className="name">
          <div className="namesection">
            <span className="name">{data.title}</span>
            {/* <span className="material-icons">verified</span> */}
          </div>
          {/* <div className="iconlist">
            <div className="icon etherscan">
              <img src="../media/etherscan.svg" alt="" />
            </div>
            <div className="icon globel">
              <span class="material-icons">language</span>
            </div>
            <div className="icon twitter">
              <i className="fa-brands fa-twitter"></i>
            </div>
            <div className="separator"></div>
            <div className="icon star">
              <i className="fa-regular fa-star"></i>
            </div>
            <div className="icon share">
              <span class="material-icons">share</span>
            </div>
            <div className="icon more">
              <span class="material-icons">more_horiz</span>
            </div>
          </div> */}
        </div>
        <div className="article">
          <span className="by"> By </span>
          <span className="articlename"> {data.owner}</span>
          {/* <span className="material-icons">verified</span> */}
        </div>
        <div className="statisticalDataTop">
          {/* <div className="state"> </div>
          <span className="mint">Minting now</span> */}
          <div className="items">
            <span className="text">Items</span>
            <span>{data.childItems.length}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="created">
            <span className="text">Created</span>
            <span>{formattedDate}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="earnings">
            <span className="text">Creator earnings</span>
            <span>{data.earnings + "%"}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="chain">
            <span className="text">Chain</span>
            <span>{data.chain}</span>
          </div>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <div className="category">
            <span className="text"> Category</span>
            <span>{data.category}</span>
          </div>
        </div>
        <div className="introduce">
          <div className={`introduceword ${isOpen ? "openIntroduce" : ""}`}>
            <p>
              {data.description}
              <Link href={"#"}>OpenSea Pro</Link>
              <Link href={"#"}>Wiew drop details</Link>
            </p>
          </div>

          {/* <button className="seemore" onClick={toggle}>
            <span className="more">See more</span>
            <span className="material-icons">expand_more</span>
          </button> */}
        </div>
        <div className="statisticalDatabottom">
          <div className="firstdiv">
            <div className="total">
              <span className="number">{totalHandler() + "ETH"}</span>
              <span className="text"> total volume</span>
            </div>
            <div className="floorPrice">
              <span className="number">{floorPriceHandler() + "ETH"}</span>
              <span className="text">floor price</span>
            </div>
            <div className="bestoffer">
              <span className="number">{bestofferHandler() + "WETH"}</span>
              <span className="text">best offer</span>
            </div>
          </div>
          <div className="seconddiv">
            <div className="listed">
              <span className="number">{listedHandler() + "%"}</span>
              <span className="text">listed</span>
            </div>
            <div className="owners">
              <span className="number">{data.nftOwner}</span>
              <span className="text">owners</span>
            </div>
            <div className="uniqueowners">
              <span className="number">{data.uniqNFTOwner + "%"}</span>
              <span className="text">unique owners</span>
            </div>
          </div>
        </div>
      </div>
    </banner>
  )
}

export default BannerComponent
