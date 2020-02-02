function countUnicodeString (str) {
  let point
  let index
  let width = 0
  let len = 0
  for (index = 0; index < str.length;) {
    point = str.codePointAt(index)
    width = 0
    while (point) {
      width += 1
      point = point >> 8
    }
    index += Math.round(width / 2)
    len += 1
  }
  return len
}

function readingTime (text, options) {
  const words = countUnicodeString(text)

  options = options || {}

  options.wordsPerMinute = options.wordsPerMinute || 200

  const minutes = words / options.wordsPerMinute
  const time = minutes * 60 * 1000
  const displayed = Math.ceil(minutes.toFixed(2))

  return {
    text: displayed + ' min read',
    minutes: minutes,
    time: time,
    words: words
  }
}

module.exports = readingTime
