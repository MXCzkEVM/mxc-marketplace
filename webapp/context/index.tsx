import React, { useContext, createContext } from "react"

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"

const StateContext = createContext({})

// @ts-ignore
export const StateContextProvider = ({ children }) => {
  const address = useAddress()
  const connect = useMetamask()

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
