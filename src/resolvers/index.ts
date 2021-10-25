import mangaResolver from './manga'
import userResolver from './user'
import artistResolver from './artist'
import categoryResolver from './category'
import translatorResolver from './translator'
import chapterResolver from './chapter'
import { mergeDeep } from '../utils'
import { DateTimeResolver } from 'graphql-scalars'
const resolvers = mergeDeep(
  {
    Date: DateTimeResolver,
  },
  mangaResolver,
  userResolver,
  artistResolver,
  categoryResolver,
  translatorResolver,
  chapterResolver
)
export default resolvers
