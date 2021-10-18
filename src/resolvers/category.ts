import type { Context } from '../context'
import type { Category } from '@prisma/client'

export default {
  Query: {
    categories: (parent: any, args: any, context: Context) => {
      return context.prisma.category.findMany({})
    },
  },
  Category: {
    mangas: async (parent: Category, args: any, context: Context) => {
      const data = await context.prisma.categoriesOnManga.findMany({
        where: {
          categoryId: parent.id,
        },
        include: {
          manga: true,
        },
      })
      return data.map((e) => e.manga)
    },
  },
}
