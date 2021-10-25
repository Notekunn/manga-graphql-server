import type { Context, Arguments, Prisma } from '../context'
import type { Group, User } from '@prisma/client'
import { resolvePagingArgs } from '../utils'

export default {
  Query: {
    users: async (parent: any, args: Arguments, context: Context) => {
      const pagging = resolvePagingArgs<Prisma.UserFindManyArgs>(args)
      const data = await context.prisma.user.findMany({
        ...pagging,
      })
      return data
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
