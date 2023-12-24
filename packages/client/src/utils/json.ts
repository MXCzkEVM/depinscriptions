export function stringify(o: any) {
  return `[${Object.keys(o).map(k => `${k}:${o[k]}`)}]`
}

export function parse(s: string) {
  s = s.replace('[', '')
  s = s.replace(']', '')
  const o: any = {}
  for (const kv of s.split(',')) {
    const [k, v] = kv.split(':')
    o[k] = v
  }
  return o
}
