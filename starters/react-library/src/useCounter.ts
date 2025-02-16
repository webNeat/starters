import React from 'react'

export function useCounter(initialValue: number) {
  const [value, setValue] = React.useState(initialValue)
  const increment = () => setValue(value + 1)
  const decrement = () => setValue(value - 1)
  return { value, increment, decrement }
}

if (import.meta.vitest) {
  const { it, expect, describe } = await import('vitest')
  const { renderHook, act } = await import('@testing-library/react')

  describe('useCounter', () => {
    it('initializes with the given value', () => {
      const { result } = renderHook(() => useCounter(5))
      expect(result.current.value).toBe(5)
    })

    it('increments the counter', () => {
      const { result } = renderHook(() => useCounter(0))
      act(() => {
        result.current.increment()
      })
      expect(result.current.value).toBe(1)
    })

    it('decrements the counter', () => {
      const { result } = renderHook(() => useCounter(0))
      act(() => {
        result.current.decrement()
      })
      expect(result.current.value).toBe(-1)
    })
  })
}
