import { ref, computed, type Ref } from 'vue'

export function useAyahSelection(versesCount: Ref<number | undefined>) {
  const selectedAyahs = ref<number[]>([])

  const toggleAyah = (ayahNum: number) => {
    const index = selectedAyahs.value.indexOf(ayahNum)
    if (index > -1) {
      selectedAyahs.value.splice(index, 1)
    } else {
      selectedAyahs.value.push(ayahNum)
    }
    selectedAyahs.value.sort((a, b) => a - b)
  }

  const toggleAllAyahs = () => {
    if (!versesCount.value) return
    if (selectedAyahs.value.length === versesCount.value) {
      selectedAyahs.value = []
    } else {
      selectedAyahs.value = Array.from({ length: versesCount.value }, (_, i) => i + 1)
    }
  }

  const clearSelection = () => {
    selectedAyahs.value = []
  }

  const formattedAyahRange = computed((): string => {
    const numbers = selectedAyahs.value
    if (!numbers.length) return ''

    const ranges = []
    let start = numbers[0]!
    let end = numbers[0]!

    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === end + 1) {
        end = numbers[i]!
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`)
        start = numbers[i]!
        end = numbers[i]!
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`)
    return ranges.join(', ')
  })

  return {
    selectedAyahs,
    toggleAyah,
    toggleAllAyahs,
    clearSelection,
    formattedAyahRange,
  }
}
