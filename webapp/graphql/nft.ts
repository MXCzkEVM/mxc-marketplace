
import gql from "graphql-tag"

export const searchNftOrders = (address: string, id: string) => {
  return gql`
  {
    marketplaceOrderInfos (where: { assetId: "${id}", nftAddress: "${address}" }){
      assetId
      blockNumber
      blockTimestamp
      buyer
      event
      expiresAt
      nftAddress
      priceInWei
      seller
      totalPrice
      transactionHash
    }
  }
`
}