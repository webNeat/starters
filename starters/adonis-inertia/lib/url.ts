import { RouteParam } from '#lib/types.js'

export function url<Path extends string, QueryParam extends string, Param extends string = RouteParam<Path>>(
  path: Path,
  queryParams: QueryParam[] = [],
) {
  const params = path
    .split('/')
    .filter((x) => x.startsWith(':'))
    .map((x) => x.substring(1)) as Param[]
  return {
    path,
    uri: (args: Record<Param, string | number> & Partial<Record<QueryParam, string | number>> = {} as any) => {
      let res: string = path
      for (const param of params) {
        if (args[param] === undefined) throw new Error(`Missing parameter '${param}' in route '${path}'`)
        res = res.replaceAll(':' + param, String(args[param]))
      }
      const query = new URLSearchParams()
      for (const param of queryParams) {
        if (args[param] === undefined) continue
        query.append(param, String(args[param]))
      }
      return query.size ? res + '?' + query.toString() : res
    },
  }
}
