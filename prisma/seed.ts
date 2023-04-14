import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const users: Prisma.UserCreateInput[] = [
  {
    username: "Binar",
    exercises: {
      create: [
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
      ],
    },
  },
  {
    username: "Andi",
    exercises: {
      create: [
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
      ],
    },
  },
  {
    username: "Ucup",
    exercises: {
      create: [
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
        { description: "Foo", duration: 60 },
      ],
    },
  },
]

async function main() {
  await prisma.$connect()
  console.log("Connected to database")
  await prisma.exercise.deleteMany()
  await prisma.user.deleteMany()
  console.log("Start seeding...")
  for (const u of users) {
    const user = await prisma.user.create({ data: u })
    console.log(`Created user with id: ${user.id}`)
  }
  const Users = await prisma.user.findMany({
    include: { exercises: { take: 2 } },
  })
  for (const user of Users) {
    console.log(user)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
