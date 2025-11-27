import { parseSync } from '@slidev/parser'
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

  const body = await readBody(event)
  const { title, content } = body

  // Verify ownership
  const existing = await prisma.presentation.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Presentation not found' })
  }

  // Parse to update slide count if content changed
  let slideCount = existing.slideCount
  if (content && content !== existing.content) {
    const parsed = parseSync(content, 'slides.md')
    slideCount = parsed.slides.length
  }

  const presentation = await prisma.presentation.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content, slideCount }),
      updatedAt: new Date(),
    },
  })

  return presentation
})
