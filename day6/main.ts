const input = await Deno.readTextFile('./input.txt')
const inputMatrix = input.split('\n').map((row) => row.split(''))

interface Position {
  x: number
  y: number
}

interface Guard {
  position: Position
  facing: FacingDirection
}

enum FacingDirection {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

const getNextPosition = (x: number, y: number, facing: FacingDirection) => {
  switch (facing) {
    case FacingDirection.Up:
      return {
        x: x - 1,
        y,
      }
    case FacingDirection.Down:
      return {
        x: x + 1,
        y,
      }
    case FacingDirection.Left:
      return {
        x,
        y: y - 1,
      }
    case FacingDirection.Right:
      return {
        x,
        y: y + 1,
      }
  }
}

const getNextFacingDirection = (facing: FacingDirection) => {
  switch (facing) {
    case FacingDirection.Up:
      return FacingDirection.Right
    case FacingDirection.Down:
      return FacingDirection.Left
    case FacingDirection.Left:
      return FacingDirection.Up
    case FacingDirection.Right:
      return FacingDirection.Down
  }
}

const isGuard = (object: string) => {
  return Object.values(FacingDirection).includes(object as FacingDirection)
}

const isObstruction = (object: string) => {
  return object === '#' || object === 'O'
}

const getVisitedLocations = (startingPosition: Position, map: string[][]) => {
  let guard: Guard | undefined = { position: startingPosition, facing: FacingDirection.Up }

  const guardPositions = new Map<string, Guard>([])
  let isStuckInLoop = false


  while (guard !== undefined && !isStuckInLoop) {
    const getKey = (guard: Guard) => `${guard.facing};${guard.position.x};${guard.position.y}`
    const key = getKey(guard)

    if (guardPositions.has(key)) {
      // we've been here before
      isStuckInLoop = true
      break
    }

    guardPositions.set(key, guard)

    const nextPosition = getNextPosition(
      guard.position.x,
      guard.position.y,
      guard.facing,
    )
    const nextObjectInMap = map[nextPosition.x]?.[nextPosition.y]
    if (!nextObjectInMap) {
      guard = undefined
      break
    }

    if (isObstruction(nextObjectInMap)) {
      // turn right 90 degrees
      guard = {
        ...guard,
        facing: getNextFacingDirection(guard.facing),
      }
    } else {
      // go in the nextPosition
      guard = { facing: guard.facing, position: nextPosition }
    }
  }

  const visitedLocations = guardPositions.values().map((value) => JSON.stringify(value.position))
  const uniqueVisitedLocations = new Set(visitedLocations)

  return {
    isStuckInLoop,
    visitedLocations: [...uniqueVisitedLocations].map((position) => (JSON.parse(position))),
  }
}

const getStartingPosition = (): Position | undefined => {
  for (let x = 1; x <= inputMatrix.length - 1; x++) {
    for (let y = 1; y <= inputMatrix[x].length - 1; y++) {
      const objectAt = inputMatrix[x][y]
      if (isGuard(objectAt)) {
        return { x, y }
      }
    }
  }
}

const startingPosition = getStartingPosition()
if (!startingPosition) {
  throw new Error('Starting position not found!')
}

const { visitedLocations } = getVisitedLocations(startingPosition, [...inputMatrix])

const part1 = () => {
  console.log('Part 1: ', { visitedLocations: visitedLocations.length })
}

const part2 = () => {
  const validPositionsForObstruction = visitedLocations.filter((location) => {
    // can't add obstruction on starting position
    if (location.x === startingPosition.x && location.y === startingPosition.y) {
      return false
    }

    const newInputMatrix = inputMatrix.map((arr) => arr.slice())
    newInputMatrix[location.x][location.y] = 'O'

    const { isStuckInLoop } = getVisitedLocations(startingPosition, newInputMatrix)
    console.log('Trying to add obstruction at: ', location, isStuckInLoop ? '✅' : '❌', ' ')

    return isStuckInLoop
  })

  console.log('Part 2: ', { validPositionsForObstruction: validPositionsForObstruction.length })
}

part1()

console.time('Part 2 took:')
part2()
console.timeEnd('Part 2 took:')
