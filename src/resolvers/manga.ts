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
    translatorGroups: async (parent: Manga, args: any, context: Context) => {
      const data = await context.prisma.translatorGroupOnManga.findMany({
        where: {
          mangaId: parent.id,
        },
        include: {
          translatorGroup: true,
        },
      })
      return data.map((e) => e.translatorGroup)
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
  },
}
