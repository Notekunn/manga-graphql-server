import type { Context, Prisma, Arguments } from '../context'
import { getCurrentDate } from '../utils'
interface ChapterFilter {}
export default {
  Query: {
    chapters: (_parent: any, args: Arguments, context: Context) => {
      return context.prisma.chapter.findMany({
        where: {},
      })
    },
    chapter: (_parent: any, args: { chapterId: number }, context: Context) => {
      return context.prisma.chapter.findUnique({
        where: {
          id: args.chapterId,
        },
        include: {
          manga: true,
        },
      })
    },
  },
  Mutation: {
    updateView: async (parent: any, args: { chapterId: number }, context: Context) => {
      const { view, chapterId } = await context.prisma.viewCount.upsert({
        where: {
          chapterId_date: {
            chapterId: args.chapterId,
            date: getCurrentDate(),
          },
        },
        create: {
          chapterId: args.chapterId,
          date: getCurrentDate(),
          view: 1,
        },
        update: {
          view: {
            increment: 1, // Tăng thêm 1 view
          },
        },
      })
      // console.log('🚀 ~ file: chapter.ts ~ line 41 ~ updateView: ~ data', data)
      await context.prisma.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
          manga: {
            update: {
              viewCount: {
                increment: 1,
              },
            },
          },
        },
      })
      return view
    },
  },
}
