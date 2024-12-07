type Operator = '*' | '+' | '||'

interface Equation {
  result: number
  operands: number[]
  operators: Operator[]
}

const getEquations = async (): Promise<Equation[]> => {
  const input = await Deno.readTextFile('./input.txt')

  const rows = input.split('\n')
  return rows.map((row): Equation => {
    const [result, operands] = row.split(':')
    const parsedOperands = operands.trim().split(' ').map(Number)

    return {
      result: Number(result),
      operands: parsedOperands,
      operators: [],
    }
  })
}

const operatorCombinationsCache = new Map<string, Operator[][]>()
const getCacheKey = (operators: Operator[], count: number) => `${operators.join('-')}-${count}`

const generateOperatorCombinations = (
  operatorsCount: number,
  validOperators: Operator[],
): Operator[][] => {
  const key = getCacheKey(validOperators, operatorsCount)
  const combinationFromCache = operatorCombinationsCache.get(key)
  if (combinationFromCache) {
    return combinationFromCache
  }

  let combinations: Operator[][] = validOperators.map((op) => [op])
  for (let i = 1; i < operatorsCount; i++) {
    const newCombinations: Operator[][] = [[]]

    combinations.forEach((combination) => {
      validOperators.forEach((operator) => {
        newCombinations.push([...combination, operator])
      })
    })

    combinations = newCombinations
  }

  operatorCombinationsCache.set(key, combinations)
  return combinations
}

const isEquationValid = (equation: Equation): boolean => {
  const { result: expectedResult, operands, operators } = equation
  let result = operands[0]

  operators.forEach((operator, index) => {
    const next = operands[index + 1]

    switch (operator) {
      case '+':
        result += next
        break
      case '*':
        result *= next
        break
      case '||':
        result = Number(`${result}${next}`)
        break
      default:
        throw new Error(`Unexpected operator: ${operator}`)
    }
  })

  return expectedResult === result
}

const trySolveEquation = (equation: Equation, operators: Operator[]): boolean => {
  const { result, operands } = equation
  const operatorCount = operands.length - 1

  const operatorCombinations = generateOperatorCombinations(operatorCount, operators)
  let validCombination: Operator[] = []

  const isValid = operatorCombinations.some((combination) => {
    const validationResult = isEquationValid({
      result,
      operands,
      operators: combination,
    })

    if (validationResult) {
      validCombination = [...combination]
    }
    return validationResult
  })

  const humanReadableEquationResult = `${
    isValid
      ? equation.operands.flatMap((operand, index) => [operand, validCombination[index]]).join(' ')
        .trim()
      : equation.operands.join(' ? ')
  } = ${equation.result}`

  console.log(
    'Checking equation:',
    humanReadableEquationResult,
    isValid ? '✅' : '❌',
    ' ',
  )
  return isValid
}

const equations = await getEquations()
console.log('Equations count: ', equations.length)

const part1 = () => {
  const validEquations = equations.filter((eq) => trySolveEquation(eq, ['+', '*']))
  const resultsSum = validEquations.reduce((current, acc) => current + acc.result, 0)

  console.log('Part 1: ', resultsSum)
}

const part2 = () => {
  console.time()
  const validEquations = equations.filter((eq) => trySolveEquation(eq, ['+', '*', '||']))
  const resultsSum = validEquations.reduce((current, acc) => current + acc.result, 0)

  console.log('Part 2: ', resultsSum)
  console.timeEnd()
}

part1()
part2()
