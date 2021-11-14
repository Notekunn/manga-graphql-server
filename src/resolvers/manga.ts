import type { Arguments, Context, OffsetPagination, Prisma } from '../context'
import type { Manga, MangaStatus } from '@prisma/client'
import { getCurrentDate, getDayOfWeek, resolvePagingArgs } from '../utils'

export interface MangaFilter {
  sort?:
    | 'LAST_UPDATE'
    | 'FOLLOW_COUNT'
    | 'COMMENT'
    | 'CHAPTER_COUNT'
    | 'TOP_DAY'
    | 'TOP_WEEK'
    | 'TOP_MONTH'
    | 'TOP_ALL'
    | 'NAME'
  keyword?: string
  status?: MangaStatus
  categories?: string[]
}
export default {
  Query: {
    mangas: (
      parent: any,
      args: { filter?: MangaFilter; pagination?: OffsetPagination },
      context: Context
    ) => {
      const { status, sort, keyword, categories } = args.filter || {}
      const where: Prisma.MangaWhereInput = {}
      if (categories && categories?.length > 0) {
        where.categories = {
          some: {
            category: {
              slug: {
                in: categories,
              },
            },
          },
        }
      }
      if (!!keyword) {
        where.name = {
          contains: keyword,
        }
      }
      if (!!status && (status == 'ONGOING' || status == 'COMPLETED')) {
        where.status = status
      }

      const orderBy: Prisma.MangaOrderByWithRelationInput = {}

      if (!sort || sort === 'LAST_UPDATE') orderBy.lastUpdated = 'desc'
      if (sort === 'CHAPTER_COUNT') {
        orderBy.chapters = {
          _count: 'desc',
        }
      }
      if (sort === 'FOLLOW_COUNT') {
        orderBy.MangaFollower = {
          _count: 'desc',
        }
      }
      if (sort === 'NAME') {
        orderBy.name = 'asc'
      }

      const { page = 1, itemPerPage = 20 } = args.pagination || {}
      return context.prisma.manga.findMany({
        where,
        orderBy,
        distinct: 'id',
        skip: (page - 1) * itemPerPage,
        take: itemPerPage,
      })
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
          order: 'desc',
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
