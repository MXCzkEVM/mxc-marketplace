import React, { useState } from "react"
import Aside from "./aside"
import CollectionCard from "./collection-card"

const CollectionMain = (props) => {
  let { cartItems, setCartItems } = props

  const data = props.collectionData
  const items = data.childItems
  return (
    <main>
      {/* <div className="firstnav">
        <div className="leftButton">
          <button className="Item">Items</button>
          <button className="offers">Offers</button>
          <button className="analytics">Analytics</button>
          <button className="activity">Activity</button>
        </div>
      </div> */}
      {/* <div className="secondnav">
        <div className="filter">
          <span class="material-icons">filter_list</span>
          <span>Filter</span>
        </div>
        <span className="results">{data.childItems.length + "  results"}</span>
        <div className="search">
          <button className="material-icons">search</button>
          <input
            className="scrolledholder"
            type="text"
            placeholder="Search by name or trait"
            required
          />
        </div>
        <div className="sort">
          <span>Price Low to High</span>
        </div>
        <div className="display">
          <button className="wiew1">
            <span class="material-icons">format_list_bulleted</span>
          </button>
          <button className="view2">
            <span class="material-icons">grid_on</span>
          </button>
          <button className="view3">
            <span class="material-icons">window</span>
          </button>
          <button className="view4">
            <span class="material-icons">space_dashboard</span>
          </button>
        </div>
      </div> */}
      <div className="cardsection">
        {/* <Aside /> */}
        <div className="items">
          {items.map((item, index) => {
            return (
              <CollectionCard
                key={index}
                item={item}
                setCartItems={setCartItems}
                cartItems={cartItems}
              />
            )
          })}

          {/* <div className="row1">
            {items.slice(0, 3).map((item) => {
              return (
                <CollectionCard
                  item={item}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                />
              )
            })}
          </div>
          <div className="row2">
            {items.slice(3, 6).map((item) => {
              return (
                <CollectionCard
                  item={item}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                />
              )
            })}
          </div> */}
        </div>
      </div>
    </main>
  )
}

export default CollectionMain
