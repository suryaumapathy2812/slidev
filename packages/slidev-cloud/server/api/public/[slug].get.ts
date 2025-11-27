import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Presentation slug required' })
  }

  const presentation = await prisma.presentation.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      slideCount: true,
      theme: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!presentation) {
    throw createError({ statusCode: 404, message: 'Presentation not found' })
  }

  return presentation
})
