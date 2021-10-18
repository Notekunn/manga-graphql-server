import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user: any
}
export const context: Context = {
  prisma,
  user: null,
}
