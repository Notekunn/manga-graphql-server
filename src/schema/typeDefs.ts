import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar Date
  enum UserRole {
    MEMBER
    MODERATOR
    ADMINISTRATOR
  }

  enum GroupRole {
    MEMBER
    MODERATOR
  }

  enum MangaStatus {
    CANCELLED
    DROPPED
    ONGOING
    COMPLETED
  }

  enum TopMangaType {
    DATE
    WEEK
    ALL
  }

  enum MangaSortType {
    NAME
    LAST_UPDATE
    FOLLOW_COUNT
    COMMENT
    CHAPTER_COUNT
    TOP_DAY
    TOP_WEEK
    TOP_MONTH
    TOP_ALL
  }

  type User {
    id: ID!
    username: String!
    name: String
    email: String!
    # password: String!
    avatarURL: String
    role: UserRole!
    groups: [GroupUser!]!
  }
  type Artist {
    id: ID!
    name: String!
    slug: String!
    about: String
    avatarURL: String
    mangas: [Manga!]!
  }
  type Category {
    id: ID!
    title: String!
    slug: String!
    description: String
    mangas: [Manga!]!
  }
  type Group {
    id: ID!
    name: String!
    description: String
    manager: User!
    members: [User!]!
    mangas: [Manga!]!
  }
  type GroupUser {
    group: Group!
    role: GroupRole!
    participantAt: Date!
  }
  type Manga {
    id: ID!
    name: String!
    slug: String!
    otherName: String
    description: String
    status: MangaStatus!
    coverURL: String
    releaseYear: String
    lastUpdated: Date!
    viewCount: Int!
    artist: Artist
    categories: [Category!]!
    groups: [Group!]!
    chapters(cursor: Int, limit: Int): [Chapter!]!
    lastChapter: Chapter
    subscribed: Boolean!
  }
  type Chapter {
    id: ID!
    manga: Manga!
    chapterName: String!
    chapterFullName: String
    viewCount: Int!
    content: String
    lastUpdated: Date!
    prevChapter: Chapter
    nextChapter: Chapter
  }

  type Query {
    mangas(filter: MangaFilter, pagination: OffsetPagination): [Manga!]!
    manga(slug: String!): Manga
    artists: [Artist!]!
    users(cursor: Int, limit: Int): [User!]!
    categories: [Category!]!
    groups: [Group!]!
    chapters: [Chapter!]!
    chapter(id: Int!): Chapter

    topManga(type: TopMangaType): [TopMangaResponse!]!
    subscribedManga: [Manga!]!
    profile: User!
  }

  input MangaFilter {
    sort: MangaSortType
    keyword: String
    status: MangaStatus
    categories: [String!]
  }

  input OffsetPagination {
    page: Int!
    itemPerPage: Int!
  }
  input Pagination {
    cursor: Int
    limit: Int!
  }

  input AuthInput {
    username: String!
    password: String!
  }
  type AuthResponse {
    userId: Int!
    token: String!
    tokenExpiration: Date!
  }
  type Mutation {
    updateView(chapterId: Int!): Int!
    login(userInput: AuthInput!): AuthResponse!
    subscribeManga(mangaId: Int!, unsubscribe: Boolean): Boolean!
  }
  type TopMangaResponse {
    manga: Manga!
    view: Int!
  }
`
export default typeDefs
