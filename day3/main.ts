const execMultiplyInstruction = (instruction: string) => {
  const [a, b] = instruction.match(/\d+/g)?.map(Number) ?? []
  if (!a || !b) {
    return 0
  }

  return a * b
}

const input = await Deno.readTextFile('./input.txt')

const part1 = () => {
  const regex = /mul\(\d+,\d+\)/g
  const groups = input.match(regex)

  const sumGroups = groups?.reduce((acc, group) => acc + execMultiplyInstruction(group), 0) ?? 0
  console.log('Part 1: ', { sumGroups })
}

const part2 = () => {
  const regex = /mul\(\d+,\d+\)|don't\(\)|do\(\)/g
  const groups = input.match(regex)

  let lastConditionalInstruction = 'do()'
  let sumValidGroups = 0

  groups?.forEach((group) => {
    if (group === "don't()" || group === 'do()') {
      lastConditionalInstruction = group
    } else if (lastConditionalInstruction === 'do()') {
      sumValidGroups += execMultiplyInstruction(group)
    }
  })

  console.log('Part 2: ', { sumValidGroups })
}

part1()
part2()
