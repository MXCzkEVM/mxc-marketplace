import React, { useState } from "react"

const CollectionCard = (props) => {
  const item = props.item
  const [buyNowOpen, setBuyNowOpen] = useState(false)
  let { cartItems, setCartItems } = props

  function handleBuyNowOpen() {
    setBuyNowOpen(true)
  }
  function handleBuyNowClose() {
    setBuyNowOpen(false)
  }
  function handleAdd() {
    setCartItems([...cartItems, item])
    console.log(cartItems)
  }

  return (
    <div
      className="collectioncard"
      onMouseOver={handleBuyNowOpen}
      onMouseOut={handleBuyNowClose}
    >
      <div className="image">
        <img
          src={`https://opensea-client.onrender.com${item.profilePicture}`}
          alt=""
        />
      </div>

      <div className="content">
        <div className="title">
          <span className="name">{item.name}</span>
          <div className="raritylevel">{"#" + item.rarityLevel}</div>
        </div>
        <div className="pricediv">
          <span className="price">{item.price} ETH</span>
        </div>
        <div className="lastsalepricediv">
          <span className="lastsaleprice">
            Last sale:{item.lastSalePrice} ETH
          </span>
        </div>
        {/* {buyNowOpen && (
          <div className="buynow">
            <div className="buynowdiv">
              <span>Buy Now</span>
            </div>
            <div className="cart" onClick={() => handleAdd()}>
              <button className="material-icons">shopping_cart</button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default CollectionCard
