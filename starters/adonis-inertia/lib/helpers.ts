import { LazyImport } from '#lib/types.js'

export function pick<T, K extends keyof T>(x: T, ...keys: K[]): { [P in K]: T[P] } {
  const res: any = {}
  for (const key of keys) res[key] = x[key]
  return res
}

export function holder<T>(value?: T) {
  return {
    get: () => {
      if (value === undefined) throw new Error('Value is not set!')
      return value
    },
    set: (v: T | undefined) => (value = v),
  }
}

export function unindent(text: string) {
  text = text.trim()
  const lines = text.split('\n')
  let min_indent = Infinity
  for (const line of lines) {
    let indent = 0
    while (indent < line.length && [' ', '\t'].includes(line[indent])) indent++
    min_indent = Math.min(min_indent, indent)
  }
  return lines.map((line) => line.slice(min_indent)).join('\n')
}

export async function await_import<T>(fn: LazyImport<T>): Promise<T> {
  return (await fn()).default
}
