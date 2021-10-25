import type { Context, Prisma, Arguments } from '../context'
interface ChapterFilter {}
export default {
  Query: {
    chapters: (_parent: any, args: Arguments, context: Context) => {
      return context.prisma.chapter.findMany({
        where: {},
      })
    },
    chapter: (_parent: any, args: { chapterName: string; mangaId: number }, context: Context) => {
      return context.prisma.chapter.findUnique({
        where: {
          chapterName_mangaId: {
            chapterName: args.chapterName,
            mangaId: args.mangaId,
          },
        },
        include: {
          manga: true,
        },
      })
    },
  },
}
