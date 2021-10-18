import type { Context } from '../context'
import type { User } from '@prisma/client'

export default {
  Query: {
    users: (parent: any, args: any, context: Context) => {
      return context.prisma.user.findMany({})
    },
  },

  User: {
    translatorGroup: (parent: User, args: any, context: Context) => {
      if (parent.translatorGroupId == null) return null
      return context.prisma.translatorGroup.findUnique({
        where: {
          id: parent.translatorGroupId,
        },
      })
    },
    managerGroup: (parent: User, args: any, context: Context) => {
      return context.prisma.translatorGroup.findUnique({
        where: {
          managerId: parent.id,
        },
      })
    },
  },
}
