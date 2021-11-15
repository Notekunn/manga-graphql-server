import { ApolloServer, gql } from 'apollo-server'
import { Context, context } from './src/context'
import typeDefs from './src/schema/typeDefs'
import resolvers from './src/resolvers'
import jwt from 'jsonwebtoken'
import { JWTPayload } from './src/utils'
import dotenv from 'dotenv'
dotenv.config()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }): Promise<Context> => {
    const authHeader = req.headers.authorization || ''
    const [, token] = authHeader.split(' ')
    if (!token) return context
    try {
      const payload: JWTPayload = jwt.verify(
        token,
        process.env.SECRET_KEY || 'secret-key'
      ) as JWTPayload
      const { email, username } = payload
      const user = await context.prisma.user.findFirst({
        where: {
          email,
          username,
        },
      })
      if (!user) return context
      return {
        ...context,
        user: user,
      }
    } catch (error) {
      return context
    }
  },
})

// The `listen` method launches a web server.
server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
