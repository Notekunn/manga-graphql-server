import type { Arguments, Context, Prisma } from '../context'
import type { Manga } from '@prisma/client'
import { getCurrentDate, getDayOfWeek, resolvePagingArgs } from '../utils'

export default {
  Query: {
    mangas: (parent: any, args: any, context: Context) => {
      return context.prisma.manga.findMany({})
    },
    manga: (parent: any, args: { slug: string }, context: Context) => {
      return context.prisma.manga.findUnique({
        where: {
          slug: args.slug,
        },
      })
    },
    topManga: async (parent: any, args: { type: 'DATE' | 'WEEK' | 'ALL' }, context: Context) => {
      if (args.type == 'DATE') {
        const data = await context.prisma.viewCount.groupBy({
          _sum: {
            view: true,
          },
          by: ['mangaId'],
          orderBy: {
            _sum: {
              view: 'desc',
            },
          },
          where: {
            date: getCurrentDate(),
          },
          take: 10,
        })

        return data.map((e) => {
          return {
            view: e._sum.view,
            mangaId: e.mangaId,
          }
        })
      }
      if (args.type == 'WEEK') {
        const data = await context.prisma.viewCount.groupBy({
          _sum: {
            view: true,
          },
          by: ['mangaId'],
          orderBy: {
            _sum: {
              view: 'desc',
            },
          },
          where: {
            date: {
              in: getDayOfWeek(),
            },
          },
          take: 10,
        })

        return data.map((e) => {
          return {
            view: e._sum.view,
            mangaId: e.mangaId,
          }
        })
      }
      const data = await context.prisma.viewCount.groupBy({
        _sum: {
          view: true,
        },
        by: ['mangaId'],
        orderBy: {
          _sum: {
            view: 'desc',
          },
        },
        where: {},
        take: 10,
      })

      return data.map((e) => {
        return {
          view: e._sum.view,
          mangaId: e.mangaId,
        }
      })
    },
    followedManga: async (parent: any, args: any, context: Context) => {
      const user = context.user
      if (user == null) return []
      const data = await context.prisma.followedManga.findMany({
        where: {
          userId: user.id,
        },
        include: {
          manga: true,
        },
        orderBy: {
          manga: {
            lastUpdated: 'desc',
          },
        },
        take: 10,
      })
      return data.map((e) => e.manga)
    },
  },
  TopMangaResponse: {
    manga: (parent: { mangaId: number }, args: any, context: Context) => {
      return context.prisma.manga.findUnique({
        where: {
          id: parent.mangaId,
        },
      })
    },
  },
  Manga: {
    artist: (parent: Manga, args: any, context: Context) => {
      return context.prisma.artist.findUnique({
        where: {
          id: parent.artistId,
        },
      })
    },
    groups: async (parent: Manga, args: any, context: Context) => {
      const data = await context.prisma.groupsOnManga.findMany({
        where: {
          mangaId: parent.id,
        },
        include: {
          group: true,
        },
      })
      return data.map((e) => e.group)
    },
    categories: async (parent: Manga, args: any, context: Context) => {
      const data = await context.prisma.categoriesOnManga.findMany({
        where: {
          mangaId: parent.id,
        },
        include: {
          category: true,
        },
      })
      return data.map((e) => e.category)
    },
    chapters: async (parent: Manga, args: any, context: Context) => {
      const pagging = resolvePagingArgs(args)

      const data = await context.prisma.chapter.findMany({
        where: {
          mangaId: parent.id,
        },
        orderBy: {
          id: 'desc',
        },
        ...pagging,
      })
      return data
    },
    lastChapter: async (parent: Manga, args: any, context: Context) => {
      const data = await context.prisma.chapter.findFirst({
        where: {
          mangaId: parent.id,
        },
        orderBy: {
          id: 'desc',
        },
      })
      return data
    },
    isFollowing: async (parent: Manga, args: any, context: Context) => {
      const user = context.user
      if (!user) return false
      const data = await context.prisma.followedManga.findUnique({
        where: {
          userId_mangaId: {
            mangaId: parent.id,
            userId: user.id,
          },
        },
      })
      return data != null
    },
  },
}
