import { readTsvFile } from '../utils/file.ts'
import { asc } from '../utils/sort.ts'

const input = await readTsvFile('./input.csv', ['left', 'right'])

const left = input.map((r) => Number(r.left)).toSorted(asc)
const right = input.map((r) => Number(r.right)).toSorted(asc)

const distances = left.map((leftNum, index) => {
  const rightNum = right[index]

  return Math.abs(leftNum - rightNum)
})
const totalDistance = distances.reduce((acc, x) => acc + x, 0)

const similarities = left.map((leftNum) => {
  const apparitions = right.filter((rightNum) => rightNum === leftNum).length

  return leftNum * apparitions
})
const totalSimilarities = similarities.reduce((acc, x) => acc + x, 0)

console.log({ totalDistance, totalSimilarities })
