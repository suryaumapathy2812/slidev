export function useNavigation(totalSlides: Ref<number> | ComputedRef<number>) {
  const currentSlide = ref(1)
  const navDirection = ref(0) // -1 = prev, 0 = none, 1 = next

  const hasNext = computed(() => currentSlide.value < totalSlides.value)
  const hasPrev = computed(() => currentSlide.value > 1)

  const next = () => {
    if (hasNext.value) {
      navDirection.value = 1
      currentSlide.value++
    }
  }

  const prev = () => {
    if (hasPrev.value) {
      navDirection.value = -1
      currentSlide.value--
    }
  }

  const go = (slideNo: number) => {
    const targetSlide = Math.max(1, Math.min(slideNo, totalSlides.value))
    navDirection.value = targetSlide - currentSlide.value
    currentSlide.value = targetSlide
  }

  const goFirst = () => go(1)
  const goLast = () => go(totalSlides.value)

  // Reset direction after navigation
  watch(currentSlide, () => {
    setTimeout(() => {
      navDirection.value = 0
    }, 300)
  })

  return {
    currentSlide,
    navDirection,
    hasNext,
    hasPrev,
    next,
    prev,
    go,
    goFirst,
    goLast,
  }
}
