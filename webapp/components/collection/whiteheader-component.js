import React, { useState } from "react"
// import { Link } from "react-router-dom";
import Link from "next/link"

import Cart from "./cart"

const WhiteHeaderComponent = (props) => {
  //處理header下拉選單
  const [dropsOpen, setDropsOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  let [cartOpen, setCartOpen] = useState(false)
  let { cartItems, setCartItems, collectionData } = props

  function handleDropsOpen() {
    setDropsOpen(true)
  }
  function handleDropsClose() {
    setDropsOpen(false)
  }

  function handleStatsOpen() {
    setStatsOpen(true)
  }
  function handleStatsClose() {
    setStatsOpen(false)
  }
  function handleCartOpen() {
    setCartOpen(true)
  }
  function handleCartClose() {
    setCartOpen(false)
  }

  return (
    <header className="whiteheader">
      <div className="block1">
        {/* <Link className="logo" href={`/`}>
          <img src={"../media/logoblack.png"} alt="logo" />
        </Link> */}
        <div className="separator"></div>
        <ul>
          <li onMouseOver={handleDropsOpen}>
            <div>Drops</div>
            {dropsOpen && (
              <div
                className="dropdown-menu__content"
                onMouseOver={handleDropsOpen}
                onMouseOut={handleDropsClose}
              >
                <ul>
                  <li>
                    <a href="#">Featured</a>
                  </li>
                  <li>
                    <a href="#">Learn more</a>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li onMouseOver={handleStatsOpen}>
            <div to="#">Stats</div>
            {statsOpen && (
              <div
                className="dropdown-menu__content"
                onMouseOver={handleStatsOpen}
                onMouseOut={handleStatsClose}
              >
                <ul>
                  <li>
                    <a href="#">Rankings</a>
                  </li>
                  <li>
                    <a href="#">Activity</a>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>

      <div className="search">
        <button className="material-icons">search</button>
        <input
          className="scrolledholder"
          type="text"
          placeholder="Search items, collections, and accounts"
          required
        />
        <button className="slash">/</button>
      </div>
      <div className="walletandaccount">
        <div className="wallet">
          <button className="material-icons">wallet</button>
          <span>Connect Wallet</span>
        </div>
        <div className="account">
          <button className="material-icons">account_circle</button>
        </div>
      </div>
      <div className="cart" onClick={handleCartOpen}>
        {cartItems.length > 0 && (
          <div className="number">
            <span>{cartItems.length}</span>{" "}
          </div>
        )}

        <button className="material-icons">shopping_cart</button>
      </div>
      {cartOpen && (
        <Cart
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          setCartItems={setCartItems}
          cartItems={cartItems}
          collectionData={collectionData}
        />
      )}
    </header>
  )
}

export default WhiteHeaderComponent
