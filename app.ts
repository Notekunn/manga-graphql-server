import { ApolloServer, gql } from 'apollo-server'
import { Context, context } from './src/context'
import typeDefs from './src/schema/typeDefs'
import resolvers from './src/resolvers'
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }): Context => {
    const token = req.headers.authorization || ''
    return {
      ...context,
      user: token,
    }
  },
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
