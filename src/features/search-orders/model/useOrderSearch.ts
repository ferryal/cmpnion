import { useCallback, useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function useOrderSearch(initialValue: string, onSearch: (q: string) => void) {
  const [inputValue, setInputValue] = useState(initialValue)
  const debouncedValue = useDebounce(inputValue)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  const handleChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  const clear = useCallback(() => {
    setInputValue('')
  }, [])

  return { inputValue, handleChange, clear }
}
