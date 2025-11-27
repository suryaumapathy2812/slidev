import { onKeyStroke } from '@vueuse/core'

type Navigation = ReturnType<typeof useNavigation>

export function useKeyboardShortcuts(nav: Navigation) {
  const { next, prev, goFirst, goLast } = nav

  // Arrow keys
  onKeyStroke('ArrowRight', () => next())
  onKeyStroke('ArrowLeft', () => prev())
  onKeyStroke('ArrowDown', () => next())
  onKeyStroke('ArrowUp', () => prev())

  // Space bar (with shift for previous)
  onKeyStroke(' ', (e) => {
    e.preventDefault()
    if (e.shiftKey) {
      prev()
    }
    else {
      next()
    }
  })

  // Page keys
  onKeyStroke('PageDown', () => next())
  onKeyStroke('PageUp', () => prev())

  // Home/End
  onKeyStroke('Home', () => goFirst())
  onKeyStroke('End', () => goLast())

  // Number keys for direct navigation (1-9)
  for (let i = 1; i <= 9; i++) {
    onKeyStroke(String(i), () => nav.go(i))
  }
}
