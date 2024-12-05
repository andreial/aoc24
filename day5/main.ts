const input = await Deno.readTextFile('./input.txt')

const [rawOrderingRules, rawUpdates] = input.split('\n\n')
const orderingRules = rawOrderingRules.split('\n')
const updates = rawUpdates.split('\n').map((rawUpdate) => rawUpdate.split(',').map(Number))

const rules = orderingRules.map((rule) => {
  const [a, b] = rule.split('|').map(Number)
  return {
    a,
    b,
  }
})

const getPageNumbersExpectedBefore = (pageNumber: number) =>
  rules.filter(({ b }) => b === pageNumber).map(({ a }) => a)

// a must be preceding b
const validateUpdate = (pageUpdates: number[]) => {
  const isValidUpdate = pageUpdates.every((pageUpdate, index) => {
    if (index === 0) {
      return true
    }

    const previousPages = pageUpdates.slice(0, index)
    const expectedBefore = getPageNumbersExpectedBefore(pageUpdate)

    return previousPages.every((pageNumber) => {
      return expectedBefore.includes(pageNumber)
    })
  })

  console.log(isValidUpdate ? '✅' : '❌', ' ', pageUpdates)

  return isValidUpdate
}

const reorderUpdate = (pageUpdates: number[]) => {
  if (validateUpdate(pageUpdates)) {
    return pageUpdates
  }

  return pageUpdates.toSorted((updateA, updateB) => {
    const expectingBeforeA = getPageNumbersExpectedBefore(updateA)

    return expectingBeforeA.includes(updateB) ? 1 : -1
  })
}

const getMiddleSum = (pageUpdates: number[][]) => {
  let middleSum = 0
  pageUpdates.forEach((update) => {
    const middle = update.at(update.length / 2)
    if (middle) {
      middleSum += middle
    } else {
      console.log('Invalid middle: ', middle)
    }
  })

  return middleSum
}

const part1 = () => {
  const validUpdates = updates.filter(validateUpdate)
  const middleSum = getMiddleSum(validUpdates)

  console.log('Part 1: ', { middleSum })
}

const part2 = () => {
  const invalidUpdates = updates.filter((update) => !validateUpdate(update))

  const reorderedUpdates = invalidUpdates.map(reorderUpdate)
  const middleSum = getMiddleSum(reorderedUpdates)

  console.log('Part 2: ', { middleSum })
}

part1()
part2()
