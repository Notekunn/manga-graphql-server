import type { Context, Prisma } from '../context'
interface ChapterFilter {}
export default {
  Query: {
    chapters: (_parent: any, args: any, context: Context) => {
      return context.prisma.chapter.findMany({
        where: {},
      })
    },
    chapter: (_parent: any, args: Prisma.ChapterWhereUniqueInput, context: Context) => {
      return context.prisma.chapter.findUnique({
        where: args,
        include: {
          manga: true,
        },
      })
    },
  },
}
