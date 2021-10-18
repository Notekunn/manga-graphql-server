import type { Context } from '../context'
import type { Artist } from '@prisma/client'

export default {
  Query: {
    artists: (parent: any, args: any, context: Context) => {
      return context.prisma.artist.findMany({})
    },
  },
  Artist: {
    mangas: (parent: Artist, args: any, context: Context) => {
      return context.prisma.manga.findMany({
        where: {
          artistId: parent.id,
        },
      })
    },
  },
}
