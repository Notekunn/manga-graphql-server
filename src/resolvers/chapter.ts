import type { Context, Prisma, Arguments } from '../context'
import { Chapter } from '@prisma/client'
import { getCurrentDate } from '../utils'
interface ChapterFilter {
  id: number
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
          id: args.id,
        },
        include: {
          manga: true,
        },
      })
    },
  },
  Chapter: {
    prevChapter: (_parent: Chapter, args: any, context: Context) => {
      return context.prisma.chapter.findFirst({
        where: {
          mangaId: _parent.mangaId,
        },
        cursor: {
          id: _parent.id,
        },
        skip: 1,
        take: -1,
      })
    },
    nextChapter: (_parent: Chapter, args: any, context: Context) => {
      return context.prisma.chapter.findFirst({
        where: {
          mangaId: _parent.mangaId,
        },
        cursor: {
          id: _parent.id,
        },
        skip: 1,
        take: 2,
      })
    },
    isFollowing: async (_parent: Chapter, args: any, context: Context) => {
      const user = context.user
      if (!user) return false
      const data = await context.prisma.followedManga.findUnique({
        where: {
          userId_mangaId: {
            mangaId: _parent.mangaId,
            userId: user.id,
          },
        },
      })
      return data !== null
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
