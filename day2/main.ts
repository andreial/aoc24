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

const areReportLevelsOrderedAndMatchingDifference = (report: number[]) => {
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

const isReportSafe = (report: number[]) => {
  if (areReportLevelsOrderedAndMatchingDifference(report)) {
    return true
  }

  const safeByRemovingOneItem = report.some((_, index) => {
    return areReportLevelsOrderedAndMatchingDifference(report.toSpliced(index, 1))
  })
  return safeByRemovingOneItem
}

const safeReports = input.filter((rawReport) => {
  const report = rawReport.map((level) => Number(level))
  const isSafe = isReportSafe(report)
  console.log(isSafe ? '✅' : '❌', JSON.stringify(report))
  return isSafe
})

console.log({ safeReportsCount: safeReports.length })
