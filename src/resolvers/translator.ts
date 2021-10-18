import type { Context } from '../context'
import type { TranslatorGroup } from '@prisma/client'

export default {
  Query: {
    groups: (parent: any, args: any, context: Context) => {
      return context.prisma.translatorGroup.findMany({})
    },
  },
  TranslatorGroup: {
    members: (parent: TranslatorGroup, args: any, context: Context) => {
      return context.prisma.user.findMany({
        where: {
          translatorGroupId: parent.id,
        },
      })
    },
    manager: (parent: TranslatorGroup, args: any, context: Context) => {
      return context.prisma.user.findFirst({
        where: {
          id: parent.managerId,
        },
      })
    },
  },
}
