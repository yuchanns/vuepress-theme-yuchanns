let oneMonthAgo = null; let oneYearAgo = null

function getOneYearAgo () {
  if (!oneYearAgo) {
    const { subYears } = require('date-fns')
    oneYearAgo = subYears(new Date(), 1)
  }
  return oneYearAgo
}

function getOneMonthAgo () {
  if (!oneMonthAgo) {
    const { subMonths } = require('date-fns')
    oneMonthAgo = subMonths(new Date(), 1)
  }
  return oneMonthAgo
}

function compareOneYearAgo (oneYearAgo, date) {
  const { format, compareAsc } = require('date-fns')
  if (format(new Date(), 'Y') === format(date, 'Y')) {
    return 0
  }

  return compareAsc(oneYearAgo, date)
}

function getDistanceToNow (value, lang) {
  const { format, formatDistanceToNow, parseISO, compareAsc } = require('date-fns')
  const { zhCN, enUS } = require('date-fns/locale')
  let locale = enUS
  if (lang === 'zh-CN') {
    locale = zhCN
  }

  const date = parseISO(value)
  const resultYear = compareOneYearAgo(getOneYearAgo(), date)
  if (resultYear === -1) {
    let result = format(date, 'Y MMM dd', {
      locale: locale
    })

    if (lang === 'zh-CN') {
      result = format(date, 'Y') + '年'
      result += format(date, ' MM') + '月'
      result += format(date, ' dd') + '日'
    }

    return result
  }

  const resultMonth = compareAsc(date, getOneMonthAgo())
  if (resultMonth === -1) {
    let result = format(date, 'MMM dd', {
      locale: locale
    })

    if (lang === 'zh-CN') {
      result += '日'
    }

    return result
  }
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale
  })
}

module.exports = {
  getDistanceToNow,
  getOneYearAgo,
  getOneMonthAgo,
  compareOneYearAgo
}
