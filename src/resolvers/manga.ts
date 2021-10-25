import type { Context } from '../context'
import type { Manga } from '@prisma/client'

export default {
  Query: {
    mangas: (parent: any, args: any, context: Context) => {
      return context.prisma.manga.findMany({})
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
      const data = await context.prisma.chapter.findMany({
        where: {
          mangaId: parent.id,
        },
      })
      return data
    },
  },
}
