import moment from 'moment-timezone'
const TIME_ZONE = 'Asia/Ho_Chi_Minh'

interface StringObject {
  [key: string]: any
}
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: StringObject | undefined) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: StringObject, ...sources: StringObject[]): StringObject {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

interface PaginationArg {
  cursor?: {
    id?: number
  }
  take?: number
  skip?: number
}

export const resolvePagingArgs = <T extends PaginationArg>(input: {
  cursor?: number
  limit?: number
}): T => {
  const { cursor, limit } = input
  const args = {} as T
  if (cursor) {
    args.cursor = {
      id: cursor,
    }
    args.skip = 1
  }
  if (limit && limit > 0) args.take = limit
  return args
}

export const getCurrentDate = (): string => {
  return moment.tz(TIME_ZONE).format('DD/MM/YYYY')
}

export const getCurrentDateTime = (): Date => {
  return new Date()
}
