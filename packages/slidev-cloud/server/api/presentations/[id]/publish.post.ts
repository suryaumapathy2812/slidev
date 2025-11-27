import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = event.context.session
  const id = event.context.params?.id

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!id) {
    throw createError({ statusCode: 400, message: 'Presentation ID required' })
  }

  // Verify ownership
  const existing = await prisma.presentation.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Presentation not found' })
  }

  // Toggle publish status
  const presentation = await prisma.presentation.update({
    where: { id },
    data: {
      isPublished: !existing.isPublished,
      updatedAt: new Date(),
    },
  })

  return presentation
})
