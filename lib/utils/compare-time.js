const { format, formatDistanceToNow, parseISO, compareAsc, subMonths, subYears } = require('date-fns')
const { zhCN } = require('date-fns/locale')

let oneMonthAgo = null; let oneYearAgo = null

function getOneYearAgo () {
  if (!oneYearAgo) {
    oneYearAgo = subYears(new Date(), 1)
  }
  return oneYearAgo
}

function getOneMonthAgo () {
  if (!oneMonthAgo) {
    oneMonthAgo = subMonths(new Date(), 1)
  }
  return oneMonthAgo
}

function getDistanceToNow (value, lang) {
  const locale = zhCN
  const date = parseISO(value)
  const resultYear = compareAsc(date, getOneYearAgo())
  if (resultYear === -1) {
    return format(date, 'Y MMM dd', {
      locale: locale
    })
  }
  const resultMonth = compareAsc(date, getOneMonthAgo())
  if (resultMonth === -1) {
    return format(date, 'MMM dd', {
      locale: locale
    })
  }
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale
  })
}

module.exports = {
  getDistanceToNow,
  getOneYearAgo,
  getOneMonthAgo
}
