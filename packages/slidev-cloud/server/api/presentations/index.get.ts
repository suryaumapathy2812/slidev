import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = event.context.session

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const presentations = await prisma.presentation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      slideCount: true,
      theme: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return presentations
})
