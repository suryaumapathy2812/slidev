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

  const presentation = await prisma.presentation.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!presentation) {
    throw createError({ statusCode: 404, message: 'Presentation not found' })
  }

  return presentation
})
