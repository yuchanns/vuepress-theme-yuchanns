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
  if (format(new Date(), 'yyyy') === format(date, 'yyyy')) {
    return 0
  }

  return compareAsc(oneYearAgo, date)
}

function getDateToNow (date, lang) {
  const { format, formatDistanceToNow, compareAsc } = require('date-fns')
  const { zhCN, enUS } = require('date-fns/locale')
  let locale = enUS
  if (lang === 'zh-CN') {
    locale = zhCN
  }
  const resultYear = compareOneYearAgo(getOneYearAgo(), date)
  if (resultYear !== 0) {
    let result = format(date, 'yyyy MMM dd', {
      locale: locale
    })

    if (lang === 'zh-CN') {
      result = format(date, 'yyyy') + '年'
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

function getDistanceToNow (value, lang) {
  const { parseISO } = require('date-fns')
  const date = parseISO(value)
  return getDateToNow(date, lang)
}

function getDistanceToNowUnixNano (value, lang) {
  value = Math.floor(value / 1000)
  const { fromUnixTime } = require('date-fns')
  const date = fromUnixTime(value)
  return getDateToNow(date, lang)
}

module.exports = {
  getDistanceToNow,
  getOneYearAgo,
  getOneMonthAgo,
  compareOneYearAgo,
  getDistanceToNowUnixNano,
  getDateToNow
}
