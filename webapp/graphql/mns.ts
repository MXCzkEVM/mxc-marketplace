
import gql from "graphql-tag"

export const getMnsDomain = (pageSize: number = 30, page: number = 1) => {
  const skip = (page - 1) * pageSize
  return gql`
    {
      domains(
        first: ${pageSize}, 
        skip: ${skip}, 
        orderBy: createdAt, 
        orderDirection: desc, 
        where: {
          id_gt: 0, 
          name_not: null
        }
      ) {
        id
        name
        wrappedDomain {
          owner {
            id
          }
          name
        }
      }
    }
  `
}

export const getMnsDomainWithAddress = (pageSize: number = 30, page: number = 1, address: any) => {
  const skip = (page - 1) * pageSize
  if (!address) {
    return getMnsDomain(pageSize, page)
  }
  address = address.toLowerCase()
  return gql`
    {
      domains(
        first: ${pageSize}, 
        skip: ${skip}, 
        orderBy: createdAt, 
        orderDirection: desc, 
        where: {
          id_gt: 0, 
          name_not: null,
          wrappedDomain_ : {
            owner: "${address}"
          }
        }
      ) {
        id
        name
        wrappedDomain {
          owner {
            id
          }
          name
        }
      }
    }
  `
}

export const searchMnsDomain = (pageSize: number = 30, page: number = 1, nameQuery: string) => {
  const skip = (page - 1) * pageSize
  return gql`
    {
      domains(
        first: ${pageSize}, 
        skip: ${skip}, 
        orderBy: createdAt, 
        orderDirection: desc, 
        where: {
          id_gt: 0, 
          name_not: null,
          name_contains: "${nameQuery}"
        }
      ) {
        id
        name
        wrappedDomain {
          owner {
            id
          }
          name
        }
      }
    }
`
}