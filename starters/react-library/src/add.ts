export function add(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { it, expect } = await import('vitest')

  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
}
