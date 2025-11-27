import { parseSync } from '@slidev/parser'
import { nanoid } from 'nanoid'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = event.context.session

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Please sign in first',
      data: { session },
    })
  }

  const body = await readBody(event)
  const { title, content } = body

  // Generate unique slug
  const slug = nanoid(10)

  // Default content if not provided
  const slideContent = content || getDefaultContent()

  // Parse to get slide count
  const parsed = parseSync(slideContent, 'slides.md')

  const presentation = await prisma.presentation.create({
    data: {
      title: title || 'Untitled Presentation',
      slug,
      content: slideContent,
      slideCount: parsed.slides.length,
      userId: session.user.id,
    },
  })

  return presentation
})

function getDefaultContent(): string {
  return `---
layout: cover
---

# Welcome to Slidev Cloud

Your presentation starts here

---

# Slide 2

- Point 1
- Point 2
- Point 3

---
layout: center
---

# Thank You!
`
}
