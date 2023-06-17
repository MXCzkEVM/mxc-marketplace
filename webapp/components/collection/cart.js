import React, { useState, useEffect } from "react"

const Cart = (props) => {
  let { cartItems, setCartItems, cartOpen, setCartOpen } = props
  let data = props.collectionData

  useEffect(() => {
    console.log(cartItems)
  }, cartItems)

  const [trashCan, setTrashCan] = useState(false)

  function handleTrashCan() {
    setTrashCan(true)
  }
  function handleDefault() {
    setTrashCan(false)
  }

  function handleCartClose() {
    setCartOpen(false)
  }

  const handleDeleteItem = (index) => {
    const newCartItems = [...cartItems]
    newCartItems.splice(index, 1)
    setCartItems(newCartItems)
  }

  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  console.log(cartOpen)
  return (
    <div className="blackdiv">
      <div className={`cartdiv ${isAnimated ? "animate" : ""}`}>
        <div className="cartheader">
          <span className="yourcart">
            Your cart
            <span className="material-icons info">info</span>
          </span>
          <span className="material-icons close" onClick={handleCartClose}>
            close
          </span>
        </div>
        <hr className="hr1" />

        <div className="cartbody">
          {cartItems.length > 0 ? (
            <div className="cartmain">
              <div className="maintitle">
                <span>{cartItems.length} items</span>
                <button>Clear all</button>
              </div>
              {cartItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="cartitem"
                    onMouseOver={handleTrashCan}
                    onMouseLeave={handleDefault}
                  >
                    <div className="img">
                      <img src={item.profilePicture} alt="item" />
                    </div>

                    <div className="iteminfo">
                      <span className="itemname">{item.name}</span>
                      <span className="itemtitle">{data.title}</span>
                      <span className="earnings">{data.earnings + "%"}</span>
                    </div>
                    {trashCan ? (
                      <span
                        class="material-icons trashcan"
                        onClick={() => handleDeleteItem(index)}
                      >
                        delete_outline
                      </span>
                    ) : (
                      <div className="price">{item.price + " ETH"}</div>
                    )}
                  </div>
                )
              })}
              <hr className="hr2" />
              <div className="totalprice">
                <span className="totalprice">Total price</span>
                <span className="price">
                  <span className="ehtprice">
                    {cartItems.reduce((total, item) => total + item.price, 0)}{" "}
                    ETH
                  </span>
                  <span className="usprice">
                    {"$" +
                      cartItems.reduce((total, item) => total + item.price, 0) *
                        1.5}
                  </span>
                </span>
              </div>
              <div className="choosewallet">
                <span>Send to a different wallet</span>
                <span className="material-icons">expand_more</span>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <span>Add items to get started.</span>
            </div>
          )}
          <button className={cartItems ? "darkcomplete" : "lightcomplete"}>
            Complete purchase
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
