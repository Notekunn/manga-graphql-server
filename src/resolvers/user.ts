import type { Context, Arguments, Prisma } from '../context'
import { Group, prisma, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWTPayload, resolvePagingArgs } from '../utils'

const { SECRET_KEY = 'secret-key' } = process.env
interface AuthInput {
  username: string
  password: string
}
const comparePassword = function (password: string, passwd: string): boolean {
  return !!passwd && passwd == password
  // return bcrypt.compareSync(passwd, password)
}
export default {
  Query: {
    users: async (parent: any, args: Arguments, context: Context) => {
      const pagging = resolvePagingArgs<Prisma.UserFindManyArgs>(args)
      const data = await context.prisma.user.findMany({
        ...pagging,
      })
      return data
    },
    profile: async (parent: any, args: any, context: Context) => {
      return context.user
    },
  },
  Mutation: {
    login: async (parent: any, args: { userInput: AuthInput }, context: Context) => {
      const {
        userInput: { username, password },
      } = args
      const user = await context.prisma.user.findFirst({
        where: {
          OR: [
            {
              email: username,
            },
            {
              username,
            },
          ],
        },
      })
      if (!user || !comparePassword(user.password, user.password)) {
        throw new Error('Tên tài khoản hoặc mật khẩu không đúng')
      }
      const payload: JWTPayload = {
        email: user.email,
        username: user.username,
      }
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '7d',
      })
      const tokenExpiration = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      return { token, tokenExpiration, userId: user.id }
    },
  },
  User: {
    groups: async (parent: User, args: any, context: Context) => {
      console.log('🚀 ~ file: user.ts ~ line 13 ~ groups: ~ parent', parent)
      const data = await context.prisma.groupMember.findMany({
        where: {
          memberId: parent.id,
        },
        include: {
          group: true,
        },
      })
      return data.map((e) => e)
    },
  },
}
