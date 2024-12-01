import { parse } from '@std/csv/parse'

export const readTsvFile = async (path: string, columns: string[]) => {
  const file = await Deno.readTextFile(path)
  return parse(file, { separator: ',', columns: columns })
}
