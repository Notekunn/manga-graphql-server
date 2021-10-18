import mangaResolver from './manga'
import userResolver from './user'
import artistResolver from './artist'
import categoryResolver from './category'
import translatorResolver from './translator'
import { mergeDeep } from '../utils'
const resolvers = mergeDeep(
  {},
  mangaResolver,
  userResolver,
  artistResolver,
  categoryResolver,
  translatorResolver
)
export default resolvers
