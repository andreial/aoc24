import { parse } from '@std/csv/parse'

const file = await Deno.readTextFile('./input.csv')
const input = parse(file, { separator: ' ' })

const isOrdered = (report: number[], direction: 'asc' | 'dsc') =>
  report.every((level, index): boolean => {
    if (index === 0) {
      return true
    }
    return direction === 'asc' ? level >= report[index - 1] : level <= report[index - 1]
  })

const isOrderedAndMatchingDifference = (report: number[]) => {
  const matchesDifference = report.every((level, index): boolean => {
    if (index === 0) {
      return true
    }

    const difference = Math.abs(level - report[index - 1])
    return difference >= 1 && difference <= 3
  })

  return matchesDifference &&
    (isOrdered(report, 'asc') || isOrdered(report, 'dsc'))
}

const isReportSafe = (report: number[], strict: boolean) => {
  if (strict) {
    return isOrderedAndMatchingDifference(report)
  }

  if (isOrderedAndMatchingDifference(report)) {
    return true
  }

  const safeByRemovingOneItem = report.some((_, index) => {
    return isOrderedAndMatchingDifference(report.toSpliced(index, 1))
  })
  return safeByRemovingOneItem
}

const checkSafeReports = ({ strict }: { strict: boolean }) => {
  const safeReports = input.filter((rawReport) => {
    const report = rawReport.map((level) => Number(level))
    const isSafe = isReportSafe(report, strict)
    console.log(isSafe ? '✅' : '❌', JSON.stringify(report))
    return isSafe
  })

  return safeReports.length
}

const part1 = () => {
  const safeReports = checkSafeReports({ strict: true })
  console.log('Part 1: ', { safeReportsCount: safeReports })
}

const part2 = () => {
  const safeReports = checkSafeReports({ strict: false })
  console.log('Part 2: ', { safeReportsCount: safeReports })
}

part1()
part2()
