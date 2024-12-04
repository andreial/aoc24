const input = await Deno.readTextFile('./input.txt')

const inputMatrix = input.split('\n').map((r) => r.split(''))

const part1 = () => {
  const searchWord = 'XMAS'.split('')
  const searchWordReversed = searchWord.toReversed()

  const checkHorizontal = (chars: string[], i: number, j: number) =>
    chars.every((letter, index) => inputMatrix[i]?.[j + index] === letter)

  const checkVertical = (chars: string[], i: number, j: number) =>
    chars.every((letter, index) => inputMatrix[i + index]?.[j] === letter)

  const checkDiagonallyLeft = (chars: string[], i: number, j: number) =>
    chars.every((letter, index) => inputMatrix[i + index]?.[j + index] === letter)

  const checkDiagonallyRight = (chars: string[], i: number, j: number) =>
    chars.every((letter, index) => inputMatrix[i + index]?.[j - index] === letter)

  const apparitions = {
    vertical: 0,
    horizontal: 0,
    diagonal: 0,
  }

  for (let i = 0; i < inputMatrix.length; i++) {
    for (let j = 0; j < inputMatrix[i].length; j++) {
      const foundHorizontal = checkHorizontal(searchWord, i, j) ||
        checkHorizontal(searchWordReversed, i, j)
      const foundVertical = checkVertical(searchWord, i, j) ||
        checkVertical(searchWordReversed, i, j)
      const diagonallyLeft = checkDiagonallyLeft(searchWord, i, j)
      const diagonallyRight = checkDiagonallyRight(searchWord, i, j)
      const diagonallyLeftReversed = checkDiagonallyLeft(searchWordReversed, i, j)
      const diagonallyRightReversed = checkDiagonallyRight(searchWordReversed, i, j)

      foundHorizontal && apparitions.horizontal++
      foundVertical && apparitions.vertical++
      diagonallyLeft && apparitions.diagonal++
      diagonallyRight && apparitions.diagonal++
      diagonallyLeftReversed && apparitions.diagonal++
      diagonallyRightReversed && apparitions.diagonal++
    }
  }

  const total = apparitions.horizontal + apparitions.vertical + apparitions.diagonal
  console.log('Part 1: ', { totalApparitions: total })
}

const part2 = () => {
  const searchWord = 'MAS'.split('')
  const searchWordReversed = searchWord.toReversed()

  let xCount = 0
  for (let i = 0; i < inputMatrix.length; i++) {
    for (let j = 0; j < inputMatrix[i].length; j++) {
      const letter = inputMatrix[i][j]

      const checkDiagonallyLeft = (chars: string[], ai: number, aj: number) =>
        chars.every((l, index) => inputMatrix[(ai - 1) + index]?.[(aj - 1) + index] === l)

      const checkDiagonallyRight = (chars: string[], ai: number, aj: number) =>
        chars.every((l, index) => inputMatrix[(ai - 1) + index]?.[(aj + 1) - index] === l)

      if (letter === 'A') {
        const foundWordDiagonallyLeft = checkDiagonallyLeft(searchWord, i, j) ||
          checkDiagonallyLeft(searchWordReversed, i, j)
        const foundWordDiagonallyRight = checkDiagonallyRight(searchWord, i, j) ||
          checkDiagonallyRight(searchWordReversed, i, j)

        if (foundWordDiagonallyLeft && foundWordDiagonallyRight) {
          xCount++
        }
      }
    }
  }

  console.log('Part 2: ', { xCount })
}

part1()
part2()
