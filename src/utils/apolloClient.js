import ApolloClient from "apollo-boost";

const createApolloClient = () => {
    return new ApolloClient({
        uri: 'http://192.168.1.28:5001/graphql'
    })
}

export default createApolloClient