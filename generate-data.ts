import { getCurrentDate } from './src/utils'
import faker from 'faker'
import { Prisma, PrismaClient } from '@prisma/client'
const COUNT_ARTIST = 10
const COUNT_CATEGORY = 50
const COUNT_USER = 10
const COUNT_MANGA = 10
const COUNT_GROUP = 10
const COUNT_MEMBER_ON_GROUP = 3
function getSlug(title: string): string {
  //Đổi chữ hoa thành chữ thường
  let slug = title.toLowerCase()

  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
  slug = slug.replace(/đ|ð/gi, 'd')
  //Xóa các ký tự đặt biệt
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ''
  )
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/\s+/gi, '-')
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-+/gi, '-')
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@'
  slug = slug.replace(/\@\-|\-\@|\@/gi, '')
  return slug
}
faker.setLocale('vi')
const prisma = new PrismaClient()
async function main() {
  await genArtists(COUNT_ARTIST)
  await genCategories(COUNT_CATEGORY)
  await genUsers(COUNT_USER)
  await genTranslatorGroups(COUNT_GROUP)
  await genMangas(COUNT_MANGA)
}
async function genCategories(n: number) {
  const data: Prisma.CategoryCreateManyInput[] = []
  for (let i = 0; i < n; i++) {
    const name = faker.music.genre()
    const category: Prisma.CategoryCreateManyInput = {
      title: name,
      slug: getSlug(name),
      description: faker.lorem.sentences(2),
    }
    data.push(category)
  }
  await prisma.category.createMany({
    data,
    skipDuplicates: true,
  })
}
async function genArtists(n: number) {
  const data: Prisma.ArtistCreateManyInput[] = []
  for (let i = 0; i < n; i++) {
    const artist: Prisma.ArtistCreateManyInput = {
      name: faker.name.lastName() + ' ' + faker.name.firstName(),
      slug: faker.lorem.slug(),
      avatarURL: faker.image.avatar(),
      about: faker.lorem.sentences(4),
    }
    artist.slug = getSlug(artist.name)
    data.push(artist)
  }
  await prisma.artist.createMany({
    data,
    skipDuplicates: true,
  })
}
async function genUsers(n: number) {
  const data: Prisma.UserCreateManyInput[] = []
  for (let i = 0; i < n; i++) {
    const card = faker.helpers.createCard()
    const user: Prisma.UserCreateManyInput = {
      email: card.email,
      password: faker.internet.password(),
      username: card.username,
      avatarURL: faker.image.avatar(),
      name: card.name,
    }
    faker.setLocale('en')
    user.username = faker.helpers.createCard().username.toLowerCase()
    faker.setLocale('vi')
    data.push(user)
  }
  await prisma.user.createMany({
    data,
    skipDuplicates: true,
  })
}
function randomNumber(a: number, b: number) {
  return Math.floor(Math.random() * (b - a) + a)
}
async function genMangas(n: number) {
  for (let i = 0; i < n; i++) {
    await genManga()
  }
}
async function genManga() {
  let mangaName = faker.lorem.words(randomNumber(3, 8))
  mangaName = mangaName.charAt(0).toUpperCase() + mangaName.slice(1)
  const manga = await prisma.manga.create({
    data: {
      name: mangaName,
      slug: getSlug(mangaName),
      artistId: randomNumber(1, COUNT_ARTIST),
      coverURL: 'http://st.imageinstant.net/data/comics/32/vo-luyen-dinh-phong.jpg',
      releaseYear: String(randomNumber(1997, 2020)),
      description: faker.lorem.paragraph(randomNumber(2, 6)),
    },
  })
  await genMangaCategories(manga.id, randomNumber(3, 5))
  await genChapters(manga.id, randomNumber(4, 10))
}
async function genMangaCategories(mangaId: number, n: number) {
  const data: Prisma.CategoriesOnMangaCreateManyInput[] = []
  for (let i = 0; i < n; i++) {
    const input: Prisma.CategoriesOnMangaCreateManyInput = {
      categoryId: randomNumber(1, COUNT_CATEGORY),
      mangaId,
    }
    data.push(input)
  }
  await prisma.categoriesOnManga.createMany({
    data,
    skipDuplicates: true,
  })
}
function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return [...array]
}
// function pickMany(array: number[], take: number): number[] {
//   const arr = shuffle(array)
//   return arr.filter((a, i) => i < take)
// }

async function genTranslatorGroup(memberCount: number) {
  const trans = await prisma.user.findMany({
    include: {
      GroupMember: true,
    },
  })
  if (trans.length == 0) return
  const sTrans = shuffle(trans)

  const { id } = await prisma.group.create({
    data: {
      name: faker.company.companyName(),
      description: faker.lorem.paragraph(2),
    },
  })
  const data: Prisma.GroupMemberCreateManyInput[] = []
  for (let i = 0; i < Math.min(sTrans.length, memberCount); i++) {
    data.push({
      groupId: id,
      memberId: sTrans[i].id,
      role: i == 0 ? 'MODERATOR' : 'MEMBER',
    })
  }
  await prisma.groupMember.createMany({
    data,
    skipDuplicates: true,
  })
}

async function genTranslatorGroups(n: number) {
  for (let i = 0; i < n; i++) {
    genTranslatorGroup(COUNT_MEMBER_ON_GROUP)
  }
}
async function genChapters(mangaId: number, n: number) {
  for (let i = 0; i < n; i++) {
    await prisma.chapter.create({
      data: {
        chapterName: i + 1 + '',
        ViewCount: {
          create: {
            date: getCurrentDate(),
            mangaId,
            view: randomNumber(10, 100),
          },
        },
        mangaId,
        order: i,
        viewCount: randomNumber(10, 100),
        chapterFullName: faker.lorem.words(randomNumber(3, 8)),
      },
    })
  }
}
// async function genManga
main()
