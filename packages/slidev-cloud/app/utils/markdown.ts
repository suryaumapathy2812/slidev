import MarkdownIt from 'markdown-it'
import { highlightCode } from './shiki'

let markdownRenderer: MarkdownIt | null = null

export function getMarkdownRenderer(): MarkdownIt {
  if (!markdownRenderer) {
    markdownRenderer = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })

    // Add target="_blank" to external links
    const defaultRender = markdownRenderer.renderer.rules.link_open
      || function (tokens, idx, options, _env, self) {
        return self.renderToken(tokens, idx, options)
      }

    markdownRenderer.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const href = tokens[idx].attrGet('href')
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        tokens[idx].attrSet('target', '_blank')
        tokens[idx].attrSet('rel', 'noopener noreferrer')
      }
      return defaultRender(tokens, idx, options, env, self)
    }
  }

  return markdownRenderer
}

/**
 * Render markdown to HTML with syntax highlighting
 */
export async function renderMarkdown(content: string): Promise<string> {
  const md = getMarkdownRenderer()
  let html = md.render(content)

  // Find and highlight code blocks
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g
  const matches = [...html.matchAll(codeBlockRegex)]

  for (const match of matches) {
    const [fullMatch, lang, code] = match
    const decodedCode = decodeHtmlEntities(code)
    const highlighted = await highlightCode(decodedCode, lang)
    html = html.replace(fullMatch, highlighted)
  }

  return html
}

/**
 * Render markdown synchronously (without code highlighting)
 */
export function renderMarkdownSync(content: string): string {
  const md = getMarkdownRenderer()
  return md.render(content)
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
}
