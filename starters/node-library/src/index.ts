export function greet(name: string): string {
  return `Hello, ${name}!`
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest

  describe('greet', () => {
    it('should greet a person by name', () => {
      expect(greet('World')).toBe('Hello, World!')
    })
  })
}
