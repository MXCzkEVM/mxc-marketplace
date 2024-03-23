
import { BigNumber } from "ethers"
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
export const searchNftAssets = (pageSize: number = 30, page: number = 1, address: string, hexagon?: string) => {
  const skip = (page - 1) * pageSize
  const where = [
    `nftAddress: "${address}"`,
    hexagon && `tokenId: ${BigNumber.from(hexagon).toString()}`
  ]
  const query = [
    'orderDirection: desc',
    'orderBy: price',
    `first: ${pageSize}`,
    `skip: ${skip}`,
    `where: {${where.filter(Boolean)}}`,
  ]
  return gql`
    {
      nftAssets(${query}) {
        id
        nftAddress
        expiredAt
        price
        seller
        tokenId
      }
    }
  `
}