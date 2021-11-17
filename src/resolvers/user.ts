import type { Context, Arguments, Prisma } from '../context'
import { Group, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWTPayload, resolvePagingArgs } from '../utils'

const { SECRET_KEY = 'secret-key' } = process.env
interface AuthInput {
  username: string
  password: string
}
interface FollowInput {
  mangaId: number
  unsubscribe?: boolean
}
const comparePassword = function (password: string, passwd: string): boolean {
  // return !!passwd && passwd == password
  return bcrypt.compareSync(passwd, password)
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
      if (!user || !comparePassword(user.password, password)) {
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
    subscribeManga: async (parent: any, args: FollowInput, context: Context) => {
      // Trả về boolean xem trạng thái hiện tại đang follow hay không
      // Nếu đang follow trả về true
      const user = context.user
      if (!user) throw new Error(`Bạn cần đăng nhập để theo dõi`)
      const { mangaId, unsubscribe } = args
      // Nếu hủy subscribe
      if (!!unsubscribe) {
        await context.prisma.followedManga.deleteMany({
          where: {
            mangaId,
            userId: user.id,
          },
        })
        return false
      } else {
        // Nếu follow
        await context.prisma.followedManga.upsert({
          create: {
            mangaId,
            userId: user.id,
          },
          update: {},
          where: {
            userId_mangaId: {
              mangaId,
              userId: user.id,
            },
          },
        })
        return true
      }
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
