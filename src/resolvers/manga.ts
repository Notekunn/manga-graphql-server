import type { Arguments, Context, Prisma } from '../context'
import type { Manga } from '@prisma/client'
import { resolvePagingArgs } from '../utils'

export default {
  Query: {
    mangas: (parent: any, args: any, context: Context) => {
      return context.prisma.manga.findMany({})
    },
    manga: (parent: any, args: { id: number }, context: Context) => {
      return context.prisma.manga.findUnique({
        where: {
          id: args.id,
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
          lastUpdated: 'asc',
        },
        ...pagging,
      })
      return data
    },
  },
}
