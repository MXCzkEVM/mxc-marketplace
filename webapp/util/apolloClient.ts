// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { graphNode } from '@/const/Network'

const mnsClient = new ApolloClient({
    link: new HttpLink({
        uri: `${graphNode}/subgraphs/name/mnsdomains/mns`,
    }),
    cache: new InMemoryCache(),
});

export default mnsClient;


