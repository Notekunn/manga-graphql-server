import type { Context, Prisma, Arguments } from '../context'
import { getCurrentDate } from '../utils'
interface ChapterFilter {
  slug: string
  chapterName: string
}
export default {
  Query: {
    chapters: (_parent: any, args: Arguments, context: Context) => {
      return context.prisma.chapter.findMany({
        where: {},
      })
    },
    chapter: (_parent: any, args: ChapterFilter, context: Context) => {
      return context.prisma.chapter.findFirst({
        where: {
          chapterName: args.chapterName,
          manga: {
            slug: args.slug,
          },
        },
        include: {
          manga: true,
        },
      })
    },
  },
  Mutation: {
    updateView: async (parent: any, args: { chapterId: number }, context: Context) => {
      const { manga } = await context.prisma.chapter.update({
        where: {
          id: args.chapterId,
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
        include: {
          manga: true,
        },
      })
      const { view } = await context.prisma.viewCount.upsert({
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
          mangaId: manga.id,
        },
        update: {
          view: {
            increment: 1, // Tăng thêm 1 view
          },
        },
      })
      // console.log('🚀 ~ file: chapter.ts ~ line 41 ~ updateView: ~ data', data)

      return view
    },
  },
}
