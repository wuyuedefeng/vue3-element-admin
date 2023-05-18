export function trimQuery(query: Record<string, any>) {
  const newQuery: Record<string, any> = {}
  for (const key in query) {
    if ([undefined, null, ''].indexOf(query[key]) === -1) {
      newQuery[key] = query[key]
    }
  }
  return newQuery
}
