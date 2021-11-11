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
    isFollowing: Boolean!
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
    mangas: [Manga!]!
    manga(slug: String!): Manga
    artists: [Artist!]!
    users(cursor: Int, limit: Int): [User!]!
    categories: [Category!]!
    groups: [Group!]!
    chapters: [Chapter!]!
    chapter(id: Int!): Chapter

    topManga(type: TopMangaType): [TopMangaResponse!]!
    followedManga: [Manga!]!
    profile: User!
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
    followManga(mangaId: Int!, unfollow: Boolean): Boolean!
  }
  type TopMangaResponse {
    manga: Manga!
    view: Int!
  }
  enum TopMangaType {
    DATE
    WEEK
    ALL
  }
  type GroupUser {
    group: Group!
    role: GroupRole!
    participantAt: Date!
  }
`
export default typeDefs
