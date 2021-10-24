import type { Context } from '../context'
import type { Group, User } from '@prisma/client'

export default {
  Query: {
    users: (parent: any, args: any, context: Context) => {
      return context.prisma.user.findMany({})
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
