import type { Context } from '../context'
import type { Group, User } from '@prisma/client'

export default {
  Query: {
    groups: (parent: any, args: any, context: Context) => {
      return context.prisma.group.findMany({})
    },
  },
  Group: {
    members: async (parent: Group, args: any, context: Context): Promise<User[]> => {
      // console.log('🚀 ~ file: translator.ts ~ line 12 ~ members: ~ parent', parent)

      const data = await context.prisma.groupMember.findMany({
        where: {
          groupId: parent.id,
        },
        include: {
          member: true,
        },
      })
      return data.map((e) => e.member)
    },
    manager: async (parent: Group, args: any, context: Context): Promise<User | undefined> => {
      const data = await context.prisma.groupMember.findFirst({
        where: {
          role: 'MODERATOR',
          groupId: parent.id,
        },
        include: {
          member: true,
        },
      })
      return data?.member
    },
  },
}
