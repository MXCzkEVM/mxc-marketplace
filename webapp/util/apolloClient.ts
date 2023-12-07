// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { graphNode } from '@/const/Network'


export const mnsClient = new ApolloClient({
    link: new HttpLink({
        uri: `${graphNode}/subgraphs/name/mnsdomains/mns`,
    }),
    cache: new InMemoryCache(),
});

export const nftClient = new ApolloClient({
  link: new HttpLink({
    uri: `${graphNode}/subgraphs/name/nft-mxc`,
  }),
  cache: new InMemoryCache(),
})

export default mnsClient;


