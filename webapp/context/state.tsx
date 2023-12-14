import React, { useContext, createContext, useState } from "react"

import {
  useAddress,
  useMetamask,
} from "@thirdweb-dev/react"

const StateContext = createContext({})

// @ts-ignore
export const StateContextProvider = ({ children }) => {
  const address = useAddress()
  const connect = useMetamask()
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        showCartDrawer,
        setShowCartDrawer
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext) as any
