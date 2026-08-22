import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = ['Gym', 'Gaming', 'Reading', 'Family Time', 'Walking', 'TV / Movies']

  for (const activityName of categories) {
    await prisma.leisureCategory.upsert({
      where: { activityName },
      update: {},
      create: { activityName },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })