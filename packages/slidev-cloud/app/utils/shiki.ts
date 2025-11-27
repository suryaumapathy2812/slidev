import type { Highlighter } from 'shiki'
import { createHighlighter } from 'shiki'

let highlighter: Highlighter | null = null

export async function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['vitesse-dark', 'vitesse-light'],
      langs: [
        'javascript',
        'typescript',
        'vue',
        'vue-html',
        'html',
        'css',
        'json',
        'markdown',
        'python',
        'rust',
        'go',
        'bash',
        'yaml',
        'sql',
        'jsx',
        'tsx',
      ],
    })
  }
  return highlighter
}

export async function highlightCode(
  code: string,
  lang: string,
  theme = 'vitesse-dark',
): Promise<string> {
  const h = await getShikiHighlighter()

  // Check if language is supported
  const loadedLangs = h.getLoadedLanguages()
  if (!loadedLangs.includes(lang as any)) {
    // Try to load the language
    try {
      await h.loadLanguage(lang as any)
    }
    catch {
      // Fall back to plaintext
      lang = 'text'
    }
  }

  try {
    return h.codeToHtml(code, { lang, theme })
  }
  catch {
    // Return escaped code if highlighting fails
    return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
