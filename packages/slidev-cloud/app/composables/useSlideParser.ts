import type { SlidevMarkdown } from '@slidev/parser'
import { parseSync } from '@slidev/parser'

export interface ParsedSlide {
  index: number
  content: string
  frontmatter: Record<string, any>
  note?: string
  title?: string
  layout: string
  slots: Record<string, string>
}

export function useSlideParser() {
  /**
   * Parse ::slotname:: syntax to extract slot content
   * Based on Slidev's slot-sugar transform
   */
  const parseSlots = (content: string): Record<string, string> => {
    const slots: Record<string, string> = { default: '' }
    const lines = content.split('\n')
    let currentSlot = 'default'

    for (const line of lines) {
      // Match ::slotname:: syntax
      const slotMatch = line.match(/^::\s*([\w.\-:]+)\s*::$/)
      if (slotMatch) {
        currentSlot = slotMatch[1]
        if (!slots[currentSlot]) {
          slots[currentSlot] = ''
        }
      }
      else {
        slots[currentSlot] = `${(slots[currentSlot] || '') + line}\n`
      }
    }

    // Trim all slot content
    for (const key of Object.keys(slots)) {
      slots[key] = slots[key].trim()
    }

    return slots
  }

  /**
   * Parse markdown content into structured slide data
   */
  const parseMarkdown = (markdown: string): ParsedSlide[] => {
    try {
      const result: SlidevMarkdown = parseSync(markdown, 'slides.md')

      return result.slides.map((slide, index) => ({
        index,
        content: slide.content,
        frontmatter: slide.frontmatter || {},
        note: slide.note,
        title: slide.title,
        layout: slide.frontmatter?.layout || (index === 0 ? 'cover' : 'default'),
        slots: parseSlots(slide.content),
      }))
    }
    catch {
      return []
    }
  }

  /**
   * Get default presentation content
   */
  const getDefaultContent = (): string => {
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

  return {
    parseMarkdown,
    parseSlots,
    getDefaultContent,
  }
}
