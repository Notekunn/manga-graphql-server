import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user: User | null
}
export const context: Context = {
  prisma,
  user: null,
}

export { Prisma } from '@prisma/client'

export interface Pagination {
  cursor?: number
  limit?: number
}

export type Arguments<T = {}> = T & Pagination

export interface OffsetPagination {
  page: number
  itemPerPage: number
}
