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
  if (format(new Date(), 'YYYY') === format(date, 'YYYY')) {
    return 0
  }

  return compareAsc(oneYearAgo, date)
}

function getDateToNow (date, lang) {
  const { format, distanceInWordsToNow, compareAsc } = require('date-fns')
  let locale = require('date-fns/locale/en')
  if (lang === 'zh-CN') {
    locale = require('date-fns/locale/zh_cn')
  }
  const resultYear = compareOneYearAgo(getOneYearAgo(), date)
  if (resultYear !== 0) {
    let result = format(date, 'YYYY M DD', {
      locale: locale
    })

    if (lang === 'zh-CN') {
      result = format(date, 'YYYY') + '年'
      result += format(date, ' M') + '月'
      result += format(date, ' DD') + '日'
    }

    return result
  }

  const resultMonth = compareAsc(date, getOneMonthAgo())
  if (resultMonth === -1) {
    let result = format(date, 'M DD', {
      locale: locale
    })

    if (lang === 'zh-CN') {
      result = format(date, 'M') + '月'
      result += format(date, ' DD') + '日'
    }

    return result
  }
  return distanceInWordsToNow(date, {
    addSuffix: true,
    locale: locale
  })
}

function getDistanceToNow (value, lang) {
  return getDateToNow(value, lang)
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
